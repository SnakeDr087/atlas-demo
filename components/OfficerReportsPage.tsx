import React, { useState, useEffect } from 'react';
import { getBwcReports } from '../services/reportService.ts';
import { getOfficers } from '../services/officerService.ts';
import { getAgencies } from '../services/agencyService.ts';
import type { BwcReport, Officer, Agency } from '../types.ts';
import BwcReportList from './BwcReportList.tsx';
import NewBwcReportModal from './NewBwcReportModal.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';

const OfficerReportsPage: React.FC = () => {
    const { currentUser: user } = useAppContext();
    const [reports, setReports] = useState<BwcReport[]>([]);
    const [officers, setOfficers] = useState<Officer[]>([]);
    const [agency, setAgency] = useState<Agency | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<BwcReport | null>(null);

    const fetchData = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const [allReports, allOfficers, allAgencies] = await Promise.all([
                getBwcReports(),
                getOfficers(),
                getAgencies()
            ]);
            const officerReports = allReports.filter(report => report.personnel.primaryOfficer === user.id);
            setReports(officerReports);
            setOfficers(allOfficers);
            
            const loggedInOfficer = allOfficers.find(o => o.id === user.id);
            if (loggedInOfficer) {
                const officerAgency = allAgencies.find(a => a.name === loggedInOfficer.agency);
                setAgency(officerAgency || null);
            }
        } catch (error) {
            console.error("Failed to fetch data for Officer Reports page:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleViewReport = (report: BwcReport) => {
        setSelectedReport(report);
    };
    
    const handleCloseModal = () => {
        setSelectedReport(null);
    };

    if (!user) return null;

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">My BWC Analysis Reports</h1>
            <p className="text-gray-600">This page lists all BWC analysis reports where you are the primary officer involved.</p>
            
            {isLoading ? (
                 <div className="flex items-center justify-center pt-10">
                    <div className="w-12 h-12 border-4 border-atlas-blue border-dashed rounded-full animate-spin"></div>
                </div>
            ) : reports.length > 0 ? (
                <BwcReportList 
                    reports={reports} 
                    officers={officers}
                    onEdit={handleViewReport}
                    onDelete={() => {}} // Delete is a no-op for officers
                    readOnly={true}
                />
            ) : (
                <div className="text-center text-gray-500 py-8 border-2 border-dashed rounded-lg">
                    <p>No BWC analysis reports found for your profile.</p>
                </div>
            )}

            {selectedReport && (
                <NewBwcReportModal 
                    onClose={handleCloseModal}
                    onSave={() => {}} // Save is a no-op for officers
                    report={selectedReport}
                    officers={officers}
                    agency={agency}
                    readOnly={true}
                />
            )}
        </div>
    );
};

export default OfficerReportsPage;
