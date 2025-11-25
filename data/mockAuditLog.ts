// FIX: Populating placeholder file to resolve module errors.
import type { AuditLogItem } from '../types.ts';

export const mockAuditLog: AuditLogItem[] = [
  {
    id: 'ALOG-001',
    timestamp: '2025-06-28 14:32:11',
    user: 'Sys Admin',
    role: 'Super Admin',
    action: 'AGENCY_PLAN_UPGRADE',
    details: 'State Trooper Division upgraded to Enterprise plan.',
    ipAddress: '192.168.1.101',
  },
  {
    id: 'ALOG-002',
    timestamp: '2025-06-28 10:15:45',
    user: 'Sgt. Miller',
    role: 'Agency Supervisor',
    action: 'TICKET_SUBMITTED',
    details: 'Submitted trouble ticket TKT-004 for Southpoint PD.',
    ipAddress: '10.0.5.22',
  },
  {
    id: 'ALOG-003',
    timestamp: '2025-06-27 16:05:02',
    user: 'Sgt. Miller',
    role: 'Agency Supervisor',
    action: 'OFFICER_BULK_ADD',
    details: 'Added 15 new officers to Central Police Department.',
    ipAddress: '10.0.5.22',
  },
  {
    id: 'ALOG-004',
    timestamp: '2025-06-27 09:30:00',
    user: 'Sgt. Rodriguez',
    role: 'Agency Supervisor',
    action: 'BWC_BULK_UPLOAD',
    details: 'Uploaded 52 BWC files for North County Sheriff\'s Office.',
    ipAddress: '10.1.2.88',
  },
  {
    id: 'ALOG-005',
    timestamp: '2025-06-26 11:00:18',
    user: 'Sys Admin',
    role: 'Super Admin',
    action: 'AGENCY_STATUS_CHANGE',
    details: 'Changed status of Eastwood Police Department to Active.',
    ipAddress: '192.168.1.101',
  },
];
