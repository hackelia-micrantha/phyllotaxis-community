# Dimensional Utility — preliminary local browser observations

- **Evidence status:** Unverified local report; **not reproducible/auditable from this repository** because no test harness, command transcript or captured browser artifacts were committed.
- **Report date:** 2026-10-07
- **Input:** [standalone HTML reference fixture](../examples/dimensional-utility-reference.html), Git blob `a32ffc0f49716ea30a8bffb31e668e69386a6b51`.
- **Reported environment:** Chromium `144.0.7559.96`, Linux headless.
- **Decision reference:** [QART-0008](../decisions/QART-0008-dimensional-utility-materials.md) → [proposed RFC-0008](../decisions/RFC-0008-dimensional-utility-materials.md).
- **Validation plan:** [F0–F5](dimensional-utility-fixtures.md).

## What was reported

A previous local session **reported 58/58 passing checks** (52 primary and 6 extended) against the specified HTML blob. **This count is an unverified account of local work, not independently reproducible test evidence.** No executable browser test files, captured assertions or step-by-step logs are included in the public repository. It must **not** be used to claim that the acceptance matrix has passed, that an accessibility certification exists or that the proposed RFC is accepted.

| Area | Reported local observation | Verification still required |
| --- | --- | --- |
| Layout/reflow | Desktop 1280px and narrow 375px; simulated 2× CSS zoom at 320px after reflow correction | Reproduce with browser zoom, assistive magnification and alternative font metrics |
| Link/button semantics and focus | Named links/buttons and focus outline appeared | Publicly runnable keyboard and accessibility-tree assertions |
| Forced-colors | Chromium emulation showed bounded controls and focus | Real Windows High Contrast and other browser implementations |
| Reduced motion | No movement on static panels | Reproducible media-emulation test |
| Without JavaScript/CSS | Content order and anchor navigation appeared intact | Reproducible navigation and progressive-enhancement checks |
| Contrast | Sampled foreground/background pairs reportedly exceeded 4.5:1 | Recompute exact gradient extrema and non-text/focus states |
| Source CSS size | Reported 2,585 B plain and 1,113 B gzip | Recompute against exact blob and measure production CSS separately |
| HTML size | Reported 5,042 B plain and 1,775 B gzip | Recompute against exact blob |

## Reported contrast samples — unverified

These numbers were reported from a local WCAG-formula calculation, not captured in a committed automated test. They are useful as targets to independently recompute, not as proven conformance.

| Pair | Light | Dark |
| --- | ---: | ---: |
| Main ink / paper | 13.193 | 14.803 |
| Link / paper | 6.447 | 9.306 |
| Link / raised | 7.038 | 6.961 |
| Link / tinted endpoint | 6.012 | 5.913 |
| Main ink / tinted endpoint | 12.303 | 9.406 |
| Main ink / raised | 14.402 | 11.072 |
| Main ink / inset | 11.934 | 15.606 |
| Muted / paper | 6.846 | 11.741 |

## Previously reported correction

The local session reportedly found horizontal overflow at a 320px viewport with `zoom:2` and subsequently changed fixture padding and `overflow-wrap:anywhere` for headings and links. That **source change exists in the committed HTML** and can be independently inspected. Its behavior still needs a reproducible check. CSS `zoom` is only a stress-test approximation, not native browser zoom.

## Reproduction plan — not yet executed in public CI

1. Obtain the HTML fixture from the reviewed commit and verify the source blob with `git hash-object`.
2. Record browser binary/build, OS, test harness version, viewport, zoom method, color scheme, reduced-motion and forced-colors configuration.
3. Inspect each F0–F5 variant at desktop, 375px and 320px; test actual browser zoom at 100% and 200%, keyboard focus, no-JS/no-CSS reading order, anchor/button navigation, and hover/pressed/disabled semantics as applicable.
4. Capture machine-readable assertions, console output and screenshot references for all tested states, including failures and rerun details.
5. Calculate contrast for text, links, focus indicators and interactive boundaries at gradient extrema; record relevant CSS/HTML byte counts.
6. Re-run in at least one additional browser engine and real assistive-technology environment where available. Measure compiled consumer CSS and rendering performance against the accepted flat Utility baseline before any token or component promotion.
7. Publish the runnable harness and durable results through an appropriate public evidence surface or link immutable, reviewable artifacts; only then change the evidence status to validated.

## Conclusion

This document records **preliminary observations and open verification work**. The public fixture is inspectable and the consumer style sources are pinned in the [QART](../decisions/QART-0008-dimensional-utility-materials.md), but current evidence alone does not establish browser conformance, a production performance win or acceptance of RFC-0008. The accepted ADR-0003 flat Utility guidance remains authoritative.
