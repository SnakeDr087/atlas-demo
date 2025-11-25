
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { TrashIcon, PlusCircleIcon, CheckCircleIcon, ShieldCheckIcon, ServerIcon, XCircleIcon, ClockIcon } from './IconComponents.tsx';
import { testDatabaseConnection } from '../services/accessService.ts';

const GuestAccessManager: React.FC = () => {
    const { getAuthorizedGuests, addAuthorizedGuest, removeAuthorizedGuest } = useAppContext();
    const [guests, setGuests] = useState<{email: string, created_at?: string}[]>([]);
    const [newEmail, setNewEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [dbStatus, setDbStatus] = useState<{ status: 'Checking' | 'Connected' | 'Error', message: string }>({ status: 'Checking', message: 'Connecting...' });

    useEffect(() => {
        verifyAndLoad();
    }, []);

    const verifyAndLoad = async () => {
        // 1. Test Connection
        const connection = await testDatabaseConnection();
        if (connection.success) {
            setDbStatus({ status: 'Connected', message: 'Cloud Database Active' });
        } else {
            setDbStatus({ status: 'Error', message: connection.message || 'Connection Failed - Using Local Backup' });
        }

        // 2. Load Data
        setIsLoading(true);
        const list = await getAuthorizedGuests();
        setGuests(list);
        setIsLoading(false);
    };

    const handleAdd = async () => {
        if (newEmail && newEmail.includes('@')) {
            await addAuthorizedGuest(newEmail);
            setNewEmail('');
            verifyAndLoad(); // Reload list
        }
    };

    const handleRemove = async (email: string) => {
        if (window.confirm(`Revoke access for ${email}?`)) {
            await removeAuthorizedGuest(email);
            verifyAndLoad(); // Reload list
        }
    };

    const formatExpiration = (createdAt?: string) => {
        if (!createdAt) return 'N/A';
        const created = new Date(createdAt);
        const expires = new Date(created.getTime() + (24 * 60 * 60 * 1000));
        const now = new Date();
        const isExpired = now > expires;

        return {
            text: expires.toLocaleString(),
            isExpired
        };
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <ShieldCheckIcon className="h-6 w-6 text-purple-600 mr-2"/>
                        Guest Access Allowlist
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                        Users listed here can access the <strong>"Start 24-Hour Client Demo"</strong>. 
                        Authorization automatically expires 24 hours after you add them.
                    </p>
                </div>
                <div className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${
                    dbStatus.status === 'Connected' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : (dbStatus.status === 'Error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-100 text-gray-600 border-gray-300')
                }`}>
                    {dbStatus.status === 'Connected' ? (
                        <>
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            {dbStatus.message}
                        </>
                    ) : dbStatus.status === 'Error' ? (
                        <>
                            <XCircleIcon className="w-3 h-3 mr-1 text-red-500"/>
                            {dbStatus.message}
                        </>
                    ) : (
                        <>
                            <ServerIcon className="w-3 h-3 mr-1 text-gray-500"/>
                            Checking...
                        </>
                    )}
                </div>
            </div>

            <div className="flex space-x-2 mb-6">
                <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter approved email (e.g. chief@police.gov)"
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlas-blue"
                />
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 flex items-center shadow-sm"
                >
                    <PlusCircleIcon className="h-5 w-5 mr-2"/>
                    Authorize Guest
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-2"></div>
                    Loading access list...
                </div>
            ) : (
                <div className="border rounded-lg overflow-hidden shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Authorized</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires At</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {guests.map((guest, idx) => {
                                const expiry = formatExpiration(guest.created_at);
                                return (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {guest.email}
                                            {expiry !== 'N/A' && expiry.isExpired && (
                                                <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">Expired</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {guest.created_at ? new Date(guest.created_at).toLocaleString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 flex items-center">
                                            <ClockIcon className="h-4 w-4 mr-1 text-gray-400"/>
                                            {typeof expiry === 'object' ? expiry.text : expiry}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleRemove(guest.email)}
                                                className="text-gray-400 hover:text-red-600 text-sm font-medium transition-colors inline-flex items-center"
                                                title="Revoke Access"
                                            >
                                                <TrashIcon className="h-5 w-5"/>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {guests.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 bg-gray-50">
                                        <div className="flex flex-col items-center justify-center">
                                            <ShieldCheckIcon className="h-10 w-10 text-gray-300 mb-2"/>
                                            <p>No guests are currently authorized.</p>
                                            <p className="text-xs mt-1">Add an email above to grant 24-hour access.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default GuestAccessManager;
