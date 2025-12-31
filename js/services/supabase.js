// ============================================
// SUPABASE.JS - Database Service Layer
// ============================================

// Supabase configuration
const SUPABASE_URL = 'https://dciowholtqcpgzpryush.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaW93aG9sdHFjcGd6cHJ5dXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1Mzg2MDQsImV4cCI6MjA4MDExNDYwNH0.UdNGgOT_mpDrFQXjQp7XB6F0Bbdn-eGJi9mcjz-ZnIw';

let supabase = null;

/**
 * Initialize Supabase client
 */
export function initSupabase() {
    if (typeof window.supabase !== 'undefined') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase client initialized');
    } else {
        console.warn('⚠️ Supabase library not loaded');
    }
}

/**
 * Get Supabase client instance
 */
export function getSupabase() {
    if (!supabase) {
        initSupabase();
    }
    return supabase;
}

// ============================================
// PLANT QUERIES
// ============================================

/**
 * Get all plants with care status
 */
export async function getPlants() {
    const { data, error } = await supabase
        .from('plant_care_status')
        .select('*')
        .order('nickname');
    
    if (error) throw error;
    return data;
}

/**
 * Get single plant by ID
 */
export async function getPlantById(plantId) {
    const { data, error } = await supabase
        .from('plant_care_status')
        .select('*')
        .eq('plant_id', plantId)
        .single();
    
    if (error) throw error;
    return data;
}

/**
 * Add new plant
 */
export async function addPlant(plantData) {
    const { data, error } = await supabase
        .from('plants')
        .insert(plantData)
        .select();
    
    if (error) throw error;
    return data;
}

/**
 * Update plant
 */
export async function updatePlant(plantId, plantData) {
    const { data, error } = await supabase
        .from('plants')
        .update(plantData)
        .eq('plant_id', plantId)
        .select();
    
    if (error) throw error;
    return data;
}

/**
 * Archive plant (soft delete)
 */
export async function archivePlant(plantId) {
    const { data, error } = await supabase
        .from('plants')
        .update({ status: 'Archived' })
        .eq('plant_id', plantId)
        .select();
    
    if (error) throw error;
    return data;
}

// ============================================
// CARE ACTION QUERIES
// ============================================

/**
 * Add care action (watering, fertilizing)
 */
export async function addCareAction(plantId, actionType, actionDate) {
    const { data, error } = await supabase
        .from('care_actions')
        .insert({
            plant_id: plantId,
            action_type: actionType,
            action_date: actionDate
        })
        .select();
    
    if (error) throw error;
    return data;
}

/**
 * Get care actions for a plant
 */
export async function getCareActions(plantId, limit = 10) {
    const { data, error } = await supabase
        .from('care_actions')
        .select('*')
        .eq('plant_id', plantId)
        .order('action_date', { ascending: false })
        .limit(limit);
    
    if (error) throw error;
    return data;
}

// ============================================
// SNOOZE QUERIES
// ============================================

/**
 * Snooze plant alert
 */
export async function snoozePlant(plantId, snoozeType, days = 3) {
    const snoozeUntil = new Date();
    snoozeUntil.setDate(snoozeUntil.getDate() + days);
    const snoozeUntilStr = snoozeUntil.toISOString().split('T')[0];
    
    const { data, error } = await supabase
        .from('plant_snoozes')
        .insert({
            plant_id: plantId,
            snooze_type: snoozeType,
            snoozed_until: snoozeUntilStr
        })
        .select();
    
    if (error) throw error;
    return data;
}

// ============================================
// LOCATION QUERIES
// ============================================

/**
 * Get all locations
 */
export async function getLocations() {
    const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('status', 'Active')
        .order('location_name');
    
    if (error) throw error;
    return data;
}

/**
 * Add new location
 */
export async function addLocation(locationData) {
    const { data, error } = await supabase
        .from('locations')
        .insert(locationData)
        .select();
    
    if (error) throw error;
    return data;
}

/**
 * Update location
 */
export async function updateLocation(locationId, locationData) {
    const { data, error } = await supabase
        .from('locations')
        .update(locationData)
        .eq('location_id', locationId)
        .select();
    
    if (error) throw error;
    return data;
}