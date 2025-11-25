
import React from 'react';
import PerformanceDashboard from './PerformanceDashboard';
import { useAppContext } from '../contexts/AppContext';

const Dashboard: React.FC = () => {
    const { currentUser: user, reports, agencies, tickets, officers } = useAppContext();

    const getFilteredData = () => {
        if (!user) return { reports: [], agencies: [], tickets: [], officers: [] };

        if (user.role === 'Super Admin') {
            return { reports, agencies, tickets, officers };
        }

        if (user.role === 'Agency Admin' || user.role === 'Agency Supervisor') {
            if (!user.agency) return { reports: [], agencies: [], tickets: [], officers: [] };
            
            const agencyOfficers = officers.filter(o => o.agency === user.agency);
            const officerIds = new Set(agencyOfficers.map(o => o.id));
    
            return {
                reports: reports.filter(r => officerIds.has(r.officer.id)),
                agencies: agencies.filter(a => a.name === user.agency),
                tickets: tickets.filter(t => t.agency === user.agency),
                officers: agencyOfficers,
            };
        }
        
        if (user.role === 'Officer') {
            return {
                reports: reports.filter(r => r.officer.id === user.id),
                agencies: [], // Officers don't see agency-level data on their dashboard
                tickets: [],
                officers: officers.filter(o => o.id === user.id), // Just their own data
            };
        }
        return { reports: [], agencies: [], tickets: [], officers: [] }; // Default empty
    };

    if (!user) {
        // This case is handled by App.tsx, but good practice to keep
        return null;
    }

    const filteredData = getFilteredData();

    return (
        <PerformanceDashboard
            user={user}
            reports={filteredData.reports}
            agencies={filteredData.agencies}
            tickets={filteredData.tickets}
            officers={filteredData.officers}
        />
    );
};

export default Dashboard;
