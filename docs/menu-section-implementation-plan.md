# Menu Section Implementation Plan

## Purpose

This document defines the implementation plan for the new **Menu** section using the provided desktop Figma PNG reference, the current Lounge Coffee design system, and the assets already present in `assets/Menu` and `assets/icon`.

This is a planning document only. No source implementation is included here.

## Planning Inputs

### Source documents reviewed

- `AGENTS.md`
- `docs/README.md`
- `docs/project-brief.md`
- `docs/scene-map.md`
- `docs/motion-system.md`
- `docs/design-system.md`
- `docs/asset-inventory.md`
- `docs/app-architecture.md`
- `docs/content-contract.md`
- `docs/repo-state.json`

### Current codebase inspected

- `src/App.jsx`
- `src/scenes/HeroComposition/*`
- `src/scenes/FreshnessTransition/*`
- `src/scenes/BestsellersSection/*`
- `src/styles/tokens.css`
- `src/styles/globals.css`
- `src/styles/motion.css`
- `src/utils/assetMap.js`

### Current homepage structure confirmed in code

Current homepage order is:

1. `HeroComposition`
2. `FreshnessTransition`
3. `BestsellersSection`

The Menu section should be planned as the next downstream content section in that flow unless the user requests a different order.

## 1. Reference Audit

### Overall visual structure

The Figma reference presents the Menu section as a calm editorial menu board on a warm cream surface. It is not card-based and not CTA-led. The composition is flat, open, and highly legible, with the product images doing the visual work while text stays quiet.

Primary structure, top to bottom:

1. Large two-line heading: `Our Fresh Menu.`
2. Small decorative sticker/icon in the upper-right corner
3. Main category heading: `Drinks`
4. Three drinks subsections with orange labels and thin horizontal rules
5. Three 4-item image rows for drinks
6. Two text-only lists side by side: `ARABICA` and `COFFEE`
7. Second main category heading: `Pasteries` in the screenshot
8. Two pastries subsections with orange labels and thin horizontal rules
9. Two 4-item image rows for pastries

### Hierarchy

#### Level 1

- Section headline: `Our Fresh Menu.`
- Very large, dark coffee-brown, visually dominant

#### Level 2

- Main category headings: `Drinks`, `Pasteries`
- Dark coffee-brown
- Clearly smaller than the main title, but still strong

#### Level 3

- Subsection labels: `SIGNATURE COFFEE`, `FRESH COLD`, `MILK-BASED COLD`, `ARABICA`, `COFFEE`, `DONUTS`, `CROISSANTS`
- All caps
- Orange accent color
- Paired with a thin rule extending horizontally to the right

#### Level 4

- Product names
- Smaller dark coffee-brown labels beneath each image

#### Level 5

- Prices
- Same baseline as product names
- Lighter visual emphasis than names
- Right-aligned within each item row, or aligned as the trailing value in a name/price pair

### Spacing patterns

Observed spacing logic from the screenshot:

- Large top padding before the title
- Title and icon share the same top band
- Strong gap between title block and `Drinks`
- Each subsection begins with its orange label and rule, followed by a moderate gap before products
- Product rows have generous horizontal gutters and a larger vertical gap before the next subsection
- The text-only `ARABICA` and `COFFEE` block sits closer together than the image rows, but still breathes
- `Pasteries` starts with a larger vertical reset, similar to a new chapter heading
- Bottom spacing remains generous and calm rather than compressed

Implementation reading:

- The section should use wide vertical rhythm with consistent clamp-based spacing steps
- Image rows should not feel dense or marketplace-like
- The layout should preserve visible empty space around each cluster

### Product, label, name, and price alignment

For image-based items:

- Each row is a 4-column grid
- Product image is centered in each cell
- Text block sits directly beneath the image
- Item name and price share one line
- Item name aligns left within the text row
- Price aligns right within the same row
- Text block width appears tied to the full item column, not the intrinsic image width

For text-only list items:

- Two vertical lists sit side by side
- Each list item is a single horizontal row
- Beverage name aligns left
- Price aligns right
- Rows use restrained line height and even vertical spacing

### Divider line usage

The internal divider lines are simple, thin, and understated:

- They appear immediately after the orange subsection label
- They do not sit above or below the label; they continue horizontally from the label's baseline region
- They use a pale warm line color, likely a low-opacity brown or orange-tinted beige
- They separate subsection metadata from the products rather than acting as heavy borders

Implementation reading:

- This should be a dedicated subsection-header pattern, not a full-width page divider
- It should be lighter and simpler than the existing `.bordered-section__divider`

### Upper-right sticker/icon positioning

The decorative icon behaves like a secondary punctuation mark:

- Positioned in the upper-right quadrant of the section
- Aligned near the top band of the main title, not centered within the whole section
- Small enough to stay subordinate to the title
- Floats in open negative space
- Does not overlap product rows

Implementation reading:

- Position it absolutely inside the section frame on desktop
- Keep it visually anchored to the title zone
- Reduce or reposition it on smaller screens before shrinking the title excessively

## 2. Brand Alignment

### How this section should align with Lounge Coffee

The Menu section should feel close to the Figma screenshot while still reading as part of the current Lounge Coffee site:

- Use the existing cream stage as the background foundation
- Use the project's espresso foreground for all primary text
- Use the existing orange accent for subsection labels
- Reuse the current grotesk typography families already established in hero and downstream sections
- Keep the section premium and editorial rather than transactional
- Preserve calm negative space instead of turning the section into a card grid or catalog

This aligns with the brief's warm, restrained, product-first direction and with the design system's emphasis on compact text islands, image authority, and quiet chrome.

### Existing tokens, classes, and conventions to reuse

#### Shared tokens

From `src/styles/tokens.css`, the section should reuse:

- `--color-cream-stage`
- `--color-brown-espresso`
- `--color-brown-support`
- `--color-orange-stage`
- `--hero-stage-max-width`
- `--space-section-lateral`
- `--space-section-tight`
- `--space-section-compact`
- `--ease-strong-out`

Recommended additions should happen only if implementation exposes a real recurring pattern. Do not hardcode random per-element values when an existing token can cover the need.

#### Shared wrapper convention

Reuse:

- `bordered-section`
- `bordered-section__divider`

For section-level top and bottom separators only, if the final insertion point is meant to match the current downstream section rhythm.

Do not reuse `.bordered-section__divider` for the internal menu subsection lines, because the Figma lines are much thinner and quieter.

#### Typography conventions

Reuse the current type logic:

- Major title: `Haas Grot Text R Trial` stack
- Structural labels and subsection tags: `Haas Grot Disp Trial` stack
- Product names and prices can remain in the same family split used elsewhere:
  - names can use `Text`
  - labels and list utility text can use `Disp`

### How to preserve the Figma feeling without hardcoded random values

Implementation should avoid:

- scattered pixel nudges with no pattern
- arbitrary font sizes per row
- unique per-item spacing overrides
- one-off line widths for every subsection

Implementation should prefer:

- one section frame width based on `--hero-stage-max-width`
- one lateral padding system using `--space-section-lateral`
- one headline scale using `clamp()`
- one reusable subsection-header component with label + rule
- one reusable product grid component with configurable column count through CSS
- one reusable name/price row pattern

This keeps the section close to the Figma composition while still fitting the repo's existing system.

## 3. Asset Mapping

## Menu assets inspected

### Drinks

#### `assets/Menu/Drinks/signature-coffee`

- `choco-latte.webp` -> `Choco Latte`
- `matcha-cloud.webp` -> `Matcha Cloud`
- `taro-swirl.webp` -> `Taro Swirl`
- `vanilla-cream.webp` -> `Vanilla Cream`

#### `assets/Menu/Drinks/fresh-cold`

- `berry-splash.webp` -> `Berry Splash`
- `citrus-spark.webp` -> `Citrus Spark`
- `mint-lime.webp` -> `Mint Lime`
- `peach-breeze.webp` -> `Peach Breeze`

#### `assets/Menu/Drinks/milk-based-cold`

- `brown-sugar.webp` -> `Brown Sugar`
- `pecans-latte.webp` -> `Pecans Latte`
- `honey-oat.webp` -> `Honey Oat`
- `ube-cream.webp` -> `Ube Cream`

### Pastries asset folder

Note: the folder is named `Pasteries`, matching the screenshot spelling, but likely not the intended English spelling.

#### `assets/Menu/Pasteries/donuts`

- `caramel.webp` -> `Caramel`
- `chocolate.webp` -> `Chocolate`
- `cookies.webp` -> `Cookies`
- `strawberry.webp` -> `Strawberry`

#### `assets/Menu/Pasteries/croissants`

- `berry.webp` -> `Berry`
- `chocolate.webp` -> `Chocolate`
- `pistachio.webp` -> `Pistachio`
- `vanilla.webp` -> `Vanilla`

### Sticker/icon asset inspected

In `assets/icon`, the available asset is:

- `icon-locallyRoasted.webp`

Planned mapping:

- `icon-locallyRoasted.webp` -> upper-right decorative icon used in the Menu section header

### Asset assumptions

- Asset filenames map cleanly to the visible menu items in the Figma screenshot
- `pecans-latte.webp` is assumed to intentionally correspond to the displayed label `Pecans Latte`
- `icon-locallyRoasted.webp` is assumed to be the intended orange outline badge shown in the upper-right of the reference
- No new image processing, renaming, or asset movement should be required

## 4. Component Structure

Recommended scene ownership:

- `src/scenes/MenuSection/` should own the section DOM and section-specific CSS

Recommended reusable components:

### `MenuSection`

Owns:

- section wrapper
- section title
- upper-right icon
- category order
- section-level spacing

### `MenuCategory`

Owns:

- category heading such as `Drinks` or `Pastries`
- grouping of its subsections

### `MenuSubsection`

Owns:

- orange uppercase label
- thin horizontal divider line
- either a product grid or a text list block

### `MenuProductGrid`

Owns:

- grid layout for image-based menu items
- responsive column behavior

### `MenuProductItem`

Owns:

- product image
- item name
- price

### `MenuTextList`

Owns:

- one text-only list column such as `Arabica` or `Coffee`

### `MenuTextListItem`

Owns:

- beverage name
- price row alignment

### Suggested supporting content/data structure

Keep copy and pricing in data rather than hardcoded JSX. Recommended:

- `src/content/menu.js`

Possible structure:

- `sectionTitle`
- `iconAlt`
- `categories`
- per subsection:
  - `label`
  - `type: "grid" | "text-list"`
  - `items`

### Suggested asset mapping location

Two acceptable approaches:

1. Extend `src/utils/assetMap.js` with a `menu` subtree
2. Create a scene-specific `src/scenes/MenuSection/menuAssets.js`

Preferred for this section:

- create `src/scenes/MenuSection/menuAssets.js` if these assets are used only by this section

Reason:

- current global `assetMap.js` already holds shared cross-scene assets
- menu photos are section-local and do not need to enlarge the shared map unless future reuse appears

## 5. Layout Plan

### Desktop

Target viewport reference:

- 1440px-wide art direction, matching the provided screenshot and the existing `--hero-stage-max-width`

Plan:

- Wide centered frame using `min(100%, var(--hero-stage-max-width))`
- Generous top padding before the title
- Title and icon arranged in a single top composition band
- 4-column product grids for all image-based subsections
- Equal-width columns with consistent gaps
- Text-only `ARABICA` and `COFFEE` block displayed as a 2-column layout
- Spacious vertical transitions between subsections and category changes

Recommended desktop behavior:

- Title block stays left-heavy
- Icon stays in the upper-right negative space
- Product images remain visually large enough to feel photographic, not thumbnail-like
- Text rows stay the same width as their grid columns for clean price alignment

### Tablet

Plan:

- Product grids collapse to 2 columns
- Keep category and subsection order unchanged
- `ARABICA` and `COFFEE` can remain side by side if width still allows balanced name/price rows
- If the text lists become cramped, stack them with a reduced gap rather than compressing typography too far
- Sticker/icon should either move inward or reduce in size to preserve balance

### Mobile

Plan:

- Product grids collapse to 2 columns first
- If the existing homepage mobile rhythm shows better clarity with single-column image items at smaller widths, allow a final 1-column fallback below a narrow breakpoint
- Text-only lists stack vertically
- Heading remains large and poster-like, but no longer depends on the icon for balance
- Icon should shrink and move closer to the title, or optionally shift below/right of the title if absolute positioning feels fragile
- Preserve breathing room between subsections; do not mimic desktop density

### Responsive breakpoint philosophy

Follow the repo's established simplification pattern:

- simplify composition before shrinking everything evenly
- keep hierarchy intact
- protect readability and image presence first

## 6. Styling Plan

### Background color

Use:

- `var(--color-cream-stage)`

Optional support:

- very subtle warm haze can be used only if needed to avoid flatness, but this section should remain calmer and cleaner than Hero or Bestsellers

### Heading size and weight

Planned style:

- large two-line headline
- `Haas Grot Text R Trial` stack
- bold weight
- dark espresso color
- tight negative tracking
- line height close to 0.9 to 0.96

Recommended implementation direction:

- `font-size: clamp(3rem, 7vw, 5.5rem)` range
- `font-weight: 700`
- `letter-spacing` slightly negative

### Main section title style

Category headings such as `Drinks` and `Pastries`:

- same dark espresso family
- smaller than section title
- weight strong enough to read as chapter headings
- likely `Text` family or whichever existing headline family best matches the current site's premium tone

### Orange subsection label style

Use:

- `var(--color-orange-stage)`
- uppercase
- `Haas Grot Disp Trial` stack
- medium to bold weight
- compact line height

This should feel like editorial signage, not button text.

### Divider line style

Use:

- thin 1px horizontal rule
- warm low-contrast tone, likely derived from brown or orange at low opacity
- flexible fill width to occupy remaining row space

Suggested pattern:

- subsection header is a flex row
- label is intrinsic width
- rule fills the remaining space

### Product image sizing

Image rules:

- centered inside each grid cell
- object should stay visually dominant
- avoid heavy decorative framing
- keep images on transparent backgrounds
- preserve aspect ratio

Implementation direction:

- constrain height rather than forcing equal width only
- use a consistent image stage height per subsection row
- allow pastries and drinks to share the same component but with variant class hooks if needed

### Item name and price alignment

Rules:

- name left, price right
- same row
- no centered price
- keep prices visually quieter than names
- preserve consistent baseline alignment across the row

Recommended typography split:

- name: darker and slightly heavier
- price: same family or a simpler display utility style, but lower emphasis

### Vertical spacing between subsections

Rules:

- moderate gap between subsection header and item grid/list
- larger gap between one subsection group and the next
- largest gap between `Drinks` block and `Pastries` block

These spacing steps should be tokenized through a small set of clamp-based values instead of custom per-section spacing.

### Visual breathing room

The section should feel:

- airy
- premium
- calm
- poster-like

Avoid:

- dense rows
- card borders
- boxed item wrappers
- unnecessary shadows
- extra badges or CTA buttons

### Responsive rules

- desktop: 4 columns for image rows
- tablet: 2 columns for image rows
- mobile: 2 columns, then optional 1 column at the narrowest width if text alignment or image legibility suffers
- text lists: 2 columns until space becomes cramped, then stack vertically
- icon: reduce or reposition before crowding the title
- title: maintain hierarchy with `clamp()`, not breakpoint-specific hard jumps everywhere

## 7. Implementation Scope

### Likely files to create

- `src/scenes/MenuSection/MenuSection.jsx`
- `src/scenes/MenuSection/MenuSection.css`
- `src/scenes/MenuSection/menuAssets.js` or `src/content/menu.js`
- `src/content/menu.js` if copy and pricing are separated from asset imports

### Likely files to change

- `src/App.jsx`
  - insert `<MenuSection />` into the homepage flow
- `src/styles/motion.css`
  - only if reduced-motion handling needs explicit coverage for new hover or transition states
- `src/utils/assetMap.js`
  - only if the shared-map approach is chosen instead of a section-local asset map

### Proposed insertion point

Default recommendation:

- insert `MenuSection` after `BestsellersSection`

Reason:

- the current app already extends beyond freshness into Bestsellers
- the user described Menu as the next section to implement
- the menu reads naturally as a downstream product/detail chapter after a featured showcase

### What not to modify

- intro sequence structure
- hero composition layout
- freshness transition choreography
- bestsellers card design
- existing global tokens unless a genuinely reusable menu token emerges
- asset filenames and folder structure unless absolutely necessary

## 8. Risks And Assumptions

### Asset naming assumptions

- Asset names currently match the Figma reference closely enough for deterministic mapping
- `Pasteries` is treated as a folder name only, not proof that the final UI spelling should remain incorrect
- `icon-locallyRoasted.webp` is assumed to be the correct decorative badge

### Copy spelling decision: `Pasteries` vs `Pastries`

Recommendation:

- display `Pastries` in the implemented UI
- preserve the on-disk folder name `Pasteries`

Reason:

- `Pastries` is the correct English spelling
- folder naming should not force visible copy if the copy is clearly a typo

If the user wants literal screenshot fidelity, this can be reversed intentionally.

### Price formatting decision: `$5.70` vs `5.70$`

Recommendation:

- normalize all prices to `$5.70`

Reason:

- current screenshot formatting appears visually inconsistent and locale-unusual
- Lounge Coffee reads as a premium modern brand, and standard leading-currency formatting is cleaner

If the user wants exact screenshot fidelity, price strings can remain literal instead.

### Responsiveness assumptions

- Desktop should follow the PNG closely
- Tablet will require simplification because the exact negative-space balance cannot scale down 1:1
- Mobile will require stacked text lists and reduced icon emphasis
- The section should preserve hierarchy, not exact desktop geometry

### Scope assumption

The existing docs do not yet define a Menu scene as canonical v1 scope, but the user has explicitly requested it. Implementation can proceed as an approved downstream extension without rewriting the hero/freshness architecture.

## 9. Testing Checklist

### Desktop visual comparison

- Compare against the Figma PNG at approximately 1440px width
- Confirm title scale, icon placement, subsection rhythm, and product row spacing
- Confirm the section feels calm and minimal rather than card-heavy

### Tablet layout

- Confirm product rows collapse cleanly to 2 columns
- Confirm `ARABICA` and `COFFEE` remain readable and balanced
- Confirm icon and title do not collide

### Mobile layout

- Confirm title remains dominant
- Confirm product grids stay legible at reduced width
- Confirm text-only lists stack cleanly
- Confirm spacing still feels premium, not cramped

### Image loading

- Confirm every menu image renders from the correct asset path
- Confirm no broken paths
- Confirm transparent PNG/WebP edges read cleanly on the cream background

### Alignment of names and prices

- Confirm image item rows use consistent name-left / price-right alignment
- Confirm text-only list rows align evenly across both columns
- Confirm prices do not jitter due to inconsistent string lengths

### Correct use of assets

- Confirm each image matches the intended menu label
- Confirm the upper-right icon uses `assets/icon/icon-locallyRoasted.webp`
- Confirm no unrelated sticker asset is substituted

### No layout shift

- Confirm product rows do not jump after image load
- Confirm image stage sizing reserves stable space

### No unrelated homepage changes

- Confirm intro, hero, freshness, and bestsellers remain visually unchanged
- Confirm section insertion does not break current page flow or dividers

## Recommended Implementation Summary

When implementation begins, the safest path is:

1. Add a new scene folder for `MenuSection`
2. Keep menu copy/prices in `src/content/menu.js`
3. Keep menu photo imports scene-local unless cross-scene reuse emerges
4. Reuse existing section width, color, font, and spacing tokens
5. Build one reusable subsection-header pattern with orange label + thin rule
6. Build one reusable image-grid item and one reusable text-list item pattern
7. Insert the section after `BestsellersSection`
8. Normalize visible copy to `Pastries` and prices to `$x.xx` unless the user requests literal Figma text
