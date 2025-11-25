import React from 'react';
import type { Agency, UserRole } from '../types';
import { EyeIcon, PencilIcon, TrashIcon } from './IconComponents';

interface AgencyListProps {
    agencies: Agency[];
    onEdit: (agency: Agency) => void;
    onDelete: (agencyId: string) => void;
    onView: (agency: Agency) => void;
    role: UserRole;
}

const statusColors: { [key: string]: string } = {
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-gray-100 text-gray-800',
    Pending: 'bg-yellow-100 text-yellow-800',
};

const planColors: { [key: string]: string } = {
    Core: 'bg-gray-200 text-gray-800',
    Pro: 'bg-blue-200 text-blue-800',
    Elite: 'bg-purple-200 text-purple-800',
};


const AgencyList: React.FC<AgencyListProps> = ({ agencies, onEdit, onDelete, onView, role }) => {
    const isSuperAdmin = role === 'Super Admin';
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <caption className="sr-only">List of all agencies with their details and available actions.</caption>
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agency Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liaison</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Officers</th>
                        {isSuperAdmin && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>}
                        {isSuperAdmin && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Cost</th>}
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {agencies.map((agency) => (
                        <tr key={agency.id} className="hover:bg-gray-50">
                            <th scope="row" className="px-6 py-4 whitespace-nowrap text-left font-medium">
                                <div className="text-sm text-gray-900">{agency.name}</div>
                                <div className="text-sm text-gray-500 font-normal">{agency.id}</div>
                            </th>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agency.liaison}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agency.officerCount}</td>
                            {isSuperAdmin && (
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${planColors[agency.subscriptionPlan]}`}>
                                        {agency.subscriptionPlan}
                                    </span>
                                </td>
                            )}
                            {isSuperAdmin && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">${agency.monthlyCost.toLocaleString()}</td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[agency.status] || ''}`}>
                                    {agency.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-4">
                                    <button onClick={() => onView(agency)} aria-label={`View details for ${agency.name}`} className="text-gray-400 hover:text-atlas-blue rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-atlas-blue" title="View"><EyeIcon className="h-5 w-5"/></button>
                                    <button onClick={() => onEdit(agency)} aria-label={`Edit details for ${agency.name}`} className="text-gray-400 hover:text-yellow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-atlas-blue" title="Edit"><PencilIcon className="h-5 w-5"/></button>
                                    <button onClick={() => onDelete(agency.id)} aria-label={`Delete ${agency.name}`} className="text-gray-400 hover:text-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-atlas-blue" title="Delete"><TrashIcon className="h-5 w-5"/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AgencyList;