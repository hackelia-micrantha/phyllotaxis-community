# Public interface index

This index maps the public interfaces defined by Phyllotaxis design contracts. The normative details remain in the linked contract documents; this page does not duplicate implementation source.

## Design-system API

### Venation

Defined by the [Venation layout contract](../architecture/venation-layout-contract.md):

- components: `Stack`, `Inline`, `Cluster`, `Grid`, `Switcher`, `Container`;
- public types include `Space`, `ContentWidth`, `StructuralLength`, `Align`, `Justify`, `ContainerGutter`, and the component prop contracts;
- structural lengths are constrained to non-negative decimal `rem`, `em`, or `ch` values where the contract permits caller-supplied intrinsic thresholds;
- arbitrary style-system and responsive-breakpoint props are intentionally not part of the stable interface.

### Chroma

Defined by the [Chroma profile resolution contract](../architecture/chroma-profile-contract.md):

- stable semantic CSS custom properties use the `--phyllotaxis-*` namespace;
- `data-phyllotaxis-profile` selects semantic visual profile;
- `data-phyllotaxis-scheme` may select a coherent light/dark scheme;
- internal `--pt-*` helpers are not public contract.

### Lamina

Defined by the [Lamina editorial semantic contract](../architecture/lamina-editorial-contract.md):

- components: `ArticleHeader`, `ArticleMeta`, `Prose`, `Figure`, `Caption`, `TaxonomyLink`, `PostSummary`;
- exact prop contracts and semantic HTML responsibilities are normative in that document;
- Lamina does not expose arbitrary Chroma values or Venation layout mechanics as component props.

## CLI interface

The public `phyllo` interface is defined by:

- [CLI architecture](../architecture/phyllo-cli.md);
- [project discovery/configuration](../architecture/phyllo-project-config.md);
- [command contract](../cli/phyllo.md);
- [`phyllo(1)`](../../man/phyllo.1);
- [`phyllo-check(1)`](../../man/phyllo-check.1);
- [`phyllo-status(1)`](../../man/phyllo-status.1);
- [`phyllo-doctor(1)`](../../man/phyllo-doctor.1);
- [`phyllo-init(1)`](../../man/phyllo-init.1).

The proposed machine interface uses explicit `--format text|json`, versioned deterministic results where compatibility matters, stable exit semantics, and strict process-stream discipline.

## Authority

Implementation exports in the private repository must conform to these published interfaces. Generated declarations or implementation types may provide validation evidence, but they do not silently redefine this public surface.
