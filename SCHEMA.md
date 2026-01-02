| table_markdown                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
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
| ## locations
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| location_id | uuid | NO | uuid_generate_v4() |
| location_name | text | NO | None |
| north_window_exposure | integer | YES | 0 |
| north_window_intensity | text | YES | None |
| south_window_exposure | integer | YES | 0 |
| south_window_intensity | text | YES | None |
| east_window_exposure | integer | YES | 0 |
| east_window_intensity | text | YES | None |
| west_window_exposure | integer | YES | 0 |
| west_window_intensity | text | YES | None |
| grow_lights_exposure | integer | YES | 0 |
| grow_lights_intensity | text | YES | None |
| humidity_range | text | YES | None |
| temperature_range | text | YES | None |
| last_updated | timestamp with time zone | YES | now() |
| date_created | timestamp with time zone | YES | now() |
| status | text | YES | 'Active'::text |
 |
| ## plant_care_status
| Column | Type | Nullable | Default |
| --- | --- | --- | --- |
| plant_id | uuid | YES | None |
| scientific_name | text | YES | None |
| common_name | text | YES | None |
| nickname | text | YES | None |
| location_id | uuid | YES | None |
| acquisition_date | date | YES | None |
| watering_frequency | integer | YES | None |
| status | text | YES | None |
| location_name | text | YES | None |
| last_watered | date | YES | None |
| days_since_watered | integer | YES | None |
| last_fertilized | date | YES | None |
| days_since_fertilized | integer | YES | None |
| watering_snoozed_until | date | YES | None |
| fertilizing_snoozed_until | date | YES | None |
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
| location_id | uuid | YES | None |
| acquisition_date | date | YES | None |
| watering_frequency | integer | YES | 7 |
| date_created | timestamp with time zone | YES | now() |
| status | text | YES | 'Active'::text |
                                                                                                                                                                                                                                                                                                                                                                                                                              |