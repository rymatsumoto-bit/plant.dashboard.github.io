# CLAUDE.md - Plant Care Dashboard Project

---------------

## 🔒 Document Usage Rules

**This document is the authoritative specification for the project.**

### For AI Assistants:
1. **Never rewrite this entire file**
2. **Only propose exact replacements** for specific sections using clear before/after markers
3. **Wait for human approval** before considering any changes applied
4. **All project chats must follow these rules** - this ensures consistency across conversations

### For Project Owner:
- You maintain the authoritative version
- Review all proposed changes before applying
- Update this file as the single source of truth

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

## Project Files

### Documentation
- `CLAUDE.md` - This file, project context for AI assistants

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
│   │   ├── empty-state.css             # Style for emtpy state
│   │   ├── forms.css                   # Forms styles
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
│   ├── modals/                         # Reusable modal componentes
│   │   ├── light-artificial.html       # Form content for artifical light details
│   │   ├── light-outdoor.html          # Form content for outdoor light details
│   │   ├── light-window.html           # Form content for window light details
│   │   └── prompt-modal.html           # Modal shell/container
│   └── plant-detail.html               
│
├── js/                                 # JavaScript modules
│   ├── app.js                          # Main entry point
│   ├── router.js                       # View loading and navigation
│   ├── utils.js                        # Utility functions
│   ├── components/
│   │   └── breadcrumb.js               # Breadcrumb component logic
│   ├── modals/
│   │   ├── light-modal.js              # loading view of light details
│   │   └── prompt-modal.js             # Modal logic and management
│   ├── views/
│   │   ├── dashboard.js                # Dashboard-specific logic
│   │   ├── reports.js                  # Reports-specific logic
│   │   ├── inventory.js                # Inventory-specific logic
│   │   ├── configuration.js            # Configuration-specific logic
│   │   └── settings.js                 # Settings-specific logic
│   └── services/
│       ├── supabase.js                 # Database queries and operations
│       └── storage.js                  # localStorage/sessionStorage helpers
│
├── assets/                             # Static assets
│   ├── images/
│   │   └── icons/                      
│   │       ├── main-logo.svg           # Main logo
│   │       ├── nav-dashboard.svg       # Dashboard nav icon
│   │       ├── nav-reports.svg         # Reports nav icon
│   │       ├── nav-inventory.svg       # Inventory nav icon
│   │       └── nav-configuration.svg   # Configuration nav icon
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
  4. **Configuration** (nav-configuration.svg) - System settings and preferences

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

### Modal System

#### Overview
The project uses a reusable modal system for forms and prompts. Modals are dynamically loaded and can display different content types.

#### How It Works

**1. Modal Shell (`prompt-modal.html`):**
- Contains the modal structure (overlay, header, body, footer)
- Has `id="modal-title"` for dynamic title
- Has `id="modal-body"` for dynamic content insertion
- Includes close button and action buttons

**2. Modal Content Files:**
- Individual HTML files for different modal types
- Contain only the form/content (no modal wrapper)
- Examples: `light-artificial.html`, `location-form.html`, etc.

**3. Modal JavaScript (`js/modals/prompt-modal.js`):**
- `openPromptModal(type)` - Loads modal shell and specific content
- Dynamically fetches HTML files using `loadHTML()`
- Handles form submission and validation
- Manages modal open/close lifecycle

#### Usage

**In View HTML (e.g., configuration.html):**
```html
<button onclick="openPromptModal('light-artificial')">+ Artificial Light</button>
```

**The function will:**
1. Load `components/modals/prompt-modal.html` (shell)
2. Load `components/modals/light-artificial.html` (content)
3. Insert content into modal body
4. Set title: "Add Artificial Light"
5. Display modal with fade-in animation

#### Adding New Modal Content

To add a new modal type:

1. **Create content HTML file:**
```
   components/modals/your-modal-type.html
```

2. **Call from button:**
```html
   <button onclick="openPromptModal('your-modal-type')">Open Modal</button>
```

3. **Optional: Add specific form logic in prompt-modal.js:**
```javascript
   function initFormLogic(type, modal) {
       if (type === 'your-modal-type') {
           // Custom validation or handlers
       }
   }
```

#### Key Features

- **Dynamic Loading:** Modal content loaded on-demand
- **Reusable Shell:** One modal structure for all types
- **Global Access:** `openPromptModal()` available via `window` object
- **Form Handling:** Automatic form submission handling
- **Close Methods:**
  - Click close button (×)
  - Click CANCEL button
  - Click outside modal (backdrop)
  - Press Escape key
- **Animations:** Fade-in effect on open

#### Modal CSS Classes
```css
.modal              /* Modal overlay (backdrop) */
.modal.show         /* Visible state */
.modal-content      /* Modal container */
.modal-header       /* Header section */
.modal-body         /* Dynamic content area */
.close-modal        /* Close button (×) */
```

#### Important Notes

- Modal function is globally available via `window.openPromptModal`
- Loaded in `app.js` and exposed globally for inline `onclick` handlers
- Uses ES6 modules internally but accessible from HTML
- Modal shell must have `id="modal-title"` and `id="modal-body"`
- Content files should contain only the form/content (no wrapper divs)

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

**components/*.js** - Reusable components
- Self-contained UI components
- Can be used across multiple views
- Manage their own state and behavior


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
✅ **Modal system implemented for forms**  

### In Progress
🔄 Configuration view with location management  
🔄 Form validation and submission  
🔄 Inventory view with plant grid  

### Pending
⏳ Plant detail component  
⏳ Add/Edit plant forms  
⏳ Add/Edit location forms  
⏳ Python forecasting algorithm development  
⏳ Data export functionality  
⏳ Mobile responsive optimization  
⏳ Toast notification system  



---------------

## Key Decisions

1. **Scope Focus:** Initial release focuses on core tracking and forecasting; excludes IoT integration, mobile apps, and multi-user features
2. **Technology Constraints:** Must use free/low-cost tools
3. **Target User:** Single user, personal plant care management
4. **Activities Tracked:** Watering, fertilizing, repotting (soil changes), pest occurrences, pest treatments
5. **Design Approach:** Modular components that can be developed and tested independently
6. **Data Input Architecture:** Web forms write directly to Supabase for user-facing inputs (plant profiles, care logging, alert actions). Python backend reads from Supabase for forecasting and alert generation, creating a clean separation between user interaction and intelligence layer.

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

### Data Integration
Habitat location data (zip code/GPS) will be used to:
- Fetch real-time weather data from NOAA API
- Calculate sunrise/sunset times for artificial light scheduling
- Incorporate environmental factors into care forecasting algorithms

### User Interface
- Two-panel layout: habitat list (left) and form (right)
- Progressive disclosure: subsections reveal based on user selections
- Visual indicators for habitat characteristics in the list view
- Edit/delete actions for existing habitats

---------------

## Notes for AI Assistants

### Context Continuity
- This is an ongoing project with multiple conversation threads
- Always reference and build upon previous decisions and files
- Maintain consistency across all artifacts and documentation

### Working with Project Files
**IMPORTANT:** The project owner maintains all working files (HTML, CSS, JS). The project folder is connected to GitHub to have all refreshed files. 

**Instructions:**
1. **Reference uploaded files** for current code state - do not rely on code snippets in CLAUDE.md
2. **Use the folder structure** (shown in "Current File Structure" section) when building future code
3. **Request file uploads** if you need to see current code before making modifications
4. **Generate new code** following the established folder structure and naming conventions
5. **Supabase table schema** use the SCHEMA.md file

### Development Philosophy
- Start with functional prototypes
- Iterate based on real usage
- Keep implementation simple initially
- Add complexity only when needed

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

---

*This document should be updated as the project evolves to maintain accurate context for all conversations.*