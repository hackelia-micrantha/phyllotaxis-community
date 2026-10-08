#!/usr/bin/env node
// Browser smoke for the published, allowlisted Pages artifact.
// This is not an accessibility certification or actual browser-zoom test.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const index = process.argv.indexOf("--site");
if (index < 0 || !process.argv[index + 1] || process.argv.length !== 4) {
  process.stderr.write("Usage: node tools/gallery-browser-smoke.mjs --site BUILT_SITE_DIRECTORY\n");
  process.exit(2);
}
const site = path.resolve(process.argv[index + 1]);
assert.ok(existsSync(path.join(site, "index.html")), "built site not found");

const PORT = 9517;
const driver = spawn(process.env.CHROMEDRIVER_BIN || "chromedriver", ["--port=" + PORT], {
  stdio: ["ignore", "pipe", "pipe"],
});
let log = "";
for (const stream of [driver.stdout, driver.stderr]) {
  stream.on("data", (data) => { log = (log + data.toString("utf8")).slice(-6000); });
}
let session;
let checks = 0;
const record = (name, condition) => {
  assert.ok(condition, name);
  checks += 1;
};
async function webdriver(method, route, body) {
  const response = await fetch("http://127.0.0.1:" + PORT + route, {
    method,
    headers: body === undefined ? {} : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  });
  const payload = await response.json();
  if (!response.ok || payload.value?.error) {
    throw new Error(method + " " + route + ": " + JSON.stringify(payload.value).slice(0, 1000));
  }
  return payload.value;
}
async function ready() {
  for (let i = 0; i < 60; i += 1) {
    if (driver.exitCode !== null) throw new Error("chromedriver terminated: " + driver.exitCode);
    try { await webdriver("GET", "/status"); return; }
    catch { await new Promise((resolve) => setTimeout(resolve, 250)); }
  }
  throw new Error("chromedriver did not start");
}
const command = (method, endpoint, body) =>
  webdriver(method, "/session/" + session + endpoint, body);
const evalInPage = (script) => command("POST", "/execute/sync", { script, args: [] });
const cdp = (cmd, params) => command("POST", "/goog/cdp/execute", { cmd, params });
const navigate = (uri) => command("POST", "/url", { url: uri });
async function media(scheme, reduced = "no-preference", forced = "none") {
  await cdp("Emulation.setEmulatedMedia", {
    media: "screen",
    features: [
      { name: "prefers-color-scheme", value: scheme },
      { name: "prefers-reduced-motion", value: reduced },
      { name: "forced-colors", value: forced },
    ],
  });
}
const viewport = (width) => cdp("Emulation.setDeviceMetricsOverride", {
  width, height: 850, deviceScaleFactor: 1, mobile: false,
});
function luminance(value) {
  const values = value.match(/[\d.]+/g)?.slice(0, 3).map(Number);
  assert.ok(values && values.length === 3, "parse RGB: " + value);
  const channel = (v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(values[0]) + 0.7152 * channel(values[1]) + 0.0722 * channel(values[2]);
}
function ratio(first, second) {
  const a = luminance(first), b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
const indexUrl = pathToFileURL(path.join(site, "index.html")).href;
try {
  await ready();
  const response = await webdriver("POST", "/session", {
    capabilities: {
      alwaysMatch: {
        browserName: "chrome",
        pageLoadStrategy: "normal",
        "goog:chromeOptions": {
          binary: process.env.CHROMIUM_BIN || "chromium",
          args: ["--headless=new", "--disable-gpu", "--disable-dev-shm-usage", "--no-sandbox"],
        },
      },
    },
  });
  session = response.sessionId;
  assert.ok(session, "session ID returned");
  await navigate(indexUrl);

  const semantics = await evalInPage(`
    return {
      title: document.title,
      main: document.querySelectorAll("main").length,
      h1: document.querySelectorAll("h1").length,
      gallery: [...document.querySelectorAll(".example-link")].map(a => ({href: a.getAttribute("href"), text: a.textContent.trim()})),
      skip: document.querySelector("a.skip-link")?.getAttribute("href"),
      scripts: document.scripts.length
    };
  `);
  record("page title", semantics.title.includes("Phyllotaxis"));
  record("one main and one h1", semantics.main === 1 && semantics.h1 === 1);
  record("two linked examples", semantics.gallery.length === 2);
  record("references only existing example fixtures",
    semantics.gallery[0].href === "./examples/utility-reference.html" &&
    semantics.gallery[1].href === "./examples/dimensional-utility-reference.html");
  record("semantic skip link", semantics.skip === "#content");
  record("gallery works without JavaScript", semantics.scripts === 0);

  // Keyboard-generated focus is needed: focus() alone does not guarantee :focus-visible.
  await command("POST", "/actions", { actions: [{
    type: "key", id: "keyboard", actions: [
      { type: "keyDown", value: "\uE004" },
      { type: "keyUp", value: "\uE004" },
    ],
  }] });
  await command("DELETE", "/actions");
  const focus = await evalInPage(`
    const node = document.activeElement;
    return { skip: node?.classList.contains("skip-link"),
      outline: getComputedStyle(node).outlineStyle,
      width: getComputedStyle(node).outlineWidth };
  `);
  record("keyboard reaches skip link", focus.skip);
  record("keyboard focus visible", focus.outline !== "none" && focus.width !== "0px");

  const backgrounds = [];
  for (const scheme of ["light", "dark"]) {
    await media(scheme);
    for (const width of [320, 375, 1280]) {
      await viewport(width);
      const view = await evalInPage(`
        return { inner: innerWidth, scroll: document.documentElement.scrollWidth,
          cards: getComputedStyle(document.querySelector(".gallery")).gridTemplateColumns.split(" ").length };
      `);
      record(scheme + " " + width + "px viewport applied", view.inner === width);
      record(scheme + " " + width + "px no horizontal overflow", view.scroll <= width + 1);
      record(scheme + " " + width + "px layout", width < 672 ? view.cards === 1 : view.cards === 2);
    }
    const colors = await evalInPage(`
      const base = document.querySelector(".example");
      const anchor = document.querySelector(".example-link");
      return { ink: getComputedStyle(document.body).color,
        page: getComputedStyle(document.body).backgroundColor,
        link: getComputedStyle(anchor).color,
        anchor: getComputedStyle(anchor).backgroundColor,
        base: getComputedStyle(base).backgroundColor };
    `);
    backgrounds.push(colors.page);
    record(scheme + " text contrast", ratio(colors.ink, colors.page) >= 4.5);
    record(scheme + " link background transparent", colors.anchor === "rgba(0, 0, 0, 0)");
    record(scheme + " link contrast (" + ratio(colors.link, colors.base).toFixed(2) + "; " + JSON.stringify(colors) + ")", ratio(colors.link, colors.base) >= 4.5);
  }
  record("light and dark use different backgrounds", backgrounds[0] !== backgrounds[1]);

  await media("light", "reduce");
  const reduced = await evalInPage(`
    return { transition: getComputedStyle(document.querySelector(".example-link")).transitionDuration,
      scroll: getComputedStyle(document.documentElement).scrollBehavior };
  `);
  record("reduced-motion transition disabled", reduced.transition.split(",").every(x => parseFloat(x) === 0));
  record("reduced-motion scroll not smooth", reduced.scroll === "auto");

  await media("light", "no-preference", "active");
  const forced = await evalInPage(`
    const node = document.querySelector(".example-link");
    const style = getComputedStyle(node);
    return { applied: matchMedia("(forced-colors: active)").matches, border: style.borderTopStyle };
  `);
  record("forced colors emulation active", forced.applied);
  record("forced colors preserves control border", forced.border !== "none");

  await media("light");
  await viewport(1280);
  for (const [idx, suffix] of ["utility-reference.html", "dimensional-utility-reference.html"].entries()) {
    await navigate(indexUrl);
    await evalInPage("document.querySelectorAll('.example-link')[" + idx + "].click();");
    const currentUrl = await command("GET", "/url");
    record("fixture " + suffix + " navigates", currentUrl.endsWith("/examples/" + suffix));
    const content = await evalInPage("return {main: !!document.querySelector('main'), scripts: document.scripts.length};");
    record("fixture " + suffix + " semantic main", content.main);
    record("fixture " + suffix + " works without JS", content.scripts === 0);
  }

  await navigate(indexUrl);
  await media("light");
  await viewport(320);
  const zoomStress = await evalInPage(`
    document.documentElement.style.zoom = "2";
    return document.documentElement.scrollWidth <= innerWidth + 1;
  `);
  record("CSS zoom 2x stress does not overflow (not native browser zoom)", zoomStress);

  process.stdout.write("gallery browser smoke: " + checks + " assertions passed (Chromium; CSS zoom is not browser zoom)\n");
} catch (error) {
  process.stderr.write((error.stack || error.message) + "\nchromedriver log:\n" + log + "\n");
  process.exitCode = 1;
} finally {
  if (session) {
    try { await command("DELETE", ""); } catch { /* best effort */ }
  }
  driver.kill("SIGTERM");
}
