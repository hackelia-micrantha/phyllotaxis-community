#!/usr/bin/env node
// SPACE-001 consumer evidence: renders immutable, real public site sources offline.
// Browser results are observations, not design preference or WCAG certification.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SCHEMA = 1;
const SOURCE = [
  {
    name: "digitalis",
    repository: "hackelia-micrantha/digitalis-community",
    commit: "c03570962a89f5d77e37ff5e0a7b37a514f59a27",
    blobs: {
      "index.html": "81cae07682b6c5157d4482398af81218515c059f",
      "whitepaper.html": "90b5e664039f6f9c9198266f08b662beb054e7a1",
      "styles.css": "a77ed20f5c34b4102f09f139fb34d5a08453066e",
      "main.js": "0f8c54fe1be4b096ca45192584db172cdc42135a",
    },
  },
  {
    name: "envuscator",
    repository: "hackelia-micrantha/envuscator-community",
    commit: "54119ac6873bce47a47b12a1622c5c213934309b",
    blobs: {
      "index.html": "064afdd4bce52b3d653eaab4cf80a79f0f41d272",
      "styles.css": "35db6d023ac4f3bed57fdaa47362e3555dea1fc4",
      "micrantha.css": "d977278e563129ca1297f830e1aadcab17dca266",
    },
  },
];
const PAGES = [
  {
    id: "digitalis-status", source: "digitalis", html: "index.html",
    selector: "section.section",
    variants: {
      baseline: "",
      targeted: ".section { padding-top:calc(6.5rem + 1.5rem) !important; }",
      spacious: ".section { padding-top:calc(6.5rem + 3rem) !important; }",
    },
    category: "technical-status",
  },
  {
    id: "digitalis-whitepaper", source: "digitalis", html: "whitepaper.html",
    selector: "section.whitepaper-section",
    variants: {
      baseline: "",
      targeted: ".whitepaper-section { padding-top:calc(3.5rem + 1.5rem) !important; }",
      spacious: ".whitepaper-section { padding-top:calc(3.5rem + 3rem) !important; }",
    },
    category: "long-form-editorial",
  },
  {
    id: "envuscator-architecture", source: "envuscator", html: "index.html",
    selector: "section.section",
    variants: {
      baseline: "",
      targeted: ".section { padding-top:calc(clamp(4rem,8vw,7rem) + 1.5rem) !important; }",
      spacious: ".section { padding-top:calc(clamp(4rem,8vw,7rem) + 3rem) !important; }",
    },
    category: "technical-architecture",
  },
];
const WIDTHS = [320, 375, 768, 1280];
const args = process.argv.slice(2);
const flag = name => { const at=args.indexOf(name); return at<0?null:args[at+1]; };
if (args.length !== 4 || !flag("--output") || !/^[a-f0-9]{40}$/.test(flag("--source-sha")||"")) {
  process.stderr.write("Usage: node tools/spatial-consumer-evidence.mjs --output PATH --source-sha SHA\n");
  process.exit(2);
}
const output=path.resolve(flag("--output"));
const ownSha=flag("--source-sha");
const result={schemaVersion:SCHEMA,sourceCommit:ownSha,kind:"pinned-public-consumer-observation",
  sources:[],cases:[],screenshots:[],keyboard:[],stress:[],
  unsupported:[
    "Actual production hosting, site routing or CDN assets are not tested: immutable public HTML/CSS/JS files are rendered offline.",
    "Google Fonts remote imports are removed only from the offline evidence snapshot: system fallback fonts affect line wrapping. Exact source hashes are retained.",
    "Source sites do not advertise a full dark theme: emulated dark preference is observed and labeled unsupported if computed colors do not change.",
    "Synthetic CSS-injected spacing is a consumer-owned experiment, not a published Phyllotaxis Stack, theme or density API.",
    "Native browser zoom, OS text-only sizing, Safari/iOS and assistive-technology reading order are not verified.",
    "Screenshots and geometric measurements are not independent human usability assessment.",
  ],errors:[]};
const sha1GitBlob=bytes=>createHash("sha1").update("blob "+bytes.length+"\0").update(bytes).digest("hex");
const sha256=bytes=>createHash("sha256").update(bytes).digest("hex");
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function downloadSnapshots(root) {
  for (const site of SOURCE) {
    const dir=path.join(root,site.name);
    await mkdir(dir,{recursive:true});
    for (const [filename,hash] of Object.entries(site.blobs)) {
      const url="https://raw.githubusercontent.com/"+site.repository+"/"+site.commit+"/web/"+filename;
      const response=await fetch(url,{signal:AbortSignal.timeout(20000),redirect:"follow"});
      if (!response.ok) throw new Error("Pinned source unavailable: "+url+" HTTP "+response.status);
      const bytes=Buffer.from(await response.arrayBuffer());
      assert.equal(sha1GitBlob(bytes),hash,"Pinned Git blob identity: "+url);
      result.sources.push({repository:site.repository,commit:site.commit,
        path:"web/"+filename,blobSha1:hash,sha256:sha256(bytes),bytes:bytes.length,url});
      let copy=bytes;
      if (filename.endsWith(".html")) {
        // Suppress public remote fonts in offline browser without changing text or layout stylesheet.
        const text=bytes.toString("utf8");
        copy=Buffer.from(text.replace(/<link\b[^>]*(?:fonts\.googleapis\.com|fonts\.gstatic\.com)[^>]*>/gis,""));
        result.sources.at(-1).offlineTransform="Removed remote Google font link(s) only";
        result.sources.at(-1).offlineSha256=sha256(copy);
      }
      await writeFile(path.join(dir,filename),copy);
    }
  }
}

async function browser(kind,port,root) {
  const firefox=kind==="firefox";
  const executable=firefox?(process.env.GECKODRIVER_BIN||"geckodriver"):(process.env.CHROMEDRIVER_BIN||"chromedriver");
  const driver=spawn(executable,firefox?["--port",String(port),"--log","error"]:["--port="+port],
    {stdio:["ignore","pipe","pipe"]});
  let driverLog="",session=null;
  for(const stream of [driver.stdout,driver.stderr]) stream.on("data",bytes=>{
    driverLog=(driverLog+bytes.toString("utf8")).slice(-3000);
  });
  async function request(method,route,body) {
    const res=await fetch("http://127.0.0.1:"+port+route,{method,
      headers:body===undefined?{}:{"content-type":"application/json"},
      body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(20000)});
    const data=await res.json();
    if (!res.ok || data.value?.error) throw Error(method+" "+route+": "+JSON.stringify(data.value).slice(0,800));
    return data.value;
  }
  const cmd=(method,route,body)=>request(method,"/session/"+session+route,body);
  const evalJs=script=>cmd("POST","/execute/sync",{script,args:[]});
  const cdp=(command,params)=>cmd("POST","/goog/cdp/execute",{cmd:command,params});
  const resize=async width=>{
    if(firefox) await cmd("POST","/window/rect",{width,height:900});
    else await cdp("Emulation.setDeviceMetricsOverride",{width,height:900,deviceScaleFactor:1,mobile:false});
  };
  const mode=async scheme=>{
    if(!firefox) await cdp("Emulation.setEmulatedMedia",{media:"screen",features:[
      {name:"prefers-color-scheme",value:scheme},{name:"prefers-reduced-motion",value:"reduce"}]});
  };
  const scanScript=(selector)=>"const selector="+JSON.stringify(selector)+";"+
    "const els=[...document.querySelectorAll(selector)];"+
    "const root=document.documentElement;"+
    "const num=x=>Math.round(x*100)/100;"+
    "const rect=e=>e.getBoundingClientRect();"+
    "const peers=[...document.querySelectorAll('.card-grid,.summary-grid,.flow-grid,.paper-grid,.outcome-grid,.status-table')].slice(0,8).map(e=>({type:e.className,gap:getComputedStyle(e).gap,firstPadding:getComputedStyle(e.querySelector('article')||e).paddingTop}));"+
    "return {innerWidth,docWidth:Math.max(root.scrollWidth,document.body.scrollWidth),"+
    "docHeight:Math.max(root.scrollHeight,document.body.scrollHeight),"+
    "background:getComputedStyle(document.body).backgroundColor,"+
    "colorScheme:getComputedStyle(root).colorScheme,"+
    "targetCount:els.length,"+
    "targets:els.map(e=>({top:num(rect(e).top+scrollY),height:num(rect(e).height),"+
    "paddingTop:num(parseFloat(getComputedStyle(e).paddingTop))})),"+
    "peerStyles:peers};";
  const screenshots=async name=>{
    const b64=await cmd("GET","/screenshot");
    const filename=name.replace(/[^a-z0-9_-]/gi,"-")+".png";
    await writeFile(path.join(output,filename),Buffer.from(b64,"base64"));
    result.screenshots.push(filename);
  };
  let started=false;
  try {
    for(let attempt=0;attempt<70;attempt++){
      if(driver.exitCode!==null)throw Error(kind+" driver exited "+driverLog);
      try{await request("GET","/status");started=true;break;}catch{await pause(240);}
    }
    if(!started)throw Error(kind+" driver unavailable "+driverLog);
    const response=await request("POST","/session",{capabilities:{alwaysMatch:{
      browserName:firefox?"firefox":"chrome",pageLoadStrategy:"normal",
      ...(firefox?{"moz:firefoxOptions":{binary:process.env.FIREFOX_BIN||"firefox",args:["-headless"]}}:
        {"goog:chromeOptions":{binary:process.env.CHROMIUM_BIN||"chromium",
          args:["--headless=new","--disable-gpu","--disable-dev-shm-usage","--no-sandbox"]}})
    }}});
    session=response.sessionId;
    assert.ok(session,"missing WebDriver session");
    const browserVersion=response.capabilities?.browserVersion||null;
    const widths=firefox?[768,1280]:WIDTHS;
    const schemes=firefox?["system"]:["light","dark"];
    for(const page of PAGES){
      const dest=pathToFileURL(path.join(root,page.source,page.html)).href;
      for(const scheme of schemes){
        await mode(scheme);
        for(const width of widths){
          await resize(width);
          for(const [variant,css] of Object.entries(page.variants)){
            const record={page:page.id,category:page.category,source:page.source,
              browser:kind,browserVersion,schemeRequested:scheme,widthRequested:width,
              variant,status:"not-run"};
            result.cases.push(record);
            try {
              await cmd("POST","/url",{url:dest});
              if(css) {
                await evalJs("const style=document.createElement('style');style.id='space001-consumer-overlay';style.textContent="+JSON.stringify(css)+";document.head.append(style);return true;");
              }
              const data=await evalJs(scanScript(page.selector));
              Object.assign(record,{observedWidth:data.innerWidth,metrics:data});
              if(Math.abs(data.innerWidth-width)>2){
                record.status="unsupported";
                record.reason="Browser CSS viewport differs from requested width";
                continue;
              }
              if(data.targetCount<2)throw Error("Expected real repeated consumer sections");
              if(data.targets.some(item=>!Number.isFinite(item.paddingTop)||item.paddingTop<0))throw Error("Invalid computed section metrics");
              record.status="measured";
              if(!firefox && scheme==="light"){
                // Screenshots show real page content around the first target, not a synthetic duplicate.
                const first=data.targets[0].top;
                await evalJs("window.scrollTo({top:"+Math.max(0,Math.round(first-28))+",behavior:'instant'});return scrollY;");
                await pause(80);
                await screenshots(kind+"-"+page.id+"-"+variant+"-"+scheme+"-"+width);
              }
            } catch(error) {
              record.status="fail";
              record.error=String(error.message).slice(0,900);
            }
          }
        }
      }
      if(!firefox){
        // Actual WebDriver native Tab and focus-visible; record, do not infer WCAG certification.
        await mode("light");
        await resize(375);
        await cmd("POST","/url",{url:dest});
        await cmd("POST","/actions",{actions:[{type:"key",id:"tab",actions:[
          {type:"keyDown",value:"\uE004"},{type:"keyUp",value:"\uE004"}]}]});
        await cmd("DELETE","/actions");
        const active=await evalJs("const e=document.activeElement;return {tag:e?.tagName,href:e?.getAttribute('href'),focusVisible:e?.matches(':focus-visible'),outline:getComputedStyle(e).outlineStyle};");
        result.keyboard.push({page:page.id,browser:kind,observedWidth:375,...active});
      }
    }
  } finally {
    if(session)try{await cmd("DELETE","");}catch{}
    driver.kill("SIGTERM");
  }
}
function assess() {
  for(const page of PAGES) {
    const relevant=result.cases.filter(x=>x.page===page.id);
    for(const browser of ["chromium","firefox"]) {
      const group=relevant.filter(x=>x.browser===browser);
      for(const variant of ["targeted","spacious"]) {
        for(const changed of group.filter(x=>x.variant===variant&&x.status==="measured")) {
          const baseline=group.find(x=>x.variant==="baseline"&&x.widthRequested===changed.widthRequested&&x.schemeRequested===changed.schemeRequested);
          if(!baseline||baseline.status!=="measured")continue;
          const a=baseline.metrics,b=changed.metrics;
          const delta=b.targets.map((t,i)=>Math.round((t.paddingTop-a.targets[i].paddingTop)*100)/100);
          changed.comparison={baselinePageHeight:a.docHeight,deltaPageHeight:b.docHeight-a.docHeight,
            targetPaddingDeltas:delta,peerStyleUnchanged:JSON.stringify(a.peerStyles)===JSON.stringify(b.peerStyles),
            noNewHorizontalOverflow:b.docWidth<=Math.max(a.docWidth,b.innerWidth)+1};
          const pass=delta.every(x=>x>0)&&changed.comparison.peerStyleUnchanged&&changed.comparison.noNewHorizontalOverflow;
          if(!pass){changed.status="fail";changed.error="Consumer-only section delta/peer-preservation regression";}
          else changed.status="pass";
        }
      }
      for(const entry of group.filter(x=>x.variant==="baseline"&&x.status==="measured"))entry.status="pass";
    }
    const lights=relevant.filter(x=>x.browser==="chromium"&&x.schemeRequested==="light"&&x.variant==="baseline");
    const darks=relevant.filter(x=>x.browser==="chromium"&&x.schemeRequested==="dark"&&x.variant==="baseline");
    const observed=lights.some((x,i)=>x.metrics?.background!==darks[i]?.metrics?.background);
    result.unsupported.push(page.id+": "+(observed?"scheme background differs; explicit palette not certified":"no observable light/dark background change; dark-theme support not demonstrated"));
  }
}
const scratch=await mkdtemp(path.join(os.tmpdir(),"phyllotaxis-consumers-"));
try {
  await mkdir(output,{recursive:true});
  await downloadSnapshots(scratch);
  for(const [kind,port] of [["chromium",9562],["firefox",9563]]) {
    try{await browser(kind,port,scratch);}catch(error){
      result.errors.push({browser:kind,message:String(error.stack||error).slice(0,2500)});
    }
  }
  assess();
} catch(error){result.errors.push({phase:"setup",message:String(error.stack||error).slice(0,2500)});}
finally {await rm(scratch,{recursive:true,force:true});}
const counts=Object.fromEntries(["pass","measured","fail","unsupported","not-run"].map(status=>[status,result.cases.filter(x=>x.status===status).length]));
result.counts=counts;
result.status=result.errors.length||counts.fail||counts["not-run"]?"failed":"bounded-observation";
await writeFile(path.join(output,"manifest.json"),JSON.stringify(result,null,2)+"\n");
await writeFile(path.join(output,"summary.md"),[
  "# SPACE-001 — pinned public consumer layout experiment","",
  "Public experiment source commit: "+ownSha,"",
  "Distinct repositories: "+SOURCE.map(s=>s.repository+" at "+s.commit).join("; "),"",
  "Observed categories: status/technical architecture and long-form whitepaper. These are consumer web sources, **not** Phyllotaxis package integrations.","",
  ...Object.entries(counts).map(([k,v])=>"- "+k+": "+v),
  "- screenshots: "+result.screenshots.length,
  "- errors: "+result.errors.length,"",
  "## Boundaries",...result.unsupported.map(x=>"- "+x),"",
  "See manifest.json for pinned file hashes and case-level metrics. No judgement of optimal spacing or RFC adoption is made by this script."
].join("\n")+"\n");
process.stdout.write("SPACE-001 public consumer evidence: "+JSON.stringify({counts,screenshots:result.screenshots.length,errors:result.errors.length})+"\n");
if(result.status==="failed"||counts.pass===0)process.exitCode=1;
