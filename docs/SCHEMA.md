| table_markdown                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
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

### Primary Key
- address_id

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
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

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
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

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ## habitat_light_artificial

### Columns
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| light_artificial_id | uuid | NO | gen_random_uuid() |
| light_name | text | YES |  |
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

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
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

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
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

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
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

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
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

### Foreign Keys\n- (none)\n                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |