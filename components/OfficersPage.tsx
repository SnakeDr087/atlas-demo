
import React, { useState, useEffect } from 'react';
import Header from './Header';
import OfficerList from './OfficerList';
import AddOfficerModal from './AddOfficerModal';
import type { Officer } from '../types';
import { UsersIcon } from './IconComponents';
import { useAppContext } from '../contexts/AppContext';

const OfficersPage: React.FC = () => {
    const { currentUser: user, officers: allOfficers, addOfficer, updateOfficer, deleteOfficer } = useAppContext();
    const [filteredOfficers, setFilteredOfficers] = useState<Officer[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOfficer, setSelectedOfficer] = useState<Officer | undefined>(undefined);

    useEffect(() => {
        if (!user) return;
        if (user.role === 'Super Admin') {
            setFilteredOfficers(allOfficers);
        } else if (user.agency) {
            setFilteredOfficers(allOfficers.filter(o => o.agency === user.agency));
        } else {
            setFilteredOfficers([]);
        }
    }, [user, allOfficers]);

    const handleOpenModal = (officer?: Officer) => {
        setSelectedOfficer(officer);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOfficer(undefined);
    };
    
    const handleSaveOfficer = async (officerData: Omit<Officer, 'id'> | Officer) => {
        handleCloseModal();
        try {
            if ('id' in officerData) {
                await updateOfficer(officerData);
            } else {
                await addOfficer(officerData as Omit<Officer, 'id' | 'incidents' | 'score'>);
            }
        } catch (error) {
            console.error("Failed to save officer", error);
        }
    };
    
    if (!user) return null;

    return (
        <div className="p-8 space-y-8">
            <Header title="Officer Management" />
            
             <div className="flex justify-between items-center">
                <div>
                    <input 
                        type="text" 
                        placeholder="Search by officer name or badge #..."
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlas-blue text-gray-900 placeholder-gray-400"
                    />
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center px-4 py-2 bg-atlas-blue text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    <UsersIcon className="h-5 w-5 mr-2" />
                    + Add Officer
                </button>
            </div>

            <OfficerList 
                officers={filteredOfficers} 
                onEdit={handleOpenModal} 
                onDelete={deleteOfficer} 
            />

            {isModalOpen && <AddOfficerModal onClose={handleCloseModal} onSave={handleSaveOfficer} officer={selectedOfficer} />}
        </div>
    );
};

export default OfficersPage;
