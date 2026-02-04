// ============================================
// SUPABASE.JS - Database Service Layer
// ============================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
// AUTHENTICATION
// ============================================

/**
 * Sign in with email/password
 */
export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) throw error;
    return data;
}

/**
 * Sign out
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

/**
 * Get current user
 */
export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

/**
 * Get current user ID (helper)
 */
export async function getCurrentUserId() {
    const user = await getCurrentUser();
    return user?.id;
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
            light_artificial_strength:habitat_light_artificial_strength_lookup(light_artificial_strength),
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
            direction:compass_direction_lookup(full_name),
            address:address(address_name)
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

// ============================================
// ADDRESS QUERIES
// ============================================

/**
 * Get all addresses
 */
export async function getAddresses() {
    const { data, error } = await supabase
        .from('address')
        .select('*')
        .eq('is_active', true)
        .order('address_name');
    
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


// ============================================
// PLANT QUERIES
// ============================================

/**
 * Get all plants
 */
export async function getPlantInventory() {
    const { data, error } = await supabase
        .from('plant_inventory_view')
        .select('*');
    
    if (error) throw error;
    return data;
}

/**
 * Get all active plants for dropdown
 */
export async function getActivePlants() {
    const { data, error } = await supabase
        .from('plant_inventory_view')
        .select('plant_id, plant_name, species')
        .order('plant_name');
    
    if (error) throw error;
    // Concatenate in JS
    return data.map(data  => ({
        ...data,
        full_plant_name: `${data.plant_name} . . . (${data.species})`
    }));
}

/**
 * Get plant types
 */
export async function getPlantTypes() {
    const { data, error } = await supabase
        .from('plant_type_lookup')
        .select('*')
        .eq('is_active', true)
        .order('species');;
    
    if (error) throw error;
       
    return data.map(p => ({
        ...p,
        plant_type: `${p.species}  (${p.category})`
    }));
}

/**
 * Get all plants
 */
export async function getPlantDetails(plantId) {
    const { data, error } = await supabase
        .from('plant_detail_view')
        .select('*')
        .eq('plant_id',plantId)
        .single();
    
    if (error) throw error;
    return data;
}


// ============================================
// ACTIVITY QUERIES
// ============================================

/**
 * Get all active activity types for dropdown
 */
export async function getActivityTypes() {
    const { data, error } = await supabase
        .from('plant_activity_type_lookup')
        .select('activity_type_code, activity_label, activity_category')
        .eq('is_active', true)
        .order('activity_label');
    
    if (error) throw error;
    return data;
}


// ============================================
// ALERTS QUERIES
// ============================================

/**
 * Get active alerts
 */
export async function getAlertsActive() {
    const { data, error } = await supabase
        .from('alerts_active_view')
        .select('*');
    
    if (error) throw error;
    return data;
}


// ============================================
// WRITE QUERIES
// ============================================


/**
 * Add new plant activity
 */
export async function addPlantActivity(activityData) {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
        .from('plant_activity_history')
        .insert([{
            plant_id: activityData.plant_id,
            activity_type_code: activityData.activity_type,
            activity_date: activityData.activity_date,
            quantifier: activityData.quantifier || null,
            unit: activityData.unit || null,
            details: activityData.notes || null,
            user_id: userId
        }])
        .select();
    
    if (error) throw error;
    return data;
}


/**
 * Add new plant
 */
export async function addPlant(plantData) {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
        .from('plant')
        .insert([{
            plant_name: plantData.plant_name,
            plant_type_id: plantData.plant_type_id,
            habitat_id: plantData.habitat_id,
            acquisition_date: plantData.acquisition_date,
            source: plantData.source_name,
            user_id: userId
        }])
        .select();
    
    if (error) throw error;
    return data;
}