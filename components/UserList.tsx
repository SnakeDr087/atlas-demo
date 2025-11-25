import React from 'react';
import type { User } from '../types.ts';
import { PencilIcon, ShieldExclamationIcon, ShieldCheckIcon } from './IconComponents.tsx';

interface UserListProps {
    users: User[];
    currentUser: User;
    onEdit: (user: User) => void;
    onToggleStatus: (userId: string) => void;
    onResetPassword: (user: User) => void;
}

const statusColors: { [key: string]: string } = {
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-gray-100 text-gray-800',
};

const roleColors: { [key: string]: string } = {
    'Super Admin': 'bg-purple-100 text-purple-800',
    'Agency Admin': 'bg-blue-100 text-blue-800',
    'Agency Supervisor': 'bg-yellow-100 text-yellow-800',
    'Officer': 'bg-gray-100 text-gray-800',
};

const UserList: React.FC<UserListProps> = ({ users, currentUser, onEdit, onToggleStatus, onResetPassword }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agency</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.id}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColors[user.role]}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.agency || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[user.status]}`}>
                                    {user.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-4">
                                    <button onClick={() => onEdit(user)} className="text-gray-400 hover:text-atlas-blue" title="Edit User"><PencilIcon className="h-5 w-5"/></button>
                                    <button onClick={() => onToggleStatus(user.id)} className={`text-gray-400 ${user.status === 'Active' ? 'hover:text-red-500' : 'hover:text-green-500'}`} title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}>
                                        {user.status === 'Active' ? <ShieldExclamationIcon className="h-5 w-5"/> : <ShieldCheckIcon className="h-5 w-5"/>}
                                    </button>
                                    <button onClick={() => onResetPassword(user)} className="text-gray-400 hover:text-yellow-500" title="Reset Password">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v-2.25L10.875 13.5c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;