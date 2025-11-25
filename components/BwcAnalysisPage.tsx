
import React, { useState, useEffect, useMemo } from 'react';
import BwcReportList from './BwcReportList';
import { DocumentTextIcon, FilterIcon } from './IconComponents';
import type { BwcReport, Officer } from '../types';
import { useAppContext } from '../contexts/AppContext';

const BwcAnalysisPage: React.FC = () => {
    const { 
        currentUser: user, 
        bwcReports: allBwcReports, 
        deleteBwcReport, 
        officers: allOfficers,
        showConfirmation,
        setActivePage,
        setEditingBwcReportId
    } = useAppContext();

    const [filteredReports, setFilteredReports] = useState<BwcReport[]>([]);
    const [officers, setOfficers] = useState<Officer[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const agencyOfficers = useMemo(() => {
        if (!user) return [];
        if (user.role === 'Super Admin') return allOfficers;
        if (user.agency) return allOfficers.filter(o => o.agency === user.agency);
        return [];
    }, [user, allOfficers]);

    useEffect(() => {
        if (!user) return;

        let reportsForUser: BwcReport[];
        const agencyOfficerIds = new Set(agencyOfficers.map(o => o.id));

        if (user.role === 'Super Admin') {
            reportsForUser = allBwcReports;
        } else if (user.agency) {
            reportsForUser = allBwcReports.filter(r => r.personnel.primaryOfficer && agencyOfficerIds.has(r.personnel.primaryOfficer));
        } else {
            reportsForUser = [];
        }
        
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const searchFiltered = reportsForUser.filter(report => {
            const officer = allOfficers.find(o => o.id === report.personnel.primaryOfficer);
            return (
                report.caseNumber.toLowerCase().includes(lowercasedSearchTerm) ||
                (officer && `${officer.firstName} ${officer.lastName}`.toLowerCase().includes(lowercasedSearchTerm)) ||
                report.incidentType.toLowerCase().includes(lowercasedSearchTerm)
            );
        });

        setFilteredReports(searchFiltered);
        setOfficers(agencyOfficers);

    }, [user, allBwcReports, allOfficers, agencyOfficers, searchTerm]);

    const handleOpenCreateModal = () => {
        setEditingBwcReportId(null);
        setActivePage('New BWC Report');
    };
    
    const handleOpenEditModal = (report: BwcReport) => {
        setEditingBwcReportId(report.id);
        setActivePage('New BWC Report');
    };
    
    const handleDelete = (reportId: string) => {
        showConfirmation({
            title: 'Delete BWC Report?',
            message: 'Are you sure you want to permanently delete this BWC analysis report? This action cannot be undone.',
            onConfirm: async () => {
                await deleteBwcReport(reportId);
            },
        });
    };

    if (!user) return null;

    return (
        <div className="p-8 space-y-6 bg-white shadow-lg sm:rounded-lg">
            {/* Page Header */}
            <div className="flex justify-between items-center pb-4 border-b">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Supervisor Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage and review officer performance</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium">
                        <FilterIcon className="h-5 w-5 mr-2" />
                        Filter
                    </button>
                    <button 
                        onClick={handleOpenCreateModal}
                        className="inline-flex items-center px-4 py-2 bg-atlas-blue text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        <DocumentTextIcon className="h-5 w-5 mr-2" />
                        New Report
                    </button>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div>
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by case #, officer, or type..."
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlas-blue text-gray-900 placeholder-gray-400"
                    />
                </div>
            </div>
            <BwcReportList 
                reports={filteredReports} 
                officers={officers}
                onEdit={handleOpenEditModal} 
                onDelete={handleDelete} 
            />
        </div>
    );
};

export default BwcAnalysisPage;
