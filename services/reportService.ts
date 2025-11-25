import type { Report, BwcReport } from '../types';
import { apiFetch } from './mockApi';

/**
 * Fetches the list of all summary reports.
 * @returns A promise that resolves to an array of Report objects.
 */
export const getReports = async (): Promise<Report[]> => {
  const response = await apiFetch('/api/reports');
  if (!response.ok) {
    throw new Error('Failed to fetch reports');
  }
  return await response.json();
};

/**
 * Fetches the list of all BWC analysis reports.
 * @returns A promise that resolves to an array of BwcReport objects.
 */
export const getBwcReports = async (): Promise<BwcReport[]> => {
  const response = await apiFetch('/api/bwc-reports');
  if (!response.ok) {
    throw new Error('Failed to fetch BWC reports');
  }
  return await response.json();
};

/**
 * Adds a new BWC report.
 */
export const addBwcReport = async (reportData: Omit<BwcReport, 'id'>): Promise<BwcReport> => {
    const response = await apiFetch('/api/bwc-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
    });
    if (!response.ok) {
        throw new Error('Failed to add BWC report');
    }
    return await response.json();
};

/**
 * Updates an existing BWC report.
 */
export const updateBwcReport = async (reportData: BwcReport): Promise<BwcReport> => {
    const response = await apiFetch(`/api/bwc-reports/${reportData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
    });
    if (!response.ok) {
        throw new Error('Failed to update BWC report');
    }
    return await response.json();
};

/**
 * Deletes a BWC report by its ID.
 */
export const deleteBwcReport = async (reportId: string): Promise<{ success: boolean }> => {
    const response = await apiFetch(`/api/bwc-reports/${reportId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete BWC report');
    }
    return await response.json();
};

/**
 * Fetches the list of all sentiment analysis reports.
 * In a real app this might be in its own service, but for simplicity it's here.
 */
export const getSentimentReports = async (): Promise<any[]> => {
    const response = await apiFetch('/api/sentiment-reports');
    if(!response.ok) throw new Error('Failed to fetch sentiment reports');
    return response.json();
}

export const addSentimentReport = async (reportData: any): Promise<any> => {
    const response = await apiFetch('/api/sentiment-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
    });
    if(!response.ok) throw new Error('Failed to add sentiment report');
    return response.json();
}