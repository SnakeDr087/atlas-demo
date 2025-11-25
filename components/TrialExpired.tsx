import React from 'react';
import { ShieldExclamationIcon } from './IconComponents.tsx';

interface TrialExpiredProps {
    onLogout: () => void;
}

const TrialExpired: React.FC<TrialExpiredProps> = ({ onLogout }) => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="mx-auto h-24 w-24 bg-red-100 rounded-full flex items-center justify-center">
                    <ShieldExclamationIcon className="h-12 w-12 text-red-600" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Demo Period Expired
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Your 24-hour trial access to the ATLAS Performance Management System has concluded.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Ready to deploy ATLAS?</h3>
                    <p className="text-gray-500 mb-6">
                        Contact our sales team to set up a full agency instance with secure data storage, advanced AI capabilities, and dedicated support.
                    </p>
                    
                    <div className="space-y-4">
                        <a 
                            href="mailto:sales@atlaspm.com" 
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-atlas-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Contact Sales
                        </a>
                        <button
                            onClick={onLogout}
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Return to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrialExpired;