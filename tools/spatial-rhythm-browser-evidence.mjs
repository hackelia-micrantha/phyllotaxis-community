#!/usr/bin/env node
// SPACE-001 synthetic browser geometry evidence. Not a usability/a11y certification.
// No third-party modules, network access, or private implementation dependencies.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const VERSION = "0.1.0";
const DENSITIES = ["compact", "comfortable", "spacious"];
const WIDTHS = [320, 375, 768, 1280];
const SCHEMES = ["light", "dark"];
const WAIT_MS = 12000;
function parseArgs(args) {
  const config = { fixture: null, output: null, format: "text", version: false };
  while (args.length) {
    const key = args.shift();
    if (key === "--fixture" || key === "--output" || key === "--format") {
      if (!args.length || args[0].startsWith("--")) throw new Error("Missing value for " + key);
      config[key.slice(2)] = args.shift();
    } else if (key === "--version") config.version = true;
    else if (key === "--help" || key === "-h") {
      process.stdout.write("Usage: node tools/spatial-rhythm-browser-evidence.mjs --fixture PATH --output DIR [--format text|json] [--version]\n");
      process.exit(0);
    } else throw new Error("Unknown argument: " + key);
  }
  if (!["text", "json"].includes(config.format)) throw new Error("--format must be text or json");
  if (config.version) {
    process.stdout.write(config.format === "json" ? JSON.stringify({ harnessVersion: VERSION }) + "\n" : VERSION + "\n");
    process.exit(0);
  }
  if (!config.fixture || !config.output) throw new Error("--fixture and --output are required");
  return config;
}
const config = parseArgs(process.argv.slice(2));
const fixture = path.resolve(config.fixture);
const output = path.resolve(config.output);
let evidence = null;
const port = 9526;
const driver = spawn(process.env.CHROMEDRIVER_BIN || "chromedriver", ["--port=" + port], {
  stdio: ["ignore", "pipe", "pipe"],
});
let stderr = "", session = null;
for (const s of [driver.stderr, driver.stdout]) s.on("data", data => {
  stderr = (stderr + data.toString("utf8")).slice(-6000);
});
async function webdriver(method, route, body) {
  const response = await fetch("http://127.0.0.1:" + port + route, {
    method,
    headers: body === undefined ? {} : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(WAIT_MS),
  });
  const payload = await response.json();
  if (!response.ok || payload.value?.error) throw new Error(method + " " + route + ": " + JSON.stringify(payload.value).slice(0, 1200));
  return payload.value;
}
const cmd = (method, url, body) => webdriver(method, "/session/" + session + url, body);
const evaluate = (script) => cmd("POST", "/execute/sync", { script, args: [] });
const cdp = (command, params) => cmd("POST", "/goog/cdp/execute", { cmd: command, params });
const keyboard = async (value) => {
  await cmd("POST", "/actions", { actions: [{
    type: "key", id: "space-evidence-keyboard", actions: [
      { type: "keyDown", value }, { type: "keyUp", value },
    ],
  }] });
  await cmd("DELETE", "/actions");
};
const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function ready() {
  for (let i = 0; i < 60; i++) {
    if (driver.exitCode !== null) throw new Error("chromedriver exited: " + driver.exitCode);
    try { await webdriver("GET", "/status"); return; } catch { await pause(250); }
  }
  throw new Error("chromedriver not ready");
}
async function setEnvironment(width, scheme) {
  await cdp("Emulation.setDeviceMetricsOverride", {
    width, height: 900, deviceScaleFactor: 1, mobile: false,
  });
  await cdp("Emulation.setEmulatedMedia", {
    media: "screen", features: [
      { name: "prefers-color-scheme", value: scheme },
      { name: "prefers-reduced-motion", value: "reduce" },
    ],
  });
}
const geometryScript = function () {
  const find = (root, selector) => {
    const el = root.querySelector(selector);
    if (!el) throw new Error("Missing fixture element " + selector);
    return el;
  };
  const near = (v) => Math.round(v * 100) / 100;
  const rect = e => {
    const r = e.getBoundingClientRect();
    return { x: near(r.x), y: near(r.y), width: near(r.width), height: near(r.height), right: near(r.right) };
  };
  const root = document.documentElement;
  return {
    viewport: innerWidth,
    rootOverflow: Math.max(root.scrollWidth, document.body.scrollWidth) - innerWidth,
    samples: [...document.querySelectorAll("article[data-density]")].map(sample => {
      const c = getComputedStyle(sample);
      const sections = [...sample.querySelectorAll("section.spatial")];
      const first = sections[0], second = sections[1];
      const gap = second.getBoundingClientRect().top - first.getBoundingClientRect().bottom;
      const heading = find(first, "h3");
      const card = find(sample, ".tile");
      const paragraph = find(sample, ".reading p");
      const table = find(sample, "table");
      const firstCell = find(table, "td");
      const checkbox = find(sample, 'input[type="checkbox"]');
      return {
        density: sample.dataset.density,
        bounds: rect(sample),
        overflow: sample.scrollWidth - sample.clientWidth,
        sectionMargin: near(parseFloat(getComputedStyle(first).marginTop)),
        measuredSectionGap: near(gap),
        groupGap: near(parseFloat(getComputedStyle(heading).marginBottom)),
        cardPadding: near(parseFloat(getComputedStyle(card).paddingInlineStart)),
        paragraphGap: near(parseFloat(getComputedStyle(paragraph).marginBottom)),
        cellPadding: near(parseFloat(getComputedStyle(firstCell).paddingBlockStart)),
        checkbox: rect(checkbox),
        focusable: checkbox.tabIndex >= 0,
        visible: sample.getClientRects().length > 0,
      };
    }),
  };
};
const geometrySource = "return (" + geometryScript.toString() + ")();";
async function run() {
  const bytes = await readFile(fixture);
  const result = {
    schemaVersion: 1,
    harnessVersion: VERSION,
    sourceSha: process.env.EVIDENCE_SOURCE_SHA || null,
    fixture: path.relative(process.cwd(), fixture) || path.basename(fixture),
    fixtureBase: "process.cwd()",
    fixtureSha256: createHash("sha256").update(bytes).digest("hex"),
    browser: "chromium",
    observations: [],
    keyboard: null,
    stress: [],
    notAssessed: [
      "actual browser zoom",
      "actual operating-system text-only resize",
      "Safari/iOS and Firefox",
      "assistive technology",
      "visual preference / human hierarchy",
      "real Utility / Editorial consumer behavior",
    ],
  };
  evidence = result;
  await mkdir(output, { recursive: true });
  await ready();
  const resp = await webdriver("POST", "/session", {
    capabilities: { alwaysMatch: {
      browserName: "chrome",
      pageLoadStrategy: "normal",
      "goog:chromeOptions": {
        binary: process.env.CHROMIUM_BIN || "chromium",
        args: ["--headless=new", "--disable-gpu", "--disable-dev-shm-usage", "--no-sandbox"],
      },
    } },
  });
  session = resp.sessionId;
  assert.ok(session, "WebDriver session missing");
  result.browserName = resp.capabilities?.browserName || null;
  result.browserVersion = resp.capabilities?.browserVersion || null;
  const url = pathToFileURL(fixture).href;
  for (const scheme of SCHEMES) {
    for (const width of WIDTHS) {
      await setEnvironment(width, scheme);
      await cmd("POST", "/url", { url });
      const observation = await evaluate(geometrySource);
      const caseRecord = { width, scheme, ...observation, status: "unverified" };
      result.observations.push(caseRecord);
      assert.equal(observation.samples.length, 3, "three density specimens");
      assert.deepEqual(observation.samples.map(s => s.density), DENSITIES);
      for (const item of observation.samples) {
        assert.ok(item.visible && item.focusable, "visible, keyboard-focusable " + item.density);
        assert.ok(item.bounds.width > 0 && item.bounds.right <= width + 1, "sample fits width: " + width + " " + item.density);
        assert.ok(item.overflow <= 1, "sample overflows: " + width + " " + item.density);
        assert.ok(item.sectionMargin > 0 && item.cardPadding > 0, "measured spacing " + item.density);
      }
      assert.ok(observation.rootOverflow <= 1, "horizontal overflow " + width + "/" + scheme + ": " + observation.rootOverflow);
      for (const metric of ["sectionMargin", "groupGap", "cardPadding", "paragraphGap", "cellPadding"]) {
        const values = observation.samples.map(s => s[metric]);
        assert.ok(values[0] < values[1] && values[1] < values[2], "spacing not ordered for " + metric + ": " + values);
      }
      caseRecord.status = "pass";
      if (width === 320 || width === 1280) {
        const screenshot = await cmd("GET", "/screenshot");
        const name = "space-" + scheme + "-" + width + ".png";
        await writeFile(path.join(output, name), Buffer.from(screenshot, "base64"));
      }
    }
  }
  // Test native keyboard Tab path, not programmatic .focus() alone.
  await setEnvironment(375, "light");
  await cmd("POST", "/url", { url });
  await keyboard("\uE004");
  await keyboard("\uE004");
  const focused = await evaluate("const e=document.activeElement;const c=getComputedStyle(e);return {tag:e.tagName,type:e.type,outlineWidth:c.outlineWidth,outlineStyle:c.outlineStyle,focusVisible:e.matches(':focus-visible')};");
  result.keyboard = { ...focused, status: "unverified" };
  assert.equal(focused.type, "checkbox", "second keyboard Tab reaches checkbox");
  assert.equal(focused.focusVisible, true, "keyboard focus-visible style");
  assert.ok(parseFloat(focused.outlineWidth) >= 3, "focus outline");
  result.keyboard.status = "pass";
  // Explicitly simulated CSS scenarios; do not claim true zoom or text-only resizing.
  for (const kind of ["root-font-200-percent-simulated", "wcag-text-spacing-override-simulated"]) {
    await setEnvironment(320, "light");
    await cmd("POST", "/url", { url });
    if (kind === "root-font-200-percent-simulated") {
      await evaluate("document.documentElement.style.fontSize='200%'; return true;");
    } else {
      await evaluate("const s=document.createElement('style');s.textContent='* {line-height:1.5 !important;letter-spacing:.12em !important;word-spacing:.16em !important} p {margin-bottom:2em !important}';document.head.append(s);return true;");
    }
    const g = await evaluate(geometrySource);
    const overflow = g.rootOverflow > 1 || g.samples.some(s => s.overflow > 1 || s.bounds.right > 321);
    const offenders = overflow ? await evaluate("const w=innerWidth;return [...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.right>w+1||(e.scrollWidth-e.clientWidth)>1}).slice(0,16).map(e=>({tag:e.tagName,cls:e.className,id:e.id,right:Math.round(e.getBoundingClientRect().right),scrollWidth:e.scrollWidth,clientWidth:e.clientWidth}));") : [];
    result.stress.push({ kind, width: 320, scheme: "light", rootOverflow: g.rootOverflow, sampleOverflows: g.samples.map(s => ({density:s.density,overflow:s.overflow,right:s.bounds.right})), offenders, pass: !overflow });
  }
  await writeFile(path.join(output, "evidence.json"), JSON.stringify(result, null, 2) + "\n");
  assert.ok(result.stress.every(item => item.pass), "simulated text stress overflow: " + JSON.stringify(result.stress));
  if (config.format === "json") process.stdout.write(JSON.stringify({
    schemaVersion: result.schemaVersion, browser: result.browser,
    cases: result.observations.length, screenshots: 4, stress: result.stress, passed: true,
  }) + "\n");
  else process.stdout.write("SPACE-001: PASS " + result.observations.length + " geometry cases; 4 screenshots; keyboard focus and 2 simulated text stress cases\n");
}
try { await run(); }
catch (error) {
  // Persist even an early-failure or partial case. Never turn a failed/unsupported case into a pass.
  const report = evidence || { schemaVersion: 1, harnessVersion: VERSION, sourceSha: process.env.EVIDENCE_SOURCE_SHA || null,
    fixture: path.relative(process.cwd(), fixture) || path.basename(fixture), fixtureBase: "process.cwd()",
    browser: "chromium", observations: [], keyboard: null, stress: [], notAssessed: [] };
  report.status = "failed";
  report.failure = { message: String(error.message).slice(0, 1200) };
  report.expectedCases = WIDTHS.length * SCHEMES.length;
  report.notRunCases = Math.max(0, report.expectedCases - report.observations.length);
  for (const item of report.observations) if (item.status === "unverified") item.status = "fail";
  if (report.keyboard?.status === "unverified") report.keyboard.status = "fail";
  try {
    await mkdir(output, { recursive: true });
    await writeFile(path.join(output, "evidence.json"), JSON.stringify(report, null, 2) + "\n");
  } catch (writeError) { process.stderr.write("SPACE-001 failure report unavailable: " + writeError.message + "\n"); }
  process.stderr.write("SPACE-001 evidence FAILED: " + error.message + "\n" + stderr.slice(-3000) + "\n");
  process.exitCode = 1;
}
finally {
  if (session) { try { await cmd("DELETE", ""); } catch {} }
  driver.kill("SIGTERM");
}
