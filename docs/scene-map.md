# Scene Map

## Canonical Naming

`Locked`:

- **Intro Sequence** = Loader Stage + Reveal Transition
- **Hero Composition** = main product landing scene
- **Freshness Transition** = pinned cup handoff into the first freshness panel
- **Bestsellers Section** = follow-up product-card showcase after the freshness panel when explicitly requested

Use these names consistently in code and documentation.

`Locked`: **Reveal Transition** is an internal phase within the Intro Sequence, not a standalone scene boundary or separate route/component mount.

## Story Arc By Scene

### Intro Sequence

What the visitor should feel:

- anticipation
- focus
- tension before reveal

What the visitor should understand:

- this is a premium, art-directed coffee experience
- the bean is the opening hero symbol of freshness and craft

What appears:

- full-screen burnt-orange stage
- small white logo near the top
- centered coffee bean
- minimal thin loading line beneath the bean
- subtle leaf shadow, gradient, and atmospheric lighting

## Reveal Transition (Within Intro Sequence)

What the visitor should feel:

- transformation
- release
- visual payoff

What the visitor should understand:

- the intro was leading into the product world
- the product experience is being revealed through the bean split

What appears:

- organic cream vertical opening
- bean split into left and right halves
- restrained bean fragments
- slight scene scale-up
- hero scene becoming visible behind the opening

## Hero Composition

What the visitor should feel:

- desire
- variety
- product confidence

What the visitor should understand:

- Lounge Coffee offers a premium multi-variant takeaway line
- the cups are the core visual product system

What appears:

- cream background
- dark logo and light navigation chrome
- floating cup composition with cropped and centered cups
- short premium headline
- one CTA
- optional small supporting metric row
- delayed sticker accents

`Locked`:

- hero should feel closer to a poster or product campaign than a typical marketing layout
- nav is lightweight brand chrome, not the main focus

## Freshness Transition

What the visitor should feel:

- continuity
- confidence
- proof of craft

What the visitor should understand:

- the featured product remains central while the story deepens
- the page is moving from desire into freshness and craft credibility

What appears:

- the orange cup remains pinned
- the hero composition scrolls away
- the first freshness panel appears behind and around the pinned cup
- oversized freshness-focused typography
- supporting copy about freshness, aroma, and craft

`Locked`:

- v1 includes the opening freshness panel
- the pinned orange cup settles toward center-left
- the first freshness panel is about freshness and craft, not origin geography or ecommerce details

## Bestsellers Section

What the visitor should feel:

- appetite
- confidence
- product clarity

What the visitor should understand:

- Lounge Coffee can extend from expressive cups into packaged favorites without breaking the premium brand tone
- the section is a clean product showcase, not a busy ecommerce catalog

What appears:

- cream background
- large low-opacity `BESTSELLERS` word behind the product row
- three rounded product cards
- coffee packet renders for Cherry Mocha, Citrus Burst, and Honey Oat
- concise supporting descriptions
- visible pricing
- one CTA per card

`Preferred`:

- the center product may receive subtle emphasis
- cards should feel spacious, warm, and premium rather than transactional
