---
name: Key design decisions made on the portfolio
description: Non-obvious design choices that were deliberated and confirmed
type: project
originSessionId: 0c3520e6-9521-4168-9f9b-afabb9a17853
---
**Gold color removed (2026-05-03)**
`#E0B13F` (--gold) was used throughout the original CSS but was never in the PRODUCT.md palette spec. Removed entirely. Replacements: peach (#FFDCC8) for nav icon/toggle/menu panel backgrounds; coral (#FF7A59) for focus states and fallback-mark ring; sage for success state. The attention section's 4th animated word uses peach. The browser window middle dot uses peach.
**Why:** Off-brand — palette is 5 colors only (ink, cream, coral, peach, sage).
**How to apply:** Never reintroduce --gold. If a warm yellow is needed, discuss with user first.

---

**Project cards use real screenshots inside 3D frame**
The 3D browser frame (GSAP intro + mousemove 3D tilt) was kept. The fake HTML mockup inside was replaced with `<img>` screenshots taken via Playwright at 1440×900. Screenshots live at `src/assets/projects/lustro.jpg`, `soku.jpg`, `pan.jpg`. The `project-label` floats above with `translateZ(70px)` and `backdrop-filter: blur(2px)`.
**Why:** User asked to show actual site screenshots instead of generic mockup cards.

---

**Selected Work Rolodex viewer**
The Work section now shows one featured project at a time with project index buttons and a "Next project" control. GSAP animates project changes with a top-entry Rolodex/card-index feel: outgoing project recedes down, incoming project drops/flips in from above. The previous scroll-driven hook (`useWorkScrollMotion.js`) was removed because it made the page feel empty/slow.
**Why:** User wanted a more creative one-at-a-time cycle where projects feel like index cards flipping over each other, while keeping the work inspectable and scalable for future projects.

---

**Hero badge is hireme.png (transparent PNG)**
Replaced the sage-colored text box with a user-supplied image. Positioned with `z-index: 2` (above the Three.js canvas), `translateY(10%)` nudge down, width scaled up ~10% (78% → 86%, max 396px). `pointer-events: none` so it doesn't block canvas interaction.
**Why:** User uploaded a custom "hire me" graphic and wanted it placed in that position.

---

**Copy direction: bold and specific, not safe**
All section headings were rewritten to commit to a specific POV. Examples:
- Hero: "Your work is exceptional. Your website should prove it."
- Services: "The scope changes. The attention doesn't."
- Fit: "For businesses that have outgrown the website they started with."
- Process: "How the work gets sharper."
- Contact: "Your work deserves a website that closes the gap."
**Why:** Original copy was generic and safe — audit found it lacked specificity. Services copy reviewed by senior copywriter agent before implementation.
**Note:** User has since edited the hero headline in the IDE — respect whatever is currently in Hero.jsx.

---

**Reveal animation variation**
`useReveal.js` reads `data-reveal-speed` attribute. `slow` = 1.05s/40px, default = 0.8s/32px, `fast` = 0.55s/20px. Section intro blocks use `data-reveal-speed="slow"`. Cards/lists stay at default.
**Why:** All reveals were identical — adding rhythm by differentiating headings from cards.

---

**Footer mirrors Chirinos_Portfolio reference**
Footer lives in its own `src/components/Footer.jsx` component and is rendered immediately after `Contact` in App.jsx. Single strip: border-top + centered copyright text only. No columns, no nav links, no back-to-top. CSS: `.site-footer` border-top with 12% ink opacity, `.footer-base` centered flex, 0.7rem uppercase tracking.
**Why:** User explicitly asked to mirror the Chirinos_Portfolio footer — that reference has one section, centered copyright only.
**How to apply:** Do not add columns or extra links to the footer. Keep it one line.

---

**Attention component and removed ticker**
The transition section now lives in `src/components/Attention.jsx` and renders between Hero and Work. It uses a "Clarity Snap" editorial interlude: rough lines ("Looks polished.", "Gets attention.") are corrected into sharper conversion-minded lines ("But does it build trust?", "Turns attention into action.") with coral editor-mark animation. Motion is intersection-triggered, one-shot, transform/opacity only, and respects reduced motion. `src/components/Ticker.jsx` still exists, but the standalone ticker is no longer rendered after Attention.
**Why:** User wanted the Attention section easier to work with, then asked to remove the ticker following it. Later feedback: the section felt bland and should make an impression if it stays, otherwise it is just art.

---

**Fit section buyer-positioning copy**
The "Who it is for" cards were rewritten after senior copywriter and QA review. They now function as buyer self-recognition rather than delivery proof points: "Your offer has matured", "Your clients need context", and "Your site should pull weight".
**Why:** Current cards ("Senior attention", "Business-first design", "Launch discipline") answered "why hire me" instead of "is this for me?" and overlapped with Services and Process.

---

**Process section lighter mobile-friendly redesign**
The Process section no longer uses a black background. It now uses a warm cream/peach/sage editorial band with circular step nodes inspired by the Chirinos_Portfolio Process component, plus dashed desktop connectors. Copy shifted from generic labels to conversion-focused steps: Discovery, Conversion Strategy, Design Direction, Build & Polish. The intro now explicitly frames the work around conversion, not just visual polish.
**Why:** User said the black background was not a good mobile experience and wanted inspiration from the Chirinos_Portfolio "How it works" component without mirroring it exactly.

---

**Philosophy became pre-contact decision bridge**
The former "Point of view" section no longer uses the large coral YG mark. It is now a concise "Before you inquire" bridge that reassures buyers they do not need to know exactly what they need before reaching out. Visual treatment is a tighter single editorial panel before Contact with a small coral reveal mark.
**Why:** Agent council found the old version repeated Attention/Process language and acted like a decorative stop before the form. User asked to remove YG and use the sharper pre-inquiry copy.

---

**Contact section two-column layout**
Mirrors Chirinos_Portfolio Contact.tsx layout. Left column: "Let's Talk." display heading (clamp 3.5rem–7rem) + availability ticker ("Available · Open to New Work" looping). Right column: full inquiry form. eyebrow/intro copy at top (may have been linter-removed — verify in browser).
**Why:** User asked to mirror the reference project layout.

---

**SignatureMark: tactile website assembly (2026-05-03)**
Rebuilt the hero 3D element as a procedural React Three Fiber composition inspired by the project brief: a cream browser/window frame acts as the central foundation, while the sage grid panel, wireframe card, typography card, dark code card, toolbar, pen coin, code tile, cursor, orbital ring, and small accent cubes fly in from multiple directions, scale down, and land on that single base. Motion uses data-driven `from/to` positions, slight rotation/depth travel, staggered timing, a soft snap pulse, cursor press moment, then subtle idle float. Reduced motion initializes from `matchMedia`, disables mouse parallax, switches Canvas to `frameloop="demand"`, and renders the final assembled state.
**Why:** User wanted the hero to feel whimsical, premium, editorial, soft/tactile, and more clearly like components assembling into a site, using the PDF brief and supplied reference image.
**Motion brief:** `/Users/helenchirinos/Desktop/porfolio/assets/3D Hero Animation — Creative Motion Brief.pdf`
