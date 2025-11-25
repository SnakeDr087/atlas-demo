

import type { SentimentReport } from '../types.ts';
import { mockOfficers } from './mockOfficers.ts';

const cpdOfficers = mockOfficers.filter(o => o.agency === 'Central Police Department');

export const mockSentimentReports: SentimentReport[] = [
  // === Central Police Department (Demo Agency Reports) ===
  {
    id: 'SENT-CPD-001',
    officer: cpdOfficers[0], // John Davis
    reviewDate: '2025-01-20',
    status: 'Complete',
    sentimentScore: 'Moderate Stress',
    wellnessCategory: 'Monitor',
    createdBy: 'Sgt. Anderson',
    indicators: ['Raised Voice', 'Long Pauses', 'Rapid Speech'],
    emotionalCues: 'Officer sounded fatigued during the second half of the interaction and his speech quickened when challenged by the citizen.',
    emotionalTone: ['Frustration', 'Anxiety'],
    communicationStyle: 'Assertive',
    keyPhrases: ["Just let me see your license.", "I've already explained it twice."],
    supervisorComments: 'AI findings are consistent with the high-stress nature of the call. Officer handled it professionally, but recommend a follow-up to discuss stress management techniques.',
    recommendations: { noAction: false, peerSupport: false, wellnessCheckIn: true, resilienceTraining: false, supervisorFollowUp: true },
  },
  {
    id: 'SENT-CPD-002',
    officer: cpdOfficers[2], // Sarah Jenkins
    reviewDate: '2025-01-24',
    status: 'Complete',
    sentimentScore: 'Low Stress',
    wellnessCategory: 'Supportive',
    createdBy: 'Sgt. Miller',
    indicators: ['Calm Tone', 'Empathetic Language'],
    emotionalCues: 'Tone was calm and measured throughout the citizen assist, even when the citizen was initially upset.',
    emotionalTone: ['Calmness', 'Empathy'],
    communicationStyle: 'Collaborative',
    keyPhrases: ["I understand you're frustrated, let's figure this out.", "How can I help you right now?"],
    supervisorComments: 'Excellent example of de-escalation and positive community engagement. No wellness concerns noted. This report will be used for her commendation.',
    recommendations: { noAction: true, peerSupport: false, wellnessCheckIn: false, resilienceTraining: false, supervisorFollowUp: false },
  },

  // === Other Agency Reports for System-Wide Context ===
  {
    id: 'SENT-003',
    officer: mockOfficers.find(o => o.id === 'OFF-006')!, // Jessica Garcia
    reviewDate: '2025-01-25',
    status: 'Draft',
    sentimentScore: 'High Stress',
    wellnessCategory: 'Follow-up Recommended',
    createdBy: 'Sgt. Williams',
    indicators: ['Defensive Tone', 'Repeated Interruptions', 'Sarcasm'],
    emotionalCues: 'Officer\'s tone became increasingly defensive when challenged by the citizen.',
    supervisorComments: 'The AI detected significant stress indicators that warrant a direct conversation. The interaction, while not a policy violation, shows signs of burnout.',
    recommendations: { noAction: false, peerSupport: true, wellnessCheckIn: true, resilienceTraining: true, supervisorFollowUp: true },
  },
];