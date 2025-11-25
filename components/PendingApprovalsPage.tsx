import React, { useState } from 'react';
import Header from './Header.tsx';
import ViewPendingOfficerModal from './ViewPendingOfficerModal.tsx';
import type { PendingOfficer } from '../types.ts';
import { CheckCircleIcon, XCircleIcon, EyeIcon } from './IconComponents.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';

const PendingApprovalsPage: React.FC = () => {
    const { pendingOfficers, approveRegistration, denyRegistration } = useAppContext();
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [viewingOfficer, setViewingOfficer] = useState<PendingOfficer | null>(null);

    const handleApprove = async (id: string, updatedData?: Partial<Omit<PendingOfficer, 'id' | 'status'>>) => {
        setUpdatingId(id);
        await approveRegistration(id, updatedData);
        setUpdatingId(null);
        setViewingOfficer(null);
    };

    const handleDeny = async (id: string) => {
        setUpdatingId(id);
        await denyRegistration(id);
        setUpdatingId(null);
        setViewingOfficer(null);
    };

    return (
        <div className="p-8 space-y-8">
            <Header title="Pending Officer Approvals" />
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Officer Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agency</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pendingOfficers.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-8 text-gray-500">No pending approvals.</td></tr>
                        ) : (
                            pendingOfficers.map(officer => (
                                <tr key={officer.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{officer.firstName} {officer.lastName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{officer.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{officer.agency}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{officer.requestedDate}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={() => setViewingOfficer(officer)}
                                                disabled={updatingId === officer.id}
                                                className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 disabled:opacity-50"
                                            >
                                                <EyeIcon className="h-4 w-4 mr-1"/> View Details
                                            </button>
                                            <button 
                                                onClick={() => handleApprove(officer.id)}
                                                disabled={updatingId === officer.id}
                                                className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 disabled:opacity-50"
                                            >
                                                <CheckCircleIcon className="h-4 w-4 mr-1"/> Approve
                                            </button>
                                            <button 
                                                onClick={() => handleDeny(officer.id)}
                                                disabled={updatingId === officer.id}
                                                className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 disabled:opacity-50"
                                            >
                                                <XCircleIcon className="h-4 w-4 mr-1"/> Deny
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {viewingOfficer && (
                <ViewPendingOfficerModal
                    officer={viewingOfficer}
                    onClose={() => setViewingOfficer(null)}
                    onApprove={handleApprove}
                    onDeny={handleDeny}
                />
            )}
        </div>
    );
};

export default PendingApprovalsPage;