import React from 'react';
import SuperAdminMetricCards from './SuperAdminMetricCards.tsx';
import RevenueByPlanChart from './charts/RevenueByPlanChart.tsx';
import RecentCustomerActivity from './RecentCustomerActivity.tsx';
import type { Agency, Officer, TroubleTicket } from '../types.ts';

interface SuperAdminDashboardProps {
    agencies: Agency[];
    officers: Officer[];
    tickets: TroubleTicket[];
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ agencies, officers, tickets }) => {
    return (
        <div className="space-y-6">
            <SuperAdminMetricCards agencies={agencies} officers={officers} tickets={tickets} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueByPlanChart agencies={agencies} />
                <RecentCustomerActivity />
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
