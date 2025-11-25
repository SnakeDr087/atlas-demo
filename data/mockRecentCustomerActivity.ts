import type { RecentCustomerActivityItem } from '../types.ts';

export const mockRecentCustomerActivity: RecentCustomerActivityItem[] = [
  {
    id: 'ACT-001',
    agencyName: 'Central Police Department',
    action: 'New officer account approved',
    date: '1 hour ago',
    icon: 'user',
  },
  {
    id: 'ACT-002',
    agencyName: 'State Trooper Division',
    action: 'Uploaded 12 BWC files',
    date: '3 hours ago',
    icon: 'upload',
  },
  {
    id: 'ACT-003',
    agencyName: "North County Sheriff's Office",
    action: 'Submitted a new trouble ticket',
    date: 'Yesterday',
    icon: 'ticket',
  },
  {
    id: 'ACT-004',
    agencyName: 'Southpoint Police Department',
    action: 'Subscription plan upgraded to Pro',
    date: '2 days ago',
    icon: 'payment',
  },
];
