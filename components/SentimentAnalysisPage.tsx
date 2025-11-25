import React, { useState, useEffect } from 'react';
import Header from './Header.tsx';
import SentimentAnalysisList from './SentimentAnalysisList.tsx';
import NewSentimentAnalysisModal from './NewSentimentAnalysisModal.tsx';
import ViewSentimentAnalysisModal from './ViewSentimentAnalysisModal.tsx';
import { DocumentTextIcon } from './IconComponents.tsx';
import type { SentimentReport } from '../types.ts';
import { useAppContext } from '../contexts/AppContext.tsx';

const SentimentAnalysisPage: React.FC = () => {
    const { currentUser: user, sentimentReports: allSentimentReports, addSentimentReport, officers: allOfficers } = useAppContext();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [viewingReport, setViewingReport] = useState<SentimentReport | null>(null);
    const [filteredReports, setFilteredReports] = useState<SentimentReport[]>([]);

    useEffect(() => {
        if (!user) return;
        
        let reportsForUser: SentimentReport[];
        if (user.role === 'Super Admin') {
            reportsForUser = allSentimentReports;
        } else if (user.role === 'Officer') {
            reportsForUser = allSentimentReports.filter(r => r.officer.id === user.id);
        } else if (user.agency) {
            const agencyOfficerIds = new Set(allOfficers.filter(o => o.agency === user.agency).map(o => o.id));
            reportsForUser = allSentimentReports.filter(r => agencyOfficerIds.has(r.officer.id));
        } else {
            reportsForUser = [];
        }
        setFilteredReports(reportsForUser);
        
    }, [user, allSentimentReports, allOfficers]);

    const handleAddReport = async (reportData: Omit<SentimentReport, 'id'>) => {
        await addSentimentReport(reportData);
    };

    if (!user) return null;
    
    return (
        <div className="p-8 space-y-8">
            <Header title="Sentiment Analysis Reports" />

            <div className="flex justify-between items-center">
                <div>
                    <input 
                        type="text" 
                        placeholder="Search by officer or report ID..."
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlas-blue text-gray-900 placeholder-gray-400"
                    />
                </div>
                {user.role !== 'Officer' && (
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 bg-atlas-blue text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        <DocumentTextIcon className="h-5 w-5 mr-2" />
                        + New Sentiment Analysis Report
                    </button>
                )}
            </div>
            
            <SentimentAnalysisList reports={filteredReports} onView={setViewingReport} />

            {isCreateModalOpen && <NewSentimentAnalysisModal onClose={() => setIsCreateModalOpen(false)} onAddReport={handleAddReport} />}
            
            {viewingReport && <ViewSentimentAnalysisModal report={viewingReport} onClose={() => setViewingReport(null)} />}

        </div>
    );
};

export default SentimentAnalysisPage;
