import type { Officer } from '../types';
import { apiFetch } from './mockApi';

/**
 * Fetches the list of all officers.
 * @returns A promise that resolves to an array of Officer objects.
 */
export const getOfficers = async (): Promise<Officer[]> => {
  const response = await apiFetch('/api/officers');
  if (!response.ok) {
    throw new Error('Failed to fetch officers');
  }
  return await response.json();
};


/**
 * Adds a new officer from the management page.
 */
export const addOfficer = async (officerData: Omit<Officer, 'id' | 'incidents' | 'score'>): Promise<Officer> => {
    const response = await apiFetch('/api/officers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(officerData),
    });
    if (!response.ok) {
        throw new Error('Failed to add officer');
    }
    return await response.json();
};

/**
 * Updates an existing officer.
 */
export const updateOfficer = async (officerData: Officer): Promise<Officer> => {
    const response = await apiFetch(`/api/officers/${officerData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(officerData),
    });
    if (!response.ok) {
        throw new Error('Failed to update officer');
    }
    return await response.json();
};

/**
 * Deletes an officer by their ID.
 */
export const deleteOfficer = async (officerId: string): Promise<{ success: boolean }> => {
    const response = await apiFetch(`/api/officers/${officerId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete officer');
    }
    return await response.json();
};