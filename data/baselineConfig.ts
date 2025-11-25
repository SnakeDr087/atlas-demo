import { kpisByIncidentType } from './kpis.ts';

export const baselineIncidentTypes = Object.keys(kpisByIncidentType);

export const baselineKpis = kpisByIncidentType;

export const baselineSafetyItems = [
    "Maintained Situational Awareness",
    "Used Protective Gear",
    "Called for Backup",
    "Used De-escalation Techniques",
    "Failing to notify Dispatch of your location",
    "Failing to separate parties when conducting interviews",
];

export const baselineDispositions = [
    "Verbal warning issued",
    "Citation issued",
    "Subject arrested",
    "Report filed, no action",
    "Citizen assist provided",
];
