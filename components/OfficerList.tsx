import React from 'react';
import type { Officer } from '../types';
import { EyeIcon, PencilIcon, TrashIcon } from './IconComponents';

interface OfficerListProps {
    officers: Officer[];
    onEdit: (officer: Officer) => void;
    onDelete: (officerId: string) => void;
}

const OfficerList: React.FC<OfficerListProps> = ({ officers, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <caption className="sr-only">List of all officers with their details and available actions.</caption>
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Officer Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agency</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incidents</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {officers.map((officer) => (
                        <tr key={officer.id} className="hover:bg-gray-50">
                            <th scope="row" className="px-6 py-4 whitespace-nowrap text-left font-medium">
                                <div className="text-sm text-gray-900">{officer.firstName} {officer.lastName}</div>
                                <div className="text-sm text-gray-500 font-normal">Badge #{officer.badgeNumber}</div>
                            </th>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{officer.rank}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{officer.agency}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{officer.incidents}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                               <div className="flex items-center space-x-4">
                                    <button aria-label={`View details for ${officer.firstName} ${officer.lastName}`} className="text-gray-400 hover:text-atlas-blue rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-atlas-blue" title="View"><EyeIcon className="h-5 w-5"/></button>
                                    <button onClick={() => onEdit(officer)} aria-label={`Edit details for ${officer.firstName} ${officer.lastName}`} className="text-gray-400 hover:text-yellow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-atlas-blue" title="Edit"><PencilIcon className="h-5 w-5"/></button>
                                    <button onClick={() => onDelete(officer.id)} aria-label={`Delete ${officer.firstName} ${officer.lastName}`} className="text-gray-400 hover:text-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-atlas-blue" title="Delete"><TrashIcon className="h-5 w-5"/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OfficerList;