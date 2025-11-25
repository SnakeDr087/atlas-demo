
import React, { useState, useEffect } from 'react';
import Header from './Header';
import AgencyList from './AgencyList';
import AddAgencyModal from './AddAgencyModal';
import CredentialsCreatedModal from './CredentialsCreatedModal';
import type { Agency } from '../types';
import { BuildingIcon } from './IconComponents';
import { useAppContext } from '../contexts/AppContext';


const AgenciesPage: React.FC = () => {
    const { currentUser: user, agencies: allAgencies, addAgency, updateAgency, deleteAgency } = useAppContext();
    const [filteredAgencies, setFilteredAgencies] = useState<Agency[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [selectedAgency, setSelectedAgency] = useState<Agency | undefined>(undefined);
    const [newCredentials, setNewCredentials] = useState<{ username: string; password: string } | null>(null);

    useEffect(() => {
        if (!user) return;
        if (user.role === 'Super Admin') {
            setFilteredAgencies(allAgencies);
        } else if (user.agency) {
            setFilteredAgencies(allAgencies.filter(a => a.name === user.agency));
        } else {
            setFilteredAgencies([]);
        }
    }, [user, allAgencies]);

    const handleViewAgency = (agency: Agency) => {
        setSelectedAgency(agency);
        setIsReadOnly(true);
        setIsModalOpen(true);
    };
    
    const handleOpenModal = (agency?: Agency) => {
        setSelectedAgency(agency);
        setIsReadOnly(false);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAgency(undefined);
        setIsReadOnly(false);
    };

    const handleSaveAgency = async (agencyData: any) => {
        handleCloseModal();
        if ('id' in agencyData) {
            await updateAgency(agencyData);
        } else {
            const result = await addAgency(agencyData);
            if (result && result.credentials) {
                setNewCredentials(result.credentials);
            }
        }
    };
    
    if (!user) return null;

    return (
        <div className="p-8 space-y-8">
            <Header title="Agency Management" />
            
            <div className="flex justify-between items-center">
                <div>
                    <input 
                        type="text" 
                        placeholder="Search by agency name or ID..."
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlas-blue text-gray-900 placeholder-gray-400"
                    />
                </div>
                {user.role === 'Super Admin' && (
                    <button 
                        onClick={() => handleOpenModal()}
                        className="inline-flex items-center px-4 py-2 bg-atlas-blue text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        <BuildingIcon className="h-5 w-5 mr-2" />
                        + Add Agency
                    </button>
                )}
            </div>

            <AgencyList 
                agencies={filteredAgencies} 
                onEdit={handleOpenModal} 
                onDelete={deleteAgency} 
                onView={handleViewAgency}
                role={user.role} 
            />

            {isModalOpen && <AddAgencyModal onClose={handleCloseModal} onSave={handleSaveAgency} agency={selectedAgency} readOnly={isReadOnly} />}

            {newCredentials && (
                <CredentialsCreatedModal 
                    credentials={newCredentials}
                    onClose={() => setNewCredentials(null)}
                />
            )}
        </div>
    );
};

export default AgenciesPage;
