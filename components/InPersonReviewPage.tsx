import React, { useState } from 'react';
import Header from './Header';
import InteractiveCalendar from './InteractiveCalendar';
import InPersonReviewList from './InPersonReviewList';
import CreateReviewRecordModal from './CreateReviewRecordModal';
import ScheduleReviewModal from './ScheduleReviewModal';
import { AcademicCapIcon } from './IconComponents';
import type { InPersonReview } from '../types';
import { useAppContext } from '../contexts/AppContext';

const InPersonReviewPage: React.FC = () => {
    const { reviews, addReview, updateReview, deleteReview } = useAppContext();
    const [modalState, setModalState] = useState<{ type: 'schedule' | 'record' | null; review?: InPersonReview }>({ type: null });
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handleOpenScheduleModal = (date: Date) => {
        setSelectedDate(date);
        setModalState({ type: 'schedule' });
    };
    
    const handleOpenRecordModal = (review?: InPersonReview) => {
        setModalState({ type: 'record', review });
    };

    const handleCloseModal = () => {
        setModalState({ type: null });
        setSelectedDate(null);
    };
    
    const handleSaveReview = async (reviewData: Omit<InPersonReview, 'id'> | InPersonReview) => {
        if ('id' in reviewData) { // Editing
            await updateReview(reviewData);
        } else { // Creating new
            await addReview(reviewData);
        }
        handleCloseModal();
    };

    const handleDeleteReview = (reviewId: string) => {
        deleteReview(reviewId);
    };

    return (
        <div className="p-8 space-y-8">
            <Header title="In-Person Review & Coaching" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                     <InteractiveCalendar events={reviews} onDateSelect={handleOpenScheduleModal} />
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Scheduled & Completed Reviews</h3>
                        <button 
                            onClick={() => handleOpenRecordModal()}
                            className="inline-flex items-center px-4 py-2 bg-atlas-blue text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <AcademicCapIcon className="h-5 w-5 mr-2" />
                            + New Review Record
                        </button>
                    </div>
                    <InPersonReviewList 
                        reviews={reviews} 
                        onEdit={handleOpenRecordModal} 
                        onDelete={handleDeleteReview} 
                    />
                </div>
            </div>

            {modalState.type === 'schedule' && (
                <ScheduleReviewModal 
                    onClose={handleCloseModal}
                    onSave={handleSaveReview}
                    defaultDate={selectedDate}
                />
            )}

            {modalState.type === 'record' && (
                <CreateReviewRecordModal 
                    onClose={handleCloseModal} 
                    onSave={handleSaveReview} 
                    review={modalState.review}
                />
            )}
        </div>
    );
};

export default InPersonReviewPage;