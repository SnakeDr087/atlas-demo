import React, { useState, useEffect } from 'react';
import { BuildingIcon, CloseIcon, LocationMarkerIcon, PhoneIcon, CogIcon, UserCircleIcon } from './IconComponents';
import ToggleSwitch from './ToggleSwitch';
import { states } from './states';
import type { Agency } from '../types';

interface AddAgencyModalProps {
    onClose: () => void;
    onSave: (agency: any) => void;
    agency?: Agency;
    readOnly?: boolean;
}

const AddAgencyModal: React.FC<AddAgencyModalProps> = ({ onClose, onSave, agency, readOnly = false }) => {
    const isEditing = !!agency;
    
    // Combined state for both agency and new liaison user data
    const [formData, setFormData] = useState({
        // Agency fields
        name: '',
        status: 'Active' as Agency['status'],
        officerCount: 0,
        subscriptionPlan: 'Pro' as Agency['subscriptionPlan'],
        monthlyCost: 4999,
        storageUsed: 0,
        storageAllocated: 1024,
        bwcVideoAnalysis: true,
        sentimentAnalysis: true,
        // Liaison user fields (for creation only)
        liaisonFirstName: '',
        liaisonLastName: '',
        liaisonEmail: '',
        // Fields for editing an existing agency
        liaison: '',
        contact: ''
    });

    useEffect(() => {
        if (isEditing && agency) {
            setFormData({
                name: agency.name,
                status: agency.status,
                officerCount: agency.officerCount,
                subscriptionPlan: agency.subscriptionPlan,
                monthlyCost: agency.monthlyCost,
                storageUsed: agency.storageUsed,
                storageAllocated: agency.storageAllocated,
                bwcVideoAnalysis: agency.bwcVideoAnalysis,
                sentimentAnalysis: agency.sentimentAnalysis,
                liaison: agency.liaison,
                contact: agency.contact,
                liaisonFirstName: agency.liaison.split(' ')[0] || '',
                liaisonLastName: agency.liaison.split(' ').slice(1).join(' ') || '',
                liaisonEmail: agency.contact,
            });
        }
    }, [agency, isEditing]);


    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-atlas-blue focus:border-atlas-blue sm:text-sm text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };
    
    const handleSubmit = () => {
        if (isEditing && agency) {
             const editedAgencyData: Agency = {
                ...agency,
                name: formData.name,
                status: formData.status,
                officerCount: Number(formData.officerCount),
                subscriptionPlan: formData.subscriptionPlan,
                monthlyCost: Number(formData.monthlyCost),
                storageAllocated: Number(formData.storageAllocated),
                bwcVideoAnalysis: formData.bwcVideoAnalysis,
                sentimentAnalysis: formData.sentimentAnalysis,
                liaison: `${formData.liaisonFirstName} ${formData.liaisonLastName}`,
                contact: formData.liaisonEmail
            };
            onSave(editedAgencyData);
        } else {
            onSave(formData);
        }
    };

    const modalTitle = readOnly ? 'View Agency Details' : isEditing ? 'Edit Agency' : 'Add New Agency';

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b sticky top-0 bg-white z-10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">{modalTitle}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                           <CloseIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <BuildingIcon className="h-6 w-6 text-gray-500"/>
                            <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Agency Name *</label>
                                <input type="text" id="name" value={formData.name} onChange={handleChange} className={inputStyle} disabled={readOnly} />
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                                <select id="status" value={formData.status} onChange={handleChange} className={inputStyle} disabled={readOnly}>
                                    <option>Active</option>
                                    <option>Inactive</option>
                                    <option>Pending</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="officerCount" className="block text-sm font-medium text-gray-700">Officer Count</label>
                                <input type="number" id="officerCount" value={formData.officerCount} onChange={handleChange} className={inputStyle} disabled={readOnly} />
                            </div>
                        </div>
                    </div>
                    
                    {/* Agency Liaison */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <UserCircleIcon className="h-6 w-6 text-purple-500"/>
                            <h3 className="text-lg font-semibold text-gray-700">{isEditing ? 'Agency Liaison' : 'Create Agency Admin User'}</h3>
                        </div>
                         <p className="text-sm text-gray-500 -mt-2">
                           {isEditing ? 'Edit the primary contact for this agency.' : 'This will create the primary administrative user account for the new agency.'}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="liaisonFirstName" className="block text-sm font-medium text-gray-700">First Name *</label>
                                <input type="text" id="liaisonFirstName" value={formData.liaisonFirstName} onChange={handleChange} className={inputStyle} disabled={readOnly} />
                            </div>
                             <div>
                                <label htmlFor="liaisonLastName" className="block text-sm font-medium text-gray-700">Last Name *</label>
                                <input type="text" id="liaisonLastName" value={formData.liaisonLastName} onChange={handleChange} className={inputStyle} disabled={readOnly} />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="liaisonEmail" className="block text-sm font-medium text-gray-700">Email Address (Liaison's Login ID) *</label>
                                <input type="email" id="liaisonEmail" value={formData.liaisonEmail} onChange={handleChange} className={inputStyle} disabled={readOnly} />
                            </div>
                        </div>
                    </div>

                    {/* Agency Settings */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <CogIcon className="h-6 w-6 text-orange-500"/>
                            <h3 className="text-lg font-semibold text-gray-700">Agency Settings</h3>
                        </div>
                        <div className="space-y-4 pt-2">
                             <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-gray-800">BWC Video Analysis</h4>
                                    <p className="text-sm text-gray-500">Enable AI-powered video analysis for BWC footage</p>
                                </div>
                                <ToggleSwitch 
                                    enabled={formData.bwcVideoAnalysis} 
                                    setEnabled={(enabled) => setFormData(prev => ({ ...prev, bwcVideoAnalysis: enabled }))} 
                                    disabled={readOnly}
                                />
                            </div>
                             <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-gray-800">Sentiment Analysis</h4>
                                    <p className="text-sm text-gray-500">Automatically transcribe audio from uploaded BWC files</p>
                                </div>
                                <ToggleSwitch 
                                    enabled={formData.sentimentAnalysis} 
                                    setEnabled={(enabled) => setFormData(prev => ({ ...prev, sentimentAnalysis: enabled }))} 
                                    disabled={readOnly}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t sticky bottom-0 z-10">
                    <div className="flex justify-end space-x-4">
                        {readOnly ? (
                             <button onClick={onClose} className="px-6 py-2 text-sm font-medium text-white bg-atlas-blue rounded-md shadow-sm hover:bg-blue-700">
                                Close
                            </button>
                        ) : (
                            <>
                                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-atlas-blue rounded-md shadow-sm hover:bg-blue-700">
                                    {isEditing ? 'Save Changes' : 'Create Agency & Admin User'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddAgencyModal;