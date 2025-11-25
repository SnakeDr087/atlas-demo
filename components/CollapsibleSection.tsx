import React, { useState } from 'react';
import { ChevronDownIcon } from './IconComponents.tsx';

interface CollapsibleSectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-gray-200 rounded-lg">
            <button
                type="button"
                className={`w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-atlas-blue ${
                    isOpen ? 'rounded-t-lg' : 'rounded-lg'
                }`}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <div className="flex items-center space-x-3">
                    <span className="text-atlas-blue">{icon}</span>
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                </div>
                <ChevronDownIcon
                    className={`h-6 w-6 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                    }`}
                />
            </button>
            {isOpen && (
                <div className="p-6 bg-white border-t border-gray-200 rounded-b-lg">
                    {children}
                </div>
            )}
        </div>
    );
};

export default CollapsibleSection;
