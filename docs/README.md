# Phyllotaxis documentation

This repository is the public source of truth for **published Phyllotaxis design work**. The private implementation repository must conform to these published contracts; implementation details do not silently redefine them.

## Read by purpose

| Need | Start here |
| --- | --- |
| Understand the layer model | [Venation](architecture/venation-layout-contract.md), [Chroma](architecture/chroma-profile-contract.md), [Lamina](architecture/lamina-editorial-contract.md) |
| Understand visual direction | [Visual directive](architecture/visual-directive.md), [Visual profiles](architecture/visual-profiles.md), [Interaction motion](architecture/interaction-motion.md), [Utility consumer evidence](architecture/utility-evidence.md) |
| Review consumer experimentation / A/B testing | [ADR-0002](decisions/ADR-0002-consumer-experimentation-boundary.md), [RFC-0003](decisions/RFC-0003-consumer-experimentation-boundary.md) |
| Review Utility composition refinement | [RFC-0004](decisions/RFC-0004-utility-composition-patterns.md), [reference fixture](examples/utility-reference.html) |
| Review first-class spatial rhythm and density (proposed) | [SPACE-001 requirement](requirements/spatial-rhythm.md), [QART-0009 alternatives](decisions/QART-0009-spatial-rhythm.md), [comparison and evidence plan](architecture/spatial-rhythm-review-plan.md), [pinned consumer survey](architecture/spatial-rhythm-consumer-survey.md), [rendered public consumer evidence](architecture/spatial-consumer-evidence.md), [package-integrated composition evidence](architecture/spatial-package-integration-evidence.md), [draft RFC-0009](decisions/RFC-0009-spatial-rhythm.md); existing Chroma/Venation contracts remain authoritative |
| Review conceptual spacing within prose (native authoring guidance accepted) | [TEXT-001 semantic boundaries](requirements/text-rhythm.md), [QART-0010](decisions/QART-0010-semantic-text-rhythm.md), [RFC-0010](decisions/RFC-0010-native-text-rhythm-guidance.md), [ADR-0009](decisions/ADR-0009-native-text-rhythm-guidance.md); **no new API**; SPACE-001/RFC-0009 retain spacing-token authority |
| Review text-rhythm examples (non-normative) | [Static comparison](examples/text-rhythm-comparison.html), [synthetic suggestion data](examples/text-rhythm-suggestions.json), [review plan](architecture/text-rhythm-review-plan.md) |
| Review design-system performance measurement | [PERF-001 requirement](requirements/performance.md) — proposed; paired baseline and browser evidence |
| Review accessibility capability floor | [Accessibility requirement](requirements/accessibility.md), [RFC-0005](decisions/RFC-0005-accessibility-capability-contract.md), [ADR-0004](decisions/ADR-0004-accessibility-capability-floor.md) |
| Review interaction-motion boundary | [ADR-0005](decisions/ADR-0005-interaction-motion.md), [RFC-0006](decisions/RFC-0006-interaction-motion.md) |
| Understand the CLI | [CLI architecture](architecture/phyllo-cli.md), [command contract](cli/phyllo.md) |
| Integrate project discovery/config | [Project configuration](architecture/phyllo-project-config.md) |
| Browse specifications and evidence | [Specification index](specs/README.md) |
| See normative contract status | [Contract index](contracts/README.md) |
| Browse public interfaces | [Interface index](interfaces/README.md) |
| See cross-cutting requirements | [Requirements index](requirements/README.md) |
| Propose or record a decision | [Decision records](decisions/README.md) |
| Understand public/private authority | [Repository boundary](../UPSTREAM.md) |
| Review public package consumer documentation | [Package README](../package/README.md) |
| Implement host-owned System/Light/Dark preference | [Package README — color-scheme preference integration](../package/README.md#color-scheme-preference-integration) |

## Document classes

- **Contract** — normative behavior or interface that implementations must follow.
- **Requirement** — cross-cutting constraint that applies to one or more contracts.
- **Evidence** — observations used to justify a design; not itself normative.
- **QART** — unresolved questions, alternatives, recommendations, and trade-offs.
- **RFC** — substantial proposal under review.
- **ADR** — accepted durable architecture decision.

Each design document must distinguish accepted, proposed, experimental, and implemented claims. Public polish is not evidence of implementation maturity.
