# RFC-0009 — Spatial intent and bounded section rhythm

- **Status:** Proposed, not accepted and not implemented
- **Date:** 2026-10-08
- **Decision record:** No ADR accepted
- **Design requirement:** [SPACE-001](../requirements/spatial-rhythm.md)
- **Alternatives:** [QART-0009](QART-0009-spatial-rhythm.md)
- **Observed consumers:** [Spatial consumer survey](../architecture/spatial-rhythm-consumer-survey.md)
- **Experimental browser evidence:** [Review plan](../architecture/spatial-rhythm-review-plan.md)
- **Tracking:** [#79](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/79)

## Proposal

**Give major section separation an explicit, opt-in semantic role within existing Chroma/Venation ownership.** Use the accepted scale for ordinary peer gaps and keep component-internal insets within Lamina or consumer-owned surfaces. Do not create a Space subsystem, global density multiplier or new visual profile.

The smallest potential stable extension is:

```ts
// Candidate Venation extension; NOT accepted API.
type Space = "none" | "xs" | "sm" | "md" | "lg" | "xl";
type StackGap = Space | "section";

interface StackProps {
  gap?: StackGap;
  align?: "start" | "center" | "end" | "stretch";
}
```

```css
/* Candidate Chroma property; NOT published or accepted. */
--phyllotaxis-space-section: var(--phyllotaxis-space-xl);
```

Proposed `<Stack gap="section">` means **a recurring major-section relationship**, not a general numeric synonym for `xl`. Its resolution belongs to Chroma. The default alias to `space-xl` is only a *proposed compatibility-preserving initial value*; no observed consumer values are automatically imported. It leaves existing callers using `gap="xs|sm|md|lg|xl"` or omitted `gap` unchanged.

### Why only `Stack`?

The accepted [Venation API](../architecture/venation-layout-contract.md) represents vertical rhythm with `Stack`. Broadly adding a special `section` token to `Inline`, `Cluster`, `Grid`, `Switcher`, or `Container.gutter` would authorize relationships unsupported by present evidence. Do not widen all generic `Space` consumers until the semantic use case is established.

Chroma's existing `--phyllotaxis-space-none/xs/sm/md/lg/xl` continue to own ordinary group spacing. Existing `Cluster.rowGap/columnGap` already express asymmetric wrapped metadata gaps.

### Surface insets

The [consumer survey](../architecture/spatial-rhythm-consumer-survey.md) demonstrates recurring surface padding, but accepted Lamina contracts do not currently establish a generic surface-inset role that every component consumes. This RFC **does not** standardize a `Card`, generic `Inset` primitive or `padding` prop on Venation. Keep proven component-internal insets within each Lamina component and consumer-owned values where no shared semantic surface exists; reconsider one semantic inset token with real independently reusable Lamina examples.

### Density, themes and appearance

The experimental compact/comfortable/spacious specimens prove only that distinct local spacing policies can be compared. They do **not** establish a public `data-phyllotaxis-density` carrier, inheritance semantics or three stable modes. This RFC defers density selection: host consumers may opt into documented, coherent CSS overrides of existing semantic values, while `utility|editorial` and light/dark continue to resolve independently. The accepted Utility default remains compact and flat-first, not silently changed to spacious.

The proposal makes **spacious composition possible through deliberate role selection and consumer overrides**, not by indiscriminately multiplying all gaps, form controls, table cells and paragraphs.

## Ownership and compatibility

| Layer | Proposed change | Stable state until ADR |
| --- | --- | --- |
| Chroma | Candidate semantic `--phyllotaxis-space-section` mapping to current `space-xl` by default | Existing six-scale roles + page gutter remain authoritative |
| Venation | Candidate `Stack.gap="section"` opt-in relationship only | `Stack.gap?: Space` remains stable |
| Lamina | Document distinction between internal component insets and adjacent section gaps | Existing component contracts unchanged |
| Cambium | No automatic rewrite of existing `margin`, `padding` or Tailwind utilities | No migrations |
| `phyllo` | Future static inspection could identify role once accepted/versioned | No new CLI diagnostics or machine contract |
| Consumers | Can explore coherent CSS overrides and compare current baseline | No existing consumer becomes invalid |

The proposed CSS property would be defined by `chroma.css` and consumed only for the new opt-in `Stack` behavior; standalone Venation consumption without Chroma must provide the property when selecting `section`. No runtime provider, JS observer, global theme state, or automatic CSS migration is contemplated. Profile-specific aliases/overrides must be tested against existing Chroma carrier inheritance and color-scheme resolution.

A public interface/inspection contract change must be versioned if its schema enumerates every Chroma property or Venation enum. Review exact compatibility for `phyllo tokens` JSON consumers and exported declarations before adopting. No published version is changed by this RFC.

## Text and conceptual space

Text rhythm has two different concerns:

1. **Presentation:** CSS/typography spacing between headings, paragraphs, inline metadata, and genuine section boundaries. Existing Chroma typography roles and Lamina prose composition remain authoritative.
2. **Authored content semantics:** a break between ideas, a thematic separator, or an explicitly marked new section. An optional symbol/divider belongs to a real semantic boundary (e.g. `<hr>` for a thematic break) and must remain understandable without the ornament.

This RFC does not auto-insert `<hr>`, decorative glyphs or editorial blocks based on paragraph lengths. An Amaryllis/AI content-analysis workflow could later **suggest** breaks as attributable authoring changes, statically or at author-approved render boundaries, but no runtime model should silently mutate reading order, semantics, layout, or content provenance. This is a separate QART/RFC requiring consent, deterministic fallback and accessible/reduced-motion behavior; it is not a prerequisite for the initial spacing role.

## Alternatives considered

- **Reuse only `xl` and documentation.** Fully compatible, but lacks a stable name for repeating semantic section intent across differently dense compositions.
- **Opt-in `Stack.gap="section"` plus Chroma role (proposed).** Bounded meaning, stable structural owner, leaves other APIs and defaults unchanged. New token and typing still require lifecycle/version review.
- **New spacing/density layer or generic numeric `margin/padding` on every layout primitive.** Rejected: duplicates current ownership and breaks portable bounded contracts.
- **Global default spacing enlargement or a new density carrier now.** Deferred: risks Utility task density without sufficient consumer requirement, coherence and inheritance evidence.

## Acceptance evidence required before an ADR

1. **Real consumer comparisons:** At least two independent *actual* Utility/Editorial integrations comparing current composition with targeted major-section role, retaining grouping/inset behavior. Record immutable sources and context; do not infer actual appearance from source alone.
2. **Browser:** Chromium + Firefox if available, 320/375/768/1280 CSS px, light/dark, scroll/reflow, keyboard, focus, forced colors and text expansion. Actual browser zoom/text-only resize and assistive-tech tests must be explicitly performed or marked unsupported. The synthetic SPACE-001 harness by itself is insufficient.
3. **No double spacing:** Check nested `Stack` compositions, explicit section borders, prose headings, and children with their own margins; no automatic `margin-top` injection that compounds spacing.
4. **Stable token resolution:** Verify root/Utility/Editorial carriers, inherited overrides, standalone Venation-with-Chroma and without-Chroma behavior, and isolated CSS import ordering.
5. **Interface/version:** Define change impact on generated CSS, TypeScript declarations, inspection JSON/schema, package behavior and `phyllo tokens`; require appropriate versioning and compatibility notes.
6. **Performance:** Paired render and artifact measurements per proposed PERF-001; no numerical budget without observation.
7. **No global density API:** Record separately whether demand for accessible user-selectable density justifies an independent future decision.

## Disposition

**Draft for technical and visual-contract review.** No public API, default spacing, published CSS variable, CLI machine contract, private code or release changes are authorized by this document. The [synthetic browser run](https://github.com/hackelia-micrantha/phyllotaxis-community/actions/runs/37889809553) supports reflow-safe experimentation under limited conditions, not adoption of the proposed `section` role.

If real consumer evidence disproves the need for a new `Stack` role, close this RFC as not accepted and retain SPACE-001 as first-class *composition guidance* under the existing stable `Space` scale.
