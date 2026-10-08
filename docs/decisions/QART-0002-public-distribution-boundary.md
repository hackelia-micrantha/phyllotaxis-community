# QART-0002 — Public runtime and `phyllo` distribution boundary

Status: **Resolved into RFC-0002**

## Question

How should Phyllotaxis expose consumable runtime/library and `phyllo` CLI artifacts, if at all, while preserving the accepted public-design/private-implementation split?

The current repository topology is intentionally asymmetric:

- `phyllotaxis-community` is authoritative for public requirements, architecture, contracts, interfaces, decisions, CLI UX, and manuals;
- private `phyllotaxis` is authoritative for implementation, validation, build, and release evidence;
- the public repository currently declares no executable/package distribution role.

This question is not only release plumbing. A JavaScript/TypeScript UI package exposes materially different implementation artifacts from a native binary. Browser-delivered JavaScript is observable by definition, and a public npm package would directly distribute compiled JavaScript, declarations, CSS, and package metadata.

Private source can protect repository history, tests, build internals, unreleased implementation, and development/security material. It must not be treated as a secrecy guarantee for code that is shipped to a browser or public package consumer.

## Alternatives

### A — Keep v1 packages internal; publish contracts only

Keep both the UI/runtime package and `phyllo` package private/internal for v1.

Public consumers receive only contracts, manuals, and design documentation. Micrantha-owned consumers may use immutable reviewed private implementation identities inside authorized CI/build boundaries. Public web deployment may still expose bundled runtime JavaScript, but there is no general public package-acquisition contract.

Advantages:

- preserves the current authority and registry posture;
- avoids turning npm publication into an accidental source-exposure decision;
- lets real consumer adoption produce evidence before choosing a public distribution topology;
- keeps release signing/provenance/public rollback work out of the critical path for internal qualification.

Trade-offs:

- external consumers cannot install Phyllotaxis directly;
- public consumers built outside authorized Micrantha CI cannot reproduce the implementation package;
- private dependency access must remain bounded to trusted build environments.

### B — Publish the JavaScript UI/runtime package

Publish an npm-compatible `@micrantha/phyllotaxis` package containing the runtime/library surface.

Advantages:

- conventional JavaScript consumption;
- straightforward package-manager and bundler integration;
- easiest path for external web consumers.

Trade-offs:

- compiled JavaScript, declarations, CSS, and package metadata become public implementation artifacts;
- the repository/source-exposure and distribution posture must be revised explicitly before release;
- package inspection must prove private tests, security material, build internals, and unrelated source are absent;
- public acquisition, immutable release identity, provenance, checksums/signatures where applicable, and rollback become release requirements.

This option must not be described as “binary-only” distribution. JavaScript package artifacts are source-like and highly inspectable.

### C — Separate a public binary `phyllo` CLI from the UI/runtime package

Keep the UI/runtime package internal while publishing `phyllo` as a separately built executable artifact.

A future public package definition could consume immutable, privately built release assets rather than private source. Candidate implementation mechanisms include a native/single-executable Node packaging approach or another bounded executable form, but the packaging technology is not selected here.

Advantages:

- CLI distribution can follow Micrantha's private-canonical/public-binary model;
- public consumers need no private source credentials;
- CLI release identity can be independently signed/provenance-linked and rollback-capable;
- avoids forcing the UI/runtime package into the same exposure model as the CLI.

Trade-offs:

- cross-platform executable production and verification add release complexity;
- executable packaging does not make implementation secrecy a security boundary;
- UI/runtime consumers still need a separate answer.

### D — Move a public runtime core to public canonical source

Make a deliberately public runtime/design-system core canonical in a public repository, with private extensions or internal composition kept separately.

Advantages:

- clean public-source consumption model;
- conventional source-built npm/Nix workflows;
- strongest reproducibility for external consumers.

Trade-offs:

- materially changes the current authority topology;
- requires a carefully defined split so public and private repositories do not become competing semantic implementations;
- migration cost is much larger than the current evidence justifies.

### E — Maintain a separate public reimplementation

Create a public package that independently reproduces Chroma, Venation, or Lamina semantics while private `phyllotaxis` remains canonical.

This alternative is rejected.

It creates two implementation authorities, guarantees drift pressure, weakens contract attribution, and violates the existing public-design/private-implementation boundary.

## Resolution

The first-consumer evidence changed the recommendation.

`hackelia-micrantha/web` is the selected first consumer and is itself public. Requiring it to fetch the private canonical implementation would introduce private-repository credentials or a custom trusted-build dependency into a public consumer path. The private implementation has also demonstrated a bounded npm artifact surface that excludes private source/tests while exposing only the compiled/runtime material a browser package necessarily makes inspectable.

That satisfies this QART's RFC trigger.

Proceed to **[RFC-0002](RFC-0002-public-package-distribution.md)** with **B — publish the npm-compatible runtime/package artifact** as the proposed first public consumer path, while preserving the private canonical implementation repository and public community design authority.

This is not publication authorization. RFC-0002 keeps licensing, public package README, artifact allowlisting/source-map policy, registry identity, provenance/SBOM, anonymous acquisition, and rollback as explicit pre-ADR gates.

Option **C** remains available later if the CLI needs an independently versioned distribution model. Do not use **E**.

## Release invariants for any future public path

Any RFC proposing public distribution must define and verify:

- one immutable release identity across producer artifact, executable/package version, public package definition, provenance subject, and downstream pin;
- clean/cache-miss acquisition without private canonical-repository credentials;
- cryptographic pinning/checksums and signatures/provenance where the release standard requires them;
- conventional CLI executable and section-1 man-page installation for `phyllo`;
- generated artifact/closure inspection for unintended private source, tests, credentials, signing material, security corpora, and development-only files;
- explicit rollback to a prior immutable release;
- public verification that does not require access to private implementation source;
- no publication, tag, deployment, or consumer pin from mutable branch state.

## Triggers for an RFC

Create an RFC only when at least one of these is true:

1. an external consumer needs supported package acquisition without private credentials;
2. the first representative consumer proves a stable runtime package boundary worth publishing;
3. a supported public `phyllo` installation is needed independently of the UI/runtime package;
4. the organization source/distribution posture is deliberately revised for Phyllotaxis.

Until then, internal package/release evidence can mature without implying public distribution.
