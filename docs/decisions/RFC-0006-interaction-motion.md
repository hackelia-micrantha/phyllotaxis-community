# RFC-0006 — Bounded interaction motion

Status: **Accepted by [ADR-0005](ADR-0005-interaction-motion.md)**  
Origin: [QART-0006](QART-0006-interaction-motion.md)  
Builds on: [Visual directive](../architecture/visual-directive.md), [ADR-0003](ADR-0003-utility-composition-patterns.md), [ADR-0004 accessibility capability floor](ADR-0004-accessibility-capability-floor.md), [Chroma profile contract](../architecture/chroma-profile-contract.md), [Lamina editorial contract](../architecture/lamina-editorial-contract.md)  
Tracks: #39

## Decision under review

Permit restrained interaction motion when it reinforces an interaction or state that already exists semantically, while keeping ornamental animation outside the Phyllotaxis default contract.

The proposal is:

1. motion communicates interactivity/state, not decoration;
2. ordinary hover/active feedback is short and bounded, with translation limited to 1px by default;
3. static visually bounded regions remain still;
4. whole-surface motion requires whole-surface interactive semantics;
5. reduced-motion removes non-essential movement while preserving non-motion state feedback;
6. Venation remains motion-neutral;
7. no generic Lamina Card/Pill/Badge/Tag API is introduced;
8. no stable Chroma v1 motion role or public custom property is introduced.

## Why now

Phyllotaxis already rejects ornamental motion, but real consumers need a precise boundary between decorative animation and modern interaction feedback.

The accepted Utility composition guidance permits bounded action treatment and explicitly keeps the design visually restrained. Editorial evidence already treats reduced-motion handling as a shared capability. What is missing is a durable rule for subtle hover/active behavior so consumers do not independently invent larger lifts, scale effects, floating-card treatment, or inconsistent reduced-motion handling.

## Interaction eligibility

Motion is permitted only for an element or bounded surface that is already interactive through native/accepted semantics.

Examples:

- an anchor or button;
- a consumer-owned chip/pill that is itself a link/control;
- a card-like link/control whose whole surface is actually interactive;
- short open/close state continuity where the resulting state is equally understandable without movement.

Static panels, status labels, informational cards, and decorative containers do not gain hover motion merely because they are visually bounded.

A `PostSummary` whose title is the only link remains a summary with a linked title; moving the whole summary would falsely imply whole-card click semantics.

## Default envelope

For ordinary hover/active feedback:

- duration: 80–160ms;
- translation: no more than 1px by default;
- easing: short settling/ease-out behavior;
- hover-only movement is gated to hover-capable input so touch-only devices do not retain pseudo-hover movement;
- prefer color/background/border/text-decoration changes before movement;
- active state should settle toward rest rather than add larger motion.

Default Phyllotaxis behavior does not use scale/pop, bounce/spring, parallax, scroll reveal, pulse, broad elevation animation, or layout-affecting animation.

## Accessibility

Motion is never the only state signal.

`prefers-reduced-motion: reduce` removes non-essential transforms/movement. Visible background, border, underline, focus-ring, or equivalent non-motion feedback remains.

Keyboard focus remains explicit and must provide equivalent visible feedback when hover/focus represent the same action or state; it does not need to reproduce hover movement. Reduced-motion handling must explicitly cover hover/active selectors when specificity would otherwise preserve transforms.

## Chroma impact

No stable Chroma v1 expansion.

Internal implementation helpers may hold repeated duration/easing/distance values, but consumers must not depend on internal `--pt-*` names.

Promotion to public `--phyllotaxis-*` motion roles requires independent consumer evidence and an explicit versioned Chroma compatibility decision.

## Lamina impact

No generic Card/Pill/Badge/Tag component and no `motion`, `hover`, `lift`, `duration`, or `easing` props.

Selector-specific presentation is permitted only when an accepted semantic component is itself interactive.

## Venation impact

No API change. Layout relationships do not animate and do not acquire motion props.

## Consumer boundary

Consumers may implement the bounded interaction behavior locally while evidence accumulates. Richer product-specific motion remains consumer-owned and does not redefine Phyllotaxis defaults.

## Validation

Before acceptance:

- [x] public guidance distinguishes interaction motion from ornamental animation;
- [x] static bounded regions remain explicitly non-interactive/non-moving;
- [x] default timing/displacement are bounded;
- [x] reduced-motion behavior preserves non-motion feedback;
- [x] Utility reference demonstrates one actually interactive element;
- [x] Chroma v1 role/public-interface files remain unchanged;
- [x] no new Lamina/Venation API is implied;
- [x] ADR-0005 accepts this RFC in the same delivery slice.

## Non-goals

- generic animation framework;
- arbitrary motion token scale;
- animation orchestration;
- product-specific micro-interaction catalog;
- scroll/reveal/parallax effects;
- restyling all current consumers;
- changing profile selection or package/runtime interfaces.
