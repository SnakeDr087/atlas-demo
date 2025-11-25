import React from 'react';
import type { PerformanceImprovementPlan, UserRole } from '../types';
import { EyeIcon, PencilIcon, TrashIcon } from './IconComponents';

interface PipListProps {
    pips: PerformanceImprovementPlan[];
    onEdit: (pip: PerformanceImprovementPlan) => void;
    onDelete: (pipId: string) => void;
    role: UserRole;
}

const statusColors: { [key: string]: string } = {
    'Draft': 'bg-gray-100 text-gray-800',
    'Active': 'bg-blue-100 text-blue-800',
    'Successfully Completed': 'bg-green-100 text-green-800',
    'Extended': 'bg-yellow-100 text-yellow-800',
    'Escalated': 'bg-red-100 text-red-800',
};

const PipList: React.FC<PipListProps> = ({ pips, onEdit, onDelete, role }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <caption className="sr-only">List of Performance Improvement Plans with officer details and available actions.</caption>
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Officer Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {pips.map((pip) => (
                        <tr key={pip.id} className="hover:bg-gray-50">
                            <th scope="row" className="px-6 py-4 whitespace-nowrap text-left font-medium">
                                <div className="text-sm text-gray-900">{pip.officer.firstName} {pip.officer.lastName}</div>
                                <div className="text-sm text-gray-500 font-normal">{pip.officer.badgeNumber}</div>
                            </th>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pip.supervisor}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pip.startDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pip.endDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[pip.status] || ''}`}>
                                    {pip.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-4">
                                    <button aria-label={`View PIP for ${pip.officer.firstName} ${pip.officer.lastName}`} className="text-gray-400 hover:text-atlas-blue rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-atlas-blue" title="View"><EyeIcon className="h-5 w-5"/></button>
                                    {role !== 'Officer' && (
                                        <>
                                            <button onClick={() => onEdit(pip)} aria-label={`Edit PIP for ${pip.officer.firstName} ${pip.officer.lastName}`} className="text-gray-400 hover:text-yellow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-atlas-blue" title="Edit"><PencilIcon className="h-5 w-5"/></button>
                                            <button onClick={() => onDelete(pip.id)} aria-label={`Delete PIP for ${pip.officer.firstName} ${pip.officer.lastName}`} className="text-gray-400 hover:text-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-atlas-blue" title="Delete"><TrashIcon className="h-5 w-5"/></button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PipList;