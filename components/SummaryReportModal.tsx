import React, { useState, useEffect } from 'react';
import { CloseIcon, ClipboardCopyIcon } from './IconComponents.tsx';

interface SummaryReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: string;
    isLoading: boolean;
}

const sectionHeaders: { [key: string]: string } = {
    '[FILTER_CRITERIA]': 'Filter Criteria Used',
    '[EXECUTIVE_SUMMARY]': 'Executive Summary',
    '[REPORT_OVERVIEW]': 'Report Overview',
    '[INCIDENT_ANALYSIS]': 'Incident Analysis',
    '[OFFICER_ANALYSIS]': 'Officer Analysis',
    '[KEY_FINDINGS]': 'AI-Generated Key Findings',
};

const SummaryReportModal: React.FC<SummaryReportModalProps> = ({ isOpen, onClose, content, isLoading }) => {
    const [copyButtonText, setCopyButtonText] = useState('Copy to Clipboard');

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => setCopyButtonText('Copy to Clipboard'), 300);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCopy = () => {
        // A more readable version for copy-paste
        const plainText = content.replace(/\[\w+\]/g, (match) => `\n--- ${sectionHeaders[match] || ''} ---\n`).replace(/ \*/g, '\n-');
        navigator.clipboard.writeText(plainText);
        setCopyButtonText('Copied!');
        setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <div className="w-16 h-16 border-4 border-atlas-blue border-dashed rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Generating your report...</p>
                </div>
            );
        }

        if (!content) {
            return <p className="text-gray-600">No content to display.</p>;
        }
        
        // Split content by section markers, keeping the markers
        const sections = content.split(/(\[\w+\])/g);
        let sectionContent: React.ReactNode[] = [];
        
        for (let i = 1; i < sections.length; i += 2) {
            const headerKey = sections[i];
            const headerText = sectionHeaders[headerKey];
            const body = sections[i + 1] ? sections[i + 1].trim() : '';
            
            if (headerText) {
                const lines = body.split('\n').filter(line => line.trim() !== '');
                const listItems = lines.filter(line => line.trim().startsWith('* '));
                const paragraphs = lines.filter(line => !line.trim().startsWith('* '));

                sectionContent.push(
                    <div key={headerKey} className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-2 pb-2 border-b border-gray-200">{headerText}</h3>
                        {paragraphs.map((p, pIndex) => (
                            <p key={pIndex} className="text-gray-700 leading-relaxed mb-2">{p}</p>
                        ))}
                        {listItems.length > 0 && (
                            <ul className="list-disc list-inside space-y-1 pl-4 mt-2">
                                {listItems.map((item, lIndex) => (
                                    <li key={lIndex} className="text-gray-700">{item.substring(2)}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            }
        }
        return sectionContent;
    };


    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[95vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                 <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                    <div className="flex items-center space-x-3">
                         <img src="https://i.postimg.cc/nzWkmYS1/atlas-logo-in-circle.png" alt="ATLAS Logo" className="h-10 w-10" />
                         <div>
                            <h2 className="text-xl font-semibold text-gray-800">Incident Summary Report</h2>
                            <p className="text-xs text-gray-500">AI-Generated Analysis</p>
                         </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {!isLoading && (
                             <button
                                onClick={handleCopy}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <ClipboardCopyIcon className="h-5 w-5 mr-2 text-gray-500" />
                                {copyButtonText}
                            </button>
                        )}
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                           <CloseIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Report Body */}
                <div className="p-8 overflow-y-auto bg-gray-50 flex-grow">
                    <div className="bg-white p-10 rounded-md shadow-md max-w-3xl mx-auto">
                        {renderContent()}
                    </div>
                </div>
                
                {/* Footer */}
                <div className="p-4 bg-gray-100 border-t sticky bottom-0 z-10 text-center">
                    <p className="text-xs text-gray-500">Generated by ATLAS AI Performance Management System | &copy; {new Date().getFullYear()}</p>
                </div>
            </div>
        </div>
    );
};

export default SummaryReportModal;