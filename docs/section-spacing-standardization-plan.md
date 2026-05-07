# Section Spacing Standardization Plan

## Purpose

This plan defines how bordered homepage sections should handle vertical spacing so the distance from the top separator to the first meaningful content, and from the last meaningful content to the bottom separator, is consistent across current and future sections.

The target is not "same padding everywhere". The target is one shared section rhythm that can be reused without re-tuning every new scene from scratch.

## Current Audit

### What exists today

#### Freshness Transition

- Top separator: [src/scenes/FreshnessTransition/FreshnessTransition.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/FreshnessTransition/FreshnessTransition.css)
  - `::before` is pinned to `inset-block-start: 0`
- Top content offset:
  - [src/scenes/FreshnessTransition/FreshnessTransition.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/FreshnessTransition/FreshnessTransition.css)
  - `.freshness-transition__content-frame` uses `padding: var(--freshness-frame-block-padding) ...`
  - `--freshness-frame-block-padding` currently resolves to `calc(clamp(90px, 8vw, 112px) + 28px)`
- Bottom separator:
  - [src/scenes/FreshnessTransition/FreshnessTransition.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/FreshnessTransition/FreshnessTransition.css)
  - `::after` is positioned with `inset-block-end: var(--freshness-bottom-divider-gap)`
  - `--freshness-bottom-divider-gap` is currently `clamp(300px, 30vw, 350px)`

#### Bestsellers Section

- No section-owned top or bottom separator yet
- Section vertical breathing is coming from [src/scenes/BestsellersSection/BestsellersSection.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/BestsellersSection/BestsellersSection.css)
  - `.bestsellers-section { padding: var(--space-section-tight) ... var(--space-section-tight); }`
  - `--space-section-tight` is currently `clamp(1.75rem, 2.6vw, 2.35rem)`
- Internal heading-to-cards spacing is separate:
  - `.bestsellers-section__heading-block { margin-block-end: calc(var(--space-section-compact) + 18px); }`

### What is inconsistent

| Area | Freshness | Bestsellers | Problem |
| --- | --- | --- | --- |
| Top border-to-content model | Divider is structural and content is offset by a dedicated scene token | Content is offset by generic section padding | Different spacing systems are being compared |
| Bottom border-to-content model | Divider position is manually floated upward with a large scene-specific offset | No section-owned lower divider model yet | There is no shared "section end" rule |
| Ownership | Border spacing is tied to scene-specific visual tuning | Border spacing is tied to generic section padding | Future sections would likely invent a third pattern |
| Editability | Requires tuning pseudo-elements and scene offsets together | Requires tuning section padding and internal gaps | Small layout changes will keep re-breaking rhythm |

### Main finding

We currently have spacing tokens, but not a true **border rhythm system**.

The missing abstraction is:

- `top border to content start`
- `content body`
- `content end to bottom border`

Until those are explicit, every new section will drift.

## Standardization Strategy

### Section spacing should be modeled in two layers

#### Layer 1: shared border rhythm tokens

Add shared tokens in [src/styles/tokens.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/styles/tokens.css) for bordered sections:

- `--section-divider-offset-top`
- `--section-divider-offset-bottom`
- `--section-divider-offset-top-mobile`
- `--section-divider-offset-bottom-mobile`

These tokens should describe the distance from a separator line to the first or last meaningful section content.

#### Layer 2: scene-specific internal composition spacing

Each section should still own its internal hierarchy:

- label to hero object
- heading to subtitle
- subtitle to cards
- cup to oversized typography

Those internal distances should remain scene-specific.

The shared system should only standardize the outer chapter rhythm.

## Proposed Implementation Model

### Freshness Transition

Freshness should become the reference implementation for sections with top and bottom separators.

Implementation direction:

- replace `--freshness-frame-block-padding` as the top divider spacing source with a shared top border token
- replace `--freshness-bottom-divider-gap` as a one-off clamp with a shared bottom border token
- keep the bean separators in `::before` and `::after`
- keep the cup/artboard composition rules independent from the outer border rhythm

Practical meaning:

- top bean line stays at `0`
- top label/content starts after `--section-divider-offset-top`
- bottom bean line sits after the content floor plus `--section-divider-offset-bottom`

### Bestsellers Section

Bestsellers should be adapted to the same chapter rhythm before more sections are added.

Implementation direction:

- introduce section-owned top and bottom separator support for Bestsellers
- swap `padding-block` from generic `--space-section-tight` to shared divider offset tokens
- keep title/subtitle/cards spacing separate from the section border rhythm

Practical meaning:

- the top separator should sit above the title block using the same top offset logic as Freshness
- the bottom separator should sit below the card shelf using the same bottom offset logic as Freshness
- the section should end visually as a framed chapter, not just as "whatever padding remains"

## Files That Will Need Changes

- [src/styles/tokens.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/styles/tokens.css)
- [src/scenes/FreshnessTransition/FreshnessTransition.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/FreshnessTransition/FreshnessTransition.css)
- [src/scenes/BestsellersSection/BestsellersSection.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/BestsellersSection/BestsellersSection.css)

Potentially:

- [docs/design-system.md](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/docs/design-system.md)
  - only if we want to formalize bordered-section rhythm as a documented design rule

## Recommended Token Shape

Recommended first pass:

- `--section-divider-offset-top: clamp(118px, 8vw, 140px);`
- `--section-divider-offset-bottom: clamp(118px, 8vw, 140px);`
- `--section-divider-offset-top-mobile: clamp(72px, 10vw, 96px);`
- `--section-divider-offset-bottom-mobile: clamp(72px, 10vw, 96px);`

Why this shape:

- it starts from the current Freshness top rhythm
- it avoids using tiny ecommerce-style section padding for sections that are visually framed by separators
- it gives future sections a reusable chapter envelope

## Implementation Sequence

1. Create shared divider offset tokens in [src/styles/tokens.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/styles/tokens.css).
2. Refactor Freshness to consume those tokens for top and bottom separator spacing.
3. Add matching top and bottom separator structure to Bestsellers.
4. Tune Bestsellers internal title-to-cards spacing after the outer rhythm is unified.
5. Verify desktop, tablet, and mobile against live screenshots.

## Risks And Notes

- Freshness bottom spacing is currently visually tied to the cup landing and large typography mass, so replacing that offset should be done carefully.
- Bestsellers currently has no lower separator model, so adding one may reveal that the card shelf needs a small internal bottom spacing adjustment.
- The shared tokens should standardize the chapter frame, not flatten every section into identical internal composition.

## Success Criteria

- Freshness and Bestsellers use the same conceptual top and bottom border offsets.
- Adding a third bordered section no longer requires inventing new top/bottom spacing logic.
- Internal hierarchy remains scene-specific, but the page reads as one consistent editorial sequence.
- Separator-to-content spacing is visually matched on desktop and simplified proportionally on mobile.
