# Public contract index

This index identifies the published Phyllotaxis surfaces that constrain implementations and consumers.

| Contract | Status | Normative scope |
| --- | --- | --- |
| [Venation layout](../architecture/venation-layout-contract.md) | Accepted | Structural layout primitives and bounded layout inputs |
| [Chroma profile resolution](../architecture/chroma-profile-contract.md) | Accepted; CSS implementation validated; inspection contract accepted by [ADR-0001](../decisions/ADR-0001-chroma-inspection-contract.md) | Semantic values, profile/scheme resolution, stable custom-property and inspection surface |
| [Lamina editorial semantics](../architecture/lamina-editorial-contract.md) | Accepted | Reusable semantic editorial components and composition boundaries |
| [Visual profiles](../architecture/visual-profiles.md) | Accepted boundary | Utility and Editorial profile semantics |
| [Visual directive](../architecture/visual-directive.md) | Accepted; Utility composition guidance refined by [ADR-0003](../decisions/ADR-0003-utility-composition-patterns.md) and interaction motion by [ADR-0005](../decisions/ADR-0005-interaction-motion.md) | Default visual character and modern capability constraints |
| [Interaction motion](../architecture/interaction-motion.md) | Accepted by [ADR-0005](../decisions/ADR-0005-interaction-motion.md) | Cross-profile bounded interaction-motion behavior that specializes the accepted accessibility capability floor |
| [Consumer experimentation boundary](../decisions/ADR-0002-consumer-experimentation-boundary.md) | Accepted | Host-owned A/B/multivariate experiment assignment and measurement; Phyllotaxis-owned semantic experimentation seams and conformance invariants |
| [Accessibility capability](../requirements/accessibility.md) | Accepted by [ADR-0004](../decisions/ADR-0004-accessibility-capability-floor.md) | WCAG 2.2 AA reusable capability floor, stronger package-authored focus/motion defaults, package/consumer ownership, and layered validation |
| [`phyllo` CLI architecture](../architecture/phyllo-cli.md) | Proposed | CLI responsibility, dependency direction, safety boundary |
| [`phyllo` project configuration](../architecture/phyllo-project-config.md) | Proposed | Project discovery and inert configuration |
| [`phyllo` command contract](../cli/phyllo.md) | Proposed | Commands, machine output, diagnostics, exit semantics, terminal behavior |

[Editorial evidence](../architecture/editorial-evidence.md) is intentionally **non-normative**.

## Authority rule

Published contracts in this repository are authoritative for public design semantics. Private implementation may provide evidence that a contract needs revision, but implementation behavior does not change the public contract implicitly.


## Machine-readable projection

[\`contracts/public-interface-v1.json\`](../../contracts/public-interface-v1.json) is the machine-readable projection of the currently published package, CSS, type, and CLI interface surface. Its schema is [\`contracts/public-interface.schema.json\`](../../contracts/public-interface.schema.json).

The JSON contract exists for deterministic cross-repository conformance checks. It does not replace the explanatory architecture documents above, and a private implementation difference does not silently rewrite it.

The accepted Chroma inspection contract is published separately as [`contracts/chroma-inspection-v1.json`](../../contracts/chroma-inspection-v1.json) with schema [`contracts/chroma-inspection.schema.json`](../../contracts/chroma-inspection.schema.json). Private packages claiming `phyllotaxis.contracts.chroma: 1` must conform to that canonical role/value artifact.
