
import React, { useState } from 'react';
import { ShieldCheckIcon, DocumentTextIcon, CloseIcon, UserCircleIcon } from './IconComponents.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';

interface TermsModalProps {
    onClose: () => void;
    onAccept: (email: string) => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ onClose, onAccept }) => {
    const { validateGuestAccess } = useAppContext();
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [agreedToIp, setAgreedToIp] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isChecking, setIsChecking] = useState(false);

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleAccept = async () => {
        if (!isValidEmail(email)) {
            setEmailError('Please enter a valid work email address.');
            return;
        }
        
        setIsChecking(true);
        try {
            const isAuthorized = await validateGuestAccess(email);
            if (!isAuthorized) {
                setEmailError('Access Denied: Email not found or 24-hour access window has expired.');
                return;
            }
            onAccept(email);
        } catch (error) {
            setEmailError('Error validating email. Please try again.');
        } finally {
            setIsChecking(false);
        }
    };

    const canAccept = agreedToTerms && agreedToIp && email.length > 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100] backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                    <div className="flex items-center space-x-3">
                        <ShieldCheckIcon className="h-8 w-8 text-atlas-blue" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Evaluation License Agreement</h2>
                            <p className="text-sm text-gray-500">Please identify yourself to access the ATLAS Demo.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-8 overflow-y-auto text-sm text-gray-600 leading-relaxed space-y-6 bg-white">
                    
                    {/* Identity Gate */}
                    <div className={`bg-indigo-50 border ${emailError ? 'border-red-200 bg-red-50' : 'border-indigo-100'} p-4 rounded-md space-y-3 transition-colors`}>
                        <div className={`flex items-center space-x-2 ${emailError ? 'text-red-800' : 'text-indigo-800'} font-semibold`}>
                            <UserCircleIcon className="h-5 w-5" />
                            <h3>Reviewer Identification</h3>
                        </div>
                        <p className={emailError ? 'text-red-700' : 'text-indigo-700 text-xs'}>
                            To maintain the integrity of our platform and track usage, we require a valid, authorized work email address to access the demo environment.
                        </p>
                        <div>
                            <input 
                                type="email" 
                                placeholder="Enter your work email address..." 
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setEmailError('');
                                }}
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500 bg-white ${emailError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-atlas-blue'}`}
                            />
                            {emailError && <p className="text-red-600 font-semibold text-xs mt-1">{emailError}</p>}
                        </div>
                    </div>

                    <div className="space-y-4 border-l-4 border-gray-300 pl-4 py-2">
                        <p className="font-medium text-gray-800">
                            By accessing this demo ("ATLAS"), you agree to the following:
                        </p>
                        <div>
                            <h4 className="font-bold text-gray-800">1. Intellectual Property Rights</h4>
                            <p>You acknowledge that ATLAS, including its user interface, design, source code, underlying logic, and AI integration methods, contains proprietary and confidential information. All rights remain the sole property of the licensor.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">2. Restrictions on Use</h4>
                            <p>You agree NOT to:</p>
                            <ul className="list-disc list-inside pl-2 mt-1 space-y-1">
                                <li>Copy, modify, duplicate, or reverse engineer any part of the software.</li>
                                <li>Use the demo to build a competitive product or service.</li>
                                <li>Share your access credentials or the demo URL with unauthorized third parties.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <div className="space-y-3 mb-6">
                        <label className="flex items-start cursor-pointer group">
                            <div className="relative flex items-center">
                                <input 
                                    type="checkbox" 
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-atlas-blue checked:bg-atlas-blue focus:ring-2 focus:ring-atlas-blue focus:ring-offset-2"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                />
                                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                            </div>
                            <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 select-none">
                                I agree to the evaluation terms and conditions.
                            </span>
                        </label>

                        <label className="flex items-start cursor-pointer group">
                             <div className="relative flex items-center">
                                <input 
                                    type="checkbox" 
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-atlas-blue checked:bg-atlas-blue focus:ring-2 focus:ring-atlas-blue focus:ring-offset-2"
                                    checked={agreedToIp}
                                    onChange={(e) => setAgreedToIp(e.target.checked)}
                                />
                                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                            </div>
                            <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 select-none">
                                I acknowledge that copying or reverse engineering this software is strictly prohibited.
                            </span>
                        </label>
                    </div>

                    <button
                        onClick={handleAccept}
                        disabled={!canAccept || isChecking}
                        className={`w-full py-3 px-4 rounded-md font-bold text-white shadow-md transition-all transform ${
                            canAccept && !isChecking
                                ? 'bg-atlas-blue hover:bg-blue-700 hover:scale-[1.01]' 
                                : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        {isChecking ? 'Verifying Access...' : (canAccept ? 'Confirm Identity & Start Demo' : 'Please complete all fields to continue')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;
