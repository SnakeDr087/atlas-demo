import React, { useState, useEffect } from 'react';
import type { User, UserRole, Agency } from '../types.ts';
import { useAppContext } from '../contexts/AppContext.tsx';
import { CloseIcon } from './IconComponents.tsx';

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    userToEdit?: User | null;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSave, userToEdit }) => {
    const { currentUser, agencies } = useAppContext();
    const isEditing = !!userToEdit;
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Officer' as UserRole,
        agency: currentUser?.agency || '',
    });

    useEffect(() => {
        if (userToEdit) {
            setFormData({
                name: userToEdit.name,
                email: userToEdit.id,
                role: userToEdit.role,
                agency: userToEdit.agency || '',
            });
        }
    }, [userToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    const availableRoles: UserRole[] = currentUser?.role === 'Super Admin' 
        ? ['Super Admin', 'Agency Admin', 'Agency Supervisor', 'Officer']
        : ['Agency Supervisor', 'Officer'];

    if (!isOpen) return null;

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-atlas-blue focus:border-atlas-blue sm:text-sm text-gray-900";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">{isEditing ? 'Edit User' : 'Add New User'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon className="h-6 w-6" /></button>
                </div>
                <div className="p-8 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputStyle} />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email / Login ID</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className={`${inputStyle} ${isEditing ? 'bg-gray-100' : ''}`} disabled={isEditing} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                            <select name="role" value={formData.role} onChange={handleChange} className={inputStyle}>
                                {availableRoles.map(role => <option key={role} value={role}>{role}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="agency" className="block text-sm font-medium text-gray-700">Agency</label>
                            <select name="agency" value={formData.agency} onChange={handleChange} className={`${inputStyle} disabled:bg-gray-100`} disabled={currentUser?.role !== 'Super Admin'}>
                                {currentUser?.role === 'Super Admin' ? (
                                    <>
                                        <option value="">Select Agency (if applicable)</option>
                                        {agencies.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                                    </>
                                ) : (
                                    <option value={currentUser?.agency}>{currentUser?.agency}</option>
                                )}
                            </select>
                        </div>
                    </div>
                    {!isEditing && <p className="text-xs text-gray-500">A temporary password will be generated for the new user.</p>}
                </div>
                <div className="p-6 bg-gray-50 border-t flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 text-sm text-white bg-atlas-blue rounded-md">{isEditing ? 'Save Changes' : 'Create User'}</button>
                </div>
            </div>
        </div>
    );
};

export default AddUserModal;