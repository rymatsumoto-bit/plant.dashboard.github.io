| table_markdown                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ## address

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| address_id | uuid | NO | gen_random_uuid() |
| address_name | text | NO |  |
| postal_code | text | NO |  |
| city | text | NO |  |
| state_province | text | YES |  |
| country | character | NO |  |
| timezone | text | NO | 'UTC'::text |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | NO | now() |
| modified_at | timestamp with time zone | NO | now() |
| latitude | double precision | NO |  |
| longitude | double precision | NO |  |
| user_id | uuid | YES | auth.uid() |

### Primary Key
- address_id

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ## alerts_active_view

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| alert_id | uuid | YES |  |
| alert_type | text | YES |  |
| alert_label | text | YES |  |
| alert_category | text | YES |  |
| alert_severity | text | YES |  |
| target_date | date | YES |  |
| plant_id | uuid | YES |  |
| plant_name | text | YES |  |

### Primary Key\n- (none)\n
### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ## batch

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| batch_id | uuid | NO | gen_random_uuid() |
| batch_type | text | NO |  |
| created_at | timestamp with time zone | NO |  |
| ended_at | timestamp with time zone | YES | now() |
| user_id | uuid | YES | auth.uid() |

### Primary Key
- batch_id

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ## compass_direction_lookup

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| direction_code | text | NO |  |
| full_name | character varying | NO |  |
| degrees | integer | NO |  |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | YES |  |
| modified_at | timestamp with time zone | YES |  |

### Primary Key
- direction_code

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ## factor_lookup

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| factor_code | text | NO |  |
| factor_name | text | NO |  |
| factor_category | text | NO |  |
| weight | numeric | YES | 1.0 |
| thresholds | jsonb | YES |  |
| description | text | YES |  |
| user_message_template | text | YES |  |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | NO | now() |
| modified_at | timestamp with time zone | NO | now() |

### Primary Key
- factor_code

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ## habitat

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| habitat_id | uuid | NO | gen_random_uuid() |
| habitat_name | text | NO |  |
| temperature_controlled | boolean | NO | false |
| temp_min | integer | YES |  |
| temp_max | integer | YES |  |
| temp_avg | integer | YES |  |
| humidity_level_id | uuid | YES |  |
| appliance_ac | boolean | NO | false |
| appliance_heater | boolean | NO | false |
| appliance_fan | boolean | NO | false |
| appliance_humidifier | boolean | NO | false |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | NO | now() |
| modified_at | timestamp with time zone | NO | now() |
| user_id | uuid | YES | auth.uid() |

### Primary Key
- habitat_id

### Foreign Keys
- humidity_level_id → habitat_humidity_level_lookup.humidity_level_id
                                                                                                                                                                                                                                                                                                                                                    |
| ## habitat_classifications

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| classification_id | uuid | NO | gen_random_uuid() |
| habitat_id | uuid | NO |  |
| environment_type | text | NO |  |
| climate_control | text | NO |  |
| calculated_avg_light_fc | integer | YES |  |
| calculated_avg_temp | numeric | YES |  |
| effective_humidity | text | YES |  |
| confidence_score | numeric | YES |  |
| classification_date | timestamp with time zone | YES |  |
| notes | jsonb | YES |  |

### Primary Key
- classification_id

### Foreign Keys
- habitat_id → habitat.habitat_id
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ## habitat_humidity_level_lookup

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| humidity_level_id | uuid | NO | gen_random_uuid() |
| humidity_level | text | NO |  |
| humidity_level_desc | text | NO |  |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | YES |  |
| modified_at | timestamp with time zone | YES |  |

### Primary Key
- humidity_level_id

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ## habitat_light_artificial

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| light_artificial_id | uuid | NO | gen_random_uuid() |
| light_name | text | NO |  |
| habitat_id | uuid | NO |  |
| address_id | uuid | NO |  |
| light_artificial_strength_id | uuid | NO |  |
| light_schedule_start_type_id | uuid | NO |  |
| start_time | time without time zone | YES |  |
| light_schedule_end_type_id | uuid | NO |  |
| end_time | time without time zone | YES |  |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | NO | now() |
| modified_at | timestamp with time zone | NO | now() |
| user_id | uuid | YES | auth.uid() |

### Primary Key
- light_artificial_id

### Foreign Keys
- address_id → address.address_id
- habitat_id → habitat.habitat_id
- light_artificial_strength_id → habitat_light_artificial_strength_lookup.light_artificial_strength_id
- light_schedule_end_type_id → habitat_light_schedule_end_type_lookup.light_schedule_end_type_id
- light_schedule_start_type_id → habitat_light_schedule_start_type_lookup.light_schedule_start_type_id
                                                                 |
| ## habitat_light_artificial_strength_lookup

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| light_artificial_strength_id | uuid | NO | gen_random_uuid() |
| light_artificial_strength | text | NO |  |
| light_artificial_strength_desc | text | NO |  |
| created_at | timestamp with time zone | YES |  |
| modified_at | timestamp with time zone | YES |  |
| is_active | boolean | NO | true |

### Primary Key
- light_artificial_strength_id

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ## habitat_light_outdoor

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| light_outdoor_id | uuid | NO | gen_random_uuid() |
| light_name | text | YES |  |
| habitat_id | uuid | NO |  |
| address_id | uuid | NO |  |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | NO | now() |
| modified_at | timestamp with time zone | NO | now() |
| user_id | uuid | YES | auth.uid() |

### Primary Key
- light_outdoor_id

### Foreign Keys
- address_id → address.address_id
- habitat_id → habitat.habitat_id
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ## habitat_light_outdoor_direction

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| habitat_light_outdoor_direction_id | uuid | NO | gen_random_uuid() |
| habitat_id | uuid | NO |  |
| direction_code | text | NO |  |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | NO | now() |
| modified_at | timestamp with time zone | NO | now() |
| user_id | uuid | YES | auth.uid() |

### Primary Key
- habitat_light_outdoor_direction_id

### Foreign Keys
- direction_code → compass_direction_lookup.direction_code
- habitat_id → habitat.habitat_id
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ## habitat_light_schedule_end_type_lookup

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| light_schedule_end_type_id | uuid | NO | gen_random_uuid() |
| light_schedule_end_type | text | NO |  |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | YES |  |
| modified_at | timestamp with time zone | YES |  |

### Primary Key
- light_schedule_end_type_id

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ## habitat_light_schedule_start_type_lookup

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| light_schedule_start_type_id | uuid | NO | gen_random_uuid() |
| light_schedule_start_type | text | NO |  |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | YES |  |
| modified_at | timestamp with time zone | YES |  |

### Primary Key
- light_schedule_start_type_id

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ## habitat_light_type_lookup

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| light_type_id | uuid | NO | gen_random_uuid() |
| light_type | text | NO |  |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | YES |  |
| modified_at | timestamp with time zone | YES |  |

### Primary Key
- light_type_id

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ## habitat_light_window

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| light_window_id | uuid | NO | gen_random_uuid() |
| light_name | text | YES |  |
| habitat_id | uuid | NO |  |
| address_id | uuid | YES |  |
| direction_code | text | YES |  |
| window_size_id | uuid | YES |  |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | NO | now() |
| modified_at | timestamp with time zone | NO | now() |
| user_id | uuid | YES | auth.uid() |

### Primary Key
- light_window_id

### Foreign Keys
- address_id → address.address_id
- direction_code → compass_direction_lookup.direction_code
- habitat_id → habitat.habitat_id
- window_size_id → habitat_light_window_size_lookup.window_size_id
                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ## habitat_light_window_size_lookup

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| window_size_id | uuid | NO | gen_random_uuid() |
| window_size | text | NO |  |
| window_size_desc | text | NO |  |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | YES |  |
| modified_at | timestamp with time zone | YES |  |

### Primary Key
- window_size_id

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ## plant

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| plant_id | uuid | NO | gen_random_uuid() |
| plant_name | text | NO |  |
| plant_type_id | uuid | NO |  |
| habitat_id | uuid | NO |  |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | NO | now() |
| modified_at | timestamp with time zone | NO | now() |
| acquisition_date | date | NO |  |
| source | text | NO |  |
| user_timezone | text | NO | 'America/New_York'::text |
| user_id | uuid | YES | auth.uid() |

### Primary Key
- plant_id

### Foreign Keys
- habitat_id → habitat.habitat_id
- plant_type_id → plant_type_lookup.plant_type_id
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ## plant_activity_history

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| activity_id | uuid | NO | gen_random_uuid() |
| plant_id | uuid | NO |  |
| activity_type_code | text | NO |  |
| activity_date | date | NO |  |
| quantifier | double precision | YES |  |
| unit | text | YES |  |
| notes | text | YES |  |
| result | text | YES |  |
| created_at | timestamp with time zone | NO | now() |
| user_timezone | text | NO | 'America/New_York'::text |
| user_id | uuid | YES | auth.uid() |

### Primary Key
- activity_id

### Foreign Keys
- activity_type_code → plant_activity_type_lookup.activity_type_code
- plant_id → plant.plant_id
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ## plant_activity_type_lookup

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| activity_type_code | text | NO |  |
| activity_label | text | NO |  |
| activity_category | text | NO |  |
| description | text | YES |  |
| requires_quantifier | boolean | NO | false |
| default_unit | text | YES |  |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | NO | now() |
| modified_at | timestamp with time zone | NO | now() |

### Primary Key
- activity_type_code

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ## plant_alerts

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| alert_id | uuid | NO | gen_random_uuid() |
| plant_id | uuid | NO |  |
| alert_type | text | NO |  |
| alert_category | text | NO |  |
| severity | text | NO |  |
| title | text | NO |  |
| message | text | NO |  |
| target_date | date | NO |  |
| due_date | date | NO |  |
| is_snoozed | boolean | YES | false |
| snooze_until | date | YES |  |
| snooze_days | integer | YES |  |
| is_dismissed | boolean | YES | false |
| dismissed_at | timestamp with time zone | YES |  |
| dismiss_type | text | YES |  |
| suppress_until | date | YES |  |
| source | text | YES | 'CALCULATED'::text |
| calculation_run_id | uuid | YES |  |
| status_history_id | uuid | YES |  |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | NO | now() |
| modified_at | timestamp with time zone | NO | now() |
| resolved_at | timestamp with time zone | YES |  |
| alert_label | text | YES |  |
| user_id | uuid | YES | auth.uid() |

### Primary Key
- alert_id

### Foreign Keys
- plant_id → plant.plant_id
- status_history_id → plant_status_history_old.plant_status_id
 |
| ## plant_category_lookup

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| plant_category_id | uuid | NO | gen_random_uuid() |
| category_name | text | NO |  |
| description | text | YES |  |
| water_min_days | integer | NO |  |
| water_max_days | integer | NO |  |
| light_min_fc | integer | NO |  |
| light_max_fc | integer | NO |  |
| humidity_min | integer | NO |  |
| humidity_max | integer | NO |  |
| soil_type | text | NO |  |
| sensitivity | integer | NO |  |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | NO | now() |
| modified_at | timestamp with time zone | NO | now() |

### Primary Key
- plant_category_id

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ## plant_detail_view

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| plant_id | uuid | YES |  |
| plant_name | text | YES |  |
| plant_category | text | YES |  |
| species | text | YES |  |
| watering_interval_days | smallint | YES |  |
| habitat | text | YES |  |
| status_code | smallint | YES |  |
| status_label | text | YES |  |
| severity | integer | YES |  |
| status_icon | text | YES |  |

### Primary Key\n- (none)\n
### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ## plant_factor

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| plant_factor_id | uuid | NO | gen_random_uuid() |
| plant_id | uuid | NO |  |
| factor_code | text | NO |  |
| confidence_score | real | YES |  |
| batch_id | uuid | NO |  |
| factor_date | date | YES |  |
| factor_float | double precision | YES |  |
| start_date | timestamp with time zone | NO | now() |
| end_date | timestamp with time zone | YES |  |
| user_id | uuid | YES | auth.uid() |

### Primary Key
- plant_factor_id

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ## plant_factor_active

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| plant_factor_id | uuid | NO | gen_random_uuid() |
| plant_id | uuid | NO |  |
| factor_code | text | NO |  |
| confidence_score | real | YES |  |
| batch_id | uuid | NO |  |
| factor_date | date | YES |  |
| factor_float | double precision | YES |  |
| is_active | boolean | NO | true |

### Primary Key
- plant_factor_id

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ## plant_factor_contribution

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| plant_id | uuid | NO |  |
| factor_code | text | NO |  |
| severity | smallint | NO |  |
| batch_id | uuid | NO |  |
| plant_factor_contribution_id | uuid | NO | gen_random_uuid() |
| start_date | timestamp with time zone | NO | now() |
| end_date | timestamp with time zone | YES |  |
| user_id | uuid | YES | auth.uid() |
| plant_factor_id | uuid | NO |  |

### Primary Key
- plant_factor_contribution_id

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ## plant_factor_contribution_active

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| plant_factor_id | uuid | NO | gen_random_uuid() |
| plant_id | uuid | NO |  |
| factor_code | text | NO |  |
| severity | smallint | NO |  |
| batch_id | uuid | NO |  |
| is_active | boolean | YES | true |
| plant_factor_contribution_id | uuid | NO | gen_random_uuid() |
| user_id | uuid | YES | auth.uid() |

### Primary Key
- plant_factor_contribution_id

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ## plant_factor_contribution_history

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| plant_factor_id | uuid | NO |  |
| plant_id | uuid | NO |  |
| factor_code | text | NO |  |
| severity | smallint | NO |  |
| batch_id | uuid | NO |  |
| plant_factor_contribution_id | uuid | NO | gen_random_uuid() |

### Primary Key
- plant_factor_contribution_id

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ## plant_factor_history

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| plant_factor_history_id | uuid | NO | gen_random_uuid() |
| plant_id | uuid | NO |  |
| factor_code | text | NO |  |
| confidence_score | real | YES |  |
| batch_id | uuid | NO |  |
| factor_date | date | YES |  |
| factor_float | double precision | YES |  |
| start_date | timestamp with time zone | NO | now() |
| end_date | timestamp with time zone | YES |  |

### Primary Key
- plant_factor_history_id

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ## plant_inventory_view

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| plant_id | uuid | YES |  |
| plant_name | text | YES |  |
| plant_category | text | YES |  |
| plant_icon | text | YES |  |
| species | text | YES |  |
| habitat | text | YES |  |
| status_code | smallint | YES |  |
| status_label | text | YES |  |
| status_icon | text | YES |  |
| last_activity_code | text | YES |  |
| last_activity_label | text | YES |  |
| last_activity_date | date | YES |  |

### Primary Key\n- (none)\n
### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ## plant_status

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| plant_status_id | uuid | NO | gen_random_uuid() |
| plant_id | uuid | NO |  |
| status_code | smallint | NO |  |
| batch_id | uuid | NO |  |
| start_date | timestamp with time zone | NO | now() |
| end_date | timestamp with time zone | YES |  |
| user_id | uuid | YES | auth.uid() |

### Primary Key
- plant_status_id

### Foreign Keys
- plant_id → plant.plant_id
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ## plant_status_active

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| plant_status_id | uuid | NO | gen_random_uuid() |
| plant_id | uuid | NO |  |
| status_code | text | NO |  |
| batch_id | uuid | NO |  |
| user_id | uuid | YES | auth.uid() |

### Primary Key
- plant_status_id

### Foreign Keys
- plant_id → plant.plant_id
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ## plant_status_history

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| plant_status_id | uuid | NO | gen_random_uuid() |
| plant_id | uuid | NO |  |
| status_code | text | NO |  |
| batch_id | uuid | YES |  |
| start_date | timestamp with time zone | NO | now() |
| end_date | timestamp with time zone | YES |  |
| user_id | uuid | YES | auth.uid() |

### Primary Key
- plant_status_id

### Foreign Keys
- plant_id → plant.plant_id
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ## plant_status_history_old

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| plant_status_id | uuid | NO | gen_random_uuid() |
| plant_id | uuid | NO |  |
| status_code | text | NO |  |
| is_current | boolean | NO | true |
| batch_id | uuid | YES |  |
| created_at | timestamp with time zone | NO | now() |
| user_id | uuid | YES | auth.uid() |

### Primary Key
- plant_status_id

### Foreign Keys
- plant_id → plant.plant_id
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ## plant_status_lookup

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| status_code | smallint | NO |  |
| status_label | text | NO |  |
| severity | integer | NO |  |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | NO | now() |
| modified_at | timestamp with time zone | NO | now() |
| status_icon | text | NO |  |

### Primary Key
- status_code

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ## plant_status_view

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| plant_id | uuid | YES |  |
| status_weighted | numeric | YES |  |

### Primary Key\n- (none)\n
### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ## plant_type_lookup

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| plant_type_id | uuid | NO | gen_random_uuid() |
| category | text | NO |  |
| species | text | NO |  |
| icon | text | NO |  |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | NO | now() |
| modified_at | timestamp with time zone | NO | now() |
| common_name | text | YES |  |
| watering_interval_days | smallint | NO |  |
| plant_category_id | uuid | NO |  |

### Primary Key
- plant_type_id

### Foreign Keys
- plant_category_id → plant_category_lookup.plant_category_id
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ## schedule

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| schedule_id | uuid | NO | gen_random_uuid() |
| plant_id | uuid | NO |  |
| schedule_date | date | NO |  |
| schedule_label | text | NO |  |
| schedule_severity | smallint | NO |  |
| batch_id | uuid | NO |  |
| factor_code | text | NO |  |
| start_date | timestamp with time zone | NO |  |
| end_date | timestamp with time zone | YES |  |
| user_id | uuid | YES | auth.uid() |
| plant_factor_id | uuid | NO |  |

### Primary Key
- schedule_id

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ## schedule_active

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| schedule_id | uuid | NO | gen_random_uuid() |
| plant_factor_id | uuid | NO |  |
| plant_id | uuid | NO |  |
| schedule_date | date | NO |  |
| schedule_status | text | NO |  |
| schedule_label | text | NO |  |
| batch_id | uuid | NO |  |
| user_id | uuid | YES | auth.uid() |
| factor_code | text | NO |  |

### Primary Key
- schedule_id

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ## schedule_history

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| schedule_id | uuid | NO | gen_random_uuid() |
| plant_factor_id | uuid | NO |  |
| plant_id | uuid | NO |  |
| schedule_date | date | NO |  |
| schedule_status | text | NO |  |
| schedule_severity | smallint | NO |  |
| batch_id | uuid | NO |  |
| user_id | uuid | YES | auth.uid() |
| start_date | timestamp with time zone | NO | now() |
| end_date | timestamp with time zone | YES |  |
| factor_code | text | NO |  |

### Primary Key
- schedule_id

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ## schedule_view

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| schedule_id | uuid | YES |  |
| schedule_severity | smallint | YES |  |
| schedule_date | date | YES |  |
| schedule_label | text | YES |  |
| plant_id | uuid | YES |  |
| plant_name | text | YES |  |

### Primary Key\n- (none)\n
### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ## status_factor_contribution_map

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| status_factor_weight_id | uuid | NO | gen_random_uuid() |
| factor_code | text | NO |  |
| weight | numeric | YES | 1.0 |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | NO | now() |
| modified_at | timestamp with time zone | NO | now() |
| user_id | uuid | YES | auth.uid() |

### Primary Key
- status_factor_weight_id

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ## status_factor_lookup

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| factor_id | uuid | NO | gen_random_uuid() |
| factor_code | text | NO |  |
| factor_name | text | NO |  |
| factor_category | text | NO |  |
| severity_contribution | integer | NO |  |
| weight | numeric | YES | 1.0 |
| thresholds | jsonb | YES |  |
| description | text | YES |  |
| user_message_template | text | YES |  |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | NO | now() |
| modified_at | timestamp with time zone | NO | now() |

### Primary Key
- factor_id

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ## user_roles

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| user_id | uuid | NO |  |
| role | text | NO |  |

### Primary Key
- user_id, role

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |