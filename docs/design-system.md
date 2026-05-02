# Design System

## Purpose

This document defines the visual system for Lounge Coffee based on reviewed Figma evidence. It should preserve the product feel, typography logic, color semantics, composition language, and responsive restraint of the current concept without inventing unsupported directions.

This is a project design-system spec, not a full code token file and not a motion document.

## Design Intent

Lounge Coffee should feel warm, premium, editorial, and product-first. The visual system should create desire through oversized product imagery, restrained chrome, tactile cream surfaces, rich espresso foregrounds, and carefully placed orange emphasis.

### Visible Traits

- warm contrast rather than cold minimalism
- spacious compositions with oversized product forms
- compact text islands against large image masses
- restrained UI chrome that supports, rather than competes with, the products
- soft atmospheric blur and glow instead of hard-edged decorative effects
- playful accents used as punctuation, not as dominant focal points

### Anti-Traits

- generic card-heavy marketing layouts
- centered symmetrical compositions by default
- decorative clutter competing with the featured cup
- novelty serif styling without Figma evidence
- loud dark surfaces taking over the page
- orange used as an all-purpose highlight everywhere

## Visual Principles

- Product renders outrank all decoration.
- Typography supports composition; it should not replace product imagery as the primary attraction.
- Atmosphere should create warmth and depth, not noise.
- Stickers and playful accents remain secondary.
- Navigation and utilities should feel like restrained chrome, not the star of the page.
- Asymmetry, overlap, and controlled cropping are preferred over rigid centered balance.

## Foundations

## Color System

### Reviewed Palette

The following colors are confirmed in the reviewed Figma boards and screens:

- `#F0E8DC`
- `#E75B20`
- `#351512`
- `#84332A`
- `#EEC88A`
- `#DFC1A8`

### Color Roles

#### `#F0E8DC`

- Meaning: primary cream stage
- Allowed uses: hero/freshness background, light inverse support, calm matte surface
- Avoid: turning it into a dark-section accent or over-texturing it

#### `#E75B20`

- Meaning: primary interactive and editorial accent
- Allowed uses: CTA surface, large freshness headline emphasis, selected premium highlight moments
- Avoid: using it for every badge, border, or decorative detail until it loses value

#### `#351512`

- Meaning: default UI foreground
- Allowed uses: nav text, icons, key headings, metric text, readable foreground contrast on cream
- Avoid: replacing every deep brown tone with this when a softer supporting dark is more appropriate

#### `#84332A`

- Meaning: supporting brand dark
- Allowed uses: secondary dark brand tone, deeper coffee accent where needed
- Avoid: assuming it is the default body/text foreground without verifying the section

#### `#EEC88A`

- Meaning: glow / highlight color
- Allowed uses: warm highlight shadows, glow accents, premium warmth in effects
- Avoid: generic fills, cards, or default text

#### `#DFC1A8`

- Meaning: atmosphere haze color
- Allowed uses: blurred environment fills, soft warm backdrop effects
- Avoid: buttons, cards, strong UI surfaces, or semantic status color

### Intro Scope Note

The reviewed hero and freshness screens use `#F0E8DC` as their main stage. Intro/reveal-heavy orange frames exist elsewhere in the file and may define additional section-specific rules. Do not treat hero/freshness surface behavior as automatically global for every scene without checking those intro frames.

## Typography System

### Reviewed Families

All reviewed nodes use Haas Grot families:

- `Haas Grot Disp Trial`
- `Haas Grot Text R Trial`

No serif evidence was found in the reviewed nodes.

### Typeface Logic

#### `Haas Grot Text R Trial`

Use for:

- narrative product headline emphasis
- strong numeric emphasis when the section needs slightly more product warmth than UI neutrality

Communicates:

- richer product emphasis
- softer narrative authority

Avoid:

- using it blindly for every label or nav element

#### `Haas Grot Disp Trial`

Use for:

- navigation
- labels
- section markers
- jumbo editorial proclamation type
- button labeling when the Figma component definition is followed

Communicates:

- cleaner interface structure
- editorial signage
- confident display utility

Avoid:

- flattening all hierarchy into one display style

### Reviewed Type Roles

#### Hero Headline

- family: `Haas Grot Text R Trial`
- style: `75 Bold`
- size: `58`
- letter spacing: `-1`
- color: `#351512`

#### Freshness Jumbo Headline

- family: `Haas Grot Disp Trial`
- style: `75 Bold`
- size: `96`
- letter spacing: `-3`
- color: `#E75B20`

#### Navigation Label

- family: `Haas Grot Disp Trial`
- style: `55 Roman`
- size: `22`
- letter spacing: `-0.5`
- color: `#351512`

#### Metric Label / Small Prompt

- family: `Haas Grot Disp Trial`
- style: `55 Roman`
- size: `20`
- letter spacing: `-0.5`
- color: `#351512`

#### Section Eyebrow

- family: `Haas Grot Disp Trial`
- style: `65 Medium`
- size: `28`
- color: `#351512`

### Known Figma Mismatches

These remain provisional and should not be flattened into fake certainty:

- button text family mismatch:
  - standalone `Button` component uses `Haas Grot Disp Trial 65 Medium / 24`
  - placed hero instance renders `Haas Grot Text R Trial 65 Medium / 24`
- metric value family mismatch:
  - standalone `Testimonials` component uses `Haas Grot Text R Trial 65 Medium / 30`
  - placed hero metrics render `Haas Grot Disp Trial 65 Medium / 30`

Until Figma resolves this clearly, document button and metric value typography as provisional where necessary.

### Fallback Rule

If exact Haas trial fonts are unavailable in code, use close grotesk alternatives that preserve:

- compact editorial density
- low-friction UI readability
- tight but controlled negative letter spacing for major headlines

Do not introduce serif contrast as a substitute.

## Atmosphere And Effects

The visual system relies on environmental blur and glow more than traditional component shadows.

### Observed Behavior

- soft blurred ellipses in `#DFC1A8`
- large haze blocks in warm beige with lower opacity
- subtle warm highlight shadows using `#EEC88A`

### Observed Numeric Examples

These are reviewed examples, not universal tokens yet:

- atmosphere ellipse:
  - fill: `#DFC1A8`
  - opacity: about `0.87`
  - layer blur: `70`
- haze block:
  - fill: `#DFC1A8`
  - opacity: about `0.38`
  - layer blur: `130`
- warm highlight shadow:
  - color: `#EEC88A`
  - radius: `4`
  - offsets in reviewed examples: around `x -4 to -7`, `y 4`

### Effect Rules

- Use atmosphere blur to create warmth and depth behind products.
- Keep glow and haze soft, broad, and secondary.
- Prefer environmental haze over generic card-shadow styling.
- Do not let effects become more noticeable than the product render.

## Composition And Components

## Composition Grammar

### Core Layout Logic

- asymmetry is preferred over centered balance
- oversized product forms should dominate the viewport
- text should live in compact islands against large product masses
- overlap and off-frame cropping help create energy and scale
- accents should support the focal object instead of creating parallel focal points

### Hero Composition Pattern

In the reviewed hero:

- one dominant orange cup anchors the composition
- black and yellow cups support weight and balance
- red cup acts more like edge energy than the primary hero
- the headline and CTA stay compact relative to the cup field

Durable rule:

- one product render must clearly dominate
- supporting cups should build rhythm, scale, and asymmetry

### Restraint Rules

- keep text density low relative to image scale
- limit the number of competing accents in a section
- if a sticker starts competing with a cup or headline, remove or reposition it
- background atmosphere should never become the most eye-catching element

## Component Visual Rules

### Button

Observed:

- orange surface
- cream label
- medium-weight grotesk label treatment

Rule:

- buttons should feel bold, warm, and simple
- avoid over-decorating buttons with extra outline systems or novelty effects

### Navigation

Observed:

- dark espresso text
- quiet display-grotesk labels
- optional inline icon/dropdown handling

Rule:

- nav should read like understated brand chrome
- it should not overpower the hero composition

### Metrics / Testimonials

Observed:

- small proof cluster
- restrained separators
- compact value + label pair

Rule:

- metrics should support credibility
- they should not become dashboard cards or content-heavy stat panels

### Stickers

Rule:

- stickers are personality accents only
- use them to punctuate composition, not to create new hierarchy

## Responsive And Non-Visual Constraints

### Responsive Simplification

- simplify before shrinking everything equally
- remove secondary decorative cups before compromising the hero cup
- remove or reduce sticker presence before flattening product scale
- preserve the main headline and featured cup as the dominant mobile elements

### Breakpoint Philosophy

- wide desktop can support the fullest asymmetrical staging
- compact desktop/tablet should preserve hierarchy with fewer competing accents
- mobile should keep the same feel through simplification, not miniature duplication

### Accessibility And Readability

- maintain readable foreground contrast on cream surfaces
- preserve clear CTA legibility
- keep large headline spacing controlled enough to remain readable
- avoid atmosphere layers that reduce text clarity

### What This Design System Intentionally Leaves To Other Docs

- motion sequencing and timing
- exact React component structure
- final CSS variable file layout
- scroll behavior implementation

## Design Safeguards

## Vocabulary

- `editorial`: large confident type used like a poster or proclamation, not like dense article copy
- `playful punctuation`: small characterful accents that support the scene without dominating it
- `restrained chrome`: nav and utilities that feel quiet and premium
- `product-first`: product imagery remains the visual authority of the page

## Do / Don't

### Do

- keep the cups visually dominant
- use orange with intention
- preserve asymmetry and cropping
- use haze and glow to support warmth
- keep the interface visually quiet around the product

### Don't

- introduce serif contrast without new Figma evidence
- overuse dark surfaces
- center everything symmetrically by default
- replace atmosphere blur with generic card shadows
- let orange become a generic all-purpose highlight everywhere
- turn metrics or nav into attention magnets

## Status Notes

- Reviewed evidence strongly supports a grotesk-led system.
- Button and metric value typography remain partially inconsistent between component definitions and placed screen instances.
- Intro/reveal scenes may introduce additional section-specific palette behavior and should be reviewed before hardening truly global color rules.
