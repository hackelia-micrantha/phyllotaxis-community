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
- [QART-0002 — Public runtime and `phyllo` distribution boundary](QART-0002-public-distribution-boundary.md) — open; recommends keeping v1 packages internal while consumer evidence is gathered.

