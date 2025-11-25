import React, { useState, useEffect } from 'react';
import Header from './Header.tsx';
import PipList from './PipList.tsx';
import NewPipModal from './NewPipModal.tsx';
import { PipIcon } from './IconComponents.tsx';
import type { PerformanceImprovementPlan } from '../types.ts';
import { useAppContext } from '../contexts/AppContext.tsx';

const PipPage: React.FC = () => {
    const { currentUser: user, pips: allPips, addPip, updatePip, deletePip } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPip, setSelectedPip] = useState<PerformanceImprovementPlan | undefined>(undefined);
    const [filteredPips, setFilteredPips] = useState<PerformanceImprovementPlan[]>([]);
    
    useEffect(() => {
        if (!user) return;
        if (user.role === 'Super Admin') {
            setFilteredPips(allPips);
        } else if (user.agency) {
            const agencyPips = allPips.filter(p => p.agency === user.agency);
            if (user.role === 'Officer') {
                setFilteredPips(agencyPips.filter(p => p.officer.id === user.id));
            } else {
                setFilteredPips(agencyPips);
            }
        } else {
            setFilteredPips([]);
        }
    }, [user, allPips]);

    const handleOpenModal = (pip?: PerformanceImprovementPlan) => {
        setSelectedPip(pip);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPip(undefined);
    };

    const handleSavePip = async (pipData: Omit<PerformanceImprovementPlan, 'id'> | PerformanceImprovementPlan) => {
        if ('id' in pipData) {
            await updatePip(pipData);
        } else {
            await addPip(pipData);
        }
        handleCloseModal();
    };

    if (!user) return null;

    return (
        <div className="p-8 space-y-8">
            <Header title="Performance Improvement Plan (PIP)" />

            <div className="flex justify-between items-center">
                <div>
                    <input 
                        type="text" 
                        placeholder="Search by officer or status..."
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlas-blue text-gray-900 placeholder-gray-400"
                    />
                </div>
                 {(user.role === 'Agency Supervisor' || user.role === 'Agency Admin') && (
                    <button 
                        onClick={() => handleOpenModal()}
                        className="inline-flex items-center px-4 py-2 bg-atlas-blue text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        <PipIcon className="h-5 w-5 mr-2" />
                        + New PIP
                    </button>
                )}
            </div>
            
            <PipList pips={filteredPips} onEdit={handleOpenModal} onDelete={deletePip} role={user.role} />

            {isModalOpen && <NewPipModal onClose={handleCloseModal} onSave={handleSavePip} pip={selectedPip} />}
        </div>
    );
};

export default PipPage;