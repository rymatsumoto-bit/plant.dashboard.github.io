// ============================================
// SUPABASE.JS - Data Metrics
// ============================================

import { getSupabase } from './supabase.js';

let supabase = getSupabase();

// ============================================
// METRICS QUERIES
// ============================================

/**
 * Get metrics
 */
export async function getDataMetrics() {
    const { data, error } = await supabase.rpc('getDataMetrics')
    
    if (error) {
    console.error('Error fetching KPIs:', error);
    return null;
    }
 
    return data;
}