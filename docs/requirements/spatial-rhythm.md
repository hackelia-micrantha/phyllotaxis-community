# SPACE-001 — Spatial rhythm and negative space

- **Status:** Proposed (not an accepted contract or shipped behavior)
- **Date:** 2026-10-08
- **Owner:** Public Phyllotaxis design authority
- **Design issue:** [#79](https://github.com/hackelia-micrantha/phyllotaxis-community/issues/79)
- **Options analysis:** [QART-0009](../decisions/QART-0009-spatial-rhythm.md)

## Intent

**Space is a first-class design-system concern, not a collection of incidental margins.** Phyllotaxis should give designers and consumers a small, predictable vocabulary for intentional negative space, grouping, content breathing room, and information density.

Spatial rhythm communicates which things belong together, which are distinct, and where attention should move. It must remain usable with both plain 1990s-style Utility presentation and more expressive Editorial presentation, independently of color scheme, gloss, shadows, radii, and motion.

This requirement is an **evaluation target** until a reviewed RFC and accepted ADR change stable contracts. It does not immediately change the current compact Utility default or the currently published six-value Chroma scale.

## Existing layer ownership (accepted, unchanged)

- **Chroma** resolves themeable values: `none | xs | sm | md | lg | xl`, `--phyllotaxis-gutter-page`, content widths, and profile-specific spacing/density decisions.
- **Venation** expresses relationships using `Stack`, `Inline`, `Cluster`, `Grid`, `Switcher`, and `Container`. Existing `gap`, `rowGap`, `columnGap`, and `gutter` inputs are stable. It must not become an arbitrary CSS property interface.
- **Lamina** owns the internal composition and inset choices of semantic components, consuming Chroma values and Venation structure where appropriate.
- **Cambium** owns explicit migration of an accepted contract; it must not automatically invent new margin/padding policies from existing consumer CSS.

This document does not propose a fifth layer.

## Spatial jobs to make explicit

| Spatial job | What must be understandable | Expected owner |
| --- | --- | --- |
| Page/container gutters | Distance from content to the available-region edge; fluidity/reflow behavior | Chroma value; Venation `Container` |
| Section rhythm | Consistent separation of major content regions, including separation without cards | Chroma value; Venation composition |
| Sibling grouping | Closely related labels, fields, actions, cards, and repeated elements maintain coherent gap intent | Chroma scale; Venation `gap` / `rowGap` / `columnGap` |
| Component-internal inset | Space between a surface edge and its content without requiring consumer overrides | Chroma values; Lamina composition |
| Reading measure and text rhythm | Readable line length, paragraphs, headings and metadata maintain hierarchy | Chroma typography/width; Venation container; Lamina prose |
| Interactive separation | Controls and focus outlines are not crowded or obscured by adjacent regions | Shared accessibility floor; appropriate layout owner |

The jobs are not automatically six new public tokens or six new props. QART-0009 compares whether existing scale references, semantic roles, or selected additions best satisfy the jobs.

## Design invariants for a future accepted contract

1. **Relationship over decoration.** Negative space must remain meaningful with zero shadows, gradients, colored backgrounds, or bordered cards.
2. **Meaningful scale, not magic numbers.** A repeated layout relationship uses shared Chroma names; exceptional consumer-specific requirements remain explicit consumer styling until promotion is justified.
3. **Avoid compounded whitespace.** Nested stacks, section separators, and surface insets must not accidentally double the intended separation or collapse it to zero. Consumers must be able to predict which owner creates the gap.
4. **Density is not visual profile.** Compact vs relaxed composition must not be equivalent to Utility vs Editorial, and must not be coupled to light/dark or material treatment. Whether density needs a stable carrier, and its allowed values, remains an open decision.
5. **Intrinsic adaptation.** Prefer container-relative behavior and `rem`-based, text-responsive spacing; avoid viewport-only spacing choreography or fixed widths that defeat reflow.
6. **Accessibility governs all densities.** Preserve the accepted [accessibility floor](accessibility.md), including 320 CSS px reflow, 200% text resize, text-spacing overrides, visible focus, targets, keyboard navigation, and localization growth. Increased whitespace must not create horizontal overflow, offscreen required controls, or hidden status.
7. **No silent compatibility changes.** The current Utility default, published `--phyllotaxis-space-*` names, `--phyllotaxis-gutter-page`, and Venation prop semantics remain valid unless changed by an explicitly reviewed RFC/ADR plus compatibility plan.
8. **Evidence before formal APIs.** A material or generous-gallery example is consumer evidence, not proof that a new spacing token, density carrier, or Lamina abstraction should be stable.

## Required review evidence

At minimum, inspect representative **Utility and Editorial** compositions in light and dark schemes, including:

- a page with multiple independent sections;
- a repeated responsive card/grid collection;
- controls with labels/help/error text, focus indication, and adjacent actions;
- a long-form text/article with metadata;
- a dense table or operational/status layout where added space can harm scanability.

Compare current baseline with a proposed more spacious treatment at 320, 375, 768, and 1280 CSS px. Assess both separation *between* sections and *inside* surfaces. Record screenshots plus machine-observable layout measurements; distinguish simulated CSS scaling from real browser zoom/text-only resize. Capture localization/text-growth, forced colors, reduced motion (where interactions are involved), and target spacing as required by the accepted floor. PERF-001's evidence requirements apply to any claimed performance impact.

A comfortable or spacious appearance is a **user preference and design goal**, not an excuse to assert untested accessibility, universal usability, or a new default.

## Decision gates

1. Complete [QART-0009](../decisions/QART-0009-spatial-rhythm.md) with consumer comparisons and explicit alternative trade-offs.
2. Publish an RFC specifying any new stable Chroma roles, density resolution, default changes, or Lamina/Venation behavior with migration and versioning.
3. Accept an ADR before modifying machine-readable contracts, default CSS resolutions, private implementation, CLI enforcement or release claims.
4. Verify exact-head implementation against an immutable pinned public contract and applicable browser/accessibility/performance gates.

This document records first-class **design intent** without presenting proposed behavior as already implemented.
