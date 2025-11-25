import type { User, UserRole } from '../types';
import { apiFetch } from './mockApi';

export const getUsers = async (): Promise<User[]> => {
    const response = await apiFetch('/api/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
};

export const addUser = async (userData: {
    name: string;
    email: string;
    role: UserRole;
    agency?: string;
}): Promise<{ user: User; tempPass: string }> => {
    const response = await apiFetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to add user');
    return await response.json();
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
    const response = await apiFetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return await response.json();
};

export const toggleUserStatus = async (userId: string): Promise<User> => {
    const response = await apiFetch(`/api/users/${userId}/status`, {
        method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to update user status');
    return await response.json();
};

export const resetPassword = async (userId: string): Promise<{ tempPass: string }> => {
    const response = await apiFetch(`/api/users/${userId}/reset-password`, {
        method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to reset password');
    return await response.json();
};