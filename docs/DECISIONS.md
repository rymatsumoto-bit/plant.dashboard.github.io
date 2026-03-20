# Decision Log

## About This Document

This document records all significant decisions made during the project. Each decision includes context, reasoning, alternatives considered, and current status.

**Purpose:** Provide searchable history of "why we did it this way"

**Format:**
- **Date**: When decided
- **Decision**: What was decided
- **Context**: Why it matters
- **Reasoning**: Why this choice
- **Alternatives Considered**: What else we looked at
- **Status**: Active / Deprecated / Superseded

------------------------------------------------------------------------------------------------

## [2026-03-20] Incremental Migration to Tailwind CSS

**Decision:** Adopt Tailwind CSS incrementally alongside the existing custom CSS system, rather than a big-bang rewrite or staying with pure custom CSS.

**Context:**  
The project had grown to ~15 custom CSS files (`chunks.css`, `cards.css`, `forms.css`, etc.) with increasing duplication and friction. Specific pain points:
- `chunk-container-1-1` and `chunk-container-2-1` were nearly identical, differing only in grid column ratios
- `card-habitat` and `card-address` were near-duplicates
- Layout intent (e.g. column ratios) was being encoded in CSS class names rather than components, making the CSS harder to maintain
- The team kept reinventing utility classes that Tailwind already solves well

The project is actively being built, so the friction compounds daily. This is the tipping point where Tailwind's value outweighs its setup cost.

**Reasoning:**
- Tailwind was designed to solve exactly the utility-class duplication problem being experienced
- Incremental adoption avoids a full rewrite (estimated 40-80 hours for big-bang approach)
- New components can use Tailwind immediately; old components migrate opportunistically when touched
- The existing CSS variable system (`variables.css`) can be mapped into `tailwind.config.js` to preserve design tokens
- React + Vite has excellent Tailwind support

**Implementation:**
- Install Tailwind alongside existing CSS (both coexist during transition)
- Do NOT rewrite existing components upfront
- Use Tailwind for all **new components** going forward
- Migrate old components when they are naturally being edited
- Track migration progress in `FEATURES.md` under the Tailwind Migration section

**Alternatives Considered:**
- **Stay with custom CSS**: Rejected — duplication and friction will only grow
- **Big-bang Tailwind rewrite**: Rejected — 40-80 hour estimate, high regression risk, not worth it at this stage
- **Inline styles for layout variants**: Rejected — gets messy fast, same problem as custom CSS but worse

**Related Documents:**
- `FEATURES.md`: Tailwind Migration — tracks per-file migration status
- `CLAUDE.md`: Technology Stack section

**Status:** Active

------------------------------------------------------------------------------------------------

## Template for Future Decisions

```markdown
## [YYYY-MM-DD] Decision Title

**Decision:** One sentence summary

**Context:**  
Why this decision needed to be made

**Reasoning:**
- Bullet points explaining the why
- Key factors that influenced decision

**Implementation:**
Technical details if applicable

**Alternatives Considered:**
- Option A: Why not chosen
- Option B: Why not chosen

**Related Documents:**
- Link to relevant sections in other docs

**Status:** Active / Deprecated / Superseded
```

---

*End of Decision Log*