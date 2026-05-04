# Design System

## Color Palette

| Token | Value | Usage |
|---|---|---|
| `--ink` | `#111111` | Primary text, borders, dark backgrounds |
| `--cream` | `#faf6f2` | Page background, light surfaces |
| `--coral` | `#ff7a59` | Accent color, CTAs, highlights, selection |
| `--peach` | `#ffdcc8` | Warm surface tint, secondary backgrounds |
| `--sage` | `#a6b8a0` | Cool surface tint, secondary backgrounds |

**Strategy:** Restrained palette — tinted neutrals (cream/ink) carry the layout; coral is the single saturated accent used for selection states, eyebrow highlights, process step numbers, and orbit text. Peach and sage provide warm/cool surface variety on cards and the hero badge.

**Derived values:**
- `--muted`: `color-mix(in srgb, var(--ink) 62%, var(--cream))` — secondary text
- `--line`: `color-mix(in srgb, var(--ink) 16%, transparent)` — subtle borders
- `--shadow`: `0 28px 80px rgba(17, 17, 17, 0.14)` — card elevation

## Typography

### Font Families
- **Display:** `"Space Grotesk", -apple-system, "Segoe UI", system-ui, sans-serif` — headings, brand, nav, menu
- **Body:** `"Manrope", -apple-system, "Segoe UI", system-ui, sans-serif` — all running text

### Type Scale
| Role | Size | Weight | Tracking | Notes |
|---|---|---|---|---|
| Hero title | `clamp(4rem, 8vw, 8.6rem)` | 700 | -0.065em | Display font |
| Section heading | `clamp(2.5rem, 6.4vw, 7.5rem)` | 700 | -0.065em | Display font |
| Project/card heading | `clamp(2rem, 4vw, 4.6rem)` | 700 | -0.06em | Display font |
| Body large | `clamp(1rem, 1.5vw, 1.22rem)` | 400 | — | Body font |
| Hero subtitle | `clamp(1.05rem, 1.7vw, 1.45rem)` | 400 | — | Body font |
| Eyebrow/kicker | `0.75rem` | 800 | 0.13em | Uppercase, body font |
| Navigation | `0.74rem` | 800 | 0.08em | Uppercase, body font |
| Button | `0.78rem` | 850 | 0.09em | Uppercase |

**Rules:**
- Body `line-height: 1.5`
- Headings `line-height: 0.9–0.92`
- Body copy `max-width: 680px`
- Section intro `max-width: 780px`
- `-webkit-font-smoothing: antialiased`
- `text-rendering: geometricPrecision`

## Spacing & Layout

**Container:** `width: min(100% - 2rem, 1240px)` centered with `margin-inline: auto`

**Section padding:** `clamp(4.5rem, 10vw, 9rem)` block

**Grid gutters:**
- Hero: `clamp(2rem, 6vw, 6rem)`
- Project cards: `clamp(4rem, 10vw, 8rem)`
- Service cards: `1rem`
- Fit/contact: `clamp(2rem, 6vw, 6rem)`

## Borders & Elevation

- Default border: `1px solid var(--ink)` — used on cards, header (scrolled), hero badge, service cards, form
- Subtle border: `1px solid var(--line)` — section dividers, footer
- Elevated/offset: `box-shadow: 4px 4px 0 var(--ink)` on nav icon and menu toggle (hard offset, no blur)
- Hero badge offset: `box-shadow: 10px 10px 0 var(--ink)`
- Philosophy mark: `box-shadow: 18px 18px 0 var(--peach)`
- Card hover: `box-shadow: var(--shadow)` (soft blur)

**Corner radii:**
- Buttons and pill tags: `border-radius: 999px`
- Everything else: `border-radius: 0` (sharp, editorial)

## Buttons

| Variant | Background | Color | Notes |
|---|---|---|---|
| Primary | `var(--ink)` | `var(--cream)` | Main CTA |
| Secondary | `transparent` | `var(--ink)` | Hover: peach background |

- Min height: `46px`
- Padding: `0.9rem 1.1rem`
- Hover: `transform: translateY(-2px)`
- Uppercase, tracked, heavy weight

## Motion

**Scroll reveals:** All `.reveal` elements start at `opacity: 0, translateY(N)` and animate in with GSAP `power3.out`.
- Slow (`data-reveal-speed="slow"`): 1.05s duration, starts at `y: 40px` — section headings and intro blocks
- Normal (default): 0.8s duration, starts at `y: 32px` — cards, list items
- Fast (`data-reveal-speed="fast"`): 0.55s duration, starts at `y: 20px` — available for use
- Respects `prefers-reduced-motion` (immediately visible, no animation)

**3D project hover:** GSAP `power3.out`, `perspective: 1200px`, rotates on mousemove. Restores 0.7s on pointer leave.

**Card hover:** `transform: translateY(-8px) rotate(-0.5deg)` over 280ms ease.

**Mobile menu:** Slides in from right, `transform: translateX(0)`, `cubic-bezier(0.16, 1, 0.3, 1)` 420ms.

**Hero attention section:** `@keyframes attention-tilt` — subtle skew + translate loop every 5s.

**Orbit text:** `@keyframes spin` — 18s linear infinite rotation.

**Easing rules:**
- Always `power3.out` (or CSS `ease-out`) for reveals and interactions
- No bounce, elastic, or back eases
- No layout property animations (width, height, margin, top, left)

## Texture

A subtle dot grid overlay covers the entire page via `body::before`:
```css
body::before {
  background-image: radial-gradient(var(--ink) 0.7px, transparent 0.7px);
  background-size: 9px 9px;
  opacity: 0.035;
  mix-blend-mode: multiply;
  pointer-events: none;
}
```

## Components

### Hero
- Full-viewport min-height, 2-column grid (copy + visual)
- Visual: lazy-loaded 3D signature mark canvas, or fallback "YG" blob
- Hero badge: bottom-right positioned, sage background, hard shadow
- Orbit text animates around the visual

### Navigation
- Fixed header, transparent until scrolled (then cream/blur)
- Desktop: logo left, nav center, CTA+icon right
- Mobile: hamburger icon (peach background, hard shadow), slide-in panel
- Mobile panel: numbered links at display scale, tagline at top

### Project Cards
- Alternating left/right layout (`.project-card-offset`)
- Each card: visual (link) + meta (number, title, context, problem/move DL, text-link)
- Background colors: lustro=peach, soku=sage, pan=peach blend

### Service Cards
- 3-column grid (→ 2-column at 820px → 1-column at 980px)
- Featured card: dark (ink) background, lifts `translateY(-1.2rem)` on desktop

### Form
- Dark background (ink), cream text
- Focus state: coral border + coral glow ring
- Inputs: 16% cream opacity on dark background

## Anti-patterns (never use)
- Side-stripe `border-left` accents on cards or alerts
- Gradient text (`background-clip: text`)
- Glassmorphism cards
- Hero metric template (big number + stats)
- Identical card grids (icon + heading + text repeated)
- Bounce or elastic eases
- `#000` or `#fff` (use `--ink` and `--cream`)
- Em dashes (`—` or `--`)
- Gold or any off-brand colors outside the 5-color palette
