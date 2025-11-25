import React from 'react';
import type { BwcReport, Officer } from '../types';
import { EyeIcon, PencilIcon, TrashIcon } from './IconComponents';

interface BwcReportListProps {
    reports: BwcReport[];
    officers: Officer[];
    onEdit: (report: BwcReport) => void;
    onDelete: (reportId: string) => void;
    readOnly?: boolean;
}

const statusColors: { [key: string]: string } = {
    'Processing': 'bg-yellow-100 text-yellow-800',
    'Review Complete': 'bg-green-100 text-green-800',
    'Failed': 'bg-red-100 text-red-800',
};

const BwcReportList: React.FC<BwcReportListProps> = ({ reports, officers, onEdit, onDelete, readOnly = false }) => {
    const getOfficerName = (officerId: string) => {
        const officer = officers.find(o => o.id === officerId);
        return officer ? `${officer.firstName} ${officer.lastName}` : 'Unknown Officer';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <caption className="sr-only">List of BWC analysis reports.</caption>
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Number</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Primary Officer</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incident Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incident Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {reports.map((report) => (
                        <tr key={report.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{report.caseNumber}</div>
                                <div className="text-sm text-gray-500">{report.id}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getOfficerName(report.personnel.primaryOfficer)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.incidentDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.incidentType}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[report.status] || ''}`}>
                                    {report.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-4">
                                    <button onClick={() => onEdit(report)} className="text-gray-400 hover:text-atlas-blue" title={readOnly ? "View Report" : "Edit Report"}>
                                        {readOnly ? <EyeIcon className="h-5 w-5"/> : <PencilIcon className="h-5 w-5"/>}
                                    </button>
                                    {!readOnly && (
                                         <button onClick={() => onDelete(report.id)} className="text-gray-400 hover:text-red-500" title="Delete Report">
                                            <TrashIcon className="h-5 w-5"/>
                                        </button>
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

export default BwcReportList;