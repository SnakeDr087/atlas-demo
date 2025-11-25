// FIX: Populating placeholder file to resolve module errors.
import React from 'react';
import type { AuditLogItem } from '../types.ts';

interface AuditLogListProps {
    logItems: AuditLogItem[];
}

const roleColors: { [key: string]: string } = {
    'Super Admin': 'bg-purple-100 text-purple-800',
    'Agency Supervisor': 'bg-blue-100 text-blue-800',
    'Officer': 'bg-green-100 text-green-800',
};

const AuditLogList: React.FC<AuditLogListProps> = ({ logItems }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <caption className="sr-only">List of all system audit log events.</caption>
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {logItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.timestamp}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.user}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColors[item.role] || ''}`}>
                                    {item.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{item.action}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-sm truncate" title={item.details}>{item.details}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.ipAddress}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AuditLogList;
