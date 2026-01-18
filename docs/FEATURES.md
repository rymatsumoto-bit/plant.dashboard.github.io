# Feature Specifications

## About This Document

This document contains detailed specifications for all features in the Plant Care Dashboard. Each feature includes user stories, acceptance criteria, technical implementation details, and current status.

**Last Updated:** December 29, 2024

---

## Feature Template

```markdown
## Feature Name

**Status:** Planned / In Progress / Complete / Deprecated  
**Priority:** High / Medium / Low  
**Epic:** Category name

### User Stories
As a [user type], I want [goal] so that [benefit]

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

### Technical Implementation
- Component files
- Database changes
- API endpoints (if applicable)

### Dependencies
- Feature X must be complete
- Data structure Y must exist

### Related Documents
- DECISIONS.md: [Link to relevant decision]
- DATA-SCHEMA.md: [Relevant tables]
- LOGIC.md: [Relevant calculations]
```

---

## Alert Management System

**Status:** Planned  
**Priority:** High  
**Epic:** Dashboard Core Features

### User Stories

**As a plant owner, I want to:**
- See alerts for plants needing immediate care
- Understand why each alert was triggered
- Snooze alerts when I can't act immediately
- Dismiss alerts that don't apply to my situation
- View history of past alerts for each plant
- Have alerts prioritized by severity

### Acceptance Criteria

**Display:**
- [ ] Alerts display on dashboard with plant name, alert type, severity level
- [ ] Color-coded severity (red: high, yellow: medium, blue: low)
- [ ] Alert message explains why action is needed
- [ ] Shows days overdue (if applicable)

**Actions:**
- [ ] "Snooze" button hides alert for 3 days
- [ ] "Dismiss" button permanently removes alert
- [ ] "Mark as Done" logs corresponding activity and removes alert
- [ ] Action buttons clearly labeled and accessible

**Behavior:**
- [ ] Snoozed alerts reappear after 3 days
- [ ] Dismissed alerts never reappear (unless regenerated)
- [ ] Marking as done logs activity with current date
- [ ] Alert count badge updates in real-time

**History:**
- [ ] Alert history viewable per plant
- [ ] Shows when alert was created, snoozed, dismissed, or completed
- [ ] Filter alerts by type, severity, or status

### Technical Implementation

**UI Components:**
- `components/alert-card.html` - Individual alert display
- `views/actionable-items.html` - Alert dashboard view
- `components/alert-history.html` - Alert history modal

**Database:**
- Uses `alerts` table (see DATA-SCHEMA.md)
- Fields: alert_id, plant_id, alert_type, severity, is_snoozed, snoozed_until, is_dismissed

**JavaScript:**
- `js/alerts.js` - Alert management functions
- Functions: snoozeAlert(), dismissAlert(), markAsDone(), getActiveAlerts()

**Business Logic:**
```javascript
// Get active alerts
function getActiveAlerts() {
  return alerts.filter(a => 
    !a.is_dismissed && 
    (!a.snoozed_until || new Date(a.snoozed_until) <= new Date())
  );
}

// Snooze alert for 3 days
function snoozeAlert(alertId) {
  const alert = alerts.find(a => a.alert_id === alertId);
  alert.is_snoozed = true;
  alert.snoozed_until = addDays(new Date(), 3);
  saveToDatabase(alert);
}
```

### Dependencies
- [ ] plants table exists and populated
- [ ] activities table exists for logging
- [ ] Forecasting algorithm generates alerts (see LOGIC.md)

### Related Documents
- DECISIONS.md: [2024-12-29] Alert Management: Snooze & Dismiss
- DATA-SCHEMA.md: alerts table
- LOGIC.md: Alert Generation Logic (to be created)

---

## Activity Logging

**Status:** Planned  
**Priority:** High  
**Epic:** Data Input

### User Stories

**As a plant owner, I want to:**
- Quickly log when I water, fertilize, or repot plants
- Record pest occurrences and treatments
- Add notes about plant condition or observations
- Edit past activities if I made a mistake
- View activity history for each plant

### Acceptance Criteria

**Input Form:**
- [ ] Form accessible from dashboard and plant detail pages
- [ ] Select plant from dropdown
- [ ] Select activity type (water, fertilize, repot, pest_occurrence, pest_treatment)
- [ ] Date picker defaults to today
- [ ] Optional quantity and unit fields
- [ ] Optional notes field (multi-line text)
- [ ] Form validation prevents invalid data

**Submission:**
- [ ] Success confirmation after saving
- [ ] Error message if save fails
- [ ] Form clears after successful submission
- [ ] Can log multiple activities quickly (form stays open)

**History:**
- [ ] View all activities for a plant chronologically
- [ ] Filter by activity type
- [ ] Edit past activities (with confirmation)
- [ ] Delete activities (with confirmation)

### Technical Implementation

**UI Components:**
- `components/activity-form.html` - Activity input form
- `components/activity-history.html` - Activity timeline/list

**Database:**
- Uses `activities` table (see DATA-SCHEMA.md)

**JavaScript:**
- `js/activities.js` - Activity CRUD functions
- Functions: logActivity(), editActivity(), deleteActivity(), getPlantActivities()

**Form Validation:**
```javascript
function validateActivity(data) {
  // Date cannot be in future
  if (new Date(data.activity_date) > new Date()) {
    return { valid: false, error: 'Date cannot be in the future' };
  }
  
  // Date cannot be before plant acquired
  const plant = getPlant(data.plant_id);
  if (new Date(data.activity_date) < new Date(plant.acquired_date)) {
    return { valid: false, error: 'Date cannot be before plant was acquired' };
  }
  
  // Quantity must be positive if provided
  if (data.quantity && data.quantity <= 0) {
    return { valid: false, error: 'Quantity must be positive' };
  }
  
  return { valid: true };
}
```

### Dependencies
- [ ] plants table exists and populated
- [ ] Form UI components complete

### Related Documents
- DATA-SCHEMA.md: activities table
- LOGIC.md: Activity data used in forecasting

---

## Plant Inventory

**Status:** Planned  
**Priority:** High  
**Epic:** Plant Management

### User Stories

**As a plant owner, I want to:**
- See all my plants in one view
- Add new plants to my collection
- Edit plant information
- Archive plants I no longer have
- Filter plants by location
- Search plants by name or species

### Acceptance Criteria

**Inventory View:**
- [ ] Grid or list view of all active plants
- [ ] Each plant shows: name, species, location, status indicator
- [ ] Click plant to view details
- [ ] "Add Plant" button prominent and accessible

**Add Plant:**
- [ ] Form to enter: name, species, location, acquired date
- [ ] Optional notes field
- [ ] Species dropdown with common types
- [ ] Custom species entry allowed
- [ ] Form validation

**Edit Plant:**
- [ ] Edit all plant fields except plant_id
- [ ] Save button commits changes
- [ ] Cancel button reverts changes
- [ ] Confirmation for destructive actions

**Filtering:**
- [ ] Filter by location
- [ ] Filter by status (needs attention, healthy)
- [ ] Search by name (partial match)
- [ ] Clear filters button

### Technical Implementation

**UI Components:**
- `views/inventory.html` - Main inventory view
- `components/plant-card.html` - Individual plant card
- `components/plant-form.html` - Add/edit form
- `components/plant-detail.html` - Detailed view

**Database:**
- Uses `plants`, `locations`, `plant_types` tables

**JavaScript:**
- `js/plants.js` - Plant CRUD operations
- `js/inventory.js` - Inventory view logic

### Dependencies
- [ ] locations table populated
- [ ] plant_types reference data loaded

### Related Documents
- DATA-SCHEMA.md: plants, locations, plant_types tables

---

## Plant Detail View

**Status:** Planned  
**Priority:** Medium  
**Epic:** Plant Management

### User Stories

**As a plant owner, I want to:**
- View comprehensive information about a specific plant
- See activity history timeline
- See current and past alerts
- View care recommendations based on plant type
- Edit plant information from detail page

### Acceptance Criteria

**Information Display:**
- [ ] Plant name, species, location
- [ ] Acquired date and age
- [ ] Notes/observations
- [ ] Care requirements (from plant_type)

**Activity Timeline:**
- [ ] Chronological list of all activities
- [ ] Grouped by activity type
- [ ] Visual timeline representation
- [ ] Quick-log activity from detail page

**Alerts:**
- [ ] Current active alerts for this plant
- [ ] Alert history (snoozed, dismissed, completed)
- [ ] Alert action buttons

**Navigation:**
- [ ] Back to inventory button
- [ ] Edit plant button
- [ ] Next/previous plant buttons

### Technical Implementation

**UI Components:**
- `components/plant-detail.html` - Main detail view
- `components/activity-timeline.html` - Timeline component

**JavaScript:**
- `js/plant-detail.js` - Detail view logic
- Functions: loadPlantDetail(), refreshTimeline()

### Dependencies
- [ ] Plant inventory complete
- [ ] Activity logging complete
- [ ] Alert system complete

### Related Documents
- DATA-SCHEMA.md: plants, activities, alerts tables

---

## Dashboard Overview

**Status:** Planned  
**Priority:** High  
**Epic:** Dashboard Core Features

### User Stories

**As a plant owner, I want to:**
- See summary statistics (total plants, alerts, recent activities)
- View upcoming care tasks in a calendar or timeline
- Access quick actions (log activity, view alerts)
- Navigate to main sections easily

### Acceptance Criteria

**Statistics:**
- [ ] Total plant count
- [ ] Active alerts count
- [ ] Activities logged this week
- [ ] Plants needing attention

**Upcoming Tasks:**
- [ ] Next 7 days of forecasted care needs
- [ ] Grouped by activity type
- [ ] Click task to see plant detail or log activity

**Quick Actions:**
- [ ] "Log Activity" button opens form
- [ ] "View All Alerts" navigates to actionable items
- [ ] "Add Plant" button opens form

**Navigation:**
- [ ] Sidebar with main sections
- [ ] Section icons and labels
- [ ] Active section highlighted

### Technical Implementation

**UI Components:**
- `views/dashboard.html` - Main dashboard
- `components/stats-card.html` - Statistic display
- `components/upcoming-tasks.html` - Task list

**JavaScript:**
- `js/dashboard.js` - Dashboard logic
- Functions: loadDashboard(), calculateStats(), getForecastedTasks()

### Dependencies
- [ ] All core data tables exist
- [ ] Forecasting algorithm operational

### Related Documents
- LOGIC.md: Forecasting calculations

---

## Settings & Preferences

**Status:** Planned  
**Priority:** Low  
**Epic:** User Experience

### User Stories

**As a plant owner, I want to:**
- Set my timezone for accurate forecasting
- Choose theme (light/dark mode)
- Set default view on login
- Configure date format preference
- Export my plant data

### Acceptance Criteria

**Preferences:**
- [ ] Timezone selector (dropdown of common zones)
- [ ] Theme toggle (light/dark)
- [ ] Default view selection
- [ ] Date format options (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD)
- [ ] Temperature unit (F/C)
- [ ] Preferences saved to localStorage
- [ ] Preferences applied immediately

**Data Management:**
- [ ] Export all data as JSON
- [ ] Import data from JSON file
- [ ] Clear all data (with confirmation)
- [ ] Download plant activity reports

### Technical Implementation

**UI Components:**
- `views/settings.html` - Settings page

**JavaScript:**
- `js/settings.js` - Settings logic
- Uses localStorage for persistence (see DATA-SCHEMA.md)

### Dependencies
- None

### Related Documents
- DATA-SCHEMA.md: localStorage schema

---

## Future Features (Backlog)

### Weather Integration (Phase 2)
- Fetch local weather data
- Adjust watering recommendations based on rainfall
- Temperature alerts for sensitive plants

### Photo Gallery (Phase 2)
- Upload photos of plants
- Track growth over time
- Before/after comparisons

### Notifications (Phase 3)
- Email/push notifications for urgent alerts
- Daily/weekly care summary emails
- Customizable notification preferences

### Multi-User Support (Phase 3)
- User authentication
- Share plant collections
- Collaborative care tracking

### Mobile App (Phase 4)
- Native iOS/Android apps
- Camera integration for photo logging
- Offline support

---

*End of Feature Specifications*