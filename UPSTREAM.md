# Repository boundary and authority

Phyllotaxis uses a **private implementation + public design projection** topology.

```text
phyllotaxis-community
  public requirements / specs / contracts / interfaces / decisions
                    |
                    | constrains
                    v
phyllotaxis
  private implementation / tests / build / release evidence
```

## Authority

`hackelia-micrantha/phyllotaxis-community` owns the published design contract. `hackelia-micrantha/phyllotaxis` owns implementation truth.

Neither repository silently overrides the other:

- private implementation drift does not redefine a published contract;
- a public proposal does not claim implementation until evidence exists;
- evidence that exposes a contract defect causes an explicit public contract revision.

## Publication boundary

Appropriate here: requirements, architecture, stable/proposed public contracts, component/layout/token interface semantics, CLI UX and machine contracts, man pages, QART/RFC/ADR records, safe examples, and public conformance material.

Keep private by default: implementation source and private tests; unpublished vulnerabilities or exploit reproductions; sensitive regression corpora or defensive heuristics; credentials and trust-bootstrap material; internal CI/runtime details that are not public contract.

Private source is not a security boundary. Public contracts must remain secure and coherent even when their design is fully understood.

## Change flow

1. Public semantic changes are proposed and reviewed here.
2. Accepted contracts constrain private implementation.
3. Private implementation validates the contract and may produce new evidence.
4. Contract defects or compatibility changes return here explicitly.
5. Public status language changes only when implementation/release evidence supports it.
