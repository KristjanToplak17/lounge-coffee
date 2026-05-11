# Emil Design Engineering Frontend Audit

Audit scope: live default route in `App.jsx` (Intro → Hero → Freshness Transition → Bestsellers → Menu). `/test` and `TestRevealExperiment` are excluded. Code was read as implementation truth; canonical motion intent cross-checked against `motion-system.md`, `scene-map.md`, `loader-polish-spec.md`, and `AGENTS.md`.

---

## Executive Summary

The experience already reads as **premium and motion-first** at the top of the funnel: a theatrical loader, a synchronized loader-to-hero handoff, a GSAP hero poster reveal with strong easing tokens, and a scroll-scrubbed cup continuity beat into the freshness panel. Custom easing (`--ease-strong-out`, loader `EASE` curves) and **pointer-gated hover** on key hero controls align well with intentional interaction taste.

The largest **perceived-quality gap** is not visual style but **rhythm asymmetry**: the opening arc is heavily authored, while **Bestsellers** and especially **Menu** behave more like high-quality static editorial layouts—minimal scroll-linked storytelling, no press feedback on many interactive surfaces, and no coordinated “scene handoff” after the freshness transition. Secondary polish opportunities sit at **binary opacity thresholds** in the cup handoff, **hero reveal choreography** (simultaneous vs. hierarchy), and **documentation drift** (loader timing in code vs. `motion-system.md`), which can subtly undermine the feeling of a single authored system.

Micro-motion recommendations below favor **clarity, hierarchy, and continuity** over decoration; several items explicitly recommend **no** added motion.

---

## Overall Experience Assessment

**Current impression:** A confident, art-directed single page where the first ~two viewports feel like a designed product film, then the page transitions into a calmer, catalog-like read.

**What feels strong**

- **Global motion philosophy** matches the docs: intro is time-based, freshness is scroll-based, hero reveal is locked to loader `midToEnd` via `onHeroRevealStart` and `heroCompositionTimeline`.
- **Easing discipline** on interactive UI: hero nav, utilities, and CTA use explicit properties and `var(--ease-strong-out)` rather than generic defaults.
- **Touch-safe hover**: hero hovers are gated behind `@media (hover: hover) and (pointer: fine)`.
- **Reduced motion path**: `usePrefersReducedMotion` gates Lenis, simplifies loader timing, and `motion.css` narrows transition properties for cards/buttons/images—thoughtful aggregate detail.
- **Lenis + ScrollTrigger** (desktop-wide) improves scrub continuity for the freshness transition; native scroll on smaller breakpoints avoids rubber-band fights.

**What feels uneven**

- **Energy curve**: peak authored motion in intro/hero/freshness, then a noticeable drop to “static excellence” in lower sections.
- **Interaction parity**: hero CTA and utilities have `:active` scale; nav links and large lower-page surfaces mostly do not.
- **Scroll narrative**: after the cup handoff, scrolling is primarily layout translation with little **progressive disclosure** of typography or cards.

**Priority themes**

1. **P0 — Perceived continuity**: soften binary handoff edges (cup opacity thresholds), validate loader “film” against `loader-polish-spec.md` (already tracked as under-tuned).
2. **P1 — Lower-page polish**: selective scroll reveals + press states where the UI invites interaction (Bestsellers cards already strong on hover; buttons/menu need parity).
3. **P2 — Hero micro-hierarchy**: optional stagger within existing hero timeline constraints (must not violate locked loader sync).

---

## Loader Review

**Implementation touchpoints:** `BakedIntroReveal.jsx`, `useBakedIntroAnimation.js`, `bakedIntroShared.js` (`LOADER_TIMING`, `EASE`, geometry), `BakedIntroReveal.css`.

### Current impression

Held, theatrical, physically motivated lateral separation with fragments and shadow—structurally aligned with the scene map. Cadence feels **long-form cinematic** (e.g. `midToEnd: 2.6` seconds in code) rather than snappy UI—which is appropriate for a rare first impression **if** each frozen frame reads as composed.

### What feels strong

- **Custom cubic-bezier curves** for loader fades and split phases (`EASE.loaderFade`, `startToMid`, `midToEnd`) avoid weak browser defaults; directionally matches “confident cinematic reveal” in `motion-system.md`.
- **Progress line** uses linear fill (`ease: "none"`)—correct for a determinate theatrical bar, not a faux download.
- **Reduced-motion timing** scales down aggressively without removing the story (`REDUCED_TIMING`).
- **Hero reveal trigger** at label `midToEnd` preserves the locked synchronization model.

### What feels unfinished or static

Per `loader-polish-spec.md` (visual truth, not a code defect list): start-frame composition, seam readability, crack graphic immediacy, mobile recomposition, and “lands into a satisfying product world” remain **quality debt**. In Emil terms: the motion system can be correct while **individual frames** still break the illusion—users feel that as “almost AAA.”

**Doc vs. code drift:** `motion-system.md` cites `midToEnd` ≈ `2000ms`; `LOADER_TIMING.midToEnd` is `2.6` seconds. That is not inherently wrong, but it weakens the sense of a **single score** if other docs and implementation disagree.

### Suggested polish (no redesign)

- **Frame-by-frame review** against `loader-polish-spec.md` acceptance frames (slow-motion in DevTools) focusing on: seam cap disappearance timing vs. panel separation, fragment chaos vs. “slow-motion premium,” and backdrop fade relative to hero legibility.
- **Mid-hold**: current `midHold` is `0.3` in code vs. `600ms` in `motion-system.md`—confirm whether the shorter hold is intentional; the midpoint reads as “controlled opening beat” only if the hold gives the eye permission to rest.
- **Will-change hygiene**: groups use `will-change: transform` in CSS—ensure it is cleared after intro completes where possible to reduce long-session GPU reservation (invisible on fast machines, noticeable on low-end).

### Suggested micro-animations

- **None additive** until loader polish spec items are satisfied—new flourishes would compete with the structural reveal and violate “motion must explain” for this frequency class (once per session).

### Why

Loader is **rare / first-time** motion: acceptable duration and richness, but only if every phase earns its time. Polish should prioritize **compositional truth** over extra effects.

### Priority

**P0** (product-critical perception), owned jointly by design lockframes and engineering tuning per existing specs.

---

## Hero Review

**Implementation touchpoints:** `HeroComposition.jsx`, `heroCompositionTimeline.js`, `heroRevealMotion.js`, `HeroComposition.css`.

### Current impression

A restrained editorial poster: cream atmosphere, floating cups, confident headline, single CTA, delayed sticker, metric row—matches `scene-map.md` “campaign” language.

### What feels strong

- **CTA and utilities**: `:active { transform: scale(0.975) }` on CTA and utilities matches the “buttons must feel responsive” principle; hover shadow and color transitions are explicit-property transitions.
- **Nav underline**: transform-based reveal with separate opacity/transform durations reads intentional.
- **Hero reveal ease**: `cubic-bezier(0.23, 1, 0.32, 1)` matches the project’s strong ease-out token—excellent for a first-time entrance.
- **Pointer gating** on nav/utility hover lifts.

### What feels unfinished or static

- **Nav links** lack `:active` press feedback (utilities have it)—small inconsistency in the chrome layer.
- **Headline lines** are two `<span>` lines but animate as one `copy` block: readable, but slightly **static relative to cup depth** (everything arrives on the same beat).
- **Sticker** shares the same entrance vector as copy (`y: 36`)—acceptable, but the sticker is an accent; Emil hierarchy would often give it a **shorter, later** beat (align with `motion-system.md` “sticker shorter, later, subordinate” if not already felt in time).
- **Stats row**: enters with horizontal offset; on smaller breakpoints stats scale or hide—verify the reveal still feels **authored**, not “scaled UI.”

### Suggested polish

- Add **subtle `:active`** treatment to nav links (e.g. `scale(0.98)` or 1px translate) without fighting the underline animation—keep transform on the same element or isolate to a child.
- Revisit **timeline offsets** inside the same `midToEnd` window: micro-stagger `stats → headline → CTA → sticker` on the order of tens of milliseconds so the eye lands on product first, copy second, accent last—**only** if it does not read as slower overall (total perceived duration should remain bounded).

### Suggested micro-animations

- **Reject** continuous parallax on cups for the hero: high frequency if users scroll back and forth; would compete with product dominance per project motion hierarchy.
- **Optional one-shot** after reveal settles: a barely perceptible **shadow depth** shift tied to scroll leaving hero (very small opacity on ground shadows)—low value vs. complexity; **defer**.

### Why

Hero is high-attention but **not** keyboard-frequency motion; subtle hierarchy adjustments improve ** comprehension** without turning the hero into a looped demo.

### Priority

**P1** for nav `:active` parity; **P2** for internal stagger tuning.

---

## Section-by-Section Findings

### App shell: scroll model, overlay host, and section seams

**Current impression:** Clean stacking: hero in a `100svh` shell, fixed overlay host for transition cup, bordered SVG dividers between major sections.

**Strong:** Scrollbar compensation while intro locked; `data-*` attributes for debugging scene state; intro overflow lock vs. post-intro `overflow-x: clip`.

**Unfinished / static:** Section dividers are purely decorative—fine—but the **transition from “film scroll” to “content scroll”** is only felt through layout, not motion. Consider whether the first divider after hero should **ease-in** its appearance (opacity) on scroll for one beat of continuity (optional).

**Micro-animation:** Optional **divider micro-fade** when the freshness section’s top crosses a threshold—must be subtle (opacity only, reduced-motion safe).

**Priority:** P2.

---

### Freshness Transition

**Implementation touchpoints:** `FreshnessTransition.jsx`, `FreshnessTransition.css`, `freshnessTransitionScroll.js`, `freshnessTransitionGeometry.js`, `App.jsx` overlay cup host.

#### Current impression

Oversized orange statement type, editorial pills, pinned cup narrative—visually loud in a good way; motion is **dominated by the cup handoff**, which matches ownership in `motion-system.md`.

#### Strong

- **ScrollTrigger scrub** with `scrub: 3` creates **inertial smoothing** for a heavy object—often reads as “premium weight” vs. raw scroll binding.
- **Rotation interpolation** (`lerp` on angle) supports spatial continuity.
- **Atmosphere blobs** anchor the section in the same visual language as hero.

#### Unfinished / static

- **Typography and pills are static** relative to the moving cup: not wrong editorially, but the eye sometimes splits attention between “massive kinetic type” expectation vs. “only the cup moves.”
- **Binary opacity model** (`getTransitionCupOpacity` / `getSettledCupOpacity` / `getHeroCupVisible`): hero in-canvas black cup visibility flips at `progress <= 0.001`, settled cup at `progress >= 0.999`. This can produce a **hard swap** perception at the extremes unless the scrub smoothing masks it—worth validating frame-by-frame at handoff peaks.

#### Suggested polish

- Introduce a **narrow crossfade band** (e.g. last 8–12% of progress) between overlay cup and settled cup **opacity only**, while keeping transforms authoritative—reduces risk of a one-frame flash without blur-heavy effects (aligned with doc preference to avoid heavy blur readability issues).
- Consider slightly **asymmetric scrub** feel: if reverse-scroll feels identical to forward, good; if not, verify `onLeaveBack` resets match perceived continuity.

#### Suggested micro-animations (scroll-linked, clarity-first)

- **Very subtle line stagger**: small `y` / `opacity` tied to the **same** ScrollTrigger progress (not a second timeline) for each statement line—amplitudes small enough to read as “pressure wave” from the cup, not a second story. **Skip entirely** if it competes with type legibility on mobile.

#### Why

Improves **one continuous gesture** from hero product to freshness proof; rejects unrelated parallax noise.

#### Priority

**P0–P1** for crossfade band validation; **P2** for optional line coupling.

---

### Bestsellers Section

**Implementation touchpoints:** `BestsellersSection.jsx`, `BestsellersSection.css`.

#### Current impression

Warm, spacious cards; oversized background word; featured column emphasis—reads on-brand and “quiet luxury retail.”

#### Strong

- **Card hover**: lift + border + inset highlight + packet `translateY` + `scale`—coordinated, property-specific transitions, hover-gated—this is already at a high craft level.
- **CTA button**: hover and `:active` scale; featured variant reads clearly.

#### Unfinished / static

- **Heading block and background word** appear immediately on scroll: no progressive reveal; the section “starts” visually before the user has mentally transitioned from freshness.
- **No scroll-based entrance** for cards: fine on repeat visits, but first paint into viewport can feel **abrupt** compared to the orchestrated hero.

#### Suggested polish

- **One-time** `opacity + translateY(8px→0)` on the title/subtitle when the section crosses ~15–20% into viewport, duration ~220–280ms, strong ease-out, **respect reduced motion** (opacity-only variant).
- **Optional stagger** on the three cards: 40–70ms offsets—short enough not to block interaction; must not delay layout or LCP.

#### Micro-animation guidance

- **Approve** light scroll reveal for heading/grid (first entry only, `once: true` pattern conceptually).
- **Reject** looping wiggle on packets or price ticks—adds noise and reads transactional.

#### Priority

**P1**.

---

### Menu Section

**Implementation touchpoints:** `MenuSection.jsx`, `MenuSection.css`, `menu.js` content.

#### Current impression

Editorial menu spread with strong typography and structured grids; visually consistent tokens.

#### Strong

- Clear hierarchy: hero title block, category titles, subsection rules, product grids.
- Generous vertical rhythm variables—good for long-form reading comfort.

#### Unfinished / static

- **No hover or active states** on product tiles, images, or list rows in CSS—everything reads as print. For a premium hospitality brand, that can feel **slightly inert** rather than “confidently minimal.”
- Long scroll through many similar tiles **without progressive disclosure** can feel monotonous compared to the opening film.

#### Suggested polish

- **Pointer-fine hover**: extremely subtle row background or price/name color shift on text lists; for product grid, **1px translateY** or soft shadow on the image stage only—keep motion transform-minimal and GPU-friendly.
- **Press feedback**: `:active { scale(0.99) }` on any future clickable row/button pattern (if rows become links).

#### Suggested micro-animations

- **Category headers**: optional scroll reveal (opacity + 6–8px `y`) **once per category** as it enters—helps chunk the menu into scenes without animating every row.
- **Reject** per-row stagger for dozens of lines—high noise, low signal.

#### Priority

**P1** for hover/press parity on interactive targets; **P2** for category scroll reveals.

---

## Existing Animation Review

| Area | What exists | Interaction / motion taste | Notes |
| --- | --- | --- | --- |
| Loader | GSAP timeline: fill, fade UI, split, hold, surge | Cinematic, rare-frequency—appropriate | Polish is compositional per `loader-polish-spec.md`, not “more motion” |
| Hero reveal | Single paused timeline; strong ease-out; shadows pop with shorter duration | Cohesive premium entrance | Simultaneous beats are slightly “one chord” vs. layered hierarchy |
| Hero UI | CSS transitions; hover-gated | Good discipline | Add `:active` on nav links for parity |
| Freshness | ScrollTrigger scrub + manual transforms on overlay cup | Weighty, continuous—good product story | Watch binary opacity edges; scrub lag is intentional—validate reverse scroll |
| Bestsellers | Hover-lift on cards | Excellent for occasional interaction | First viewport entry could use one-shot reveal |
| Menu | Essentially static motion | Reads calm but slightly **disconnected** from the top of the page | Add minimal feedback + optional section reveals |
| Global | Lenis desktop-only; ST refresh on destroy | Smart tradeoff | Mobile users miss smooth scrub; acceptable if freshness still reads |

**Easing / timing callouts**

- **Hero reveal duration** (`heroRevealMotion.durationSeconds: 1.6`) is long for generic UI, but this is **first-time / rare** synchronized film—acceptable; avoid extending further.
- **Bestsellers** card transitions at 260–300ms sit slightly above Emil’s “keep UI under 300ms” guideline but are **hover-frequency**—still acceptable; do not lengthen.
- **Loader `midToEnd` at 2.6s** is far above 300ms UI guidance—again acceptable **only** because it is non-repeating; ensure it never feels like waiting for a network resource (theatrical framing must stay obvious).

---

## Missing Micro-Animation Opportunities

Items that **pass** the “purpose” test (spatial continuity, hierarchy, preventing abrupt change):

1. **Freshness**: narrow dual-cup opacity crossfade near journey end (continuity).
2. **Bestsellers**: one-shot heading/subtitle reveal; optional short card stagger on first entry.
3. **Menu**: category-level scroll reveal; subtle hover on rows/product stages; `:active` on actionable controls.

Items to **reject** (decorative / noisy / wrong frequency):

1. **Parallax on hero cups or freshness type** during normal scroll—competes with product and scroll performance.
2. **Per-character text animations** in menu lists—reads gimmicky for utility content.
3. **Looping ambient motion** on stickers or badges—violates project “avoid noisy looping motion.”

**Scroll-down micro-motion special check (headings, images, cards, CTAs)**

- **Headings below hero:** Bestsellers title and Menu block title would benefit from **opacity-first** entrance; avoid aggressive clip reveals that fight readability.
- **Images:** Packet hover nudge already exists; menu product shots need at most **static hover frame** (shadow/translate) not continuous motion.
- **Cards:** Bestsellers already animate on hover; add **enter** animation only once.
- **CTAs:** Hero CTA is strong; Bestsellers buttons could use **consistent active state** when hover transform is active (transform stacking nuance—verify combined states).
- **Icons:** Arrow on Bestsellers CTA could **translate 1–2px** on hover/focus for direction hint—tiny, functional.

---

## Implementation Notes

**Constraints to preserve**

- Do not violate `motion-system.md` **Locked** ownership: hero timing relative to loader `midToEnd`, freshness as scroll-based structural transition, avoid new looping decorative systems.
- Any new scroll-linked motion should use **transform/opacity** only, gate behind `prefers-reduced-motion`, and prefer **CSS transitions or scrubbed values** over keyframed loops for interruptibility.
- **ScrollTrigger + Lenis**: refresh hooks already exist; new triggers should follow the same invalidation discipline as `createFreshnessTransitionScroll`.

**Concrete engineering anchors**

- Freshness opacity easing: adjust in `freshnessTransitionGeometry.js` consumers or introduce a small `smoothstep` on progress for opacity channels only—keep transform progress mapping unchanged initially.
- Bestsellers / Menu reveals: prefer **one lightweight pattern** (shared hook or shared CSS utility class) to avoid three different reveal languages on one page.
- **Transform conflict check:** `.bestsellers-section__button:hover` uses `translateY(-1px)` while `:active` uses `scale(0.975)`—confirm combined states do not feel like pop; if needed, unify under a single transform string per state.

**Verification ritual (Emil-style)**

- Slow-motion review for loader, hero, and cup handoff; frame-step overlaps during opacity swaps.
- Revisit after a night away—aggregate micro-glitches surface on second viewing.

---

_End of audit. No application code was modified._
