---
name: Yellow Goat Co. portfolio — project state
description: Current state of the portfolio site, what's been built, what's pending as of 2026-05-03
type: project
originSessionId: 0c3520e6-9521-4168-9f9b-afabb9a17853
---
Portfolio site for Helen Chirinos / Yellow Goat Co. at `/Users/helenchirinos/Desktop/porfolio`.

**Stack:** Vite + React SPA. No git repo. No backend. Components in `src/components/`, styles in one `src/styles.css`, data in `src/data/projects.js`. GSAP for scroll reveals and 3D project card hovers. React Three Fiber + drei for the hero SignatureMark canvas.

**What's been implemented (as of 2026-05-03):**

- Full site audit completed (UX, design, copy, technical, animation/conversion)
- DESIGN.md created at project root — full documented design system
- Gold (#E0B13F) removed from entire codebase; replaced with peach/coral/sage throughout
- All 5 section heading copy rewrites (hero, work, services, fit, process, contact)
- Services section copy fully overhauled (H2, intro, all 3 card descriptions — reviewed by senior copywriter agent, 98% confidence)
- Header mobile tagline fixed to match hero ("Intentional websites...")
- Body overflow lock moved from inline JS to CSS class (`body.menu-open`)
- scroll-margin-top added to all anchor sections (4.5rem for fixed header)
- `.text-link:focus-visible` added
- Form input background raised from 8% → 16% cream opacity
- `.fit-proof-item` arbitrary translateX offset removed
- 820px breakpoint added for service grid (2-column on tablet)
- Reveal animation variation: `useReveal.js` reads `data-reveal-speed` attr; slow (1.05s) applied to section intro blocks
- Non-blocking font loading in index.html, extended CSS fallback stacks
- `.env` created with `VITE_CONTACT_EMAIL=chirinos@outlook.com`
- Real Playwright screenshots of 3 live project sites (lustro, soku, pan) used inside 3D browser frame cards — fake HTML mockup replaced
- Hero badge: `hireme.png` (transparent PNG, 1448×1086) with z-index above canvas, translateY(10%), scaled up
- **Attention component extracted**: the bold "Not louder / Clearer / Not busier / Sharper" transition now lives in `src/components/Attention.jsx` and renders between Hero and Work
- **Ticker/Marquee removed from main flow**: `src/components/Ticker.jsx` still exists, but `App.jsx` no longer renders it between Attention and Work
- **Footer redesigned and extracted**: mirrored from Chirinos_Portfolio reference — lives in `src/components/Footer.jsx`, rendered after Contact, single copyright strip with subtle border-top, centered, no columns
- **Contact section redesigned**: two-column layout (ref: Chirinos_Portfolio) — left col has "Let's Talk." display heading + looping "Available · Open to New Work" availability ticker, right col has full inquiry form. eyebrow/H2 intro removed from top (folded into left col)
- **Fit / Who it is for copy overhauled**: cards now mirror buyer fit and positioning instead of repeating delivery proof points
- **SignatureMark.jsx rebuilt again from the 3D Hero Animation brief**: tactile website assembly with a central browser/wireframe foundation. Smaller UI pieces fly in from varied angles with depth/rotation, scale down, and land on that base so the final state reads as one finished interface rather than a collage. It gets a small final snap pulse, then idles subtly. Reduced motion renders the assembled state immediately with demand rendering and no mouse parallax. YG palette colors only.

**Services copy (final approved, senior copywriter reviewed):**
- H2: "The scope changes. The attention doesn't."
- Intro: "Three different scopes. One level of attention. Whether you're building from zero, fixing what's broken, or doing something that doesn't fit a template — every project gets the same strategic focus from first call to launch day. Not sure which fits your situation? One conversation usually makes it obvious."
- Launch Page: "You have an offer worth taking seriously. This gets it in front of people who will — designed and built to convert from day one."
- Site Redesign: "Your work is strong. Your site is the reason clients hesitate. This fixes the gap — without starting from scratch or losing what's already working."
- Custom Build: "When a template would be a ceiling, not a starting point. Built from scratch — around your structure, your logic, and how your buyers actually make decisions."

**Fit copy (approved after senior copywriter + QA review):**
- H2: "For businesses that have outgrown the website they started with."
- Intro: "Yellow Goat Co. is for service-based businesses with strong work, real client trust, and a site that is not doing enough to translate that value online."
- Cards: "Your offer has matured", "Your clients need context", "Your site should pull weight"

**Pending / known open items:**
- Form backend (mailto: currently) — user said they'll add Formspree/Calendly later
- Testimonials and project result metrics — user needs to supply content
- `hireme.png` is 1.2MB — suggest optimizing to WebP when possible
- Contact section: `contact-intro` div (eyebrow + H2 + p) was removed by a linter/save — current Contact.jsx goes straight into contact-layout. Verify in browser.

**Why:** User is actively iterating toward a launch-ready portfolio.
**How to apply:** When making changes, check DESIGN.md for palette and type scale. All edits go to `src/` directly (no git workflow).
