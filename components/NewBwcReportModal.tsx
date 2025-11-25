import React, { useState, useMemo } from 'react';
import { CloseIcon, VideoCameraIcon, UploadIcon } from './IconComponents';
import BwcReportForm from './BwcReportForm';
import MediaAnalysisView from './MediaAnalysisView';
import type { BwcReport, Officer, Agency } from '../types';
import { generateTranscriptAndSummary } from '../services/aiService';
import { useAppContext } from '../contexts/AppContext';

interface NewBwcReportModalProps {
    onClose: () => void;
    onSave: (report: BwcReport) => void;
    report: BwcReport;
    officers: Officer[];
    agency: Agency | null;
    readOnly?: boolean;
}

const NewBwcReportModal: React.FC<NewBwcReportModalProps> = ({ onClose, onSave, report, officers, agency, readOnly = false }) => {
    const { currentUser } = useAppContext();
    const [formData, setFormData] = useState<BwcReport>(report);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [isTranscribing, setIsTranscribing] = useState(false);

    // Create a URL for previewing the video, either from an uploaded file or existing data
    const videoPreviewUrl = useMemo(() => {
        if (videoFile) return URL.createObjectURL(videoFile);
        return formData.videoUrl;
    }, [videoFile, formData.videoUrl]);


    const handleSave = () => {
        let dataToSave = { ...formData };
        if (videoFile) {
            // If a new file was uploaded, update the URL.
            // In a real app, this would trigger a backend processing job.
            dataToSave.videoUrl = URL.createObjectURL(videoFile);
            dataToSave.status = dataToSave.transcript && dataToSave.transcript.length > 0 ? 'Review Complete' : 'Processing';
        }
        onSave(dataToSave);
    };

    const handleGenerateTranscript = async () => {
        if (!videoFile) return;

        setIsTranscribing(true);
        try {
            const { summary, transcript } = await generateTranscriptAndSummary(videoFile);
            setFormData(prev => ({
                ...prev,
                transcript: transcript,
                aiSummary: summary,
            }));

        } catch (error) {
            console.error("Error generating transcript:", error);
            setFormData(prev => ({ ...prev, aiSummary: "AI analysis failed. Please try again." }));
        } finally {
            setIsTranscribing(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideoFile(e.target.files[0]);
        }
    };

    if (!currentUser) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[95vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b sticky top-0 bg-white z-10">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <VideoCameraIcon className="h-6 w-6 text-atlas-blue" />
                            <h2 className="text-xl font-semibold text-gray-800">{readOnly ? 'View' : (report.id ? 'Edit' : 'New')} BWC Analysis Report</h2>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                           <CloseIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
                
                <div className="overflow-y-auto p-8 space-y-8">
                    {/* Video / Media Analysis Section */}
                    {(videoPreviewUrl || (!readOnly && !formData.videoUrl)) && (
                        <div className="mb-8">
                            {videoPreviewUrl ? (
                                <MediaAnalysisView
                                    videoUrl={videoPreviewUrl}
                                    transcript={formData.transcript || []}
                                    isTranscribing={isTranscribing}
                                    comments={formData.timestampedComments || []}
                                    onCommentsChange={(newComments) => setFormData(prev => ({...prev, timestampedComments: newComments}))}
                                    onTranscriptChange={(newTranscript) => setFormData(prev => ({...prev, transcript: newTranscript}))}
                                    onGenerateTranscript={handleGenerateTranscript}
                                    readOnly={readOnly}
                                />
                            ) : (
                                !readOnly && (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                                        <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="mt-1 text-sm text-gray-500">
                                            <label htmlFor="modal-file-upload" className="font-medium text-atlas-blue cursor-pointer hover:underline">
                                                Upload BWC Footage
                                                <input id="modal-file-upload" type="file" className="sr-only" accept="video/*" onChange={handleFileSelect} />
                                            </label>
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    <BwcReportForm
                        formData={formData}
                        setFormData={setFormData}
                        allOfficers={officers}
                        allAgencies={agency ? [agency] : []}
                        currentUser={currentUser}
                        readOnly={readOnly}
                    />
                </div>
                
                <div className="p-6 bg-gray-50 border-t sticky bottom-0 z-10 mt-auto">
                    <div className="flex justify-end space-x-4">
                        {readOnly ? (
                             <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-atlas-blue rounded-md shadow-sm hover:bg-blue-700">Close</button>
                        ) : (
                            <>
                                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Cancel</button>
                                <button type="button" onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-atlas-blue rounded-md shadow-sm hover:bg-blue-700">Save Changes</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewBwcReportModal;