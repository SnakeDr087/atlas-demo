import React, { useState, useRef } from 'react';
import type { TranscriptSegment, TimestampedComment } from '../types.ts';
import { PlusCircleIcon, TrashIcon, VideoCameraIcon, InformationCircleIcon, PencilIcon, SparklesIcon, ChevronDownIcon } from './IconComponents.tsx';
import TranscriptViewer from './TranscriptViewer.tsx';

interface MediaAnalysisViewProps {
    videoUrl: string;
    transcript: TranscriptSegment[];
    isTranscribing: boolean;
    comments: TimestampedComment[];
    onCommentsChange: (newComments: TimestampedComment[]) => void;
    onTranscriptChange: (newTranscript: TranscriptSegment[]) => void;
    onGenerateTranscript: () => void;
    readOnly?: boolean;
}

const MediaAnalysisView: React.FC<MediaAnalysisViewProps> = ({
    videoUrl,
    transcript,
    isTranscribing,
    comments,
    onCommentsChange,
    onTranscriptChange,
    onGenerateTranscript,
    readOnly = false,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [newCommentText, setNewCommentText] = useState('');
    const [isTranscriptVisible, setIsTranscriptVisible] = useState(false);

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleAddComment = () => {
        if (newCommentText.trim() && videoRef.current) {
            const newComment: TimestampedComment = {
                id: Date.now(),
                timestamp: Math.floor(videoRef.current.currentTime),
                text: newCommentText.trim(),
            };
            onCommentsChange([...(comments || []), newComment]);
            setNewCommentText('');
        }
    };

    const handleDeleteComment = (id: number) => {
        onCommentsChange((comments || []).filter(c => c.id !== id));
    };

    const inputStyle = "block w-full mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-atlas-blue text-gray-900";

    const TranscriptPanel = () => {
        if (isTranscribing) {
            return (
                <div className="bg-gray-50 border rounded-lg p-4 h-full flex flex-col items-center justify-center text-center text-gray-500">
                    <div className="w-12 h-12 border-4 border-atlas-blue border-dashed rounded-full animate-spin mb-4"></div>
                    <p className="font-semibold">Transcribing Audio...</p>
                    <p className="text-sm">Please wait while the AI processes the video.</p>
                </div>
            );
        }
        if (transcript && transcript.length > 0) {
            return (
                <div className="bg-gray-50 border rounded-lg h-full flex flex-col overflow-hidden">
                    <button
                        onClick={() => setIsTranscriptVisible(!isTranscriptVisible)}
                        className="p-4 border-b border-gray-200 flex-shrink-0 flex justify-between items-center w-full text-left hover:bg-gray-100 focus:outline-none"
                        aria-expanded={isTranscriptVisible}
                    >
                        <div className="flex-grow">
                            <h4 className="font-semibold text-gray-700">AI-Generated Transcript</h4>
                            <p className="text-xs text-gray-500">Click to {isTranscriptVisible ? 'collapse' : 'expand'}</p>
                        </div>
                        <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform ${isTranscriptVisible ? 'rotate-180' : ''}`} />
                    </button>
                    {isTranscriptVisible && (
                        <div className="flex-grow overflow-y-auto p-4 min-h-0">
                            <TranscriptViewer 
                                transcript={transcript} 
                                currentTime={currentTime} 
                                onTranscriptChange={onTranscriptChange}
                                readOnly={readOnly}
                            />
                        </div>
                    )}
                </div>
            );
        }
        return (
            <div className="bg-gray-50 border rounded-lg p-4 h-full flex flex-col items-center justify-center text-center text-gray-500">
                 <SparklesIcon className="h-12 w-12 text-gray-400 mb-4" />
                 <h4 className="font-semibold text-gray-700">Ready for AI Analysis</h4>
                 <p className="text-sm mt-1 mb-6">Click the button below to generate the video transcript and an initial AI summary.</p>
                 <button 
                    onClick={onGenerateTranscript} 
                    className="inline-flex items-center px-4 py-2 bg-atlas-blue text-white rounded-md hover:bg-blue-700 transition-colors"
                 >
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    Generate Transcript
                 </button>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-3">
                <VideoCameraIcon className="h-6 w-6 text-gray-500" />
                <h2 id="bwc-video-title" className="text-xl font-semibold text-gray-800">BWC Video Analysis</h2>
            </div>
            <div className="grid grid-cols-5 gap-6 h-[550px]">
                <div className="col-span-3 flex flex-col space-y-4">
                    <video ref={videoRef} src={videoUrl} controls autoPlay className="w-full rounded-lg shadow-md bg-black" onTimeUpdate={handleTimeUpdate}></video>
                    <div className="flex-grow flex flex-col border rounded-lg p-2 bg-white">
                        <h4 className="font-semibold text-gray-700 mb-2 px-2">Timestamped Comments</h4>
                        <div className="flex-grow overflow-y-auto space-y-2 pr-2">
                            {(comments || []).length === 0 && !readOnly && (
                                <p className="text-sm text-gray-400 text-center py-4">Type a comment below and click "Add" to leave a note at the video's current timestamp.</p>
                            )}
                            {(comments || []).sort((a, b) => a.timestamp - b.timestamp).map(comment => (
                                <div key={comment.id} className="bg-gray-100 p-2 rounded-md text-sm flex justify-between items-start">
                                    <div>
                                        <span className="font-bold text-atlas-blue">@{comment.timestamp}s:</span>
                                        <p className="text-gray-800 whitespace-pre-wrap">{comment.text}</p>
                                    </div>
                                    {!readOnly && <button onClick={() => handleDeleteComment(comment.id)} className="text-gray-400 hover:text-red-500 flex-shrink-0 ml-2"><TrashIcon className="h-4 w-4"/></button>}
                                </div>
                            ))}
                        </div>
                        {!readOnly && (
                            <div className="flex space-x-2 mt-2 pt-2 border-t">
                                <input
                                    type="text"
                                    value={newCommentText}
                                    onChange={e => setNewCommentText(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddComment(); } }}
                                    placeholder="Add comment at current time..."
                                    className={`${inputStyle} mt-0 text-gray-900`}
                                />
                                <button onClick={handleAddComment} className="px-3 py-1 bg-atlas-blue text-white rounded-md text-sm inline-flex items-center hover:bg-blue-700">
                                    <PlusCircleIcon className="h-5 w-5 mr-1"/> Add
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-span-2 h-full">
                   <TranscriptPanel />
                </div>
            </div>
        </div>
    );
};

export default MediaAnalysisView;