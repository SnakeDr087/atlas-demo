import React from 'react';
import Header from './Header';
import MetricCard from './MetricCard';
import SystemWideOutcomeProfile from './charts/SystemWideOutcomeProfile';
import PerformanceTrends from './charts/PerformanceTrends';
import RecentActivity from './RecentActivity';
import SuperAdminMetricCards from './SuperAdminMetricCards';
import { calculateReportMetrics, generateMonthlyPerformanceData } from '../utils/reportUtils';
import type { User, Report, Agency, TroubleTicket, Officer } from '../types';
import { TrendingUpIcon, StarIcon, UsersIcon, AcademicCapIcon, ShieldExclamationIcon, BullseyeIcon } from './IconComponents';

interface PerformanceDashboardProps {
    user: User;
    reports: Report[];
    agencies: Agency[];
    tickets: TroubleTicket[];
    officers: Officer[];
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ user, reports, agencies, tickets, officers }) => {
    const metrics = calculateReportMetrics(reports);
    const trendData = generateMonthlyPerformanceData(reports);

    const getHeaderDetails = () => {
        switch (user.role) {
            case 'Super Admin':
                return { title: 'System-wide Performance Metrics', scoreLabel: 'System Score' };
            case 'Agency Supervisor':
                return { title: 'Officer Performance Metrics', scoreLabel: 'Agency Score' };
            case 'Officer':
                return { title: 'My Performance Metrics', scoreLabel: 'My Score' };
            default:
                return { title: 'Performance Metrics', scoreLabel: 'Score' };
        }
    };

    const { title, scoreLabel } = getHeaderDetails();
    
    const performanceMetrics = [
        { title: 'No Action', value: metrics.counts['No Action'], percentage: metrics.percentages['No Action'], icon: <TrendingUpIcon className="h-8 w-8 text-green-500" />, color: 'bg-green-50' },
        { title: 'Commendation', value: metrics.counts['Commendation'], percentage: metrics.percentages['Commendation'], icon: <StarIcon className="h-8 w-8 text-blue-500" />, color: 'bg-blue-50' },
        { title: 'Coaching', value: metrics.counts['Coaching'], percentage: metrics.percentages['Coaching'], icon: <UsersIcon className="h-8 w-8 text-yellow-500" />, color: 'bg-yellow-50' },
        { title: 'Training', value: metrics.counts['Training'], percentage: metrics.percentages['Training'], icon: <AcademicCapIcon className="h-8 w-8 text-purple-500" />, color: 'bg-purple-50' },
        { title: 'Internal Affairs', value: metrics.counts['Internal Affairs'], percentage: metrics.percentages['Internal Affairs'], icon: <ShieldExclamationIcon className="h-8 w-8 text-red-500" />, color: 'bg-red-50' },
        { title: 'Performance Improvement Plan', value: metrics.counts['Performance Improvement Plan'], percentage: metrics.percentages['Performance Improvement Plan'], icon: <BullseyeIcon className="h-8 w-8 text-orange-500" />, color: 'bg-orange-50' },
    ];

    return (
        <div className="p-8 space-y-6">
            <Header title={title} score={{ label: scoreLabel, value: metrics.overall_score }} />
            
            {user.role === 'Super Admin' && (
                <SuperAdminMetricCards agencies={agencies} officers={officers} tickets={tickets} />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {performanceMetrics.map(metric => (
                    <MetricCard
                        key={metric.title}
                        title={metric.title}
                        value={metric.value}
                        percentage={metric.percentage}
                        icon={metric.icon}
                        color={metric.color}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                    <SystemWideOutcomeProfile data={metrics.counts} total={metrics.total_reports} />
                </div>
                <div className="lg:col-span-3">
                    <PerformanceTrends data={trendData} />
                </div>
            </div>
            
            {user.role !== 'Officer' && <RecentActivity />}
        </div>
    );
};

export default PerformanceDashboard;