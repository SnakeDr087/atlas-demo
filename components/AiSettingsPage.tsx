import React, { useState, useEffect } from 'react';
import Header from './Header';
import { CogIcon, DocumentTextIcon } from './IconComponents';

interface AiSettingsPageProps {
    systemInstruction: string;
    setSystemInstruction: (value: string) => void;
    policyGuidelines: string;
    setPolicyGuidelines: (value: string) => void;
    defaultSystemInstruction: string;
    defaultPolicyGuidelines: string;
}

const AiSettingsPage: React.FC<AiSettingsPageProps> = ({
    systemInstruction,
    setSystemInstruction,
    policyGuidelines,
    setPolicyGuidelines,
    defaultSystemInstruction,
    defaultPolicyGuidelines,
}) => {
    const [localSystemInstruction, setLocalSystemInstruction] = useState(systemInstruction);
    const [localPolicyGuidelines, setLocalPolicyGuidelines] = useState(policyGuidelines);
    const [saveStatus, setSaveStatus] = useState('');

    useEffect(() => {
        if (saveStatus) {
            const timer = setTimeout(() => setSaveStatus(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [saveStatus]);

    const handleSave = () => {
        setSystemInstruction(localSystemInstruction);
        setPolicyGuidelines(localPolicyGuidelines);
        setSaveStatus('Settings saved successfully!');
    };

    const handleReset = () => {
        setLocalSystemInstruction(defaultSystemInstruction);
        setLocalPolicyGuidelines(defaultPolicyGuidelines);
        setSystemInstruction(defaultSystemInstruction);
        setPolicyGuidelines(defaultPolicyGuidelines);
        setSaveStatus('Settings have been reset to their defaults.');
    };

    return (
        <div className="p-8 space-y-8">
            <Header title="AI Assistant Configuration" />

            <div className="bg-white p-8 rounded-lg shadow-sm space-y-8">
                {/* System Prompt Section */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <CogIcon className="h-6 w-6 text-gray-500" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">System Prompt</h2>
                            <p className="text-sm text-gray-500">Define the AI's personality, role, and constraints. This instruction guides every response.</p>
                        </div>
                    </div>
                    <textarea
                        value={localSystemInstruction}
                        onChange={(e) => setLocalSystemInstruction(e.target.value)}
                        rows={8}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-atlas-blue focus:border-atlas-blue sm:text-sm text-gray-900 placeholder-gray-400 font-mono"
                        placeholder="Enter the core instructions for the AI assistant..."
                    />
                </div>

                {/* Knowledge Base Section */}
                <div className="space-y-4">
                     <div className="flex items-center space-x-3">
                        <DocumentTextIcon className="h-6 w-6 text-gray-500" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Knowledge Base</h2>
                            <p className="text-sm text-gray-500">Add specific policies, guidelines, or factual information the AI should know. This content is provided to the AI as context for answering questions.</p>
                        </div>
                    </div>
                     <textarea
                        value={localPolicyGuidelines}
                        onChange={(e) => setLocalPolicyGuidelines(e.target.value)}
                        rows={15}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-atlas-blue focus:border-atlas-blue sm:text-sm text-gray-900 placeholder-gray-400 font-mono"
                        placeholder="Enter policy information or other knowledge base articles..."
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                 <div>
                    {saveStatus && (
                        <p className="text-sm font-medium text-green-600 transition-opacity duration-300">{saveStatus}</p>
                    )}
                </div>
                <div className="flex space-x-4">
                     <button
                        onClick={handleReset}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-atlas-blue"
                    >
                        Reset to Defaults
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 text-sm font-medium text-white bg-atlas-blue rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-atlas-blue"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiSettingsPage;