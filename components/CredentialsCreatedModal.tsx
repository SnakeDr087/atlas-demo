
import React, { useState, useEffect } from 'react';
import { CloseIcon, CheckCircleIcon, ClipboardCopyIcon } from './IconComponents.tsx';

interface CredentialsCreatedModalProps {
    credentials: { username: string; password: string };
    onClose: () => void;
}

const CredentialsCreatedModal: React.FC<CredentialsCreatedModalProps> = ({ credentials, onClose }) => {
    const [copyButtonText, setCopyButtonText] = useState('Copy Credentials');

    useEffect(() => {
        // Reset button text when modal is closed/reopened
        setCopyButtonText('Copy Credentials');
    }, [credentials]);

    const handleCopy = () => {
        const textToCopy = `Username: ${credentials.username}\nPassword: ${credentials.password}`;
        navigator.clipboard.writeText(textToCopy);
        setCopyButtonText('Copied!');
        setTimeout(() => setCopyButtonText('Copy Credentials'), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-6 text-center">
                    <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800">Success!</h2>
                    <p className="mt-2 text-gray-600">The agency and its administrator account have been created. Please securely share these temporary credentials with the new Agency Admin.</p>
                </div>
                <div className="bg-gray-50 p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Login Username (Email)</label>
                        <p className="mt-1 p-2 bg-gray-200 rounded-md font-mono text-gray-800">{credentials.username}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Temporary Password</label>
                        <p className="mt-1 p-2 bg-gray-200 rounded-md font-mono text-gray-800">{credentials.password}</p>
                    </div>
                </div>
                <div className="p-6 bg-white border-t flex justify-between items-center rounded-b-lg">
                    <button 
                        onClick={handleCopy}
                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors"
                    >
                        <ClipboardCopyIcon className="h-5 w-5 mr-2" />
                        {copyButtonText}
                    </button>
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-atlas-blue text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CredentialsCreatedModal;