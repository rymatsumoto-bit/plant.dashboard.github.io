# Logic & Algorithms Documentation

## About This Document

This document explains all calculations, forecasting algorithms, and business logic used in the Plant Care Dashboard. Intended for developers and data scientists who need to understand or modify the system's intelligence layer.

**Last Updated:** December 29, 2024

---

## Document Structure

Each algorithm includes:
- **Version**: Algorithm version number
- **Last Updated**: Date of last modification
- **Purpose**: What problem it solves
- **Input Data**: Required data points
- **Calculation Steps**: Detailed process
- **Pseudocode**: Simplified code example
- **Assumptions**: What we assume to be true
- **Constants**: Fixed values used
- **Future Improvements**: Planned enhancements

---

## Watering Frequency Calculation

### Algorithm Version: 1.0  
### Last Updated: 2024-12-29  
### Status: Planned

### Purpose
Predict when each plant needs to be watered next based on historical watering patterns and plant species requirements.

### Input Data
- Historical watering dates for specific plant
- Plant species (from plant_types table)
- Location environmental data (future: humidity, temperature)

### Calculation Steps

1. **Gather Historical Data**
   - Query last 10 watering events for the plant
   - Must have minimum 3 waterings for prediction
   - If < 3 waterings, use species default interval

2. **Calculate Average Interval**
   - For each pair of consecutive waterings, calculate days between
   - Average all intervals: `avg_interval = sum(intervals) / count(intervals)`
   - Remove outliers (>2 standard deviations from mean)

3. **Apply Species Factor**
   - Get species watering frequency from plant_types table
   - If user pattern differs significantly from species default, use weighted average:
     - `adjusted_interval = (avg_interval * 0.7) + (species_default * 0.3)`
   - This allows user patterns to dominate but keeps species knowledge as baseline

4. **Calculate Next Watering Date**
   - `next_water_date = last_watered_date + adjusted_interval`
   - Round to nearest day

5. **Generate Alert Threshold**
   - Create alert when: `days_since_last_water >= (adjusted_interval - 1)`
   - This gives 1-day buffer before overdue

### Pseudocode

```python
def calculate_next_watering(plant_id):
    # Get historical watering data
    watering_history = get_watering_history(plant_id, limit=10)
    
    if len(watering_history) < 3:
        # Not enough history, use species default
        plant = get_plant(plant_id)
        species = get_plant_type(plant.species)
        return last_watered_date + species.watering_frequency_days
    
    # Calculate intervals between waterings
    intervals = []
    for i in range(len(watering_history) - 1):
        days_between = (watering_history[i].date - watering_history[i+1].date).days
        intervals.append(days_between)
    
    # Remove outliers
    mean = sum(intervals) / len(intervals)
    std_dev = calculate_std_dev(intervals)
    filtered_intervals = [x for x in intervals if abs(x - mean) <= 2 * std_dev]
    
    # Calculate average interval
    avg_interval = sum(filtered_intervals) / len(filtered_intervals)
    
    # Apply species factor
    species_default = get_species_watering_frequency(plant.species)
    adjusted_interval = (avg_interval * 0.7) + (species_default * 0.3)
    
    # Calculate next watering date
    last_watered = watering_history[0].date
    next_watering = last_watered + timedelta(days=round(adjusted_interval))
    
    return next_watering

def should_generate_water_alert(plant_id):
    next_watering = calculate_next_watering(plant_id)
    today = date.today()
    
    # Alert if today is within 1 day of due date
    return today >= (next_watering - timedelta(days=1))
```

### Assumptions
- User waters plants on a relatively consistent schedule
- Historical pattern is better predictor than species default (70/30 weight)
- 3 waterings minimum needed for pattern detection
- Outliers (vacation periods, forgetfulness) should be removed
- Environmental factors constant (to be added in Phase 2)

### Constants
- **Minimum history required**: 3 waterings
- **Maximum history lookback**: 10 waterings
- **User pattern weight**: 70%
- **Species default weight**: 30%
- **Alert buffer**: 1 day before due
- **Outlier threshold**: 2 standard deviations

### Future Improvements (Phase 2+)
1. **Environmental Factors**
   - Adjust for indoor humidity levels
   - Adjust for seasonal temperature changes
   - Reduce frequency during rainy periods (outdoor plants)

2. **Machine Learning**
   - Use regression model instead of simple average
   - Predict seasonal variations
   - Account for plant growth stage

3. **Plant Health Feedback**
   - If plant shows overwatering symptoms, increase interval
   - If plant shows underwatering symptoms, decrease interval
   - Learn from user's snooze/dismiss patterns

4. **Location-Based Adjustments**
   - Plants in same location may have correlated needs
   - Outdoor plants affected by weather
   - Greenhouse plants have different evaporation rates

---

## Fertilizing Frequency Calculation

### Algorithm Version: 1.0  
### Last Updated: 2024-12-29  
### Status: Planned

### Purpose
Predict when each plant needs fertilizing based on plant species and growth season.

### Input Data
- Historical fertilizing dates
- Plant species fertilizing requirements
- Current season (optional enhancement)

### Calculation Steps

1. **Check Historical Data**
   - If user has fertilized this plant before, use historical pattern
   - Calculate average days between fertilizing events
   - Minimum 2 fertilizing events needed

2. **Use Species Default**
   - If no history or < 2 events, use species default
   - Most plants: 30-60 days (stored in plant_types table)

3. **Seasonal Adjustment (Future)**
   - Growing season (spring/summer): More frequent
   - Dormant season (fall/winter): Less frequent or none

4. **Generate Next Fertilizing Date**
   - `next_fertilize_date = last_fertilized_date + interval`

5. **Alert Threshold**
   - Generate alert 3 days before due date
   - Fertilizing is less time-critical than watering

### Pseudocode

```python
def calculate_next_fertilizing(plant_id):
    fertilize_history = get_fertilizing_history(plant_id, limit=5)
    
    if len(fertilize_history) >= 2:
        # Use historical pattern
        intervals = calculate_intervals(fertilize_history)
        avg_interval = sum(intervals) / len(intervals)
    else:
        # Use species default
        plant = get_plant(plant_id)
        species = get_plant_type(plant.species)
        avg_interval = species.fertilizing_frequency_days or 45  # default 45 days
    
    last_fertilized = fertilize_history[0].date if fertilize_history else plant.acquired_date
    next_fertilize = last_fertilized + timedelta(days=avg_interval)
    
    return next_fertilize

def should_generate_fertilize_alert(plant_id):
    next_fertilize = calculate_next_fertilizing(plant_id)
    today = date.today()
    
    # Alert 3 days before due
    return today >= (next_fertilize - timedelta(days=3))
```

### Assumptions
- Fertilizing less time-sensitive than watering
- Species defaults are reliable starting point
- User will establish pattern after a few fertilizing events
- No fertilizing during dormant season (future enhancement)

### Constants
- **Minimum history required**: 2 fertilizing events
- **Default fertilizing interval**: 45 days
- **Alert buffer**: 3 days before due

### Future Improvements
- Seasonal adjustments (more in summer, less in winter)
- Soil nutrient testing integration
- Growth rate correlation

---

## Repotting Prediction

### Algorithm Version: 1.0  
### Last Updated: 2024-12-29  
### Status: Planned

### Purpose
Remind users when plants may need repotting based on time since last repotting and plant growth rate.

### Input Data
- Last repotting date
- Plant species growth rate
- Plant age

### Calculation Steps

1. **Get Last Repotting Date**
   - Check activities table for last 'repot' event
   - If never repotted, use acquired_date as baseline

2. **Apply Species Growth Rate**
   - Fast-growing plants: every 12-18 months
   - Medium-growing: every 18-24 months
   - Slow-growing: every 24-36 months

3. **Calculate Next Repotting**
   - `next_repot_date = last_repot_date + growth_rate_interval`

4. **Alert Threshold**
   - Generate informational alert (low severity) 1 month before suggested date
   - User can dismiss if not needed

### Pseudocode

```python
def calculate_next_repotting(plant_id):
    plant = get_plant(plant_id)
    species = get_plant_type(plant.species)
    
    # Get last repotting or use acquired date
    repot_history = get_repotting_history(plant_id)
    last_repot = repot_history[0].date if repot_history else plant.acquired_date
    
    # Growth rate determines repotting interval
    growth_rate = species.growth_rate or 'medium'
    intervals = {
        'fast': 365,      # 12 months
        'medium': 548,    # 18 months
        'slow': 730       # 24 months
    }
    
    interval = intervals[growth_rate]
    next_repot = last_repot + timedelta(days=interval)
    
    return next_repot

def should_generate_repot_alert(plant_id):
    next_repot = calculate_next_repotting(plant_id)
    today = date.today()
    
    # Alert 30 days before suggested date
    # Low severity (informational)
    return today >= (next_repot - timedelta(days=30))
```

### Assumptions
- Repotting frequency based primarily on species growth rate
- Container size not tracked (future enhancement)
- User knows to dismiss if plant still has room to grow

### Constants
- **Fast-growing interval**: 12 months
- **Medium-growing interval**: 18 months
- **Slow-growing interval**: 24 months
- **Alert buffer**: 30 days before suggested date

### Future Improvements
- Track pot size changes
- Visual root-bound indicators
- User feedback on repotting necessity

---

## Alert Severity Calculation

### Algorithm Version: 1.0  
### Last Updated: 2024-12-29  
### Status: Planned

### Purpose
Determine severity level (low, medium, high) for each alert type based on how overdue the action is.

### Severity Levels

**Low (Informational)**
- Action upcoming but not yet due
- Proactive reminder

**Medium (Attention Needed)**
- Action is due within alert buffer period
- Should be addressed soon

**High (Urgent)**
- Action significantly overdue
- Plant health at risk

### Calculation by Alert Type

#### Watering Alerts
```python
def calculate_water_alert_severity(plant_id):
    next_water = calculate_next_watering(plant_id)
    days_overdue = (date.today() - next_water).days
    
    if days_overdue < -1:
        return 'low'      # More than 1 day early
    elif days_overdue <= 2:
        return 'medium'   # Due or 1-2 days overdue
    else:
        return 'high'     # 3+ days overdue
```

**Thresholds:**
- Low: >1 day before due
- Medium: Due to 2 days overdue
- High: 3+ days overdue

#### Fertilizing Alerts
```python
def calculate_fertilize_alert_severity(plant_id):
    next_fertilize = calculate_next_fertilizing(plant_id)
    days_overdue = (date.today() - next_fertilize).days
    
    if days_overdue < -3:
        return 'low'      # More than 3 days early
    elif days_overdue <= 7:
        return 'medium'   # Due or up to 1 week overdue
    else:
        return 'high'     # More than 1 week overdue
```

**Thresholds:**
- Low: >3 days before due
- Medium: Due to 7 days overdue
- High: 8+ days overdue

#### Repotting Alerts
```python
def calculate_repot_alert_severity(plant_id):
    next_repot = calculate_next_repotting(plant_id)
    days_overdue = (date.today() - next_repot).days
    
    if days_overdue < -30:
        return 'low'      # More than 30 days early
    elif days_overdue <= 60:
        return 'medium'   # Due or up to 2 months overdue
    else:
        return 'high'     # More than 2 months overdue
```

**Thresholds:**
- Low: >30 days before due
- Medium: Due to 60 days overdue
- High: 61+ days overdue

### Constants by Alert Type

| Alert Type | Low Threshold | Medium Threshold | High Threshold |
|------------|---------------|------------------|----------------|
| Water | >1 day early | Due to +2 days | +3 days or more |
| Fertilize | >3 days early | Due to +7 days | +8 days or more |
| Repot | >30 days early | Due to +60 days | +61 days or more |
| Pest | N/A | Always medium | If recurring: high |

---

## Pest Pattern Detection

### Algorithm Version: 1.0  
### Last Updated: 2024-12-29  
### Status: Future / Planned

### Purpose
Detect recurring pest problems and predict future occurrences.

### Approach (Not Yet Implemented)

**Phase 1: Simple Detection**
- If 2+ pest occurrences within 60 days → generate alert
- Suggest preventive treatment

**Phase 2: Pattern Recognition**
- Seasonal patterns (e.g., spider mites in winter)
- Location correlation (pests spreading between nearby plants)
- Treatment effectiveness tracking

### Future Implementation
This will be developed in Phase 2 after core features are operational.

---

## Data Quality Checks

### Algorithm Version: 1.0  
### Last Updated: 2024-12-29  
### Status: Planned

### Purpose
Validate data quality and flag inconsistencies for user review.

### Checks to Implement

**Watering Frequency Anomalies**
```python
def detect_watering_anomalies(plant_id):
    history = get_watering_history(plant_id, limit=10)
    intervals = calculate_intervals(history)
    
    mean = sum(intervals) / len(intervals)
    std_dev = calculate_std_dev(intervals)
    
    # Flag any interval > 3 standard deviations from mean
    anomalies = [x for x in intervals if abs(x - mean) > 3 * std_dev]
    
    if anomalies:
        # Suggest user review these dates for data entry errors
        return {
            'has_anomalies': True,
            'suspect_dates': get_dates_for_intervals(anomalies),
            'message': 'Unusual watering pattern detected. Please verify dates.'
        }
    
    return {'has_anomalies': False}
```

**Impossible Dates**
- Activity date before plant acquired
- Activity date in the future
- Duplicate activities on same date (possible but flagged)

**Missing Data**
- Plant with no activities for >90 days
- Alert user: "Update care logs to improve forecasting"

---

## Constants Reference

### Global Constants

```python
# Minimum data requirements
MIN_WATERING_HISTORY = 3
MIN_FERTILIZING_HISTORY = 2
MIN_REPOTTING_HISTORY = 1

# Default intervals (days)
DEFAULT_WATERING_INTERVAL = 7
DEFAULT_FERTILIZING_INTERVAL = 45
DEFAULT_REPOTTING_INTERVAL = 548  # 18 months

# Alert buffers (days before due)
WATER_ALERT_BUFFER = 1
FERTILIZE_ALERT_BUFFER = 3
REPOT_ALERT_BUFFER = 30

# Severity thresholds (days overdue)
WATER_SEVERITY_THRESHOLDS = {
    'medium': 0,    # Due or later
    'high': 3       # 3+ days overdue
}

FERTILIZE_SEVERITY_THRESHOLDS = {
    'medium': 0,    # Due or later
    'high': 8       # 8+ days overdue
}

REPOT_SEVERITY_THRESHOLDS = {
    'medium': 0,    # Due or later
    'high': 61      # 61+ days overdue
}

# Weighting factors
USER_PATTERN_WEIGHT = 0.7
SPECIES_DEFAULT_WEIGHT = 0.3

# Outlier detection
OUTLIER_STD_DEV_THRESHOLD = 2.0

# Data quality
ANOMALY_STD_DEV_THRESHOLD = 3.0
STALE_DATA_THRESHOLD = 90  # days
```

---

## Future Algorithm Enhancements

### Weather Integration (Phase 2)
- Reduce watering frequency during rainy periods
- Increase during heat waves
- Adjust for indoor humidity changes

### Machine Learning Models (Phase 3)
- LSTM neural networks for time-series forecasting
- Predict watering needs with higher accuracy
- Learn from user behavior patterns

### Multi-Plant Correlations (Phase 3)
- Plants in same location often have similar needs
- Learn from successful plant care patterns
- Recommend optimal care schedules

### Photo Analysis (Phase 4)
- Computer vision to detect overwatering/underwatering
- Pest identification from photos
- Growth tracking from images

---

*End of Logic & Algorithms Documentation*