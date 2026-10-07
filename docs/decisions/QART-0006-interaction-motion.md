# QART-0006 — Bounded interaction motion alternatives

Status: **Resolved into [RFC-0006](RFC-0006-interaction-motion.md)**  
Tracks: #39  
Builds on: [ADR-0003 Utility composition guidance](ADR-0003-utility-composition-patterns.md), [ADR-0004 accessibility capability floor](ADR-0004-accessibility-capability-floor.md)

## Question

How should Phyllotaxis permit subtle interaction feedback without weakening the Utility visual directive, implying false click targets, creating a general animation system, or conflicting with the accepted accessibility capability floor?

## Constraints

Any accepted direction must preserve:

- motion is never a semantic channel;
- `prefers-reduced-motion: reduce` disables non-essential Phyllotaxis-authored movement;
- hover is not the sole route to reusable information/actions and focus feedback remains equivalent where hover/focus represent the same action/state;
- Utility rejects ornamental motion and floating-card choreography;
- Venation remains layout-only;
- Lamina does not gain generic Card/Pill/Badge/Tag wrappers merely to host effects;
- Chroma v1 does not change without separate compatibility evidence.

## Alternatives

### A — Prohibit all Phyllotaxis motion

**Benefit:** maximally simple and impossible to confuse with ornamental animation.

**Cost:** unnecessarily rejects small modern interaction feedback even when semantics, focus, and reduced-motion behavior are already correct.

### B — Accept a bounded behavior-only interaction contract

Permit motion only for already-interactive elements/surfaces, prefer non-motion feedback first, limit ordinary hover/active movement to a short 80–160ms envelope and at most 1px translation, gate hover-only movement to hover-capable input, and require reduced-motion removal plus visible focus/active feedback.

**Benefit:** improves affordance while keeping semantics and accessibility authoritative.

**Cost:** consumers may temporarily duplicate small local values until repeated evidence justifies stable Chroma roles.

### C — Add public Chroma motion tokens now

**Benefit:** immediate value reuse.

**Cost:** current evidence does not justify a stable motion-role vocabulary or Chroma v2 compatibility surface.

### D — Add generic animated Card/Pill components

**Benefit:** convenient reuse.

**Cost:** creates generic wrapper semantics that existing Lamina decisions explicitly reject and risks implying whole-surface interactivity.

### E — Leave motion entirely consumer-owned and unbounded

**Benefit:** no public contract change.

**Cost:** does not prevent drift into scale/pop, larger lifts, sticky touch hover, motion-dependent state, or inconsistent reduced-motion behavior.

## Recommendation

Choose **B — bounded behavior-only interaction contract**.

It is the smallest change that:

- composes with ADR-0004 rather than restating a weaker accessibility rule;
- distinguishes useful interaction feedback from ornament;
- gives consumers deterministic bounds;
- leaves stable Chroma/Lamina/Venation APIs unchanged;
- creates an evidence path for later token promotion only if independent consumers converge.

## Resolution

Resolved into RFC-0006. No separate motion token system or generic component family is authorized.
