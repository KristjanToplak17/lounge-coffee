# Hero Implementation Plan

## Summary

This implementation pass adds the first real static **Hero Composition** behind the intro reveal and replaces the cream underlay-only payoff. It stays within v1 scope: desktop-first, static hero foundation, no advanced loader-to-hero choreography yet, no sticky freshness behavior yet, no package changes, no asset removals.

## 1. Existing System Audit

- **Current app handoff**
  - [`src/App.jsx`](../src/App.jsx) preloads intro assets, renders the intro overlay, and now mounts the hero scene behind it.
  - `data-current-scene` now switches from `intro` to `hero`.
  - The hero is present as the reveal destination instead of a plain underlay.

- **Current scene/component structure**
  - [`src/scenes/IntroReveal`](../src/scenes/IntroReveal) remains the intro owner.
  - [`src/scenes/HeroComposition/HeroComposition.jsx`](../src/scenes/HeroComposition/HeroComposition.jsx) owns the static hero scene.
  - [`src/scenes/FreshnessTransition`](../src/scenes/FreshnessTransition) remains out of scope for this pass.

- **Existing typography/color/layout tokens**
  - Reused:
    - `--color-cream-stage`
    - `--color-orange-stage`
    - `--color-brown-espresso`
    - `--color-brown-support`
    - `--color-glow`
    - `--color-haze`
    - `--font-display`
    - `--font-body`
    - `--shadow-soft`
    - `--shadow-glow`
  - Added hero semantic tokens in [`src/styles/tokens.css`](../src/styles/tokens.css) for header, headline, stats, CTA, stage sizing, atmosphere blur, and cup shadow.

- **Existing asset mappings**
  - Existing logos, cups, bean, reveal assets, and shadow remain in place.
  - Added hero sticker mappings in [`src/utils/assetMap.js`](../src/utils/assetMap.js):
    - `stickers.mascot`

- **What the hero needed**
  - scene markup
  - hero-specific CSS
  - hero content data
  - lightweight header implementation
  - Figma-aligned metrics
  - post-intro `hero` scene marker

## 2. Target Hero Layout

- **Header / nav**
  - Full-width quiet chrome bar on cream.
  - Small dark logo on the left.
  - Center nav:
    - `HOME`
    - `FLAVORS`
    - `COLLECTION`
    - `ABOUT`
    - `CONTACT`
  - Right utilities:
    - `EN` with caret
    - `BASKET` with inline SVG basket icon

- **Product field**
  - Four floating cups staged as a poster-like composition.
  - Red cup cropped top-left.
  - Yellow cup dominant near center-left.
  - Black cup large near center-right.
  - Orange cup cropped on the far right and preserved as the future continuity cup.

- **Headline block**
  - Sticker above headline.
  - Two-line headline:
    - `Rich & Aromatic`
    - `Lounge Coffee`
  - Orange CTA:
    - `Shop Now`

- **Stats block**
  - Three compact proof items near the top-right:
    - `20+ Flavors`
    - `12k+ Reviews`
    - `15+ Pasteries`

- **Atmosphere**
  - Warm cream field with soft blurred haze and glow layers.
  - No boxed cards or heavy borders.

## 3. Asset Mapping

- **Logo**
  - `assets/logo/logo-dark.webp`
  - `assets/logo/logo-white.webp` stays intro-only

- **Coffee cups**
  - `assets/coffeeCups/coffeeCup-red.webp`
  - `assets/coffeeCups/coffeeCup-yellow.webp`
  - `assets/coffeeCups/coffeeCup-black.webp`
  - `assets/coffeeCups/coffeeCup-orange.webp`

- **Sticker**
  - Primary hero sticker:
    - `assets/stickers/sticker-mascot.webp`
  - Optional later accent:
    - `assets/stickers/sticker-coffeePot.webp`

- **Missing assets / naming**
  - No basket icon asset exists in `assets/`.
  - The implementation uses a small inline SVG basket icon in the hero header.

## 4. Design Tokens Needed

- **Existing tokens reused**
  - palette, font, spacing, and effect tokens listed above

- **New tokens added**
  - `--hero-header-height`
  - `--hero-logo-width`
  - `--hero-nav-size`
  - `--hero-stat-value-size`
  - `--hero-stat-label-size`
  - `--hero-headline-size`
  - `--hero-headline-leading`
  - `--hero-cta-height`
  - `--hero-cta-padding-x`
  - `--hero-stage-max-width`
  - `--hero-copy-width`
  - `--hero-atmosphere-blur`
  - `--hero-cup-shadow`

- **Typography mapping**
  - hero headline -> `var(--font-body)`
  - nav / utilities / stats / CTA -> `var(--font-display)`

## 5. Component / File Plan

- **Created**
  - [`src/scenes/HeroComposition/HeroComposition.jsx`](../src/scenes/HeroComposition/HeroComposition.jsx)
  - [`src/scenes/HeroComposition/HeroComposition.css`](../src/scenes/HeroComposition/HeroComposition.css)
  - [`docs/hero-implementation-plan.md`](./hero-implementation-plan.md)

- **Modified**
  - [`src/App.jsx`](../src/App.jsx)
  - [`src/styles/tokens.css`](../src/styles/tokens.css)
  - [`src/utils/assetMap.js`](../src/utils/assetMap.js)
  - [`src/content/copy.js`](../src/content/copy.js)
  - [`src/content/metrics.js`](../src/content/metrics.js)
  - [`docs/repo-state.json`](./repo-state.json)

- **Componentization**
  - The hero remains mostly scene-owned.
  - Header, stats, sticker, copy, and cup stage all live in `HeroComposition.jsx`.
  - Inline SVG icons are kept local to the scene for now.

## 6. Desktop Layout Specification

- **Header**
  - height: `var(--hero-header-height)`
  - horizontal padding uses `clamp()`
  - logo left, nav centered, utilities right

- **Stats**
  - absolute at upper-right under nav
  - compact horizontal row with thin separators

- **Headline / CTA**
  - anchored in the lower-left quadrant
  - width constrained by `--hero-copy-width`

- **Cup stage**
  - full-scene absolute layer
  - red and orange intentionally cropped off-frame
  - yellow and black dominate the main field

## 7. Responsive Notes

- **Compact desktop / tablet**
  - nav gaps reduce first
  - stats stay visible but tighten
  - red and orange crops reduce before compromising the yellow/black pair

- **Mobile**
  - center nav hides
  - logo, `EN`, and `BASKET` remain
  - stats hide on small screens
  - red and orange cups hide
  - yellow remains lead product
  - black remains secondary product
  - headline stacks near the top under the header

## 8. Future Animation Notes

- cups can later animate in after reveal completion
- sticker can pop in later
- headline and CTA can reveal after the cups settle
- loader-to-hero transition can later expose this already-mounted scene behind the crack
- orange cup can later become the pinned continuity cup for the freshness transition

## 9. Implementation Readiness Checklist

- Hero scene is mounted behind the intro.
- Post-intro scene marker is `hero`.
- Sticker and hero metrics are mapped in shared utilities/content.
- Hero uses the four existing cup assets with no new package or image additions.
- Basket icon uses inline SVG.
- Repo browser expectation has been updated from `underlay` to `hero`.
