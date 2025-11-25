
import React, { useState, useEffect } from 'react';
import Header from './Header';
import SummaryReportList from './SummaryReportList';
import ReportFilters from './ReportFilters';
import SummaryReportModal from './SummaryReportModal';
import { generateSummaryReport } from '../services/aiService';
import type { Report, SummaryReport, Officer } from '../types';
import { SparklesIcon, DownloadIcon } from './IconComponents';
import { mockSummaryReports } from '../data/mockSummaryReports';
import { useAppContext } from '../contexts/AppContext';

const ReportsPage: React.FC = () => {
    const { currentUser: user, reports: allReports, officers: allOfficers } = useAppContext();
    const [officersForFilter, setOfficersForFilter] = useState<Officer[]>([]);
    const [filteredReports, setFilteredReports] = useState<Report[]>([]); // Reports that match filters
    const [summaryReports, setSummaryReports] = useState<SummaryReport[]>(mockSummaryReports); // Newly generated summary reports
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [isModalLoading, setIsModalLoading] = useState(false);

    const [filters, setFilters] = useState({
        officer: '',
        reportDateStart: '',
        reportDateEnd: '',
        followUp: '',
        reportCreator: '',
        shift: '',
        incidentType: '',
        incidentDate: '',
        educationLevel: '',
        experience: '',
    });
    
    // Set up officers for the filter dropdown based on user role
    useEffect(() => {
        if (!user) return;
        if (user.role === 'Super Admin') {
            setOfficersForFilter(allOfficers);
        } else if (user.agency) {
            setOfficersForFilter(allOfficers.filter(o => o.agency === user.agency));
        } else {
            setOfficersForFilter([]);
        }
    }, [user, allOfficers]);

    // Filter reports based on local filters state and data from context
    useEffect(() => {
        let tempReports: Report[];
        if (!user) {
            tempReports = [];
        } else if (user.role === 'Super Admin') {
            tempReports = allReports;
        } else if (user.agency) {
            const agencyOfficerIds = new Set(allOfficers.filter(o => o.agency === user.agency).map(o => o.id));
            tempReports = allReports.filter(r => agencyOfficerIds.has(r.officer.id));
        } else { // Officer role
             tempReports = allReports.filter(r => r.officer.id === user.id);
        }

        if (filters.officer) {
            tempReports = tempReports.filter(r => `${r.officer.firstName} ${r.officer.lastName}` === filters.officer);
        }
        if (filters.reportDateStart) {
            tempReports = tempReports.filter(r => new Date(r.reportDate + 'T00:00') >= new Date(filters.reportDateStart + 'T00:00'));
        }
        if (filters.reportDateEnd) {
            tempReports = tempReports.filter(r => new Date(r.reportDate + 'T00:00') <= new Date(filters.reportDateEnd + 'T00:00'));
        }
        if (filters.followUp) {
            tempReports = tempReports.filter(r => r.outcome === filters.followUp);
        }
        if (filters.incidentType) {
            tempReports = tempReports.filter(r => r.incidentType === filters.incidentType);
        }
        if (filters.incidentDate) {
            tempReports = tempReports.filter(r => r.incidentDate === filters.incidentDate);
        }
        if (filters.shift) {
            tempReports = tempReports.filter(r => r.officer.shift === filters.shift);
        }

        setFilteredReports(tempReports);
    }, [allReports, allOfficers, filters, user]);

    const handleFilterChange = (name: string, value: string) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleViewSummaryReport = (report: SummaryReport) => {
        setModalContent(report.content);
        setIsModalLoading(false);
        setIsModalOpen(true);
    };

    const handleGenerateSummary = async () => {
        if (!user) return;
        setIsModalOpen(true);
        setIsModalLoading(true);
        setModalContent('');

        if (filteredReports.length === 0) {
            setModalContent("No reports match the current filters. Please adjust your filters and try again.");
            setIsModalLoading(false);
            return;
        }

        try {
            const aiResponse = await generateSummaryReport(filteredReports, filters);
            setModalContent(aiResponse);

            const newSummaryReport: SummaryReport = {
                id: `SUM-${Date.now()}`,
                title: `Summary Report - ${new Date().toLocaleString()}`,
                generatedDate: new Date().toISOString().split('T')[0],
                generatedBy: user.name,
                content: aiResponse,
                filters: { ...filters },
            };
            setSummaryReports(prev => [newSummaryReport, ...prev]);

        } catch (error) {
            console.error("Failed to generate summary report:", error);
            setModalContent("Error: Could not generate the summary report. Please try again later.");
        } finally {
            setIsModalLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="p-8 space-y-8">
            <Header title="Summary Reports" />
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Reports</h3>
                <ReportFilters filters={filters} onFilterChange={handleFilterChange} officers={officersForFilter} />
            </div>

            <div className="flex justify-between items-center">
                 <p className="text-sm text-gray-600">
                    Found {filteredReports.length} matching incident reports. 
                    Displaying {summaryReports.length} generated summary reports.
                </p>
                <div>
                    <button 
                        onClick={handleGenerateSummary}
                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors mr-4"
                    >
                        <SparklesIcon className="h-5 w-5 mr-2" />
                        Generate AI Summary
                    </button>
                    <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                        <DownloadIcon className="h-5 w-5 mr-2" />
                        Export CSV
                    </button>
                </div>
            </div>

            <SummaryReportList reports={summaryReports} onView={handleViewSummaryReport} />

            <SummaryReportModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                content={modalContent}
                isLoading={isModalLoading}
            />

        </div>
    );
};

export default ReportsPage;
