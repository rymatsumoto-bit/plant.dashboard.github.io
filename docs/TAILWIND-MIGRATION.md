# Tailwind CSS Migration

## About This Document

This document tracks the incremental migration from custom CSS to Tailwind CSS.

**Decision Date:** 2026-03-20  
**Approach:** Incremental — Tailwind is used for all new components. Existing CSS files are migrated opportunistically when components are being edited anyway.  
**Reference:** See `DECISIONS.md` → "2026-03-20 Incremental Migration to Tailwind CSS" for full context and reasoning.

---

## Setup Checklist

- [ ] Install Tailwind CSS (`npm install -D tailwindcss postcss autoprefixer`)
- [ ] Run `npx tailwindcss init -p` to generate `tailwind.config.js` and `postcss.config.js`
- [ ] Configure `tailwind.config.js` content paths to scan `./src/**/*.{js,jsx}`
- [ ] Add Tailwind directives to `main.css` (`@tailwind base`, `@tailwind components`, `@tailwind utilities`)
- [ ] Map existing CSS variables from `variables.css` into `tailwind.config.js` theme (colors, spacing, border radius, etc.)
- [ ] Verify existing styles are unaffected after setup

---

## Migration Rules (for AI assistants and developers)

1. **New components** → use Tailwind only, no new custom CSS classes
2. **Existing components being edited** → opportunistically migrate that component's CSS to Tailwind
3. **Do not rewrite** components that aren't being touched
4. **CSS variables** in `variables.css` are the source of truth for design tokens until fully migrated; they should be reflected in `tailwind.config.js`
5. **Mark items below as complete** when a file has been fully migrated and its classes replaced with Tailwind equivalents in all JSX files that use them

---

## CSS Files — Migration Status

### `frontend/src/css/`

#### Base & Config
- [ ] `reset.css` — CSS reset; can likely be replaced by Tailwind's preflight
- [ ] `variables.css` — Design tokens; migrate values into `tailwind.config.js` theme extension (do last)
- [ ] `base.css` — Base body/heading styles and utility classes (`.hidden`, `.text-center`, margin helpers)
- [ ] `main.css` — Import orchestrator; update imports as files are retired

#### Components
- [ ] `components/buttons.css` — `.btn`, `.btn-small`, `.btn-primary`, `.btn-secondary`, `.btn-add`, `.btn-edit`, `.btn-delete`, `.btn-cancel`, `.btn-toggle`
- [ ] `components/cards.css` — `.card`, `.card-kpi`, `.card-habitat`, `.card-address`, `.card-title`, `.card-title-btn`, floating card animations (landing page)
- [ ] `components/chunks.css` — `.chunk-title`, `.chunk-container`, `.chunk-container-single-column`, `.chunk-container-1-1`, `.chunk-container-1-2`, `.chunk-container-2-1` — **high priority**, this is the main pain point
- [ ] `components/empty-state.css` — `.empty-state`
- [ ] `components/forms.css` — `.form-panel`, `.form-group`, `.form-label`, `.form-grid`, `.form-section`, `.form-backdrop`, `.form-static-value`
- [ ] `components/hero.css` — Landing page hero section styles
- [ ] `components/leaf.css` — Floating leaf animation (landing page)
- [ ] `components/main-content.css` — `.page-container`, `.main-content`, `.content`, `.header`
- [ ] `components/modal.css` — `.modal-panel`, `.modal-panel-header`, `.modal-panel-footer`, `.modal-error`, `.modal-detail-value`
- [ ] `components/schedule.css` — `.dash-schedule-item`, `.dash-schedule-plant`, `.dash-schedule-plant-icon` (severity colors), `.dash-schedule-badge`
- [ ] `components/sidebar.css` — `.sidebar`, `.sidebar-header`, `.nav-item`, `.nav-icon`, `.user-info`, `.user-details`
- [ ] `components/tables.css` — `.table`, `.table-header`, `.table-row`, `.table-activity`, `.table-activity-row`, `.table-activity-type-badge`, `.plant-name-cell`, `.status-icon`
- [ ] `components/toolbar.css` — `.toolbar`, `.toolbar-title`, `.search-container`, `.search-input`, `.toolbar-button-container`

#### Pages
- [ ] `pages/dashboard.css` — `#dashboard-schedule-list` scrollbar styles
- [ ] `pages/inventory.css` — `.status-badge`, `.plant-name`, `.plant-species`, `.btn-icon`, `.loading-spinner`
- [ ] `pages/landing.css` — All landing page specific styles (`.landing-body`, `.landing-nav`, `.landing-btn`, `.landing-features-grid`, `.landing-cta`, `.landing-footer`, card showcase animations)

---

## Completed Files

*None yet — migration not started*

---

## Notes

- `chunks.css` and `cards.css` are the highest priority pain points — tackle these first when the opportunity arises
- The landing page CSS (`landing.css`, `hero.css`, `leaf.css`) is low priority since that page changes infrequently
- `variables.css` should be migrated **last** since it underpins everything else
- During transition, both custom CSS classes and Tailwind classes will coexist in JSX files — this is expected and fine

---

*End of Tailwind Migration Tracker*