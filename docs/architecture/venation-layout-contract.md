# Venation layout contract

Status: **Accepted**  

## Decision

Venation is Phyllotaxis's structural layout layer. Its public primitives express **layout relationships and intent**, not arbitrary CSS mechanics.

The ownership rule is:

> **Chroma owns values. Venation owns relationships.**

Chroma owns themeable values such as spacing, content widths, density, and named responsive thresholds. Venation consumes those values to describe structural relationships such as vertical rhythm, horizontal flow, wrapping, repeated grids, and bounded content regions.

This contract is accepted. Implementation is owned by the private canonical repository and must conform to this published contract.

## Layer boundary

### Venation owns

- composition and spatial relationships between children
- layout direction, alignment, justification, wrapping, and bounded width
- intrinsic responsive behavior where CSS can express the relationship directly
- semantic references to Chroma layout tokens
- predictable DOM structure required to realize a primitive

### Chroma owns

- spacing values and spacing scale names
- content-width values
- density values
- named breakpoints when an explicit breakpoint is unavoidable
- theme-dependent value resolution

### Lamina owns

- visual surfaces and component semantics
- typography presentation, borders, backgrounds, elevation, interactive states, and component-specific appearance
- composition of Venation primitives into higher-level UI components

### Venation does not own

- arbitrary style-system passthrough
- component appearance
- product-specific responsive policy
- application-specific grid systems
- semantic business components

## Design principles

1. **Intent over mechanism.** A consumer requests `gap="md"`, not `row-gap: 16px`.
2. **Intrinsic before breakpoint-driven.** Prefer flex/grid/container behavior that adapts to available space without JavaScript or breakpoint APIs.
3. **Small contracts.** A primitive earns a prop only when the prop represents a recurring structural relationship.
4. **Stable tokens, replaceable values.** Venation refers to Chroma token names rather than encoding visual values.
5. **Escape hatches stay outside the stable contract.** Custom styling may be attached through normal platform mechanisms, but Venation does not promise arbitrary CSS properties as API.
6. **DOM semantics remain explicit.** Layout must not force consumers into semantically incorrect elements.

## Shared token references

The exact Chroma implementation is intentionally out of scope, but Venation requires semantic references equivalent to:

```ts
type Space = "none" | "xs" | "sm" | "md" | "lg" | "xl";
type ContentWidth = "narrow" | "readable" | "wide" | "full";
type Breakpoint = "sm" | "md" | "lg" | "xl";
```

These are contract-level names, not commitments to concrete CSS values. Chroma may resolve them through CSS custom properties, generated styles, or another implementation mechanism.

## Validation against Micrantha web

The initial contract was checked against the current `hackelia-micrantha/web` layout patterns before implementation.

Observed recurring relationships:

- site shell: bounded content width with responsive page gutters;
- navigation/footer: horizontal groups with alignment, wrapping, and bounded width;
- support/blog/project collections: repeated responsive card grids;
- page/section/card content: vertical rhythm;
- footer links and article metadata: wrapped clusters with different horizontal and vertical gaps;
- hero/contact/series-navigation regions: content that is stacked when constrained and side-by-side when sufficient inline space exists.

The first four categories map cleanly to `Container`, `Inline`, `Cluster`, `Grid`, and `Stack`.

The validation exposed three contract refinements:

1. `Cluster` needs optional `rowGap` and `columnGap` overrides because asymmetric wrapped spacing recurs in both footer navigation and article metadata.
2. `Container` needs a semantic page-gutter value whose concrete responsive/fluid values remain owned by Chroma.
3. A sixth primitive, `Switcher`, is required for the recurring “stack when constrained, row when space permits” relationship. Encoding that behavior as viewport breakpoint classes would violate the intrinsic-layout preference and repeat product policy in consumers.

## Primitive contracts

### `Stack`

**Purpose:** express one-dimensional vertical rhythm between children.

```ts
interface StackProps {
  gap?: Space;
  align?: "start" | "center" | "end" | "stretch";
}
```

Defaults:

- `gap="md"`
- `align="stretch"`

Non-goals:

- horizontal layout
- arbitrary per-child spacing
- vertical positioning tricks or overlap

### `Inline`

**Purpose:** express horizontal flow with explicit alignment and optional wrapping.

```ts
interface InlineProps {
  gap?: Space;
  align?: "start" | "center" | "end" | "baseline" | "stretch";
  justify?: "start" | "center" | "end" | "between";
  wrap?: boolean;
}
```

Defaults:

- `gap="md"`
- `align="center"`
- `justify="start"`
- `wrap=false`

Non-goals:

- free-form flexbox configuration
- ordering children independently from DOM order
- arbitrary grow/shrink/basis controls as stable props

### `Cluster`

**Purpose:** express a wrapping group whose members maintain consistent spacing while adapting to available width.

```ts
interface ClusterProps {
  gap?: Space;
  rowGap?: Space;
  columnGap?: Space;
  align?: "start" | "center" | "end" | "baseline";
  justify?: "start" | "center" | "end" | "between";
}
```

Defaults:

- `gap="sm"`
- `rowGap` and `columnGap` inherit from `gap` when omitted
- `align="center"`
- `justify="start"`

`Cluster` always wraps. `rowGap` and `columnGap` exist because wrapped groups may need tighter inter-row rhythm than inline separation; this pattern is repeated in current Micrantha footer and article metadata layouts. If wrapping is not part of the relationship, use `Inline`.

Non-goals:

- masonry layout
- fixed-column layout
- arbitrary flex controls

### `Grid`

**Purpose:** express repeated items that form as many columns as available space permits while respecting a minimum item width.

```ts
type StructuralLength =
  | `${number}rem`
  | `${number}em`
  | `${number}ch`;

interface GridProps {
  gap?: Space;
  minItemWidth: StructuralLength;
  align?: "start" | "center" | "end" | "stretch";
}
```

The first implementation should use intrinsic CSS grid behavior equivalent to `repeat(auto-fit, minmax(...))` rather than exposing a breakpoint-to-column-count map.

`minItemWidth` is a **constrained structural length** in the initial contract.

The rationale is that minimum viable item width is often driven by content characteristics rather than by a globally reusable visual scale. Venation therefore accepts a bounded structural value while still preventing arbitrary CSS expressions from entering the stable API.

Initial allowed units are `rem`, `em`, and `ch`. Values such as `px`, percentages, viewport units, `calc(...)`, CSS variables, and arbitrary strings are excluded from the stable contract.

A recurring semantic width may later be promoted into Chroma when real usage demonstrates that the value represents a shared design-system concept rather than a one-off structural threshold.

Non-goals:

- application-specific 12-column grid systems
- explicit responsive column maps such as `{ sm: 1, md: 2, lg: 4 }` in the initial API
- masonry

### `Switcher`

**Purpose:** keep children side-by-side when sufficient inline space exists and stack them when the container becomes constrained.

```ts
interface SwitcherProps {
  gap?: Space;
  threshold: StructuralLength;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
}
```

`Switcher` is intrinsic: its transition is based on available container space, not a named viewport breakpoint. The implementation may use flex wrapping and a threshold-derived basis or an equivalent container-aware CSS technique.

This primitive is justified by repeated current Micrantha patterns:

- homepage hero media/content;
- homepage contact content/actions;
- blog series navigation content/actions.

Non-goals:

- arbitrary responsive direction maps;
- viewport breakpoint APIs;
- per-child order changes;
- general flexbox passthrough.

### `Container`

**Purpose:** bound content width while preserving normal document flow.

```ts
type ContainerGutter = Space | "page";

interface ContainerProps {
  maxWidth?: ContentWidth;
  gutter?: ContainerGutter;
}
```

Defaults:

- `maxWidth="readable"`
- `gutter="page"`

`page` is a semantic Chroma layout token. Chroma owns its concrete values and may resolve it fluidly or responsively; Venation only expresses that the container uses the shared application-page gutter.

Non-goals:

- page chrome
- visual surface styling
- viewport-height management

## Element semantics and polymorphism

Venation primitives should not introduce a semantic element merely because layout is required.

Initial contract:

```ts
type ElementType = keyof JSX.IntrinsicElements;

interface PolymorphicLayoutProps {
  as?: ElementType;
}
```

Rules:

- Default element is `div`.
- `as` may select a native semantic element appropriate to the consumer's content.
- Venation must not infer semantic roles from visual layout.
- `as` does not alter the layout contract.
- Accessibility attributes pass through to the selected native element, but layout props remain the only Venation-owned styling API.

Framework-specific typing mechanics are implementation details and should not leak into the conceptual contract.

## Responsive behavior

Venation prefers intrinsic layout over explicit breakpoints.

Examples:

- `Cluster` wraps naturally.
- `Grid` derives column count from available space and minimum item width.
- `Container` constrains readable width without switching modes at named viewport widths.

Named Chroma breakpoints may be introduced later only when a structural relationship cannot be expressed robustly using intrinsic CSS. Breakpoint maps are therefore **not** part of the first stable Venation contract.

This keeps Venation usable inside nested containers and embedded surfaces where viewport-width assumptions are often wrong.

## Escape hatch

Consumers may attach normal `className`, `data-*`, accessibility attributes, and framework-supported event/DOM props to the underlying element.

`className` is an integration escape hatch, not an extension of the Venation contract:

- Venation does not validate or guarantee arbitrary consumer CSS.
- Consumer CSS must not be required to obtain the documented behavior of a primitive.
- A recurring escape-hatch pattern is evidence that the public contract should be reviewed rather than automatically expanded.

A generic `style` or arbitrary-system-prop object should not be elevated into Venation's stable design-system API.

## Representative layout validation

The contract must support at least these compositions without additional layout abstractions.

### 1. Application content page

```tsx
<Container maxWidth="readable">
  <Stack gap="lg">
    <header>...</header>
    <main>...</main>
    <footer>...</footer>
  </Stack>
</Container>
```

Validates bounded content width and vertical rhythm.

### 2. Toolbar/action group

```tsx
<Cluster gap="sm" justify="between">
  <Inline gap="sm">...</Inline>
  <Inline gap="xs">...</Inline>
</Cluster>
```

Validates horizontal composition, grouped actions, and graceful wrapping without a breakpoint contract.

### 3. Repeated card collection

```tsx
<Grid gap="md" minItemWidth="18rem">
  {items.map(item => <Card key={item.id} {...item} />)}
</Grid>
```

Validates intrinsic responsive repetition using a constrained structural length.

### 4. Wrapped metadata/navigation cluster

```tsx
<Cluster columnGap="md" rowGap="xs" align="center">
  ...
</Cluster>
```

Validates asymmetric spacing across wrapped rows without exposing raw `gap-x` / `gap-y` CSS.

### 5. Content/action switcher

```tsx
<Switcher gap="lg" threshold="42rem" align="end" justify="between">
  <Stack gap="sm">...</Stack>
  <Cluster gap="sm">...</Cluster>
</Switcher>
```

Validates the recurring Micrantha pattern currently expressed as `flex-col md:flex-row`, while making the transition depend on available container space rather than viewport policy.

### 6. Shared page shell

```tsx
<Container maxWidth="wide" gutter="page" as="main">
  ...
</Container>
```

Validates the repeated application shell used by main content, navigation, and footer. Chroma remains responsible for the actual page-gutter values.

## Ownership decisions

The Venation/Chroma boundary for size-like structural values is accepted.

- spacing scale -> Chroma
- content widths -> Chroma
- density -> Chroma
- named breakpoints -> Chroma, only when required by an approved Venation contract
- structural relationships -> Venation
- grid minimum item width -> constrained structural length owned by the Venation contract

Token-promotion rule:

- keep content-driven minimum widths structural by default;
- if two or more real layouts repeatedly use the same width for the same semantic reason, review that value for promotion into Chroma;
- promotion must introduce a meaningful semantic name rather than a generic size alias;
- callers should not need a Chroma token merely to express a one-off intrinsic grid threshold.

## Implementation

The contract gate is complete:

- the six primitive purposes are accepted;
- the Venation/Chroma ownership rule is accepted;
- the constrained `Grid.minItemWidth` contract is accepted;
- representative Micrantha layouts are covered without recurring breakpoint/layout escape hatches;
- escape-hatch semantics and polymorphism rules are accepted.

Production implementation and characterization/contract tests are tracked in #4 so contract review remains distinct from framework/CSS mechanics.

The Utility/Editorial profile boundary does not alter this contract. Both profiles must consume the same Venation structural API.
