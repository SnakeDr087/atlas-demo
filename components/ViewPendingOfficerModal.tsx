import React, { useState } from 'react';
import type { PendingOfficer } from '../types.ts';
import { CloseIcon, UserCircleIcon, CheckCircleIcon, XCircleIcon } from './IconComponents.tsx';

interface ViewPendingOfficerModalProps {
    officer: PendingOfficer;
    onClose: () => void;
    onApprove: (id: string, updatedData?: Partial<Omit<PendingOfficer, 'id'|'status'>>) => void;
    onDeny: (id: string) => void;
}

const ViewPendingOfficerModal: React.FC<ViewPendingOfficerModalProps> = ({ officer, onClose, onApprove, onDeny }) => {
    const [formData, setFormData] = useState({
        firstName: officer.firstName,
        lastName: officer.lastName,
        agency: officer.agency,
    });
    const [isEditing, setIsEditing] = useState(false);

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-atlas-blue focus:border-atlas-blue sm:text-sm text-gray-900";

    const handleApproveWithChanges = () => {
        onApprove(officer.id, formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Review Officer Registration</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon className="h-6 w-6" /></button>
                </div>
                <div className="p-8 space-y-4">
                    <div className="flex items-center space-x-4">
                        <UserCircleIcon className="h-16 w-16 text-gray-300" />
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">{officer.firstName} {officer.lastName}</h3>
                            <p className="text-gray-600">{officer.email}</p>
                        </div>
                    </div>
                    <div className="border-t pt-4">
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">First Name</dt>
                                {isEditing ? <input value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className={inputStyle} /> : <dd className="mt-1 text-sm text-gray-900">{officer.firstName}</dd>}
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                                {isEditing ? <input value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className={inputStyle} /> : <dd className="mt-1 text-sm text-gray-900">{officer.lastName}</dd>}
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Agency</dt>
                                {isEditing ? <input value={formData.agency} onChange={e => setFormData({...formData, agency: e.target.value})} className={inputStyle} /> : <dd className="mt-1 text-sm text-gray-900">{officer.agency}</dd>}
                            </div>
                        </dl>
                        {!isEditing && <button onClick={() => setIsEditing(true)} className="text-sm text-atlas-blue hover:underline mt-4">Edit Details Before Approving</button>}
                    </div>
                </div>
                <div className="p-6 bg-gray-50 border-t flex justify-end space-x-4">
                    <button onClick={() => onDeny(officer.id)} className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200">
                        <XCircleIcon className="h-5 w-5 mr-2" /> Deny
                    </button>
                    <button onClick={handleApproveWithChanges} className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200">
                        <CheckCircleIcon className="h-5 w-5 mr-2" /> {isEditing ? 'Approve with Changes' : 'Approve'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewPendingOfficerModal;
