import React from 'react';
import type { Report } from '../types';
import { EyeIcon, PencilIcon, TrashIcon } from './IconComponents';

interface ReportListProps {
    reports: Report[];
    onView: (report: Report) => void;
}

const statusColors: { [key: string]: string } = {
    'Pending Review': 'bg-yellow-100 text-yellow-800',
    'Under Review': 'bg-blue-100 text-blue-800',
    'Review Complete': 'bg-green-100 text-green-800',
    'Escalated': 'bg-red-100 text-red-800',
};

const ReportList: React.FC<ReportListProps> = ({ reports, onView }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <caption className="sr-only">List of all reports with their details and available actions.</caption>
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Number</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Officer</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incident Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {reports.map((report) => (
                        <tr key={report.id} className="hover:bg-gray-50">
                            <th scope="row" className="px-6 py-4 whitespace-nowrap text-left font-medium">
                                <div className="text-sm text-gray-900">{report.caseNumber}</div>
                                <div className="text-sm text-gray-500 font-normal">{report.id}</div>
                            </th>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{report.officer.firstName} {report.officer.lastName}</div>
                                <div className="text-sm text-gray-500">{report.officer.agency}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.incidentDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[report.status] || ''}`}>
                                    {report.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.outcome}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-4">
                                    <button onClick={() => onView(report)} aria-label={`View details for case ${report.caseNumber}`} className="text-gray-400 hover:text-atlas-blue rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-atlas-blue" title="View"><EyeIcon className="h-5 w-5"/></button>
                                    <button aria-label={`Edit details for case ${report.caseNumber}`} className="text-gray-400 hover:text-yellow-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-atlas-blue" title="Edit"><PencilIcon className="h-5 w-5"/></button>
                                    <button aria-label={`Delete case ${report.caseNumber}`} className="text-gray-400 hover:text-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-atlas-blue" title="Delete"><TrashIcon className="h-5 w-5"/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReportList;