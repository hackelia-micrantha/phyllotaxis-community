# Accessibility capability requirement

Status: **Proposed by [RFC-0005](../decisions/RFC-0005-accessibility-capability-contract.md)**

## Requirement

Phyllotaxis-controlled reusable web behavior must provide a modern accessibility capability floor independent of visual profile.

The proposed baseline is **WCAG 2.2 Level AA** for behavior and presentation controlled by Phyllotaxis. Importing Phyllotaxis does not by itself make a consuming application conformant; application-specific content, workflows, labels, state management, media alternatives, page composition, and third-party integrations remain consumer responsibilities.

## Required reusable properties

Subject to RFC-0005/ADR acceptance, reusable Phyllotaxis behavior must preserve:

- native semantic HTML first, with ARIA only where it adds required semantics;
- keyboard operability for equivalent reusable pointer interactions;
- visible focus that is not entirely obscured by Phyllotaxis-owned content, with full visibility preferred;
- AA text/link contrast and 3:1 non-text contrast where visual information is required to identify controls/states;
- meaning/state that does not depend on color alone;
- WCAG 2.5.8 target-size or valid spacing/exception behavior;
- 200% text resize, 320 CSS px reflow, and text-spacing resilience where applicable;
- logical DOM/reading order independent of visual layout;
- user-agent forced-colors/high-contrast adaptations by default;
- no semantic dependency on animation;
- disabled non-essential Phyllotaxis-authored motion under `prefers-reduced-motion: reduce`;
- no hover-only reusable information/actions and keyboard-focus parity where hover/focus express the same state.

Where Phyllotaxis authors a focus indicator, the proposed stronger default is the WCAG 2.4.13 appearance model: at least a 2 CSS px perimeter-equivalent indicator with at least a 3:1 focused-vs-unfocused change. This is a design-system default, not a claim of application-wide AAA conformance.

## Ownership

- **Chroma:** semantic presentation values and documented contrast contexts.
- **Venation:** logical structural relationships, intrinsic reflow, DOM order, and accessibility-attribute passthrough.
- **Lamina:** reusable native semantics and package-owned interaction/focus behavior.
- **Cambium / `phyllo`:** deterministic diagnostics where mechanically justified; heuristic semantic rewrites are prohibited.
- **Consumers:** application/content/workflow-specific accessibility and final integrated conformance.

## Evidence

Conformance evidence must be layered:

1. deterministic component/contract tests;
2. browser accessibility scanning for detectable violations;
3. keyboard/focus/reflow/text-spacing/target/reduced-motion/forced-colors interaction checks where applicable;
4. representative consumer integration and human semantic review.

An automated accessibility engine is useful evidence but is not a substitute for this requirement.

## Normative detail

Until an ADR accepts RFC-0005, this requirement is proposed. The complete proposal and rationale are in:

- [QART-0005](../decisions/QART-0005-accessibility-capability-floor.md)
- [RFC-0005](../decisions/RFC-0005-accessibility-capability-contract.md)
