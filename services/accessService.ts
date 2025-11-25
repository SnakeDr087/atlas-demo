
import { supabase, isSupabaseConfigured } from './supabaseClient.ts';
import { approvedGuests } from '../data/approvedGuests.ts';

// Local state cache to mimic DB when offline
let localGuestList = [...approvedGuests];

export const testDatabaseConnection = async (): Promise<{ success: boolean; message?: string }> => {
    if (!isSupabaseConfigured) return { success: false, message: 'Keys missing in configuration.' };
    
    try {
        // Try to fetch 1 row just to test auth/access
        const { data, error } = await supabase.from('authorized_guests').select('id').limit(1);
        if (error) {
            return { success: false, message: error.message };
        }
        return { success: true };
    } catch (err) {
        return { success: false, message: 'Network or client error.' };
    }
};

export const checkEmailAuthorized = async (email: string): Promise<boolean> => {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Try Supabase if configured
    if (isSupabaseConfigured) {
        try {
            const { data, error } = await supabase
                .from('authorized_guests')
                .select('created_at')
                .eq('email', normalizedEmail)
                .maybeSingle();

            if (!error && data) {
                // Enforce 24-hour hard limit on the authorization itself
                const createdAt = new Date(data.created_at).getTime();
                const now = Date.now();
                const twentyFourHours = 24 * 60 * 60 * 1000;

                if (now - createdAt < twentyFourHours) {
                    return true;
                } else {
                    console.warn("Access denied: Authorization expired.");
                    return false;
                }
            }
        } catch (err) {
            console.warn("Supabase check failed, falling back to local list", err);
        }
    }

    // 2. Fallback to local list (mock data or local cache)
    // Note: Local list doesn't enforce time expiry on the check itself, only browser session.
    return localGuestList.map(e => e.toLowerCase()).includes(normalizedEmail);
};

export const getAuthorizedGuests = async (): Promise<{email: string, created_at?: string}[]> => {
    if (isSupabaseConfigured) {
        const { data, error } = await supabase
            .from('authorized_guests')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (!error && data) return data;
    }
    // Fallback
    return localGuestList.map(email => ({ email, created_at: new Date().toISOString() }));
};

export const addAuthorizedGuest = async (email: string): Promise<boolean> => {
    const normalizedEmail = email.toLowerCase().trim();
    
    if (isSupabaseConfigured) {
        const { error } = await supabase
            .from('authorized_guests')
            .insert([{ email: normalizedEmail }]);
        
        if (error) {
            console.error("Error adding guest to Supabase:", error);
            return false;
        }
        return true;
    }

    // Local Fallback
    if (!localGuestList.includes(normalizedEmail)) {
        localGuestList.push(normalizedEmail);
        return true;
    }
    return false;
};

export const removeAuthorizedGuest = async (email: string): Promise<boolean> => {
    if (isSupabaseConfigured) {
        const { error } = await supabase
            .from('authorized_guests')
            .delete()
            .eq('email', email);
        
        if (!error) return true;
    }
    
    localGuestList = localGuestList.filter(e => e !== email);
    return true;
};
