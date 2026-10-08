import test from "node:test";
import assert from "node:assert/strict";
import { captureWithVerifiedRetry, isTransientScreenshotDetach } from "./screenshot-retry.mjs";

const URL = "file:///tmp/phyllotaxis-reference.html";
const IMG = "iVBORw0KGgoAAAANSUhEUg==";
const detached = () => new Error(
  "GET /session/a-123/screenshot failed: 500 " +
  '{"value":{"error":"timeout","message":"timeout: aborted by navigation: Not attached to an active page"}}',
);
const state = (href = URL, readyState = "complete") => ({ href, readyState });

test("first-attempt success captures evidence without sleeping", async () => {
  const entries = [];
  let pauses = 0;
  const encoded = await captureWithVerifiedRetry({
    expectedUrl: URL, getPageState: async () => state(),
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
    expectedUrl: URL,
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
    expectedUrl: URL, getPageState: async () => state(),
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
    expectedUrl: URL, getPageState: async () => state(),
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
    expectedUrl: URL,
    getPageState: async () => ++stateCalls === 1 ? state() : state("file:///tmp/changed.html"),
    capture: async () => { captures += 1; throw detached(); },
    onAttempt: () => {},
  }), /identity/);
  assert.equal(captures, 1);
});

test("empty screenshot data does not become passing evidence", async () => {
  await assert.rejects(captureWithVerifiedRetry({
    expectedUrl: URL, getPageState: async () => state(),
    capture: async () => "", onAttempt: () => {},
  }), /missing encoded image/);
});
