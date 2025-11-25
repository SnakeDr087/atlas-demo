import React, { useState, useEffect } from 'react';
import type { Agency, Officer } from '../types';
import { getAgencies } from '../services/agencyService';
import { CloseIcon, UserCircleIcon, ShieldCheckIcon } from './IconComponents';
import { useAppContext } from '../contexts/AppContext';

interface AddOfficerModalProps {
    onClose: () => void;
    onSave: (officer: Omit<Officer, 'id'> | Officer) => void;
    officer?: Officer;
}

const AddOfficerModal: React.FC<AddOfficerModalProps> = ({ onClose, onSave, officer }) => {
    const { currentUser: user } = useAppContext();
    const isEditing = !!officer;
    const [agencies, setAgencies] = useState<Agency[]>([]);
    
    const [formData, setFormData] = useState<Omit<Officer, 'id' | 'incidents' | 'score'>>({
        firstName: '',
        lastName: '',
        badgeNumber: '',
        rank: 'Officer',
        agency: '',
        status: 'Active',
        dob: '',
        hireDate: '',
        education: "Bachelor's Degree",
        gender: 'Male',
        race: 'Caucasian',
        shift: 'Day',
    });

    useEffect(() => {
        if (!user) return;
        getAgencies().then(data => {
            if (user.role === 'Super Admin') {
                setAgencies(data);
            } else if (user.agency) {
                setAgencies(data.filter(a => a.name === user.agency));
            }
        });
        if (isEditing) {
            setFormData({
                firstName: officer.firstName,
                lastName: officer.lastName,
                badgeNumber: officer.badgeNumber,
                rank: officer.rank,
                agency: officer.agency,
                status: officer.status,
                dob: officer.dob,
                hireDate: officer.hireDate,
                education: officer.education,
                gender: officer.gender,
                race: officer.race,
                shift: officer.shift,
            });
        } else {
            setFormData(prev => ({ ...prev, agency: user.agency || ''}));
        }
    }, [officer, isEditing, user]);

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-atlas-blue focus:border-atlas-blue sm:text-sm text-gray-900 placeholder-gray-400";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as any }));
    };

    const handleSubmit = () => {
        if (isEditing) {
            onSave({ ...officer, ...formData });
        } else {
            onSave({ ...formData, incidents: 0, score: 100 });
        }
    };
    
    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b sticky top-0 bg-white z-10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">{isEditing ? 'Edit Officer' : 'Add New Officer'}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon className="h-6 w-6" /></button>
                    </div>
                </div>
                <form className="p-8 space-y-8 overflow-y-auto">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3"><UserCircleIcon className="h-6 w-6 text-gray-500" /><h3 className="text-lg font-semibold text-gray-700">Personal Information</h3></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name *</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={inputStyle} required /></div>
                            <div><label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name *</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={inputStyle} required /></div>
                            <div><label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label><input type="date" name="dob" value={formData.dob} onChange={handleChange} className={inputStyle} /></div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3"><ShieldCheckIcon className="h-6 w-6 text-gray-500" /><h3 className="text-lg font-semibold text-gray-700">Professional Information</h3></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div><label htmlFor="badgeNumber" className="block text-sm font-medium text-gray-700">Badge Number *</label><input type="text" name="badgeNumber" value={formData.badgeNumber} onChange={handleChange} className={inputStyle} required /></div>
                            <div><label htmlFor="rank" className="block text-sm font-medium text-gray-700">Rank</label><input type="text" name="rank" value={formData.rank} onChange={handleChange} className={inputStyle} /></div>
                            <div>
                                <label htmlFor="agency" className="block text-sm font-medium text-gray-700">Agency</label>
                                <select name="agency" value={formData.agency} onChange={handleChange} className={`${inputStyle} disabled:bg-gray-100`} disabled={user.role !== 'Super Admin'}>
                                    {user.role === 'Super Admin' && <option value="">Select Agency</option>}
                                    {agencies.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                                </select>
                            </div>
                            <div><label htmlFor="hireDate" className="block text-sm font-medium text-gray-700">Hire Date</label><input type="date" name="hireDate" value={formData.hireDate} onChange={handleChange} className={inputStyle} /></div>
                            <div><label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label><select name="status" value={formData.status} onChange={handleChange} className={inputStyle}><option>Active</option><option>On Leave</option><option>Retired</option><option>Terminated</option></select></div>
                            <div><label htmlFor="shift" className="block text-sm font-medium text-gray-700">Shift</label><select name="shift" value={formData.shift} onChange={handleChange} className={inputStyle}><option>Day</option><option>Night</option><option>Swing</option></select></div>
                        </div>
                    </div>
                </form>
                <div className="p-6 bg-gray-50 border-t sticky bottom-0 z-10">
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Cancel</button>
                        <button type="button" onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-atlas-blue rounded-md shadow-sm hover:bg-blue-700">{isEditing ? 'Save Changes' : 'Add Officer'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddOfficerModal;