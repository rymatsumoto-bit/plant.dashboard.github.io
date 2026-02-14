# CLAUDE.md - Plant Care Dashboard Project

---

## 🔒 Document Usage Rules

**This document is the authoritative specification for the project.**

### For AI Assistants:
1. **All project chats must follow these rules** - this ensures consistency across conversations
2. **Never rewrite this entire file**
3. **Only propose exact replacements** for specific sections using clear before/after markers
4. **Wait for human approval** before considering any changes applied

### For Project Owner:
- You maintain the authoritative version
- Review all proposed changes before applying
- Update this file as the single source of truth

---

## Notes for AI Assistants

### Context Continuity
- This is an ongoing project with multiple conversation threads
- Always reference and build upon previous decisions and files
- Maintain consistency across all artifacts and documentation

### Working with Project Files
**IMPORTANT:** The project owner maintains all working files (HTML, CSS, JS) in the project folder and uploads them to conversations as needed. 

**Instructions:**
1. **Reference uploaded files** for current code state - do not rely on code snippets in CLAUDE.md
2. **Use the folder structure** (shown in "Current File Structure" section) when building future code
3. **Request file uploads** if you need to see current code before making modifications
4. **Generate new code** following the established folder structure and naming conventions

### Code Generation Protocol
**To optimize token usage, follow this two-step process:**

1. **First Response - Summary Only:**
   - When asked about code changes, creation, or modifications, provide ONLY a summary/plan
   - Describe what files would be affected
   - Outline what changes would be made in the shortest way possible
   - Explain the approach and logic
   - **Do NOT generate actual code**

2. **Second Response - Code Generation:**
   - Wait for explicit request: "Please generate the code" or similar
   - Only then provide the actual code implementation
   - Follow the established folder structure and conventions

**Exception:** Only skip the summary step if the user explicitly requests code immediately (e.g., "write the code for...").

---

## Project Overview

**Project Name:** Plant Care Dashboard  
**Project Owner:** Ricardo Matsumoto  
**Status:** In Development - Requirements Phase  
**Last Updated:** Januray 17, 2026

### Purpose
A comprehensive tracking and forecasting system designed to optimize plant care management by combining historical data and environment information with predictive analytics to enable proactive plant health management.

### Goals
- Facilitate plant care
- Provide actionable insights for plant health
- Improve plant care management

---

## Problem Statement

Plant care requires consistent monitoring and timely interventions across multiple activities (watering, fertilizing, repotting, pest management). Even though there are current solutions out there, most of them don't take into consideration their environment, or are focused on only one aspect of care, such as watering or pest identification.

---

## Solution Approach

A solution that combines plant historical data and environment information, enhanced with predictive forecasting, that will enable pro-active management and identify problems before they happen.

---

## Project Components

### 1. Data Input Method
- Log plant care activities (watering, fertilizing, repotting, pest occurrences, pest treatments)
- Capture: date/time, plant identifier, activity type, notes
- Inputs are being captured via web forms.

### 2. Data Storage & Structure
- Organize historical care data in structured format
- Fields: Plant ID/Name, Activity Type, Date, Frequency, Notes
- Format compatible with both Python processing and dashboard tools

### 3. Data Processing & Forecasting
- Data pipeline: Input → Python Processing → Dashboard
- Calculate schedules based on historical patterns
- Predict upcoming care needs (watering, fertilizing, repotting)
- Analyze pest patterns and generate treatment schedules
- Output: processed data with forecasted dates/activities

### 4. Dashboard Visualization
- Free tools: Tableau Public, Google Looker Studio
- Display: upcoming schedule, historical logs, health metrics
- Visual timeline of past and forecasted activities
- Building in html/js/py style

---

## Technology Stack

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla JS)

### Backend
- Python (for forecasting algorithms)
- Render (FastAPI)
- Daily batches: Render cron

### Storage
- Supabase
- localStorage / sessionStorage (for web-based solution)

---

## Project Files

### Documentation
- `CLAUDE.md` - This file, project context for AI assistants
- `DECISIONS.md` - Record of all key decisions with reasoning
- `FEATURES.md` - Detailed feature specifications
- `DATA-SCHEMA.md` - Database tables and data structures
- `LOGIC.md` - Calculations, algorithms, and forecasting logic

### Working Files
All project files (HTML, CSS, JS, PY, MD) are maintained in the project folder and uploaded by the project owner. AI assistants should reference these uploaded files for current code state rather than relying on code snippets in this document.

### Current File Structure
```
plant-care-dashboard/
│
├── frontend/                              # First level views
│   ├── index.html                          # Main application shell
│   │
│   ├── css/
│   │   ├── main.css                        # Import all css files, to be the single reference in all html files
│   │   ├── reset.css                       # CSS reset
│   │   ├── variables.css                   # Design tokens (colors, spacing, etc.)
│   │   ├── base.css                        # Base styles and utilities
│   │   ├── layout.css                      # Layout structure (sidebar, main content)
│   │   ├── components/
│   │   │   ├── alerts.css                  # Alerts related elements
│   │   │   ├── buttons.css                 # Button styles
│   │   │   ├── cards.css                   # Card components
│   │   │   ├── charts.css                  # Chart styles
│   │   │   ├── chunks.css                  # Styles of sections of the dashboard
│   │   │   ├── empty-state.css             # Style for emtpy state
│   │   │   ├── forms.css                   # Forms styles
│   │   │   ├── loading.css                 # Style for loading data
│   │   │   ├── modal.css                   # Modal styling
│   │   │   ├── tables.css                  # Table and list styles
│   │   │   └── charts.css                  # Chart components (placeholder)
│   │   ├── features/
│   │   │   ├── dashboard.css               # Dashboard-specific styles
│   │   │   ├── inventory.css               # Inventory feature styles
│   │   │   ├── reports.css                 # Reports feature styles
│   │   │   ├── configuration.css           # Configuration feature styles
│   │   │   └── settings.css                # Settings feature styles
│   │   └── responsive.css                  # Media queries
│   │
│   ├── views/                              # First level views
│   │   ├── dashboard.html                  # Main dashboard view
│   │   ├── reports.html                    # Reports view
│   │   ├── inventory.html                  # Plant inventory
│   │   ├── configuration.html              # Plant parameter configuration
│   │   └── settings.html                   # System configuration
│   │
│   ├── components/                         # Reusable UI components
│   │   ├── configuration-tabs/             # Tabs under configuration view
│   │   │   ├── address.html                # Content for address configuration
│   │   │   └── habitat.html                # Content for habitat configuration
│   │   └── modals/                         # Reusable modal componentes
│   │       └── activity/                   # Modal componentes of each type of activity
│   │       │   └── watering.html           # Modal for watering activity
│   │       ├── prompt-modal.html           # Modal shell/container
│   │       ├── light-artificial.html       # Form content for artifical light details
│   │       ├── light-outdoor.html          # Form content for outdoor light details
│   │       ├── light-window.html           # Form content for window light details
│   │       └── new-activity.html           # Form content for new activity log
│   │
│   ├── js/                                 # JavaScript modules
│   │   ├── app.js                          # Main entry point
│   │   ├── router.js                       # View loading and navigation
│   │   ├── utils.js                        # Utility functions
│   │   ├── components/
│   │   │   └── breadcrumb.js               # Breadcrumb component logic
│   │   ├── modals/
│   │   │   ├── activity/                   # loading view of activities
│   │   │   │   └── watering.js             # watering
│   │   │   ├── light-modal.js              # loading view of light details
│   │   │   └── prompt-modal.js             # Modal logic and management
│   │   ├── views/
│   │   │   ├── dashboard.js                # Dashboard-specific logic
│   │   │   ├── reports.js                  # Reports-specific logic
│   │   │   ├── inventory.js                # Inventory-specific logic
│   │   │   ├── configuration.js            # Configuration orchestrator (main)
│   │   │   ├── configuration/              # Configuration sub-modules
│   │   │   │   ├── habitat-manager.js      # Habitat CRUD and rendering
│   │   │   │   ├── address-manager.js      # Address CRUD and rendering
│   │   │   │   └── shared-utils.js         # Shared configuration utilities
│   │   │   └── settings.js                 # Settings-specific logic
│   │   └── services/
│   │       ├── supabase.js                 # Database queries and operations
│   │       └── storage.js                  # localStorage/sessionStorage helpers
│   │
│   └── assets/                             # Static assets
│		├── images/
│		│   └── icons/                      # Storage of icons
│		│   │   ├── activity/               # Icons for different activities
│		│   │   └── plants/                 # Icons for plant types
│		└── fonts/                          
│
├── backend/                             # Python related folders
│   ├── .env
│   ├── requirements.txt
│   ├── app.py
│   │
│   ├── config/
│   │   └── supabase.py                 # Supabase URL + service ke
│   │
│   ├── data/                           # Local data
│   │   └── cache/                      # Temp local data
│   │
│   ├── scripts/                       # python codes
│   │   ├── factors/                   # calculations for each factor
│   │   │   └── watering_due.py        # factor calculation for a watering due date
│   │   ├── factors_contribution/      # factor contribution for the overall plant status
│   │   │   └── watering_due.py        # 
│   │   ├── manager_plant_factor_contribution.py   # Driver of calculation of factor contribution for plant status
│   │   ├── manager_plant_factor.py                # Driver of calculation of each factor
│   │   ├── manager_plant_status.py                # Driver of calculation of plant status
│   │   └── manager_schedule.py                    # Driver to manage schedule items
│   │
│   └── utils/                          # Utility codes
│       ├── supabase_client.py          # Supabase connection logic
│       ├── dates.py                    # Date helpers
│       └── weather.py                  # Weather API integration
│
└── docs/
    ├── CLAUDE.md                       # This file
    ├── DATA-SCHEMA.md
    ├── LOGIC.md
    ├── FEATURES.md
    └── DECISIONS.md

```

---

## Current Status

### Completed
✅ Project overview and objectives defined  
✅ Four main components identified  
✅ Initial HTML dashboard shell created  
✅ Project overview presentation slide created  
✅ BRD draft started (pending updates)  
✅ File structure proposed

### In Progress
🔄 Business Requirements Document refinement  
🔄 Defining detailed data schema

### Pending
⏳ Data input form development  
⏳ Python forecasting algorithm development  
⏳ Dashboard visualization tool selection  
⏳ Integration between components  
⏳ Testing and validation

---

## Key Decisions

1. **Scope Focus:** Initial release focuses on core tracking and forecasting; excludes IoT integration, mobile apps, and multi-user features
2. **Technology Constraints:** Must use free/low-cost tools
3. **Target User:** Single user, personal plant care management
4. **Activities Tracked:** Watering, fertilizing, repotting (soil changes), pest occurrences, pest treatments
5. **Design Approach:** Modular components that can be developed and tested independently
6. **Data Input Architecture:** Web forms write directly to Supabase for user-facing inputs (plant profiles, care logging, alert actions). Python backend reads from Supabase for forecasting and alert generation, creating a clean separation between user interaction and intelligence layer.
7. **User Settings Storage:** Currently using browser localStorage for single-user simplicity. Future multi-user implementation will migrate to Supabase-based user preferences table with authentication. Timezone context stored with activities (`user_timezone` field) to support accurate forecasting and weather data alignment.
8. **Plant Lifecycle & Historical Data:** Plants can have complex lifecycles (given away, returned). System maintains complete historical chain via `previous_plant_id` linkage. User controls whether forecasting algorithms use full historical data or only current ownership period. Plant-habitat movements tracked over time to enable accurate environmental analysis of historical care activities.
9. **Status Architecture:** Plant status calculated daily via Python based on configurable factors (stored in lookup table for flexibility). Each factor contributes to severity score. An new event might trigger the recalculation (or not) of factors, factor contribution, and status.
10. **Schedule Architecture:** Each new activity might trigger the creation of a new schedule item or not.
11. **Daily Batch:** Only certain routines need to be run on a daily basis.

---

## Design Principles

- **User-Friendly:** Minimize data entry time (< 2 minutes per entry)
- **Modular:** Components can be updated independently
- **Accessible:** Web-based, works on modern browsers
- **Predictive:** Focus on proactive rather than reactive care
- **Visual:** Clear, intuitive dashboard presentation
- **Environment-Aware:** Incorporate environmental context into predictions

---

## Additional Context

*This section is reserved for additional information from other chat conversations in this project. Please add relevant context here as the project develops.*

---

## Questions & Considerations

- Python integration approach (Pyodide vs API) to be decided
- Hosting/deployment strategy to be defined
- Backup and data export strategy to be planned
- Sunrise/sunset API selection for location-based light scheduling
- Weather data polling frequency and caching strategy

---

*This document should be updated as the project evolves to maintain accurate context for all conversations.*