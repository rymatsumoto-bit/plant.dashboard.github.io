| table_markdown                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ## address
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| address_id | uuid | NO | gen_random_uuid() |
| address_name | text | NO | None |
| postal_code | text | NO | None |
| city | text | NO | None |
| state_province | text | YES | None |
| country | character | NO | None |
| timezone | text | NO | 'UTC'::text |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | NO | now() |
| modified_at | timestamp with time zone | NO | now() |
| latitute | double precision | NO | None |
| longitude | double precision | NO | None |
                                                                                                                                               |
| ## care_actions
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| action_id | uuid | NO | uuid_generate_v4() |
| plant_id | uuid | YES | None |
| action_type | text | NO | None |
| action_date | date | NO | None |
| date_created | timestamp with time zone | YES | now() |
| notes | text | YES | None |
                                                                                                                                                                                                                                                                                                                                                                                                            |
| ## compass_direction_lookup
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| direction_code | text | NO | None |
| full_name | character varying | NO | None |
| degrees | integer | NO | None |
| is_active | boolean | YES | true |
| created_at | timestamp without time zone | YES | CURRENT_TIMESTAMP |
| modified_at | timestamp without time zone | YES | CURRENT_TIMESTAMP |
                                                                                                                                                                                                                                                                                                                                    |
| ## habitat
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| habitat_id | uuid | NO | gen_random_uuid() |
| habitat_name | text | NO | None |
| address_id | uuid | YES | None |
| temperature_controlled | boolean | NO | false |
| temp_min | integer | YES | None |
| temp_max | integer | YES | None |
| temp_avg | integer | YES | None |
| humidity_level_id | uuid | YES | None |
| appliance_ac | boolean | NO | false |
| appliance_heater | boolean | NO | false |
| appliance_fan | boolean | NO | false |
| appliance_humidifier | boolean | NO | false |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | NO | now() |
| modified_at | timestamp with time zone | NO | now() |
 |
| ## habitat_humidity_level_lookup
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| humidity_level_id | uuid | NO | gen_random_uuid() |
| humidity_level | text | NO | None |
| humidity_level_desc | text | NO | None |
| is_active | boolean | YES | true |
| created_at | timestamp without time zone | YES | CURRENT_TIMESTAMP |
| modified_at | timestamp without time zone | YES | CURRENT_TIMESTAMP |
                                                                                                                                                                                                                                                                                                              |
| ## habitat_light_artifical_strenght_lookup
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| light_artificial_strength_id | uuid | NO | gen_random_uuid() |
| light_artificial_strength | text | NO | None |
| light_artificial_strength_desc | text | NO | None |
| created_at | timestamp without time zone | YES | CURRENT_TIMESTAMP |
| modified_at | timestamp without time zone | YES | CURRENT_TIMESTAMP |
| is_active | boolean | NO | true |
                                                                                                                                                                                                                                                                    |
| ## habitat_light_artificial
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| light_artificial_id | uuid | NO | gen_random_uuid() |
| light_name | text | YES | None |
| habitat_id | uuid | YES | None |
| address_id | uuid | YES | None |
| light_artificial_strength_id | uuid | YES | None |
| light_schedule_start_type_id | uuid | YES | None |
| start_time | time without time zone | YES | None |
| light_schedule_end_type_id | uuid | YES | None |
| end_time | time without time zone | YES | None |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | NO | now() |
| modified_at | timestamp with time zone | NO | now() |
                                                     |
| ## habitat_light_outdoor
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| light_outdoor_id | uuid | NO | gen_random_uuid() |
| light_name | text | YES | None |
| habitat_id | uuid | YES | None |
| address_id | uuid | YES | None |
| direction | ARRAY | YES | None |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | NO | now() |
| modified_at | timestamp with time zone | NO | now() |
                                                                                                                                                                                                                                                                                             |
| ## habitat_light_schedule_end_type_lookup
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| light_schedule_end_type_id | uuid | NO | gen_random_uuid() |
| light_schedule_end_type | text | NO | None |
| is_active | boolean | YES | true |
| created_at | timestamp without time zone | YES | CURRENT_TIMESTAMP |
| modified_at | timestamp without time zone | YES | CURRENT_TIMESTAMP |
                                                                                                                                                                                                                                                                                                                              |
| ## habitat_light_schedule_start_type_lookup
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| light_schedule_start_type_id | uuid | NO | gen_random_uuid() |
| light_schedule_start_type | text | NO | None |
| is_active | boolean | YES | true |
| created_at | timestamp without time zone | YES | CURRENT_TIMESTAMP |
| modified_at | timestamp without time zone | YES | CURRENT_TIMESTAMP |
                                                                                                                                                                                                                                                                                                                        |
| ## habitat_light_type_lookup
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| light_type_id | uuid | NO | gen_random_uuid() |
| light_type | text | NO | None |
| is_active | boolean | YES | true |
| created_at | timestamp without time zone | YES | CURRENT_TIMESTAMP |
| modified_at | timestamp without time zone | YES | CURRENT_TIMESTAMP |
                                                                                                                                                                                                                                                                                                                                                                     |
| ## habitat_light_window
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| light_window_id | uuid | NO | gen_random_uuid() |
| light_name | text | YES | None |
| habitat_id | uuid | YES | None |
| address_id | uuid | YES | None |
| direction_code | text | YES | None |
| window_size_id | uuid | YES | None |
| is_active | boolean | NO | true |
| created_at | timestamp with time zone | NO | now() |
| modified_at | timestamp with time zone | NO | now() |
                                                                                                                                                                                                                                                    |
| ## habitat_light_window_size_lookup
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| window_size_id | uuid | NO | gen_random_uuid() |
| window_size | text | NO | None |
| window_size_desc | text | NO | None |
| is_active | boolean | YES | true |
| created_at | timestamp without time zone | YES | CURRENT_TIMESTAMP |
| modified_at | timestamp without time zone | YES | CURRENT_TIMESTAMP |
                                                                                                                                                                                                                                                                                                                    |
| ## plant_snoozes
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| snooze_id | uuid | NO | uuid_generate_v4() |
| plant_id | uuid | YES | None |
| snooze_type | text | NO | None |
| snoozed_until | date | NO | None |
| created_at | timestamp with time zone | YES | now() |
                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ## plants
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| plant_id | uuid | NO | uuid_generate_v4() |
| scientific_name | text | YES | None |
| common_name | text | YES | None |
| nickname | text | NO | None |
| habitat_id | uuid | YES | None |
| acquisition_date | date | YES | None |
| watering_frequency | integer | YES | 7 |
| date_created | timestamp with time zone | YES | now() |
| status | text | YES | 'Active'::text |
                                                                                                                                                                                                                                                                            |