# RFC-0005 — Cross-layer accessibility capability contract

Status: **Proposed**  
Origin: [QART-0005](QART-0005-accessibility-capability-floor.md)  
Tracks: #41  
Builds on: [Visual directive](../architecture/visual-directive.md), [Chroma profile contract](../architecture/chroma-profile-contract.md), [Venation layout contract](../architecture/venation-layout-contract.md), [Lamina editorial contract](../architecture/lamina-editorial-contract.md), [ADR-0002](ADR-0002-consumer-experimentation-boundary.md)

## Decision under review

Define one normative accessibility capability floor for reusable Phyllotaxis-controlled web behavior.

The proposed baseline is **WCAG 2.2 Level AA** for behavior and presentation controlled by Phyllotaxis. The contract does not claim that importing Phyllotaxis makes an application conformant: consumer content, workflows, labels, media alternatives, application state, page landmarks, and integration choices remain independently responsible for their applicable success criteria.

Normative W3C references:

- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Understanding 1.4.11 Non-text Contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- Understanding 2.4.13 Focus Appearance: https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance
- WCAG 2.2 changes / 2.5.8 Target Size (Minimum): https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- CSS reduced-motion technique: https://www.w3.org/WAI/WCAG22/Techniques/css/C39

## Capability floor

### Native semantics and ARIA

Phyllotaxis MUST prefer native HTML semantics when a native element expresses the required relationship or interaction.

Reusable components MUST NOT:

- replace a native semantic relationship with a generic element plus ARIA without demonstrated need;
- emit conflicting roles/states;
- infer semantic roles solely from visual layout;
- suppress consumer-supplied accessibility attributes that are valid for the selected native element.

ARIA remains an augmentation mechanism, not a parallel component-semantic system.

Consumer applications remain responsible for authored labels, page-level landmark composition, workflow instructions/errors, media alternatives, and domain-specific state descriptions.

### Keyboard and focus

Every reusable interactive behavior MUST be operable by keyboard when the equivalent pointer interaction is available and WCAG requires keyboard operation.

Phyllotaxis MUST NOT remove visible focus without providing an equivalent or stronger indicator.

Where Phyllotaxis authors a focus indicator, the proposed design-system default is stronger than the AA minimum:

- indicator area MUST be at least equivalent to a 2 CSS px perimeter of the unfocused component; and
- the indicator MUST provide at least a 3:1 change between the focused and unfocused pixels used to communicate focus.

This adopts the measurable appearance model from WCAG 2.4.13 as a Phyllotaxis presentation default without claiming application-wide AAA conformance.

Focus MUST remain unobscured by Phyllotaxis-owned sticky/fixed presentation at the AA level.

### Text and non-text contrast

Phyllotaxis-provided text and link values MUST meet applicable WCAG 2.2 AA contrast requirements in every supported profile/scheme context where those values are intended to appear.

Visual information required to identify a reusable UI control or state MUST meet the 3:1 non-text contrast requirement against adjacent colors.

Decorative separators/borders are not automatically required to meet 3:1. A low-contrast border MUST NOT be the sole visual information needed to identify or understand a control/state.

State or meaning MUST NOT depend on color alone.

### Pointer target size

Phyllotaxis-authored pointer targets MUST satisfy WCAG 2.5.8 Target Size (Minimum): normally at least 24 by 24 CSS px or an allowed spacing/equivalence/inline/user-agent/essential exception.

A reusable component that intentionally relies on an exception MUST preserve the conditions that make the exception valid rather than silently shrinking an otherwise compliant target.

This requirement does not turn all inline prose links into 24 by 24 boxes; WCAG's inline exception continues to apply.

### Responsive reflow, zoom, and text spacing

Reusable layout/presentation MUST support the applicable WCAG AA requirements for:

- text resize up to 200% without loss of content/functionality;
- reflow at a 320 CSS px viewport-equivalent without two-dimensional scrolling except for content that genuinely requires two dimensions;
- author-overridden text spacing without clipping, overlap, or loss of content/functionality.

Venation MUST preserve DOM/logical order rather than relying on visual reordering to convey sequence.

Component contracts MUST avoid fixed dimensions that make ordinary text growth or localization unsafe unless the constrained dimension is essential to the semantic requirement.

### Reduced motion and interaction motion

Motion is an enhancement, not a semantic channel.

Reusable Phyllotaxis behavior MUST NOT require animation to understand content, state, or available actions.

When `prefers-reduced-motion: reduce` applies:

- non-essential spatial, transform, reveal, entrance, parallax, or similar interaction motion authored by Phyllotaxis MUST be disabled;
- the resulting state change MUST remain understandable and usable without motion;
- disabling motion MUST NOT remove the state/action itself.

Reusable hover presentation MUST NOT expose information or an action only on hover.

When hover and keyboard focus represent the same reusable state/action, equivalent presentation MUST be available through `:focus-visible`, `:focus-within`, or the native focused element as appropriate.

This RFC does not create motion-duration tokens, animation primitives, or a general motion system.

### Forced colors and platform adaptation

Phyllotaxis MUST preserve user-agent/platform accessibility adaptations by default.

Reusable CSS MUST NOT broadly suppress forced-colors/high-contrast behavior. `forced-color-adjust: none` or equivalent opt-outs require a bounded component-specific reason and an alternate presentation that preserves the required visual information.

Native controls should retain platform behavior unless customization has a demonstrated semantic/usability requirement and equivalent states remain perceivable.

### State and redundant signalling

Reusable state MUST remain understandable without relying solely on:

- color;
- motion;
- hover;
- pointer position;
- shape/iconography without an accessible name or textual equivalent where one is required.

Textual state labels or native programmatic states SHOULD be preferred when they provide the clearest durable semantics.

## Layer ownership

### Chroma

Chroma owns accessible semantic presentation values.

It MUST provide values sufficient for supported text/link/focus/state use cases and MUST NOT encode a palette role as “accessible” independent of its intended adjacency/context.

Contrast validation belongs against documented role/context pairs, not colors in isolation.

### Venation

Venation owns structural relationships.

It MUST preserve logical/DOM order, intrinsic reflow, text growth, and accessibility attribute passthrough. Layout primitives MUST NOT infer landmarks or ARIA roles from geometry.

### Lamina

Lamina owns reusable semantic components.

It MUST preserve native relationships and keyboard semantics, expose visible focus for package-styled interactive elements, and avoid generic role/ARIA abstractions where native elements are sufficient.

### Cambium and `phyllo`

Migration/diagnostic tooling MAY identify mechanically provable accessibility contract violations.

Heuristic accessibility findings MUST remain advisory unless the rule is exact enough for deterministic conformance. Tooling MUST NOT auto-rewrite semantic/ARIA structure from a heuristic alone.

### Consumers

Consumers remain responsible for application-specific:

- page landmark hierarchy;
- authored accessible names/descriptions;
- form instructions, validation, errors, and recovery;
- dynamic application state and announcements;
- media alternatives/captions/transcripts;
- content language and localization quality;
- focus management caused by product navigation/modal/workflow behavior;
- third-party widgets;
- final integrated conformance.

## Validation model

No single validator proves this contract.

### Deterministic package tests

Private implementation SHOULD mechanically test properties such as:

- stable semantic markup and heading/figure/link relationships;
- accessibility-attribute passthrough;
- prohibited semantic escape hatches;
- documented Chroma text/non-text/focus role contrast;
- reduced-motion CSS behavior once reusable motion exists;
- no visual-order contract that contradicts DOM order.

### Browser/component accessibility tests

Representative rendered components/compositions SHOULD run a browser-level accessibility engine such as axe-core as one blocking layer.

That layer is evidence for detectable violations; it is not the contract itself.

### Interaction/system checks

Representative compositions SHOULD exercise:

- keyboard traversal and activation;
- visible/unobscured focus;
- reduced-motion media preference when motion exists;
- target geometry/spacing for package-authored controls;
- 320 CSS px reflow and 200% text sizing;
- text-spacing override behavior;
- forced-colors/high-contrast behavior where browser automation can provide reliable evidence.

### Consumer qualification

First-consumer and representative integration evidence MUST cover application responsibilities that cannot be proven inside the package alone.

Manual review remains appropriate for semantic appropriateness, reading/focus order, cognitive clarity, alt text quality, workflow error recovery, and platform behavior not reliably captured by automation.

## Compatibility

This proposal primarily consolidates and strengthens requirements already stated across accepted contracts.

It does not:

- add package exports;
- change existing Chroma/Venation/Lamina component signatures;
- require consumers to adopt an accessibility framework;
- claim that existing consumers are fully conformant;
- authorize motion behavior that does not otherwise have design/reuse evidence.

Implementation may need additional tests and bounded CSS changes to prove the accepted contract.

## Acceptance criteria for ADR consideration

- [ ] public requirement clearly distinguishes package-controlled and consumer-controlled obligations;
- [ ] WCAG 2.2 AA is the baseline without claiming automatic application conformance;
- [ ] authored focus appearance uses a measurable stronger default without claiming AAA;
- [ ] non-text contrast and low-contrast decorative-border distinction are explicit;
- [ ] 24 CSS px target-size/spacing rule is explicit;
- [ ] reflow, resize, text-spacing, forced-colors, keyboard, semantics, and state signalling are covered;
- [ ] hover/motion rules require focus parity and reduced-motion behavior;
- [ ] validation explicitly combines deterministic, browser, interaction, and consumer evidence;
- [ ] no generic accessibility provider, ARIA abstraction, or animation system is introduced;
- [ ] private implementation work is tracked separately;
- [ ] exact-head public CI passes.

## Non-goals

- application-wide WCAG certification;
- automatic remediation of arbitrary consumer markup;
- generic form/dialog/menu primitives not already justified by semantic evidence;
- accessibility telemetry or user profiling;
- a design-system-owned screen reader;
- a general motion/token/animation framework.
