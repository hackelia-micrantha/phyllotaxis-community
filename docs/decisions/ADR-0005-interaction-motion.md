# ADR-0005 — Accept bounded interaction motion

- **Status:** Accepted
- **Date:** 2026-10-07
- **Decision owners:** Phyllotaxis public contract authority
- **Scope:** Cross-profile interaction-motion guidance
- **Supersedes:** None
- **Superseded by:** None

## Context

Phyllotaxis Utility intentionally rejects ornamental animation, floating-card treatment, and contemporary decorative motion, while still requiring modern accessibility and interaction quality. Editorial evidence independently requires deliberate reduced-motion handling.

The missing boundary was whether subtle hover/active motion is compatible with that visual direction and, if so, how to prevent it from becoming an unbounded animation vocabulary or implying interaction where none exists.

QART-0006 resolves the alternatives into RFC-0006. RFC-0006 proposes a behavior-only contract that specializes the accepted accessibility capability floor: restrained motion may reinforce real interaction/state semantics, while stable Chroma/Lamina/Venation APIs remain unchanged.

## Decision

Accept RFC-0006.

The durable rules are:

1. **Motion communicates interaction or state, not decoration.**
2. **Static bounded content remains still.** A card/panel/pill shape alone is not sufficient reason for hover movement.
3. **Whole-surface motion requires whole-surface interactivity.** A container with only a nested link must not visually claim a larger click target.
4. **Ordinary interaction motion is small.** Default hover/active translation is at most 1px and normally completes within 80–160ms.
5. **Hover-only movement is input-capability aware.** Gate hover motion to hover-capable input so touch-only devices do not acquire sticky pseudo-hover motion.
6. **Prefer non-motion feedback first.** Color, background, border, underline, and focus treatment carry the primary state signal; hover/focus parity follows the accepted accessibility capability floor.
7. **Reduced motion removes non-essential movement, not feedback.** Transform/movement is neutralized while visible hover/focus/active cues remain.
8. **No default scale/pop, bounce, parallax, reveal, pulse, broad elevation, or layout animation.**
9. **Venation remains motion-neutral.**
10. **Lamina does not gain generic Card/Pill/Badge/Tag semantics or motion-tuning props.**
11. **Stable Chroma v1 remains unchanged.** Any future public motion roles require separate evidence and versioned contract review.

## Alternatives considered

### Prohibit all motion

Not selected. It conflates ornamental animation with useful modern interaction feedback and would make the Utility direction unnecessarily rigid.

### Add public Chroma motion tokens immediately

Not selected. The desired behavior is clear, but independent consumer evidence does not yet justify stable duration/easing/distance role IDs or a Chroma v2 compatibility surface.

### Add generic animated Card/Pill components

Not selected. The existing contracts deliberately reject generic wrapper semantics, and animation does not create semantic reuse.

### Allow consumer-defined motion without bounds

Not selected. That would preserve API stability but fail to provide the design-system consistency the user interaction requires.

## Consequences

### Positive

- consumers can add subtle hover affordance without violating Utility restraint;
- reduced-motion behavior becomes explicit and testable;
- static and interactive surfaces remain visually distinguishable;
- current public component/token APIs remain stable;
- future motion-token promotion has a clear evidence gate.

### Negative and accepted costs

- consumers may temporarily duplicate small motion values;
- the 80–160ms / 1px envelope is guidance rather than a machine-readable token contract;
- some product-specific interactions will need documented local deviations.

### Accessibility

- motion is never required for comprehension;
- reduced-motion removes non-essential movement;
- keyboard focus remains explicit and independent of hover;
- visible non-motion state feedback is required.

### Compatibility

No package/runtime API migration is required. Existing consumers remain conforming without adding motion.

## Accepted contract updates

The same delivery slice:

- adds [Interaction motion](../architecture/interaction-motion.md);
- clarifies the [Visual directive](../architecture/visual-directive.md);
- updates the Utility reference fixture with one bounded interactive example.

The Chroma inspection/public-interface v1 files, Venation contract, Lamina component surface, and profile carriers remain unchanged.

## Reassessment triggers

Revisit when:

- at least two independent consumers duplicate the same motion values;
- a repeated interactive semantic cannot be expressed without new Lamina behavior;
- accessibility evidence suggests the current envelope is too permissive or too restrictive;
- platform/browser behavior makes the reduced-motion strategy unreliable.

## Evidence

- [QART-0006 — Bounded interaction motion alternatives](QART-0006-interaction-motion.md)
- [RFC-0006 — Bounded interaction motion](RFC-0006-interaction-motion.md)
- Issue #39
- PR #40
