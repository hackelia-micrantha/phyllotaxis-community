# `phyllo` project discovery and configuration

Status: **Proposed implementation contract**  

## Decision

The first `phyllo` configuration format is inert JSON in a repository-root file named `phyllotaxis.json`.

The CLI does not load executable TypeScript/JavaScript configuration and does not execute package lifecycle hooks during discovery. JSON is preferred for v1 because it requires no parser dependency, is inert by construction, has native runtime parsing, and can gain a JSON Schema without changing the configuration surface.

## Project-root discovery

Starting from the process working directory, `phyllo` walks parent directories until it finds `package.json`. That directory becomes the **discovered project root** and the base for stable diagnostic paths.

If no `package.json` is found before the filesystem root, discovery fails with `project.root-not-found`.

## Configuration shape

```json
{
  "adapter": "generic",
  "chroma": { "profile": "utility" },
  "venation": { "contract": 1 }
}
```

All keys are optional. Omitted configuration resolves to the framework-neutral `generic` adapter with no explicit profile or contract override.

### `adapter`

The initial stable value is `generic`. Only an omitted adapter receives that default; explicit invalid values, including `null`, are rejected. Unknown names fail with `project.adapter-unsupported`; they are not dynamically imported.

### `chroma.profile`

When present, the value is `utility` or `editorial`. These remain semantic Phyllotaxis profile names, independent of host or brand.

### `venation.contract`

When present, this is a positive integer selecting the expected Venation contract. `phyllo check` compares it with canonical package metadata; mismatch produces `venation.config-contract-mismatch`.

## Resolution precedence

1. explicit command-line option, when supported;
2. `phyllotaxis.json`;
3. installed Phyllotaxis package metadata;
4. safe adapter inference, if a future adapter defines it;
5. documented defaults.

Ambiguous inference must fail rather than silently selecting a framework/profile/contract.

## Package discovery

If the discovered project is itself `@hackelia-micrantha/phyllotaxis`, its root is the package root.

Otherwise `phyllo` searches the discovered project and each ancestor for:

```text
node_modules/@hackelia-micrantha/phyllotaxis
```

This supports ordinary npm workspace hoisting without executing project/module-loader hooks or package-manager commands.

Package locations outside the discovered project root are not represented with `..` diagnostic paths. Structured state may use `null` for an external package path.

## Adapter boundary

```ts
interface ProjectAdapter {
  name: string;
  sourceRoots(projectRoot: string): readonly string[];
}
```

The initial generic adapter returns the discovered project root as its only source root. Adapters must not redefine Chroma, Venation, Lamina, or Cambium semantics.

## Security properties

Ordinary `check`, `status`, and `doctor` discovery must be inert:

- parse data files only;
- do not `import()` project configuration;
- do not execute package scripts;
- do not run framework CLIs merely to detect a project;
- do not fetch network resources merely to resolve local state;
- reject unsupported adapters rather than loading arbitrary plugin names.

## Deferred work

- JSON Schema publication/IDE completion;
- framework-specific adapters such as Remix;
- package-manager resolution beyond the bounded ancestor `node_modules` search if a consumer requires it;
- explicit CLI overrides for profile/contract/adapter;
- configuration migration/versioning if the schema grows enough to require it.