import React from 'react';
import MetricCard from './MetricCard.tsx';
import type { Agency, Officer, TroubleTicket } from '../types.ts';
import { BuildingIcon, UsersIcon, TicketIcon, ServerIcon } from './IconComponents.tsx';

interface SuperAdminMetricCardsProps {
    agencies: Agency[];
    officers: Officer[];
    tickets: TroubleTicket[];
}

const SuperAdminMetricCards: React.FC<SuperAdminMetricCardsProps> = ({ agencies, officers, tickets }) => {
    const activeAgencies = agencies.filter(a => a.status === 'Active').length;
    const totalOfficers = officers.length;
    const openTickets = tickets.filter(t => t.status === 'Open').length;
    const totalStorage = agencies.reduce((acc, a) => acc + a.storageUsed, 0);

    const metrics = [
        { title: 'Total Active Agencies', value: activeAgencies, icon: <BuildingIcon className="h-8 w-8 text-indigo-500" />, color: 'bg-indigo-50' },
        { title: 'Total Officers', value: totalOfficers, icon: <UsersIcon className="h-8 w-8 text-cyan-500" />, color: 'bg-cyan-50' },
        { title: 'Open Support Tickets', value: openTickets, icon: <TicketIcon className="h-8 w-8 text-pink-500" />, color: 'bg-pink-50' },
        { title: 'System-wide Storage', value: `${(totalStorage / 1000).toFixed(1)} TB`, icon: <ServerIcon className="h-8 w-8 text-teal-500" />, color: 'bg-teal-50' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {metrics.map(metric => (
                <MetricCard
                    key={metric.title}
                    title={metric.title}
                    value={metric.value}
                    icon={metric.icon}
                    color={metric.color}
                />
            ))}
        </div>
    );
};

export default SuperAdminMetricCards;
