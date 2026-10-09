# iOS Safari review protocol — Phyllotaxis gallery

Status: **unexecuted**. This is a manual verification protocol and evidence record for [issue #76](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/76), **not** Safari test evidence or a release gate for the private package.

## Scope and preparation

Open the **published** [reference gallery](https://hackelia-micrantha.github.io/phyllotaxis-community/) and [material lab](https://hackelia-micrantha.github.io/phyllotaxis-community/material-playground.html) on a real device running Apple Safari. Confirm that the URLs load; if the second address redirects to a trailing slash or gives a 404, use `material-playground.html` **without** the trailing slash.

Record the date, exact public repository main SHA deployed, device/model, iOS version, Safari version (where visible), content-blocker extensions or browser settings that could affect the page, physical orientation, and **observed CSS viewport dimensions**. Do not treat nominal screen resolution or device name as observed CSS viewport width. For a usable record, a browser inspection tool or capture with identifiable size and browser settings is needed.

The gallery and material demo are example-owned HTML/CSS and have **no JavaScript**. Do not interpret this session as test coverage for a released Phyllotaxis package.

## Procedure

1. **Initial layout:** In portrait, view the gallery at page top and scroll to all three examples. Capture the header, intro, all three cards and footer. Record unwanted horizontal scrolling, truncation, overlap, or unexpectedly large blank bands. Rotate to landscape and repeat. Distinguish ordinary intentional spacing from missing content.
2. **System appearance:** With the device in light appearance, load the material page and select **System**. Record background and foreground contrast, text/link differentiation, matte/bevel/shadow/gloss distinctions. Change the device to dark appearance and repeat **without manually choosing Dark**. Confirm the page follows OS preference. Test manual **Light** and **Dark** options and return to System.
3. **Control and action semantics:** Tap the native radio labels, the **Inspect design notes** link, and the beveled navigation pills. Check that every action behaves as a real link, all static status/cards remain noninteractive, and each touch target is reliably selectable without touching an adjacent control.
4. **Keyboard, if available:** With a hardware keyboard (or supported accessibility input), Tab into the theme radio group and use arrow keys to change selection. Document visible focus and selected indicator. **Not tested** is acceptable if no keyboard is available—do not substitute programmatic click evidence.
5. **Accessibility and responsiveness:** Enable Larger Text / text-only resizing where Safari applies it, examine maximum practical zoom and pinch zoom, and enable Reduce Motion. Revisit the page and note any clipped content, overlap, scrolling and reduced-motion effects. Where supported, check increased contrast / VoiceOver semantics and label names.
6. **Evidence handling:** Capture screenshots for each tested combination and note exact settings. Do not upload raw screenshots containing private notifications, account details or browser UI with personal information. Post a concise anonymized result to #76 or a reviewed public issue/PR; attach evidence only with consent.

## Observation record (fill only after testing)

| Case | Actual device, width and settings | Result (pass/fail/unsupported/not tested) | Evidence and limitation |
| --- | --- | --- | --- |
| Portrait page reflow | Not tested | Not tested | |
| Landscape page reflow | Not tested | Not tested | |
| OS light and dark follow System radio | Not tested | Not tested | |
| Explicit Light / Dark radios | Not tested | Not tested | |
| Tap links/pills, static cards stay noninteractive | Not tested | Not tested | |
| Hardware keyboard focus/arrow keys | Not tested | Not tested | |
| Text scaling, pinch zoom and reflow | Not tested | Not tested | |
| Reduced Motion, contrast, VoiceOver (where available) | Not tested | Not tested | |

## Completion boundary

Firefox WebDriver BiDi (when supported) can qualify CSS widths on Linux, but it **cannot close** the Safari/iOS platform gate. A remote WebKit-on-Linux emulator likewise is not proof of iOS Safari. Record exact platform behavior and representative device evidence before updating the iOS-specific acceptance task.

Independent B1–B3 hierarchy and false-affordance research belongs to [issue #63](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/63). Accepted ADR-0003 flat-first and ADR-0008 advisory dimensional guidance remain unchanged. No new token, Lamina component, private implementation, deploy or release is authorized here.
