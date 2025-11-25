import React, { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from './IconComponents.tsx';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}

const toastConfig = {
    success: {
        icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
        bg: 'bg-green-50',
        border: 'border-green-400',
    },
    error: {
        icon: <XCircleIcon className="h-6 w-6 text-red-500" />,
        bg: 'bg-red-50',
        border: 'border-red-400',
    },
    info: {
        icon: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
        bg: 'bg-blue-50',
        border: 'border-blue-400',
    },
};

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Auto-dismiss after 5 seconds

        return () => {
            clearTimeout(timer);
        };
    }, [onClose]);

    const config = toastConfig[type];

    return (
        <div 
            className={`flex items-start p-4 rounded-lg shadow-lg border-l-4 ${config.bg} ${config.border} animate-fade-in-right`}
            role="alert"
        >
            <div className="flex-shrink-0">{config.icon}</div>
            <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{message}</p>
            </div>
            <div className="ml-auto pl-3">
                <button
                    onClick={onClose}
                    className="-mx-1.5 -my-1.5 bg-transparent rounded-md p-1.5 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Toast;