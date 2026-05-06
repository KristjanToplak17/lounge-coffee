# Bestsellers Section Plan

## Placement

- The current bottom divider is rendered by `FreshnessTransition` as the `.freshness-transition::after` bean separator in [src/scenes/FreshnessTransition/FreshnessTransition.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/FreshnessTransition/FreshnessTransition.css).
- The new **Bestsellers** section should be inserted immediately after `FreshnessTransition` in [src/App.jsx](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/App.jsx).
- The section should visually begin right after the existing bottom divider so the divider becomes the handoff between the current freshness scene and the new product-card scene.

## Files To Change

- `src/App.jsx`
  Add the new scene after `FreshnessTransition`.
- `src/utils/assetMap.js`
  Register the coffee packet assets from `assets/CoffeePackets`.
- `src/styles/tokens.css`
  Add a small set of reusable section/card tokens if needed for spacing, shadows, and packet sizing.
- `src/scenes/BestsellersSection/BestsellersSection.jsx`
  New scene component for section DOM and content structure.
- `src/scenes/BestsellersSection/BestsellersSection.css`
  New scene stylesheet for layout, cards, wordmark background, and responsive behavior.

## Assets To Use

- `assets/CoffeePackets/red-packet.webp`
  Mapped to **Cherry Mocha**
- `assets/CoffeePackets/orange-packet.webp`
  Mapped to **Citrus Burst**
- `assets/CoffeePackets/yellow-packet.webp`
  Mapped to **Honey Oat**

## Desktop Layout

- Use a centered section frame with generous top and bottom padding so the section feels like a new chapter.
- Place the heading and subtitle in a centered intro block above the product cards.
- Add one oversized, low-opacity `BESTSELLERS` word behind the cards only.
- Use a three-card row on desktop.
- Make the center card slightly emphasized through subtle scale, border confidence, or elevated shadow.
- Keep cards evenly aligned with consistent image area heights so the packets feel deliberate rather than floating loosely.

## Tablet Layout

- Preserve the centered heading block.
- Keep the cards in a three-column layout as long as they remain breathable; collapse to a two-row arrangement before the cards become cramped.
- Reduce packet image size and internal card padding slightly before changing the overall section hierarchy.
- Tone down the center-card emphasis if it starts to distort spacing.

## Mobile Layout

- Stack cards in a single column.
- Keep the heading and subtitle centered, with tighter but still premium spacing.
- Shrink the oversized `BESTSELLERS` background word and keep it behind the upper half of the card stack so it stays atmospheric rather than noisy.
- Maintain full-width card buttons and clear price hierarchy.

## Spacing And Hierarchy Notes

- Follow the existing cream-stage, restrained-premium spacing language already used in hero and freshness.
- Heading should be the dominant text element.
- Subtitle should remain short and secondary.
- Product image should lead each card, followed by product name, supporting description, price, and CTA.
- Cards need enough gap between them to avoid a generic ecommerce grid feel.

## Color And Typography Alignment

- Use existing brand tokens:
  - `--color-cream-stage`
  - `--color-brown-espresso`
  - `--color-brown-support`
  - `--color-orange-stage`
  - `--color-orange-stage-hover`
  - `--color-glow`
- Keep the background clean and cream-based.
- Use dark coffee-brown for headings and body copy.
- Use orange for CTA surfaces, subtle featured emphasis, and selective text emphasis only.
- Keep typography aligned to the current grotesk-led system:
  - heading in the stronger display/body pairing already established in the project
  - body/supporting copy in the existing body stack
  - price prominent but not louder than the section title

## Card Structure

- Card shell with rounded corners and a soft tinted shadow.
- Dedicated image stage near the top with consistent packet sizing and alignment.
- Product title
- Short description
- Divider rule
- Price
- CTA button: `Add to Basket`
- Center card may carry a stronger border and shadow, but no extra badge or top pill label.

## Hover And Interaction Plan

- Cards: slight translate/scale lift with a restrained shadow increase.
- Packet image: small upward drift or scale increase on card hover.
- CTA:
  - orange fill by default for the featured card
  - bordered cream/orange treatment for the side cards if it helps hierarchy
  - active press scale should match the existing hero CTA feel
- Motion should stay subtle and premium. No bounce, no looping decoration, no busy scroll tricks.

## Risks And Assumptions

- This section intentionally expands beyond the original v1 scene scope because the user explicitly requested it.
- Asset filenames do not encode product names, so the implementation will assume:
  - red = Cherry Mocha
  - orange = Citrus Burst
  - yellow = Honey Oat
- No reusable card component exists yet, so the section will likely be scene-local for now to avoid speculative abstraction.
- The current bottom divider belongs to the freshness section, so visual spacing must ensure the new section starts cleanly without modifying unrelated hero structure.

## Testing Checklist

- Verify the section renders directly after the current freshness divider.
- Verify the section background remains coherent with the existing cream stage.
- Verify the `BESTSELLERS` background word stays low-opacity and never competes with the products.
- Verify all three packet images are aligned consistently across cards.
- Verify the center card emphasis remains tasteful on desktop and relaxes appropriately on smaller screens.
- Verify the cards stack cleanly on mobile without overflow.
- Verify CTA focus, hover, and active states remain legible and consistent.
- Run `npm run build`.
