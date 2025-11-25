
// FIX: Corrected import path for types.
import type { Report, ReportCategory } from '../types.ts';

export interface ReportMetrics {
    total_reports: number;
    overall_score: number;
    positiveOutcomes: number;
    counts: Record<ReportCategory, number>;
    percentages: Record<ReportCategory, number>;
}

export const calculateReportMetrics = (reports: Report[]): ReportMetrics => {
    const total_reports = reports.length;
    if (total_reports === 0) {
        return {
            total_reports: 0,
            overall_score: 0,
            positiveOutcomes: 0,
            counts: { 'No Action': 0, 'Commendation': 0, 'Coaching': 0, 'Training': 0, 'Internal Affairs': 0, 'Performance Improvement Plan': 0 },
            percentages: { 'No Action': 0, 'Commendation': 0, 'Coaching': 0, 'Training': 0, 'Internal Affairs': 0, 'Performance Improvement Plan': 0 },
        };
    }
    
    const counts: Record<ReportCategory, number> = {
        'No Action': 0,
        'Commendation': 0,
        'Coaching': 0,
        'Training': 0,
        'Internal Affairs': 0,
        'Performance Improvement Plan': 0,
    };

    for (const report of reports) {
        if (counts[report.outcome] !== undefined) {
            counts[report.outcome]++;
        }
    }

    const positiveOutcomes = counts['No Action'] + counts['Commendation'];
    const overall_score = (positiveOutcomes / total_reports) * 100;
    
    const percentages = (Object.keys(counts) as ReportCategory[]).reduce((acc, key) => {
        acc[key] = (counts[key] / total_reports) * 100;
        return acc;
    }, {} as Record<ReportCategory, number>);

    return { total_reports, overall_score, positiveOutcomes, counts, percentages };
};

export const generateMonthlyPerformanceData = (reports: Report[]): { name: string; [key: string]: string | number }[] => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyData: { [key: string]: Record<ReportCategory, number> } = {};

    // Initialize the last 6 months
    for (let i = 0; i < 6; i++) {
        const date = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + i, 1);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[monthKey] = {
            'No Action': 0, 'Commendation': 0, 'Coaching': 0, 'Training': 0, 'Internal Affairs': 0, 'Performance Improvement Plan': 0
        };
    }

    // Populate with report data
    reports.forEach(report => {
        const reportDate = new Date(report.reportDate + 'T00:00'); // Ensure local timezone
        if (reportDate >= sixMonthsAgo) {
            const monthKey = `${reportDate.getFullYear()}-${String(reportDate.getMonth() + 1).padStart(2, '0')}`;
            if (monthlyData[monthKey] && monthlyData[monthKey][report.outcome] !== undefined) {
                monthlyData[monthKey][report.outcome]++;
            }
        }
    });

    // Format for Recharts
    return Object.entries(monthlyData).map(([monthKey, counts]) => {
        const [year, month] = monthKey.split('-').map(Number);
        const date = new Date(year, month - 1);
        return {
            name: monthNames[date.getMonth()],
            ...counts,
        };
    });
};
