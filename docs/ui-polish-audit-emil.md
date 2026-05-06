# UI Polish Audit

This audit applies the `emil-design-eng` lens to the current Lounge Coffee implementation.

The goal is not to redesign the product. The goal is to identify the invisible details that, if fixed, would make the experience feel more authored, more premium, and more obviously intentional.

## Highest Leverage

| Before | After | Why | Priority | Where |
| --- | --- | --- | --- | --- |
| Reduced motion currently nukes all transitions globally to `0.01ms` | Replace the blanket rule with scene-aware reduced-motion behavior that keeps opacity transitions and removes only large movement | Reduced motion should feel calm, not broken. Killing every transition makes the site feel abrupt and brittle | High | [src/styles/motion.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/styles/motion.css) |
| Freshness and Bestsellers both rely on large hardcoded vertical spacing values | Move section spacing to a shared set of vertical rhythm tokens, then tune each scene from those tokens | The page currently feels tuned scene-by-scene instead of composed as one editorial sequence | High | [src/styles/tokens.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/styles/tokens.css), [src/scenes/FreshnessTransition/FreshnessTransition.jsx](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/FreshnessTransition/FreshnessTransition.jsx), [src/scenes/BestsellersSection/BestsellersSection.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/BestsellersSection/BestsellersSection.css) |
| Scene styling is split between CSS files and large inline style objects | Move stable visual/layout values from inline objects into CSS custom properties and scene CSS | Inline style-heavy scenes are harder to tune visually because spacing, shadows, and alignment are not inspectable in one place | High | [src/scenes/FreshnessTransition/FreshnessTransition.jsx](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/FreshnessTransition/FreshnessTransition.jsx) |
| Several hover states exist outside `@media (hover: hover) and (pointer: fine)` | Gate all purely decorative hover states behind fine-pointer media queries | This avoids sticky hover artifacts on touch devices and makes interactions feel more correct on mobile | High | [src/scenes/HeroComposition/HeroComposition.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/HeroComposition/HeroComposition.css), [src/scenes/BestsellersSection/BestsellersSection.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/BestsellersSection/BestsellersSection.css) |

## Motion

| Before | After | Why | Priority | Where |
| --- | --- | --- | --- | --- |
| Hero reveal shadows animate from `scale: 0.7` | Start shadows closer to final size, around `0.9` to `0.95`, and rely more on opacity than scale | Nothing in the real world appears from an obviously undersized state. The current shadow reveal is more “animation” than “presence” | Medium | [src/animations/heroCompositionTimeline.js](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/animations/heroCompositionTimeline.js) |
| Hero nav underline uses `400ms` reveal timing | Tighten underline reveal closer to `180–240ms` and make exit slightly faster than enter | Navigation is high-frequency UI. It should feel immediate, not theatrical | Medium | [src/scenes/HeroComposition/HeroComposition.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/HeroComposition/HeroComposition.css) |
| Hero CTA shadow grows aggressively on hover | Reduce shadow spread and let the color shift carry more of the interaction | The current shadow change is slightly louder than the brand tone needs | Medium | [src/scenes/HeroComposition/HeroComposition.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/HeroComposition/HeroComposition.css) |
| Bestsellers cards animate product scale on hover and add shadow at the same time | Choose one primary hover cue per card, preferably border/shadow only, with packet scale tuned to near-imperceptible or removed | Emil’s lens favors fewer simultaneous signals. One clean signal feels more expensive than two competing ones | Medium | [src/scenes/BestsellersSection/BestsellersSection.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/BestsellersSection/BestsellersSection.css) |
| Freshness inline pill images are permanently shifted with `translateY(6px)` | Replace the hardcoded optical nudge with breakpoint-specific baseline tuning or line-height adjustments | Constant manual translation is fragile and usually means the text/image baseline system is not yet doing the real work | Medium | [src/scenes/FreshnessTransition/FreshnessTransition.jsx](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/FreshnessTransition/FreshnessTransition.jsx) |
| The intro uses a nice authored motion system, but the hero reveal lands almost all at once | Add a micro stagger of `40–70ms` inside the already-approved synchronized reveal so the hero resolves like a composition, not a batch | Tiny sequencing differences are the kind of invisible polish users feel without consciously noticing | Medium | [src/animations/heroCompositionTimeline.js](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/animations/heroCompositionTimeline.js) |

## Hero Composition

| Before | After | Why | Priority | Where |
| --- | --- | --- | --- | --- |
| Hero header chrome border is very literal | Soften the border and let the glass layer separate itself more through contrast and blur than a visible line | Premium chrome usually whispers. The current line is readable but slightly literal | Medium | [src/scenes/HeroComposition/HeroComposition.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/HeroComposition/HeroComposition.css) |
| Utility buttons have hover color shifts but no `:active` press response | Add the same subtle press-scale language used on the main CTA | Every pressable element should confirm touch. Right now the utilities feel lighter than the CTA in tactile quality | Medium | [src/scenes/HeroComposition/HeroComposition.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/HeroComposition/HeroComposition.css) |
| Headline block is compositionally strong, but copy island spacing is manually offset per breakpoint | Normalize the copy block positioning with a smaller set of breakpoint rules and more tokenized inset values | Too many bespoke offsets make visual tuning slower and usually indicate the composition isn’t yet controlled by a clean system | Medium | [src/scenes/HeroComposition/HeroComposition.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/HeroComposition/HeroComposition.css) |
| Header hover interactions still work on touch because hover styles are not globally pointer-gated | Move all purely decorative hover affordances under pointer-aware media queries | This is the kind of invisible correctness that makes mobile feel more polished | High | [src/scenes/HeroComposition/HeroComposition.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/HeroComposition/HeroComposition.css) |

## Freshness Transition

| Before | After | Why | Priority | Where |
| --- | --- | --- | --- | --- |
| Freshness scene layout is driven by a very large JS style object | Move stable visual rules into CSS classes or CSS variables and leave JS for dynamic values only | It is currently harder than it should be to visually audit spacing, typography, and atmosphere for this scene | High | [src/scenes/FreshnessTransition/FreshnessTransition.jsx](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/FreshnessTransition/FreshnessTransition.jsx) |
| Top and bottom bean separators are positioned with large magic-number offsets | Anchor the lower separator to the actual visual floor of the composition instead of section-size clamps | The current divider placement works by tuning, but it is fragile if copy, cup scale, or section height changes again | High | [src/scenes/FreshnessTransition/FreshnessTransition.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/FreshnessTransition/FreshnessTransition.css) |
| The tag pill above the freshness message is visually heavier than the motion system around it | Reduce border contrast and blur weight slightly, or make the pill a touch more matte | Right now it reads more “component” than “quiet label” | Medium | [src/scenes/FreshnessTransition/FreshnessTransition.jsx](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/FreshnessTransition/FreshnessTransition.jsx) |
| Cup landing region uses hardcoded absolute placement | Introduce tokenized landing coordinates by breakpoint | This would make future adjustments to the handoff much more controlled and less trial-and-error | Medium | [src/scenes/FreshnessTransition/FreshnessTransition.jsx](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/FreshnessTransition/FreshnessTransition.jsx) |
| Supporting sticker persists as a strong accent near a highly typographic section | Re-evaluate whether the sticker is helping hierarchy or just adding one more voice | Under Emil’s philosophy, removing one marginal accent often improves the whole composition | Medium | [src/scenes/FreshnessTransition/FreshnessTransition.jsx](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/FreshnessTransition/FreshnessTransition.jsx) |

## Bestsellers Section

| Before | After | Why | Priority | Where |
| --- | --- | --- | --- | --- |
| Background wordmark is strong, but still tuned as an isolated object | Tie its vertical placement to the subtitle/cards relationship with a named offset token | This keeps the section editable without reintroducing guesswork every time spacing changes | High | [src/scenes/BestsellersSection/BestsellersSection.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/BestsellersSection/BestsellersSection.css) |
| Card hover still uses both border/shadow and packet movement | Reduce packet movement further or remove it entirely and rely on card treatment only | The section gets more premium as it becomes quieter | Medium | [src/scenes/BestsellersSection/BestsellersSection.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/BestsellersSection/BestsellersSection.css) |
| Price and CTA now share a row, but the button and price still feel like separate blocks rather than a single decision strip | Align their baseline more deliberately and tune widths so the row feels like one composed unit | This is one of those subtle details that changes whether the footer feels “placed” or “designed” | High | [src/scenes/BestsellersSection/BestsellersSection.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/BestsellersSection/BestsellersSection.css) |
| Product descriptions and names are well-sized, but line-length behavior is still mostly width-driven | Add explicit max-width tuning per card type so all three descriptions wrap with similar rhythm | Consistent wrapping is invisible polish that makes the shelf feel more authored | Medium | [src/scenes/BestsellersSection/BestsellersSection.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/BestsellersSection/BestsellersSection.css) |
| Product-tinted grain is a good direction, but currently baked into card pseudo-elements | Convert grain intensity and tint to card-specific CSS variables | This makes future tuning much easier and preserves the design system feel | Medium | [src/scenes/BestsellersSection/BestsellersSection.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/BestsellersSection/BestsellersSection.css) |
| Featured badge is cleaner now, but still behaves like a generic badge | Tune internal spacing and border contrast so it feels more like printed packaging metadata than UI chrome | The more it feels “part of the object” instead of “part of the website”, the more premium it becomes | Medium | [src/scenes/BestsellersSection/BestsellersSection.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/BestsellersSection/BestsellersSection.css) |

## Accessibility And Device Correctness

| Before | After | Why | Priority | Where |
| --- | --- | --- | --- | --- |
| Global reduced-motion rule collapses all transitions to almost zero duration | Preserve small opacity/color transitions under reduced motion and remove only spatial transforms | Accessibility should preserve comprehension, not just delete movement | High | [src/styles/motion.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/styles/motion.css) |
| Some decorative hover states are still active without pointer gating | Gate all hover-only effects with pointer-aware media queries | Touch users should not inherit desktop hover assumptions | High | [src/scenes/HeroComposition/HeroComposition.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/HeroComposition/HeroComposition.css) |
| Scene buttons rely on color, border, and scale changes, but keyboard focus styling is not yet visually unified across the whole site | Create a shared focus-visible treatment token and use it consistently across all scenes | A premium site should feel like one system for keyboard users too | Medium | [src/scenes/HeroComposition/HeroComposition.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/BestsellersSection/BestsellersSection.css) |

## Performance And Maintainability

| Before | After | Why | Priority | Where |
| --- | --- | --- | --- | --- |
| Many layout-critical values live in JSX objects rather than CSS variables | Push stable spacing, sizing, and atmosphere values into CSS tokens | Better visual tuning, easier maintenance, cleaner devtools workflow | High | [src/scenes/FreshnessTransition/FreshnessTransition.jsx](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/scenes/FreshnessTransition/FreshnessTransition.jsx) |
| Some scenes are tuned with many one-off clamps and offsets | Consolidate repeated clamps into semantic tokens like section inset, chapter gap, product stage width, badge inset | A premium system feels custom, but it should still be legible to future maintainers | Medium | [src/styles/tokens.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/styles/tokens.css) |
| The same design language is being restated separately in each scene | Introduce a tiny shared “surface language” token set for cream panels, matte borders, grain overlays, and quiet shadows | This raises consistency without forcing abstraction too early | Medium | [src/styles/tokens.css](C:/Users/Kristjan/Desktop/Kris/vibeCoding/coffeeShop/src/styles/tokens.css) |

## Suggested Order

| Before | After | Why | Priority | Where |
| --- | --- | --- | --- | --- |
| Polishing happens ad hoc by section | Tackle the next pass in this order: 1. reduced motion and hover gating, 2. freshness layout tokenization, 3. hero utility/hover polish, 4. bestsellers footer and grain refinement | This order improves invisible correctness first, then visual cohesion, then section-specific finesse | High | Whole app |
