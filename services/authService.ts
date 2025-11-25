import type { User } from '../types.ts';
import { apiFetch } from './mockApi.ts';

/**
 * Authenticates a user based on ID and password by calling the mock API.
 * @param id The user's ID (e.g., 'admin', 'sgtmiller').
 * @param pass The user's password.
 * @returns A promise that resolves to the User object if credentials are valid, otherwise null.
 */
export const authenticate = async (id: string, pass: string): Promise<User | null> => {
  try {
    const response = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password: pass }),
    });

    if (response.ok) {
      const { user } = await response.json();
      return user;
    }
    
    return null;

  } catch (error) {
    console.error("Authentication failed:", error);
    return null;
  }
};
