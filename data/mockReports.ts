
// FIX: Add .ts extension to import path.
import type { Report } from '../types.ts';
import { mockOfficers } from './mockOfficers.ts';

const cpdOfficers = mockOfficers.filter(o => o.agency === 'Central Police Department');
const otherOfficers = mockOfficers.filter(o => o.agency !== 'Central Police Department');

export const mockReports: Report[] = [
  // === Central Police Department (Demo Agency Reports) ===
  {
    id: 'REP-CPD-001',
    caseNumber: '2025-00123',
    officer: cpdOfficers[0], // John Davis
    incidentDate: '2025-01-05',
    reportDate: '2025-01-06',
    status: 'Review Complete',
    outcome: 'Coaching',
    incidentType: 'Traffic Stop',
  },
  {
    id: 'REP-CPD-002',
    caseNumber: '2025-00140',
    officer: cpdOfficers[1], // David Brown
    incidentDate: '2025-01-12',
    reportDate: '2025-01-13',
    status: 'Pending Review',
    outcome: 'Training',
    incidentType: 'Vehicle Pursuit',
  },
  {
    id: 'REP-CPD-003',
    caseNumber: '2025-00141',
    officer: cpdOfficers[0], // John Davis
    incidentDate: '2025-01-14',
    reportDate: '2025-01-15',
    status: 'Pending Review',
    outcome: 'No Action',
    incidentType: 'Noise Complaint',
  },
  {
    id: 'REP-CPD-004',
    caseNumber: '2025-00150',
    officer: cpdOfficers[1], // David Brown
    incidentDate: '2025-01-18',
    reportDate: '2025-01-19',
    status: 'Review Complete',
    outcome: 'No Action',
    incidentType: 'Suspicious Event',
  },
  {
    id: 'REP-CPD-005',
    caseNumber: '2025-00155',
    officer: cpdOfficers[0], // John Davis
    incidentDate: '2025-01-20',
    reportDate: '2025-01-21',
    status: 'Review Complete',
    outcome: 'Performance Improvement Plan',
    incidentType: 'Demeanor',
  },
  {
    id: 'REP-CPD-006',
    caseNumber: '2025-00160',
    officer: cpdOfficers[2], // Sarah Jenkins
    incidentDate: '2025-01-23',
    reportDate: '2025-01-23',
    status: 'Review Complete',
    outcome: 'Commendation',
    incidentType: 'Citizen Assist',
  },
  {
    id: 'REP-CPD-007',
    caseNumber: '2025-00165',
    officer: cpdOfficers[3], // Chris Evans
    incidentDate: '2025-01-25',
    reportDate: '2025-01-26',
    status: 'Review Complete',
    outcome: 'No Action',
    incidentType: 'Welfare Check',
  },
  {
    id: 'REP-CPD-008',
    caseNumber: '2025-00170',
    officer: cpdOfficers[1], // David Brown
    incidentDate: '2025-01-28',
    reportDate: '2025-01-29',
    status: 'Escalated',
    outcome: 'Internal Affairs',
    incidentType: 'Use of Force',
  },
  {
    id: 'REP-CPD-009',
    caseNumber: '2025-00175',
    officer: cpdOfficers[2], // Sarah Jenkins
    incidentDate: '2025-02-02',
    reportDate: '2025-02-03',
    status: 'Under Review',
    outcome: 'Coaching',
    incidentType: 'Domestic Violence',
  },
  {
    id: 'REP-CPD-010',
    caseNumber: '2025-00180',
    officer: cpdOfficers[0], // John Davis
    incidentDate: '2025-02-05',
    reportDate: '2025-02-06',
    status: 'Review Complete',
    outcome: 'No Action',
    incidentType: 'Crash Investigation',
  },
   {
    id: 'REP-CPD-011',
    caseNumber: '2025-00182',
    officer: cpdOfficers[1], // David Brown
    incidentDate: '2025-02-08',
    reportDate: '2025-02-09',
    status: 'Review Complete',
    outcome: 'Performance Improvement Plan',
    incidentType: 'Demeanor',
  },

  // === Other Agency Reports for System-Wide Context ===
  {
    id: 'REP-002',
    caseNumber: '2025-00124',
    officer: otherOfficers[0], // Jane Smith
    incidentDate: '2025-01-07',
    reportDate: '2025-01-07',
    status: 'Review Complete',
    outcome: 'Commendation',
    incidentType: 'Citizen Assist',
  },
  {
    id: 'REP-003',
    caseNumber: '2025-00128',
    officer: otherOfficers[1], // Michael Johnson
    incidentDate: '2025-01-08',
    reportDate: '2025-01-09',
    status: 'Under Review',
    outcome: 'Coaching',
    incidentType: 'Traffic Stop',
  },
  {
    id: 'REP-004',
    caseNumber: '2025-00135',
    officer: otherOfficers[3], // Jessica Garcia
    incidentDate: '2025-01-10',
    reportDate: '2025-01-11',
    status: 'Escalated',
    outcome: 'Internal Affairs',
    incidentType: 'Use of Force',
  },
  {
    id: 'REP-007',
    caseNumber: '2025-00145',
    officer: otherOfficers[2], // Emily Williams
    incidentDate: '2025-01-16',
    reportDate: '2025-01-16',
    status: 'Review Complete',
    outcome: 'Coaching',
    incidentType: 'Citizen Contact (Non-Criminal)',
  },
  {
    id: 'REP-008',
    caseNumber: '2025-00148',
    officer: otherOfficers[0], // Jane Smith
    incidentDate: '2025-01-17',
    reportDate: '2025-01-18',
    status: 'Under Review',
    outcome: 'Training',
    incidentType: 'DWI',
  },
  {
    id: 'REP-010',
    caseNumber: '2025-00152',
    officer: otherOfficers[1], // Michael Johnson
    incidentDate: '2025-01-19',
    reportDate: '2025-01-20',
    status: 'Pending Review',
    outcome: 'No Action',
    incidentType: 'Crash Investigation',
  },
  {
    id: 'REP-012',
    caseNumber: '2025-00159',
    officer: otherOfficers[3], // Jessica Garcia
    incidentDate: '2025-01-21',
    reportDate: '2025-01-22',
    status: 'Under Review',
    outcome: 'Coaching',
    incidentType: 'Domestic Violence',
  }
];