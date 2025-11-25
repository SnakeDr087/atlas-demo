import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { BwcReport } from '../types.ts';
import { useAppContext } from '../contexts/AppContext.tsx';
import BwcReportForm from './BwcReportForm.tsx';
import MediaAnalysisView from './MediaAnalysisView.tsx';
import { generateTranscriptAndSummary } from '../services/aiService.ts';
import { SparklesIcon, UploadIcon, VideoCameraIcon, DownloadIcon } from './IconComponents.tsx';

const BwcAnalysisForm: React.FC = () => {
    const { 
        currentUser, 
        officers: allOfficers, 
        agencies, 
        bwcReports,
        editingBwcReportId, 
        setEditingBwcReportId,
        setActivePage,
        addBwcReport,
        updateBwcReport,
        showToast,
    } = useAppContext();

    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [isTranscribing, setIsTranscribing] = useState(false);
    
    const getInitialFormData = useCallback(() => {
        if (!currentUser) return null;

        const getReportTemplate = (): BwcReport => {
            const userAgency = agencies.find(a => a.name === currentUser.agency);
            let initialDepartment = '';
            if (currentUser.role !== 'Super Admin' && userAgency) {
                initialDepartment = userAgency.name;
            } else if (agencies.length > 0) {
                initialDepartment = agencies[0].name;
            }

            return {
                id: '', // Empty ID signifies a new report
                caseNumber: '',
                department: initialDepartment,
                reviewDate: new Date().toISOString().split('T')[0],
                incidentDate: '',
                incidentType: '',
                kpi: '',
                status: 'Processing',
                personnel: {
                    supervisor: currentUser?.name || '',
                    primaryOfficer: '',
                    backupOfficer: '',
                },
                location: { street: '', apt: '', floor: '', city: '', state: '' },
                time: { start: '', end: '' },
                officerSafetyItems: [],
                disposition: '',
                followUp: 'No Action',
                supervisorNotes: { internal: '', reportFacing: '' },
                kpisForImprovement: [],
                aiSummary: '',
                videoUrl: '',
                transcript: [],
                timestampedComments: [],
            };
        };

        if (editingBwcReportId) {
            const reportToEdit = bwcReports.find(r => r.id === editingBwcReportId);
            return reportToEdit || getReportTemplate();
        }
        return getReportTemplate();
    }, [editingBwcReportId, bwcReports, currentUser, agencies]);
    
    const [formData, setFormData] = useState<BwcReport | null>(getInitialFormData);

    // Effect to reset state ONLY when the report ID changes or the component mounts
    useEffect(() => {
        setFormData(getInitialFormData());
        setVideoFile(null); // Clear video file when form changes
    }, [editingBwcReportId, getInitialFormData]);


    const handleSave = async () => {
        if (!formData) return;
        if (!formData.supervisorNotes.reportFacing.trim()) {
            alert("The 'Report-Facing Notes' field is mandatory. Please provide your analysis before submitting.");
            return;
        }

        let dataToSave = { ...formData };
        if (editingBwcReportId) {
            await updateBwcReport(dataToSave);
        } else {
            await addBwcReport(dataToSave);
        }
        
        handleCancel();
    };

    const handleCancel = () => {
        setEditingBwcReportId(null);
        setActivePage('BWC Analysis');
    };
    
    const handleGenerateTranscript = async () => {
        if (!videoFile || !formData) return;

        setIsTranscribing(true);
        try {
            const { summary, transcript } = await generateTranscriptAndSummary(videoFile);
            setFormData(prev => prev ? ({
                ...prev,
                transcript: transcript,
                aiSummary: summary,
                videoUrl: URL.createObjectURL(videoFile),
                status: 'Review Complete',
            }) : null);
            showToast('Transcription and summary generated successfully!', 'success');

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            console.error("Error generating transcript:", error);
            showToast(errorMessage, 'error');
            setFormData(prev => prev ? ({ ...prev, aiSummary: "AI analysis failed. Please try again." }) : null);
        } finally {
            setIsTranscribing(false);
        }
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setVideoFile(file || null);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-atlas-blue', 'bg-atlas-light-blue');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setVideoFile(e.dataTransfer.files[0]);
        }
    };

    const handleDownloadPdf = () => {
        showToast('PDF report is being generated and will download shortly.', 'info');
        // In a real application, this would trigger an API call to a PDF generation service.
    };

    if (!formData || !currentUser) {
        return (
            <div className="flex h-screen bg-atlas-gray items-center justify-center">
                <div className="w-12 h-12 border-4 border-atlas-blue border-dashed rounded-full animate-spin"></div>
            </div>
        );
    }
    
    const showVideoAnalysis = formData.videoUrl || videoFile;

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">{editingBwcReportId ? 'Edit' : 'New'} BWC Analysis Report</h1>
            </div>
             <div className="bg-white p-8 rounded-lg shadow-sm">
                {!showVideoAnalysis ? (
                     <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center transition-colors"
                        onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-atlas-blue', 'bg-atlas-light-blue'); }}
                        onDragLeave={e => { e.currentTarget.classList.remove('border-atlas-blue', 'bg-atlas-light-blue'); }}
                        onDrop={handleDrop}
                    >
                        <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">Upload BWC Footage to Begin</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Drag and drop your video file here, or{' '}
                            <label htmlFor="file-upload" className="font-medium text-atlas-blue cursor-pointer hover:underline">
                                browse your files
                                <input id="file-upload" type="file" className="sr-only" accept="video/mp4,video/*" onChange={handleFileChange} />
                            </label>
                        </p>
                        {videoFile && <p className="mt-4 text-sm font-semibold text-green-700">Selected: {videoFile.name}</p>}
                    </div>
                ) : (
                     <MediaAnalysisView
                        videoUrl={videoFile ? URL.createObjectURL(videoFile) : formData.videoUrl || ''}
                        transcript={formData.transcript || []}
                        comments={formData.timestampedComments || []}
                        onCommentsChange={(comments) => setFormData(prev => prev ? ({...prev, timestampedComments: comments}) : null)}
                        onTranscriptChange={(transcript) => setFormData(prev => prev ? ({...prev, transcript: transcript}) : null)}
                        isTranscribing={isTranscribing}
                        onGenerateTranscript={handleGenerateTranscript}
                     />
                )}
                 
                 <div className="mt-8 pt-8 border-t space-y-6">
                     {formData.aiSummary && (
                         <div className="p-6 rounded-lg bg-blue-50/50">
                            <div className="flex items-start space-x-4 pb-4 border-b border-gray-200">
                                <div className="bg-white p-2 rounded-lg border">
                                    <SparklesIcon className="h-6 w-6 text-purple-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">AI Summary</h3>
                                    <p className="text-sm text-gray-500">A high-level overview generated from the video transcript.</p>
                                </div>
                            </div>
                            <div className="pt-6">
                                <p className="text-gray-700 italic">{formData.aiSummary}</p>
                            </div>
                        </div>
                     )}
                     <BwcReportForm
                        formData={formData}
                        setFormData={setFormData}
                        allOfficers={allOfficers}
                        allAgencies={agencies}
                        currentUser={currentUser}
                    />
                 </div>

             </div>
             <div className="flex justify-between items-center pt-6 border-t mt-6">
                 <div>
                    <button 
                        type="button" 
                        onClick={handleDownloadPdf} 
                        disabled={!editingBwcReportId}
                        title={!editingBwcReportId ? "You must save the report before downloading a PDF" : "Download Report as PDF"}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        <DownloadIcon className="h-5 w-5 mr-2" />
                        Download PDF
                    </button>
                 </div>
                 <div className="flex items-center">
                    <button type="button" onClick={handleCancel} className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 mr-4">
                        Cancel
                    </button>
                    <button type="button" onClick={handleSave} className="px-8 py-2.5 text-sm font-semibold text-white bg-atlas-blue rounded-md shadow-sm hover:bg-blue-700">
                        {editingBwcReportId ? 'Save Changes' : 'Submit Report'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BwcAnalysisForm;