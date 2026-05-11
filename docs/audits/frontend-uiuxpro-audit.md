# UI UX Pro Max Frontend Audit

Audit lens: premium landing UX (hierarchy, scanning, trust, accessibility, responsiveness, conversion clarity) aligned with `docs/project-brief.md`, `docs/design-system.md`, `docs/content-contract.md`, `docs/scene-map.md`, and `AGENTS.md`. Implementation read from `src/` and `package.json`. **Audit only; no code changes.**

**Stack note:** Vite + React 19 + plain CSS + GSAP + Lenis. No Tailwind or Framer Motion in `package.json`; recommendations stay CSS/React-appropriate and avoid dependency churn unless explicitly approved later.

---

## Executive Summary

Lounge Coffee delivers a **cohesive premium story** in the first viewport: theatrical loader, poster-like hero with clear product dominance, and a freshness beat that reinforces craft through scale and continuity. **Visual hierarchy and design tokens** largely match the documented warm, product-first system.

The main UX gaps are **content and interaction honesty**, not layout taste: placeholder **navigation and CTAs resolve to `#`**, so conversion paths are unclear; **hero metrics include a visible typo** that undermines trust; **freshness lacks a visible supporting paragraph** called for in `content-contract.md` (only decorative type plus an `sr-only` summary); **header/nav labels diverge** from the contract’s preferred IA. Lower sections (**Bestsellers**, **Menu**) increase **information density** without equivalent wayfinding or in-section anchors, and **Menu** has minimal **focus/hover affordances** compared to hero and bestsellers.

Overall: **refine copy, links, and contract alignment first** (high ROI, low visual risk), then tighten **keyboard UX, skip links, and mobile scanning** for long menu content.

---

## Overall UX Assessment

**Strengths**

- **Page structure:** Single `<main>` in `App.jsx` with ordered scenes (hero shell, freshness, bestsellers, menu) matches a clear top-to-bottom story: anticipation and product (loader + hero), proof (freshness), assortment (bestsellers), detail (menu).
- **Visual hierarchy:** Hero obeys design-system grammar: cups dominate, copy is a compact island, chrome is restrained.
- **Design fidelity:** Color roles, typography families, atmosphere, and asymmetry align with `design-system.md`.
- **Motion and scroll:** Intro completion unlocks scroll; Lenis on desktop-wide viewports supports smooth reading without forcing it on touch-first breakpoints (`useSmoothScroll` + `matchMedia`).

**Friction**

- **Dead-end interactions:** Primary nav, logo, hero CTA, and card CTAs are non-committal placeholders (`href="#"` / `type="button"` with no action). Users cannot complete a mental “next step.”
- **Trust and polish:** Metric copy typo and transactional CTA wording vs. contract “invitational” direction.
- **Scanning depth:** Menu is long and uniform; lack of sticky subsection cues or “back to top” increases cognitive load on small screens.
- **Scope messaging:** `project-brief.md` still states v1 stops after freshness; live page adds Bestsellers and Menu. Not a UI bug, but docs and product story should stay aligned so UX decisions stay intentional.

---

## Loader Review

**Purpose:** Brand ritual, tension, transition into the product world (`scene-map.md`, `project-brief.md`).

**Strengths**

- Full-viewport focus; minimal readable UI (logo, progress, bean) supports “held” anticipation.
- `aria-label` on the intro section improves screen reader context for the block.

**UX friction**

- **No explicit loading state for assistive tech:** Progress is visual; consider whether a polite status pattern is needed for users who do not perceive animation (product decision; optional).
- **Scroll lock during intro:** Expected for the effect; when `introComplete` is false, vertical scroll is constrained—ensure focus management does not trap users if focus lands inside intro (verify in manual keyboard test).

**Hierarchy / density**

- Appropriate low density; no competing panels.

**Recommended refinement**

- Keep loader as-is visually; pair with **docs/loader-polish-spec.md** work for compositional quality. UX-side: confirm **reduced-motion** path still communicates “loaded, you may proceed” without confusion.

**Priority:** Medium (polish and a11y validation, not structural UX change).

---

## Hero Review

**Purpose:** Desire, variety, product confidence; headline + single CTA + optional metrics (`content-contract.md`, `scene-map.md`).

**Strengths**

- **Product-first hierarchy:** Cup stage, headline placement, and header chrome match design-system composition rules.
- **CTA visibility:** Orange button, sufficient size, shadow for separation from cream field.
- **Interaction affordances:** Nav underline, hover-gated lift, `:active` scale on CTA and utilities, visible `:focus-visible` outlines on key controls (`HeroComposition.css`).
- **Responsive simplification:** Nav hidden on narrow breakpoints; stats reposition or hide per breakpoints—matches “simplify before shrinking” intent.

**UX friction**

- **CTA copy:** `Shop Now` reads transactional; contract **Preferred** direction is invitational (e.g. explore blend). Minor but affects tone and conversion framing for a non-checkout site.
- **Navigation labels:** Implemented `HOME`, `FLAVORS`, `COLLECTION`, `ABOUT`, `CONTACT` vs. contract **Preferred** `Shop`, `Story`, `Freshness` plus bag utility—diverges from agreed IA vocabulary.
- **Utility vs. contract:** Contract prefers **bag icon only** for cart; current **EN + BASKET** text utilities add chrome density (acceptable if intentional; document if so).
- **Metrics:** `heroMetrics` includes **“Pasteries”** (misspelling)—visible trust defect. Values like `12k+` are generic-feeling per broader UX writing guidelines; optional softening if metrics stay decorative only.

**Mobile concerns**

- Two cups remain primary on smallest breakpoint per CSS—good. Loss of stats removes one proof cue; ensure headline + CTA alone still carry value proposition.

**Accessibility concerns**

- Logo and nav use `href="#"` without in-page targets—keyboard users activate with no meaningful destination.
- Hero CTA is `<button type="button">` with no described outcome—screen reader users get no “what happens next.”

**Recommended refinement**

- Fix typo; align CTA and nav wording with `content-contract.md` **or** update contract if marketing direction changed.
- When still placeholder, add **`aria-disabled="true"`** or similar honest pattern **only if** visually styled as disabled—otherwise implement real `href`/`onClick` with routes or modal (future scope).

**Priority:** High for typo and link honesty; Medium for nav/CTA tone alignment.

---

## Section-by-Section UX Findings

### Freshness Transition

| Dimension | Notes |
| --- | --- |
| **Purpose** | Continuity and craft proof; pinned cup into oversized freshness message (`scene-map.md`). |
| **Strengths** | Strong focal handoff; jumbo orange type matches design-system “editorial proclamation”; pill imagery supports freshness narrative; `h2` with `sr-only` gives a proper accessible headline tied to `aria-labelledby`. |
| **UX friction** | **Contract gap:** `content-contract.md` requires **one oversized message + one short supporting paragraph** (freshness, aroma, craft). Visible layout is tag + decorative statement lines (`aria-hidden`) + sticker + cup; supporting paragraph is **not** present as readable body copy for sighted users. |
| **Hierarchy** | Tag reads as eyebrow; statement dominates—good. Sticker is secondary—good. |
| **Spacing / typography** | Large `clamp` type and line min-heights create rhythm; mobile stacks lines clearly. |
| **CTA / conversion** | No CTA here by design—acceptable if the story handoff is enough; otherwise consider a single soft CTA (“See the menu”) only if it does not compete with type. |
| **Mobile** | Separate mobile statement improves fit; centered rhythm is appropriate at small widths. |
| **A11y** | Decorative lines hidden from AT; `sr-only` headline present—good. Ensure color contrast of orange type on cream meets WCAG for large text at smallest sizes (verify with tooling). |
| **Refinement** | Add a **short supporting sentence** (visible, low-contrast espresso) under or beside the statement block to satisfy contract and improve **scanning** for users who skip jumbo type. |
| **Priority** | High (contract + comprehension). |

### Bestsellers Section

| Dimension | Notes |
| --- | --- |
| **Purpose** | Packaged favorites showcase; appetite and clarity (`scene-map.md`). |
| **Strengths** | Clear three-up grid (allowed by brand scene map); featured card reads as hero within section; background word adds depth without overwhelming; hover states and focus ring on buttons. |
| **UX friction** | **“Add to Basket”** implies checkout; scope is **no ecommerce** (`project-brief.md`)—may confuse or over-promise. |
| **Hierarchy** | Title then subtitle then grid—correct. |
| **Spacing** | Section padding and card min-heights feel spacious; matches premium retail tone. |
| **CTA** | Primary action per card should match reality (e.g. “View details”, “Notify me”, or honest disabled state) until a flow exists. |
| **Mobile** | Single column with featured spanning—good scanning order. |
| **A11y** | `aria-labelledby` on section; list semantics on grid—good. Card articles are not interactive as a whole—only buttons are; OK if intentional. |
| **Refinement** | Rename CTAs to **truthful** microcopy; optional single section-level link to menu anchor for “see full range.” |
| **Priority** | High for CTA honesty; Medium for anchor link. |

### Menu Section

| Dimension | Notes |
| --- | --- |
| **Purpose** | Deep menu presentation; extends page utility beyond original v1 brief (implementation choice). |
| **Strengths** | Clear category > subsection > grid/list structure; typography scales with `clamp`; brown section break provides visual reset before dense content. |
| **UX friction** | **High information density** for a landing page: many similar rows and grids; **no sticky category header** or local nav, so users lose context while scrolling. **No hover/focus** affordances on product tiles or list rows (`MenuSection.css` has no `:hover` / `:focus` rules)—feels static next to hero and bestsellers. |
| **Hierarchy** | “Our Fresh Menu.” reads well; category titles (`Drinks`, `Pastries`) are clear. |
| **Spacing** | Generous gaps between subsections; good for readability; total page length increases—acceptable if menu is an explicit goal. |
| **CTA / conversion** | No explicit CTA; fine for a reference menu, but **order path** is absent—pair with a single global CTA elsewhere or a footer CTA if conversion matters. |
| **Mobile** | Grids collapse to 1–2 columns; list grid becomes single column—sensible. Typo risk in CSS: `15.3srem` on one mobile rule looks like a **broken unit** if present in built CSS (verify in file—would break layout if shipped). |
| **A11y** | Headings hierarchy (`h2` > `h3` > `h4`/`h5`) is logical. Rows are not focusable—OK for static display; if rows become links later, add focus styles. |
| **Refinement** | Optional **sticky category tabs** or a compact **table-of-contents** link row; subtle row hover for pointer devices; fix any invalid `srem` unit. |
| **Priority** | Medium (scanning + consistency); High if `srem` is a live bug. |

### App-level: page chrome and flow

- **Skip link:** No “Skip to main content” in `index.html` / root—hurts keyboard efficiency on a long page.
- **Title/description:** `index.html` meta description matches concept—good.
- **Test route:** `/test` bypasses main story—OK for dev; not part of consumer homepage.

---

## Visual Hierarchy Review

**What works**

1. **Hero:** Product mass > headline > CTA > chrome; matches `design-system.md` composition grammar.
2. **Freshness:** Jumbo message owns attention; cup anchors continuity.
3. **Bestsellers:** Title block above grid; featured elevation via border/background/badge.

**Tightening opportunities**

- **Orange salience:** Orange appears in freshness headline, hero CTA, tag stars, bestsellers hovers—still within “intentional accent” if frequency feels controlled; watch **Menu** subsection labels (orange) so they do not compete with hero CTA memory.
- **Typography roles:** Design system flags **provisional** button vs. metric value family mismatches between Figma instances—code uses display for nav/stats per CSS; document resolution so future sections do not drift further.
- **Menu density:** Consider slightly **smaller category title** step or more whitespace between **Drinks** and first subsection to reinforce “chapter” boundaries.

---

## Design-System Consistency Review

| Topic | Consistency | Note |
| --- | --- | --- |
| Palette | Strong | Tokens map to reviewed hex roles. |
| Typography | Good with known gaps | Haas families used; Figma mismatches on button/metrics remain **provisional** per design-system. |
| Atmosphere | Strong | Hero and freshness use haze/blur language consistently. |
| Anti-traits | Mostly respected | Not card-slapped in hero; orange not on every control. |
| Content contract | Partial drift | Nav, CTA tone, freshness supporting paragraph, utility treatment. |
| Project brief scope | Drift | Menu + extended brief text vs. “freshness only” v1 lock—align docs or mark Menu as explicit extension. |

---

## Responsiveness Review

- **Viewport height:** Hero and intro use `100svh` / `min-height` patterns—good practice vs. rigid `100vh` pitfalls on mobile browsers.
- **Breakpoint behavior:** Hero simplifies cups and hides nav; freshness switches statement layout; bestsellers reflows grid; menu reduces columns—overall coherent.
- **Smooth scroll:** Disabled below `961px` width—reduces touch oddities; freshness scrub still runs—validate perceived continuity on real devices.
- **Long content:** Menu length on mobile may push **footer-less** feeling—consider optional compact end cap (legal, hours) only if brand needs it.

---

## Accessibility Review

**Strengths**

- Semantic landmarks: `<main>`, `<section>`, `<nav>`, headings with `aria-labelledby` in several scenes.
- Decorative imagery: empty `alt` where appropriate; sticker `aria-hidden` in freshness.
- Focus styles: hero and bestseller buttons have visible focus rings; reduced-motion CSS narrows transition properties.

**Gaps**

- **Skip navigation** absent.
- **Placeholder links** (`href="#"`) for logo and nav: poor SR and keyboard UX; consider real routes or `button` with explicit behavior.
- **Hero CTA** gives no programmatic hint of outcome.
- **Loader:** verify focus is not lost inside a non-modal overlay when intro completes (implementation detail—flag for QA).
- **Contrast:** Jumbo orange on cream—validate large-text WCAG thresholds at minimum `clamp` sizes.

---

## Conversion / CTA Review

| Control | Current signal | UX issue | Direction |
| --- | --- | --- | --- |
| Hero CTA | “Shop Now” | Transactional; no backend shop | Softer, accurate label + real target when ready |
| Nav | All `#` | No discovery path | Map to in-page anchors or future routes |
| Bestsellers buttons | “Add to Basket” | Implies cart/checkout | Truthful microcopy for presentation-only |
| Menu | None | Browse-only OK | If conversion is goal, add one persistent CTA (e.g. sticky “Find a lounge”) |

**Information flow vs. conversion:** Story builds desire then proof; **missing explicit “what now”** after menu unless user infers from hero CTA only.

---

## Content Flow Review

1. **Loader** – brand + tension.  
2. **Hero** – product line + headline + CTA + light proof (metrics).  
3. **Freshness** – craft/freshness message (visual + sr headline).  
4. **Bestsellers** – curated subset with prices.  
5. **Menu** – exhaustive assortment.

**Flow tension:** Jump from **emotional freshness** to **retail cards** then **full menu** is logical for a brand site but increases **commercial** tone quickly; mitigated by copy tone if CTAs are softened.

**Content order:** Bestsellers before Menu is correct (curated before exhaustive).

---

## Priority Matrix

| Area | Issue | Recommendation | Impact | Risk | Effort | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| Hero metrics | Typo “Pasteries” | Fix spelling; optional copy pass for generic stats | Trust | Low | Low | P0 |
| Links / CTAs | All `href="#"`, non-functional buttons | Honest labels, real anchors, or disabled styling + aria | Conversion, a11y | Low–Med | Med | P0 |
| Freshness | Missing visible supporting paragraph per contract | Add 1 short body line (aroma/craft) | Comprehension, contract | Low | Low | P0 |
| Bestsellers | “Add to Basket” overstates capability | Rename to presentation-safe CTA | Trust | Low | Low | P0 |
| Nav copy | Diverges from content-contract preferred labels | Reconcile copy with contract or update contract | Consistency | Low | Low | P1 |
| Hero CTA | “Shop Now” vs invitational brief | Align tone with brand + scope | Brand | Low | Low | P1 |
| Global | No skip link | Add skip to main content | a11y | Low | Low | P1 |
| Menu | Long scan, weak subsection wayfinding | Sticky category header or mini TOC | UX | Med | Med | P2 |
| Menu CSS | Possible `15.3srem` typo | Fix unit if present | Layout | High if live | Low | P0 if confirmed bug |
| Docs | Brief vs live sections | Update `project-brief` / phases for Menu | Process | Low | Low | P2 |
| Focus | Menu rows non-interactive | Fine today; if links added, add focus/hover | a11y | Low | Med | P3 |

---

## Things to Avoid

Per user instruction and project guardrails:

- **Full redesigns** of hero or loader composition.
- **Trend-chasing** (cursor trails, aggressive parallax, neon glass, unrelated illustration systems).
- **New heavy dependencies** for minor polish (stack is intentionally lean: React + GSAP + Lenis per `package.json`).
- **Weakening product-first hierarchy** (e.g. shrinking cups to grow text blocks, centering everything).
- **Generic dashboard patterns** (metric cards, dense tables) that contradict `design-system.md`.
- **Skill-default conflicts:** Do not mandate Tailwind, Framer Motion, Inter bans, or “no three-column cards” here—**scene-map** explicitly allows the three-card bestsellers row; this project uses **custom CSS tokens**, not Tailwind.

---

## Final Recommendations

### 1. Must-fix

- Correct **metric typo** and any **invalid CSS unit** in menu mobile rules if confirmed in source.
- Replace or honestly style **non-functional CTAs and links** so users are not misled.
- Add **visible supporting copy** to the freshness section to meet `content-contract.md` and improve scanning.

### 2. High-ROI polish

- **Skip to main content** link.
- **CTA and nav copy** pass: invitational hero CTA, presentation-safe bestseller buttons, nav labels aligned with contract or documented exception.
- **Keyboard QA** pass on intro unlock, focus order, and focus visibility on all interactive elements.

### 3. Nice-to-have

- Menu **subsection stickiness** or lightweight jump links between Drinks / Pastries.
- Subtle **pointer hover** on menu list rows for desktop polish (without implying click where there is no action).
- **Single post-menu CTA** (e.g. repeat primary or contact) if marketing wants a closed loop.

### 4. Experimental (defer unless explicitly requested)

- In-page **anchor navigation** synced with scroll spy.
- **Reduced-density** menu variant (e.g. collapsible categories) for mobile—higher design and engineering cost.

---

_End of audit. No application code was modified._
