# ADR-0004 — Accept cross-layer accessibility capability floor

- **Status:** Accepted
- **Date:** 2026-10-07
- **Decision owners:** Phyllotaxis public contract authority
- **Scope:** reusable web accessibility capability floor across Chroma, Venation, Lamina, Cambium/`phyllo`, and consumer integration
- **Supersedes:** None
- **Superseded by:** None

## Context

Phyllotaxis already required modern accessibility despite Utility's intentionally restrained late-1990s visual character. Those requirements were distributed across the visual directive, Chroma, Venation, Lamina, experimentation guidance, and reference fixtures.

QART-0005 compared three dispositions:

1. keep accessibility requirements distributed across existing contracts;
2. make accessibility primarily a consumer responsibility;
3. define one cross-layer Phyllotaxis capability floor with explicit package/consumer ownership.

QART-0005 recommended option 3. RFC-0005 developed that proposal around WCAG 2.2 Level AA for reusable behavior and presentation controlled by Phyllotaxis, while retaining consumer responsibility for application-specific content, workflows, labels, dynamic state, media alternatives, third-party widgets, and final integrated conformance.

The proposal was reviewed against current W3C guidance before acceptance. In particular:

- WCAG 2.4.11 Level AA requires a focused component not be entirely obscured by author-created content;
- WCAG 2.4.13 Focus Appearance is Level AAA and supplies the stronger 2 CSS px perimeter-equivalent / 3:1 focused-vs-unfocused model adopted here as a Phyllotaxis-authored presentation default;
- WCAG 2.5.8 Target Size (Minimum) is Level AA and requires 24 by 24 CSS px targets or one of its defined exceptions.

## Decision

Accept RFC-0005 and the cross-layer accessibility capability requirement.

The durable Phyllotaxis rules are:

1. **WCAG 2.2 AA is the reusable capability floor.** Phyllotaxis-controlled reusable web behavior and presentation must satisfy applicable Level AA requirements.
2. **Library conformance is not application certification.** Importing Phyllotaxis does not make a consumer WCAG-conformant; application-owned content and workflows retain their own obligations.
3. **Native semantics come first.** Reusable components prefer native HTML relationships and interactions over generic elements plus ARIA.
4. **Keyboard equivalence is required.** Pointer-accessible reusable behavior must remain keyboard-operable when WCAG requires keyboard operation.
5. **Visible focus is required.** Phyllotaxis must not remove visible focus without an equivalent or stronger indicator, and Phyllotaxis-owned content must not entirely obscure keyboard focus.
6. **Phyllotaxis-authored focus uses a stronger default.** Where Phyllotaxis styles focus itself, the indicator must meet the WCAG 2.4.13 appearance model: at least a 2 CSS px perimeter-equivalent area and 3:1 focused-vs-unfocused change. This does not claim application-wide AAA conformance.
7. **Text and non-text contrast are context-specific.** Text/link roles must meet applicable AA contrast; required control/state visual information must meet the applicable 3:1 non-text contrast requirement. Decorative borders are not automatically interactive-state indicators.
8. **Target size follows WCAG 2.5.8.** Phyllotaxis-authored pointer targets must be at least 24 by 24 CSS px or satisfy a valid spacing/equivalence/inline/user-agent/essential exception.
9. **Layout must tolerate enlargement and reflow.** Reusable behavior must preserve applicable 200% text resize, 320 CSS px reflow, text-spacing resilience, logical DOM order, and localization/text-growth expectations.
10. **Motion is never a semantic channel.** Reusable behavior must remain understandable without animation.
11. **Reduced-motion is mandatory for reusable non-essential motion.** Under `prefers-reduced-motion: reduce`, non-essential Phyllotaxis-authored spatial/transform/reveal/entrance/parallax-style interaction motion must be disabled while preserving the state/action.
12. **No hover-only reusable behavior.** Hover must not be the sole route to information/actions; when hover and keyboard focus represent the same state/action, equivalent focus presentation is required.
13. **Forced-colors/platform adaptations remain enabled by default.** Broad opt-out is prohibited without a bounded component-specific reason and equivalent accessible presentation.
14. **Meaning/state uses redundant signalling.** Reusable state must not depend solely on color, motion, hover, pointer position, or unlabeled shape/iconography.
15. **Validation is layered.** Deterministic package tests, browser accessibility scanning, explicit interaction/system checks, and representative consumer/human review each cover different evidence classes. No single accessibility engine is treated as complete proof.

## Ownership

### Chroma

Own semantic presentation values and documented adjacency/context assumptions. Contrast is validated against intended contexts, not colors in isolation.

### Venation

Own structural relationships, intrinsic reflow, logical DOM order, text growth, and accessibility-attribute passthrough. Layout geometry does not imply semantic roles.

### Lamina

Own reusable semantic components and package-styled interaction/focus behavior while preserving native relationships and keyboard semantics.

### Cambium and `phyllo`

May report deterministic accessibility contract violations. Heuristic semantic/ARIA findings remain advisory and must not trigger automatic semantic rewrites.

### Consumers

Remain responsible for application/page landmark hierarchy, authored names/descriptions, forms and validation/error recovery, dynamic announcements/state, media alternatives, language/localization quality, product focus management, third-party widgets, and final integrated conformance.

## Consequences

### Positive

- one auditable accessibility capability floor now constrains every visual profile and reusable layer;
- future hover/motion work cannot silently introduce hover-only or motion-dependent behavior;
- package and consumer responsibilities are explicit;
- first-consumer qualification and private implementation tests have a stable public target;
- deterministic checks and browser scanning remain complementary rather than competing sources of truth.

### Negative and accepted costs

- the private implementation needs additional browser/interaction evidence to claim full package conformance;
- some requirements require contextual or manual evidence and cannot be reduced to static checks;
- stronger package-authored focus requirements may require future CSS refinements when additional interactive primitives are introduced;
- consumer applications still need their own accessibility review and cannot delegate final conformance to Phyllotaxis.

## Compatibility

This decision primarily consolidates and strengthens already stated accessibility requirements.

It does not:

- add or remove package exports;
- change current Chroma/Venation/Lamina component signatures;
- introduce an accessibility provider or generic ARIA abstraction;
- add a motion token or animation framework;
- require existing consumers to restyle immediately;
- claim that existing consumers are already fully conformant.

## Validation

The proposal reached ADR consideration with:

- public package-versus-consumer ownership explicitly defined;
- WCAG 2.2 AA baseline defined without an automatic application-conformance claim;
- stronger authored-focus default explicitly separated from AAA conformance claims;
- non-text contrast and decorative-border distinction defined;
- target size/spacing and exceptions defined;
- resize/reflow/text-spacing/forced-colors/keyboard/semantics/state-signalling covered;
- hover/focus parity and reduced-motion behavior covered;
- layered deterministic/browser/interaction/consumer evidence defined;
- private implementation follow-up tracked separately;
- exact-head public CI passing before proposal merge.

## Accepted contract updates

- [Accessibility capability requirement](../requirements/accessibility.md) becomes an accepted cross-layer requirement.
- [RFC-0005](RFC-0005-accessibility-capability-contract.md) becomes accepted by this ADR.
- The public contract and requirements indexes identify the accessibility capability floor as authoritative.

Existing Chroma, Venation, Lamina, visual-profile, and machine-readable package interface shapes remain unchanged by this decision.

## Implementation follow-up

Package-side enforcement tracked by private `hackelia-micrantha/phyllotaxis#73` is complete.

The private implementation now reports layered package evidence matching this ADR:

- the accepted public contract is pinned immutably before conformance is claimed;
- deterministic semantic, contrast, focus, DOM-order, forced-colors, and motion-boundary checks remain blocking;
- browser accessibility scanning is one blocking evidence layer rather than the whole contract;
- representative keyboard/focus/reflow/text-spacing/target/reduced-motion/forced-colors checks are exercised where the package owns behavior;
- the repository's canonical quality entry point invokes the required accessibility evidence transitively.

This status statement is non-normative: the public requirement above remains the authority, and private evidence does not redefine it.

First-consumer integrated qualification remains with private `phyllotaxis#57` and its consumer-owned follow-up work. Application semantics, authored names/descriptions, workflow focus management, media alternatives, third-party widgets, and final integrated conformance remain consumer responsibilities.

## Reassessment triggers

Revisit this decision if:

- another platform requires a technology-neutral accessibility contract separate from this web-specific profile;
- repeated consumer evidence shows a rule is incorrectly assigned between package and application ownership;
- browser/platform accessibility semantics materially change;
- the evidence model proves too weak or too expensive to enforce reliably.
