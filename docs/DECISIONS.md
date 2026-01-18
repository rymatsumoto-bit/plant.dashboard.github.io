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

---

## [2024-12-29] Alert Management: Snooze & Dismiss Functionality

**Decision:** Alerts can be snoozed for 3 days or dismissed permanently

**Context:**  
Users need flexibility when plants show alerts but timing isn't right for immediate action. Some alerts may be false positives or not applicable to specific situations.

**Reasoning:**
- **Snooze (3 days)**: User acknowledges alert but can't act immediately (e.g., away on trip, waiting for supplies)
- **Dismiss**: Alert is incorrect, not applicable, or user chooses different care approach
- **3-day period**: Balances reminder frequency without becoming annoying

**Implementation:**
- Add `is_snoozed` boolean to alerts table
- Add `snoozed_until` date field
- Add `is_dismissed` boolean
- Add `dismissed_at` timestamp
- Dashboard filter: `WHERE !is_dismissed AND (snoozed_until IS NULL OR snoozed_until < TODAY())`

**Alternatives Considered:**
- Custom snooze duration (1-7 days): Too complex for MVP, can add later
- Only dismiss (no snooze): Less flexible for users
- Email reminders after snooze: Out of scope for Phase 1
- Multiple snooze levels: Overengineered

**Related Documents:**
- FEATURES.md: Alert Management System
- DATA-SCHEMA.md: alerts table

**Status:** Active

---

## [2024-12-29] Technology Stack: Vanilla JavaScript for MVP

**Decision:** Build MVP with vanilla JavaScript, CSS, and HTML - no framework

**Context:**  
Need to choose between vanilla JS, React, Vue, Angular, or other frameworks for initial development.

**Reasoning:**
- Faster initial development (no learning curve)
- Simpler deployment (GitHub Pages compatible)
- Validate product-market fit before framework investment
- Clean vanilla code enables future migration (estimated 1-2 months to Vue if needed)
- Focus on features and users, not technology

**Migration Path (if needed in future):**
- After 1 year of development
- If complexity warrants it (5+ interconnected views, complex state management)
- **Recommended target**: Vue.js (best fit for data/forms heavy app)
- **Estimated effort**: 4-8 weeks full-time migration
- Clean, modular vanilla JS now reduces future migration pain by ~30%

**Alternatives Considered:**
- **React**: Industry standard, but overkill for MVP. Migration: 6-10 weeks
- **Vue**: Best long-term choice for this project, but premature. Migration from vanilla: 4-8 weeks
- **Angular**: Way too heavy, steep learning curve. Migration: 10-16 weeks
- **Svelte**: Great tech, smaller ecosystem. Requires build process from day one
- **Alpine.js**: Good for enhancements, not full dashboard architecture

**Business Impact:**
- Vanilla JS vs React/Vue has minimal impact on acquisition value (0-5%)
- User growth and data quality are 50x more important than tech stack
- Clean code matters more than framework choice

**Related Documents:**
- CLAUDE.md: Technology Stack section

**Status:** Active

---

## [2024-12-29] Multi-Document Strategy for Project Documentation

**Decision:** Split project documentation into 5 specialized documents

**Context:**  
CLAUDE.md was becoming too long and mixing different types of information (decisions, features, data schema, logic). Hard to find specific information.

**Reasoning:**
- **Separation of concerns**: Each document serves distinct purpose
- **Searchability**: Easier to find specific information
- **Maintainability**: Update one area without affecting others
- **Onboarding**: New contributors can read relevant docs for their role
- **AI context**: Claude can reference specific documents as needed

**Document Structure:**
```
docs/
├── CLAUDE.md          # Project overview, AI instructions
├── DECISIONS.md       # Business/product decisions (this file)
├── FEATURES.md        # User-facing feature specifications
├── DATA-SCHEMA.md     # Database and data structures
└── LOGIC.md           # Calculations, algorithms, formulas
```

**Alternatives Considered:**
- Keep everything in CLAUDE.md: Too long, hard to navigate
- Wiki/Notion: External dependency, harder for AI to access
- Code comments only: Not searchable, scattered
- Single TECHNICAL.md: Still too broad, mixing concerns

**Usage Guidelines:**
- **Making a decision**: Add to DECISIONS.md with date and reasoning
- **Implementing a feature**: Update FEATURES.md status
- **Changing data**: Update DATA-SCHEMA.md
- **New calculation**: Document in LOGIC.md
- **AI context**: Reference specific documents as needed

**Related Documents:**
- CLAUDE.md: Document Usage Rules section

**Status:** Active

---

## [2024-12-29] File Structure: Flat Organization for Views/Components

**Decision:** Keep views and components at root level, not nested under /html/ folder

**Context:**  
Considering whether to group all HTML files under /html/ directory or keep them at root level.

**Current Structure:**
```
plant.dashboard.github.io/
├── views/              # Top level
├── components/         # Top level
├── css/
├── js/
└── assets/
```

**Alternative Considered:**
```
plant.dashboard.github.io/
├── html/
│   ├── views/
│   └── components/
├── css/
├── js/
└── assets/
```

**Reasoning:**
- Flatter structure = shorter paths, easier navigation
- /views/ and /components/ are clearly HTML by context and extension
- Less nesting when importing/referencing files
- Consistent with most modern frameworks (Next.js, Nuxt, etc.)
- /css/ and /js/ work well as top-level because they contain many files

**Status:** Active

---

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