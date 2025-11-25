
import React, { useState, useMemo } from 'react';
import Header from './Header.tsx';
import UserList from './UserList.tsx';
import AddUserModal from './AddUserModal.tsx';
import ResetPasswordModal from './ResetPasswordModal.tsx';
import GuestAccessManager from './GuestAccessManager.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import type { User } from '../types.ts';
import { UsersIcon, ShieldCheckIcon } from './IconComponents.tsx';

const UserManagementPage: React.FC = () => {
    const { currentUser, users, addUser, updateUser, toggleUserStatus, resetUserPassword } = useAppContext();
    const [activeTab, setActiveTab] = useState<'users' | 'guests'>('users');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [resettingPasswordFor, setResettingPasswordFor] = useState<{ user: User, tempPass: string } | null>(null);

    const filteredUsers = useMemo(() => {
        if (!currentUser) return [];
        if (currentUser.role === 'Super Admin') return users;
        return users.filter(u => u.agency === currentUser.agency);
    }, [currentUser, users]);

    const handleOpenAddModal = () => {
        setEditingUser(null);
        setIsAddModalOpen(true);
    };

    const handleOpenEditModal = (user: User) => {
        setEditingUser(user);
        setIsAddModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setEditingUser(null);
    };

    const handleSaveUser = async (userData: any) => {
        if (editingUser) {
            await updateUser(editingUser.id, userData);
        } else {
            const result = await addUser(userData);
            if (result) {
                setResettingPasswordFor({ user: result.user, tempPass: result.tempPass });
            }
        }
        handleCloseModal();
    };

    const handleResetPassword = async (user: User) => {
        const result = await resetUserPassword(user.id);
        if (result) {
            setResettingPasswordFor({ user, tempPass: result.tempPass });
        }
    };

    if (!currentUser) return null;

    return (
        <div className="p-8 space-y-8">
            <Header title="User Management" />
            
            <div className="flex space-x-4 border-b border-gray-200 pb-1">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`pb-3 px-4 font-medium text-sm flex items-center ${
                        activeTab === 'users' 
                        ? 'border-b-2 border-atlas-blue text-atlas-blue' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <UsersIcon className="h-5 w-5 mr-2"/>
                    System Users
                </button>
                {currentUser.role === 'Super Admin' && (
                    <button
                        onClick={() => setActiveTab('guests')}
                        className={`pb-3 px-4 font-medium text-sm flex items-center ${
                            activeTab === 'guests' 
                            ? 'border-b-2 border-atlas-blue text-atlas-blue' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <ShieldCheckIcon className="h-5 w-5 mr-2"/>
                        Guest Access Control
                    </button>
                )}
            </div>

            {activeTab === 'users' ? (
                <>
                    <div className="flex justify-end">
                        <button 
                            onClick={handleOpenAddModal}
                            className="inline-flex items-center px-4 py-2 bg-atlas-blue text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <UsersIcon className="h-5 w-5 mr-2" />
                            + Add New User
                        </button>
                    </div>

                    <UserList
                        users={filteredUsers}
                        currentUser={currentUser}
                        onEdit={handleOpenEditModal}
                        onToggleStatus={toggleUserStatus}
                        onResetPassword={handleResetPassword}
                    />
                </>
            ) : (
                <GuestAccessManager />
            )}

            {isAddModalOpen && (
                <AddUserModal
                    isOpen={isAddModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveUser}
                    userToEdit={editingUser}
                />
            )}
            
            {resettingPasswordFor && (
                <ResetPasswordModal
                    user={resettingPasswordFor.user}
                    tempPass={resettingPasswordFor.tempPass}
                    onClose={() => setResettingPasswordFor(null)}
                />
            )}
        </div>
    );
};

export default UserManagementPage;
