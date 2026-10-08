// Screenshot-only recovery for a known transient ChromeDriver navigation/page-detach race.
// This does not retry semantic assertions, other WebDriver errors, or changed documents.
const DETACH = /aborted by navigation:\s*Not attached to an active page/i;
const SCREENSHOT_500 = /^GET \/session\/[^\s/]+\/screenshot failed: 500\b/;

export function isTransientScreenshotDetach(error) {
  const message = String(error?.message || "");
  return SCREENSHOT_500.test(message) && DETACH.test(message);
}

function assertPageIdentity(actual, expectedUrl) {
  if (!actual || actual.readyState !== "complete" || actual.href !== expectedUrl) {
    throw new Error("Screenshot page identity/readyState differs from expected fixture");
  }
}

// Returns base64 data. onAttempt records sanitized, bounded evidence even on failure.
export async function captureWithVerifiedRetry({
  expectedUrl, getPageState, capture, onAttempt, pause = () => Promise.resolve(),
}) {
  if (typeof expectedUrl !== "string" || !expectedUrl.startsWith("file://")) {
    throw new Error("Screenshot fixture must be a local file URL");
  }
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      assertPageIdentity(await getPageState(), expectedUrl);
    } catch (error) {
      onAttempt({ attempt, status: "fail", reason: "page-identity" });
      throw error;
    }
    let encoded;
    try {
      encoded = await capture();
    } catch (error) {
      if (!isTransientScreenshotDetach(error)) {
        onAttempt({ attempt, status: "fail", reason: "non-retryable-capture-error" });
        throw error;
      }
      if (attempt === 2) {
        onAttempt({ attempt, status: "fail", reason: "page-detach-exhausted" });
        throw error;
      }
      onAttempt({ attempt, status: "retry", reason: "chromedriver-page-detach" });
      // A changed document, non-ready state, or failed inspection is a hard stop.
      assertPageIdentity(await getPageState(), expectedUrl);
      await pause();
      continue;
    }
    try {
      assertPageIdentity(await getPageState(), expectedUrl);
      if (typeof encoded !== "string" || encoded.length < 8) {
        throw new Error("Screenshot result was missing encoded image data");
      }
    } catch (error) {
      onAttempt({ attempt, status: "fail", reason: "post-capture-identity-or-image" });
      throw error;
    }
    onAttempt({ attempt, status: "pass", reason: "verified-screenshot" });
    return encoded;
  }
  throw new Error("Unreachable screenshot retry state");
}
