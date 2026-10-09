# SPACE-001 — Pinned public consumer rendering evidence

- **Status:** Completed bounded Chromium/Firefox source-layout experiment; **not** full integration or accessibility evidence
- **Date:** 2026-10-08 local / GitHub CI 2026-10-09 UTC
- **Tracking:** [#87](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/87) and parent [#79](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/79)
- **Proposal under evaluation:** [RFC-0009](../decisions/RFC-0009-spatial-rhythm.md), status **proposed**
- **Harness:** [spatial-consumer-evidence.mjs](../../tools/spatial-consumer-evidence.mjs)
- **CI:** [SPACE-001 Pinned Consumer Evidence](../../.github/workflows/spatial-consumer-evidence.yml)
- **Exact-head successful run:** [#37898722104](https://github.com/hackelia-micrantha/phyllotaxis-community/actions/runs/37898722104), source head `85b4370198e248b034c7cb812fde6bb6f532e81a`
- **Artifact:** [36 screenshots and manifest](https://github.com/hackelia-micrantha/phyllotaxis-community/actions/runs/37898722104/artifacts/11600818792) (GitHub artifact retention 14 days)

## Actual sources under test (not synthetic duplicate content)

The browser harness downloads public `web/` files at **immutable source commits**, verifies each Git blob SHA-1 before staging, records SHA-256, and renders the actual pages with their original stylesheet in a temporary offline file directory.

| Consumer page | Immutable revision | Evidence role |
| --- | --- | --- |
| [Digitalis Community homepage](https://github.com/hackelia-micrantha/digitalis-community/blob/c03570962a89f5d77e37ff5e0a7b37a514f59a27/web/index.html) | `c03570962a89f5d77e37ff5e0a7b37a514f59a27` | Real technical/status and grouped card page |
| [Digitalis Community whitepaper](https://github.com/hackelia-micrantha/digitalis-community/blob/c03570962a89f5d77e37ff5e0a7b37a514f59a27/web/whitepaper.html) | same Digitalis commit | Real long-form technical editorial with seven section separators |
| [Envuscator Community site](https://github.com/hackelia-micrantha/envuscator-community/blob/54119ac6873bce47a47b12a1622c5c213934309b/web/index.html) | `54119ac6873bce47a47b12a1622c5c213934309b` | Second independent real consumer site and technical architecture regions |

These are real deployed-project *source pages*, but **not imports of the private `@micrantha/phyllotaxis` package**. Consumer integration with the candidate `<Stack gap="section">` API remains untested and cannot be inferred from these results.

## Comparison controls

Each page is rendered at its **actual baseline**, plus two browser-injected CSS-only experiments: **targeted** (+1.5rem/24 CSS px) and **spacious** (+3rem/48 CSS px) padding at the existing major-section boundary. Text content, heading structure, visual surface, card interiors, tables and peer-grid gaps are not modified.

Envuscator's `.section.honesty` is a **special inset/card-like section** whose internal padding differs from ordinary region spacing. An initial experiment incorrectly included it; the initial [run #37898440636](https://github.com/hackelia-micrantha/phyllotaxis-community/actions/runs/37898440636) showed a nonuniform 64px/88px change at that panel. It was excluded by `:not(.honesty)`; the final run requires **uniform 24px/48px** padding changes on all four remaining ordinary Envuscator sections and verifies the resulting page-height delta matches the summed section changes.

The CSS overlay is an experimental consumer styling rule, *not* an accepted Chroma CSS variable, a published Venation prop, or evidence that these sites ship Phyllotaxis.

## Actual measured results

Chromium widths 320/375/768/1280 CSS px, light/dark-preference requests, and Firefox widths 768/1280 at system preference yielded **54 passed observations, 36 recorded as unsupported dark-theme observations, zero failed, zero not-run**. Three pages were measured across baseline/targeted/spacious. Three native WebDriver keyboard Tab probes found visible focus on each site's skip link at 375px. There are **36 Chromium screenshots**, captured around the first actual section at every tested width in each light-mode variant. No full-page screenshot or human reviewer preference score was produced.

At **375 CSS px in Chromium**, with remote webfonts omitted in the offline render:

| Actual page | Baseline page height | Targeted (+24px/section) | Spacious (+48px/section) | Preserved peers |
| --- | ---: | ---: | ---: | --- |
| Digitalis status | 8,921 px | 9,017 px (+96) | 9,113 px (+192) | Yes |
| Digitalis whitepaper | 9,141 px | 9,309 px (+168) | 9,477 px (+336) | Yes |
| Envuscator architecture | 10,832 px | 10,928 px (+96) | 11,024 px (+192) | Yes |

These are descriptive observations of *offline documents with fixed content*, not performance measurements, optimal design values, or thresholds. The harness also checked that the overlay did not introduce new horizontal overflow compared with each page's own baseline, and that measured peer/card spacing declarations were unchanged.

**Observed correction:** Padding and major-section distance must not be conflated with special component-owned insets. The Envuscator inset case demonstrates why a generic selector like `.section` is not enough to classify semantic section rhythm.

## Unsupported and not-yet-established evidence

- **Dark mode:** all three sites retained their light background when Chromium emulated `prefers-color-scheme: dark`. Browser cases still record measurements, but the **36 dark-preferring cases are marked unsupported**, not “dark theme passed.” No dark screenshots support design approval.
- **Offline fidelity:** Digitalis Google Fonts links were removed from the temporary HTML to prevent remote browser font downloads; that changes glyph metrics and may change wrapping. The original source hashes are preserved. Production hosting, image/CDN/routing behavior and real application dependencies are not tested.
- **Actual integration:** no Phyllotaxis package was imported into these sites, and no candidate `Stack` implementation was run.
- **Interaction:** a visible skip-link focus state was observed by WebDriver, but not a full keyboard audit or touch/target assessment.
- **Browser/reader coverage:** Firefox was run only at 768/1280 and system mode. Actual zoom, text-only resizing, WCAG spacing override, long-language expansion, forced colors, Safari/iOS, screen readers and independent usability preference were **not assessed**.
- **Evidence preservation:** screenshot capture is 900 CSS px around an actual section; whole-page context is represented numerically in document-height metrics, not by complete visual screenshots.
- **Performance:** site CSS/render timing, Core Web Vitals and repeat variance were not benchmarked; extra page height is not equivalent to slower performance.

## RFC disposition and next gate

**Recommendation: retain RFC-0009 as a narrow *proposal*, not an ADR.** Evidence confirms that actual source pages can vary the spacing between major regions independently of local card/group gaps, and shows why component-owned insets must be excluded. It does **not** establish that a shared `Stack.gap="section"` public API is preferable to existing `Stack.gap="xl"` plus consumer CSS or that every consumer should adopt more whitespace.

Next: run a **package-integrated**, isolated Utility status and Editorial article comparison, with Chroma profile carriers/alias resolution, actual responsive media evidence, CSS import and inspection-contract compatibility, plus a real human reading/scanning review. Retain [#87](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/87) open until those gates pass or the proposal is narrowed/rejected. Keep existing Utility defaults, private implementation and consumer production branches unchanged.

To reproduce after checkout of a reviewed Phyllotaxis public commit (with outbound access to pinned public GitHub raw sources):

```sh
nix develop .#browser-evidence --command node tools/spatial-consumer-evidence.mjs \
  --output artifacts/space-consumers \
  --source-sha "$(git rev-parse HEAD)"
```

Review `artifacts/space-consumers/manifest.json` for original Git blob hashes, screenshot paths, unsupported statuses, measured section geometry and the zero-failure condition. The evidence bundle is intentionally not deployed through the public Pages gallery or included in a product package.
