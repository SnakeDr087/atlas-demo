import React, { useState } from 'react';
import type { User } from '../types.ts';
import { UsersIcon, CloseIcon } from './IconComponents.tsx';

interface RoleSwitcherProps {
    currentUser: User;
    users: User[];
    onSwitchUser: (userId: string) => void;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentUser, users, onSwitchUser }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Group users by role for cleaner display
    const groupedUsers = users.reduce((acc, user) => {
        const role = user.role;
        if (!acc[role]) acc[role] = [];
        acc[role].push(user);
        return acc;
    }, {} as Record<string, User[]>);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 left-8 bg-gray-800 text-white rounded-full p-3 shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-transform z-[60]"
                aria-label="Switch user role"
                title="Dev Tool: Switch User Role"
            >
                <UsersIcon className="h-6 w-6" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-8 left-8 bg-white rounded-lg shadow-2xl w-80 z-[60] border border-gray-200 overflow-hidden">
            <div className="p-3 bg-gray-800 text-white flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-sm">Role Switcher (Dev Tool)</h3>
                    <p className="text-xs text-gray-300">Instant login as any user</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                    <CloseIcon className="h-5 w-5" />
                </button>
            </div>
            <div className="p-2 max-h-[400px] overflow-y-auto">
                {Object.entries(groupedUsers).map(([role, roleUsers]) => (
                    <div key={role} className="mb-3 last:mb-0">
                        <h4 className="px-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{role}</h4>
                        <div className="space-y-1">
                            {(roleUsers as User[]).map(user => (
                                <button
                                    key={user.id}
                                    onClick={() => {
                                        onSwitchUser(user.id);
                                        setIsOpen(false);
                                    }}
                                    disabled={currentUser.id === user.id}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center ${
                                        currentUser.id === user.id
                                            ? 'bg-blue-50 text-blue-700 border border-blue-200 cursor-default'
                                            : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    <div>
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate max-w-[180px]">{user.agency || 'System'}</p>
                                    </div>
                                    {currentUser.id === user.id && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoleSwitcher;