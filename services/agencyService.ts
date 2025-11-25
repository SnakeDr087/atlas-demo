import type { Agency, Invoice, User } from '../types';
import { apiFetch } from './mockApi';

export const getAgencies = async (): Promise<Agency[]> => {
  const response = await apiFetch('/api/agencies');
  if (!response.ok) {
    throw new Error('Failed to fetch agencies');
  }
  return await response.json();
};

export const addAgency = async (agencyData: any): Promise<{ newAgency: Agency, credentials?: { username: string, password: string } }> => {
    const response = await apiFetch('/api/agencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agencyData),
    });
    if (!response.ok) {
        throw new Error('Failed to add agency');
    }
    return await response.json();
};

export const updateAgency = async (agencyData: Agency): Promise<Agency> => {
    const response = await apiFetch(`/api/agencies/${agencyData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agencyData),
    });
    if (!response.ok) {
        throw new Error('Failed to update agency');
    }
    return await response.json();
};

// This will mark an agency as 'Inactive'
export const deleteAgency = async (agencyId: string): Promise<Agency> => {
    const response = await apiFetch(`/api/agencies/${agencyId}`, {
        method: 'DELETE',
    });
     if (!response.ok) {
        throw new Error('Failed to update agency status');
    }
    return await response.json();
};


export const getInvoices = async (): Promise<Invoice[]> => {
    const response = await apiFetch('/api/invoices');
    if (!response.ok) {
        throw new Error('Failed to fetch invoices');
    }
    return await response.json();
};

// FIX: Add a function to add a new invoice.
export const addInvoice = async (invoiceData: Omit<Invoice, 'id'>): Promise<Invoice> => {
    const response = await apiFetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData),
    });
    if (!response.ok) {
        throw new Error('Failed to add invoice');
    }
    return await response.json();
};