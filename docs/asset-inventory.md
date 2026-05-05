# Asset Inventory

## Overview

The repository already includes the full asset base needed for the first implementation pass. Assets should be used selectively so the page stays premium and controlled.

## Asset Manifest

### Coffee Bean

- Files:
  - `assets/coffeeBean/coffeeBean-left.webp`
  - `assets/coffeeBean/coffeeBean-right.webp`
- Narrative role: anticipation and transformation
- Scene assignment: intro sequence and reveal transition
- Priority: primary
- V1 scope: yes
- Notes: split halves are the production intro bean assets and must align precisely inside the baked reveal

### Reveal Seam Panels

- Files:
  - `assets/loader/baked/left-reveal.svg`
  - `assets/loader/baked/right-reveal.svg`
- Narrative role: seam edge source for the intro crack / reveal
- Scene assignment: intro sequence only
- Priority: primary
- V1 scope: yes
- Notes: these are the production baked panel edge-source assets for the current intro implementation

### Bean Fragments

- Files:
  - `assets/beanFragments/beanFragment-1.webp`
  - `assets/beanFragments/beanFragment-2.webp`
  - `assets/beanFragments/beanFragment-3.webp`
  - `assets/beanFragments/beanFragment-4.webp`
  - `assets/beanFragments/beanFragment-5.webp`
  - `assets/beanFragments/beanFragment-6.webp`
  - `assets/beanFragments/beanFragment-7.webp`
  - `assets/beanFragments/beanFragment-8.webp`
- Narrative role: split accent only
- Scene assignment: reveal transition
- Priority: secondary
- V1 scope: yes
- Notes: use sparingly; they should support the split, not become particles for their own sake

### Coffee Cups

- Files:
  - `assets/coffeeCups/coffeeCup-black.webp`
  - `assets/coffeeCups/coffeeCup-orange.webp`
  - `assets/coffeeCups/coffeeCup-red.webp`
  - `assets/coffeeCups/coffeeCup-yellow.webp`
- Narrative role: desire, selection, and product authority
- Scene assignment: hero composition
- Priority: primary
- V1 scope: yes
- Notes: `coffeeCup-orange.webp` is the locked featured cup for the freshness transition

### Logos

- Files:
  - `assets/logo/logo-dark.webp`
  - `assets/logo/logo-white.webp`
- Narrative role: brand signature
- Scene assignment: intro and hero
- Priority: primary
- V1 scope: yes
- Notes: white logo for orange intro stage, dark logo for cream sections

### Stickers

- Files:
  - `assets/stickers/sticker-coffeeBean.webp`
  - `assets/stickers/sticker-coffeePot.webp`
  - `assets/stickers/sticker-mascot.webp`
- Narrative role: personality accents
- Scene assignment: hero composition
- Priority: secondary
- V1 scope: yes
- Notes: use as punctuation only; no sticker persists into the freshness section in v1

### Supporting Atmosphere

- Files:
  - `assets/shadows/shadow-coffeeLeaf.webp`
  - `assets/icon/icon-locallyRoasted.webp`
  - `assets/supportingImages/masked-croissant.webp`
  - `assets/supportingImages/masked-cupOfCoffee.webp`
- Narrative role: depth, supporting story, and later freshness content
- Scene assignment: intro atmosphere and freshness section
- Priority: tertiary
- V1 scope: partial
- Notes: leaf shadow is allowed in v1 intro atmosphere; supporting food/lifestyle images are reserved for the freshness section only

## Usage Priority

`Locked`:

- primary assets must define the composition
- secondary assets may accent the composition
- tertiary assets should only be introduced if they improve the story without clutter

## Loading Strategy Direction

`Preferred`:

- preload baked intro panel, split bean, fragment, shadow, and logo assets
- prioritize hero cups needed above the fold
- defer or lazy-load tertiary supporting imagery where possible

## Performance Note

Some assets are visually heavy. Optimize only after the first scene implementation proves which files are actually essential on first paint.
