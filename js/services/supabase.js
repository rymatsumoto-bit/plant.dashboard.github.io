// ============================================
// SUPABASE.JS - Database Service Layer
// ============================================

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Supabase configuration
const SUPABASE_URL = 'https://dciowholtqcpgzpryush.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaW93aG9sdHFjcGd6cHJ5dXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1Mzg2MDQsImV4cCI6MjA4MDExNDYwNH0.UdNGgOT_mpDrFQXjQp7XB6F0Bbdn-eGJi9mcjz-ZnIw';

// Initialize Supabase client immediately
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('✅ Supabase client initialized');

/**
 * Get Supabase client instance
 */
export function getSupabase() {
    return supabase;
}

// ============================================
// HABITAT QUERIES
// ============================================

/**
 * Get all habitats
 */
export async function getHabitats() {
    const { data, error } = await supabase
        .from('habitat')
        .select('*')
        .eq('is_active', true)
        .order('habitat_name');
    
    if (error) throw error;
    return data;
}

/**
 * Get single habitat by ID
 */
export async function getHabitatById(habitatId) {
    const { data, error } = await supabase
        .from('habitat')
        .select('*')
        .eq('habitat_id', habitatId)
        .eq('is_active', true)
        .single();
    
    if (error) throw error;
    return data;
}

/**
 * Get habitat light sources (artificial)
 */
export async function getHabitatLightArtificial(habitatId) {
    const { data, error } = await supabase
        .from('habitat_light_artificial')
        .select(`
            *,
            light_artificial_strength:habitat_light_artifical_strenght_lookup(light_artificial_strength),
            start_type:habitat_light_schedule_start_type_lookup(light_schedule_start_type),
            end_type:habitat_light_schedule_end_type_lookup(light_schedule_end_type)
        `)
        .eq('habitat_id', habitatId)
        .eq('is_active', true);
    
    if (error) throw error;
    return data;
}

/**
 * Get habitat light sources (window)
 */
export async function getHabitatLightWindow(habitatId) {
    const { data, error } = await supabase
        .from('habitat_light_window')
        .select(`
            *,
            window_size:habitat_light_window_size_lookup(window_size, window_size_desc),
            direction:compass_direction_lookup(full_name)
        `)
        .eq('habitat_id', habitatId)
        .eq('is_active', true);
    
    if (error) throw error;
    return data;
}

/**
 * Get habitat light sources (outdoor)
 */
export async function getHabitatLightOutdoor(habitatId) {
    const { data, error } = await supabase
        .from('habitat_light_outdoor')
        .select('*')
        .eq('habitat_id', habitatId)
        .eq('is_active', true);
    
    if (error) throw error;
    return data;
}

/**
 * Get habitat humidity level lookup value
 */
export async function getHumidityLevel(humidityLevelId) {
    if (!humidityLevelId) return null;
    
    const { data, error } = await supabase
        .from('habitat_humidity_level_lookup')
        .select('humidity_level, humidity_level_desc')
        .eq('humidity_level_id', humidityLevelId)
        .eq('is_active', true)
        .single();
    
    if (error) throw error;
    return data;
}

/**
 * Get address by ID
 */
export async function getAddressById(addressId) {
    if (!addressId) return null;
    
    const { data, error } = await supabase
        .from('address')
        .select('*')
        .eq('address_id', addressId)
        .eq('is_active', true)
        .single();
    
    if (error) throw error;
    return data;
}