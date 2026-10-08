// Screenshot-only recovery for a known transient ChromeDriver navigation/page-detach race.
// This does not retry semantic assertions, other WebDriver errors, or changed documents.
const DETACH = /aborted by navigation:\s*Not attached to an active page/i;
const SCREENSHOT_500 = /^GET \/session\/[^\s/]+\/screenshot failed: 500\b/;

export function isTransientScreenshotDetach(error) {
  const message = String(error?.message || "");
  return SCREENSHOT_500.test(message) && /"error"\s*:\s*"timeout"/i.test(message) && DETACH.test(message);
}

function assertPageIdentity(actual, expectedUrl, initialTimeOrigin) {
  if (!actual || actual.readyState !== "complete" || actual.href !== expectedUrl ||
      !Number.isFinite(actual.timeOrigin) ||
      (initialTimeOrigin !== null && actual.timeOrigin !== initialTimeOrigin)) {
    throw new Error("Screenshot document identity/readyState differs from expected fixture");
  }
  return actual.timeOrigin;
}


// PNG screenshot evidence must be more than a permissively decoded Base64 string.
// Verify signature, bounded chunk framing, CRCs, image size and a final IEND.
// This verifies integrity/structure, not user-visible rendering quality.
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function pngCrc32(buffer, start, end) {
  let crc = 0xffffffff;
  for (let i = start; i < end; i += 1) {
    crc ^= buffer[i];
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ ((crc & 1) === 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function verifyPngScreenshot(encoded) {
  if (typeof encoded !== "string" || encoded.length > 64 * 1024 * 1024 ||
      encoded.length < 8 || encoded.length % 4 !== 0 ||
      !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) {
    throw new Error("Screenshot is not canonical Base64 PNG data");
  }
  const data = Buffer.from(encoded, "base64");
  if (data.toString("base64") !== encoded || data.length < 57 ||
      !data.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error("Screenshot PNG signature or encoding is invalid");
  }
  let offset = 8;
  let seenIHDR = false;
  let seenIDAT = false;
  let seenIEND = false;
  while (offset < data.length) {
    if (data.length - offset < 12) {
      throw new Error("Screenshot PNG contains a truncated chunk");
    }
    const chunkLength = data.readUInt32BE(offset);
    if (chunkLength > data.length - offset - 12) {
      throw new Error("Screenshot PNG chunk exceeds available data");
    }
    const type = data.toString("ascii", offset + 4, offset + 8);
    if (!/^[A-Za-z]{4}$/.test(type) ||
        data.readUInt32BE(offset + 8 + chunkLength) !==
          pngCrc32(data, offset + 4, offset + 8 + chunkLength)) {
      throw new Error("Screenshot PNG chunk type or CRC is invalid");
    }
    if (!seenIHDR) {
      if (type !== "IHDR" || chunkLength !== 13 ||
          data.readUInt32BE(offset + 8) === 0 ||
          data.readUInt32BE(offset + 12) === 0) {
        throw new Error("Screenshot PNG missing valid image header");
      }
      seenIHDR = true;
    } else if (type === "IHDR") {
      throw new Error("Screenshot PNG repeats the image header");
    } else if (type === "IDAT") {
      if (chunkLength === 0) throw new Error("Screenshot PNG has empty image data");
      seenIDAT = true;
    } else if (type === "IEND") {
      if (chunkLength !== 0 || !seenIDAT ||
          offset + 12 + chunkLength !== data.length) {
        throw new Error("Screenshot PNG is missing image data or a final terminator");
      }
      seenIEND = true;
    }
    offset += 12 + chunkLength;
    if (seenIEND) break;
  }
  if (!seenIHDR || !seenIDAT || !seenIEND) {
    throw new Error("Screenshot PNG has incomplete image data or no IEND chunk");
  }
}

// Returns base64 data. onAttempt records sanitized, bounded evidence even on failure.
export async function captureWithVerifiedRetry({
  expectedUrl, getPageState, capture, onAttempt, allowDetachRetry = false,
  pause = () => Promise.resolve(),
}) {
  if (typeof expectedUrl !== "string" || !expectedUrl.startsWith("file://")) {
    throw new Error("Screenshot fixture must be a local file URL");
  }
  let initialTimeOrigin = null;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      initialTimeOrigin = assertPageIdentity(
        await getPageState(), expectedUrl, initialTimeOrigin,
      );
    } catch (error) {
      onAttempt({ attempt, status: "fail", reason: "page-identity" });
      throw error;
    }
    let encoded;
    try {
      encoded = await capture();
    } catch (error) {
      if (!allowDetachRetry || !isTransientScreenshotDetach(error)) {
        onAttempt({ attempt, status: "fail", reason: "non-retryable-capture-error" });
        throw error;
      }
      if (attempt === 2) {
        onAttempt({ attempt, status: "fail", reason: "page-detach-exhausted" });
        throw error;
      }
      onAttempt({ attempt, status: "retry", reason: "chromedriver-page-detach" });
      // A changed document, non-ready state, or failed inspection is a hard stop.
      try {
        assertPageIdentity(await getPageState(), expectedUrl, initialTimeOrigin);
      } catch (identityError) {
        onAttempt({ attempt, status: "fail", reason: "page-identity-after-detach" });
        throw identityError;
      }
      await pause();
      continue;
    }
    try {
      assertPageIdentity(await getPageState(), expectedUrl, initialTimeOrigin);
      verifyPngScreenshot(encoded);
    } catch (error) {
      onAttempt({ attempt, status: "fail", reason: "post-capture-identity-or-image" });
      throw error;
    }
    onAttempt({ attempt, status: "pass", reason: "verified-screenshot" });
    return encoded;
  }
  throw new Error("Unreachable screenshot retry state");
}
