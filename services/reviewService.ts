import type { InPersonReview } from '../types';
import { apiFetch } from './mockApi';

/**
 * Fetches the list of all in-person reviews.
 * @returns A promise that resolves to an array of InPersonReview objects.
 */
export const getInPersonReviews = async (): Promise<InPersonReview[]> => {
  const response = await apiFetch('/api/reviews');
  if (!response.ok) {
    throw new Error('Failed to fetch in-person reviews');
  }
  return await response.json();
};

export const addReview = async (reviewData: Omit<InPersonReview, 'id'>): Promise<InPersonReview> => {
    const response = await apiFetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
    });
    if (!response.ok) throw new Error('Failed to add review');
    return response.json();
};

export const updateReview = async (reviewData: InPersonReview): Promise<InPersonReview> => {
    const response = await apiFetch(`/api/reviews/${reviewData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
    });
    if (!response.ok) throw new Error('Failed to update review');
    return response.json();
};

export const deleteReview = async (reviewId: string): Promise<{ success: boolean }> => {
    const response = await apiFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete review');
    return response.json();
};