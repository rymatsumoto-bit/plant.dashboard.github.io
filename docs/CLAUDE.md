# CLAUDE.md - Plant Care Dashboard Project

---------------

## 🔒 Document Usage Rules

**This document is the authoritative specification for the project.**

### For AI Assistants:
1. **All project chats must follow these rules** - this ensures consistency across conversations
2. **Never rewrite this entire file**
3. **Only propose exact replacements** for specific sections using clear before/after markers
4. **Wait for human approval** before considering any changes applied

#### Context Continuity
- This is an ongoing project with multiple conversation threads
- Always reference and build upon previous decisions and files
- Maintain consistency across all artifacts and documentation

#### Working with Project Files
**IMPORTANT:** The project owner maintains all working files (HTML, CSS, JS). The project folder is connected to GitHub to have all refreshed files. 

**Instructions:**
1. **Reference uploaded files** for current code state - do not rely on code snippets in CLAUDE.md
2. **Use the folder structure** (shown in "Current File Structure" section) when building future code
3. **Request file uploads** if you need to see current code before making modifications
4. **Generate new code** following the established folder structure and naming conventions
5. **Supabase table schema** use the SCHEMA.md file

### For Project Owner:
- You maintain the authoritative version
- Review all proposed changes before applying
- Update this file as the single source of truth

### Code Generation Protocol
**To optimize token usage, follow this two-step process:**

1. **First Response - Summary Only:**
   - When asked about code changes, creation, or modifications, provide ONLY a summary/plan
   - Describe what files would be affected
   - Outline what changes would be made
   - Explain the approach and logic
   - **Do NOT generate actual code**

2. **Second Response - Code Generation:**
   - Wait for explicit request: "Please generate the code" or similar
   - Only then provide the actual code implementation
   - Follow the established folder structure and conventions

**Exception:** Only skip the summary step if the user explicitly requests code immediately (e.g., "write the code for...").

### Development Philosophy
- Start with functional prototypes
- Iterate based on real usage
- Keep implementation simple initially
- Add complexity only when needed

---------------

## Project Overview

**Project Name:** Plant Care Dashboard  
**Project Owner:** Ricardo Matsumoto  
**Status:** In Development - Requirements Phase  
**Last Updated:** December 29, 2025

### Purpose
A comprehensive tracking and forecasting system designed to optimize plant care management by combining historical data and environment information with predictive analytics to enable proactive plant health management.

### Goals
- Facilitate plant care
- Provide actionable insights for plant health
- Improve plant care management

---------------

## Problem Statement

Plant care requires consistent monitoring and timely interventions across multiple activities (watering, fertilizing, repotting, pest management). Even though there are current solutions out there, most of them don't take into consideration their environment, or are focused on only one aspect of care, such as watering or pest identification.

---------------

## Solution Approach

A solution that combines plant historical data and environment information, enhanced with predictive forecasting, that will enable pro-active management and identify problems before they happen.

---------------

## Project Components

### 1. Data Input Method
- Log plant care activities (watering, fertilizing, repotting, pest occurrences, pest treatments)
- Capture: date/time, plant identifier, activity type, notes
- Options being considered: Google Sheets, Excel, web forms, mobile apps

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

---------------

## Technology Stack

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla JS)

### Data Processing
- Python (for forecasting algorithms)
- To be integrated via Pyodide or API

### Visualization
- Tableau Public (under evaluation)
- Google Looker Studio (under evaluation)

### Storage
- Supabase (PostgreSQL) - Primary data storage
  - Plant profiles
  - Care action history
  - Habitat configurations
  - Alert and snooze records
- localStorage / sessionStorage (for UI state persistence)

---------------

## Data Flow Architecture

### Input Methods
**Web Forms → Supabase (Direct)**
- Plant profile management (name, location, species, care parameters)
- Manual care activity logging (watering, fertilizing, repotting)
- Alert interactions (snooze, mark as done)
- User preferences and settings

**Benefits:**
- Immediate, responsive user experience
- Simple CRUD operations
- No API latency for basic inputs
- Supabase handles validation and real-time updates

### Intelligence Layer
**Python Backend ↔ Supabase**
- Runs periodically (scheduled/cron job)
- Reads historical care data from Supabase
- Integrates external data sources (NOAA weather API)
- Generates forecasts and care recommendations
- Writes alerts and predictions back to Supabase
- Calculates plant status based on multiple factors
- Generates alerts (proactive care reminders, reactive environmental warnings, health pattern detection)
- Respects alert suppression periods (done/dismissed alerts)
- Integrates user-created reminders into alert logic

### Data Flow
```
User Input (Web) → Supabase ← Python Analysis Engine
                      ↓
                  Dashboard Display
```

**Design Rationale:**
- Separation of concerns: UI handles interaction, Python handles intelligence
- Scalable: Can add more data sources or forecasting models without touching frontend
- Maintainable: Each layer has clear responsibilities
- Tested approach: Snooze functionality validated as working prototype

---------------

## Database Schema Evolution

### Planned Additions

**Plant Lifecycle Tracking:**
- `plant.acquisition_timezone` - Timezone context for acquisition date
- `plant.previous_plant_id` - Links returned plants to their previous records
- `plant.use_historical_data` - User preference for forecasting calculations. This is only valid for plants that have been returned. Basically asking if the history of the previous period (before return) should be used.
- Lifecycle activity types: ACQUIRED, DECEASED, GIVEN_AWAY, RETURNED

**Plant-Habitat Movement History:**
- New table: `plant_habitat_history` - Tracks when plants moved between habitats
- Enables time-based environmental analysis
- Current habitat denormalized in `plant.habitat_id` for performance

**Rationale:**
- Preserve complete plant history for data integrity
- Give users control over forecasting behavior
- Enable accurate environmental correlation with historical care data
- Support complex real-world scenarios (plants moving, being given away, returning)

---------------

## Project Files

### Documentation
- `CLAUDE.md` - This file, project context for AI assistants
- `SCHEMA.md` - Table structure in supabase

### Working Files
All project files (HTML, CSS, JS) are maintained in the project folder and uploaded by the project owner. AI assistants should reference these uploaded files for current code状态 rather than relying on code snippets in this document.

## Current File Structure
```
plant-care-dashboard/
├── index.html                          # Main application shell
│
├── css/
│   ├── main.css                        # Import all css files, to be the single reference in all html files
│   ├── reset.css                       # CSS reset
│   ├── variables.css                   # Design tokens (colors, spacing, etc.)
│   ├── base.css                        # Base styles and utilities
│   ├── layout.css                      # Layout structure (sidebar, main content)
│   ├── components/
│   │   ├── badges.css                  # Badge and status indicators
│   │   ├── buttons.css                 # Button styles
│   │   ├── cards.css                   # Card components
│   │   ├── charts.css                  # Chart styles
│   │   ├── chunks.css                  # Styles of sections of the dashboard
│   │   ├── empty-state.css             # Style for emtpy state
│   │   ├── forms.css                   # Forms styles
│   │   ├── loading.css                 # Style for loading data
│   │   ├── modal.css                   # Modal styling
│   │   ├── tables.css                  # Table and list styles
│   │   └── charts.css                  # Chart components (placeholder)
│   ├── features/
│   │   ├── dashboard.css               # Dashboard-specific styles
│   │   ├── inventory.css               # Inventory feature styles
│   │   ├── reports.css                 # Reports feature styles
│   │   ├── configuration.css           # Configuration feature styles
│   │   └── settings.css                # Settings feature styles
│   └── responsive.css                  # Media queries
│
├── views/                              # First level views
│   ├── dashboard.html                  # Main dashboard view
│   ├── reports.html                    # Reports view
│   ├── inventory.html                  # Plant inventory
│   ├── configuration.html              # Plant parameter configuration
│   └── settings.html                   # System configuration
│
├── components/                         # Reusable UI components
│   ├── configuration-tabs/             # Tabs under configuration view
│   │   ├── address.html                # Content for address configuration
│   │   └── habitat.html                # Content for habitat configuration
│   └── modals/                         # Reusable modal componentes
│       └── activity/                   # Modal componentes of each type of activity
│       │   └── watering.html           # Modal for watering activity
│       ├── prompt-modal.html           # Modal shell/container
│       ├── light-artificial.html       # Form content for artifical light details
│       ├── light-outdoor.html          # Form content for outdoor light details
│       ├── light-window.html           # Form content for window light details
│       └── new-activity.html           # Form content for new activity log
│
├── js/                                 # JavaScript modules
│   ├── app.js                          # Main entry point
│   ├── router.js                       # View loading and navigation
│   ├── utils.js                        # Utility functions
│   ├── components/
│   │   └── breadcrumb.js               # Breadcrumb component logic
│   ├── modals/
│   │   ├── activity/                   # loading view of activities
│   │   │   ├── watering.js             # watering
│   │   ├── light-modal.js              # loading view of light details
│   │   └── prompt-modal.js             # Modal logic and management
│   ├── views/
│   │   ├── dashboard.js                # Dashboard-specific logic
│   │   ├── reports.js                  # Reports-specific logic
│   │   ├── inventory.js                # Inventory-specific logic
│   │   ├── configuration.js            # Configuration orchestrator (main)
│   │   ├── configuration/              # Configuration sub-modules
│   │   │   ├── habitat-manager.js      # Habitat CRUD and rendering
│   │   │   ├── address-manager.js      # Address CRUD and rendering
│   │   │   └── shared-utils.js         # Shared configuration utilities
│   │   └── settings.js                 # Settings-specific logic
│   └── services/
│       ├── supabase.js                 # Database queries and operations
│       └── storage.js                  # localStorage/sessionStorage helpers
│
├── python/                             # Python related folders
│   ├── config/
│   │   └── supabase.py                 # Supabase URL + service ke
│   ├── data/                           # Local data
│   │   └── cache/                      # Temp local data
│   ├── scripts/                        # Local data
│   │   ├── test_connection.py          # First script: "can I read Supabase?"
│   │   ├── metrics.py                  # Simple metrics
│   │   ├── forecasts.py                # Forecasting logic
│   │   └── alerts.py                   # Alert generation
│   └── utils/                          # Utility codes
│       ├── supabase_client.py          # Supabase connection logic
│       ├── dates.py                    # Date helpers
│       └── weather.py                  # Weather API integration
│
├── assets/                             # Static assets
│   ├── images/
│   │   └── icons/                      # Storage of icons
│   │   │   └── plants/                 # Icons for plant types
│   └── fonts/                          
│
└── docs/
    ├── CLAUDE.md                       # This file
    └── SCHEMA.md                       # Supabase table schema

```


---------------

## Navigation Structure

### Sidebar Menu
- **Logo:** main-logo.svg + "Plant Hub" title (v0.1.2)
- **Navigation Items:**
  1. **Dashboard** (nav-dashboard.svg) - Main overview and actionable items
  2. **Reports** (nav-reports.svg) - Analytics and insights
  3. **Inventory** (nav-inventory.svg) - Complete plant collection
  4. **Configuration** (nav-configuration.svg) - Parameters of care, such as habitats, addresses
  4. **Settings** (nav-settings.svg) - System settings

### Icon System
- **Format:** SVG (scalable, customizable)
- **Color Control:** CSS filters applied for consistency
- **Location:** `assets/images/icons/`
- **Navigation Icons:** All 20x20px, white color via filter

## Design System

### CSS Architecture
The project uses a modular CSS architecture for maintainability:

1. **reset.css** - Normalize browser defaults
2. **variables.css** - CSS custom properties (design tokens)
3. **base.css** - Base typography and utility classes
4. **layout.css** - Page structure (sidebar, main content)
5. **components/** - Reusable UI components
6. **features/** - Feature-specific styles
7. **responsive.css** - Mobile-first responsive design



---------------

## JavaScript Architecture

### Modular Structure
The project uses ES6 modules for a clean, maintainable JavaScript architecture, in the plant-care-dashboard/js folder.

### Module Loading

The project uses ES6 module imports/exports:
```javascript
// Export from module
export function myFunction() { /* ... */ }
export class MyClass { /* ...*/ }
// Import in another module
import { myFunction, MyClass } from './myModule.js';

**Note:** Requires `<script type="module">` in HTML and modern browser support.

### Manager Pattern

For complex views with multiple entity types, we use a **Manager Pattern** to organize code:

**Structure:**
- **Main Orchestrator** - Coordinates tab switching and delegates to managers
- **Entity Managers** - Handle CRUD operations for specific entity types
- **Shared Utilities** - Common functions used across managers

**Example: Configuration View**
configuration.js              # Orchestrator (~100 lines)
├── setupTabSwitching()       # Handle tab navigation
├── loadTabContent()          # Load HTML dynamically
└── Delegates to:
├── habitat-manager.js    # All habitat logic (~200 lines)
└── address-manager.js    # All address logic (~150 lines)

**Benefits:**
- Clear separation of concerns
- Easy to add new entity types
- Testable in isolation
- Reduced file size (no 800+ line monsters)
- Parallel development possible

**When to Use:**
- Views managing multiple entity types (habitats, addresses, plants)
- Features with CRUD operations
- Complex business logic that would exceed 300 lines
- When adding more entity types is expected

**File Naming Convention:**
- Orchestrator: `feature-name.js`
- Managers: `feature-name/entity-manager.js`
- Utilities: `feature-name/shared-utils.js`


### Modal System

#### Overview
The project uses a flexible, configuration-based modal system that can display different types of forms and content with dynamic button configurations.

#### Architecture

**Core Files:**
- `components/modals/prompt-modal.html` - Generic modal shell
- `js/modals/prompt-modal.js` - Modal management and configuration
- Individual content files (e.g., `new-activity.html`, `light-artificial.html`)

**Key Features:**
- Dynamic title and size configuration
- Flexible button configurations (labels, styles, actions)
- Automatic form validation
- Custom submit/close handlers
- Data population for edit forms
- Close methods: close button, backdrop click, Escape key

#### Usage

**Basic Modal Call:**
```javascript
import { openModal } from '../modals/prompt-modal.js';

openModal({
  title: 'Modal Title',
  contentUrl: 'components/modals/form-content.html',
  size: 'medium',  // 'small', 'medium', 'large'
  buttons: [
    { label: 'SAVE', type: 'primary', action: 'submit' },
    { label: 'CANCEL', type: 'secondary', action: 'close' }
  ],
  onSubmit: (data, modal) => {
    // Handle form submission
  },
  onClose: (modal) => {
    // Optional cleanup
  }
});
```

**Button Types:**
- `primary` - Primary action button (green)
- `secondary` - Secondary action (neutral gray)
- `danger` - Destructive action (red)
- `cancel` - Cancel action (yellow)

**Button Actions:**
- `submit` - Triggers form validation and onSubmit handler
- `close` - Closes modal and calls onClose handler
- `delete` - Prompts confirmation and calls onDelete handler

**Modal Sizes:**
- `small` - 400px max width (simple forms)
- `medium` - 600px max width (default)
- `large` - 800px max width (complex forms)

#### Examples

**Add New Activity:**
```javascript
openModal({
  title: 'Log New Activity',
  contentUrl: 'components/modals/new-activity.html',
  buttons: [
    { label: 'LOG ACTIVITY', type: 'primary', action: 'submit' },
    { label: 'CANCEL', type: 'secondary', action: 'close' }
  ],
  onSubmit: async (data, modal) => {
    await saveActivity(data);
    modal.querySelector('[data-action="close"]').click();
  }
});
```

**Edit Plant with Delete:**
```javascript
openModal({
  title: 'Edit Plant: Monstera',
  contentUrl: 'components/modals/edit-plant.html',
  data: { plant_name: 'Monstera', habitat_id: '123' },
  buttons: [
    { label: 'SAVE', type: 'primary', action: 'submit' },
    { label: 'DELETE', type: 'danger', action: 'delete' },
    { label: 'CANCEL', type: 'secondary', action: 'close' }
  ],
  onSubmit: async (data) => { /* save */ },
  onDelete: async () => { /* delete */ }
});
```

**Simple Confirmation:**
```javascript
openModal({
  title: 'Confirm Action',
  contentUrl: 'components/modals/confirm-message.html',
  size: 'small',
  buttons: [
    { label: 'CONFIRM', type: 'primary', action: 'submit' },
    { label: 'CANCEL', type: 'secondary', action: 'close' }
  ]
});
```

#### Adding New Modal Content

1. Create HTML file in `components/modals/your-form.html`
2. Content should include only the form/content (no wrapper)
3. Use semantic form elements with `name` attributes
4. Call `openModal()` with appropriate configuration

#### Form Data Handling

- Modal automatically collects FormData from `<form>` elements
- Form validation uses HTML5 constraints (required, pattern, etc.)
- Data passed to `onSubmit` handler as key-value object
- For edit modals, pass `data` config to pre-populate fields

#### Global Availability

The `openModal()` function is available globally via `window.openModal` for use in inline handlers if needed, though ES6 imports are preferred.

----------

### Key Modules

**app.js** - Application entry point
- Initializes router
- Sets up breadcrumb component
- Single source of initialization

**router.js** - Navigation controller
- Handles view loading
- Manages navigation state
- Updates URL and history
- Dispatches to view initializers

**utils.js** - Shared utilities
- Date formatting
- String manipulation
- Helper functions
- Used across all modules

**services/supabase.js** - Database layer
- All Supabase queries
- CRUD operations for plants, locations, care actions
- Single source of truth for data access
- Easy to mock for testing

**services/storage.js** - Browser storage
- localStorage wrapper
- sessionStorage wrapper
- User preferences management
- Error handling for storage operations

**views/*.js** - View-specific logic
- Isolated per feature
- Initialization functions
- Event handlers
- Data loading for specific views
- Complex views may have sub-folders with managers

**views/configuration/** - Configuration sub-modules
- Manager pattern implementation
- Each entity type has its own manager
- Shared utilities for common operations
- Orchestrator delegates to appropriate manager

**components/*.js** - Reusable components
- Self-contained UI components
- Can be used across multiple views
- Manage their own state and behavior

**modals/*.js** - Configuration of modal
- Defines modal structures and behaviours
- Can be called from anywhere


### Import Conventions
```javascript
// Services (always at top)
import { getPlants, addCareAction } from '../services/supabase.js';
import { saveToLocal } from '../services/storage.js';

// Components
import { updateBreadcrumb } from '../components/breadcrumb.js';

// Utils
import { formatDate, capitalize } from '../utils.js';
```

### Adding New Features

To add a new feature:

1. Create view HTML in `views/newFeature.html`
2. Create view JS in `js/views/newFeature.js`
3. Export `initializeNewFeature()` function
4. Import and register in `router.js`
5. Add navigation item if needed
6. Update breadcrumb names

---------------

## Code Organization Principles

### File Size Guidelines
- **Target**: 200-300 lines per file
- **Maximum**: 400 lines before considering split
- **Minimum**: 50 lines (avoid over-fragmentation)

### When to Create a Sub-Module
Split a file when:
1. File exceeds 400 lines
2. Multiple distinct responsibilities exist
3. Code can be developed/tested independently
4. Future expansion is expected

### Module Responsibilities
Each module should have:
- **Single Responsibility** - one clear purpose
- **Clear Interface** - exported functions are obvious
- **Minimal Dependencies** - import only what's needed
- **Self-Contained** - can be understood in isolation

### Folder Structure for Complex Features
views/
├── feature-name.js           # Orchestrator
└── feature-name/
├── entity1-manager.js    # Entity-specific logic
├── entity2-manager.js    # Entity-specific logic
└── shared-utils.js       # Common utilities

### Import/Export Conventions
```javascript
// Manager exports (entity-manager.js)
export async function initEntityManager() { }
export function getCurrentEntityId() { }
export function getLoadedEntities() { }

// Orchestrator imports (feature-name.js)
import { initEntityManager } from './feature-name/entity-manager.js';

// Shared utilities (shared-utils.js)
export function showLoadingState(elementId) { }
export function showEmptyState(elementId) { }
```

---------------

## Current Status

### Completed
✅ Project overview and objectives defined  
✅ Database schema designed and implemented in Supabase  
✅ Snooze functionality implemented (3-day snooze)  
✅ Phase 1 dashboard features defined  
✅ Color palette and design system established  
✅ Main HTML structure with logo and navigation  
✅ CSS styling system with custom properties  
✅ Database connection via Supabase  
✅ Real-time data loading and updates  
✅ Actionable Items view with working buttons  
✅ Dummy data created for testing  
✅ Modular JavaScript architecture (ES6 modules)  
✅ Breadcrumb navigation with multi-level support  
✅ Settings view accessible via top-right button  
✅ Modal system implemented for forms
✅ Refactored Configuration JavaScript into Manager Pattern
✅ Established code organization principles for complex features
✅ Configuration view with location management  
✅ Inventory view with plant grid  
✅ Form validation and submission  
✅ Add new activity
✅ Alert action framework (snooze functionality)
✅ Create "new plant" form


### In Progress
🔄 Python forecasting algorithm development  
🔄 Alert generation engine (calculated + user-created)
🔄 Alert suppression logic (prevent regeneration after done/dismiss)

### Pending
⏳ Plant detail component  
⏳ Add/Edit plant forms  
⏳ Add/Edit location forms  
⏳ User timezone selection in Settings (localStorage implementation)
⏳ Data export functionality  
⏳ Mobile responsive optimization  
⏳ Toast notification system
⏳ Plant lifecycle management (deceased, given away, returned)
⏳ Plant-habitat movement tracking and history
⏳ Historical data toggle for forecasting (use full history vs. current ownership only)
⏳ Plant status calculation system with factor mapping
⏳ Status factor display in UI (show which factors contribute to status)



---------------

## Key Decisions

1. **Scope Focus:** Initial release focuses on core tracking and forecasting; excludes IoT integration, mobile apps, and multi-user features
2. **Technology Constraints:** Must use free/low-cost tools
3. **Target User:** Single user, personal plant care management
4. **Activities Tracked:** Watering, fertilizing, repotting (soil changes), pest occurrences, pest treatments
5. **Design Approach:** Modular components that can be developed and tested independently
6. **Data Input Architecture:** Web forms write directly to Supabase for user-facing inputs (plant profiles, care logging, alert actions). Python backend reads from Supabase for forecasting and alert generation, creating a clean separation between user interaction and intelligence layer.
7. **User Settings Storage:** Currently using browser localStorage for single-user simplicity. Future multi-user implementation will migrate to Supabase-based user preferences table with authentication. Timezone context stored with activities (`user_timezone` field) to support accurate forecasting and weather data alignment.
8. **Plant Lifecycle & Historical Data:** Plants can have complex lifecycles (given away, returned). System maintains complete historical chain via `previous_plant_id` linkage. User controls whether forecasting algorithms use full historical data or only current ownership period. Plant-habitat movements tracked over time to enable accurate environmental analysis of historical care activities.
9. **Status & Alert Architecture:** Plant status calculated daily via Python based on configurable factors (stored in lookup table for flexibility). Each factor contributes to severity score. Alert system supports both calculated alerts (from forecasting/monitoring) and user-created reminders. Alerts track user actions (done/dismiss) and include suppression logic to prevent immediate regeneration. User reminders integrated with calculated alerts to avoid duplication.

---------------

## Design Principles

- **User-Friendly:** Minimize data entry time (< 2 minutes per entry)
- **Modular:** Components can be updated independently
- **Accessible:** Web-based, works on modern browsers
- **Predictive:** Focus on proactive rather than reactive care
- **Visual:** Clear, intuitive dashboard presentation
- **Environment-Aware:** Incorporate environmental context into predictions

---------------

## Configuration Features

The Configuration view uses a **tabbed layout** to manage multiple foundational entity types that require infrequent updates.

### Tab Navigation Pattern
- Horizontal tabs below the page header
- Each tab shows the same two-column layout: entity list (left) + detail form (right)
- Currently implemented tabs:
  1. **Habitat** - Environmental settings for plant locations
  2. **Address** - Location data for weather integration and sunrise/sunset calculations

### Habitat Management
Habitats define the environmental conditions where plants are located. The configuration interface allows users to create, edit, and delete habitats with the following parameters:

**Basic Information:**
- Habitat name (user-defined label)

**Light Exposure:**
- **Artificial Light:**
  - Strength levels: Low (<100 FC), Medium (100-500 FC), High (500-1000 FC), Very High (>1000 FC)
  - Schedule: Start/end times (fixed time or sunrise/sunset with location)
- **Natural Light - Window:**
  - Window direction: N, NE, E, SE, S, SW, W, NW (cardinal and ordinal directions)
  - Window size: Small (<10 sq ft), Medium (10-43 sq ft), Large (>43 sq ft)
- **Natural Light - Outdoor:** Boolean flag for outdoor exposure

**Temperature:**
- Controlled vs Non-Controlled
- If controlled: Minimum, Maximum, Average temperature values

**Humidity:**
- Levels: Low (<40%), Medium (30-60%), High (60-80%), Very High (>80%)

**Appliances:**
- Air Conditioning (AC)
- Heater
- Fan
- Humidifier

### Address Management
Addresses store location data used by light sources and weather integration. Users can create, edit, and delete addresses with the following parameters:

**Basic Information:**
- Address name (user-defined label, e.g., "Home", "Office")
- Postal code
- City
- State/Province (optional)
- Country

**Geographic Coordinates:**
- Latitude (decimal degrees)
- Longitude (decimal degrees)
- Used for precise sunrise/sunset calculations

**Timezone:**
- Timezone identifier (e.g., "America/Los_Angeles")
- Used for accurate time-based lighting schedules

**Usage:**
- Referenced by artificial light sources (for sunrise/sunset scheduling)
- Referenced by window light sources (for location-based light calculations)
- Referenced by outdoor light sources (for weather data integration)
- Will be used to fetch real-time weather data from NOAA API

### Data Integration
Lighting location data (zip code/GPS) will be used to:
- Fetch real-time weather data from NOAA API
- Calculate sunrise/sunset times for light scheduling
- Incorporate environmental factors into care forecasting algorithms

### User Interface
- Two-panel layout: habitat list (left) and form (right)
- Progressive disclosure: subsections reveal based on user selections
- Visual indicators for habitat characteristics in the list view
- Edit/delete actions for existing habitats

---------------

## Plant Status & Alert System

### Plant Status Calculation

Plant status is calculated **daily via Python backend** based on multiple factors that contribute to an overall severity score.

**Status Levels:**
- **HEALTHY** (severity: 0) - All factors within ideal range
- **ATTENTION** (severity: 1) - Few mild factors outside ideal range  
- **WARNING** (severity: 2) - Multiple mild factors or a critical factor outside ideal range
- **URGENT** (severity: 3) - Multiple parameters overdue or critical issue
- **DECEASED** (severity: 4) - Plant has died (historical record)

**Status Factor System:**
- Each factor contributes to the severity score
- Factor-to-severity mapping stored in lookup table for flexibility
- Factors can be added/modified as the model evolves
- Initial factor: **Days since last watering** (adaptive per plant based on historical frequency)

**Status Display Requirements:**
- When status is non-healthy, UI must show which specific factors are contributing
- Example: "ATTENTION: Watering overdue by 2 days, Low humidity"

**Database Schema Additions Needed:**
```sql
-- Factor configuration table
CREATE TABLE status_factor_lookup (
    factor_code TEXT PRIMARY KEY,
    factor_name TEXT,
    severity_contribution INTEGER,  -- How much this adds to severity score
    is_active BOOLEAN DEFAULT TRUE
);

-- Track which factors triggered current status
CREATE TABLE plant_status_factors (
    plant_id UUID REFERENCES plant(plant_id),
    status_history_id UUID REFERENCES plant_status_history(plant_status_history_id),
    factor_code TEXT REFERENCES status_factor_lookup(factor_code),
    factor_value TEXT,  -- e.g., "5 days overdue"
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Alert System

Alerts are reminders that can be **calculated by the system** or **manually created by users**.

**Alert Categories:**

1. **Care Activity Alerts** (Proactive)
   - Watering due, Fertilizing due, Repotting reminder
   - Generated based on forecasting algorithms
   - Example: "Monstera needs water in 2 days"

2. **Environmental Alerts** (Reactive)
   - Temperature extremes, Light insufficient, Humidity low
   - Generated when habitat conditions are outside plant requirements
   - Example: "Living Room habitat too cold (58°F)"

3. **Health Alerts** (Critical)
   - Overwatering risk, Growth stagnation, Pest detected
   - Generated from pattern detection in activity history
   - Example: "Watered 3x this week - reduce frequency"

4. **Reminder Alerts** (User-Scheduled)
   - User-created future reminders
   - Must be incorporated into calculated alerts to avoid duplicates
   - Example: "Remind me to water in 3 days"

**Alert Actions:**
- **Mark as Done** - Logs corresponding activity, dismisses alert, updates plant status
- **Snooze** - Hides alert until snooze_until date (already implemented ✓)
- **Dismiss** - Ignores alert without logging activity

**Alert State Management:**
- Calculated alerts must track user actions (done/dismissed)
- When alert is marked done/dismissed, system prevents regeneration for a period
- Period duration depends on alert type (e.g., watering: don't alert again for X days)
- User-created reminders checked against calculated alerts to prevent duplicates

**Database Schema for Alerts:**
```sql
CREATE TABLE plant_alerts (
    alert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plant_id UUID REFERENCES plant(plant_id),
    alert_type TEXT,  -- 'WATERING_DUE', 'TEMP_LOW', 'PEST_DETECTED', etc.
    alert_category TEXT,  -- 'CARE', 'ENVIRONMENTAL', 'HEALTH', 'REMINDER'
    severity TEXT,  -- 'LOW', 'MEDIUM', 'HIGH'
    title TEXT,
    message TEXT,
    due_date DATE,
    source TEXT DEFAULT 'CALCULATED',  -- 'CALCULATED' or 'USER_CREATED'
    is_snoozed BOOLEAN DEFAULT FALSE,
    snooze_until DATE,
    is_dismissed BOOLEAN DEFAULT FALSE,
    dismissed_at TIMESTAMPTZ,
    suppress_until DATE,  -- Prevent regeneration until this date
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    resolved_action TEXT  -- 'MARKED_DONE', 'DISMISSED', NULL
);

-- Index for active alerts query
CREATE INDEX idx_active_alerts ON plant_alerts(plant_id, is_dismissed, is_snoozed) 
WHERE is_dismissed = FALSE;
```

**Python Processing Flow:**
1. Daily cron job runs `generate_alerts.py`
2. For each plant:
   - Forecast next care dates (watering, fertilizing, etc.)
   - Check environmental conditions against habitat data
   - Analyze activity patterns for health issues
   - Check for existing user reminders
3. Create new alerts only if:
   - No existing alert of same type for this plant
   - Not within suppress_until period from previous dismiss/done
   - Not duplicating a user-created reminder
4. Write alerts to database
5. Calculate and update plant status based on active alerts and factors

**Timeline:** Implement status and alert system in Phase 2 after basic forecasting is operational.

---------------

## Additional Context

*This section is reserved for additional information from other chat conversations in this project. Please add relevant context here as the project develops.*

---------------

## Questions & Considerations

- Python integration approach (Pyodide vs API) to be decided
- Hosting/deployment strategy to be defined
- Backup and data export strategy to be planned
- Sunrise/sunset API selection for location-based light scheduling
- Weather data polling frequency and caching strategy

---------------

## Future Enhancements

### Multi-User Support & Authentication
**Current State:** Single-user application with no authentication
- User timezone stored as default value in database (`America/New_York`)
- Settings stored in browser localStorage only
- No user accounts or login system

**Future Enhancement Plan:**
When multi-user support is needed:
1. Implement Supabase Authentication
2. Create `user_preferences` table with RLS policies
3. Migrate localStorage settings to database
4. Sync settings across devices per user
5. User-specific timezone selection in Settings UI

**Migration Path:**
```javascript
// Future migration function
async function migrateLocalPreferencesToSupabase(userId) {
    const localPrefs = loadFromLocal('userPreferences');
    if (localPrefs) {
        await savePreferencesToSupabase(userId, localPrefs);
    }
}
```

**Database Schema for Future:**
```sql
CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY,
    timezone TEXT DEFAULT 'UTC',
    theme TEXT DEFAULT 'light',
    notifications BOOLEAN DEFAULT true,
    language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    modified_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Timeline:** Implement when second user is added or cross-device sync is required.

### Plant Lifecycle & Historical Data Management

**Acquisition Tracking:**
- Acquisition date stored in both `plant` table and `plant_activity_history`
- `plant` table: stores "effective" acquisition date based on user preference
- Activity history: stores complete lifecycle timeline with timezone context
- Acquisition timezone captured for accurate date calculations

**Lifecycle Activity Types:**
- `ACQUIRED` - Initial acquisition or re-acquisition after return
- `DECEASED` - Plant died
- `GIVEN_AWAY` - Plant given to another person
- `RETURNED` - Plant returned to collection after being given away

**Returned Plants - Data Continuity:**
When a plant is given away and later returned:
1. Original plant record marked `is_active = false` with `GIVEN_AWAY` activity
2. New plant record created with `RETURNED` activity
3. Link maintained via `previous_plant_id` field to preserve historical relationship
4. User controls whether forecasting uses:
   - **Full history** (all data from original and current records)
   - **Current ownership only** (data from return date forward)

**Database Schema Requirements:**
```sql
-- Plant table additions
ALTER TABLE plant 
ADD COLUMN acquisition_timezone TEXT DEFAULT 'America/New_York',
ADD COLUMN previous_plant_id UUID REFERENCES plant(plant_id),
ADD COLUMN use_historical_data BOOLEAN DEFAULT false;

-- Activity type additions
INSERT INTO plant_activity_type_lookup 
(activity_type_code, activity_label, activity_category) 
VALUES 
('ACQUIRED', 'Acquired', 'lifecycle'),
('DECEASED', 'Deceased', 'lifecycle'),
('GIVEN_AWAY', 'Given Away', 'lifecycle'),
('RETURNED', 'Returned', 'lifecycle');
```

**Python Forecasting Integration:**
```python
def get_plant_care_history(plant_id, use_historical=False):
    if use_historical and plant.previous_plant_id:
        # Fetch data from both current and all previous plant records
        return get_complete_plant_history(plant_id)
    else:
        # Fetch data from current acquisition date only
        return get_care_since_acquisition(plant_id, plant.acquisition_date)
```

---

### Plant-Habitat Movement History

**Challenge:** Plants can be moved between habitats over time. Forecasting and environmental analysis require knowing which habitat a plant was in at any given point in history.

**Solution:** Track plant-habitat relationships over time with date ranges.

**Database Schema:**
```sql
CREATE TABLE plant_habitat_history (
    plant_habitat_history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plant_id UUID NOT NULL REFERENCES plant(plant_id),
    habitat_id UUID NOT NULL REFERENCES habitat(habitat_id),
    moved_date DATE NOT NULL,
    moved_timezone TEXT DEFAULT 'UTC',
    moved_out_date DATE,  -- NULL if still in this habitat
    is_current BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient queries
CREATE INDEX idx_plant_habitat_current ON plant_habitat_history(plant_id, is_current);
```

**Implementation Approach:**
1. When plant is moved to new habitat:
   - Previous record: set `moved_out_date` and `is_current = false`
   - New record: insert with `moved_date` and `is_current = true`
2. Current habitat stored in `plant.habitat_id` for quick access (denormalized)
3. Historical habitats queryable for environmental analysis

**Use Cases:**
- Python forecasting can determine which habitat's environmental conditions applied during any care activity
- Answer questions like: "Was this plant getting enough light when I last fertilized it 3 months ago?"
- Track if plant health changes correlate with habitat moves

**Python Example:**
```python
def get_habitat_at_date(plant_id, target_date):
    """Returns which habitat the plant was in on a specific date"""
    return query("""
        SELECT habitat_id FROM plant_habitat_history
        WHERE plant_id = ? 
        AND moved_date <= ?
        AND (moved_out_date IS NULL OR moved_out_date > ?)
    """, plant_id, target_date, target_date)
```

**Timeline:** Implement before environmental forecasting features that require historical habitat context.

---------------

*This document should be updated as the project evolves to maintain accurate context for all conversations.*