import React, { useState, useEffect } from 'react';
import { CloseIcon, HeartIcon, UserCircleIcon, UploadIcon, SparklesIcon, PencilAltIcon, CheckCircleIcon } from './IconComponents.tsx';
import { getOfficers } from '../services/officerService.ts';
import { generateSentimentAnalysis } from '../services/aiService.ts';
import type { SentimentReport, Officer } from '../types.ts';
import { useAppContext } from '../contexts/AppContext.tsx';

interface NewSentimentAnalysisModalProps {
    onClose: () => void;
    onAddReport: (reportData: Omit<SentimentReport, 'id'>) => void;
}

const recommendations = {
    noAction: 'No Further Action Needed',
    peerSupport: 'Recommend Peer Support',
    wellnessCheckIn: 'Recommend Wellness Check-In',
    resilienceTraining: 'Recommend Resilience Training / Stress Mgmt Workshop',
    supervisorFollowUp: 'Schedule Supervisor Follow-Up',
};
type RecommendationKey = keyof typeof recommendations;

const NewSentimentAnalysisModal: React.FC<NewSentimentAnalysisModalProps> = ({ onClose, onAddReport }) => {
    const { currentUser: user } = useAppContext();
    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-atlas-blue focus:border-atlas-blue sm:text-sm text-gray-900 placeholder-gray-400";
    const [officers, setOfficers] = useState<Officer[]>([]);
    
    const [formData, setFormData] = useState<Partial<SentimentReport>>({
        officer: undefined,
        reviewDate: new Date().toISOString().substring(0, 10),
        status: 'Draft',
        createdBy: user?.name || '',
        supervisorComments: '',
        recommendations: {
            noAction: false,
            peerSupport: false,
            wellnessCheckIn: false,
            resilienceTraining: false,
            supervisorFollowUp: false
        },
    });
    
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!user) return;
        getOfficers().then(data => {
            let agencyOfficers: Officer[];
            if (user.role === 'Super Admin') {
                agencyOfficers = data;
            } else if (user.agency) {
                agencyOfficers = data.filter(o => o.agency === user.agency);
            } else {
                agencyOfficers = [];
            }
            setOfficers(agencyOfficers);
            if (agencyOfficers.length > 0) {
                 setFormData(prev => ({ ...prev, officer: agencyOfficers[0] }));
            }
        });
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOfficerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOfficer = officers.find(o => o.id === e.target.value);
        if (selectedOfficer) {
            setFormData(prev => ({ ...prev, officer: selectedOfficer }));
        }
    };
    
    const handleCheckboxChange = (rec: RecommendationKey) => {
        setFormData(prev => ({
            ...prev,
            recommendations: {
                ...prev!.recommendations!,
                [rec]: !prev!.recommendations![rec]
            }
        }));
    };
    
     const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setVideoFile(file);
            setFileName(file.name);
        }
    };

    const handleAnalyze = async () => {
        if (!videoFile) {
            alert("Please upload a BWC video first.");
            return;
        }
        setIsProcessing(true);
        try {
            const aiFindings = await generateSentimentAnalysis(videoFile);
            setFormData(prev => ({ ...prev, ...aiFindings }));
        } catch (error) {
            console.error("Failed to generate sentiment analysis", error);
            alert("An error occurred during AI analysis. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCreateReport = () => {
        if (!formData.officer) {
            alert('Please select an officer.');
            return;
        }
        if (!formData.sentimentScore) {
            alert('Please run the AI Analysis before creating the report.');
            return;
        }
        onAddReport(formData as Omit<SentimentReport, 'id'>);
        onClose();
    };
    
    if (!user) return null;

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
                                <h2 className="text-xl font-semibold text-gray-800">New Sentiment Analysis Report</h2>
                                <p className="text-sm text-gray-500">This report provides a non-judgmental AI-generated assessment of officer stress and wellness indicators.</p>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Officer Name</label>
                                <select value={formData.officer?.id} onChange={handleOfficerChange} className={inputStyle}>
                                    {officers.map(o => <option key={o.id} value={o.id}>{o.lastName}, {o.firstName}</option>)}
                                </select>
                            </div>
                            <div><label className="block text-sm font-medium text-gray-700">Review Date</label><input type="date" name="reviewDate" value={formData.reviewDate} onChange={handleInputChange} className={inputStyle} /></div>
                        </div>
                    </div>
                    
                    {/* Video Upload */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3"><UploadIcon className="h-6 w-6 text-gray-500"/><h3 className="text-lg font-semibold text-gray-700">Video Upload & AI Processing</h3></div>
                         <div className="p-4 border-2 border-dashed rounded-lg text-center">
                             <p className="text-sm text-gray-600 mb-2">Upload BWC footage for transcription and analysis.</p>
                            <input type="file" id="bwc-upload" className="hidden" accept=".mp4,.mov,.avi" onChange={handleFileSelect} />
                            <label htmlFor="bwc-upload" className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">{fileName ? `Selected: ${fileName}` : 'Upload BWC Footage'}</label>
                        </div>
                         <button type="button" onClick={handleAnalyze} disabled={isProcessing || !videoFile} className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-50 text-atlas-blue rounded-md hover:bg-blue-100 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
                             <SparklesIcon className="h-5 w-5 mr-2"/>
                             {isProcessing ? 'Analyzing, please wait...' : 'Analyze with AI'}
                             {isProcessing && <div className="ml-3 w-4 h-4 border-2 border-blue-200 border-t-atlas-blue rounded-full animate-spin"></div>}
                         </button>
                    </div>

                    {/* AI Findings */}
                    {formData.sentimentScore && (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3"><SparklesIcon className="h-6 w-6 text-gray-500"/><h3 className="text-lg font-semibold text-gray-700">AI Sentiment Findings</h3></div>
                        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div><dt className="text-sm font-medium text-gray-600">Overall Sentiment Score</dt><dd className="font-semibold text-gray-800">{formData.sentimentScore}</dd></div>
                                <div><dt className="text-sm font-medium text-gray-600">Wellness Category</dt><dd className="font-semibold text-gray-800">{formData.wellnessCategory}</dd></div>
                                <div><dt className="text-sm font-medium text-gray-600">Indicators Detected</dt><dd className="text-gray-800">{formData.indicators?.join(', ')}</dd></div>
                                <div className="md:col-span-2"><dt className="text-sm font-medium text-gray-600">AI Observed Emotional Cues</dt><dd className="text-gray-800">{formData.emotionalCues}</dd></div>
                                <div><dt className="text-sm font-medium text-gray-600">Emotional Tone</dt><dd className="flex flex-wrap gap-2 mt-1">{formData.emotionalTone?.map(tone => <span key={tone} className="px-2 py-0.5 bg-gray-200 text-gray-800 text-xs rounded-full">{tone}</span>)}</dd></div>
                                <div><dt className="text-sm font-medium text-gray-600">Communication Style</dt><dd className="font-semibold text-gray-800">{formData.communicationStyle}</dd></div>
                                <div className="md:col-span-2"><dt className="text-sm font-medium text-gray-600">Key Phrases Detected</dt><dd><ul className="list-disc list-inside space-y-1 mt-1">{formData.keyPhrases?.map(phrase => <li key={phrase} className="text-sm text-gray-700 italic">"{phrase}"</li>)}</ul></dd></div>
                            </dl>
                        </div>
                    </div>
                    )}
                    
                    {/* Supervisor Reflection */}
                    <div className="space-y-4">
                         <div className="flex items-center space-x-3"><PencilAltIcon className="h-6 w-6 text-gray-500"/><h3 className="text-lg font-semibold text-gray-700">Supervisor Reflection</h3></div>
                         <textarea name="supervisorComments" rows={3} placeholder="Supervisor comments on AI findings (optional)..." className={inputStyle} value={formData.supervisorComments} onChange={handleInputChange}></textarea>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3"><CheckCircleIcon className="h-6 w-6 text-gray-500"/><h3 className="text-lg font-semibold text-gray-700">Recommendations</h3></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {(Object.keys(recommendations) as RecommendationKey[]).map(key => (
                                <div key={key} className="flex items-center"><input id={key} type="checkbox" checked={formData.recommendations![key]} onChange={() => handleCheckboxChange(key)} className="h-4 w-4 text-atlas-blue border-gray-300 rounded focus:ring-atlas-blue" /><label htmlFor={key} className="ml-2 block text-sm text-gray-900">{recommendations[key]}</label></div>
                            ))}
                        </div>
                    </div>

                    {/* Acknowledgement */}
                    <div className="bg-blue-50 p-4 rounded-md">
                        <div className="flex items-start">
                            <input id="ack" type="checkbox" className="h-4 w-4 text-atlas-blue border-gray-300 rounded focus:ring-atlas-blue mt-1" />
                            {/* FIX: Corrected a typo in the htmlFor attribute from {ack" to "ack". This resolves the syntax error. */}
                            <label htmlFor="ack" className="ml-2 block text-sm text-blue-800">This report is for wellness support purposes only and will not be used for disciplinary action.</label>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t sticky bottom-0 z-10 mt-auto">
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Cancel</button>
                        <button type="button" onClick={handleCreateReport} className="px-4 py-2 text-sm font-medium text-white bg-atlas-blue rounded-md shadow-sm hover:bg-blue-700">Create Sentiment Analysis Report</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewSentimentAnalysisModal;