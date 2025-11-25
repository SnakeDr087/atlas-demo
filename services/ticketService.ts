import type { TroubleTicket } from '../types';
import { apiFetch } from './mockApi';

/**
 * Fetches the list of all trouble tickets.
 * @returns A promise that resolves to an array of TroubleTicket objects.
 */
export const getTickets = async (): Promise<TroubleTicket[]> => {
  const response = await apiFetch('/api/tickets');
  if (!response.ok) {
    throw new Error('Failed to fetch tickets');
  }
  return await response.json();
};