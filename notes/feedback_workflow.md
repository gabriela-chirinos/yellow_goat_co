---
name: Workflow and collaboration preferences
description: How Helen prefers to work with Claude on this project
type: feedback
originSessionId: 0c3520e6-9521-4168-9f9b-afabb9a17853
---
Use parallel agents for multi-file or multi-concern tasks. Helen explicitly requested this and it worked well. Dispatching 2–3 specialist agents at once (CSS agent, component agent, infrastructure agent) is the expected pattern for larger changes.

**Why:** Helen works fast, batches requests, and doesn't want to wait for sequential execution when tasks are independent.

**How to apply:** Any time a task touches 3+ files or has clearly separable concerns (CSS vs. JSX vs. config), spawn parallel agents rather than doing it linearly.

---

Run `/impeccable` commands before any significant design work. The impeccable skill (with PRODUCT.md and DESIGN.md) is active on this project.

**Why:** Established at session start — the user invoked `/impeccable` and the skill loaded PRODUCT.md context.

**How to apply:** Before proposing design changes, load context with `node /Users/helenchirinos/.claude/skills/impeccable/scripts/load-context.mjs` from the project root.

---

Don't fix the contact form backend unprompted. The mailto: approach is intentional for now.

**Why:** User explicitly said "Don't worry about the form. I'll add that later" when reviewing the improvement plan.

**How to apply:** Skip form backend suggestions unless the user brings it up.
