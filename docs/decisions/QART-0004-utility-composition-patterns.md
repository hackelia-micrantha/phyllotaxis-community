# QART-0004 — Utility composition promotion from consumer evidence

Status: **Resolved into RFC-0004**

## Question

What, if anything, should Phyllotaxis promote from a successful Utility consumer redesign that used flat low-chroma surface rhythm, compact bordered introductions, contiguous information grids, explicit state labels, link-first actions, and system typography?

The decision must preserve the accepted boundaries:

- Utility remains the default semantic visual profile;
- Chroma owns values;
- Venation owns relationships;
- Lamina owns reusable semantics;
- consumer experiments do not become stable API merely because they work locally;
- proposed behavior must not be written into accepted contracts before the decision lifecycle completes.

The source consumer is evidence, not authority.

## Evidence

A production community site applied the accepted Utility directive and produced a materially better result while retaining:

- system/browser-native typography;
- obvious links and semantic HTML;
- compact information density;
- simple borders and normal document flow;
- restrained flat low-chroma surfaces;
- no gradients, blur/glass, broad elevation, ornamental motion, or general rounded-card composition;
- responsive and accessibility-conscious behavior.

The result also showed that technical long-form material can remain coherent under Utility.

See [Utility consumer evidence](../architecture/utility-evidence.md).

## Alternatives

### A — Keep the result entirely consumer-owned

Do not change Phyllotaxis guidance. Treat the successful redesign as a product-specific outcome.

Advantages:

- zero contract churn;
- no risk of over-generalizing from one consumer;
- no new implementation work.

Trade-offs:

- the reusable composition lessons remain undocumented;
- future consumers may independently recreate the same patterns;
- the successful RFC-0003 experiment produces no durable design learning.

### B — Promote composition guidance only; keep stable APIs unchanged

Document the reusable composition lessons and publish a synthetic reference fixture, while keeping exact colors, class names, state names, Chroma roles, Lamina components, and Venation APIs unchanged.

Proposed guidance would cover:

- flat low-chroma section rhythm as a valid Utility technique;
- compact bounded introductions instead of marketing-style heroes;
- contiguous border-sharing grids instead of independent card chrome;
- explicit state text with color as a redundant cue;
- link-first action hierarchy;
- system-font-first Utility delivery;
- technical reference/inspection content remaining Utility unless the task is genuinely editorial;
- advisory Cambium/diagnostic signals for common Utility anti-patterns.

Accepted visual contracts would change only after RFC review and ADR acceptance.

Advantages:

- captures the reusable lesson with minimal API surface;
- respects the evidence-driven promotion rule from RFC-0003;
- avoids freezing one consumer's palette or markup;
- leaves room for additional evidence before component/token promotion;
- supports future conformance tooling without allowing heuristics to mutate code.

Trade-offs:

- consumers still choose local surface values;
- some guidance remains qualitative;
- advisory tooling may need careful false-positive controls.

### C — Add stable Chroma surface/state roles now

Promote multiple accent-surface and state roles to the public Chroma contract immediately.

Advantages:

- consumers get standardized values;
- easy to share a recognizable Utility rhythm.

Trade-offs:

- one consumer is weak evidence for stable role vocabulary;
- risks creating a generic palette scale under semantic names;
- creates public compatibility obligations before repeated need is demonstrated;
- exact state semantics vary by product.

### D — Add generic Lamina Hero/Card/Badge components now

Encode the observed patterns as reusable components.

Advantages:

- easy adoption;
- consistent markup/presentation.

Trade-offs:

- observed patterns are primarily compositions, not new semantics;
- generic Hero/Card/Badge abstractions conflict with the accepted Utility direction;
- component promotion from one consumer is premature;
- existing native HTML and Venation relationships already express the structures.

## Recommendation

Choose **B — promote composition guidance only; keep stable APIs unchanged**.

This preserves the successful learning without confusing evidence with contract. It also creates a clean evidence gate for future API expansion: another independent consumer must demonstrate that current Chroma/Lamina/Venation surfaces cannot express a repeated semantic need without product-local duplication.

## Resolution

Proceed to **RFC-0004 — Utility composition patterns from consumer evidence** with alternative **B**.

RFC-0004 should:

- keep accepted visual contracts unchanged while the RFC is proposed;
- define the proposed Utility composition guidance and non-goals;
- publish a synthetic reference fixture;
- preserve exact palettes and product vocabulary as consumer-owned;
- define bounded advisory conformance candidates without auto-rewrite;
- require ADR acceptance before updating accepted visual contracts;
- require further independent consumer evidence before stable Chroma/Lamina/Venation API expansion.

Alternatives **C** and **D** are rejected with current evidence. Alternative **A** is rejected because RFC-0003 explicitly established promotion of reusable consumer findings as a valid path, and this result contains repeatable composition guidance.

## Trigger for revisiting the resolution

Re-open this decision if:

1. a second independent consumer cannot express the same reusable need through existing Chroma/Lamina/Venation seams;
2. local surface-role duplication becomes common enough to justify stable Chroma role expansion;
3. repeated state-label use demonstrates accessibility-significant behavior deserving a Lamina semantic component;
4. advisory Utility checks produce unacceptable false positives that require a different conformance model.
