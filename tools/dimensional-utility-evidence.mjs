#!/usr/bin/env node

import { spawn } from "node:child_process";
import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { captureWithVerifiedRetry } from "./screenshot-retry.mjs";
import zlib from "node:zlib";

const ELEMENT_KEY = "element-6066-11e4-a52e-4f735466cecf";
const CONTROL = "\uE009";
const TAB = "\uE004";
const HARNESS_VERSION = "0.3.0";

function parseArgs(argv) {
  const parsed = {
    fixture: null,
    output: null,
    format: "text",
    version: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--fixture") {
      parsed.fixture = argv[++index];
    } else if (arg === "--output") {
      parsed.output = argv[++index];
    } else if (arg === "--format") {
      parsed.format = argv[++index];
      if (!["text", "json"].includes(parsed.format)) {
        throw new Error("--format must be text or json");
      }
    } else if (arg === "--version") {
      parsed.version = true;
    } else if (arg === "--help" || arg === "-h") {
      process.stdout.write(
        "Usage: node tools/dimensional-utility-evidence.mjs [--fixture PATH] [--output DIR] [--format text|json] [--version]\n",
      );
      process.exit(0);
    } else {
      throw new Error("Unknown argument: " + arg);
    }
  }
  if (parsed.version) {
    process.stdout.write(parsed.format === "json" ? JSON.stringify({ harnessVersion: HARNESS_VERSION }) + "\n" : HARNESS_VERSION + "\n");
    process.exit(0);
  }
  return parsed;
}

function gitBlobSha(bytes) {
  const prefix = Buffer.from("blob " + bytes.length + "\0");
  return crypto.createHash("sha1").update(prefix).update(bytes).digest("hex");
}

function sha256(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function bytes(value) {
  return Buffer.byteLength(value, "utf8");
}

function median(values) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function summarize(values) {
  const finite = values.filter((value) => Number.isFinite(value));
  if (finite.length === 0) {
    return { count: 0, min: null, median: null, max: null };
  }
  return {
    count: finite.length,
    min: Math.min(...finite),
    median: median(finite),
    max: Math.max(...finite),
  };
}

function parseColor(value) {
  const trimmed = String(value || "").trim().toLowerCase();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(trimmed);
  if (hex) {
    let raw = hex[1];
    if (raw.length === 3) {
      raw = raw
        .split("")
        .map((channel) => channel + channel)
        .join("");
    }
    return [
      Number.parseInt(raw.slice(0, 2), 16),
      Number.parseInt(raw.slice(2, 4), 16),
      Number.parseInt(raw.slice(4, 6), 16),
    ];
  }
  const rgb = /^rgba?\(\s*([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)/i.exec(trimmed);
  if (rgb) {
    return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  }
  throw new Error("Unsupported color value: " + value);
}

function relativeLuminance(value) {
  const channels = parseColor(value).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(a, b) {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const bright = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (bright + 0.05) / (dark + 0.05);
}

function result(name, status, detail, authority = "harness") {
  return { name, status, detail, authority };
}

async function webdriver(port, method, endpoint, body) {
  const response = await fetch("http://127.0.0.1:" + port + endpoint, {
    method,
    headers: body === undefined ? {} : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const raw = await response.text();
  let data = {};
  if (raw) {
    data = JSON.parse(raw);
  }
  if (!response.ok || (data.value && data.value.error)) {
    throw new Error(
      method + " " + endpoint + " failed: " + response.status + " " + raw.slice(0, 1200),
    );
  }
  return data.value === undefined ? data : data.value;
}

async function waitForDriver(port, child) {
  let lastError = null;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (child.exitCode !== null) {
      throw new Error("WebDriver exited before becoming ready with code " + child.exitCode);
    }
    try {
      await webdriver(port, "GET", "/status");
      return;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  throw lastError || new Error("WebDriver did not become ready");
}

function driverConfig(browser) {
  if (browser === "chromium") {
    return {
      browser,
      port: 9515,
      driver: process.env.CHROMEDRIVER_BIN || "chromedriver",
      driverArgs: ["--port=9515"],
      binary: process.env.CHROMIUM_BIN || "chromium",
    };
  }
  return {
    browser,
    port: 4444,
    driver: process.env.GECKODRIVER_BIN || "geckodriver",
    driverArgs: ["--host", "127.0.0.1", "--port", "4444"],
    binary: process.env.FIREFOX_BIN || "firefox",
  };
}

async function withDriver(browser, callback) {
  const config = driverConfig(browser);
  const child = spawn(config.driver, config.driverArgs, {
    stdio: ["ignore", "pipe", "pipe"],
    env: process.env,
  });
  let log = "";
  const capture = (chunk) => {
    log = (log + chunk.toString("utf8")).slice(-20000);
  };
  child.stdout.on("data", capture);
  child.stderr.on("data", capture);
  try {
    await waitForDriver(config.port, child);
    return await callback(config);
  } catch (error) {
    error.message += "\nDriver log tail:\n" + log;
    throw error;
  } finally {
    child.kill("SIGTERM");
    await new Promise((resolve) => {
      const timer = setTimeout(resolve, 1000);
      child.once("exit", () => {
        clearTimeout(timer);
        resolve();
      });
    });
    if (child.exitCode === null) child.kill("SIGKILL");
  }
}

function firefoxPrefs(scheme) {
  return {
    "layout.css.prefers-color-scheme.content-override": scheme === "dark" ? 0 : 1,
    "browser.startup.homepage": "about:blank",
  };
}

async function createSession(config, scheme) {
  let alwaysMatch;
  if (config.browser === "chromium") {
    alwaysMatch = {
      browserName: "chrome",
      pageLoadStrategy: "normal",
      "goog:chromeOptions": {
        binary: config.binary,
        args: [
          "--headless=new",
          "--disable-gpu",
          "--disable-dev-shm-usage",
          "--no-sandbox",
          "--window-size=1280,900",
        ],
      },
    };
  } else {
    alwaysMatch = {
      browserName: "firefox",
      pageLoadStrategy: "normal",
      "moz:firefoxOptions": {
        binary: config.binary,
        args: ["-headless"],
        prefs: firefoxPrefs(scheme),
      },
    };
  }
  const value = await webdriver(config.port, "POST", "/session", {
    capabilities: { alwaysMatch },
  });
  const sessionId = value.sessionId || value.value?.sessionId;
  const capabilities = value.capabilities || value.value?.capabilities || {};
  if (!sessionId) {
    throw new Error("WebDriver did not return a session id");
  }
  return { sessionId, capabilities };
}

async function closeSession(config, sessionId) {
  try {
    await webdriver(config.port, "DELETE", "/session/" + sessionId);
  } catch {
    // Session cleanup is best effort after evidence is captured.
  }
}

async function command(config, sessionId, method, suffix, body) {
  return webdriver(config.port, method, "/session/" + sessionId + suffix, body);
}

async function evaluate(config, sessionId, script, args = []) {
  return command(config, sessionId, "POST", "/execute/sync", { script, args });
}

async function setMedia(config, sessionId, features) {
  if (config.browser !== "chromium") return false;
  try {
    await command(config, sessionId, "POST", "/goog/cdp/execute", {
      cmd: "Emulation.setEmulatedMedia",
      params: { media: "", features },
    });
    return true;
  } catch {
    return false;
  }
}

async function navigate(config, sessionId, url) {
  await command(config, sessionId, "POST", "/url", { url });
}

async function setWindow(config, sessionId, width, height) {
  await command(config, sessionId, "POST", "/window/rect", {
    x: 0,
    y: 0,
    width,
    height,
  });
}

async function screenshot(config, sessionId, filename, expectedUrl, captureEvents) {
  const evidence = {
    browser: config.browser, image: path.basename(filename), attempts: [], status: "pending",
  };
  captureEvents.push(evidence);
  try {
    const encoded = await captureWithVerifiedRetry({
      expectedUrl,
      getPageState: () => evaluate(config, sessionId,
        "return {href: location.href, readyState: document.readyState, timeOrigin: performance.timeOrigin};"),
      allowDetachRetry: config.browser === "chromium",
      capture: () => command(config, sessionId, "GET", "/screenshot"),
      onAttempt: record => evidence.attempts.push(record),
      pause: () => new Promise(resolve => setTimeout(resolve, 150)),
    });
    await fs.writeFile(filename, Buffer.from(encoded, "base64"));
    evidence.status = "pass";
  } catch (error) {
    evidence.status = "fail";
    throw error;
  }
}

async function pressTab(config, sessionId) {
  await command(config, sessionId, "POST", "/actions", {
    actions: [
      {
        type: "key",
        id: "keyboard",
        actions: [
          { type: "keyDown", value: TAB },
          { type: "keyUp", value: TAB },
        ],
      },
    ],
  });
  await command(config, sessionId, "DELETE", "/actions");
}

async function attemptBrowserZoom(config, sessionId) {
  const before = await evaluate(
    config,
    sessionId,
    "return {dpr: window.devicePixelRatio, width: window.innerWidth, scale: window.visualViewport ? window.visualViewport.scale : null};",
  );
  let after = { ...before, overflow: false };
  let observedFactor = 1;
  let changed = false;

  try {
    for (let step = 0; step < 8; step += 1) {
      await command(config, sessionId, "POST", "/actions", {
        actions: [
          {
            type: "key",
            id: "zoom-keyboard",
            actions: [
              { type: "keyDown", value: CONTROL },
              { type: "keyDown", value: "+" },
              { type: "keyUp", value: "+" },
              { type: "keyUp", value: CONTROL },
            ],
          },
        ],
      });
      await command(config, sessionId, "DELETE", "/actions");
      await new Promise((resolve) => setTimeout(resolve, 100));
      after = await evaluate(
        config,
        sessionId,
        "return {dpr: window.devicePixelRatio, width: window.innerWidth, scale: window.visualViewport ? window.visualViewport.scale : null, overflow: document.documentElement.scrollWidth > window.innerWidth + 1};",
      );

      const factors = [];
      if (before.width && after.width) factors.push(before.width / after.width);
      if (before.dpr && after.dpr) factors.push(after.dpr / before.dpr);
      if (before.scale && after.scale) factors.push(after.scale / before.scale);
      observedFactor = Math.max(...factors.filter(Number.isFinite), 1);
      if (Math.abs(observedFactor - 1) >= 0.05) changed = true;
      if (observedFactor >= 1.9) break;
    }
  } catch (error) {
    return {
      status: "unsupported",
      detail: "WebDriver keyboard zoom action failed: " + error.message.split("\n")[0],
      before,
      after: null,
      observedFactor: null,
    };
  } finally {
    try {
      await command(config, sessionId, "POST", "/actions", {
        actions: [
          {
            type: "key",
            id: "zoom-reset",
            actions: [
              { type: "keyDown", value: CONTROL },
              { type: "keyDown", value: "0" },
              { type: "keyUp", value: "0" },
              { type: "keyUp", value: CONTROL },
            ],
          },
        ],
      });
      await command(config, sessionId, "DELETE", "/actions");
    } catch {
      // Session will be discarded after this evidence pass.
    }
  }

  if (!changed) {
    return {
      status: "unsupported",
      detail:
        "Headless WebDriver did not expose a browser-level zoom change; this remains an explicit evidence gap.",
      before,
      after,
      observedFactor,
    };
  }

  const targetReached = observedFactor >= 1.9 && observedFactor <= 2.1;
  if (!targetReached) {
    return {
      status: "fail",
      detail: "Browser zoom changed but did not reach approximately 200%.",
      before,
      after,
      observedFactor,
    };
  }

  return {
    status: after.overflow ? "fail" : "pass",
    detail:
      "Observed browser zoom factor is approximately 200%; overflow=" + after.overflow,
    before,
    after,
    observedFactor,
  };
}

async function findElement(config, sessionId, selector) {
  const value = await command(config, sessionId, "POST", "/element", {
    using: "css selector",
    value: selector,
  });
  return value[ELEMENT_KEY];
}

async function hoverElement(config, sessionId, selector) {
  try {
    const element = await findElement(config, sessionId, selector);
    await command(config, sessionId, "POST", "/actions", {
      actions: [
        {
          type: "pointer",
          id: "mouse",
          parameters: { pointerType: "mouse" },
          actions: [
            {
              type: "pointerMove",
              duration: 0,
              origin: { [ELEMENT_KEY]: element },
              x: 0,
              y: 0,
            },
          ],
        },
      ],
    });
    const hovered = await evaluate(
      config,
      sessionId,
      "return document.querySelector(arguments[0]).matches(':hover');",
      [selector],
    );
    await command(config, sessionId, "DELETE", "/actions");
    return hovered
      ? { status: "pass", detail: selector + " receives a real pointer hover state" }
      : { status: "unsupported", detail: "Driver did not expose :hover for " + selector };
  } catch (error) {
    return {
      status: "unsupported",
      detail: "Pointer hover unavailable: " + error.message.split("\n")[0],
    };
  }
}

async function clickButton(config, sessionId, fixtureUrl) {
  await navigate(config, sessionId, fixtureUrl);
  const element = await findElement(config, sessionId, ".flat button");
  await command(config, sessionId, "POST", "/element/" + element + "/click", {});
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const current = await command(config, sessionId, "GET", "/url");
    if (String(current).endsWith("#reference")) return true;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return false;
}

async function focusSequence(config, sessionId, fixtureUrl) {
  await navigate(config, sessionId, fixtureUrl);
  await evaluate(
    config,
    sessionId,
    "if (document.activeElement && document.activeElement.blur) document.activeElement.blur();",
  );

  const expected = [];
  for (let fixture = 0; fixture < 6; fixture += 1) {
    expected.push(
      { fixture: "f" + fixture, tag: "A", text: "Documentation" },
      { fixture: "f" + fixture, tag: "BUTTON", text: "Inspect" },
    );
  }

  const sequence = [];
  for (let index = 0; index < expected.length; index += 1) {
    await pressTab(config, sessionId);
    sequence.push(
      await evaluate(
        config,
        sessionId,
        "var e=document.activeElement;var f=e?e.closest('.fixture'):null;var st=e?getComputedStyle(e):null;return {tag:e?e.tagName:null,id:e?e.id:null,text:e?e.textContent.trim():null,fixture:f?f.getAttribute('aria-labelledby'):null,focusIndicator:e?{visible:e.matches(':focus-visible'),style:st.outlineStyle,width:st.outlineWidth,color:st.outlineColor}:null};",
      ),
    );
  }

  const valid =
    sequence.length === expected.length &&
    sequence.every((entry, index) => {
      const wanted = expected[index];
      return (
        entry &&
        entry.fixture === wanted.fixture &&
        entry.tag === wanted.tag &&
        entry.text === wanted.text
      );
    });

  return { valid, expected, sequence };
}

async function inspectGlossPressed(config, sessionId, fixtureUrl) {
  await navigate(config, sessionId, fixtureUrl);
  const selector = ".gloss button";
  const style = "var e=document.querySelector(arguments[0]);var s=getComputedStyle(e);return {active:e.matches(':active'),background:s.backgroundImage,shadow:s.boxShadow,borderStyle:s.borderTopStyle};";
  const resting = await evaluate(config, sessionId, style, [selector]);
  try {
    const element = await findElement(config, sessionId, selector);
    await command(config, sessionId, "POST", "/actions", {
      actions: [{
        type: "pointer", id: "gloss-pointer", parameters: { pointerType: "mouse" },
        actions: [
          { type: "pointerMove", duration: 0, origin: { [ELEMENT_KEY]: element }, x: 0, y: 0 },
          { type: "pointerDown", button: 0 },
        ],
      }],
    });
    const pressed = await evaluate(config, sessionId, style, [selector]);
    return {
      status: pressed.active &&
        (pressed.background !== resting.background || pressed.shadow !== resting.shadow)
        ? "pass" : "fail",
      resting,
      pressed,
    };
  } catch (error) {
    return { status: "unsupported", detail: error.message.split("\n")[0], resting };
  } finally {
    try {
      await command(config, sessionId, "DELETE", "/actions");
    } catch {
      // Driver is discarded after this scheme, and no input state is retained.
    }
  }
}

async function inspectPage(config, sessionId) {
  return evaluate(
    config,
    sessionId,
    "return (() => {" +
      "const fixtures=[...document.querySelectorAll('.fixture')];" +
      "const style=(el)=>{const s=getComputedStyle(el);return {background:s.backgroundColor,backgroundImage:s.backgroundImage,borderRadius:s.borderRadius,boxShadow:s.boxShadow,transform:s.transform,transition:s.transition,cursor:s.cursor,borderInlineStartWidth:s.borderInlineStartWidth};};" +
      "const signature=(el)=>[...el.children].map((child)=>child.tagName);" +
      "const vars={}; ['paper','ink','muted','line','accent','focus','raised','tint','well'].forEach((name)=>vars[name]=getComputedStyle(document.documentElement).getPropertyValue('--'+name).trim());" +
      "return {" +
        "viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio}," +
        "overflow:document.documentElement.scrollWidth>innerWidth+1," +
        "scheme:{dark:matchMedia('(prefers-color-scheme: dark)').matches,light:matchMedia('(prefers-color-scheme: light)').matches}," +
        "scriptCount:document.scripts.length," +
        "resourceCount:performance.getEntriesByType('resource').length," +
        "fixtureCount:fixtures.length," +
        "signatures:fixtures.map(signature)," +
        "styles:Object.fromEntries(fixtures.map((el)=>[el.id,style(el)]))," +
        "flat:{section:style(document.querySelector('.flat')),status:style(document.querySelector('.flat .status')),button:style(document.querySelector('.flat button'))}," +
        "tinted:style(document.querySelector('.tinted'))," +
        "raised:style(document.querySelector('.raised'))," +
        "glossButton:style(document.querySelector('.gloss button'))," +
        "insetWell:style(document.querySelector('.inset .well'))," +
        "accentHeading:style(document.querySelector('.accent h2'))," +
        "vars" +
      "};" +
    "})()",
  );
}

async function noCssSemantics(config, sessionId, fixtureUrl) {
  await navigate(config, sessionId, fixtureUrl);
  return evaluate(
    config,
    sessionId,
    "document.querySelectorAll('style,link[rel=stylesheet]').forEach((node)=>node.remove());" +
      "return {sections:document.querySelectorAll('.fixture').length,links:document.querySelectorAll('.fixture a').length,buttons:document.querySelectorAll('.fixture button').length,heading:document.querySelector('h1').textContent.trim(),text:document.body.innerText.slice(0,2000)};",
  );
}

async function performanceSamples(config, sessionId, fixtureUrl) {
  const nav = [];
  const fcp = [];
  for (let index = 0; index < 3; index += 1) {
    await navigate(config, sessionId, fixtureUrl);
    const sample = await evaluate(
      config,
      sessionId,
      "var n=performance.getEntriesByType('navigation')[0];" +
        "var p=performance.getEntriesByName('first-contentful-paint')[0];" +
        "return {navigation:n?n.duration:null,fcp:p?p.startTime:null};",
    );
    if (Number.isFinite(sample.navigation)) nav.push(sample.navigation);
    if (Number.isFinite(sample.fcp)) fcp.push(sample.fcp);
  }
  return { navigationMs: summarize(nav), firstContentfulPaintMs: summarize(fcp) };
}

async function chromiumMediaEvidence(config, sessionId, scheme, fixtureUrl) {
  const base = [{ name: "prefers-color-scheme", value: scheme }];
  const output = {};
  if (
    await setMedia(config, sessionId, [
      ...base,
      { name: "prefers-reduced-motion", value: "reduce" },
    ])
  ) {
    output.reducedMotion = await evaluate(
      config,
      sessionId,
      "return {matches:matchMedia('(prefers-reduced-motion: reduce)').matches,animation:getComputedStyle(document.documentElement).animationDuration,transition:getComputedStyle(document.documentElement).transitionDuration};",
    );
  } else {
    output.reducedMotion = { unsupported: true };
  }
  if (
    await setMedia(config, sessionId, [
      ...base,
      { name: "forced-colors", value: "active" },
    ])
  ) {
    const focus = await focusSequence(config, sessionId, fixtureUrl);
    output.forcedColors = await evaluate(
      config,
      sessionId,
      "var css=(sel)=>getComputedStyle(document.querySelector(sel));var b=css('.flat button');var st=css('.flat .status');var inset=css('.inset .well');return {matches:matchMedia('(forced-colors: active)').matches,background:getComputedStyle(document.body).backgroundColor,boundaries:[{name:'flat button',color:b.borderTopColor,width:b.borderTopWidth},{name:'flat status',color:st.borderTopColor,width:st.borderTopWidth},{name:'inset well',color:inset.borderTopColor,width:inset.borderTopWidth}]};",
    );
    output.forcedColors.focus = focus;
  } else {
    output.forcedColors = { unsupported: true };
  }
  await setMedia(config, sessionId, base);
  return output;
}

function contrastEvidence(vars) {
  const pairs = [
    ["ink/paper", vars.ink, vars.paper, 4.5, true],
    ["muted/paper", vars.muted, vars.paper, 4.5, true],
    ["accent/paper", vars.accent, vars.paper, 4.5, true],
    ["focus/paper", vars.focus, vars.paper, 3.0, true],
    ["focus/raised", vars.focus, vars.raised, 3.0, true],
    ["ink/tint", vars.ink, vars.tint, 4.5, true],
    ["accent/tint", vars.accent, vars.tint, 4.5, true],
    ["line/paper", vars.line, vars.paper, 3.0, true],
    ["line/raised", vars.line, vars.raised, 3.0, true],
  ];
  return pairs.map(([name, foreground, background, threshold, required]) => {
    const ratio = contrastRatio(foreground, background);
    return {
      name,
      foreground,
      background,
      ratio,
      threshold,
      required,
      status: ratio >= threshold ? "pass" : required ? "fail" : "observe",
    };
  });
}

function dimensionalRuleBytes(css) {
  const rules = css.match(/[^{}]+\{[^{}]*\}/g) || [];
  const variantTokens = [
    ".fixture:not(.flat)",
    ".tinted",
    ".raised",
    ".gloss",
    ".inset",
    ".accent",
  ];
  const variantRules = rules.filter((rule) =>
    variantTokens.some((token) => rule.includes(token)),
  );
  return {
    totalCssBytes: bytes(css),
    totalCssGzipBytes: zlib.gzipSync(Buffer.from(css)).length,
    variantRuleBytes: bytes(variantRules.join("\n")),
    variantRuleGzipBytes: zlib.gzipSync(Buffer.from(variantRules.join("\n"))).length,
    variantRuleCount: variantRules.length,
  };
}

function evaluateRequiredChecks(page, noCss, focus, clicked, contrast) {
  const signaturesEqual =
    page.signatures.length === 6 &&
    page.signatures.every(
      (signature) => JSON.stringify(signature) === JSON.stringify(page.signatures[0]),
    );
  const checks = [
    result("six semantic fixtures", page.fixtureCount === 6 ? "pass" : "fail", page.fixtureCount),
    result("identical fixture semantics", signaturesEqual ? "pass" : "fail", page.signatures),
    result("no authored JavaScript", page.scriptCount === 0 ? "pass" : "fail", page.scriptCount),
    result("no external resources", page.resourceCount === 0 ? "pass" : "fail", page.resourceCount),
    result("viewport reflow", page.overflow ? "fail" : "pass", page.viewport),
    result(
      "F0 flat baseline",
      page.flat.section.borderRadius === "0px" &&
      page.flat.section.boxShadow === "none" &&
      page.flat.section.backgroundImage === "none" &&
      page.flat.status.borderRadius === "0px" &&
      page.flat.button.borderRadius === "0px"
        ? "pass"
        : "fail",
      page.flat,
    ),
    result(
      "variant differentiation",
      page.tinted.backgroundImage !== "none" &&
      page.raised.boxShadow !== "none" &&
      page.glossButton.backgroundImage !== "none" &&
      page.insetWell.boxShadow.includes("inset") &&
      page.accentHeading.borderInlineStartWidth !== "0px"
        ? "pass"
        : "fail",
      {
        tinted: page.tinted,
        raised: page.raised,
        glossButton: page.glossButton,
        insetWell: page.insetWell,
        accentHeading: page.accentHeading,
      },
    ),
    result(
      "CSS-disabled semantics",
      noCss.sections === 6 && noCss.links === 6 && noCss.buttons === 6
        ? "pass"
        : "fail",
      noCss,
      "accepted-accessibility",
    ),
    result(
      "keyboard traversal and visible focus",
      focus.valid && focus.sequence.every((entry) => {
        const indicator = entry?.focusIndicator;
        if (!indicator?.visible || indicator.style === "none" || indicator.style === "hidden" || Number.parseFloat(indicator.width) < 2) return false;
        try {
          return contrastRatio(indicator.color, page.vars.paper) >= 3 &&
            contrastRatio(indicator.color, page.vars.raised) >= 3;
        } catch { return false; }
      }) ? "pass" : "fail",
      focus.sequence,
      "accepted-accessibility",
    ),
    result(
      "button action",
      clicked ? "pass" : "fail",
      clicked ? "#reference reached" : "button did not reach #reference",
      "accepted-accessibility",
    ),
  ];
  for (const item of contrast.filter((entry) => entry.required)) {
    checks.push(
      result(
        "contrast " + item.name,
        item.status,
        {
          ratio: item.ratio,
          threshold: item.threshold,
          foreground: item.foreground,
          background: item.background,
        },
        "accepted-accessibility",
      ),
    );
  }
  return checks;
}

async function inspectMaterialBoundaries(config, sessionId, boundaryUrl, outputDir, scheme, captureEvents) {
  const viewports = [];
  let styles = null;
  for (const width of [1280, 375, 320]) {
    await setWindow(config, sessionId, width, 900);
    await navigate(config, sessionId, boundaryUrl);
    const observation = await evaluate(
      config,
      sessionId,
      "return (()=>{" +
      "const style=(q)=>{const e=document.querySelector(q);if(!e)return null;const s=getComputedStyle(e);return {gradient:s.backgroundImage,shadow:s.boxShadow,radius:s.borderRadius,cursor:s.cursor};};" +
      "return {width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth+1,caseCount:document.querySelectorAll('section.boundary').length,buttonCount:document.querySelectorAll('.boundary button').length," +
      "b1:style('[data-boundary=b1]'),b2:style('[data-boundary=b2]'),b2inner:style('[data-boundary=b2] .nested .nested')," +
      "goodPrimary:style('.hierarchy-good .primary'),goodSubordinate:style('.hierarchy-good .subordinate'),badPeers:[...document.querySelectorAll('.hierarchy-bad .peer')].map(e=>{const s=getComputedStyle(e);return {shadow:s.boxShadow,cursor:s.cursor}})," +
      "negativeExplicit:document.querySelector('#b2').textContent.includes('Deliberately rejected treatment')};" +
      "})()",
    );
    viewports.push({
      requested: width,
      observed: observation.width,
      overflow: observation.overflow,
      status: Math.abs(width - observation.width) > 2 ? "unsupported" : observation.overflow ? "fail" : "pass",
    });
    if (width === 1280) styles = observation;
  }
  await setWindow(config, sessionId, 1280, 900);
  await navigate(config, sessionId, boundaryUrl);
  const imagePath = path.join(outputDir, config.browser + "-" + scheme + "-boundaries.png");
  await screenshot(config, sessionId, imagePath, boundaryUrl, captureEvents);
  const caseScreenshots = [];
  for (const boundaryId of ["b1", "b2", "b3"]) {
    await evaluate(
      config, sessionId,
      "document.getElementById(arguments[0]).scrollIntoView({block:'start'});",
      [boundaryId],
    );
    const casePath = path.join(outputDir, config.browser + "-" + scheme + "-" + boundaryId + ".png");
    await screenshot(config, sessionId, casePath, boundaryUrl, captureEvents);
    caseScreenshots.push(path.basename(casePath));
  }
  const button = await findElement(config, sessionId, ".hierarchy-good button");
  await command(config, sessionId, "POST", "/element/" + button + "/click", {});
  let actionWorks = false;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const actionUrl = await command(config, sessionId, "GET", "/url");
    if (String(actionUrl).endsWith("#decision")) {
      actionWorks = true;
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  const checks = [
    result("B1 bounded tint and elevation",
      Boolean(styles?.b1?.gradient && styles.b1.gradient !== "none" && styles.b1.shadow !== "none") ? "pass" : "fail",
      styles?.b1,"proposal-composition"),
    result("B2 explicitly rejected nested stack",
      styles?.negativeExplicit && styles.caseCount === 3 &&
      styles.b2.shadow !== "none" && styles.b2inner.shadow !== "none" &&
      styles.b2inner.radius !== "0px" ? "pass" : "fail",
      {outside:styles?.b2,inside:styles?.b2inner,negativeLabel:styles?.negativeExplicit},"proposal-composition"),
    result("B3 relative elevation and static affordance",
      styles?.goodPrimary?.shadow !== "none" &&
      styles.goodSubordinate.shadow.includes("inset") &&
      styles.goodSubordinate.cursor !== "pointer" &&
      styles.badPeers?.length === 2 &&
      styles.badPeers[0].shadow !== "none" &&
      styles.badPeers[0].shadow === styles.badPeers[1].shadow &&
      styles.badPeers.every(x=>x.cursor !== "pointer") ? "pass" : "fail",
      {primary:styles?.goodPrimary,subordinate:styles?.goodSubordinate,ambiguousPeers:styles?.badPeers},"proposal-composition"),
    result("B3 native button navigation",actionWorks ? "pass" : "fail",actionWorks,"accepted-accessibility"),
  ];
  for (const viewport of viewports) {
    checks.push(result("B1-B3 reflow " + viewport.requested + "px",viewport.status,viewport,"accepted-accessibility"));
  }
  return {styles,viewports,checks,screenshot:path.basename(imagePath),caseScreenshots,humanReviewRequired:true};
}

async function inspectTextResilience(config, sessionId, url, caseLabel, expectedSections) {
  const observations = [];
  for (const mode of ["root-font-200", "text-spacing", "combined"]) {
    for (const requestedWidth of [1280, 375, 320]) {
      await setWindow(config, sessionId, requestedWidth, 900);
      await navigate(config, sessionId, url);
      const observed = await evaluate(
        config, sessionId,
        "return (()=>{" +
          "const mode=arguments[0];" +
          "const style=document.createElement('style');style.setAttribute('data-evidence-text-stress',mode);" +
          "const root='html{font-size:200%!important}';" +
          "const spacing='p,h1,h2,h3,a,button,span,li{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-block-end:2em!important}';" +
          "style.textContent=mode==='root-font-200'?root:mode==='text-spacing'?spacing:root+spacing;" +
          "document.head.appendChild(style);" +
          "const targets=[...document.querySelectorAll('a,button')];" +
          "const clipped=targets.filter(el=>{const r=el.getBoundingClientRect();return r.left < -1 || r.right > innerWidth+1}).map(el=>({tag:el.tagName,text:el.textContent.trim().slice(0,50)}));" +
          "const sections=document.querySelectorAll(arguments[1]).length;" +
          "const offenders=[...document.querySelectorAll('main,section,p,h1,h2,h3,span,a,button,form,.grid,.well')].filter(el=>{const r=el.getBoundingClientRect();return r.right>innerWidth+1||r.left< -1}).slice(0,8).map(el=>({tag:el.tagName,css:el.className||'',text:el.textContent.trim().slice(0,36),right:Math.round(el.getBoundingClientRect().right)}));" +
          "const rootSize=parseFloat(getComputedStyle(document.documentElement).fontSize);" +
          "const bodySize=parseFloat(getComputedStyle(document.body).fontSize);" +
          "return {width:innerWidth,rootSize,bodySize,overflow:document.documentElement.scrollWidth>innerWidth+1,clipped,offenders,sectionCount:sections,targets:targets.length,mode};" +
        "})()",
        [mode, caseLabel],
      );
      const matched = Math.abs(observed.width - requestedWidth) <= 2;
      const scaled = !mode.includes("root-font") && mode !== "combined" ||
        observed.rootSize >= 30;
      const status = !matched ? "unsupported" :
        observed.overflow || observed.clipped.length || observed.sectionCount !== expectedSections ||
        !observed.targets || !scaled ? "fail" : "pass";
      observations.push({
        mode, requestedWidth, status, ...observed,
        limitation: "CSS override only; not native browser text-only resizing or browser zoom",
      });
    }
  }
  return {
    observations,
    checks: observations.map(item=>result(
      "CSS-simulated " + item.mode + " " + caseLabel + " " + item.requestedWidth + "px",
      item.status, item, "accepted-accessibility",
    )),
  };
}

async function runScheme(config, scheme, fixtureUrl, boundaryUrl, outputDir, captureEvents) {
  const session = await createSession(config, scheme);
  const sessionId = session.sessionId;
  try {
    if (config.browser === "chromium") {
      await setMedia(config, sessionId, [
        { name: "prefers-color-scheme", value: scheme },
      ]);
    }
    await setWindow(config, sessionId, 1280, 900);
    await navigate(config, sessionId, fixtureUrl);
    const desktop = await inspectPage(config, sessionId);
    const schemeMatched = scheme === "dark" ? desktop.scheme.dark : desktop.scheme.light;

    const viewports = [];
    for (const width of [1280, 375, 320]) {
      await setWindow(config, sessionId, width, 900);
      await navigate(config, sessionId, fixtureUrl);
      const page = await inspectPage(config, sessionId);
      const viewportMatched = Math.abs(page.viewport.width - width) <= 2;
      viewports.push({
        width,
        innerWidth: page.viewport.width,
        viewportMatched,
        overflow: page.overflow,
        status: !viewportMatched ? "unsupported" : page.overflow ? "fail" : "pass",
      });
    }

    await setWindow(config, sessionId, 1280, 900);
    const noCss = await noCssSemantics(config, sessionId, fixtureUrl);
    const focus = await focusSequence(config, sessionId, fixtureUrl);
    const clicked = await clickButton(config, sessionId, fixtureUrl);
    const glossPressed = await inspectGlossPressed(config, sessionId, fixtureUrl);
    await navigate(config, sessionId, fixtureUrl);
    const hover = await hoverElement(config, sessionId, ".flat button");
    const zoom = await attemptBrowserZoom(config, sessionId);
    const perf = await performanceSamples(config, sessionId, fixtureUrl);
    await navigate(config, sessionId, fixtureUrl);
    const current = await inspectPage(config, sessionId);
    const contrast = contrastEvidence(current.vars);
    const checks = evaluateRequiredChecks(current, noCss, focus, clicked, contrast);
    checks.push(result(
      "gloss pressed state",
      glossPressed.status,
      glossPressed,
      "accepted-interaction-motion",
    ));
    checks.push(
      result(
        "requested color scheme",
        schemeMatched ? "pass" : "unsupported",
        { requested: scheme, observed: desktop.scheme },
      ),
    );
    for (const viewport of viewports) {
      checks.push(
        result(
          "reflow " + viewport.width + "px",
          viewport.status,
          viewport,
          "accepted-accessibility",
        ),
      );
    }
    checks.push(
      result(
        "browser zoom 200%",
        zoom.status,
        zoom,
        "accepted-accessibility",
      ),
    );
    checks.push(result("pointer hover", hover.status, hover.detail, "accepted-interaction-motion"));

    let media = {
      reducedMotion: { unsupported: true },
      forcedColors: { unsupported: true },
    };
    if (config.browser === "chromium") {
      media = await chromiumMediaEvidence(config, sessionId, scheme, fixtureUrl);
      checks.push(
        result(
          "reduced-motion media emulation",
          media.reducedMotion.matches ? "pass" : "unsupported",
          media.reducedMotion,
          "accepted-interaction-motion",
        ),
      );
      checks.push(
        result(
          "forced-colors media emulation",
          !media.forcedColors.matches ? "unsupported" :
          media.forcedColors.focus?.valid &&
          media.forcedColors.focus.sequence.every((entry) => {
            const indicator = entry?.focusIndicator;
            if (!indicator?.visible || indicator.style === "none" || Number.parseFloat(indicator.width) < 2) return false;
            try { return contrastRatio(indicator.color, media.forcedColors.background) >= 3; }
            catch { return false; }
          }) &&
          media.forcedColors.boundaries?.every((border) => {
            if (Number.parseFloat(border.width) < 1) return false;
            try { return contrastRatio(border.color, media.forcedColors.background) >= 3; }
            catch { return false; }
          }) ? "pass" : "fail",
          media.forcedColors,
          "accepted-accessibility",
        ),
      );
    } else {
      checks.push(
        result(
          "reduced-motion media emulation",
          "unsupported",
          "Portable WebDriver has no standards-based reduced-motion override for Firefox in this harness.",
          "accepted-interaction-motion",
        ),
      );
      checks.push(
        result(
          "forced-colors media emulation",
          "unsupported",
          "Portable WebDriver has no standards-based forced-colors override for Firefox in this harness.",
          "accepted-accessibility",
        ),
      );
    }

    await navigate(config, sessionId, fixtureUrl);
    const imagePath = path.join(outputDir, config.browser + "-" + scheme + ".png");
    await screenshot(config, sessionId, imagePath, fixtureUrl, captureEvents);
    const boundary = await inspectMaterialBoundaries(config, sessionId, boundaryUrl, outputDir, scheme, captureEvents);
    checks.push(...boundary.checks);
    const textStress = {
      fixture: await inspectTextResilience(config, sessionId, fixtureUrl, ".fixture", 6),
      boundary: await inspectTextResilience(config, sessionId, boundaryUrl, ".boundary", 3),
    };
    checks.push(...textStress.fixture.checks, ...textStress.boundary.checks);

    return {
      scheme,
      capabilities: {
        browserName: session.capabilities.browserName,
        browserVersion: session.capabilities.browserVersion,
        platformName: session.capabilities.platformName,
      },
      page: current,
      viewports,
      noCss,
      focus,
      glossPressed,
      hover,
      zoom,
      media,
      contrast,
      performance: perf,
      screenshot: path.basename(imagePath),
      boundary,
      textStress,
      checks,
    };
  } finally {
    await closeSession(config, sessionId);
  }
}

async function runBrowser(browser, fixtureUrl, boundaryUrl, outputDir, captureEvents) {
  return withDriver(browser, async (config) => {
    const schemes = [];
    for (const scheme of ["light", "dark"]) {
      schemes.push(await runScheme(config, scheme, fixtureUrl, boundaryUrl, outputDir, captureEvents));
    }
    return { browser, schemes };
  });
}

function markdown(report) {
  const lines = [
    "# Dimensional Utility browser evidence",
    "",
    "- Fixture commit candidate: " + (report.source.commit || "unknown"),
    "- Fixture Git blob: " + report.source.gitBlobSha,
    "- Fixture SHA-256: " + report.source.sha256,
    "- Boundary fixture Git blob: " + (report.source.boundary?.gitBlobSha || "missing"),
    "- Boundary fixture SHA-256: " + (report.source.boundary?.sha256 || "missing"),
    "- Generated: " + report.generatedAt,
    "- Harness version: " + report.harnessVersion,
    "- Browsers completed: " + report.summary.browserCount,
    "- Harness failures: " + report.summary.harnessFailures,
    "- Required failures: " + report.summary.requiredFailures,
    "- Unsupported observations: " + report.summary.unsupported,
    "",
    "Unsupported means the public CI environment or standards-based WebDriver path could not reproduce the check; it is not a pass.",
    "",
  ];
  for (const browser of report.browsers) {
    lines.push("## " + browser.browser, "");
    for (const scheme of browser.schemes) {
      lines.push(
        "### " + scheme.scheme,
        "",
        "- Version: " + (scheme.capabilities.browserVersion || "unknown"),
        "- Screenshot: " + scheme.screenshot,
        "- Navigation median: " + String(scheme.performance.navigationMs.median) + " ms",
        "",
        "| Check | Status | Authority |",
        "| --- | --- | --- |",
      );
      for (const check of scheme.checks) {
        lines.push("| " + check.name + " | " + check.status + " | " + check.authority + " |");
      }
      lines.push("", "- Boundary screenshot: " + scheme.boundary.screenshot,
        "- Individual boundary screenshots: " + scheme.boundary.caseScreenshots.join(", "),
        "- B1/B2/B3: automated fixture checks only; **human hierarchy judgement not complete**.",
        "- CSS-simulated root font and text spacing stress is **not** native browser 200% text-only resize.", "");
    }
  }
  lines.push(
    "## Dimensional source-size observation",
    "",
    "- HTML bytes: " + report.size.htmlBytes,
    "- HTML gzip bytes: " + report.size.htmlGzipBytes,
    "- CSS bytes: " + report.size.totalCssBytes,
    "- CSS gzip bytes: " + report.size.totalCssGzipBytes,
    "- Variant-rule bytes: " + report.size.variantRuleBytes,
    "- Variant-rule gzip bytes: " + report.size.variantRuleGzipBytes,
    "",
  );
  return lines.join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const here = path.dirname(fileURLToPath(import.meta.url));
  const root = path.resolve(here, "..");
  const fixture = path.resolve(
    args.fixture || path.join(root, "docs/examples/dimensional-utility-reference.html"),
  );
  const outputDir = path.resolve(
    args.output || path.join(root, "artifacts/dimensional-utility"),
  );
  await fs.mkdir(outputDir, { recursive: true });

  const fixtureBytes = await fs.readFile(fixture);
  const fixtureText = fixtureBytes.toString("utf8");
  const styleMatch = fixtureText.match(/<style>([\s\S]*?)<\/style>/i);
  if (!styleMatch) throw new Error("Fixture does not contain an inline style block");
  const css = styleMatch[1];
  const boundaryFile = path.join(root, "docs/examples/dimensional-utility-boundaries.html");
  const boundaryBytes = await fs.readFile(boundaryFile);

  const source = {
    path: path.relative(root, fixture),
    commit: process.env.EVIDENCE_SOURCE_SHA || process.env.GITHUB_SHA || null,
    workflowCommit: process.env.GITHUB_SHA || null,
    gitBlobSha: gitBlobSha(fixtureBytes),
    sha256: sha256(fixtureBytes),
    boundary: {
      path: path.relative(root, boundaryFile),
      gitBlobSha: gitBlobSha(boundaryBytes),
      sha256: sha256(boundaryBytes),
    },
  };
  const size = {
    htmlBytes: fixtureBytes.length,
    htmlGzipBytes: zlib.gzipSync(fixtureBytes).length,
    boundaryHtmlBytes: boundaryBytes.length,
    boundaryHtmlGzipBytes: zlib.gzipSync(boundaryBytes).length,
    ...dimensionalRuleBytes(css),
  };
  const fixtureUrl = pathToFileURL(fixture).href;
  const boundaryUrl = pathToFileURL(boundaryFile).href;
  const browsers = [];
  const harnessFailures = [];
  const captureEvents = [];

  for (const browser of ["chromium", "firefox"]) {
    try {
      browsers.push(await runBrowser(browser, fixtureUrl, boundaryUrl, outputDir, captureEvents));
    } catch (error) {
      harnessFailures.push({
        browser,
        error: error.stack || error.message,
      });
    }
  }

  const allChecks = browsers.flatMap((browser) =>
    browser.schemes.flatMap((scheme) => scheme.checks),
  );
  const requiredFailures = allChecks.filter((check) => check.status === "fail").length;
  const unsupported = allChecks.filter((check) => check.status === "unsupported").length;

  const report = {
    schemaVersion: 1,
    harnessVersion: HARNESS_VERSION,
    generatedAt: new Date().toISOString(),
    source,
    environment: {
      platform: process.platform,
      architecture: process.arch,
      kernel: os.release(),
      node: process.version,
    },
    size,
    browsers,
    harnessFailures,
    screenshotCaptures: captureEvents,
    summary: {
      browserCount: browsers.length,
      requiredFailures,
      unsupported,
      harnessFailures: harnessFailures.length,
    },
    authority:
      "Generated evidence is data, not authority. Accessibility and interaction checks exercise accepted contracts; RFC-0008-specific conclusions are limited to dimensional composition and rendering cost.",
  };

  await fs.writeFile(
    path.join(outputDir, "evidence.json"),
    JSON.stringify(report, null, 2) + "\n",
  );
  await fs.writeFile(path.join(outputDir, "summary.md"), markdown(report) + "\n");
  const stdoutPayload = {
    schemaVersion: 1,
    harnessVersion: HARNESS_VERSION,
    source: report.source,
    summary: report.summary,
    artifacts: ["evidence.json", "summary.md"],
  };
  if (args.format === "json") {
    process.stdout.write(JSON.stringify(stdoutPayload) + "\n");
  } else {
    process.stdout.write(
      "browser evidence: browsers=" +
        report.summary.browserCount +
        " harness_failures=" +
        report.summary.harnessFailures +
        " required_failures=" +
        report.summary.requiredFailures +
        " unsupported=" +
        report.summary.unsupported +
        "\n",
    );
  }

  if (browsers.length < 2 || harnessFailures.length > 0 || requiredFailures > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  process.stderr.write((error.stack || error.message) + "\n");
  process.exitCode = 1;
});
