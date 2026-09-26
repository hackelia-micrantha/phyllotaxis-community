# `phyllo` CLI architecture

Status: **Proposed**  

## Decision

Phyllotaxis will provide a TypeScript CLI named `phyllo` as an **integration and control plane** for the design system.

The CLI does not define a second design-system API. It consumes canonical Phyllotaxis contracts and package metadata to inspect, validate, diagnose, initialize, and migrate consuming repositories.

The design-system packages remain independently consumable and must not depend on the CLI at runtime.

## Why TypeScript

The CLI operates directly on frontend repositories and is expected to understand package metadata, TypeScript/JavaScript source, JSX/TSX, CSS, design-token representations, and future Cambium codemods.

TypeScript keeps those operations in the same type and AST ecosystem as the code being inspected while allowing contracts/types to be shared without maintaining a parallel Rust/Go representation.

A lower-level implementation is not justified initially. Performance-sensitive scanners may be reconsidered independently if repository-scale evidence demonstrates a real need.

## Dependency direction

```text
contracts
   ↑
Chroma / Venation / Lamina
   ↑
Cambium
   ↑
phyllo CLI
```

The diagram represents consumption/dependency. Lower layers must not depend on `phyllo`.

More precisely:

- **Chroma** owns themeable values and semantic visual-profile values.
- **Venation** owns structural layout relationships.
- **Lamina** owns reusable visual/component semantics and compositions.
- **Cambium** owns migrations/codemods between stable contracts.
- **`phyllo`** owns discovery, integration, validation, diagnostics, orchestration, and CLI presentation.

The existing rule remains authoritative:

> **Chroma owns values. Venation owns relationships.**

The CLI must preserve that boundary rather than re-express it in CLI-owned schemas.

## Responsibilities

### `phyllo` owns

- discovering the repository/project/workspace being inspected;
- resolving explicit Phyllotaxis configuration;
- reading installed package and contract metadata;
- selecting/invoking framework or host adapters;
- running canonical validators;
- producing human-readable diagnostics;
- producing stable machine-readable output;
- orchestrating Cambium migration planning/execution;
- running post-migration validation;
- exposing CLI help, version, exit-status, and man-page contracts.

### `phyllo` does not own

- concrete Chroma token values;
- Venation layout semantics;
- Lamina component semantics;
- product-specific styles or branding;
- arbitrary CSS policy;
- package installation;
- bundling or dev-server behavior;
- deployment;
- source-control commits/pushes;
- a general component generator;
- a general-purpose migration framework unrelated to Phyllotaxis.

## Initial command surface

The initial stable direction is:

```text
phyllo check
phyllo status
phyllo doctor
phyllo init
phyllo tokens
phyllo migrate
```

Possible later commands such as `phyllo add` or `phyllo diff` require demonstrated consumer demand before becoming stable surface area.

### `check`

Primary first implementation. Validate the resolved Phyllotaxis integration and stable contracts. It must be useful in local development and CI and expose a versioned machine-readable diagnostic contract.

### `status`

Report resolved CLI, project, adapter, package, contract, and profile state without mutation.

### `doctor`

Diagnose integration/tooling problems. Non-mutating by default.

### `init`

Create the smallest explicit Phyllotaxis integration/configuration needed by an existing project. Initialization must be reviewable and must not silently install arbitrary dependencies or execute lifecycle hooks.

### `tokens`

Expose Chroma validation/inspection/export operations by delegating to canonical Chroma contracts. The CLI is not the token source of truth.

### `migrate`

Plan and orchestrate Cambium transformations between stable Phyllotaxis contracts, followed by `phyllo check`.

## Project configuration and adapters

Host/framework-specific behavior is isolated behind typed adapters. The CLI core must not encode Remix, React, Micrantha, or ryanjennin.gs assumptions.

The v1 repository-local configuration is inert JSON in `phyllotaxis.json`:

```json
{
  "adapter": "generic",
  "chroma": {
    "profile": "utility"
  },
  "venation": {
    "contract": 1
  }
}
```

JSON is intentional for the bootstrap contract: it is declarative, requires no parser dependency in the TypeScript/Node CLI, and can gain a JSON Schema without introducing executable configuration.

The initial adapter is `generic`. Unknown adapter names fail rather than being dynamically imported. Framework-specific adapters such as Remix are added only when a real consuming repository demonstrates framework-specific discovery requirements.

Configuration expresses **integration choices and contract selection**, not copies of design values or component definitions.

Resolution is deterministic, with explicit CLI options (when supported) taking precedence over repository configuration, installed package metadata, safe inference, and documented defaults.

Ambiguous inference must fail clearly instead of silently selecting a framework, profile, or contract.

The detailed v1 discovery/configuration contract is documented in [`phyllo-project-config.md`](phyllo-project-config.md).

## Security boundary

Repository inspection is inert by default.

Commands such as `check`, `status`, and `doctor` must not execute project-provided JavaScript, package lifecycle scripts, framework CLIs, or arbitrary adapter code merely to discover configuration. Prefer declarative configuration and static/package metadata.

Unsupported adapter names are rejected; they are not treated as import specifiers or plugin entry points.

Mutating commands must make mutation explicit. `migrate` and `init` should support planning/dry-run semantics before meaningful changes. No command implicitly commits, pushes, publishes, installs unrelated packages, or deploys.

## Machine-readable contract

Human terminal rendering and automation output are different presentations of the same underlying result model.

Every serializable command result has the required envelope:

- `schemaVersion`;
- `command`;
- `ok`;
- `diagnostics`.

Commands may add command-specific structured data (for example, `status` may add `data`) without weakening the required common envelope.

Diagnostics have deterministic semantic identifiers and severities. When a diagnostic contains a path, it is normalized relative to the discovered project root with `/` separators and cannot traverse outside that root.

The initial diagnostic schema is tracked by #11 and documented in `docs/cli/phyllo.md`.

## Unix and Micrantha integration

`phyllo` follows the shared Micrantha CLI strategy:

- meaningful exit status;
- stdout/stderr discipline;
- structured output for automation;
- non-interactive automation paths;
- cancellation/signal handling;
- man-page coverage;
- reproducible release/integration path rather than reliance on ambient global tooling.

Repository-specific deviations from the shared CLI contract must be explicit and justified.

Before a supported release, the CLI must also use the shared `--format text|json` convention for machine output, respect `NO_COLOR`/`TERM=dumb` and non-TTY output, preserve strict stdout/stderr separation, handle broken pipes and signals safely, and provide section-1 manual-page coverage for supported commands.

## Delivery order

1. Publish this architecture/CLI contract and keep implementation tracking separate from the public contract.
2. Implement the smallest TypeScript package and `phyllo check` in the private canonical repository.
3. Stabilize project/configuration discovery and adapter boundaries against the published contract.
4. Add bounded supporting commands (`status`, `doctor`, `tokens`, `init`) as evidence requires.
5. Introduce `phyllo migrate` once a real Cambium migration exists.
6. Apply the Micrantha release/man-page/Nix integration strategy before the first supported release.

The sequence intentionally keeps `check` ahead of scaffolding and migration so the CLI first proves that it can enforce an existing stable contract without becoming a competing source of truth.

## Main design risk

The primary risk is **authority duplication**: if `phyllo` independently redefines tokens, primitive rules, profiles, or migration semantics, Phyllotaxis would acquire two sources of truth.

The architectural rule is therefore:

> `phyllo` may discover, validate, explain, and orchestrate canonical contracts; it must not redefine them.
