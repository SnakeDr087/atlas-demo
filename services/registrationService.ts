import type { PendingOfficer, Officer, User } from '../types.ts';
import { apiFetch } from './mockApi.ts';

export const getPendingRegistrations = async (): Promise<PendingOfficer[]> => {
    const response = await apiFetch('/api/registrations/pending');
    if (!response.ok) throw new Error('Failed to fetch pending registrations');
    return response.json();
};

export const submitRegistration = async (registrationData: Omit<PendingOfficer, 'id' | 'requestedDate' | 'status'> & { password?: string }): Promise<{ success: boolean }> => {
    const response = await apiFetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
    });
    if (!response.ok) throw new Error('Registration submission failed');
    return response.json();
};

export const approveRegistration = async (pendingOfficerId: string, updatedData?: Partial<Omit<PendingOfficer, 'id'|'status'>>): Promise<{ success: boolean }> => {
    const response = await apiFetch(`/api/registrations/${pendingOfficerId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData || {}),
    });
    if (!response.ok) throw new Error('Failed to approve registration');
    return response.json();
};

export const denyRegistration = async (pendingOfficerId: string): Promise<{ success: boolean }> => {
    const response = await apiFetch(`/api/registrations/${pendingOfficerId}/deny`, {
        method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to deny registration');
    return response.json();
};
