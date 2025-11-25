import React from 'react';
import { CloseIcon, HeartIcon, UserCircleIcon, SparklesIcon, PencilAltIcon, CheckCircleIcon } from './IconComponents.tsx';
import type { SentimentReport } from '../types.ts';

interface ViewSentimentAnalysisModalProps {
    report: SentimentReport;
    onClose: () => void;
}

const recommendationsMap = {
    noAction: 'No Further Action Needed',
    peerSupport: 'Recommend Peer Support',
    wellnessCheckIn: 'Recommend Wellness Check-In',
    resilienceTraining: 'Recommend Resilience Training / Stress Mgmt Workshop',
    supervisorFollowUp: 'Schedule Supervisor Follow-Up',
};

const ViewSentimentAnalysisModal: React.FC<ViewSentimentAnalysisModalProps> = ({ report, onClose }) => {
    
    const DetailItem: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
        <div>
            <dt className="text-sm font-medium text-gray-600">{label}</dt>
            <dd className="mt-1 text-gray-800">{children}</dd>
        </div>
    );

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b sticky top-0 bg-white z-10">
                    <div className="flex justify-between items-center">
                         <div className="flex items-center space-x-3">
                            <HeartIcon className="h-8 w-8 text-blue-500" />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Sentiment Analysis Report</h2>
                                <p className="text-sm text-gray-500">Report ID: {report.id}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                           <CloseIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-8 overflow-y-auto">
                     {/* Officer Information */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3"><UserCircleIcon className="h-6 w-6 text-gray-500"/><h3 className="text-lg font-semibold text-gray-700">Officer Information</h3></div>
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-4 bg-gray-50 rounded-lg">
                            <DetailItem label="Officer Name">{`${report.officer.firstName} ${report.officer.lastName}`}</DetailItem>
                            <DetailItem label="Badge #">{report.officer.badgeNumber}</DetailItem>
                            <DetailItem label="Review Date">{report.reviewDate}</DetailItem>
                            <DetailItem label="Created By">{report.createdBy}</DetailItem>
                        </dl>
                    </div>
                    
                    {/* AI Findings */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3"><SparklesIcon className="h-6 w-6 text-gray-500"/><h3 className="text-lg font-semibold text-gray-700">AI Sentiment Findings</h3></div>
                        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <DetailItem label="Overall Sentiment Score"><span className="font-semibold">{report.sentimentScore}</span></DetailItem>
                                <DetailItem label="Wellness Category"><span className="font-semibold">{report.wellnessCategory}</span></DetailItem>
                                <DetailItem label="Indicators Detected">{report.indicators?.join(', ')}</DetailItem>
                                <div className="md:col-span-2"><DetailItem label="AI Observed Emotional Cues">{report.emotionalCues}</DetailItem></div>
                                <DetailItem label="Emotional Tone">
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {report.emotionalTone?.map(tone => <span key={tone} className="px-2 py-0.5 bg-gray-200 text-gray-800 text-xs rounded-full">{tone}</span>)}
                                    </div>
                                </DetailItem>
                                <DetailItem label="Communication Style"><span className="font-semibold">{report.communicationStyle}</span></DetailItem>
                                <div className="md:col-span-2">
                                    <DetailItem label="Key Phrases Detected">
                                        <ul className="list-disc list-inside space-y-1 mt-1">
                                            {report.keyPhrases?.map(phrase => <li key={phrase} className="text-sm text-gray-700 italic">"{phrase}"</li>)}
                                        </ul>
                                    </DetailItem>
                                </div>
                            </dl>
                        </div>
                    </div>
                    
                    {/* Supervisor Reflection */}
                    <div className="space-y-4">
                         <div className="flex items-center space-x-3"><PencilAltIcon className="h-6 w-6 text-gray-500"/><h3 className="text-lg font-semibold text-gray-700">Supervisor Reflection</h3></div>
                         <p className="p-4 bg-gray-50 rounded-lg text-gray-700 italic">
                            {report.supervisorComments || "No supervisor comments were added."}
                         </p>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3"><CheckCircleIcon className="h-6 w-6 text-gray-500"/><h3 className="text-lg font-semibold text-gray-700">Recommendations Made</h3></div>
                        <ul className="p-4 bg-gray-50 rounded-lg space-y-2">
                            {Object.entries(report.recommendations).map(([key, value]) => (
                                value && (
                                    <li key={key} className="flex items-center text-gray-800">
                                        <CheckCircleIcon className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                                        <span>{recommendationsMap[key as keyof typeof recommendationsMap]}</span>
                                    </li>
                                )
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t sticky bottom-0 z-10 mt-auto">
                    <div className="flex justify-end">
                        <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-medium text-white bg-atlas-blue rounded-md shadow-sm hover:bg-blue-700">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewSentimentAnalysisModal;
