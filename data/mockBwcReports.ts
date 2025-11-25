import type { BwcReport, TranscriptSegment } from '../types.ts';
import { mockOfficers } from './mockOfficers.ts';

// Helper to get officers from the primary demo agency
const cpdOfficers = mockOfficers.filter(o => o.agency === 'Central Police Department');

// Ensure we have officers to assign
if (cpdOfficers.length < 4) {
    throw new Error("Need at least 4 officers from Central Police Department in mockOfficers.ts for mock BWC reports.");
}

const [johnDavis, davidBrown, sarahJenkins, chrisEvans] = cpdOfficers;

export const mockBwcReports: BwcReport[] = [
    // Report 1: Commendation for Sarah Jenkins
    {
        id: 'BWC-CPD-001',
        caseNumber: '2025-0815A',
        department: 'Central Police Department',
        reviewDate: '2025-07-21',
        incidentDate: '2025-07-20',
        incidentType: 'Citizen Contact (Non-Criminal)',
        kpi: 'Actions Exceeded Agency Expectations',
        status: 'Review Complete',
        personnel: {
            supervisor: 'Sgt. Miller',
            primaryOfficer: sarahJenkins.id,
            backupOfficer: '',
        },
        location: {
            street: '789 Maple Drive',
            apt: '',
            floor: '',
            city: 'Metropolis',
            state: 'CA',
        },
        time: {
            start: '11:05',
            end: '11:25',
        },
        officerSafetyItems: ["Maintained Situational Awareness"],
        disposition: 'Citizen assist provided',
        followUp: 'Commendation',
        supervisorNotes: {
            internal: 'Officer Jenkins demonstrated outstanding community policing skills. A formal commendation has been submitted.',
            reportFacing: 'During a non-criminal citizen contact, Officer Jenkins went above and beyond her required duties. She patiently listened to an elderly citizen\'s concerns, provided clear information, and spent extra time ensuring they felt safe and heard. Her empathetic and professional demeanor reflects the highest standards of the department.',
        },
        kpisForImprovement: [],
        aiSummary: "AI analysis detected a supportive and low-stress interaction. The officer's tone was consistently calm and empathetic throughout. This is a model example of positive community engagement.",
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        transcript: [
            { id: 1, timestamp: 5, speaker: 'Officer', text: "Good morning, ma'am. I'm Officer Jenkins. Is everything alright here?" },
            { id: 2, timestamp: 12, speaker: 'Civilian', text: "Oh, officer, thank you for stopping. I was just worried about this package that was left on my porch. I wasn't expecting anything." },
            { id: 3, timestamp: 20, speaker: 'Officer', text: "I understand. Let me take a look. No suspicious markings... It seems to be addressed to your neighbor. It was likely just delivered to the wrong house by mistake." },
            { id: 4, timestamp: 30, speaker: 'Civilian', text: "Oh, dear. I feel so silly. I'm so sorry to have bothered you." },
            { id: 5, timestamp: 35, speaker: 'Officer', text: "Not a bother at all, ma'am. It's always better to be safe. I can take this over to your neighbor for you. You have a wonderful day." }
        ],
        timestampedComments: [
            { id: 1, timestamp: 35, text: "Excellent closing. Reassured the citizen and provided extra assistance. Great community policing." }
        ]
    },
    // Report 2: Coaching for John Davis
    {
        id: 'BWC-CPD-002',
        caseNumber: '2025-0817B',
        department: 'Central Police Department',
        reviewDate: '2025-07-22',
        incidentDate: '2025-07-21',
        incidentType: 'Traffic Stop',
        kpi: 'Communicate in a Courteous Manner',
        status: 'Review Complete',
        personnel: {
            supervisor: 'Sgt. Anderson',
            primaryOfficer: johnDavis.id,
            backupOfficer: '',
        },
        location: {
            street: '456 Oak Avenue',
            apt: '',
            floor: '',
            city: 'Metropolis',
            state: 'CA',
        },
        time: {
            start: '14:30',
            end: '14:45',
        },
        officerSafetyItems: ["Maintained Situational Awareness"],
        disposition: 'Verbal warning issued',
        followUp: 'Coaching',
        supervisorNotes: {
            internal: 'Reviewed with Officer Davis on 07/23. He was receptive to feedback and we role-played alternative phrasing for initial contact.',
            reportFacing: 'Officer Davis conducted the traffic stop in a procedurally correct manner. However, his initial approach and tone were unnecessarily authoritative, which created tension in a situation that did not warrant it. A coaching session was conducted to review communication techniques to ensure a more professional and courteous public interaction, in line with the LEAPS model.',
        },
        kpisForImprovement: ["Communicate in a Courteous Manner"],
        aiSummary: "AI analysis indicates a standard traffic stop for speeding. Audio analysis detected a sharp, demanding tone from the officer at timestamp 0:15, with a de-escalation in tone after the initial interaction.",
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        transcript: [
            { id: 1, timestamp: 15, speaker: 'Officer', text: "License and registration, now. You were doing 45 in a 30." },
            { id: 2, timestamp: 22, speaker: 'Civilian', text: "Whoa, okay, officer. I'm sorry, I didn't realize. Here you go." },
            { id: 3, timestamp: 45, speaker: 'Officer', text: 'Alright, Mr. Smith, everything looks clear. Just going to give you a warning today. Slow it down.' },
            { id: 4, timestamp: 52, speaker: 'Civilian', text: 'Thank you, officer. I will.' },
        ],
        timestampedComments: [
            { id: 1, timestamp: 15, text: "Supervisor Note: The initial contact is too aggressive. The command 'now' is unnecessary and confrontational." },
            { id: 2, timestamp: 45, text: "Good de-escalation here, but the initial tone set a negative stage for the interaction." }
        ]
    },
    // Report 3: Performance Improvement Plan for David Brown
    {
        id: 'BWC-CPD-003',
        caseNumber: '2025-0818C',
        department: 'Central Police Department',
        reviewDate: '2025-07-23',
        incidentDate: '2025-07-22',
        incidentType: 'Vehicular Pursuit',
        kpi: 'Notify Dispatch of the Reason for the Pursuit',
        status: 'Review Complete',
        personnel: {
            supervisor: 'Sgt. Anderson',
            primaryOfficer: davidBrown.id,
            backupOfficer: johnDavis.id,
        },
        location: {
            street: '123 Commerce St',
            apt: '',
            floor: '',
            city: 'Metropolis',
            state: 'CA',
        },
        time: {
            start: '21:50',
            end: '22:05',
        },
        officerSafetyItems: ["Failing to notify Dispatch of your location"],
        disposition: 'Subject arrested',
        followUp: 'Performance Improvement Plan',
        supervisorNotes: {
            internal: 'This is the 3rd time in 6 months Officer Brown has failed to follow radio protocol during a critical incident. Previous coaching has not corrected the behavior. A formal PIP is now required.',
            reportFacing: 'During a vehicular pursuit, Officer Brown failed to properly notify dispatch of the reason for the pursuit and did not provide consistent updates on location and speed, violating SOP 3.2.1. This created a significant officer safety issue and hampered the coordination of backup units. This recurring performance deficiency necessitates a formal Performance Improvement Plan.',
        },
        kpisForImprovement: ["Notify Dispatch of the Reason for the Pursuit", "Broadcast Speed", "Broadcast Traffic Conditions"],
        aiSummary: "AI analysis of the video shows a vehicle pursuit lasting approximately 15 minutes. The officer's vehicle reached high speeds. Radio traffic from the officer was intermittent and lacked key details required by policy, such as the initial reason for the pursuit.",
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        transcript: [
            { id: 1, timestamp: 10, speaker: 'Dispatch', text: '7994, what is your status?' },
            { id: 2, timestamp: 14, speaker: 'Officer', text: 'In pursuit of a blue sedan, northbound on Central Ave.' },
            { id: 3, timestamp: 45, speaker: 'Dispatch', text: '7994, what was the initial reason for the pursuit?' },
            { id: 4, timestamp: 50, speaker: 'Officer', text: '(No response, siren noise)' },
            { id: 5, timestamp: 90, speaker: 'Dispatch', text: '7994, advise reason for pursuit. Are you still northbound on Central?' }
        ],
        timestampedComments: [
            { id: 1, timestamp: 45, text: "Supervisor Note: Critical communication failure. Dispatch had to ask for the reason, and the officer did not respond." }
        ]
    },
    // Report 4: A report still in processing.
    {
        id: 'BWC-CPD-004',
        caseNumber: '2025-0819D',
        department: 'Central Police Department',
        reviewDate: '2025-07-24',
        incidentDate: '2025-07-23',
        incidentType: 'Domestic Violence',
        kpi: '',
        status: 'Processing',
        personnel: {
            supervisor: 'Sgt. Miller',
            primaryOfficer: chrisEvans.id,
            backupOfficer: sarahJenkins.id,
        },
        location: {
            street: '999 River Walk',
            apt: '3B',
            floor: '3',
            city: 'Metropolis',
            state: 'CA',
        },
        time: {
            start: '18:30',
            end: '18:55',
        },
        officerSafetyItems: [],
        disposition: '',
        followUp: 'No Action', // Default, to be updated by supervisor
        supervisorNotes: {
            internal: '',
            reportFacing: '',
        },
        kpisForImprovement: [],
        aiSummary: '', // Not generated yet
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        transcript: [], // Not generated yet
        timestampedComments: []
    }
];
