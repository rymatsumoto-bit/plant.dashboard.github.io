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
   - Query all watering events for the plant
   - Must have minimum 5 waterings for prediction
   - If < 5 waterings, use species default interval

2. **Calculate Average Interval**
   - For each pair of consecutive waterings, calculate days between
   - Average all intervals: `avg_interval = sum(intervals) / count(intervals)`

3. **Calculate Next Watering Date**
   - `next_water_date = last_watered_date + adjusted_interval`
   - Round to nearest day

4. **Generate Schedule**
   - Create schedule when there is no active schedule (for the plant / activity type)
   - This gives 1-day buffer before overdue

### Assumptions
- User waters plants on a relatively consistent schedule
- 5 waterings minimum needed for pattern detection
- Environmental factors constant (to be added in later phase)

### Constants
- **Minimum history required**: 5 waterings

### Future Improvements (Phase 2+)
1. **Environmental Factors**
   - Adjust for indoor humidity levels
   - Adjust for seasonal changes
   - Reduce frequency during rainy periods (outdoor plants)

2. **Machine Learning**
   - Use regression model instead of simple average
   - Predict seasonal variations
   - Account for plant growth stage

3. **Plant Health Feedback**
   - If plant shows overwatering symptoms, increase interval
   - If plant shows underwatering symptoms, decrease interval
   - Learn from user's dismiss patterns

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

5. **Schedule Threshold**
   - Fertilizing is less time-critical than watering



### Assumptions
- Fertilizing less time-sensitive than watering
- Species defaults are reliable starting point
- User will establish pattern after a few fertilizing events
- No fertilizing during dormant season (future enhancement)

### Constants
- **Minimum history required**: 2 fertilizing events
- **Default fertilizing interval**: dependent of type of fertilizer

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

4. **Schedule Threshold**
   - User can dismiss if not needed


### Assumptions
- Repotting frequency based primarily on species growth rate
- Container size not tracked (future enhancement)
- User knows to dismiss if plant still has room to grow

### Constants
- **Fast-growing interval**: 12 months
- **Medium-growing interval**: 18 months
- **Slow-growing interval**: 24 months

### Future Improvements
- Track pot size changes
- Visual root-bound indicators
- User feedback on repotting necessity

---

## Schedule Severity Calculation

### Algorithm Version: 1.0  
### Last Updated: 2026-02-16
### Status: Planned

### Purpose
Determine severity level healthy, warning, attention, urgent) for each schedule item based on how overdue the item is.

### Severity Levels

**Healty**
- Item upcoming but not yet due

**Warning**
- Item is just overdue

**Attention**
- Item has been overdue for a little while

**Urgent**
- Item is very overdue


### Calculation by Schedule Type

#### Watering Due
**Thresholds:**
- Healthy: not overdue
- Warning: [1,2] days overdue
- Attention: [3,6] days overdue
- Urgent: 7+ days overdue

#### Fertilizing Due
**Thresholds:**
- TBD

#### Repotting Due

**Thresholds:**
**Thresholds:**
- TBD

---

## Pest Pattern Detection

### Algorithm Version: 1.0  
### Last Updated: 2024-12-29  
### Status: Future / Planned

### Purpose
Detect recurring pest problems and predict future occurrences.

### Approach (Not Yet Implemented)

**Phase 1: Simple Detection**
- If 2+ pest occurrences within 60 days → generate schedule
- Suggest preventive treatment

**Phase 2: Pattern Recognition**
- Seasonal patterns (e.g., spider mites in winter)
- Location correlation (pests spreading between nearby plants)
- Treatment effectiveness tracking

### Future Implementation
This will be developed in Phase 2 after core features are operational.

---

## Constants Reference

### Global Constants



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