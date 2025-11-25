

// FIX: Add .ts extension to import path.
import type { TroubleTicket } from '../types.ts';

export const mockTickets: TroubleTicket[] = [
  {
    id: 'TKT-001',
    submitter: 'Sgt. Miller',
    agency: 'Central Police Department',
    date: '2025-01-28',
    subject: 'Cannot export BWC analysis report',
    category: 'Bug Report',
    priority: 'High',
    status: 'Open',
    description: 'When I click the "Export CSV" button on the BWC Analysis page, nothing happens. I have tried on Chrome and Firefox. No errors in the console.',
    pageAffected: 'BWC Analysis Page',
  },
  {
    id: 'TKT-004',
    submitter: 'Sgt. Anderson',
    agency: 'Central Police Department',
    date: '2025-02-10',
    subject: 'Data Discrepancy in Monthly Summary',
    category: 'Data Discrepancy',
    priority: 'Medium',
    status: 'In Progress',
    description: 'The "Coaching" metric on my dashboard for last month shows 5, but I only count 4 completed coaching reviews in the system. Can you investigate?',
    pageAffected: 'Dashboard',
  },
  {
    id: 'TKT-002',
    submitter: 'Lt. Evans',
    agency: 'State Trooper Division',
    date: '2025-01-27',
    subject: 'Feature Request: Bulk officer import',
    category: 'Feature Request',
    priority: 'Medium',
    status: 'In Progress',
    description: 'It would be great if we could import a list of officers from a CSV file instead of adding them one by one. This would save a lot of time during initial setup.',
    pageAffected: 'Officer Management',
  },
  {
    id: 'TKT-003',
    submitter: 'Sgt. Rodriguez',
    agency: "North County Sheriff's Office",
    date: '2025-01-26',
    subject: 'Officer profile not updating',
    category: 'Account Issue',
    priority: 'High',
    status: 'Resolved',
    description: 'The education level for Officer Smith is not saving correctly. I change it to "Bachelor\'s Degree" and it reverts to "Associate\'s Degree" after I refresh.',
    pageAffected: 'Officer Profile Page',
  },
];