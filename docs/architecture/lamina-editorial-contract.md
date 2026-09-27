# Lamina editorial semantic contract

Status: **Accepted; private implementation merged and exact-head validated**  
Evidence: [Editorial profile evidence](editorial-evidence.md)

## Purpose

Define the smallest reusable Lamina surface justified by current Editorial evidence.

> **Chroma owns values. Venation owns relationships. Lamina owns reusable semantics.**

The same semantic component tree must work under Utility or Editorial presentation. Visual profile selection is external to these APIs.

Existing `ryanjennin.gs` code remains evidence, not compatibility surface. Hugo partials, current CSS classes, exact fonts, palette values, personal branding and site-specific content models are not part of this contract.

## Contract rules

1. A stable Lamina component represents a reusable content relationship demonstrated by at least two plausible compositions, or a strong native semantic/accessibility relationship.
2. Components may internally compose accepted Venation primitives, but must not reimplement layout mechanics or expose `gap`, `align`, breakpoint or arbitrary structural CSS props.
3. Chroma resolves typography, color, spacing, width, surface, focus and scheme values. Lamina must not expose raw color, font, radius, shadow or elevation values.
4. No Lamina component accepts a `profile` prop. Utility and Editorial resolve presentation outside the semantic tree.
5. `className`, `id`, `data-*`, accessibility attributes and ordinary semantic DOM attributes are integration escape hatches. Generic `style` or style-system objects are outside the stable contract.
6. Prefer native HTML semantics over ARIA reconstruction.
7. Lamina APIs must not become a CMS schema. Content remains caller-owned unless a narrow semantic relationship requires a prop.
8. Repeated escape-hatch use is evidence to review the contract, not permission to add generic styling knobs.

## Accepted first semantic surface

- `ArticleHeader`
- `ArticleMeta`
- `Prose`
- `Figure`
- `Caption`
- `TaxonomyLink`
- `PostSummary`

These semantics are profile-neutral even though Editorial evidence motivated their extraction.

## `ArticleHeader`

### Job

Represent the header of a **primary standalone article**, essay, case study or similar long-form document.

It owns the relationship among:

- one required primary article title;
- optional article metadata;
- optional taxonomy.

It does not own the full article element, page shell, hero treatment, author identity model, actions, TTS controls or navigation.

### Native contract

- renders native `header`;
- renders the required title as `h1`;
- title content must be phrasing content suitable inside a heading;
- metadata and taxonomy are optional content slots;
- it never changes heading depth for visual reasons.

Conceptual API:

```ts
type ArticleHeaderProps = {
  title: ReactNode;
  meta?: ReactNode;
  taxonomy?: ReactNode;
  className?: string;
  id?: string;
};
```

Ordinary `header` DOM/accessibility attributes may pass through except arbitrary inline `style`.

`ArticleHeader` is not a generic section-header component. Nested publication items use `PostSummary` or native headings.

### Evidence

- `ryanjennin.gs` long-form article header;
- Micrantha release essay / engineering case-study header.

## `ArticleMeta`

### Job

Group publication metadata such as publication time, updated time, reading time, series information or an author link without defining a CMS metadata schema.

### Native contract

- renders a neutral grouping element (`div` initially);
- children retain their own native semantics (`time`, links, text, etc.);
- it does not manufacture labels or force metadata into a definition-list model;
- callers may provide an accessible label when context requires one.

Conceptual API:

```ts
type ArticleMetaProps = {
  children: ReactNode;
  className?: string;
};
```

Wrapped flow/alignment is implemented with Venation (`Cluster`/`Inline`) internally. Lamina does not expose those mechanics as metadata props.

### Evidence

- standalone article headers;
- homepage/archive/post-summary metadata groups.

## `Prose`

### Job

Establish the presentation boundary for authored long-form content while leaving authored HTML semantics intact.

`Prose` may style native descendant paragraphs, headings, lists, block quotes, links, inline code, code blocks, tables and ordinary inline media. It does not generate, reorder or infer those elements.

### Native contract

- renders a neutral `div` initially;
- adds no article or heading semantics of its own;
- does not need a polymorphic `as` prop merely to style content;
- generic Markdown images remain ordinary images unless the authored content has a real figure/caption relationship.

Conceptual API:

```ts
type ProseProps = {
  children: ReactNode;
  className?: string;
};
```

### Evidence

- figure/code-heavy `friday-frida-hack` article;
- Micrantha engineering essay/case study with prose, code and links.

## `Figure` and `Caption`

### Job

Represent a real figure/caption relationship using native HTML rather than wrapping media merely to obtain styling.

### Native contract

`Figure`:

- renders native `figure`;
- accepts authored figure content;
- does not own image loading, optimization, CDN, source-set or asset-pipeline policy.

`Caption`:

- renders native `figcaption`;
- is a direct child of `Figure`;
- is first or last among figure children, preserving native HTML figure semantics.

Conceptual APIs:

```ts
type FigureProps = {
  children: ReactNode;
  className?: string;
};

type CaptionProps = {
  children: ReactNode;
  className?: string;
};
```

Image `alt`, dimensions, loading behavior and media-specific accessibility remain properties of the media element supplied by the consumer.

### Evidence

- technical articles with explanatory imagery;
- Micrantha case studies/release essays with screenshots, diagrams or benchmark figures;
- native figure/caption semantics independently justify the relationship.

## `TaxonomyLink`

### Job

Represent a **linked content-taxonomy term** such as a topic, category or tag.

The generic name `Tag` is intentionally rejected because design-system consumers commonly use “tag” for chips, filters, selection state and removable UI. The stable name encodes the narrower relationship supported by evidence.

### Native contract

- renders a native anchor;
- `href` is required;
- visible label is caller-owned phrasing content;
- ordinary anchor attributes may pass through except arbitrary inline `style`;
- there is no `selected`, `active`, `removable`, `color`, `size` or visual-variant API.

Conceptual API:

```ts
type TaxonomyLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};
```

A non-navigational taxonomy label remains plain text until separate evidence justifies another semantic component.

### Evidence

- linked categories/tags in article and archive contexts;
- plausible Micrantha journal/project-topic taxonomy.

## `PostSummary`

### Job

Represent a summarized editorial item in an index, archive, related-content list or publication stream.

It owns the relationship among:

- required linked title;
- optional metadata;
- optional summary/excerpt;
- optional taxonomy;
- optional media content.

It does not own collection layout, feature/elevation treatment, pagination, actions, site navigation or whole-card click behavior.

### Native contract

- renders native `article`;
- title contains the primary native link to the summarized item;
- title content must be phrasing content suitable inside a heading/link;
- `titleLevel` is semantic, not visual;
- `titleLevel` defaults to `2`, matching the common page-title-then-summary-list hierarchy;
- nested archive/section compositions explicitly select `3` or deeper as required by document hierarchy;
- optional media is caller-owned native content.

Conceptual API:

```ts
type PostSummaryProps = {
  title: ReactNode;
  href: string;
  titleLevel?: 2 | 3 | 4 | 5 | 6; // default: 2
  meta?: ReactNode;
  summary?: ReactNode;
  taxonomy?: ReactNode;
  media?: ReactNode;
  className?: string;
};
```

Implementation must test both the default `h2` case and a nested archive composition using `h3`.

### Evidence

- `ryanjennin.gs` homepage/archive summaries;
- Micrantha journal/release index summaries.

A visually prominent summary remains a `PostSummary` unless another consumer proves a distinct content relationship.

## Candidates explicitly not promoted

### `Article`

Do not add a Lamina `Article` wrapper initially. Native `article` plus Venation composition, `ArticleHeader`, optional `Figure`/`Caption`, and `Prose` already express the full document. A wrapper would currently encapsulate structure/CSS rather than add semantics.

### `PostList`

Do not add `PostList` initially. Native `ul`/`ol`/section structure plus Venation `Stack`/`Grid` already express list/archive relationships.

### `FeaturedStory`

Do not promote `FeaturedStory` initially. Current evidence shows visual prominence and richer surface treatment, not a content relationship distinct from `PostSummary`.

### `Byline`

Do not add `Byline` initially. Author information fits `ArticleMeta`; personal author identity in the reference site is product content. Reconsider only with stronger structured-author evidence.

### Generic `Tag`

Do not add a generic `Tag` component as an alias. Linked taxonomy is `TaxonomyLink`; chips, filters, selected labels, status badges and removable items are separate semantics requiring separate evidence.

### Other convenience wrappers

Do not introduce `Card`, `Box`, `Hero`, `Archive`, generic `Media`, homepage navigation, avatar, disclaimer, TTS controls or Hugo/content-model adapters as part of this contract.

## Profile behavior

Lamina semantics do not select a visual profile:

```tsx
<ArticleHeader
  title="Release engineering retrospective"
  meta={
    <ArticleMeta>
      <time dateTime="2026-09-11">September 11, 2026</time>
    </ArticleMeta>
  }
/>
```

Under Utility the tree may render compactly with restrained typography/surfaces. Under Editorial it may resolve richer display typography, reading rhythm and media presentation. The content relationship does not change.

Therefore these APIs must not grow presentation selectors such as:

```ts
profile="editorial"
variant="modern"
font="..."
color="..."
radius="..."
shadow="..."
gap="..."
style={{ ... }}
```

## Representative compositions

### Long-form article

```tsx
<main>
  <Container maxWidth="readable">
    <Stack gap="lg">
      <article>
        <ArticleHeader
          title="Modern mobile hardening"
          meta={<ArticleMeta>{/* time/read-time/etc. */}</ArticleMeta>}
          taxonomy={<Cluster>{/* TaxonomyLink entries */}</Cluster>}
        />
        <Figure>
          <img alt="..." />
          <Caption>...</Caption>
        </Figure>
        <Prose>{/* authored long-form HTML */}</Prose>
      </article>
    </Stack>
  </Container>
</main>
```

The native `article` remains consumer-owned because Lamina does not need an `Article` wrapper to express this relationship.

### Archive / publication index

```tsx
<section aria-labelledby="archive-heading">
  <h2 id="archive-heading">Archive</h2>
  <Stack as="ul" gap="md">
    <li>
      <PostSummary
        title="A release retrospective"
        href="/journal/release-retrospective"
        titleLevel={3}
        meta={<ArticleMeta>{/* date/read-time */}</ArticleMeta>}
        summary="What changed, why it mattered, and what we learned."
      />
    </li>
  </Stack>
</section>
```

Collection/list semantics stay native; spacing stays Venation-owned.

### Micrantha journal / case study

The same `ArticleHeader`, `ArticleMeta`, `Prose`, `Figure`/`Caption`, `TaxonomyLink` and `PostSummary` contracts describe an organizational release essay or engineering case study without personal brand tokens, host names, Hugo helpers or Ryan-specific content fields.

## Accessibility invariants

- `ArticleHeader` emits the standalone article title as `h1`.
- `PostSummary` defaults its title to `h2`; deeper nesting is an explicit semantic choice and never a type-scale choice.
- `TaxonomyLink` remains a native link with normal keyboard/focus behavior.
- `Figure`/`Caption` use native `figure`/`figcaption`; captions are not simulated with generic text containers.
- Media alternative text remains consumer-owned because Lamina does not own the media asset model.
- `Prose` never replaces native links, headings, lists, code or table semantics with generic containers.
- Visible focus, contrast, visited-link treatment, responsive text and reduced-motion behavior remain shared profile capabilities resolved outside these content APIs.

## Chroma implications

This contract introduces **no additional Chroma semantic vocabulary beyond the roles already justified by #3**.

Implementation consumes the proposed body/display/mono typography, heading/meta/prose rhythm, readable/wide widths, canvas/surface/text/border/link/focus states and light/dark scheme roles.

Any newly discovered value role must be justified by component semantics rather than copied from source-site literals. Bounded value resolution is tracked in #22.

## Venation implications

No new Venation primitive or prop is required.

Internal and consumer composition uses the accepted `Stack`, `Inline`, `Cluster`, `Grid`, `Switcher` and `Container` contracts. Lamina must not introduce a visual-profile branch into Venation.

## Implementation and validation status

- #21 / private PR #35 — accepted Lamina semantics implemented, exact-head validated, and merged;
- #22 / private Chroma delivery — bounded Editorial Chroma value resolutions implemented and validated;
- #23 — representative real-consumer validation remains active and must not broaden the contract without evidence;
- #24 — later decide whether `phyllo check` should validate machine-readable Lamina contract metadata.

Implementation evidence does not change the public authority boundary: this document remains normative for the published Lamina semantics, while private source/tests remain implementation evidence.

## Acceptance mapping for #5

- Stable components justified by two plausible consumers/compositions or native semantic requirements: **yes**.
- Structural layout remains Venation-owned: **yes**.
- Profile-specific appearance remains Chroma/Lamina presentation: **yes**.
- Personal identity/navigation/branding remain outside reusable contracts: **yes**.
- Heading, figure/caption, link and metadata relationships preserve native accessibility: **yes**.
- Utility rendering remains possible because profile is external to semantic components: **yes**.

## Main invariant

> A Lamina component is promoted because the content relationship is reusable, not because a source site has a convenient CSS class for it.
