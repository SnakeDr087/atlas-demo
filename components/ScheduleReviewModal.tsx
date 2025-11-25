import React, { useState, useEffect } from 'react';
import type { InPersonReview, Officer } from '../types.ts';
import { getOfficers } from '../services/officerService.ts';
import { CloseIcon } from './IconComponents.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';

interface ScheduleReviewModalProps {
    onClose: () => void;
    onSave: (reviewData: Omit<InPersonReview, 'id'>) => void;
    defaultDate?: Date | null;
}

const ScheduleReviewModal: React.FC<ScheduleReviewModalProps> = ({ onClose, onSave, defaultDate }) => {
    const { currentUser: user } = useAppContext();
    const [officers, setOfficers] = useState<Officer[]>([]);
    const [formData, setFormData] = useState({
        officerId: '',
        reviewDate: defaultDate ? defaultDate.toISOString().split('T')[0] : '',
        reviewTime: '',
        reviewLocation: '',
        notes: '',
    });

    useEffect(() => {
        if (!user) return;
        getOfficers().then(data => {
            let filteredOfficers: Officer[];
            if (user.role === 'Super Admin') {
                filteredOfficers = data;
            } else if (user.agency) {
                filteredOfficers = data.filter(o => o.agency === user.agency);
            } else {
                filteredOfficers = [];
            }
            setOfficers(filteredOfficers);
            if (filteredOfficers.length > 0) {
                setFormData(prev => ({ ...prev, officerId: filteredOfficers[0].id }));
            }
        });
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        const selectedOfficer = officers.find(o => o.id === formData.officerId);
        if (!selectedOfficer) {
            alert("Please select an officer.");
            return;
        }

        const newReview: Omit<InPersonReview, 'id'> = {
            officer: selectedOfficer,
            caseNumber: '',
            reviewDate: formData.reviewDate,
            reviewTime: formData.reviewTime,
            reviewLocation: formData.reviewLocation,
            notes: formData.notes,
            reviewer: 'Sgt. Miller', // Should be dynamic in a real app
            status: 'Scheduled',
        };
        onSave(newReview);
    };

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-atlas-blue focus:border-atlas-blue sm:text-sm text-gray-900 placeholder-gray-400";

    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Schedule a Review</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon className="h-6 w-6" /></button>
                </div>
                <div className="p-8 space-y-4">
                    <div>
                        <label htmlFor="officerId" className="block text-sm font-medium text-gray-700">Officer</label>
                        <select id="officerId" name="officerId" value={formData.officerId} onChange={handleChange} className={inputStyle}>
                            {officers.map(o => <option key={o.id} value={o.id}>{o.lastName}, {o.firstName}</option>)}
                        </select>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="reviewDate" className="block text-sm font-medium text-gray-700">Date</label>
                            <input type="date" id="reviewDate" name="reviewDate" value={formData.reviewDate} onChange={handleChange} className={inputStyle} />
                        </div>
                         <div>
                            <label htmlFor="reviewTime" className="block text-sm font-medium text-gray-700">Time</label>
                            <input type="time" id="reviewTime" name="reviewTime" value={formData.reviewTime} onChange={handleChange} className={inputStyle} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="reviewLocation" className="block text-sm font-medium text-gray-700">Location</label>
                        <input type="text" id="reviewLocation" name="reviewLocation" value={formData.reviewLocation} onChange={handleChange} className={inputStyle} placeholder="e.g., Briefing Room 2"/>
                    </div>
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes / Purpose</label>
                        <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} className={inputStyle} placeholder="e.g., Quarterly check-in, review of case #2025-00135..."></textarea>
                    </div>
                </div>
                <div className="p-6 bg-gray-50 border-t flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Cancel</button>
                    <button type="button" onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-atlas-blue rounded-md shadow-sm hover:bg-blue-700">Schedule Review</button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleReviewModal;
