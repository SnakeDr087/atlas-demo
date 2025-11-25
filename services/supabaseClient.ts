
import { createClient } from '@supabase/supabase-js';

// Your Supabase Configuration
const MANUAL_SUPABASE_URL = "https://ggaacxjkflyfzatuceok.supabase.co"; 
const MANUAL_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnYWFjeGprZmx5ZnphdHVjZW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMTM0MDgsImV4cCI6MjA3OTU4OTQwOH0.uWRRMnRV_s92YCoIMsxAyfl0kygZyvNW9Hph3HhmpwM";

// Safely access env variables (Backup method)
const getEnvVar = (key: string) => {
    try {
        return (import.meta as any).env?.[key] || '';
    } catch (e) {
        return '';
    }
};

// Logic: Use Manual strings if provided, otherwise try Environment variables
const supabaseUrl = MANUAL_SUPABASE_URL.includes('YOUR_PROJECT_ID') ? getEnvVar('VITE_SUPABASE_URL') : MANUAL_SUPABASE_URL;
const supabaseKey = MANUAL_SUPABASE_ANON_KEY.includes('PASTE_YOUR_ANON_KEY') ? getEnvVar('VITE_SUPABASE_ANON_KEY') : MANUAL_SUPABASE_ANON_KEY;

// Check if configured correctly
export const isSupabaseConfigured = 
    supabaseUrl !== '' && 
    supabaseKey !== '' &&
    !supabaseUrl.includes('YOUR_PROJECT_ID') &&
    !supabaseKey.includes('PASTE_YOUR_ANON_KEY') &&
    supabaseUrl.startsWith('https://');

// Create client
export const supabase = createClient(
    isSupabaseConfigured ? supabaseUrl : 'https://placeholder-url.supabase.co', 
    isSupabaseConfigured ? supabaseKey : 'placeholder-key'
);
