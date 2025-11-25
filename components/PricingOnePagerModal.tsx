import React from 'react';
import { CloseIcon, DownloadIcon } from './IconComponents.tsx';
import PricingOnePager from './PricingOnePager.tsx';

interface PricingOnePagerModalProps {
    onClose: () => void;
}

const PricingOnePagerModal: React.FC<PricingOnePagerModalProps> = ({ onClose }) => {
    
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-gray-100 rounded-lg shadow-xl w-full max-w-6xl h-[95vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b bg-white flex justify-between items-center sticky top-0 z-10">
                    <h2 className="text-xl font-semibold text-gray-800">ATLAS Pricing Sheet</h2>
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={handlePrint}
                            className="inline-flex items-center px-4 py-2 bg-atlas-blue text-white rounded-md hover:bg-blue-700"
                        >
                            <DownloadIcon className="h-5 w-5 mr-2" />
                            Download as PDF
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <CloseIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
                <div className="overflow-y-auto flex-grow">
                    <PricingOnePager />
                </div>
            </div>
        </div>
    );
};

export default PricingOnePagerModal;
