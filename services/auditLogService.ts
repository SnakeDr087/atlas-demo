import type { AuditLogItem } from '../types';
import { apiFetch } from './mockApi';

export const getAuditLog = async (): Promise<AuditLogItem[]> => {
  const response = await apiFetch('/api/audit-log');
  if (!response.ok) {
    throw new Error('Failed to fetch audit log');
  }
  return await response.json();
};

export const addAuditLogItem = async (logData: Omit<AuditLogItem, 'id' | 'timestamp' | 'ipAddress'>): Promise<AuditLogItem> => {
    const response = await apiFetch('/api/audit-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData),
    });
    if (!response.ok) {
        throw new Error('Failed to add audit log item');
    }
    return await response.json();
}