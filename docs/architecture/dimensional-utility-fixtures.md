# Dimensional Utility — reference fixture and evaluation plan

Status: **Proposed, non-normative**.

Browser-openable prototype: [standalone reference fixture](../examples/dimensional-utility-reference.html). A preliminary, **unverified local browser report** is recorded in [browser observations](dimensional-utility-browser-evidence.md); its pass count is not independently reproducible and is not acceptance evidence. The complete review matrix below remains outstanding. Companion to [proposed RFC-0008](../decisions/RFC-0008-dimensional-utility-materials.md). This is an evidence and acceptance plan, not a stable CSS/token/component contract.

## Baseline and variants

All variants use the **same semantic content, controls, reading order, and grid tracks**. F0 deliberately preserves the accepted flat composition with a contiguous zero-gap shared-border grid, square section corners, and square native-style button/status boundaries; only proposed variants may introduce additional radius, gloss, elevation, or inset treatment. This prevents the control from inheriting experimental card chrome. Preserve working links, one button with an accessible name, a status label with readable text, a heading, a callout, and a content region. Use the accepted Utility/Cambium baseline as control. A static information card must not gain pointer cursor or motion in any variant.

| Fixture | Visual intent | Differentiation to exercise |
| --- | --- | --- |
| F0 flat | ADR-0003 document-like baseline | contiguous borders without gaps, no rounding/elevation, explicit status and conventional controls |
| F1 tinted | subtle tonal/gradient section | text/focus contrast across the gradient |
| F2 raised | softly bounded panel | hierarchy without competing floating cards |
| F3 gloss | short bevel and highlight on a real button | pressed/focus/disabled distinguishable independently of shine |
| F4 inset | data/code well within ordinary document flow | correct contrast and visible boundaries |
| F5 accent-edge | left-edge mark on heading/callout | semantics and hierarchy still clear without color or CSS |

A candidate may combine F1/F2 once the isolated variants pass; the initial reference comparison should avoid stacking shadows, gloss and large radii. Exact hue, decorative botanical forms and brand glyphs remain product-owned.

## Consumer evidence mapping

- [Digitalis community styles](https://github.com/hackelia-micrantha/digitalis-community/blob/c03570962a89f5d77e37ff5e0a7b37a514f59a27/web/styles.css): paper/tinted surfaces, gradient hero, pill/status, shadowed panels, left-edge status metadata.
- [Envuscator community styles](https://github.com/hackelia-micrantha/envuscator-community/blob/54119ac6873bce47a47b12a1622c5c213934309b/web/styles.css): bounded tinted card treatments, gradient action buttons, rounded panels, diffuse shadow.
- [Envuscator Micrantha styles](https://github.com/hackelia-micrantha/envuscator-community/blob/54119ac6873bce47a47b12a1622c5c213934309b/web/micrantha.css): highlight gradient and bounded mark.
- [Dubnium Community site](https://github.com/hackelia-micrantha/dubnium-community/blob/ddff22e61351469b2b512b1002f3bc839e4579a2/site/index.html): minimal white/flat Utility control after preview refinement; persistent page/section color bands and dividers removed, with consumer-owned low-chroma color retained only for local hover feedback.

These files are **input evidence**, not normative tokens, framework requirements, or mandatory restyling instructions for those consumers. The Dubnium example is specifically useful as a minimal control: dimensional/tinted treatments must remain optional rather than profile defaults. Compare against current source/commit when capturing screenshots; production deployment state may differ.

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
- Existing Utility remains default and conforming; a minimal white/flat consumer must continue to pass unchanged, and dimensional deployment remains opt-in per consumer.
- No generic Lamina Card/Pill/Badge additions solely because the visual fixture exists.
- No automatic Cambium rewrite based on heuristic surface detection.

## Expected evidence record

For each fixture, capture: consumer/source commit, fixture identifier, screenshots or visual test reference, browser/platform, color scheme, contrast result, keyboard/forced-colors result, CSS weight, rendering observations, and reviewer decision. A checkmark without verifiable evidence is insufficient.
