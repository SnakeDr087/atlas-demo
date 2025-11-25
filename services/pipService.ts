import type { PerformanceImprovementPlan } from '../types';
import { apiFetch } from './mockApi';

/**
 * Fetches the list of all Performance Improvement Plans (PIPs).
 * @returns A promise that resolves to an array of PerformanceImprovementPlan objects.
 */
export const getPips = async (): Promise<PerformanceImprovementPlan[]> => {
  const response = await apiFetch('/api/pips');
  if (!response.ok) {
    throw new Error('Failed to fetch PIPs');
  }
  return await response.json();
};