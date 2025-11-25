import type { SummaryReport } from '../types.ts';
import { mockOfficers } from './mockOfficers.ts';

const supervisors = ['Sgt. Miller', 'Lt. Rodriguez', 'Capt. Evans'];
const incidentTypes = ["Traffic Stop", "Welfare Check", "Citizen Assist", "Use of Force", "Vehicle Pursuit", "Noise Complaint", "DWI"];
const outcomes = ['No Action', 'Commendation', 'Coaching', 'Training', 'Internal Affairs', 'Performance Improvement Plan'];
const shifts = ['Day', 'Night', 'Swing'];

const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateRandomDate = (start: Date, end: Date): string => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
};

const createSampleContent = (
    filters: { [key: string]: string },
    reportsAnalyzed: number,
    officerBreakdown: { name: string, count: number }[],
    outcomeBreakdown: { [key: string]: number },
    incidentTypeBreakdown: { [key: string]: number },
    shiftBreakdown: { [key: string]: number }
): string => {

    const filterLines = Object.keys(filters).length > 0
        ? Object.entries(filters)
            .map(([key, value]) => {
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return `* ${label}: ${value || 'Any'}`;
            })
            .join('\n')
        : '* Filters: Any';

    const officerLines = officerBreakdown.map(o => `* ${o.name}: ${o.count} reports`).join('\n');
    const outcomeLines = outcomes.map(o => `* ${o}: ${outcomeBreakdown[o] || 0}`).join('\n');
    const incidentTypeLines = Object.entries(incidentTypeBreakdown).map(([type, count]) => `* ${type}: ${count}`).join('\n');
    const shiftLines = shifts.map(s => `* ${s}: ${shiftBreakdown[s] || 0}`).join('\n');

    const mainOfficer = officerBreakdown.length > 0 ? officerBreakdown[0].name : 'various officers';
    const mainIncidentType = Object.keys(incidentTypeBreakdown).length > 0 ? Object.keys(incidentTypeBreakdown)[0] : 'various incidents';
    const mainOutcome = Object.keys(outcomeBreakdown).length > 0 ? Object.keys(outcomeBreakdown).find(k => outcomeBreakdown[k] > 0) || 'various outcomes' : 'various outcomes';

    return `
[FILTER_CRITERIA]
The following criteria were used to generate this analysis:
${filterLines}

[EXECUTIVE_SUMMARY]
This report provides a summary of ${reportsAnalyzed} incident reports, with a primary focus on incidents involving ${mainOfficer}. The data indicates that the most common incident type analyzed was "${mainIncidentType}", frequently resulting in an outcome of "${mainOutcome}". This suggests a consistent pattern in how these specific types of incidents are being resolved within the filtered dataset.

[REPORT_OVERVIEW]
A total of ${reportsAnalyzed} reports were analyzed for this summary. The date ranges for these reports are not specified in the current filter set.

[INCIDENT_ANALYSIS]
The incident analysis reveals a focused dataset based on the specified criteria. A breakdown of key metrics is provided below for clarity.
${outcomeLines}
${incidentTypeLines}
${shiftLines}

[OFFICER_ANALYSIS]
The following officers were involved in the analyzed reports, with the corresponding number of incidents for each.
${officerLines}
No specific demographic filters such as years of experience or education level were applied in this report.

[KEY_FINDINGS]
The data indicates that for the filtered criteria, incidents involving ${mainOfficer} are a key area of focus. The prevalence of "${mainIncidentType}" incidents ending in "${mainOutcome}" warrants attention as it represents the most significant trend within this dataset. Further analysis could explore the context behind this pattern.
    `.trim();
};


export const mockSummaryReports: SummaryReport[] = [];

for (let i = 0; i < 20; i++) {
    const filters: { [key: string]: string } = {};
    const reportsAnalyzed = getRandomInt(5, 25);
    const supervisor = getRandomItem(supervisors);
    
    // Officer Breakdown
    const numOfficers = getRandomInt(1, 3);
    const officerBreakdown: { name: string, count: number }[] = [];
    let reportsLeft = reportsAnalyzed;
    const usedOfficers = new Set();
    for (let j = 0; j < numOfficers; j++) {
        let officer = getRandomItem(mockOfficers);
        while(usedOfficers.has(officer.id)) {
            officer = getRandomItem(mockOfficers);
        }
        usedOfficers.add(officer.id);

        const count = j === numOfficers - 1 ? reportsLeft : getRandomInt(1, Math.max(1, reportsLeft - (numOfficers - 1 - j)));
        reportsLeft -= count;
        officerBreakdown.push({ name: `${officer.firstName} ${officer.lastName}`, count });
    }

    // Outcome Breakdown
    const outcomeBreakdown: { [key: string]: number } = {};
    outcomes.forEach(o => outcomeBreakdown[o] = 0);
    for (let j = 0; j < reportsAnalyzed; j++) {
        outcomeBreakdown[getRandomItem(outcomes)]++;
    }

    // Incident Type Breakdown
    const incidentTypeBreakdown: { [key: string]: number } = {};
    reportsLeft = reportsAnalyzed;
    const numIncidentTypes = getRandomInt(1, 4);
    const usedTypes = new Set();
    for (let j = 0; j < numIncidentTypes; j++) {
        let type = getRandomItem(incidentTypes);
        while(usedTypes.has(type)) {
            type = getRandomItem(incidentTypes);
        }
        usedTypes.add(type);

        const count = j === numIncidentTypes - 1 ? reportsLeft : getRandomInt(1, Math.max(1, reportsLeft - (numIncidentTypes - 1 - j)));
        if (count > 0) {
            reportsLeft -= count;
            incidentTypeBreakdown[type] = count;
        }
    }
    if (reportsLeft > 0) {
        const firstType = Object.keys(incidentTypeBreakdown)[0];
        if (firstType) incidentTypeBreakdown[firstType] += reportsLeft;
        else if(usedTypes.size > 0) incidentTypeBreakdown[Array.from(usedTypes)[0] as string] = reportsLeft;
        else incidentTypeBreakdown[getRandomItem(incidentTypes)] = reportsLeft;
    }


    // Shift Breakdown
    const shiftBreakdown: { [key: string]: number } = { Day: 0, Night: 0, Swing: 0 };
    for (let j = 0; j < reportsAnalyzed; j++) {
        shiftBreakdown[getRandomItem(shifts)]++;
    }

    // Set a primary filter for context
    const filterType = getRandomItem(['officer', 'incidentType', 'outcome']);
    if (filterType === 'officer' && officerBreakdown.length > 0) filters['Officer'] = officerBreakdown[0].name;
    if (filterType === 'incidentType' && Object.keys(incidentTypeBreakdown).length > 0) filters['Incident Type'] = Object.keys(incidentTypeBreakdown)[0];
    if (filterType === 'outcome' && Object.keys(outcomeBreakdown).length > 0) filters['Follow Up'] = Object.keys(outcomeBreakdown).find(k => outcomeBreakdown[k] > 0) || '';

    const generatedDate = generateRandomDate(new Date(2025, 0, 1), new Date());
    
    mockSummaryReports.push({
        id: `SUM-${Date.now() + i}`,
        title: `Summary for ${Object.values(filters)[0] || 'General Review'}`,
        generatedDate: generatedDate,
        generatedBy: supervisor,
        filters,
        content: createSampleContent(filters, reportsAnalyzed, officerBreakdown, outcomeBreakdown, incidentTypeBreakdown, shiftBreakdown),
    });
}