# Dimensional Utility — browser evidence (Chromium)

- **Evidence status:** Observed for the standalone reference fixture; not comprehensive cross-browser or production conformance.
- **Test date:** 2026-10-07
- **Source:** `docs/examples/dimensional-utility-reference.html`, Git blob `a32ffc0f49716ea30a8bffb31e668e69386a6b51`
- **Browser:** Chromium `144.0.7559.96`, Linux headless
- **Run context:** Local isolated browser evaluation of the *exact Git blob*, not a live consumer deployment
- **Decision reference:** [QART-0008](../decisions/QART-0008-dimensional-utility-materials.md) → [RFC-0008](../decisions/RFC-0008-dimensional-utility-materials.md) → [ADR-0008 (proposed)](../decisions/ADR-0008-dimensional-utility-materials.md)
- **Fixture plan:** [F0–F5](dimensional-utility-fixtures.md)

## Results

The final fixture passed **58/58 executable browser checks** (52 main checks plus 6 extended checks).

| Gate | Observed result | Scope and caveats |
| --- | --- | --- |
| Layout | Pass | 1280px desktop, 375px narrow, light and dark; simulated 200% CSS zoom at 375px and 320px; no horizontal overflow after responsive patch |
| Accessible controls | Pass | Six named links and six named buttons exposed in Chromium accessibility tree in light/dark |
| Keyboard focus | Pass | `:focus-visible` outline was present for representative link and button in all tested viewport/scheme conditions |
| Forced-colors | Pass | Chromium emulation preserved visible boundaries and button focus outline; not independently verified on Windows High Contrast |
| Reduced-motion | Pass | Browser media emulation active; no static card interactions/motion |
| No JavaScript | Pass | Sections and controls present; link and form-button navigation to reference anchor both activated |
| CSS disabled | Pass | All six headings, controls and textual status labels remained in native document order |
| Contrast | Pass on sampled role combinations | Foreground versus flat/gradient endpoint colors, rather than screenshot-wide pixel/AA analysis |
| Reference CSS footprint | 2,585 B plain / 1,113 B gzip | Standalone inline fixture styles only; not a product CSS delta or production render benchmark |
| HTML fixture footprint | 5,042 B plain / 1,775 B gzip | Entire standalone source, not deployed transfer size |

### Sampled text contrast ratios (WCAG formula)

| Combination | Light | Dark |
| --- | ---: | ---: |
| Main ink / paper | 13.193 | 14.803 |
| Link / paper | 6.447 | 9.306 |
| Link / raised | 7.038 | 6.961 |
| Link / tinted endpoint | 6.012 | 5.913 |
| Main ink / tinted endpoint | 12.303 | 9.406 |
| Main ink / raised | 14.402 | 11.072 |
| Main ink / inset | 11.934 | 15.606 |
| Muted / paper | 6.846 | 11.741 |

All recorded comparisons exceed 4.5:1, but this is not a full automated WCAG audit. Gradient extrema were evaluated using candidate endpoint colors, not every antialiased rendered pixel.

## Finding and correction

A more aggressive `320px` viewport with `2×` document zoom originally caused horizontal overflow and a cramped inset chip. The reference fixture was updated with tighter narrow-screen spacing plus `overflow-wrap:anywhere` for headings and links. The final exact Git blob was independently matched by Git's blob hash before rerunning; the 320px/2× scenario then passed.

**Important distinction:** CSS `zoom:2` is a layout stress test and only approximates browser zoom. Actual browser zoom, mobile text enlargement, alternative font metrics, and assistive technologies still require follow-up.

## Remaining gates

- Evaluate the same representative composition in at least one other browser engine and on a real mobile/desktop accessibility environment.
- Add disabled/pressed state, non-text contrast and gradient-overlay checks beyond this small standalone example.
- Capture durable screenshots and browser details as artifacts in the private implementation validation flow when available; this report does not embed image artifacts.
- Benchmark compiled CSS / style recalculation cost against the flat consumer implementation before promoting stable Chroma roles.
- Receive public contract review of ADR-0008 and any conformance implications before treating dimensional roles as normative.

## Conclusion

The browser evidence **supports permitting** carefully bounded dimensional material as **consumer-owned, non-normative Utility presentation** while keeping ADR-0003's flat-first baseline. It does **not yet support mandatory tokens, new generic components, unreviewed production migrations or claims of cross-browser conformance**.
