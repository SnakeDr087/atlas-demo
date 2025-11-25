import React from 'react';
import { CloseIcon, DownloadIcon } from './IconComponents.tsx';

interface ContractViewerModalProps {
    onClose: () => void;
}

const contractPages = [
    'https://i.postimg.cc/qM05pG29/atlas-contract-p1.png',
    'https://i.postimg.cc/d1yHqVjw/atlas-contract-p2.png',
    'https://i.postimg.cc/3wL1K7zP/atlas-contract-p3.png',
];

const ContractViewerModal: React.FC<ContractViewerModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[95vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold text-gray-800">Master Service Agreement</h2>
                    <div className="flex items-center space-x-4">
                        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-atlas-blue hover:bg-blue-700">
                            <DownloadIcon className="h-5 w-5 mr-2" />
                            Download PDF
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <CloseIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
                <div className="p-4 overflow-y-auto bg-gray-200 flex-grow">
                    <div className="space-y-4 max-w-3xl mx-auto">
                        {contractPages.map((pageUrl, index) => (
                            <img key={index} src={pageUrl} alt={`Contract Page ${index + 1}`} className="w-full h-auto shadow-md" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractViewerModal;
