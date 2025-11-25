
import type { Invoice } from '../types.ts';

export const mockInvoices: Invoice[] = [
  { id: 'INV-2025-06', agencyId: 'CPD-001', agencyName: 'Central Police Department', date: '2025-06-01', amount: 17000.00, status: 'Paid' },
  { id: 'INV-2025-05', agencyId: 'CPD-001', agencyName: 'Central Police Department', date: '2025-05-01', amount: 17000.00, status: 'Paid' },
  { id: 'INV-2025-04', agencyId: 'NCSO-002', agencyName: "North County Sheriff's Office", date: '2025-04-01', amount: 27000.00, status: 'Paid' },
  { id: 'INV-2025-03', agencyId: 'STD-003', agencyName: 'State Trooper Division', date: '2025-03-01', amount: 27000.00, status: 'Due' },
  { id: 'INV-2025-02', agencyId: 'WPD-004', agencyName: 'Westside Police District', date: '2025-02-01', amount: 12000.00, status: 'Overdue' },
  { id: 'INV-2025-01', agencyId: 'CPD-001', agencyName: 'Central Police Department', date: '2025-01-01', amount: 17000.00, status: 'Paid' },
  { id: 'INV-2024-12', agencyId: 'NCSO-002', agencyName: "North County Sheriff's Office", date: '2024-12-01', amount: 27000.00, status: 'Paid' },
  { id: 'INV-2024-11', agencyId: 'STD-003', agencyName: 'State Trooper Division', date: '2024-11-01', amount: 27000.00, status: 'Paid' },
];
