# Secret Sauce Section Refinement Plan

## Purpose

This document captures the next refinement pass for the first freshness panel currently implemented in `FreshnessTransition`.

It is a planning and audit artifact only.

It does not authorize implementation by itself.

## Scope

This refinement pass is limited to:

- global scroll feel
- hero-to-section spacing and continuity
- black cup travel timing and landing behavior
- Secret Sauce composition polish
- line-breaking, alignment, and spacing accuracy
- small taste-level motion refinements where they support the section

It must not expand the page beyond the existing hero and first freshness panel.

## Source Of Truth

The following inputs should be treated as authoritative for this refinement pass:

- `docs/scene-map.md`
- `docs/motion-system.md`
- `docs/design-system.md`
- current production implementation in `src/scenes/FreshnessTransition/`
- provided visual reference `C:/Users/Kristjan/Downloads/Section-1.png`

This refinement pass supersedes earlier section assumptions where needed, especially for:

- final cup rotation
- line composition and centering
- section spacing
- transition pacing

## Lead Review Corrections

The previous refinement plan was directionally good, but it still had a few unsafe assumptions. This version corrects them.

### Correction 1. Canonical doc conflict must be acknowledged

The current canonical docs still describe the freshness transition as an orange-cup-centered handoff.

The live implemented direction for this section is black-cup-centered.

For this refinement pass:

- implementation should follow the current approved live direction
- the black cup is the motion truth for this section
- canonical docs must be reconciled later so future agents are not split between orange-cup and black-cup definitions

### Correction 2. Smooth scroll is a staged decision, not an automatic yes

The previous plan leaned too hard toward “add smooth scroll globally.”

That is directionally likely, but not guaranteed.

If a JS smooth-scroll layer introduces jitter, accessibility regression, focus issues, or fixed-overlay drift, it should be rejected for this pass and the refinement should continue with native scroll plus improved trigger tuning.

### Correction 3. `128px` spacing must be measurable

The spacing request cannot be implemented as vague “more room.”

It needs a measurement contract so design QA and engineering are testing the same thing.

### Correction 4. The 3-line system must be strict where it matters and flexible where it must be

Desktop must be locked to the 3-line poster composition.

Tablet should remain 3 lines if at all possible.

Mobile should preserve the poster feeling, but not at the expense of readability or stability.

### Correction 5. Cup landing must be defined by geometry, not just feeling

The previous plan correctly described the desired feeling, but the next implementation pass also needs explicit landing geometry:

- final center point
- final rendered width
- final angle
- overlap window between overlay and settled cup

### Correction 6. Motion language must be precise

Words like “longer,” “softer,” and “smoother” are useful, but not sufficient on their own.

The implementation pass must tune against real browser behavior until the motion no longer reads as stepping, jumping, or early settling.

## Current Audit

### What is working

- The page now supports natural scrolling below the hero.
- The first freshness panel exists inside the canonical `FreshnessTransition` scene slot.
- A dedicated floating overlay cup is already in place, which is still the right foundation for premium travel.
- The section already uses the correct core visual ingredients:
  - cream stage
  - orange jumbo type
  - coffee and croissant pills
  - coffee-pot sticker
  - black cup overlay handoff

### What currently feels off

1. Scroll smoothing is still browser-default, so the transition feels abrupt on desktop hardware.
2. The handoff from hero to section is too compressed, so the black cup appears to jump rather than travel.
3. The cup settles too early relative to the viewport, so it does not feel like it arrives when the section is truly centered.
4. The section top and hero bottom do not yet read as one continuous cream field.
5. The current statement composition is over-fragmented at non-desktop breakpoints and can collapse into too many rows.
6. The line system is not yet locked to equal row heights, which weakens the poster feel.
7. The current settled cup angle does not yet match the new refinement target.

## Requested Refinements Matrix

| Request | Current behavior | Required refinement |
| --- | --- | --- |
| Smooth scroll | Native scroll only | Evaluate and likely add premium smooth-scroll globally, but only if `ScrollTrigger`, accessibility, and fixed-overlay stability remain solid |
| `128px` hero-to-section spacing | Not explicitly locked | Make the visual gap between the hero endpoint and the section label row exactly `128px` |
| No visible background seam | A section boundary can still read as a line | Blend hero and section backgrounds so the handoff reads as one continuous surface |
| Longer black cup travel | Scroll span is too short | Extend trigger distance and soften scrub behavior so the cup visibly travels |
| Cup lands only when section is centered | The settle happens too soon | Align the final handoff to the section-centered viewport moment |
| Three centered lines, not four | Current layouts split too aggressively | Lock desktop and tablet composition to 3 lines, center-aligned |
| Equal row height rhythm | Current line boxes are not normalized | Make all three statement rows share the same authored height on desktop and tablet, with a simplified but still deliberate rule on mobile |
| Final cup angle `-9deg` | Current settled state is effectively upright | End the transition at `-9deg` and ensure the travel interpolates from the hero angle |

## Root-Cause Analysis

### 1. Smooth scroll is not yet a motion system, only default browser scroll

Current code uses standard document scrolling with `ScrollTrigger` scrubbing.

That is technically valid, but it does not add the inertial, premium glide needed for a hero-to-poster handoff. The result is that the cup movement exposes wheel-step jitter instead of feeling editorial.

It is also true that this section may be substantially improved without a smooth-scroll library if trigger distance, scrub tuning, and landing timing are corrected. The plan must not pretend the library itself is the whole fix.

### 2. The transition window is too short

`src/animations/freshnessTransitionScroll.js` currently uses:

- `start: "top 85%"`
- `end: "top 35%"`
- `scrub: 0.85`

That gives the cup too little vertical travel distance. The current section begins animating late and completes too quickly, which makes the overlay read like a reposition instead of a journey.

### 3. The settled cup target is visually correct in concept but mistimed in practice

The settled cup anchor exists, but the current scroll mapping is keyed more to section entry than to the centered poster moment.

The cup needs to complete only when the section itself feels established in the viewport, not when the user has merely brushed into the panel.

### 4. The section composition is using breakpoint-specific alternate layouts instead of one authored 3-line system

`FreshnessTransition.jsx` currently has:

- one desktop statement
- one tablet statement
- one mobile statement

The tablet and mobile variants currently break the message into 4 to 6 rows. That is structurally safe but visually drifts from the provided source image and weakens the poster lockup.

### 5. Line geometry is based on content flow, not authored row boxes

The pills and text currently align with flex rows and ad hoc margins. That makes the section functional, but not yet pixel-authored. The target look needs fixed row-height logic so the three lines behave like a poster grid.

### 6. Background continuity is not yet intentionally bridged

The hero and section are compatible in palette, but the handoff still depends on separate surfaces and atmospheres. The transition needs a shared continuity treatment so no horizontal seam reads between scenes.

### 7. The final angle target changed

The original implementation targeted a straightened settled state. The current refinement target is now `-9deg`, so the motion spec needs to be updated accordingly and carried through both the overlay cup and the settled cup handoff.

## Refinement Decisions

## 1. Smooth Scroll Recommendation

### Recommendation

Use a staged recommendation:

- first-choice implementation direction: a JS smooth-scroll system
- fallback if integration quality is not high enough on first pass: keep native scroll and improve only trigger distance, scrub, and landing timing

The section should not ship with a smooth-scroll library if it introduces jitter, accessibility regression, or conflicts with the fixed cup overlay.

### Why CSS `scroll-behavior: smooth` is not enough

`scroll-behavior: smooth` only affects programmatic anchor-style scroll changes. It does not smooth manual wheel or trackpad scrolling, so it will not improve the cup handoff in the way this section needs.

### Recommended implementation direction

Use a lightweight smooth-scroll library with proven `GSAP ScrollTrigger` interoperability.

Preferred direction:

- `Lenis` or an equivalent modern inertial scroll layer
- `ScrollTrigger.update()` integration
- one shared root scroller strategy

### Guardrails

- Do not enable smooth scroll under reduced motion.
- Do not double-smooth both native browser behavior and a JS scroller.
- Do not wire the section against one scroller model and the rest of the app against another.
- Verify sticky/fixed hero overlay math after integration.
- Verify keyboard, anchor, and focus behavior after integration.
- If smooth scroll causes desync between the hero cup source rect and the overlay cup path, revert to native scroll for this pass.

### Taste note

The goal is not ornamental floatiness.

The goal is to remove harshness and reveal spatial continuity. The scroll feel should be quieter and more intentional, not syrupy or over-designed.

## 2. Hero-To-Section Spacing

### Locked target

The visual distance between the hero poster endpoint and the Secret Sauce label row must be `128px`.

### Interpretation

This is not just section padding.

It is the authored visual handoff distance from the end of the hero composition to the start of the first readable Secret Sauce content.

### Measurement contract

For implementation and QA, measure this as:

- from the lowest intentional visual edge of the settled hero poster field
- to the baseline zone of the Secret Sauce label row

If the hero composition has atmospheric spill or cup cropping below that line, do not measure from the absolute bottom-most glow pixel. Measure from the intentional poster endpoint.

### Likely implementation area

- `src/App.jsx`
- `src/scenes/FreshnessTransition/FreshnessTransition.css`
- possibly one supporting token in `src/styles/tokens.css`

### Guardrail

Do not create this spacing by introducing an obviously empty strip.

It should feel like the hero breathes out and the next poster starts, not like two sections were separated with a spacer utility.

## 3. Background Continuity

### Goal

There should be no visible horizontal line where the hero ends and the first freshness panel begins.

### Required treatment

- hero and section need to share the same base cream field
- any section-top haze or gradient must softly overlap the boundary
- if the hero shell itself creates the seam, its lower surface treatment must be blended into the first section

### Likely causes to inspect during implementation

- `heroShell` and `FreshnessTransition` background ownership
- top-edge gradients in the section
- any border, box-shadow, or contrast shift created by layout wrappers
- accumulated anti-aliasing from overlapping atmospheric layers

### Acceptance test

At `1440x900`, the eye should not catch a horizontal rule or card edge when easing from hero into the section.

This must also hold during motion, not just in a static screenshot. A seam that appears only while scrolling still counts as a failure.

## 4. Black Cup Travel Timing

### Current problem

The cup travel reads as rushed because the section's scroll window is too small and the handoff completes before the scene fully establishes itself.

### Refinement target

The cup should begin from the live hero black cup position and travel through a visibly longer editorial arc before settling.

### Required motion changes

- extend the `ScrollTrigger` start/end distance
- consider earlier start so travel begins before the section dominates
- extend the end so the settle happens around the section-centered moment
- soften the scrub response slightly so the path feels less reactive

### Proposed motion direction

Initial working target for the next implementation pass:

- start near when the top of `FreshnessTransition` reaches about `92%` to `95%` of the viewport
- end near when the section reaches its centered composition moment, likely around `top 18%` to `top 12%`
- test a longer effective travel distance before finalizing

These are not final values. The next pass should tune against the live browser until the movement reads as continuous and premium.

### Motion-design correction

The plan should not rely on timing adjectives alone such as “longer” or “softer.”

The real success criteria are:

- the cup path remains continuously readable with normal trackpad flicks
- the cup does not appear to pause and then jump
- the landing moment feels synchronized with scene establishment
- the path feels authored even when the user scrolls in small wheel increments

## 5. Cup Landing Moment

### Locked target

The black cup must finish its travel only when the Secret Sauce composition is visually centered in the screen.

### Meaning

The final handoff cannot happen early just because the target rect was reached mathematically.

The viewer should feel the cup arrive as the section arrives.

### Required behavior

- overlay cup remains the main actor until the centered poster moment
- settled static cup fades in only in the last segment of the travel
- hero cup visibility must remain hidden only during the legitimate overlap period

### Handoff rule

The handoff between overlay cup and settled cup should happen very late, ideally within the last `6%` to `10%` of transition progress.

### Engineering correction

The landing should be governed by a target-anchor contract, not by freehand visual tuning alone.

The next implementation pass should define:

- the settled cup center point
- the settled cup rendered width
- the settled cup final angle
- the progress band where overlay and settled cup overlap

Without those, the handoff is too subjective and will drift during responsive adjustments.

## 6. Type Composition And Line Breaking

### Locked desktop composition

The message must resolve into exactly 3 centered lines:

1. `CRAFTED WITH` + coffee pill
2. `FRESH BEANS AND FRESHLY`
3. croissant pill + `BAKED DELIGHTS`

### Refinement rules

- the desktop and tablet statement should keep this 3-line authored structure
- center the text composition as a whole
- if needed, reduce type minimally rather than introducing a fourth line
- maintain the reference feeling over pure fluid convenience

### Current implementation issue

The existing tablet and mobile variants were designed defensively for fit, but that defensive layout breaks the poster composition.

### Responsive priority order

1. preserve the poster feeling
2. preserve readability
3. preserve 3-line exactness where feasible

### Preferred responsive rule

- desktop: 3-line poster lockup
- tablet: still 3 lines, modest type reduction
- mobile: allowed to simplify more aggressively, but should still aim for grouped poster logic rather than scattered rows

This means desktop is locked, tablet is strongly preferred, and mobile is not required to mimic desktop at all costs if readability or overlap stability suffers.

## 7. Equal Row Height System

### Goal

All 3 statement rows must occupy the same authored height so the vertical rhythm is mathematically and visually even.

### Required layout model

Each row should be treated like a row box, not just content flowing with ad hoc margins.

### Recommended direction

- introduce a shared statement row height token per breakpoint
- align text and pill content within those row boxes
- normalize vertical centering
- define one consistent gap between row boxes

### Front-end correction

Equal visual row height does not necessarily mean identical natural content height.

The safer implementation direction is:

- one explicit row-box height token
- one explicit inner alignment rule
- one explicit pill vertical offset rule

That avoids endless manual nudging inside individual rows.

### Acceptance bar

The eye should read the section as a deliberate 3-row lockup, not as three unrelated flex lines with different visual weight.

## 8. Cup Rotation Refinement

### New target

The black cup should end at `-9deg`.

### Motion interpretation

The rotation should not feel like a last-second snap. It should be part of the travel.

### Required behavior

- sample the hero cup's live angle as the start state
- interpolate smoothly through travel
- land at `-9deg`
- ensure the settled static cup matches the overlay cup exactly at handoff

### Guardrail

Do not rotate only the image while another wrapper owns translation and scale in a conflicting way. Rotation ownership should be clear so the cup does not wobble or drift off its tracked target.

## Composition Targets By Breakpoint

## Desktop `1440x900`

- hero-to-section visual spacing: `128px`
- label row aligned to stage width edges
- statement remains 3 lines
- statement centered as a poster field
- jumbo type should stay close to `96px`, but may reduce slightly if needed to prevent line breaks
- pills should remain visually embedded, not dropped below the baseline
- cup lands near section center
- final cup angle: `-9deg`
- settled cup width and center point should be explicitly measured and preserved during QA screenshots

## Tablet `1024x800`

- preserve the same 3-line composition
- reduce type slightly before changing line count
- keep pills large enough to read as part of the line architecture
- maintain equal row heights
- allow slightly tighter horizontal pill/text spacing before forcing a 4-line composition
- if the composition still breaks, reduce type before reducing pill identity

## Mobile `390x844`

- mobile may simplify, but should still feel authored
- if a true 3-line lockup is impossible at safe readability, preserve grouped rhythm rather than many small broken lines
- cup travel may be shorter than desktop, but still must not read as teleporting
- maintain no visible scene seam
- do not force desktop poster behavior on mobile if it creates cramped type or unstable cup overlap

## Taste Refinements To Consider

These are optional unless they measurably improve the section.

| Before | After | Why |
| --- | --- | --- |
| Cup motion purely follows scroll progress | Cup motion uses a slightly more cushioned scrub feel and longer path | Longer, calmer travel improves perceived continuity |
| Sticker is only a placed asset | Sticker gets a tiny authored settle or fade discipline if needed | Small accents should feel intentional, never randomly dropped |
| Statement lines rely on natural content height | Statement lines use equal authored row boxes | Invisible geometry is what makes the lockup feel premium |
| Background transition is just two adjacent cream sections | Boundary gets a shared atmospheric blend | Users feel continuity even if they never consciously identify the cause |
| Cup lands and swaps too early | Overlay-to-static handoff happens at the last moment | Late handoff preserves the illusion of one traveling object |

Guardrail:

Do not add decorative motion just because the section can support it. If a micro-animation does not improve clarity, continuity, or tactility, skip it.

## Files Likely Touched In The Next Implementation Pass

- `src/App.jsx`
- `src/scenes/FreshnessTransition/FreshnessTransition.jsx`
- `src/scenes/FreshnessTransition/FreshnessTransition.css`
- `src/animations/freshnessTransitionScroll.js`
- `src/styles/tokens.css`
- `src/styles/globals.css`
- optional:
  - a new smooth-scroll integration file in `src/utils/` or `src/animations/`

## Files That Must Not Be Changed Casually

- `src/scenes/BakedIntroReveal/`
- loader timing internals
- hero end-state composition rules that define the existing poster
- asset files unless an explicit asset problem is found

## Additional Documentation Follow-Up

If implementation proceeds with the black-cup-centered Secret Sauce direction, the following docs should be reconciled in the same broader documentation pass:

- `docs/scene-map.md`
- `docs/motion-system.md`

Reason:

Both still describe a freshness transition centered around the orange cup, which no longer matches the implemented direction or this refinement plan.

## Implementation Order Recommendation

### Phase 1. Motion foundation

- choose and validate the smooth-scroll approach
- verify reduced-motion fallback
- confirm `ScrollTrigger` remains stable
- if validation fails, keep native scroll and continue the rest of the refinement pass

### Phase 2. Scene continuity

- lock the `128px` hero-to-section spacing
- remove the visible background seam
- verify no horizontal overflow

### Phase 3. Cup travel polish

- lengthen the travel window
- retune landing timing
- update final angle to `-9deg`
- late-stage handoff to settled cup

### Phase 4. Composition lock

- replace fragmented breakpoint variants with a stricter 3-line authored system where possible
- normalize row heights and vertical spacing
- align pills and sticker to the reference composition

### Phase 5. Cross-device taste pass

- desktop visual review
- tablet review
- mobile review
- tune only the minimum needed per breakpoint

## Verification Checklist For The Next Pass

- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run verify`
- loader still works
- hero reveal still works
- hero final layout is unchanged
- page scroll feels premium, not floaty, laggy, or over-damped
- hero-to-section spacing reads as `128px`
- no visible seam between hero and section
- cup movement no longer feels rushed
- cup lands only when the section is visually centered
- final cup angle is `-9deg`
- desktop statement is 3 lines
- tablet statement remains 3 lines
- row heights are visually equal on desktop and tablet
- no horizontal overflow
- reduced motion remains safe
- if smooth scroll is added, keyboard and focus behavior still work correctly

## Implementation Prompt Placeholder

Future implementation prompt will be written after this refinement plan is reviewed and approved.
