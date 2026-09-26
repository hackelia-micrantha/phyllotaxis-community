# Editorial profile evidence

Status: **Evidence classification complete; awaiting review**  

## Purpose

Classify the current `ryanjennin.gs` / `ryjen/blog` presentation into reusable Phyllotaxis responsibilities before implementing Editorial Chroma or Lamina behavior.

Existing site/theme code is **evidence, not contract**. Exact framework classes, CSS structure, font choices, palette values, and personal branding are not automatically promoted into Phyllotaxis.

Primary source evidence:

- `ryjen/blog/themes/coda/src/css/coda.scss`
- `ryjen/blog/themes/coda/src/css/partials/_theme.scss`
- `ryjen/blog/themes/coda/src/css/partials/_mixins.scss`
- `ryjen/blog/src/css/app.scss`
- `ryjen/blog/src/css/blog.scss`
- `ryjen/blog/layouts/_default/single.html`
- `ryjen/blog/layouts/index.html`
- `ryjen/blog/layouts/archive/list.html`
- `ryjen/blog/content/posts/friday-frida-hack.md`
- generated `ryjen/ryjen.github.io` output as a rendering/reference check

## Evidence classification

| Observed pattern | Evidence | Phyllotaxis classification | Promotion decision |
| --- | --- | --- | --- |
| Body, display, and monospace typography have distinct jobs | `--font-body`, `--font-display`, `--font-mono`; headings use display; code uses mono | Chroma semantic typography roles | **Promote roles**, not current family names |
| Long-form body copy uses deliberately relaxed rhythm | body line-height `1.78`; lead text around `1.72`; paragraph spacing; heading separation | Chroma reading-rhythm values + Lamina `Prose` semantics | **Promote semantic reading roles** |
| Paragraphs are constrained independently from the outer page | article/content paragraphs `max-width: 68ch`; featured summary `62ch`; outer container around `820px` | Chroma content-width values consumed by Venation/Lamina | **Promote readable/content widths**, not literal site container structure |
| Article metadata is a repeated wrapped row | author/date/read time/update in article header; date/read time/series metadata in featured content | Venation `Cluster` + Lamina `ArticleMeta` candidate | **Promote semantic metadata composition** |
| Categories and tags use the same linked taxonomy treatment | article category/tag groups; archive/category browsing | Lamina `Tag`/taxonomy semantics + Chroma surface/link roles | **Promote only generic taxonomy semantics** |
| Featured/index content has image + metadata + summary + actions | homepage featured essay/series | Lamina `FeaturedStory` or `PostSummary` candidate composed with Venation | **Promote only after #5 chooses the smallest reusable semantic surface** |
| Article header separates title, metadata and taxonomy from body | `article-header`, title, metadata, category/tag groups | Lamina `ArticleHeader` candidate + Venation composition | **Promote semantic header composition** |
| Article body has distinct prose behavior for lead paragraph, headings, quotes, code and inline code | `.article-content`; figure/code-heavy article cross-check | Lamina `Prose` + Chroma prose roles | **Promote semantic prose treatment** |
| Hero/inline article imagery is first-class and responsive | optimized article image; featured image; Markdown article images | Native image/figure semantics + Lamina `Figure`/`Caption` candidate; presentation values in Chroma | **Promote figure/caption only when that semantic relationship exists; do not wrap generic images only for styling** |
| Light and dark modes resolve the same semantic roles differently | `light()` / `dark()` rebasing; `prefers-color-scheme`; explicit foreground/background/link values | Chroma color-scheme resolution | **Promote semantic color roles and scheme support** |
| Text, muted text, border, surface, accent, hover, visited and focus states are repeatedly distinguished | `--fg`, `--fg-muted`, `--border`, `--bg-elev`, `--surface-muted`, `--surface-hover`, `--accent`, `--accent-strong`, visited/hover variables, focus ring | Chroma semantic state/color roles | **Promote bounded roles** |
| Elevated editorial cards/panels repeatedly use background, border, radius and shadow | featured story, browse panel, series cards | Chroma surface values + Lamina semantic surfaces | **Promote roles only where #5 demonstrates reusable semantics** |
| Reduced-motion treatment is global and deliberate | `prefers-reduced-motion` disables transitions/animation and smooth scroll | Shared accessibility capability, not an Editorial-only token | **Keep as cross-profile requirement** |
| Responsive typography adjusts on narrow screens | root font size and lead size reduce under `768px` | Chroma typography resolution | **Promote behavior, not the literal breakpoint** |
| Decorative page gradients create atmosphere | multiple background gradients on `body` | Ryan/product presentation unless another Editorial consumer demonstrates need | **Do not promote initially** |
| Dark-mode image brightness/contrast filter | theme-level `img` filter | Possible Editorial image treatment, but insufficient semantic evidence | **Keep provisional/product-owned** |
| Rounded pills and strong shadows appear in pagination/buttons/cards | current page controls and surfaces | Implementation evidence | **Do not create generic radius/shadow scales solely from this site** |
| Avatar, personal kicker, disclaimer, author identity and exact homepage copy | homepage template | Ryan product/content layer | **Do not promote** |
| TTS controls and status | article template | Product capability / accessibility feature, not design-system presentation | **Do not promote into Chroma/Lamina** |
| Solarized-derived palette and exact accent colors | `_color.scss` / theme rebase | Current implementation value set | **Do not promote palette names or exact values as stable API** |
| Fraunces, Source Sans 3 and JetBrains Mono | current CSS variables | Reference values for the Editorial consumer | **Do not encode font product names in stable contracts** |

## Minimal Chroma roles justified by current evidence

This is a semantic vocabulary proposal, not a commitment to current CSS variable names or values.

### Typography

- `font.body`
- `font.display`
- `font.mono`
- `type.body`
- `type.lead`
- `type.heading.1` through the heading levels actually supported by the implementation
- `type.meta`
- `leading.body`
- `leading.prose`

The current exact families, root pixel sizes, and breakpoint are profile implementation values, not API names.

### Content and rhythm

Venation already consumes semantic width and spacing names. Editorial evidence justifies concrete Editorial resolutions for:

- `content.readable`
- `content.wide`
- the existing shared spacing scale
- the existing semantic page gutter

Avoid adding article-specific width tokens until a composition cannot be expressed cleanly with the existing width vocabulary.

### Color/state

Minimum reusable roles demonstrated by repeated usage:

- `color.canvas`
- `color.surface`
- `color.surfaceMuted`
- `color.surfaceHover`
- `color.text`
- `color.textMuted`
- `color.border`
- `color.link`
- `color.linkHover`
- `color.linkVisited`
- `color.accent`
- `color.accentStrong`
- `color.focusRing`

Each role may resolve differently in light and dark schemes. Stable API should describe the role, not the current Solarized source value.

### Surface presentation

Evidence supports the concepts of a bounded surface radius and elevation, but does **not** yet justify a generic numeric scale. Start with semantics only where a Lamina component needs them, for example an elevated editorial feature surface. Do not introduce `radius.sm/md/lg` or `shadow.1/2/3` merely because the source site currently has several literals.

## Minimal Lamina semantics supported by evidence

The strongest candidates for #5 are:

- `ArticleHeader` — title + article metadata + optional taxonomy;
- `ArticleMeta` — reusable metadata relationship for article and featured/archive contexts;
- `Prose` — long-form content semantics/readability treatment;
- `Figure` / `Caption` — native media semantics when an actual figure/caption relationship exists;
- `Tag` — linked taxonomy/category semantics;
- `PostSummary` — title/metadata/summary composition suitable for archive/list contexts;
- `FeaturedStory` — only if it can be shown to be more than a styled `PostSummary` variant.

Do **not** promote personal site navigation, avatar/author identity, TTS controls, Hugo partial interfaces, arbitrary `Card`/`Box` wrappers, or a wrapper around every Markdown image as editorial semantics.

## Venation mapping

No new Venation primitive is required by this evidence pass.

Representative mappings:

- readable article shell -> `Container`;
- vertical article/index rhythm -> `Stack`;
- article metadata, taxonomy, and action groups -> `Cluster` / `Inline`;
- archive/summary collections -> `Grid` where repeated columns are appropriate;
- content/action regions that collapse intrinsically -> `Switcher` where the relationship exists.

Current Bulma/Tailwind/framework classes are migration evidence, not Venation API requirements.

## Representative validation

### Long-form article

A reusable Phyllotaxis composition can express the current article without Ryan-specific contracts:

```tsx
<Container maxWidth="readable" as="main">
  <Stack gap="lg">
    <ArticleHeader ... />
    <Figure ... />
    <Prose>...</Prose>
  </Stack>
</Container>
```

`ArticleHeader` may internally compose `Stack`/`Cluster`; it must not duplicate their layout mechanics.

The current author name, TTS feature, exact image pipeline, comments provider and related-content model remain consumer concerns.

### Archive / editorial index

The current homepage/archive evidence can be expressed as:

```tsx
<Container maxWidth="wide" as="main">
  <Stack gap="xl">
    <FeaturedStory ... />
    <PostList ... />
    <Cluster>{/* taxonomy links */}</Cluster>
  </Stack>
</Container>
```

The stable semantics are featured content, summaries, metadata and taxonomy—not the current Bulma `box`, rounded-button, or homepage class structure.

### Plausible Micrantha journal surface

A Micrantha release essay or engineering case study can consume the same Editorial profile with organizational content:

```tsx
<Container maxWidth="readable" as="main">
  <Stack gap="lg">
    <ArticleHeader
      title="Release engineering retrospective"
      metadata={...}
      tags={...}
    />
    <Prose>...</Prose>
  </Stack>
</Container>
```

No personal author identity, Ryan-specific brand token, host name, or site theme API is required. This satisfies the visual-profile rule that Editorial is selected by content task rather than host.

## Cross-check validation

### Figure/code-heavy technical article

`ryjen/blog/content/posts/friday-frida-hack.md` exercises a more demanding prose surface than the initial template pass:

- multiple heading levels;
- ordered and unordered lists;
- block and inline code;
- multi-line JavaScript and command-output blocks;
- internal and external links;
- multiple inline images;
- long explanatory prose.

This confirms `Prose` plus semantic Chroma typography/surface roles can own the presentation without another layout primitive. Generic Markdown images remain native image content unless the authoring model establishes a real figure/caption relationship; `Figure`/`Caption` should not be used merely as a styling wrapper.

### Archive page

`ryjen/blog/layouts/archive/list.html` groups entries by year using native sections/headings and dated links. It does not justify a dedicated `Archive` component or new Venation primitive.

The reusable semantics are adequately covered by native section/heading structure, `PostList`-like list composition, and the existing metadata typography role. The current Hugo grouping mechanics remain consumer implementation detail.

### Cross-check result

Neither cross-check introduces a new stable Venation primitive or additional Chroma role. They strengthen the existing boundaries and narrow Lamina promotion: semantic abstractions should represent content relationships, not convenience wrappers around framework classes or generic media.

## Accessibility and capability requirements preserved

Editorial extraction must preserve the shared profile requirements already accepted in `visual-profiles.md`:

- semantic heading and article structure;
- native links and controls;
- keyboard navigation and visible focus;
- light/dark contrast appropriate to sustained reading;
- visited-link distinction where useful for reading/archive navigation;
- responsive text and text scaling;
- reduced-motion behavior;
- native figure/caption semantics when captions exist;
- progressive enhancement.

## Decisions for the next implementation step

1. Keep Venation unchanged; this evidence exposes no structural contract hole.
2. Define Chroma around semantic roles, not a port of the current CSS-variable namespace.
3. Implement Utility and Editorial as value resolutions of shared semantic roles where possible; introduce profile-only roles only when the semantic need is genuinely profile-specific.
4. Let #5 reduce the Lamina candidate list before component implementation.
5. Keep exact fonts, Solarized palette values, gradients, shadows, radii, avatar/branding, Hugo APIs and TTS behavior outside the stable contract unless separate evidence later justifies promotion.
