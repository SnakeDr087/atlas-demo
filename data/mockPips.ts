

// FIX: Add .ts extension to import path.
import type { PerformanceImprovementPlan } from '../types.ts';
import { mockOfficers } from './mockOfficers.ts';

const cpdOfficers = mockOfficers.filter(o => o.agency === 'Central Police Department');
const otherOfficers = mockOfficers.filter(o => o.agency !== 'Central Police Department');

export const mockPips: PerformanceImprovementPlan[] = [
  // === Central Police Department (Demo Agency PIPs) ===
  {
    id: 'PIP-CPD-001',
    officer: cpdOfficers[0], // John Davis
    supervisor: 'Sgt. Miller',
    agency: 'Central Police Department',
    startDate: '2025-01-22',
    endDate: '2025-02-22',
    status: 'Active',
    reason: {
      summary: 'This PIP is initiated due to a pattern of unprofessional demeanor during citizen interactions, specifically related to tone and non-verbal communication, as identified in BWC review for case #2025-00155.',
      areas: [
          { id: 1, area: 'Professional Demeanor', description: 'Officer has shown a pattern of escalating verbal commands too quickly, missing opportunities for de-escalation and positive communication.', relatedKpis: 'Demeanor, Uses polite language, Maintains a calm tone of voice', examples: 'BWC Review Case #2025-00155 @ 01:34; BWC Review Case #2025-00123 @ 00:26' }
      ]
    },
    objectives: [
      {
        id: 1,
        objective: 'Improve use of verbal de-escalation and professional communication during citizen interactions.',
        expectedOutcome: 'Officer will consistently use a calm tone and empathetic language, providing clear rationale for commands, aligning with the LEAPS model.',
        successMetrics: 'A 75% reduction in citizen complaints regarding demeanor and positive supervisor reviews on the next 5 randomly selected BWC interactions.',
        deadline: '2025-02-22'
      }
    ],
    supportAndResources: {
        trainingModules: 'Verbal Judo (Online Refresher), De-escalation Tactics (Module 3)',
        mentorship: 'FTO Chris Evans',
        rideAlongs: 'One 4-hour ride-along with FTO Evans scheduled for 2025-02-05.',
        resourceAccess: 'Access to SOP Manual Section 4.2 (De-escalation), ATLAS review portal.'
    },
    checkIns: [
      {
        id: 1,
        date: '2025-01-29',
        method: 'In-Person',
        topics: 'Review of Verbal Judo module, discussion of recent traffic stop.',
        notes: 'Officer Davis was receptive and understood the core concepts. We reviewed one recent stop where improvement was noted in initial contact.'
      }
    ],
    finalEvaluation: {
        improvementAchieved: null,
        remainingConcerns: '',
        recommendations: { removeFromPip: false, extendPip: false, additionalTraining: false, furtherReview: false }
    },
    signatures: {
      officerSignature: 'John Davis',
      officerDate: '2025-01-22',
      supervisorSignature: 'Sgt. Miller',
      supervisorDate: '2025-01-22',
    }
  },
  {
    id: 'PIP-CPD-002',
    officer: cpdOfficers[1], // David Brown
    supervisor: 'Sgt. Anderson',
    agency: 'Central Police Department',
    startDate: '2025-02-10',
    endDate: '2025-03-10',
    status: 'Active',
    reason: {
      summary: 'This PIP addresses multiple instances of failing to follow proper procedure during high-risk events, specifically regarding communication with dispatch and maintaining situational awareness, as noted in case #2025-00182.',
      areas: [
          { id: 1, area: 'Procedural Adherence', description: 'Failure to notify dispatch of location and status during a suspicious event, leading to a delayed backup response.', relatedKpis: 'Failing to notify Dispatch of your location', examples: 'BWC Review Case #2025-00182' }
      ]
    },
    objectives: [
      {
        id: 1,
        objective: 'Ensure 100% compliance with dispatch communication protocols for all self-initiated events.',
        expectedOutcome: 'All BWC and CAD records for self-initiated events will show proper notification of location, subject description, and final disposition.',
        successMetrics: 'Zero "Failure to Notify" flags in all BWC reviews over the next 30 days.',
        deadline: '2025-03-10'
      }
    ],
    supportAndResources: {
        trainingModules: 'Radio Procedures (Mandatory Review)',
        mentorship: 'N/A',
        rideAlongs: 'N/A',
        resourceAccess: 'SOP Manual Section 2.1 (Radio Communications).'
    },
    checkIns: [],
    finalEvaluation: {
        improvementAchieved: null,
        remainingConcerns: '',
        recommendations: { removeFromPip: false, extendPip: false, additionalTraining: false, furtherReview: false }
    },
    signatures: {
      officerSignature: '',
      officerDate: '',
      supervisorSignature: 'Sgt. Anderson',
      supervisorDate: '2025-02-10',
    }
  },

  // === Other Agency PIPs for System-Wide Context ===
  {
    id: 'PIP-001',
    officer: otherOfficers[3], // Jessica Garcia
    supervisor: 'Sgt. Williams',
    agency: 'Southpoint Police Department',
    startDate: '2025-01-20',
    endDate: '2025-02-20',
    status: 'Successfully Completed',
    reason: {
      summary: 'To address performance areas identified during BWC reviews.',
      areas: [ { id: 1, area: 'De-escalation Techniques', description: 'Pattern of escalating verbal commands too quickly.', relatedKpis: 'Use of De-escalation Techniques', examples: 'BWC Case #2025-00135' } ]
    },
    objectives: [ { id: 1, objective: 'Improve use of verbal de-escalation.', expectedOutcome: 'Consistent use of calm tone and empathetic language.', successMetrics: '50% reduction in escalated voice commands over 5 reviews.', deadline: '2025-02-20' } ],
    supportAndResources: { trainingModules: 'Verbal Judo online course.', mentorship: 'FTO Sgt. Evans', rideAlongs: 'One 4-hour ride-along.', resourceAccess: 'SOP Manual Section 4.2.' },
    checkIns: [ { id: 1, date: '2025-01-27', method: 'In-Person', topics: 'Review of Verbal Judo module.', notes: 'Officer was receptive and understood core concepts.' } ],
    finalEvaluation: { improvementAchieved: 'Yes', remainingConcerns: '', recommendations: { removeFromPip: true, extendPip: false, additionalTraining: false, furtherReview: false } },
    signatures: { officerSignature: 'Jessica Garcia', officerDate: '2025-02-19', supervisorSignature: 'Sgt. Williams', supervisorDate: '2025-02-20' }
  }
];