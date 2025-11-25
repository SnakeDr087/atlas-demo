import React, { useState } from 'react';
import type { User } from '../types.ts';
import { CloseIcon, ShieldCheckIcon, ClipboardCopyIcon } from './IconComponents.tsx';

interface ResetPasswordModalProps {
    user: User;
    tempPass: string;
    onClose: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ user, tempPass, onClose }) => {
    const [copyButtonText, setCopyButtonText] = useState('Copy Password');

    const handleCopy = () => {
        navigator.clipboard.writeText(tempPass);
        setCopyButtonText('Copied!');
        setTimeout(() => setCopyButtonText('Copy Password'), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-6 text-center">
                    <ShieldCheckIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800">Password Reset</h2>
                    <p className="mt-2 text-gray-600">A new temporary password has been generated for <strong>{user.name}</strong>. Please share this with them securely.</p>
                </div>
                <div className="bg-gray-50 p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">New Temporary Password</label>
                        <p className="mt-1 p-3 bg-gray-200 rounded-md font-mono text-gray-800 text-lg text-center tracking-wider">{tempPass}</p>
                    </div>
                </div>
                <div className="p-6 bg-white border-t flex justify-between items-center rounded-b-lg">
                    <button 
                        onClick={handleCopy}
                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50"
                    >
                        <ClipboardCopyIcon className="h-5 w-5 mr-2" />
                        {copyButtonText}
                    </button>
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-atlas-blue text-white font-semibold rounded-md hover:bg-blue-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordModal;
