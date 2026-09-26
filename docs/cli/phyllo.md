# `phyllo` command contract

Status: **Proposed**  
Architecture: `docs/architecture/phyllo-cli.md`  

## Purpose

`phyllo` is the command-line integration surface for Phyllotaxis. It is intended for interactive developer use, CI, editor/tooling integration, shell pipelines, and governed automation.

Stable automation-relevant commands are non-interactive by default.

## Global behavior

```text
phyllo --help
phyllo --version
phyllo <command> --help
```

Global requirements:

- explicit help goes to stdout;
- human diagnostics/errors go to stderr;
- structured output goes to stdout;
- inspection commands do not mutate state;
- ordinary local inspection requires no network access;
- diagnostic ordering is deterministic where practical;
- SIGINT/cancellation must not disguise partial mutation as success.

### Help and CLI version

`phyllo --help` and `phyllo <command> --help` display only implemented command usage on stdout and exit successfully without discovering a consuming project. The initial command-help surface is `check`, `status`, `doctor`, and `init`.

`phyllo --version` reports the **invoked CLI package's own** version from the installed CLI artifact, not the version of a Phyllotaxis package found in the current consumer project. It succeeds without project discovery. Other combinations involving `--version` or `--help` are not implicitly interpreted as these standalone requests; the normal argument contract applies.

Structured version output and complete man-page packaging remain release-conformance work.

## Output format and terminal behavior

Human-oriented output defaults to text. Commands with a machine-readable contract use:

```text
--format text
--format json
```

`--format text` is the default. Automation must request `--format json` explicitly rather than infer machine mode from redirected stdout. A future independently consumable record stream may add an explicit `jsonl` format; a single result document must not be arbitrarily chunked into JSONL.

Human presentation must respect terminal width, `NO_COLOR`, `TERM=dumb`, `--no-color`, and redirected output. ANSI escapes and progress animation are disabled on non-TTY output unless explicitly requested. Color or Unicode must never be the only carrier of meaning.

`--quiet` suppresses non-error human success/informational output. It does not suppress errors, change the machine contract, or alter exit status.

Semantic validation diagnostics are part of a command's primary structured result when the command contract defines them as data. Process logging, progress, incidental warnings, stack traces, and other non-result diagnostics remain on stderr and must not corrupt machine-readable stdout.

Broken pipes and SIGPIPE follow normal Unix expectations; a downstream consumer closing stdout is not itself an application failure. SIGINT/cancellation must leave partial mutation distinguishable from success.

## Exit status

Initial stable direction:

| Code | Meaning |
| ---: | --- |
| `0` | command completed successfully; requested contract/state is valid |
| `1` | validation completed and found contract violations |
| `2` | CLI usage or configuration error |
| `3` | operational/tooling failure prevented completion |
| `4` | internal/unexpected CLI failure |
| `130` | interrupted by SIGINT where the platform/runtime permits conventional propagation |

Prefer structured diagnostic identifiers over proliferating exit codes.

## Structured output

Commands exposing inspectable state or diagnostics support `--format json`.

Every JSON result uses the same required top-level envelope:

```json
{
  "schemaVersion": 1,
  "command": "check",
  "ok": false,
  "diagnostics": [
    {
      "id": "venation.contract-mismatch",
      "severity": "error",
      "message": "Resolved Venation contract does not match installed package metadata.",
      "path": "phyllotaxis.json"
    }
  ]
}
```

### Required envelope fields

- `schemaVersion: number` — schema version for the complete JSON result contract.
- `command: string` — canonical command name that produced the result, such as `check` or `status`.
- `ok: boolean` — `true` only when the command completed successfully and its requested validity condition is satisfied.
- `diagnostics: Diagnostic[]` — always present; empty when there are no diagnostics.

Commands may add command-specific fields, such as a `data` object for `status`, without removing or renaming the common envelope fields.

Operational/configuration/internal failures still use this envelope whenever the CLI can serialize a result. For example, a configuration failure has `ok: false` plus one or more diagnostics and returns the corresponding non-zero exit code.

### Diagnostic contract

Each diagnostic has:

- `id: string` — required, deterministic semantic identifier suitable for automation;
- `severity: "error" | "warning" | "info"` — required;
- `message: string` — required human-readable explanation;
- `path?: string` — optional normalized repository path when the diagnostic has a file location;
- future optional location fields may identify line/column/range without changing path semantics.

Diagnostic ordering is deterministic. Human messages may improve without a schema-version change when stable semantic fields remain compatible. Terminal escape sequences, stack traces, internal exception objects, and dependency-specific AST structures are not part of the stable JSON contract.

### Path normalization

When `path` is present it is:

1. relative to the **discovered project root** used for that command;
2. normalized with `/` separators regardless of host platform;
3. free of a leading `./`;
4. free of `..` traversal outside the discovered project root.

The project root itself is represented as `.` when a command needs to report it as structured state.

The path base is independent of the process working directory. If a diagnostic refers to something outside the discovered project root, the stable `path` field is omitted; a future explicit external-location field may represent that case without overloading `path`.

This keeps CI/editor consumers deterministic when `phyllo` is invoked from workspace subdirectories.

## `phyllo check`

Validate the resolved project integration against canonical Phyllotaxis contracts.

```bash
phyllo check
phyllo check --format json
phyllo check --quiet
phyllo check --scope venation
```

Initial behavior:

1. resolve project root/configuration;
2. discover installed Phyllotaxis packages and contract metadata;
3. invoke canonical validators for the requested scope;
4. aggregate deterministic diagnostics;
5. render human output or the common JSON envelope;
6. return the documented exit status.

`check` must not mutate files, install dependencies, execute lifecycle scripts, or auto-fix violations.

## `phyllo status`

Report resolved integration state without asserting that every contract is valid.

Expected information includes CLI version, discovered project root, selected adapter, configuration source, installed Phyllotaxis package versions, resolved contract versions, and selected semantic visual profile when available.

```bash
phyllo status
phyllo status --format json
```

`status` reuses the same discovery model as `check`; it does not implement separate resolution semantics. In JSON mode it may add a command-specific `data` object to the required envelope.

## `phyllo doctor`

Diagnose why a Phyllotaxis integration cannot be inspected or used correctly.

```bash
phyllo doctor
phyllo doctor --format json
```

`doctor` is non-mutating by default. It may provide remediation instructions but does not silently execute them.

## `phyllo init`

Create the smallest explicit integration needed by an existing project.

```bash
phyllo init
phyllo init --profile utility
phyllo init --profile editorial
phyllo init --dry-run
```

Initial contract:

- preview meaningful mutation before applying it;
- write declarative rather than executable configuration;
- never silently install packages or run lifecycle hooks;
- use semantic profile names (`utility`, `editorial`), never host/brand names;
- do not copy design values into configuration when those values belong to Chroma.

## `phyllo tokens`

Expose Chroma token validation/inspection operations without becoming the Chroma source of truth.

```bash
phyllo tokens check
phyllo tokens inspect --format json
```

Export/generation operations should be introduced only from a real consumer requirement and canonical Chroma behavior.

## `phyllo migrate`

Plan and orchestrate migrations between stable Phyllotaxis contracts by invoking Cambium transforms.

```bash
phyllo migrate --from venation@1 --to venation@2 --dry-run
phyllo migrate --to venation@2
phyllo migrate --to venation@2 --format json
```

Required flow:

1. resolve project/configuration;
2. resolve source and target contracts;
3. select applicable Cambium transforms;
4. produce a migration plan;
5. stop without mutation for `--dry-run`;
6. otherwise apply transforms with explicit provenance;
7. run `phyllo check` against the target state;
8. report residual/manual work and partial failure clearly.

The command never implicitly commits, pushes, publishes, deploys, or installs unrelated dependencies.

## Configuration

The v1 repository-local configuration is `phyllotaxis.json`.

Example:

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

All fields are optional. The initial adapter is `generic`; additional adapters are introduced only when real framework-specific discovery is required.

Configuration expresses integration choices and selected contracts only. It does not duplicate token values or component/layout definitions, and ordinary configuration loading must not execute repository-provided JavaScript.

Unknown adapters are configuration errors rather than dynamic import/plugin requests.

## Adapters

Adapters isolate host/framework-specific project knowledge from CLI core. An adapter may discover source roots, framework integration points, or relevant files, but does not redefine Chroma/Venation/Lamina semantics.

The first implementation supports only the framework-neutral `generic` adapter. A Remix adapter should be added only when required by a real consuming integration.

## Automation contract

Automation consumers should prefer:

```bash
phyllo check --format json
```

rather than parsing human output. Exit status answers whether the command succeeded/validated; the required JSON envelope and diagnostics explain the result.

Structured output is one coherent JSON document. If streaming output is later required for long-running scans or migrations, it must use a separate explicit format/flag rather than changing `--format json` semantics.

## Man pages

Stable CLI documentation should be the source for man-page generation or remain mechanically aligned with it.

This public contract repository maintains `man/phyllo.1` and `man/phyllo-check.1` alongside this canonical command contract. A CLI black-box parity test checks documented implemented commands and options against `--help`; a change to command syntax must update the command contract, help, man pages, and test in the same PR. The man pages are documentation sources, **not yet installed or distributed** by a release artifact.

The public source now includes section-1 pages for the currently implemented command surface: `phyllo(1)`, `phyllo-check(1)`, `phyllo-status(1)`, `phyllo-doctor(1)`, and `phyllo-init(1)`. These pages follow the public `--format text|json` contract. Rendering, packaging, installation, and black-box parity against the private implementation remain release-conformance work in the private canonical repository.

## Deferred surface

The following are intentionally outside the initial stable CLI:

- `phyllo add` — component/primitive generation is not yet justified;
- `phyllo diff` — requires a concrete version-comparison use case;
- arbitrary plugin execution;
- package installation/update commands;
- deployment/build/dev-server commands.

Additions should come from observed integration pain rather than surface-area completeness.