# Memory Index — Yellow Goat Co. Portfolio

- [Helen Chirinos — user profile](user_helen.md) — freelance front-end designer, runs Yellow Goat Co. solo studio, direct working style
- [Portfolio project state](project_portfolio.md) — full Vite+React site, current component state, desktop-only 3D hero assembly, and launch open items as of 2026-05-04
- [Workflow and collaboration preferences](feedback_workflow.md) — parallel agents, impeccable skill setup, form backend skip
- [Key design decisions](design_decisions.md) — gold removal, real screenshots in cards, hireme badge, copy direction, reveal variation, and tactile 3D website assembly direction

## Latest Update

- `SignatureMark.jsx` is now a desktop-only 3D brand moment rendered at 1100px+; phone and tablet layouts should not load the canvas because it slipped awkwardly under the hero.
- Open consideration: user likes the idea of showing the standalone `hireme.png` badge on tablet without bringing back the full 3D element. I think this is worth doing if it is placed as a simple editorial sticker/accent and does not crowd the hero copy.
- Desktop contact form was condensed: service type, project type, and timeline are dropdowns; budget stays as a write-in. Mobile contact remains the one-question-at-a-time wizard.
- Selected Work controls are prepared for more projects: desktop pills wrap inside the control row, mobile circles keep the pancake style with added bottom breathing room, and the decorative back plates behind the screenshot card are now tied to the visual column instead of the full two-column card.
- Desktop scale was corrected after design/QA review: non-hero headings, Philosophy/Before You Inquire, Process nodes, Fit cards, Services breakpoints, and the 981-1099px hero gap were reduced/normalized.
- Performance cleanup: `src/assets/projects/portal.png` was replaced in project data with optimized `portal.jpg` (1200px wide, about 220KB in build output instead of 3.1MB+).
- Senior copywriter pass applied: hero subtitle, Selected Work intro, Services intro, Fit proof copy, Launch Page service copy, and Philosophy headline were made more concrete, buyer-facing, and less overclaimed.
