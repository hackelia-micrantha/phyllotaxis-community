#!/usr/bin/env node
// TEXT-001 authored-markup browser evidence. No application runtime, model or external resources.
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {spawn} from "node:child_process";
import {mkdir,readFile,writeFile} from "node:fs/promises";
import path from "node:path";
import {pathToFileURL} from "node:url";

const args=process.argv.slice(2),get=n=>{const i=args.indexOf(n);return i<0?null:args[i+1];};
if(args.includes("--help")){process.stdout.write("Usage: node tools/text-rhythm-browser-evidence.mjs --fixture HTML --output DIR\n");process.exit(0);}
const fixture=get("--fixture"), output=get("--output");
if(!fixture||!output||args.length!==4){process.stderr.write("Required --fixture HTML --output DIR\n");process.exit(2);}
const file=path.resolve(fixture),out=path.resolve(output),port=9636;
const report={schemaVersion:1,sourceSha:process.env.EVIDENCE_SOURCE_SHA||null,fixture:path.relative(process.cwd(),file),
  browser:"chromium",cases:[],stress:[],screenshots:[],limitations:[
    "CDP viewport emulation is not browser zoom",
    "CSS-simulated text stress is not operating-system text resize",
    "Geometry/screenshot evidence is not human editorial review or accessibility certification",
    "Assistive technology, Firefox, Safari and iOS not assessed",
    "No AI inference or semantic-placement accuracy assessed"
  ]};
let driver=null,session=null;
async function request(method,route,data){
  const r=await fetch("http://127.0.0.1:"+port+route,{method,
    headers:data===undefined?{}:{"content-type":"application/json"},
    body:data===undefined?undefined:JSON.stringify(data),signal:AbortSignal.timeout(15000)});
  const j=await r.json();if(!r.ok||j.value?.error)throw Error(method+" "+route+": "+JSON.stringify(j.value).slice(0,500));return j.value;
}
const cmd=(method,route,data)=>request(method,"/session/"+session+route,data);
const evaluate=script=>cmd("POST","/execute/sync",{script,args:[]});
const cdp=(command,params)=>cmd("POST","/goog/cdp/execute",{cmd:command,params});
const sleep=ms=>new Promise(done=>setTimeout(done,ms));
async function environment(width,scheme){
  await cdp("Emulation.setDeviceMetricsOverride",{width,height:900,deviceScaleFactor:1,mobile:false});
  await cdp("Emulation.setEmulatedMedia",{media:"screen",features:[{name:"prefers-color-scheme",value:scheme}]});
}
function geometry(){
  const rect=e=>{const r=e.getBoundingClientRect();return {right:r.right,width:r.width};};
  return {viewport:innerWidth,overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth,
    surfaces:[...document.querySelectorAll("section[data-fixture-profile][data-fixture-scheme]")].map(e=>({
      profile:e.dataset.fixtureProfile,scheme:e.dataset.fixtureScheme,colorScheme:getComputedStyle(e).colorScheme,bounds:rect(e)})),
    specimens:[...document.querySelectorAll("article[data-document][data-variant]")].map(e=>{
      const glyph=e.querySelectorAll(".ornament-glyph");
      return {profile:e.dataset.document,variant:e.dataset.variant,bounds:rect(e),
        overflow:e.scrollWidth-e.clientWidth,hr:e.querySelectorAll("hr").length,glyph:glyph.length,
        glyphHidden:glyph[0]?.getAttribute("aria-hidden")||null};
    })
  };
}
const geometrySource="return ("+geometry.toString()+")();";
async function save(){await mkdir(out,{recursive:true});await writeFile(path.join(out,"evidence.json"),JSON.stringify(report,null,2)+"\n");}
try{
  const bytes=await readFile(file);report.fixtureSha256=createHash("sha256").update(bytes).digest("hex");
  await mkdir(out,{recursive:true});
  driver=spawn(process.env.CHROMEDRIVER_BIN||"chromedriver",["--port="+port],{stdio:"ignore"});
  let ready=false;for(let i=0;i<60;i++){try{await request("GET","/status");ready=true;break;}catch{if(driver.exitCode!==null)throw Error("Driver exited");await sleep(250);}}
  assert.ok(ready,"Driver not ready");
  const sess=await request("POST","/session",{capabilities:{alwaysMatch:{browserName:"chrome",pageLoadStrategy:"normal",
    "goog:chromeOptions":{binary:process.env.CHROMIUM_BIN||"chromium",args:["--headless=new","--no-sandbox","--disable-dev-shm-usage","--disable-gpu"]}}}});
  session=sess.sessionId;assert.ok(session);report.browserVersion=sess.capabilities?.browserVersion||null;
  const url=pathToFileURL(file).href;
  for(const scheme of ["light","dark"])for(const width of [320,375,768,1280]){
    await environment(width,scheme);await cmd("POST","/url",{url});
    const m=await evaluate(geometrySource),caseRecord={width,scheme,measurements:m,status:"failed"};
    report.cases.push(caseRecord);
    assert.equal(m.surfaces.length,4);assert.equal(m.specimens.length,16);
    assert.ok(m.overflow<=1,"Document overflow at "+width+"/"+scheme);
    assert.deepEqual(m.surfaces.map(s=>s.profile+":"+s.scheme),["utility:light","utility:dark","editorial:light","editorial:dark"]);
    for(const s of m.surfaces){assert.equal(s.colorScheme,s.scheme);assert.ok(s.bounds.right<=width+1);}
    for(const p of ["utility","editorial"])for(const v of ["continuous","transition","thematic","ornament"]){
      const matches=m.specimens.filter(s=>s.profile===p&&s.variant===v);
      assert.equal(matches.length,2,"Two scheme samples for "+p+"/"+v);
      for(const s of matches){
        assert.ok(s.bounds.width>0&&s.bounds.right<=width+1&&s.overflow<=1,"Specimen overflow "+p+"/"+v+"/"+width);
        assert.equal(s.hr,v==="thematic"||v==="ornament"?1:0);
        assert.equal(s.glyph,v==="ornament"?1:0);
        if(s.glyph)assert.equal(s.glyphHidden,"true");
      }
    }
    caseRecord.status="pass";
    if(width===320||width===1280){
      const name="text-"+scheme+"-"+width+".png";
      await writeFile(path.join(out,name),Buffer.from(await cmd("GET","/screenshot"),"base64"));
      report.screenshots.push(name);
    }
  }
  for(const kind of ["root-200-percent-simulated","wcag-text-spacing-simulated"]){
    await environment(320,"light");await cmd("POST","/url",{url});
    if(kind.startsWith("root-"))await evaluate("document.documentElement.style.fontSize='200%';return true;");
    else await evaluate("const s=document.createElement('style');s.textContent='*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important} p{margin-bottom:2em!important}';document.head.append(s);return true;");
    const m=await evaluate(geometrySource),pass=m.overflow<=1&&m.specimens.every(s=>s.overflow<=1&&s.bounds.right<=321);
    const offenders=pass?[]:await evaluate("const w=innerWidth;return [...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.right>w+1||(e.scrollWidth-e.clientWidth)>1}).slice(0,24).map(e=>({tag:e.tagName,cls:String(e.className).slice(0,80),id:e.id,right:Math.round(e.getBoundingClientRect().right),scrollWidth:e.scrollWidth,clientWidth:e.clientWidth}));");
    report.stress.push({kind,width:320,rootOverflow:m.overflow,pass,offenders});
    assert.ok(pass,"Overflow in "+kind);
  }
  report.status="passed";await save();
  process.stdout.write("TEXT-001 browser evidence PASS: 8 viewport/scheme cases, 2 simulated text stress cases, 4 screenshots\n");
}catch(err){
  report.status="failed";report.failure=String(err.message).slice(0,1000);
  report.notRunCases=Math.max(0,8-report.cases.length);
  try{await save();}catch(e){process.stderr.write("Failure report unavailable: "+e.message+"\n");}
  process.stderr.write("TEXT-001 browser evidence FAILED: "+err.message+"\n");process.exitCode=1;
}finally{
  if(session)try{await cmd("DELETE","");}catch{}
  if(driver)driver.kill("SIGTERM");
}
