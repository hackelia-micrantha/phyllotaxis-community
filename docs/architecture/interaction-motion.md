# Interaction motion contract

Status: **Accepted by [ADR-0005](../decisions/ADR-0005-interaction-motion.md)**

## Purpose

Define the smallest interaction-motion behavior Phyllotaxis permits without turning animation into decoration or creating new generic component semantics.

> **Motion communicates interactivity or state; it is not decoration.**

This contract applies across Utility and Editorial. It specializes the accepted [accessibility capability floor](../requirements/accessibility.md): motion is never a semantic channel, reduced-motion disables non-essential Phyllotaxis-authored movement, and hover must not become the sole route to information or actions. It does not require consumers to animate any surface.

## Eligibility

Motion is justified only when it reinforces an interaction that already exists semantically.

Permitted examples include:

- a bounded link or button giving a small hover/active response;
- a genuinely interactive card-like surface whose entire bounded surface is the interactive target;
- a consumer-owned chip/pill control when the pill itself is an actual control or link;
- short open/close or state transitions when motion improves continuity and the same state remains understandable without movement.

Do not add motion merely because a region is visually bounded.

Static cards, informational panels, status labels, taxonomy text, and decorative containers do not move on hover unless they independently acquire real interactive semantics.

A `PostSummary` whose title contains the only link is not a whole-card interactive surface. Moving the entire summary on title hover would falsely imply whole-card click behavior.

## Default motion envelope

When motion is used, prefer the smallest signal that communicates the interaction:

- duration: **80–160ms** for ordinary hover/active feedback;
- displacement: **at most 1px** for default bounded-surface translation;
- easing: short ease-out behavior that settles quickly;
- properties: color, background-color, border-color, text decoration, and small transform changes;
- active state: return toward the resting position rather than adding a larger second movement;
- hover-only movement: gate it to hover-capable input (for example `@media (hover: hover)`) so touch-only devices do not acquire sticky pseudo-hover motion.

Prefer color/border/surface-state changes before translation.

Default Phyllotaxis interaction behavior must not use:

- scale/pop effects;
- spring/bounce motion;
- parallax;
- scroll-triggered reveal;
- attention-seeking pulse;
- broad shadow/elevation animation;
- layout-affecting position, size, or spacing animation.

A consumer may own richer product-specific motion, but it is not part of the Phyllotaxis default contract.

## Accessibility

Motion is never the only interaction-state signal.

Hover, focus, active, selected, expanded, and disabled states must remain understandable through non-motion presentation and native semantics.

For reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  /* Example only: match state-selector specificity as needed. */
  .interactive-surface,
  .interactive-surface:hover,
  .interactive-surface:active {
    transition-duration: 0ms;
    transform: none;
  }
}
```

The normative behavior is:

- remove non-essential transform/movement;
- do not require smooth scrolling or animated reveal;
- retain visible color, border, underline, focus-ring, or equivalent non-motion state feedback;
- preserve native keyboard/focus behavior;
- preserve equivalent visible focus feedback when hover and focus represent the same action/state; focus does not need to reproduce hover movement.

Reduced motion does not mean removing interaction feedback.

## Layer ownership

### Chroma

Chroma owns presentation values.

This first contract does **not** add stable public motion roles to Chroma v1. Implementations may use internal `--pt-*` helpers for bounded duration/easing/distance values where reuse is useful.

Promotion to public `--phyllotaxis-*` motion properties requires separate consumer evidence and a versioned Chroma contract decision. The accepted v1 inspection role vocabulary remains unchanged.

### Venation

Venation remains motion-neutral.

Layout primitives do not acquire animation, hover, or transition props. Motion must not alter structural relationships or responsive layout semantics.

### Lamina

Lamina may apply selector-specific interaction presentation when an accepted semantic component is itself interactive.

This contract does not add:

- `Card`;
- `Pill`;
- `Badge`;
- generic `Tag`;
- visual `motion`, `hover`, `lift`, `duration`, or `easing` props.

Lamina must not imply larger interactive hit areas than its native DOM semantics provide.

### Consumer CSS

Consumer-owned interactive surfaces may implement the bounded behavior directly while evidence accumulates.

Repeated compatible values across independent consumers are evidence for later Chroma promotion; they are not automatically stable API.

## Profile behavior

### Utility

Utility should use motion sparingly.

A 1px lift on a strongly bounded actionable link/button can be appropriate. Static section grids and informational regions remain flat and still.

The Utility rule remains:

> **1990s in visual character, not in capability.**

Modern interaction quality is compatible with visual restraint.

### Editorial

Editorial may use the same bounded interaction envelope where it improves affordance on actual controls or linked surfaces.

Editorial does not justify ornamental reveal, floating-card choreography, or larger motion by itself.

## Reference pattern

```css
.action {
  transition:
    background-color 120ms ease-out,
    border-color 120ms ease-out,
    transform 120ms ease-out;
}

@media (hover: hover) {
  .action:hover {
    transform: translateY(-1px);
  }
}

.action:active {
  outline: 1px solid currentColor;
  outline-offset: -1px;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .action,
  .action:hover,
  .action:active {
    transition-duration: 0ms;
    transform: none;
  }
}
```

The example includes a non-motion pressed cue and assumes the action also has visible non-motion hover/focus feedback.

## Validation

A conforming implementation or consumer example must demonstrate that:

1. only actually interactive elements receive hover motion;
2. static bounded regions remain still;
3. displacement stays within the default 1px envelope unless a separate product requirement owns the deviation;
4. no scale/pop or layout animation is introduced by default;
5. reduced-motion removes non-essential movement;
6. non-motion state feedback remains visible;
7. hover-only movement is gated to hover-capable input and is not required on touch-only devices;
8. focus behavior remains keyboard-accessible and independent of hover;
9. stable Chroma v1 contract data remains unchanged.

## Main invariant

> If removing the movement would make the interaction impossible to understand, the interaction is incorrectly depending on motion.
