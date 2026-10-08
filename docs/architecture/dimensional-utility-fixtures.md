# Dimensional Utility — reference fixture and evaluation plan

Status: **Proposed, non-normative**.

Browser-openable prototype: [standalone reference fixture](../examples/dimensional-utility-reference.html). An initial Chromium validation run is recorded in [browser evidence](dimensional-utility-browser-evidence.md); the full cross-browser and production review matrix below remains outstanding. Companion to [proposed RFC-0008](../decisions/RFC-0008-dimensional-utility-materials.md). This is an evidence and acceptance plan, not a stable CSS/token/component contract.

## Baseline and variants

All variants use the **same semantic HTML content and layout**. Preserve working links, one button with an accessible name, a status label with readable text, a heading, a callout, and a content region. Use the accepted Utility/Cambium baseline as control. A static information card must not gain pointer cursor or motion in any variant.

| Fixture | Visual intent | Differentiation to exercise |
| --- | --- | --- |
| F0 flat | ADR-0003 document-like baseline | shared borders, flat low-chroma grouping |
| F1 tinted | subtle tonal/gradient section | text/focus contrast across the gradient |
| F2 raised | softly bounded panel | hierarchy without competing floating cards |
| F3 gloss | short bevel and highlight on a real button | pressed/focus/disabled distinguishable independently of shine |
| F4 inset | data/code well within ordinary document flow | correct contrast and visible boundaries |
| F5 accent-edge | left-edge mark on heading/callout | semantics and hierarchy still clear without color or CSS |

A candidate may combine F1/F2 once the isolated variants pass; the initial reference comparison should avoid stacking shadows, gloss and large radii. Exact hue, decorative botanical forms and brand glyphs remain product-owned.

## Consumer evidence mapping

- `digitalis-community/web/styles.css`: paper/tinted surfaces, gradient hero, pill/status, shadowed panels, left-edge status metadata.
- `envuscator-community/web/styles.css`: bounded tinted card treatments, gradient action buttons, rounded panels, diffuse shadow.
- `envuscator-community/web/micrantha.css`: highlight gradient and bounded mark.

These files are **input evidence**, not normative tokens, framework requirements, or mandatory restyling instructions for those consumers. Compare against current source/commit when capturing screenshots; production deployment state may differ.

## Required review matrix

Each fixture, both light and dark color schemes:

1. Desktop and narrow viewport, browser zoom at 100% and 200%; content and focus must not clip, overlap or become inaccessible.
2. Keyboard-only traversal, `:focus-visible`, hover, pressed and disabled states where applicable; decoration must not substitute for interaction semantics.
3. Reduced-motion: no unnecessary translation/reveal; no animation on a static panel.
4. `forced-colors: active`: explicit readable boundary and keyboard focus; status remains textual.
5. No CSS and no JS: same semantic content, meaningful reading order, actionable links/buttons remain understandable.
6. Contrast: check all text/foreground combinations at weakest points of gradient, not only the average/background center; assess non-text component boundaries and focus indicators.
7. CSS bundle delta (compressed and uncompressed), stylesheet request count and render regressions; record test environment and baseline. Avoid `backdrop-filter` absent demonstrated need.
8. Compare F0 against each variant for task completion, clarity and false affordance. Document rejection as carefully as acceptance.

## Gate for shared API promotion

- A documented need from at least two independent consumers, or a repeated accessibility-significant semantic requirement.
- Values and state mapping defined across schemes without consumer branding.
- Stable public contract and migration/versioning design approved before any private implementation export.
- Existing Utility remains default and conforming; deployment opt-in per consumer.
- No generic Lamina Card/Pill/Badge additions solely because the visual fixture exists.
- No automatic Cambium rewrite based on heuristic surface detection.

## Expected evidence record

For each fixture, capture: consumer/source commit, fixture identifier, screenshots or visual test reference, browser/platform, color scheme, contrast result, keyboard/forced-colors result, CSS weight, rendering observations, and reviewer decision. A checkmark without verifiable evidence is insufficient.
