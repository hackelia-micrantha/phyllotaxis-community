# Decision records

Public Phyllotaxis design decisions use Micrantha's standard progression:

```text
QART -> RFC -> ADR -> implementation
```

Use **QART** while material questions remain open, **RFC** for substantial proposals affecting public contracts or compatibility, and **ADR** for accepted durable decisions. Preserve superseded records and link successors rather than rewriting history.

Prefer stable names such as `QART-0001-topic.md`, `RFC-0001-topic.md`, and `ADR-0001-topic.md`.

Delivery issues may remain private when they expose implementation details, but public decision records must remain understandable without private issue access.
## Current records

- [QART-0001 — Machine-readable Chroma inspection contract](QART-0001-chroma-inspection-contract.md) — alternatives resolved into RFC-0001.
- [RFC-0001 — Static Chroma inspection contract](RFC-0001-chroma-inspection-contract.md) — accepted by ADR-0001.
- [ADR-0001 — Accept static Chroma inspection contract](ADR-0001-chroma-inspection-contract.md) — accepted durable decision.
- [QART-0002 — Public runtime and `phyllo` distribution boundary](QART-0002-public-distribution-boundary.md) — resolved into RFC-0002 after first-consumer evidence required credential-free public acquisition.
- [RFC-0002 — Public npm-compatible Phyllotaxis package distribution](RFC-0002-public-package-distribution.md) — accepted by ADR-0006; defines the private-canonical/public-package boundary and first-release delivery gates.
- [ADR-0006 — Accept public npm-compatible Phyllotaxis package distribution](ADR-0006-public-package-distribution.md) — accepts the distribution architecture while preserving separate publication and first-consumer qualification authority.
- [QART-0003 — Consumer experimentation boundary](QART-0003-consumer-experimentation-boundary.md) — resolved into RFC-0003 after comparing unspecified, host-owned, runtime-API, and profile-based approaches.
- [RFC-0003 — Consumer experimentation and validation boundary](RFC-0003-consumer-experimentation-boundary.md) — accepted by ADR-0002; keeps A/B assignment and measurement host-owned while experiments use existing Phyllotaxis semantic seams.
- [ADR-0002 — Keep Phyllotaxis experimentation host-owned](ADR-0002-consumer-experimentation-boundary.md) — accepted durable decision.
- [QART-0004 — Utility composition promotion from consumer evidence](QART-0004-utility-composition-patterns.md) — resolved into RFC-0004 after comparing consumer-only, composition-guidance, Chroma-role, and generic-component options.
- [RFC-0004 — Utility composition patterns from consumer evidence](RFC-0004-utility-composition-patterns.md) — accepted by ADR-0003; promotes reusable composition lessons without expanding stable Chroma/Lamina/Venation APIs.
- [ADR-0003 — Accept Utility composition guidance from consumer evidence](ADR-0003-utility-composition-patterns.md) — accepted durable decision.
- [QART-0005 — Cross-layer accessibility capability floor](QART-0005-accessibility-capability-floor.md) — resolves scattered, consumer-only, and cross-layer alternatives into RFC-0005.
- [RFC-0005 — Cross-layer accessibility capability contract](RFC-0005-accessibility-capability-contract.md) — accepted by ADR-0004; defines the WCAG 2.2 AA reusable capability floor, stronger package-authored focus/motion defaults, ownership, and evidence model.
- [ADR-0004 — Accept cross-layer accessibility capability floor](ADR-0004-accessibility-capability-floor.md) — accepted durable decision.
- [QART-0006 — Bounded interaction motion alternatives](QART-0006-interaction-motion.md) — resolves prohibition, bounded-behavior, stable-token, generic-component, and consumer-only alternatives into RFC-0006.
- [RFC-0006 — Bounded interaction motion](RFC-0006-interaction-motion.md) — accepted by ADR-0005; permits restrained semantic interaction feedback under the accepted accessibility capability floor without expanding stable APIs.
- [ADR-0005 — Accept bounded interaction motion](ADR-0005-interaction-motion.md) — accepted durable decision.
- [QART-0007 — First npm package bootstrap](QART-0007-first-package-bootstrap.md) — resolves the first-package bootstrap constraint into RFC-0007.
- [RFC-0007 — One-time npm package bootstrap](RFC-0007-first-package-bootstrap.md) — accepted by ADR-0007.
- [ADR-0007 — Permit one-time interactive npm package bootstrap](ADR-0007-first-package-bootstrap.md) — specializes the first package-creation sequence while preserving the normal release authority boundary.
