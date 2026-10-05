# QART-0003 — Consumer experimentation boundary

Status: **Resolved into RFC-0003**

## Question

How should Phyllotaxis support A/B, multivariate, and other presentation experiments without turning provisional product experiments into a second design system or adding assignment/analytics responsibilities to the design-system runtime?

The accepted architecture already separates responsibilities:

- Chroma owns semantic visual values;
- Venation owns layout relationships;
- Lamina owns reusable semantics;
- Utility and Editorial are semantic visual profiles selected by task/content, not arbitrary themes.

The unresolved question is where experiment identity, variant assignment, temporary visual overrides, measurement, and promotion should live.

## Alternatives

### A — Leave experimentation entirely unspecified

Consumers may experiment however they choose, with no Phyllotaxis guidance.

Advantages:

- no new public design work;
- no additional contract surface.

Trade-offs:

- consumers may encode experiment names as profile values;
- ad hoc CSS can depend on internal helpers or bypass accessibility invariants;
- experiment branches can leak into Venation/Lamina;
- successful local experiments may become de facto undocumented design-system APIs.

### B — Use existing Phyllotaxis seams; keep experiment lifecycle host-owned

Define a public boundary in which:

- visual experiments override stable public Chroma roles at coherent consumer-owned surfaces;
- layout experiments compose stable Venation primitives without adding experiment props;
- semantic experiments compose existing Lamina semantics or consumer-local components;
- assignment, persistence, analytics, statistics, and cleanup remain consumer responsibilities;
- every variant independently passes applicable deterministic validation;
- reusable findings enter normal QART/RFC/ADR promotion rather than silently changing contracts.

Advantages:

- fits the accepted layer ownership model;
- requires no new runtime/package API;
- lets consumers experiment without forking design-system semantics;
- keeps provisional experiment state provisional;
- keeps security/privacy/analytics responsibilities with the product that owns them.

Trade-offs:

- consumers need their own experiment/feature-flag mechanism when they want persistent assignment;
- consumers must remove stale experiment branches themselves;
- not every experiment can be expressed as value overrides; some remain host composition changes.

### C — Add a first-class Phyllotaxis Variant/Experiment API

Add runtime concepts such as `Variant`, `ExperimentProvider`, assignment helpers, or a registry.

Advantages:

- one common API for consumers;
- could centralize naming and lifecycle conventions.

Trade-offs:

- cuts across the current CSS/server-rendered profile model;
- risks becoming an arbitrary theme/feature-flag framework;
- creates runtime responsibility for state Phyllotaxis does not otherwise own;
- current consumer evidence does not show a problem that requires this abstraction.

### D — Represent experiment variants as additional Phyllotaxis profiles

Add values such as `pastel` or experiment names to `data-phyllotaxis-profile`.

Advantages:

- mechanically simple;
- reuses an existing carrier.

Trade-offs:

- changes profile semantics from task/content meaning into arbitrary experiment buckets;
- encourages profile proliferation;
- conflates provisional product evidence with stable design-system contract;
- conflicts with the accepted bounded Utility/Editorial profile model.

## Recommendation

Choose **B — existing Phyllotaxis seams with host-owned experiment lifecycle**.

The current community-site question provides sufficient concrete evidence: compare strict Utility against the same Utility semantics with bounded pastel surface-role overrides. That experiment can be represented entirely through stable Chroma roles while assignment and measurement remain outside Phyllotaxis.

No current evidence justifies a runtime Variant API or new profile value.

## Resolution

Proceed to **RFC-0003 — Consumer experimentation boundary** with alternative **B**.

The RFC should make explicit that:

- semantic profiles are not experiment buckets;
- Chroma public roles are the preferred visual experimentation seam;
- Venation and Lamina remain experiment-neutral;
- assignment and telemetry are host-owned;
- assignment state is not authorization;
- every variant retains the normal accessibility, functional, security/privacy, responsive, and applicable performance requirements;
- scheme-aware experiments preserve the existing light/dark resolution model;
- reusable experiment findings require normal design-governance promotion.

Alternatives **C** and **D** are rejected for the current contract. Revisit C only if repeated consumer evidence demonstrates a concrete problem that host-owned composition cannot solve.

## Trigger for revisiting the resolution

Re-open the design question if at least one of these becomes true:

1. multiple consumers independently need the same experiment/variant abstraction;
2. host-owned assignment causes a reproducible compatibility or rendering problem that cannot be solved at the consumer boundary;
3. an accepted Phyllotaxis feature requires coordinated experiment state across otherwise independent consumers;
4. repeated experiments reveal a stable semantic profile or role that the current contract cannot represent.
