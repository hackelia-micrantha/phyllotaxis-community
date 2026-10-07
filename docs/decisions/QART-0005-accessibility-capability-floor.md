# QART-0005 — Cross-layer accessibility capability floor

Status: **Resolved into RFC-0005**

## Question

How should Phyllotaxis make its existing accessibility requirements durable and testable before reusable interaction behavior expands?

Accessibility is already required by the accepted visual directive and appears in Chroma, Venation, Lamina, consumer experimentation, and reference evidence. The missing decision is whether those requirements should remain distributed or become one cross-layer public capability floor.

The decision must preserve the existing ownership boundaries:

- Chroma owns semantic presentation values;
- Venation owns structural relationships and DOM order;
- Lamina owns reusable semantics;
- consumers own application-specific content, workflows, labels, media alternatives, and page composition;
- private implementation/tests do not redefine public requirements.

## Evidence

Current implementation and public contracts already demonstrate useful accessibility behavior:

- native headings, links, figures/captions, landmarks, and accessibility-attribute passthrough;
- authored `:focus-visible` treatment using a semantic focus role;
- text/link/focus contrast checks for Utility and Editorial;
- intrinsic responsive layout rather than visual reordering;
- a public Utility reference with skip navigation, labelled navigation, explicit state text, responsive structure, and visible focus;
- public requirements for semantic HTML, keyboard navigation, contrast, interaction targets, text scaling, reduced motion, progressive enhancement, and high-contrast compatibility.

However:

- there is no single normative cross-layer accessibility requirement;
- no private browser accessibility gate currently proves representative components/compositions end-to-end;
- target size, non-text contrast, focus appearance, reflow/text spacing, forced colors, and reduced-motion behavior are not all mechanically exercised;
- reduced-motion is currently mostly declarative because the reusable package contains little or no interaction motion;
- proposed hover/motion refinements would create the first material risk of presentation behavior outrunning the existing accessibility evidence.

## Alternatives

### A — Keep accessibility distributed across existing contracts

Continue documenting accessibility requirements only where each layer needs them.

Advantages:

- no new public artifact;
- layer-local requirements stay close to implementation concepts;
- no additional cross-cutting contract to maintain.

Trade-offs:

- requirements are easy to miss or interpret inconsistently;
- consumers and implementation tests lack one capability checklist;
- future interaction work can satisfy one layer while violating another;
- conformance claims become difficult to audit.

### B — Make accessibility a consumer-only responsibility

Phyllotaxis preserves native semantics and reasonable defaults but does not define a reusable accessibility floor beyond individual component behavior.

Advantages:

- smallest design-system responsibility;
- avoids implying site-wide conformance from library behavior.

Trade-offs:

- contradicts the accepted “1990s in visual character, not in capability” rule;
- weakens reusable guarantees exactly where a shared design system can prevent repeated defects;
- makes hover/motion, focus, contrast, and target behavior inconsistent across consumers;
- shifts preventable design-system defects downstream.

### C — Define one cross-layer Phyllotaxis capability floor

Publish one normative requirement that consolidates the reusable accessibility guarantees and assigns each guarantee to Phyllotaxis or the consuming application.

Use **WCAG 2.2 AA** as the baseline for Phyllotaxis-controlled reusable behavior. Add bounded stronger defaults where the design system directly controls presentation, without claiming full-site AAA conformance.

Advantages:

- one auditable capability checklist;
- clear ownership between package and consumer;
- gives private CI and first-consumer qualification a stable target;
- prevents richer interaction work from creating hover-only or motion-only behavior;
- preserves native-first semantics and existing layer boundaries.

Trade-offs:

- requires additional browser/integration validation;
- some criteria remain consumer-owned or need human evidence;
- the contract must distinguish design-system conformance from application/site conformance.

## Recommended stronger defaults

For Phyllotaxis-authored presentation:

1. Authored focus indicators should satisfy the WCAG 2.4.13 focus-appearance geometry/contrast model (at least a 2 CSS px perimeter-equivalent and 3:1 focused-vs-unfocused change), even though WCAG classifies that criterion as AAA.
2. Reusable non-essential interaction motion must be disabled when `prefers-reduced-motion: reduce` applies.
3. A reusable hover affordance must expose equivalent keyboard focus behavior when the same state/action applies.
4. Meaning/state must not depend on color, motion, hover, or pointer precision alone.

These rules strengthen design-system defaults; they do not assert AAA conformance for consuming applications.

## Recommendation

Choose **C — define one cross-layer Phyllotaxis capability floor**.

The public contract should establish a WCAG 2.2 AA minimum for reusable Phyllotaxis-controlled behavior, explicitly assign consumer-owned obligations, and define validation as layered evidence rather than a single scanner result.

## Resolution

Proceed to **RFC-0005 — Cross-layer accessibility capability contract** with alternative C.

RFC-0005 should:

- define the reusable WCAG 2.2 AA floor;
- codify native-first semantics, keyboard/focus, contrast, target-size, reflow/text-spacing, forced-colors, state-signalling, and motion rules;
- keep authored content/workflow obligations with consumers;
- define layer ownership;
- require layered deterministic + browser evidence;
- prohibit treating axe or another automated engine as complete conformance evidence;
- constrain hover/motion behavior without creating a general animation system.

## Reassessment triggers

Revisit this decision if:

- a required rule cannot be enforced without violating the Chroma/Venation/Lamina ownership model;
- representative consumers demonstrate that the proposed capability floor is materially incompatible with a legitimate platform/content requirement;
- browser/platform accessibility behavior changes enough to require a revised evidence model;
- a future native/mobile Phyllotaxis surface needs a technology-neutral contract separate from the web-specific delivery profile.
