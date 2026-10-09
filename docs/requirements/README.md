# Requirements index

## Design-system requirements

1. **Single ownership per concern.** Chroma owns values, Venation owns relationships, Lamina owns reusable semantics, and Cambium owns migrations between stable contracts.
2. **Profile semantics, not site themes.** Utility and Editorial describe content/task intent; host names and personal brands are not public profile APIs.
3. **Bounded interfaces.** Stable primitives expose semantic, constrained inputs rather than arbitrary CSS/style-system escape hatches.
4. **Accessible modern capability.** The Utility profile may evoke late-1990s visual restraint, but semantics, accessibility, responsiveness, reduced-motion support, and browser capability remain modern. The accepted cross-layer capability floor is defined in [Accessibility capability requirement](accessibility.md) / [ADR-0004](../decisions/ADR-0004-accessibility-capability-floor.md).
5. **Consumer-owned content.** Navigation, CMS models, authored content, media loading policy, and application-specific brand/content decisions remain outside reusable component semantics.

6. **First-class spatial rhythm (proposed).** [SPACE-001](spatial-rhythm.md) captures page/section/sibling/inset/readability spacing jobs for design evaluation. It does not alter the accepted Utility default, Chroma token surface, Venation props, or accessibility floor.
7. **Measured performance.** [PERF-001](performance.md) proposes paired baseline, browser and artifact evidence before numerical budgets are accepted. Its proposed status does not impose unmeasured limits.

## CLI requirements

Before any `phyllo` command family is described as supported, it must satisfy Micrantha CLI standards:

- explicit `--format text|json`; no implicit JSON based on redirection;
- primary machine results only on stdout; process diagnostics and incidental warnings on stderr;
- stable documented exit semantics and deterministic versioned structured results;
- deterministic configuration precedence and inert repository inspection;
- explicit mutation and truthful dry-run behavior;
- safe non-interactive behavior with no authority bypass through convenience flags;
- TTY-aware output respecting `NO_COLOR`, `TERM=dumb`, `--no-color`, redirected output, and terminal width;
- normal broken-pipe/SIGPIPE behavior and explicit cancellation semantics;
- discoverable help and credential/network-independent root version output;
- section-1 man pages packaged with every supported CLI release;
- human status/list output optimized for readable tables where appropriate, never as a machine contract.

## Public/private requirements

- Published specs, requirements, contracts, interfaces, decisions, CLI contracts, and man pages belong here.
- Private source, private tests, unpublished security findings, credentials, internal build evidence, and operational details do not move here merely because they support implementation.
- Public design semantics change explicitly; private implementation conforms to reviewed public contracts.
- Public claims distinguish **implemented**, **experimental**, **planned**, and **aspirational** behavior.
