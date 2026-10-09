#!/usr/bin/env node
// Public gallery cross-browser visual and keyboard evidence.
// Screenshots are review artifacts, not human judgement or accessibility certification.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const flag = (name) => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : null; };
const site = flag("--site"), outDir = flag("--out");
if (!site || !outDir || args.length !== 4) {
  process.stderr.write("Usage: node tools/gallery-crossbrowser-review.mjs --site BUILT_SITE --out OUTPUT_DIR\n");
  process.exit(2);
}
await mkdir(outDir, { recursive: true });
const observations = [];
const screenshots = [];
const limitations = [
  "Screenshots alone are not independent human visual evaluation or task/affordance evidence.",
  "Chromium CDP viewport dimensions are CSS emulation, not real browser zoom or OS scaling.",
  "Firefox headless window minimum width may prevent 320/375px tests; mismatches are unsupported, not passes.",
  "Safari/iOS and actual assistive technology are not available in this runner.",
  "Firefox forced-colors and OS light/dark preference are not emulated; material-page native radio selection is tested instead."
];
const keyTab = String.fromCharCode(0xE004), keyRight = String.fromCharCode(0xE014), keyLeft = String.fromCharCode(0xE012);
const setName = (name) => name.replace(/[^a-z0-9_-]/gi, "-");
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function collect(browser, kind, scheme, width, actual, state, details = {}) {
  observations.push({ browser, kind, scheme, requestedWidth:width, observedWidth:actual,
    status:state, ...details });
}
async function run(browser, port) {
  const firefox = browser === "firefox";
  const driver = spawn(firefox ? process.env.GECKODRIVER_BIN || "geckodriver" : process.env.CHROMEDRIVER_BIN || "chromedriver",
    firefox ? ["--port", String(port), "--log", "error"] : ["--port=" + port], {stdio:["ignore","pipe","pipe"]});
  let driverLog = "";
  for (const stream of [driver.stdout,driver.stderr]) stream.on("data",data=>{
    driverLog = (driverLog+data.toString("utf8")).slice(-5000);
  });
  let session = null;
  async function http(method,route,body) {
    const response = await fetch("http://127.0.0.1:"+port+route,{
      method,headers:body===undefined?{}:{"content-type":"application/json"},
      body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(20000)
    });
    const json=await response.json();
    if (!response.ok || json.value?.error) throw Error(method+" "+route+": "+JSON.stringify(json.value).slice(0,800));
    return json.value;
  }
  const command = (method,route,body) => http(method,"/session/"+session+route,body);
  const evaluate = script => command("POST","/execute/sync",{script,args:[]});
  const navigate = url => command("POST","/url",{url});
  async function keyboard(value) {
    await command("POST","/actions",{actions:[{type:"key",id:"keys",actions:[
      {type:"keyDown",value},{type:"keyUp",value}]}]});
    await command("DELETE","/actions");
  }
  async function setViewport(width) {
    if(firefox) {
      await command("POST","/window/rect",{width,height:900});
    } else {
      await command("POST","/goog/cdp/execute",{cmd:"Emulation.setDeviceMetricsOverride",
        params:{width,height:900,deviceScaleFactor:1,mobile:false}});
    }
  }
  async function setScheme(mode) {
    if(firefox) return;
    await command("POST","/goog/cdp/execute",{cmd:"Emulation.setEmulatedMedia",
      params:{media:"screen",features:[
        {name:"prefers-color-scheme",value:mode},
        {name:"prefers-reduced-motion",value:"reduce"}]}});
  }
  async function screenshot(name) {
    const encoded=await command("GET","/screenshot");
    const filename=setName(name)+".png";
    await writeFile(path.join(outDir,filename),Buffer.from(encoded,"base64"));
    screenshots.push(filename);
  }
  async function basic(page, scheme, width) {
    const metrics=await evaluate(`
      const gallery=document.querySelector(".gallery");
      const cards=[...document.querySelectorAll(".gallery>.example")];
      const first=cards[0]?.getBoundingClientRect();
      const third=cards.at(-1)?.getBoundingClientRect();
      const last=getComputedStyle(document.documentElement);
      const body=getComputedStyle(document.body);
      return {width:innerWidth,scroll:document.documentElement.scrollWidth,
        rootBg:last.backgroundColor,bodyBg:body.backgroundColor,
        cardCount:cards.length,
        columns:gallery?getComputedStyle(gallery).gridTemplateColumns.split(" ").length:0,
        firstWidth:first?.width,thirdWidth:third?.width,firstLeft:first?.left,thirdLeft:third?.left,
        materialCards:document.querySelectorAll(".material-card").length,
        selected:[...document.querySelectorAll('.theme-switcher input:checked')].map(n=>n.id),
        scheme:last.colorScheme};
    `);
    const supported = Math.abs(metrics.width-width)<=2;
    let ok=metrics.scroll<=metrics.width+1 && metrics.rootBg===metrics.bodyBg;
    if(page==="gallery") {
      ok=ok && metrics.cardCount===3 &&
        metrics.columns===(width<672?1:2);
      if(width>=768) ok=ok && Math.abs(metrics.firstLeft-metrics.thirdLeft)<2
        && metrics.thirdWidth>=1.9*metrics.firstWidth;
    } else {
      ok=ok && metrics.materialCards===4 &&
        metrics.selected.length===1 &&
        (scheme==="system"||metrics.scheme===scheme);
    }
    await collect(browser,page,scheme,width,metrics.width,
      !supported?"unsupported":ok?"pass":"fail",{metrics});
    if(!supported) return false;
    if(!ok) throw Error(browser+" "+page+" "+scheme+" "+width+" failed "+JSON.stringify(metrics));
    await screenshot(browser+"-"+page+"-"+scheme+"-"+width);
    return true;
  }
  const main = pathToFileURL(path.join(path.resolve(site),"index.html")).href;
  const materials = pathToFileURL(path.join(path.resolve(site),"material-playground.html")).href;
  try {
    let ready=false;
    for(let i=0;i<80;i++){
      if(driver.exitCode!==null) throw Error("driver stopped "+driver.exitCode+" "+driverLog);
      try { await http("GET","/status");ready=true;break; }
      catch { await pause(250); }
    }
    if(!ready) throw Error("driver not ready "+driverLog);
    const payload=await http("POST","/session",{capabilities:{alwaysMatch:{
      browserName:firefox?"firefox":"chrome",pageLoadStrategy:"normal",
      ...(firefox?{"moz:firefoxOptions":{binary:process.env.FIREFOX_BIN||"firefox",args:["-headless"]}}:
        {"goog:chromeOptions":{binary:process.env.CHROMIUM_BIN||"chromium",
          args:["--headless=new","--disable-gpu","--disable-dev-shm-usage","--no-sandbox"]}})
    }}});
    session=payload.sessionId;
    assert.ok(session,"no webdriver session");
    // Gallery media emulation is available only in Chromium; never label Firefox system as dark.
    for(const mode of firefox?["system"]:["light","dark"]) {
      if(!firefox) await setScheme(mode);
      for(const width of [320,375,768,1280]){
        await setViewport(width);
        await navigate(main);
        await basic("gallery",mode,width);
      }
    }
    // Native radio controls allow explicit light/dark without OS emulation in Firefox.
    for(const mode of ["light","dark"]) {
      if(!firefox) await setScheme(mode);
      for(const width of [375,768,1280]) {
        await setViewport(width);
        await navigate(materials);
        await evaluate("document.getElementById('mode-"+mode+"').click();return true;");
        await basic("material",mode,width);
      }
    }
    // Test actual keyboard interaction. If narrow headless dimensions are clamped,
    // this remains valid for the browser's observed desktop viewport.
    await setViewport(1280);
    await navigate(materials);
    let focused=false;
    for(let i=0;i<20;i++){
      await keyboard(keyTab);
      const active=await evaluate("return {id:document.activeElement?.id,checked:document.activeElement?.checked,focusVisible:document.activeElement?.matches(':focus-visible')};");
      if(active.id==="mode-system") {focused=active.checked&&active.focusVisible;break;}
    }
    if(!focused) throw Error(browser+": Tab did not focus the checked system radio with visible focus");
    for(const [key,expect] of [[keyRight,"mode-light"],[keyRight,"mode-dark"],[keyLeft,"mode-light"]]){
      await keyboard(key);
      const state=await evaluate("return {id:document.activeElement?.id,checked:document.activeElement?.checked,focus:document.activeElement?.matches(':focus-visible'),scheme:getComputedStyle(document.documentElement).colorScheme};");
      if(state.id!==expect||!state.checked||!state.focus||
          state.scheme!==(expect==="mode-dark"?"dark":"light")) throw Error(browser+" keyboard "+JSON.stringify({expect,state}));
    }
    await collect(browser,"theme-keyboard","light",1280,1280,"pass",
      {note:"Real WebDriver Tab/ArrowRight/ArrowLeft checked state, focus-visible and CSS :has theme response"});
  } finally {
    if(session)try{await command("DELETE","");}catch{}
    driver.kill("SIGTERM");
  }
}
for(const [browser,port] of [["chromium",9526],["firefox",9527]]){
  try{await run(browser,port);}
  catch(err){observations.push({browser,status:"harness_error",message:String(err?.stack||err)});
    process.exitCode=1;}
}
const counts=Object.fromEntries(["pass","unsupported","fail","harness_error"].map(k=>[k,observations.filter(x=>x.status===k).length]));
const payload={schemaVersion:1,sourceCommit:process.env.GITHUB_SHA||"local-unpinned",
  status:"automated-gallery-evidence-not-human-evaluation",counts,limitations,observations,screenshots};
await writeFile(path.join(outDir,"manifest.json"),JSON.stringify(payload,null,2)+"\n");
await writeFile(path.join(outDir,"summary.md"),[
  "# Public gallery cross-browser evidence", "",
  "This is automated fixture evidence, not independent visual preference assessment or native browser zoom.",
  "Commit: "+payload.sourceCommit, "",
  ...Object.entries(counts).map(([k,v])=>"- "+k+": "+v),
  "- Captures: "+screenshots.length,"",
  "## Limitations",...limitations.map(x=>"- "+x),"",
  "See manifest.json for exact requested/observed widths and status of every check."
].join("\n")+"\n");
process.stdout.write("gallery crossbrowser: "+JSON.stringify({counts,captures:screenshots.length})+"\n");
if(counts.pass===0||counts.fail||counts.harness_error) process.exitCode=1;
