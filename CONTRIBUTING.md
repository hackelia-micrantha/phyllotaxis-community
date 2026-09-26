# Contributing to Phyllotaxis design

This repository accepts work on the **public design and contract surface**, not private implementation.

Useful contributions clarify requirements, identify ambiguous contract behavior, improve accessibility and semantics, refine layer boundaries, improve CLI UX/interoperability, or add public QART/RFC/ADR material.

Do not copy private implementation source, private tests, unpublished vulnerability material, credentials, internal CI evidence, or private issue content here. Reduce implementation evidence to the minimum public requirement, contract change, or safe synthetic example needed for review.

Small unambiguous documentation fixes can go directly to a pull request. Contract changes with compatibility or architectural consequences should preserve their reasoning through QART/RFC/ADR as appropriate.

A design PR should state the affected contract, compatibility impact, status (accepted/proposed/experimental/implemented), evidence basis, and whether private implementation must change afterward.

CLI changes must conform to Micrantha CLI design/UX and interoperability standards. Public/private changes must conform to the source-exposure standard.

Do not change licensing posture as incidental cleanup; licensing changes require an explicit project decision.
