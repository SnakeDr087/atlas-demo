import type { PendingOfficer } from '../types.ts';

export const mockPendingOfficers: PendingOfficer[] = [
    {
        id: 'PEND-001',
        firstName: 'Maria',
        lastName: 'Solace',
        email: 'msolace@example.com',
        agency: 'Central Police Department',
        requestedDate: '2025-06-29',
        status: 'Pending',
    },
    {
        id: 'PEND-002',
        firstName: 'Kevin',
        lastName: 'Hartford',
        email: 'khartford@example.com',
        agency: "North County Sheriff's Office",
        requestedDate: '2025-06-28',
        status: 'Pending',
    }
];
