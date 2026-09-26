# Public contract index

This index identifies the published Phyllotaxis surfaces that constrain implementations and consumers.

| Contract | Status | Normative scope |
| --- | --- | --- |
| [Venation layout](../architecture/venation-layout-contract.md) | Accepted | Structural layout primitives and bounded layout inputs |
| [Chroma profile resolution](../architecture/chroma-profile-contract.md) | Accepted; implementation validation pending | Semantic values, profile/scheme resolution, stable custom-property surface |
| [Lamina editorial semantics](../architecture/lamina-editorial-contract.md) | Accepted | Reusable semantic editorial components and composition boundaries |
| [Visual profiles](../architecture/visual-profiles.md) | Accepted boundary | Utility and Editorial profile semantics |
| [Visual directive](../architecture/visual-directive.md) | Accepted | Default visual character and modern capability constraints |
| [`phyllo` CLI architecture](../architecture/phyllo-cli.md) | Proposed | CLI responsibility, dependency direction, safety boundary |
| [`phyllo` project configuration](../architecture/phyllo-project-config.md) | Proposed | Project discovery and inert configuration |
| [`phyllo` command contract](../cli/phyllo.md) | Proposed | Commands, machine output, diagnostics, exit semantics, terminal behavior |

[Editorial evidence](../architecture/editorial-evidence.md) is intentionally **non-normative**.

## Authority rule

Published contracts in this repository are authoritative for public design semantics. Private implementation may provide evidence that a contract needs revision, but implementation behavior does not change the public contract implicitly.
