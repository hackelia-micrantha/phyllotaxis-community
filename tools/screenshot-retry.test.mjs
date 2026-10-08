import test from "node:test";
import assert from "node:assert/strict";
import { captureWithVerifiedRetry, isTransientScreenshotDetach } from "./screenshot-retry.mjs";

const URL = "file:///tmp/phyllotaxis-reference.html";
const IMG = "iVBORw0KGgoAAAANSUhEUg==";
const detached = () => new Error(
  "GET /session/a-123/screenshot failed: 500 " +
  '{"value":{"error":"timeout","message":"timeout: aborted by navigation: Not attached to an active page"}}',
);
const state = (href = URL, readyState = "complete", timeOrigin = 1730000000.125) =>
  ({ href, readyState, timeOrigin });

test("first-attempt success captures evidence without sleeping", async () => {
  const entries = [];
  let pauses = 0;
  const encoded = await captureWithVerifiedRetry({
    expectedUrl: URL, getPageState: async () => state(), allowDetachRetry: true,
    capture: async () => IMG, onAttempt: x => entries.push(x),
    pause: () => { pauses += 1; },
  });
  assert.equal(encoded, IMG);
  assert.equal(pauses, 0);
  assert.deepEqual(entries.map(x => x.status), ["pass"]);
});

test("only a known 500 screenshot detachment retries once", async () => {
  let calls = 0, inspections = 0;
  const entries = [];
  const encoded = await captureWithVerifiedRetry({
    expectedUrl: URL, allowDetachRetry: true,
    getPageState: async () => { inspections += 1; return state(); },
    capture: async () => { calls += 1; if (calls === 1) throw detached(); return IMG; },
    onAttempt: x => entries.push(x),
    pause: async () => {},
  });
  assert.equal(encoded, IMG);
  assert.equal(calls, 2);
  assert.equal(inspections, 4);
  assert.deepEqual(entries.map(x => x.status), ["retry", "pass"]);
});

test("exhausted detach errors remain failing evidence", async () => {
  const entries = [];
  let calls = 0;
  await assert.rejects(captureWithVerifiedRetry({
    expectedUrl: URL, getPageState: async () => state(), allowDetachRetry: true,
    capture: async () => { calls += 1; throw detached(); },
    onAttempt: x => entries.push(x),
  }), /Not attached to an active page/);
  assert.equal(calls, 2);
  assert.deepEqual(entries.map(x => x.status), ["retry", "fail"]);
});

test("other errors, even screenshot 500s, are never retried", async () => {
  const entries = [];
  let calls = 0;
  await assert.rejects(captureWithVerifiedRetry({
    expectedUrl: URL, getPageState: async () => state(), allowDetachRetry: true,
    capture: async () => { calls += 1; throw new Error("GET /session/a-123/screenshot failed: 500 unknown error"); },
    onAttempt: x => entries.push(x),
  }), /unknown error/);
  assert.equal(calls, 1);
  assert.deepEqual(entries.map(x => x.status), ["fail"]);
  assert.equal(isTransientScreenshotDetach(new Error("not attached to an active page")), false);
});

test("wrong page or unready page stops before capture", async () => {
  for (const bad of [state("file:///tmp/other.html"), state(URL, "loading")]) {
    let calls = 0;
    await assert.rejects(captureWithVerifiedRetry({
      expectedUrl: URL, getPageState: async () => bad,
      capture: async () => { calls += 1; return IMG; },
      onAttempt: () => {},
    }), /identity/);
    assert.equal(calls, 0);
  }
});

test("changed page after screenshot is a failure rather than a retry", async () => {
  let stateCalls = 0, captures = 0;
  await assert.rejects(captureWithVerifiedRetry({
    expectedUrl: URL,
    getPageState: async () => ++stateCalls === 1 ? state() : state("file:///tmp/changed.html"),
    capture: async () => { captures += 1; return IMG; },
    onAttempt: () => {},
  }), /identity/);
  assert.equal(captures, 1);
});

test("changed page following a detached screenshot blocks recovery", async () => {
  let stateCalls = 0, captures = 0;
  await assert.rejects(captureWithVerifiedRetry({
    expectedUrl: URL, allowDetachRetry: true,
    getPageState: async () => ++stateCalls === 1 ? state() : state("file:///tmp/changed.html"),
    capture: async () => { captures += 1; throw detached(); },
    onAttempt: () => {},
  }), /identity/);
  assert.equal(captures, 1);
});

test("empty screenshot data does not become passing evidence", async () => {
  await assert.rejects(captureWithVerifiedRetry({
    expectedUrl: URL, getPageState: async () => state(), allowDetachRetry: true,
    capture: async () => "", onAttempt: () => {},
  }), /missing encoded image/);
});

test("a same-URL new document must not be silently retried", async () => {
  let stateCalls = 0, captureCalls = 0;
  const entries = [];
  await assert.rejects(captureWithVerifiedRetry({
    expectedUrl: URL, allowDetachRetry: true,
    getPageState: async () => state(URL, "complete", ++stateCalls === 1 ? 100 : 101),
    capture: async () => { captureCalls += 1; throw detached(); },
    onAttempt: entry => entries.push(entry),
  }), /document identity/);
  assert.equal(captureCalls, 1);
  assert.deepEqual(entries.map(entry => entry.reason),
    ["chromedriver-page-detach", "page-identity-after-detach"]);
});

test("Firefox and other browsers never retry the ChromeDriver timeout", async () => {
  const entries = [];
  let captureCalls = 0;
  await assert.rejects(captureWithVerifiedRetry({
    expectedUrl: URL, allowDetachRetry: false,
    getPageState: async () => state(),
    capture: async () => { captureCalls += 1; throw detached(); },
    onAttempt: entry => entries.push(entry),
  }), /Not attached to an active page/);
  assert.equal(captureCalls, 1);
  assert.deepEqual(entries.map(entry => entry.status), ["fail"]);
});

test("non-timeout WebDriver errors do not trigger recovery", async () => {
  const entries = [];
  let calls = 0;
  const error = new Error(
    'GET /session/a-123/screenshot failed: 500 {"value":{"error":"unknown error","message":"aborted by navigation: Not attached to an active page"}}'
  );
  await assert.rejects(captureWithVerifiedRetry({
    expectedUrl: URL, allowDetachRetry: true,
    getPageState: async () => state(),
    capture: async () => { calls += 1; throw error; },
    onAttempt: entry => entries.push(entry),
  }), /unknown error/);
  assert.equal(calls, 1);
  assert.equal(entries[0].reason, "non-retryable-capture-error");
});

test("missing document time origin cannot produce passing evidence", async () => {
  let captures = 0;
  await assert.rejects(captureWithVerifiedRetry({
    expectedUrl: URL,
    getPageState: async () => ({ href: URL, readyState: "complete" }),
    capture: async () => { captures += 1; return IMG; },
    onAttempt: () => {},
  }), /document identity/);
  assert.equal(captures, 0);
});
