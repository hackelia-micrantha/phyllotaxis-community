# Dimensional Utility — browser evidence and historical observations

- **Evidence status:** A checked-in public harness now reproduces the portable current-fixture matrix in CI. Historical local 58/58 and 66/66 reports remain **unverified historical observations** and must not be promoted into current evidence.
- **Historical report date:** 2026-10-07
- **Current reference:** [standalone HTML fixture](../examples/dimensional-utility-reference.html), Git blob `93b99890c76efb06c43a5c1a7c75232ca8b6d6d5` (flat F0 baseline, corrected control contrast, and visibly distinct F3 pressed state).
- **Historical input for the 58-check report:** Git blob `a32ffc0f49716ea30a8bffb31e668e69386a6b51`; the original report does not apply to the current HTML unchanged.
- **Historical reported environment:** Chromium `144.0.7559.96`, Linux headless.
- **Decision reference:** [QART-0008](../decisions/QART-0008-dimensional-utility-materials.md) → [RFC-0008, advisory-only acceptance](../decisions/RFC-0008-dimensional-utility-materials.md).
- **Validation plan:** [F0–F5](dimensional-utility-fixtures.md).

## What was reported

A previous local session **reported 58/58 passing checks** (52 primary and 6 extended) against the **historical** HTML blob, before F0's shared-border correction. **This count is an unverified account of local work, not independently reproducible test evidence.** No executable browser test files, captured assertions or step-by-step logs are included in the public repository. It must **not** be used to claim that the acceptance matrix has passed, that an accessibility certification exists or that the proposed RFC is accepted.

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

## F0 baseline correction — subsequent local observation

The reference fixture now uses a zero-gap, contiguous border-sharing grid, square F0 control and square status/button boundaries, reserving rounded and elevated treatments for variants. A subsequent local Chromium exercise reported 66/66 checks against the exact updated Git blob, including computed-style differentiation, light/dark, narrow layout, CSS zoom stress, focus and forced-colors emulation. **Those checks and screenshots remain local-only and are not a public reproducible test outcome**; the reproduction gates below remain open.

## Reproducible public harness

Issue #57 adds a checked-in, dependency-free Node/WebDriver harness at `tools/dimensional-utility-evidence.mjs` plus a GitHub-hosted browser-evidence workflow.

Reproduce the portable matrix on Linux with the pinned repository flake:

```sh
nix develop .#browser-evidence --command \
  node tools/dimensional-utility-evidence.mjs \
  --output artifacts/dimensional-utility \
  --format text
```

The harness uses Nix-provided Chromium/ChromeDriver and Firefox/geckodriver, records the exact fixture Git-blob/SHA-256 identity, browser versions, viewport/reflow checks, semantic/keyboard evidence, light/dark observations, bounded performance samples, source-size deltas, and screenshots.

Harness `0.4.0` adds versioned `screenshotCaptures` evidence and verifies canonical Base64 PNG signature, complete chunk boundaries, image header/data/terminator, and chunk CRCs before recording a screenshot pass. This structural integrity check is **not** pixel, visual or accessibility certification.

Screenshot capture uses a **single bounded retry** only for the known ChromeDriver HTTP-500 navigation/page-detach error. Both attempts verify the exact local fixture URL and complete document readiness; changed pages, unavailable identity, unrelated errors, missing image data and exhausted retry attempts **fail closed**. `evidence.json` includes `screenshotCaptures` with a sanitized attempt/status/reason record, including failures. The Node built-in regression suite runs before the real browser matrix. Successful retry is observable evidence of a transient harness recovery, **not** proof that the first screenshot attempt or the browser run was stable. This does not retry any semantic assertions.

The existing `--fixture PATH` option changes only the F0–F5 reference input. B1–B3 is loaded independently from the repository-owned `docs/examples/dimensional-utility-boundaries.html` and is recorded with its own blob/SHA-256 identity. A CI regression check copies the F0–F5 HTML to a temporary directory with no boundary companion file and runs the full two-engine harness against that external path. This keeps the public CLI compatible without silently changing which boundary fixture supplies evidence. It emits:

The CLI supports `--help`, `--version` (currently `0.4.0`), and `--format text|json`. To inspect version without launching browsers, run `node tools/dimensional-utility-evidence.mjs --version`; `--format json --version` emits a JSON object with `harnessVersion`. The harness records its own version alongside the evidence schema version.  Text mode emits a compact human status line. JSON mode emits a versioned single-object stdout contract containing source identity, summary counts, and artifact names; diagnostics/errors remain on stderr and required evidence or harness failures return non-zero.

- `evidence.json` — versioned machine-readable evidence;
- `summary.md` — concise reviewer-oriented status;
- bounded screenshots for each browser/scheme.

Unsupported browser/environment capabilities are emitted as `unsupported`; they are **not** converted into passes. Accessibility and interaction observations exercise the already-accepted accessibility and interaction-motion authorities. RFC-0008-specific interpretation is limited to dimensional composition, stacking/elevation hierarchy, restrained gloss/bevel/inset use, and rendering cost.

Actual browser-level 200% zoom is attempted through browser keyboard shortcuts and verified by observable scale/viewport change. If headless WebDriver does not expose that change, the result remains an explicit evidence gap.

Starting at harness `0.4.0`, two additional **CSS-injected, reproducible stress modes** inspect the F0–F5 and B1–B3 documents: (1) `html { font-size: 200% !important }` for root-font scaling, and (2) a WCAG 1.4.12-style text-spacing override of 1.5× line-height, 2× paragraph spacing, `0.12em` letter spacing and `0.16em` word spacing; a combined mode applies both. The WebDriver harness checks expected viewport, no horizontal overflow, visible links/buttons and preserved sections at 1280, 375 and 320 CSS pixels. Firefox clamping narrow windows remains **unsupported** rather than passed. These injections are **not native browser text-only resize or browser zoom**. They do not establish target-size compliance, font availability, OS settings, real assistive-technology behavior or full WCAG conformance. Exact input, requested/observed viewport and mode results are recorded per scheme/browser in `evidence.json`.

## Reproduction plan — public harness plus remaining environment gaps

1. Obtain the HTML fixture from the reviewed commit; the harness records both Git-blob identity and SHA-256 before executing checks.
2. Record browser binary/build, OS, test harness version, viewport, zoom method, color scheme, reduced-motion and forced-colors configuration.
3. Inspect each F0–F5 variant at desktop, 375px and 320px; test actual browser zoom at 100% and 200%, keyboard focus with computed visible outline contrast, no-JS/no-CSS reading order, anchor/button navigation, and hover/pressed/disabled semantics as applicable. Chromium forced-colors emulation must check computed control boundaries and focused outlines, not just media-query activation. Separately exercise the B1–B3 combined/negative/relative-elevation cases identified in the fixture plan.
4. Preserve the generated `evidence.json`, `summary.md`, and bounded screenshots from the exact CI head, including failures and unsupported checks.
5. Calculate contrast for text, links, focus indicators and interactive boundaries at gradient extrema; record relevant CSS/HTML byte counts.
6. Re-run in at least one additional browser engine and real assistive-technology environment where available. Measure compiled consumer CSS and rendering performance against the accepted flat Utility baseline before any token or component promotion.
7. Publish the runnable harness and durable results through an appropriate public evidence surface or link immutable, reviewable artifacts; only then change the evidence status to validated.

## Conclusion

This document records **reproducible fixture observations alongside unresolved accessibility and consumer-evidence gaps**. The consumer sources are pinned in [QART-0008](../decisions/QART-0008-dimensional-utility-materials.md). [ADR-0008](../decisions/ADR-0008-dimensional-utility-advisory-guidance.md) already accepts **advisory-only** dimensional composition review, but neither that decision nor these browser checks demonstrate application-wide accessibility, production performance, or fitness for every consumer. ADR-0003's flat-first Utility baseline remains authoritative.
