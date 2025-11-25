
// FIX: Add .ts extension to import path.
import type { InPersonReview } from '../types.ts';
// FIX: Add .ts extension to import path.
import { mockOfficers } from './mockOfficers.ts';

const cpdOfficers = mockOfficers.filter(o => o.agency === 'Central Police Department');

export const mockInPersonReviews: InPersonReview[] = [
  // === Central Police Department (Demo Agency Reviews) ===
  {
    id: 'IPR-CPD-001',
    caseNumber: '2025-00123', // Matches REP-CPD-001 for John Davis
    officer: cpdOfficers[0], // John Davis
    reviewDate: '2025-01-08',
    reviewTime: '09:00',
    reviewLocation: 'Sgt. Anderson\'s Office',
    bwcFootageDate: '2025-01-05',
    reviewer: 'Sgt. Anderson',
    status: 'Completed',
    reviewPurpose: {
        purpose: 'Coaching',
        statement: 'Review of traffic stop from Jan 5 to discuss communication tone and de-escalation opportunities.',
    },
    officerReflection: {
        summary: "Officer Davis stated he felt the driver was being dismissive and his tone reflected a need to maintain control of the stop.",
        challenge: "Maintaining a polite demeanor when feeling disrespected.",
        alternatives: "Acknowledged he could have used a more conversational tone instead of being immediately authoritative."
    },
    supervisorReview: {
        keyMoments: "Footage confirms the driver was compliant. Officer's tone at 0:26 was unnecessarily sharp. The rest of the stop was professional."
    },
    policyAlignment: {
        useOfForce: 'N/A',
        bwcActivation: 'Aligned',
        communication: 'Not Aligned',
        deescalation: 'Aligned',
        searchAndSeizure: 'N/A',
        observations: "The core of the stop was policy-compliant, but the communication did not meet the department's standard for courteous interaction."
    },
    problemSolving: {
        trainingComparison: "The officer's actions were technically correct but lacked the soft skills emphasized in recent Verbal Judo training.",
        supportNeeded: "Reinforced concepts from Verbal Judo, specifically LEAPS (Listen, Empathize, Ask, Paraphrase, Summarize)."
    },
    reviewOutcome: {
        categories: { coaching: true, commendation: false, informational: true, referralToTraining: false, referralToPolicy: false, followUpRequired: false },
        explanation: 'Informal coaching was successful. Officer Davis acknowledged the feedback and will apply LEAPS model in future interactions. No further action needed at this time.'
    },
    acknowledgement: { officerPresent: true, supervisorSignature: 'Sgt. Anderson' }
  },
  {
    id: 'IPR-CPD-002',
    caseNumber: '',
    officer: cpdOfficers[2], // Sarah Jenkins
    reviewDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0], // 5 days from now
    reviewTime: '14:00',
    reviewLocation: 'Briefing Room 1',
    reviewer: 'Sgt. Miller',
    status: 'Scheduled',
    notes: 'Scheduled review for Commendation nomination regarding citizen assist on case #2025-00160.',
  },

  // === Other Agency Reviews for System-Wide Context ===
  {
    id: 'IPR-001',
    caseNumber: '2025-00135',
    officer: mockOfficers.find(o => o.id === 'OFF-006')!, // Jessica Garcia
    reviewDate: '2025-01-15',
    reviewTime: '10:00',
    reviewLocation: 'Briefing Room 2',
    bwcFootageDate: '2025-01-10',
    reviewer: 'Sgt. Williams',
    status: 'Completed',
    reviewPurpose: { purpose: 'Coaching', statement: 'Review of use-of-force incident.' },
    officerReflection: { summary: "Subject was non-compliant.", challenge: "Maintaining control.", alternatives: "Could have requested backup sooner." },
    supervisorReview: { keyMoments: "De-escalation attempts were minimal before physical force was used." },
    policyAlignment: { useOfForce: 'Aligned', bwcActivation: 'Aligned', communication: 'Not Aligned', deescalation: 'Not Aligned', searchAndSeizure: 'N/A', observations: "Communication and de-escalation opportunities were missed." },
    problemSolving: { trainingComparison: "Lacked nuance of advanced de-escalation training.", supportNeeded: "Verbal de-escalation refresher course." },
    reviewOutcome: { categories: { coaching: true, commendation: false, informational: false, referralToTraining: true, referralToPolicy: false, followUpRequired: true }, explanation: 'Coaching provided. Formal referral to de-escalation training. Follow-up in 30 days.' },
    acknowledgement: { officerPresent: true, supervisorSignature: 'Sgt. Williams' }
  },
  {
    id: 'IPR-002',
    caseNumber: '2025-00128',
    officer: mockOfficers.find(o => o.id === 'OFF-003')!, // Michael Johnson
    reviewDate: '2025-01-18',
    reviewTime: '14:30',
    reviewLocation: 'Sgt. Office',
    bwcFootageDate: '2025-01-08',
    reviewer: 'Lt. Evans',
    status: 'Completed',
    reviewPurpose: { purpose: 'Performance Review', statement: '' },
    officerReflection: { summary: '', challenge: '', alternatives: '' },
    supervisorReview: { keyMoments: '' },
    policyAlignment: { useOfForce: 'N/A', bwcActivation: 'Aligned', communication: 'Aligned', deescalation: 'Aligned', searchAndSeizure: 'Aligned', observations: '' },
    reviewOutcome: { categories: { coaching: false, commendation: true, informational: false, referralToTraining: false, referralToPolicy: false, followUpRequired: false }, explanation: '' },
    acknowledgement: { officerPresent: true, supervisorSignature: 'Lt. Evans' }
  },
];