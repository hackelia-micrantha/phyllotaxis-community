# SPACE-001 — Cross-consumer spatial roles survey

- **Status:** Observational evidence only; not an API specification, usability finding, or browser conformance result
- **Date:** 2026-10-08
- **Requirement:** [SPACE-001](../requirements/spatial-rhythm.md)
- **Decision analysis:** [QART-0009](../decisions/QART-0009-spatial-rhythm.md)
- **Candidate proposal:** [RFC-0009](../decisions/RFC-0009-spatial-rhythm.md)
- **Source policy:** public, immutable GitHub commit links. No private implementation is copied.

## Observed source usage

| Independent consumer | Section/major-region separation | Sibling/group gap | Internal inset |
| --- | --- | --- | --- |
| [Micrantha web](https://github.com/hackelia-micrantha/web/tree/8d7963314e651cc75ca27ac16aa4a120fa016f6f) | [Article layout](https://github.com/hackelia-micrantha/web/blob/8d7963314e651cc75ca27ac16aa4a120fa016f6f/app/components/blog-article-layout.tsx) uses `space-y-10` at the article level and `space-y-5` inside its introduction; later sections use `pt-8` with borders | Article metadata `gap-x-4 gap-y-2`; [Card](https://github.com/hackelia-micrantha/web/blob/8d7963314e651cc75ca27ac16aa4a120fa016f6f/app/components/card.tsx) uses `gap-4` for heading/icon grouping and `gap-2` for actions | Card `px-6 py-5`; editorial linked sections `px-5 py-5` or `px-4 py-4` |
| [Digitalis Community](https://github.com/hackelia-micrantha/digitalis-community/blob/c03570962a89f5d77e37ff5e0a7b37a514f59a27/web/styles.css) | `.section { padding-top: 6.5rem }`; `.notice { margin-top:6.5rem }` | `.summary-grid,.card-grid,.flow-grid {gap:1rem}`; row `.status-table article {gap:1.4rem}` | Card `padding:1.35rem`; status row `padding:1.25rem 1.35rem` |
| [Envuscator Community](https://github.com/hackelia-micrantha/envuscator-community/blob/54119ac6873bce47a47b12a1622c5c213934309b/web/styles.css) | `.section {padding:clamp(4rem,8vw,7rem) 0 0}` | Repeated `.card-grid` and related collections use `gap:1rem` | Cards/surfaces use local values such as `padding:1.4rem`; other panels use `1.25rem` and `1.5rem` |

These are observations from source, not measured computed styles or claims that a particular value is optimal. Media queries, nested CSS, font-size resolution, and page context may change computed geometry. In particular, Utility and Editorial characteristics are not inferred solely from a class name or site host.

## Cross-consumer interpretation

1. **Three separable spatial jobs recur:** major section rhythm, gaps among related peers, and content-to-surface insets. The roles recur even when their numeric scales diverge markedly. Consumers also distinguish prose/metatext rhythm.
2. **Section scale is not a universal multiplier.** Digitalis and Envuscator use several-rem section separation while retaining one-rem peer gaps and roughly one-to-one-and-a-half-rem insets. Uniformly enlarging `xs..xl` would not preserve these different meanings.
3. **Internal insets cannot be assigned indiscriminately to Venation.** A Lamina component with an owned visual surface has a different padding responsibility than a Venation `Stack` that merely arranges siblings.
4. **Evidence is insufficient to standardize a density carrier.** No source demonstrates three shared compact/comfortable/spacious selectable modes or common inheritance behavior. Existing applications retain consumer-owned presentation policies.
5. **Existing compact Utility remains legitimate.** The accepted flat-first Utility directive and [ADR-0003](../decisions/ADR-0003-utility-composition-patterns.md) must not be overwritten by larger ornamental spacing.
6. **A shared semantic vocabulary is plausible; stable values are not yet proved.** This survey justifies reviewing section/group/inset *intent*. It does not show that the same proposed CSS token names or Venation props are demanded by multiple consumers.

## Synthetic browser evidence (separate evidence class)

The [SPACE-001 browser evidence harness](../../tools/spatial-rhythm-browser-evidence.mjs) and [test plan](spatial-rhythm-review-plan.md) operate only on [the synthetic comparison](../examples/spatial-rhythm-comparison.html), **not** these consumer sites.

- Initial Chromium run [#37889457348](https://github.com/hackelia-micrantha/phyllotaxis-community/actions/runs/37889457348), on `266721a`, detected horizontal overflow with CSS-simulated 200% root-font at 320 CSS px.
- Diagnostic run [#37889554663](https://github.com/hackelia-micrantha/phyllotaxis-community/actions/runs/37889554663), on `db926345`, measured 109 CSS px root overflow and overflowing headings/prose inside the specimen. This does **not** establish production consumer defects.
- Fixed fixture/harness: [PR #84](https://github.com/hackelia-micrantha/phyllotaxis-community/pull/84), merge `89e25961171404142431b442089cf0c46d81a127`. The exact-head [successful browser run #37889809553](https://github.com/hackelia-micrantha/phyllotaxis-community/actions/runs/37889809553) records four screenshots, Chromium geometry across 320/375/768/1280 CSS px and light/dark, keyboard focus and two **CSS-simulated** text stress checks. It also exercises failure-artifact persistence.

The successful synthetic run demonstrates that the specimen can be made reflow-safe for the tested conditions. It does **not** establish real browser zoom, actual browser text-only resize, Firefox/Safari/iOS parity, comparative usability, or production adoption.

## Decision implications and remaining evidence

- **Advance role-oriented spacing to a narrow *proposed* RFC** without a new spatial layer, arbitrary padding props, or a released density carrier.
- Keep any proposed role binding backward-compatible with existing six-value `Space`, profile semantics and compact Utility values. Do not infer that published consumers already support candidate names.
- Require real consumer screenshots/reflow/focus comparisons at multiple viewport sizes before an ADR accepts concrete new Chroma variables, Venation props, Lamina surface-inset defaults or migrations.
- Do not turn subjective “breathing room” preferences or proposed AI segmentation of content into fail-closed CLI rules; those need separate, attributable content-authoring governance.
