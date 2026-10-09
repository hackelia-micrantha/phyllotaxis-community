# SPACE-001 — Spatial rhythm comparative review plan

- **Status:** Proposed evidence procedure; fixture is non-normative
- **Date:** 2026-10-08
- **Requirement:** [SPACE-001](../requirements/spatial-rhythm.md)
- **Decision alternatives:** [QART-0009](../decisions/QART-0009-spatial-rhythm.md)
- **Specimen:** [spatial-rhythm-comparison.html](../examples/spatial-rhythm-comparison.html)
- **Tracking:** [#79](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/79)

## What the fixture tests — and does not

Three **synthetic candidate policies** — compact, comfortable, spacious — share the same document content and HTML shape. Local CSS values separately control: outer gutter, section separation, group gap, internal inset, paragraph gap, and table-cell inset. The compact column approximately reflects existing Utility scale references where meaningful; the other values are **not** default Chroma resolutions.

The `data-density` attributes and `--sample-*` CSS properties in the example are local *test apparatus*, **not stable carrier or token contracts**. It is a simple side-by-side composition; no public Phyllotaxis runtime, CLI, private implementation or Pages allowlist is changed. The fixture uses the same content to make density comparisons possible without copy changes.

Static fixture integrity runs under `nix flake check` via `tools/check-spatial-fixture.py`. It verifies:
- exactly three specimen policies and the same five content-block types in each;
- content parity, unique IDs, and no scripts, event handlers or external assets;
- strictly monotonic candidate values for each local spacing role;
- intrinsic narrow-screen composition and explicit keyboard-focus CSS.

Those checks **do not** establish actual browser behavior, accessibility conformance, good visual hierarchy, or superiority of a spacing mode.

## Review matrix

| Dimension | Required contexts | Observation |
| --- | --- | --- |
| Width/reflow | 320 / 375 / 768 / 1280 CSS px; nested/container-constrained grid | No horizontal overflow; sections remain identifiable, controls visible |
| Visual profile | Utility and Editorial consumer compositions (same semantic components) | Roles work regardless of presentation; *fixture itself does not implement both profiles* |
| Scheme | system light and dark; explicit forced colors where supported | Surface distinction without reliance on decorative color; readable focus and text |
| Content enlargement | 200% text-only resize; real browser zoom and WCAG text-spacing override | No clipping or lost information; distinguish actual browser result from CSS simulation |
| Interaction | Tab/Shift+Tab, focus on checkbox and link, target separation | Focus visible/not obscured and target gaps intact |
| Content growth | translated longer labels, 2× explanatory prose, varied heading lengths | No overlap, wrapping errors or unintended white-space explosion |
| Composition | repeated cards, section sequence, form controls, prose, dense table/status | Check proximity, hierarchy and tabular scanability independently |
| Runtime impact | style bytes, layout metrics, render time where warranted | Compare paired baseline; no numeric threshold invented or certification implied |

### Evidence recording

For each combination record **browser/build/source SHA**, exact viewport or settings, specimen policy, screenshots where applicable, measured overflow/focus failures, subjective hierarchy notes, and one of **pass / fail / unsupported / not-run**. A static checker result cannot be counted as browser evidence. Browser settings, zoom and text-only scaling require actual browser execution; a changed root font size is only simulated evidence.

Use current supported Chrome/Chromium and Firefox evidence where possible; Safari/iOS and assistive technology require separate manual coverage. In product adoption, compare **real** Utility status screens and Editorial prose, rather than generalizing directly from these synthetic examples.

## Proposed interpretation criteria

1. A space role should be promoted only when **multiple independent consumers** need the *same semantic purpose* and existing Chroma/Venation vocabulary cannot express it predictably.
2. Prefer **targeted, role-aware** section/gutter/inset differences over global multiplication of all `xs..xl` tokens. Tight grouping in dense tables/forms may remain unchanged while section separation increases.
3. Preserve accepted default Utility scale and profile semantics. An optional density carrier must be justified by repeated user-facing need, coherent inheritance, SSR support, compatibility and versioning — it is not automatically required.
4. Reject any approach that requires decorative cards or separate utility-themed layout primitives just to create legible separation.
5. Decide role names, carrier syntax, and implementation only in RFC/ADR after evidence; avoid treating fixture attributes as a preview of the final API.

## Current evidence state

- **Authoring:** synthetic specimen and integrity checker prepared on a design branch.
- **Automated fixture integrity:** pending exact-head CI.
- **Rendered browser comparisons, screenshots, actual zoom and accessibility review:** not yet established.
- **Decision:** QART-0009 remains open; no accepted density mode or spacing-role extension.

A future RFC should cite concrete reviewer observations and consumer revisions, state whether `compact|comfortable|spacious` remains consumer-local, and include migration/compatibility effects if it proposes a stable API.
