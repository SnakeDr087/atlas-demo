
import React, { useEffect, useRef, useMemo, useState } from 'react';
import type { TranscriptSegment } from '../types.ts';
import { PencilIcon, CheckCircleIcon, XCircleIcon } from './IconComponents.tsx';

interface TranscriptViewerProps {
    transcript: TranscriptSegment[];
    currentTime: number;
    onTranscriptChange: (newTranscript: TranscriptSegment[]) => void;
    readOnly?: boolean;
}

const formatTimestamp = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes().toString().padStart(2, '0');
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh > 0) {
        return `${hh.toString().padStart(2, '0')}:${mm}:${ss}`;
    }
    return `${mm}:${ss}`;
};


const TranscriptViewer: React.FC<TranscriptViewerProps> = ({ transcript, currentTime, onTranscriptChange, readOnly }) => {
    const activeSegmentRef = useRef<HTMLDivElement>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState('');

    const activeSegmentIndex = useMemo(() => {
        let activeIndex = -1;
        for (let i = transcript.length - 1; i >= 0; i--) {
            if (transcript[i].timestamp <= currentTime) {
                activeIndex = i;
                break;
            }
        }
        return activeIndex;
    }, [currentTime, transcript]);


    useEffect(() => {
        if (activeSegmentRef.current) {
            activeSegmentRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [activeSegmentIndex]);

    const getSpeakerColor = (speaker: TranscriptSegment['speaker']) => {
        switch (speaker) {
            case 'Officer':
                return 'text-blue-600 font-semibold';
            case 'Civilian':
                return 'text-green-600 font-semibold';
            case 'Dispatch':
                return 'text-purple-600 font-semibold';
            default:
                return 'text-gray-800 font-semibold';
        }
    };

    const handleStartEdit = (segment: TranscriptSegment) => {
        setEditingId(segment.id);
        setEditText(segment.text);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    const handleSaveEdit = () => {
        if (editingId === null) return;
        const newTranscript = transcript.map(seg => 
            seg.id === editingId ? { ...seg, text: editText } : seg
        );
        onTranscriptChange(newTranscript);
        handleCancelEdit();
    };

    return (
        <div className="space-y-4">
            {transcript.map((segment, index) => {
                const isActive = index === activeSegmentIndex;
                const isEditing = editingId === segment.id;

                return (
                    <div
                        key={segment.id}
                        ref={isActive ? activeSegmentRef : null}
                        className={`p-2 rounded-md transition-colors ${isActive ? 'bg-blue-100' : 'bg-transparent'}`}
                    >
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500 font-mono">
                                {formatTimestamp(segment.timestamp)}
                            </p>
                            {!readOnly && !isEditing && (
                                    <button onClick={() => handleStartEdit(segment)} className="text-gray-400 hover:text-atlas-blue" title="Edit Segment">
                                    <PencilIcon className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="mt-1">
                                <textarea
                                    value={editText}
                                    onChange={e => setEditText(e.target.value)}
                                    className="w-full p-2 border rounded-md text-sm"
                                    rows={3}
                                    autoFocus
                                />
                                <div className="flex justify-end space-x-2 mt-2">
                                    <button onClick={handleCancelEdit} className="p-1 text-red-500 hover:text-red-700"><XCircleIcon className="h-5 w-5"/></button>
                                    <button onClick={handleSaveEdit} className="p-1 text-green-500 hover:text-green-700"><CheckCircleIcon className="h-5 w-5"/></button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm break-all">
                                <span className={getSpeakerColor(segment.speaker)}>{segment.speaker}: </span>
                                <span className="text-gray-700">{segment.text}</span>
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default TranscriptViewer;
