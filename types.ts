import React from 'react';

// This file contains all the core type definitions for the ATLAS application.

export type UserRole = 'Super Admin' | 'Agency Admin' | 'Agency Supervisor' | 'Officer';

export interface User {
    id: string;
    name: string;
    role: UserRole;
    agency?: string;
    password?: string; // Should not be sent to client, but exists in mock data
    status: 'Active' | 'Inactive';
    isGuest?: boolean; // Flag to identify temporary demo users
}

export type ViewType =
    | 'Dashboard'
    | 'Agencies'
    | 'Officers'
    | 'Summary Reports'
    | 'BWC Analysis'
    | 'New BWC Report'
    | 'In-Person Review'
    | 'Sentiment Analysis'
    | 'PIPs'
    | 'Trouble Tickets'
    | 'Submit Ticket'
    | 'My Reports'
    | 'My PIPs'
    | 'AI Settings'
    | 'Pending Approvals'
    | 'Billing'
    | 'Audit Log'
    | 'Agency Settings'
    | 'User Management'
    | 'Tutorial';

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

export interface Officer {
    id: string;
    firstName: string;
    lastName: string;
    badgeNumber: string;
    rank: string;
    agency: string;
    status: 'Active' | 'On Leave' | 'Retired' | 'Terminated';
    incidents: number;
    score: number;
    dob: string;
    hireDate: string;
    education: string;
    gender: string;
    race: string;
    shift: 'Day' | 'Night' | 'Swing';
}

export interface Agency {
    id: string;
    name: string;
    liaison: string;
    contact: string;
    status: 'Active' | 'Inactive' | 'Pending';
    officerCount: number;
    score: number;
    openCases: number;
    subscriptionPlan: 'Core' | 'Pro' | 'Elite';
    monthlyCost: number;
    storageUsed: number; // in GB
    storageAllocated: number; // in GB
    bwcVideoAnalysis: boolean;
    sentimentAnalysis: boolean;
    // Agency-specific customizable fields
    customIncidentTypes?: string[];
    customKpis?: { [incidentType: string]: string[] };
    customSafetyItems?: string[];
    customDispositions?: string[];
}

export type ReportCategory = 'No Action' | 'Commendation' | 'Coaching' | 'Training' | 'Internal Affairs' | 'Performance Improvement Plan';

export interface Report {
    id: string;
    caseNumber: string;
    officer: Officer;
    incidentDate: string;
    reportDate: string;
    status: 'Pending Review' | 'Under Review' | 'Review Complete' | 'Escalated';
    outcome: ReportCategory;
    incidentType: string;
}

export interface SummaryReport {
    id: string;
    title: string;
    generatedDate: string;
    generatedBy: string;
    content: string;
    filters: { [key: string]: string };
}

export interface TroubleTicket {
    id: string;
    submitter: string;
    agency: string;
    date: string;
    subject: string;
    category: 'Bug Report' | 'Feature Request' | 'Account Issue' | 'Data Discrepancy' | 'UI/UX Feedback' | 'Other';
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'Open' | 'In Progress' | 'Resolved';
    description: string;
    pageAffected: string;
}

export interface InPersonReview {
    id: string;
    caseNumber: string;
    officer: Officer;
    reviewDate: string;
    reviewTime: string;
    reviewLocation: string;
    reviewer: string;
    status: 'Scheduled' | 'Completed' | 'Canceled';
    notes?: string; // For initial scheduling
    bwcFootageDate?: string;
    reviewPurpose?: {
        purpose: string;
        statement: string;
    };
    officerReflection?: {
        summary: string;
        challenge: string;
        alternatives: string;
    };
    supervisorReview?: {
        keyMoments: string;
    };
    policyAlignment?: {
        useOfForce: 'Aligned' | 'Not Aligned' | 'N/A';
        bwcActivation: 'Aligned' | 'Not Aligned' | 'N/A';
        communication: 'Aligned' | 'Not Aligned' | 'N/A';
        deescalation: 'Aligned' | 'Not Aligned' | 'N/A';
        searchAndSeizure: 'Aligned' | 'Not Aligned' | 'N/A';
        observations: string;
    };
    problemSolving?: {
        trainingComparison: string;
        supportNeeded: string;
    };
    reviewOutcome?: {
        categories: {
            coaching: boolean;
            commendation: boolean;
            informational: boolean;
            referralToTraining: boolean;
            referralToPolicy: boolean;
            followUpRequired: boolean;
        };
        explanation: string;
    };
    acknowledgement?: {
        officerPresent: boolean;
        supervisorSignature: string;
    };
}

export interface PipImprovementArea {
    id: number;
    area: string;
    description: string;
    relatedKpis: string;
    examples: string;
}

export interface PipObjective {
    id: number;
    objective: string;
    expectedOutcome: string;
    successMetrics: string;
    deadline: string;
}

export interface PipCheckIn {
    id: number;
    date: string;
    method: 'In-Person' | 'Virtual';
    topics: string;
    notes: string;
}

export interface PerformanceImprovementPlan {
    id: string;
    officer: Officer;
    supervisor: string;
    agency: string;
    startDate: string;
    endDate: string;
    status: 'Draft' | 'Active' | 'Successfully Completed' | 'Extended' | 'Escalated';
    reason: {
        summary: string;
        areas: PipImprovementArea[];
    };
    objectives: PipObjective[];
    supportAndResources: {
        trainingModules: string;
        mentorship: string;
        rideAlongs: string;
        resourceAccess: string;
    };
    checkIns: PipCheckIn[];
    finalEvaluation: {
        improvementAchieved: 'Yes' | 'No' | null;
        remainingConcerns: string;
        recommendations: {
            removeFromPip: boolean;
            extendPip: boolean;
            additionalTraining: boolean;
            furtherReview: boolean;
        };
    };
    signatures: {
        officerSignature: string;
        officerDate: string;
        supervisorSignature: string;
        supervisorDate: string;
    };
}


export interface TranscriptSegment {
    id: number;
    timestamp: number; // in seconds
    speaker: 'Officer' | 'Civilian' | 'Dispatch';
    text: string;
}

export interface TimestampedComment {
    id: number;
    timestamp: number;
    text: string;
}

export interface BwcReport {
    id: string;
    caseNumber: string;
    department: string;
    reviewDate: string;
    incidentDate: string;
    incidentType: string;
    kpi: string;
    status: 'Processing' | 'Review Complete' | 'Failed';
    personnel: {
        supervisor: string;
        primaryOfficer: string; // officer ID
        backupOfficer?: string; // officer ID
    };
    location: {
        street: string;
        apt: string;
        floor: string;
        city: string;
        state: string;
    };
    time: {
        start: string;
        end: string;
    };
    officerSafetyItems: string[];
    disposition: string;
    followUp: string;
    supervisorNotes: {
        internal: string;
        reportFacing: string;
    };
    kpisForImprovement?: string[];
    aiSummary?: string;
    videoUrl?: string;
    transcript?: TranscriptSegment[];
    timestampedComments?: TimestampedComment[];
}

export interface SentimentReport {
    id: string;
    officer: Officer;
    reviewDate: string;
    status: 'Complete' | 'Draft';
    createdBy: string;
    supervisorComments: string;
    recommendations: {
        noAction: boolean;
        peerSupport: boolean;
        wellnessCheckIn: boolean;
        resilienceTraining: boolean;
        supervisorFollowUp: boolean;
    };
    // AI Generated Fields
    sentimentScore: 'Low Stress' | 'Moderate Stress' | 'High Stress';
    wellnessCategory: 'Supportive' | 'Monitor' | 'Follow-up Recommended';
    indicators: string[]; // e.g., 'Raised Voice', 'Long Pauses'
    emotionalCues: string; // A summary sentence
    emotionalTone?: string[]; // e.g., ['Frustration', 'Anxiety']
    communicationStyle?: string; // e.g., 'Assertive', 'Aggressive'
    keyPhrases?: string[]; // e.g., ["I'm done with this", "What do you want from me?"]
}

export interface Invoice {
    id: string;
    agencyId: string;
    agencyName: string;
    date: string;
    amount: number;
    status: 'Paid' | 'Due' | 'Overdue';
}

export interface AuditLogItem {
    id: string;
    timestamp: string;
    user: string;
    role: UserRole;
    action: string;
    details: string;
    ipAddress: string;
}

export interface PendingOfficer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    agency: string;
    requestedDate: string;
    status: 'Pending';
}

export interface RecentCustomerActivityItem {
    id: string;
    agencyName: string;
    action: string;
    date: string;
    icon: 'user' | 'upload' | 'ticket' | 'payment';
}

export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

export interface ConfirmationState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
}