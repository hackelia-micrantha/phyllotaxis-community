# QART-0009 — First-class spatial rhythm and density

- **Status:** Open — alternatives analyzed into [proposed RFC-0009](RFC-0009-spatial-rhythm.md); no accepted ADR or stable API change
- **Date:** 2026-10-08
- **Authority:** Public design analysis; no implementation authorization
- **Design requirement:** [SPACE-001](../requirements/spatial-rhythm.md)
- **Tracking:** [Issue #79](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/79)

## Question

How should Phyllotaxis treat **space as a first-class design-system concern** — especially separation between sections, distance between sibling components, and padding within surfaces — without making layout arbitrary, conflating utility density with Editorial content, or silently changing an accepted package contract?

User-observed gallery needs emphasize more breathing room and stronger separation between components. The recent public gallery deliberately increased gaps (issue [#74](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/74)); that example is non-normative, not a global Chroma contract.

## Current evidence and boundary

- The accepted [Venation contract](../architecture/venation-layout-contract.md) already requires `Space = none|xs|sm|md|lg|xl`, with explicit `gap`, separate row/column gaps for `Cluster`, a `page` gutter for `Container`, and no generic margin/padding passthrough.
- The [Chroma profile contract](../architecture/chroma-profile-contract.md) currently exports six spacing CSS properties and a page-gutter property. Utility has `xs=.25rem`, `sm=.5rem`, `md=1rem`, `lg=1.5rem`, `xl=2rem`; Editorial uses slightly more generous `xs`, `sm`, and `xl`. Component inset and section separation are not independently named as stable roles.
- The [accepted visual directive](../architecture/visual-directive.md) still prefers compact and flat Utility composition; [ADR-0003](ADR-0003-utility-composition-patterns.md) prefers contiguous separators over floating card treatment. [ADR-0008](ADR-0008-dimensional-utility-advisory-guidance.md) allows advisory review of local material variation without changing the Utility default.
- [ADR-0004](ADR-0004-accessibility-capability-floor.md) already governs target spacing, text spacing, resizing, reflow and focus. This QART may add review criteria but not weaken or duplicate those normative accessibility thresholds.

The missing design language is chiefly **spatial intention and predictable composition**, not the total absence of a spacing scale.

## Alternatives

| Option | Description | Benefit | Cost/risk |
| --- | --- | --- | --- |
| A. Use existing `Space` scale only | Continue `Stack gap` / `Grid gap` and consumer-owned padding/section classes; document examples | Zero stable API churn | Inconsistent internal insets, ambiguous section rhythm, repeated consumer magic values |
| **B. Publish spatial jobs and evolve Chroma roles narrowly (preferred)** | Define section, group, surface-inset and page-gutter semantics as recurring jobs; reuse Venation structural primitives; add named Chroma values only where several consumers justify a shared meaning | Predictable composition, profile-neutral structure, option for generous whitespace without new layout system | Role proliferation, precedence questions, potential impact on current compact Utility defaults |
| C. Add a separate Space layer/system | Dedicated spacing engine, providers or all-purpose utilities | Central visibility | Competing owner with Chroma/Venation, additional runtime/config, fragmenting APIs |
| D. Expose generic `margin`, `padding` or numeric values on all primitives | Provide total local control | Easy short-term authoring | Arbitrary CSS escape hatch, poor contract stability, weaker portability and testability |

**Provisional recommendation:** Option B, with an explicit bias toward satisfying SPACE-001 using *existing* Venation props and Chroma scale before promoting any new public properties. Do not create an independent spatial subsystem.

## Density alternatives (separate decision)

The word `density` already belongs to Chroma in the accepted Venation boundary, but its *public selection and precedence* have not been formalized.

1. **No density carrier.** Utility/Editorial each continue resolving their own current scale; consumers request more space by choosing larger Venation gaps or making coherent consumer-owned overrides. Lowest compatibility risk.
2. **Optional semantic density selection.** Compare `compact | comfortable | spacious` as an orthogonal, coherently scoped selection independent of `utility|editorial` and `light|dark`. Evaluate whether a stable DOM carrier is justified, which roles it affects, default inheritance, nested-surface behavior, and SSR/non-JS operation.
3. **Make spacious the global default.** Matches a generous-UI preference but changes accepted Utility character and may harm operational/status layouts and existing package consumers. Requires especially strong evidence and explicit backwards-compatibility approval.

**No selection in this QART.** In particular, the labels above are candidates, *not* released enum values, supported attributes, or reserved token names.

## Compositional hypothesis

Space can improve hierarchy without requiring cards, colored backgrounds, or new semantic components:

```tsx
<Container gutter="page" maxWidth="wide">
  <Stack gap="xl">
    <header>...</header>
    <main>
      <Stack gap="lg">
        <section>...</section>
        <section>...</section>
      </Stack>
    </main>
    <footer>...</footer>
  </Stack>
</Container>
```

This uses the existing public layout vocabulary. The exact meaning of the scale values still belongs to Chroma. Repeated consumer evidence may support a role such as section separation, but the example does **not** establish such a stable role.

Lamina may need reusable *component-internal* inset treatment. Its policy should be distinct from sibling gaps and from appearance effects (bevel/border/shadow) while preserving the current surface semantics. A generic `Card` or `Space` component is not justified solely by a spacing preference.

## Open questions

1. Are section rhythm and component-internal inset sufficiently repeated across distinct Utility and Editorial consumers to justify independent *semantic* Chroma roles rather than documented use of `space-lg/xl`?
2. Does consistent internal inset belong to an existing Lamina component contract, a new semantic composition, or remain product-owned for now?
3. Should `compact | comfortable | spacious` have a stable selector at the coherent-surface boundary? If so, what is its inheritance precedence relative to profile and scheme, and how can it be applied without a JS provider?
4. Do comfortable/spacious settings scale all gaps or only section/sibling/inset roles? Increasing every small gap uniformly may break dense forms, tables, and header/action proximity.
5. How should gap ownership behave under nested containers, adjacent sections, responsive switchers, and text growth so that whitespace remains predictable rather than compounded?
6. Can we accommodate a generous Micrantha experience **without** silently overriding the accepted compact Utility default for unrelated projects?
7. What evidence justifies adding names to the [Chroma inspection contract](../architecture/chroma-profile-contract.md) without breaking versioned machine-output consumers?

## Evidence and decision criteria

Use real reference compositions with a **current baseline**, a **consumer-owned spacious treatment**, and, if needed, a **role-aware prototype**:

- Multi-section page: hierarchy and section separation without decoration.
- Grid/cards: card-to-card and surface-to-content space under intrinsic reflow.
- Controls/forms: label/help/error grouping, target spacing, keyboard focus, touch access.
- Prose: reading measure, headings, paragraphs and metadata under Utility and Editorial.
- Dense table/status dashboard: where whitespace reduces scan speed or pushes required content offscreen.

Compare at 320/375/768/1280 CSS px, in light and dark; include 200% text resize, browser zoom, WCAG text-spacing overrides, localization, nested content and forced-colors conditions as applicable. Distinguish visually judged hierarchy from machine-assertable overflow or token values; record unsupported measurements, and apply the accepted accessibility floor. Track rendering and CSS/artifact impacts under proposed PERF-001 without fabricating pass thresholds.

The evaluation must answer whether semantic separation is clearer than ad hoc padding **and** whether a compact Utility screen remains effective. A preference for larger gaps alone does not prove that all tokens should grow.

## Reference comparison (synthetic browser evidence recorded; consumer rendering still pending)

A [three-policy comparison specimen](../examples/spatial-rhythm-comparison.html) and [evidence matrix](../architecture/spatial-rhythm-review-plan.md) provide identical synthetic sections, cards, checkboxes, prose and status tables. A dedicated [Chromium evidence run](https://github.com/hackelia-micrantha/phyllotaxis-community/actions/runs/37889809553) now checks geometry and CSS-simulated text stress, with findings in the [source-pinned consumer survey](../architecture/spatial-rhythm-consumer-survey.md). These example-only values and `data-density` attributes are not public Chroma or density contracts. **Synthetic browser passes do not establish real consumer adoption, real zoom or cross-browser parity.** The [narrow proposed RFC-0009](RFC-0009-spatial-rhythm.md) explores opt-in `Stack` section rhythm while deferring a density carrier; no ADR is accepted.

## Proposed disposition path

1. Complete real consumer render comparisons and answer the open acceptance questions; source-only observations and synthetic browser runs do not satisfy the full evidence gate.
2. Review [proposed RFC-0009](RFC-0009-spatial-rhythm.md) for a minimal section role, explicit absence of a v1 density carrier, interface/version compatibility, and the outstanding validation matrix.
3. Record an accepted ADR before modifying current Chroma defaults, Venation/Lamina public APIs, `phyllo` diagnostics, or private implementation.
4. Keep existing accepted public contracts authoritative until then. A public gallery change is not a release or compatibility decision.
