
import type { User } from '../types.ts';

// SECURITY UPDATE: High-level credentials have been moved to the secure Cloud Database.
// This file now only contains low-level demo accounts or acts as a fallback structure.

export const mockUsers: User[] = [
    // Admin accounts are now in Supabase 'system_users' table.
    // Do not add 'admin' or 'Agency Admin' passwords here.
    
    { id: 'OFF-001', name: 'John Davis', role: 'Officer', agency: 'Central Police Department', password: 'password123', status: 'Active' },
    { id: 'OFF-002', name: 'Jane Smith', role: 'Officer', agency: "North County Sheriff's Office", password: 'password123', status: 'Active' }
];
