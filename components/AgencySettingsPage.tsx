import React, { useState, useEffect } from 'react';
import Header from './Header.tsx';
import CollapsibleSection from './CollapsibleSection.tsx';
import { getAgencies } from '../services/agencyService.ts';
import type { Agency } from '../types.ts';
import { ClipboardListIcon, PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon, PlusCircleIcon, ShieldExclamationIcon } from './IconComponents.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';

interface EditableListProps {
    title: string;
    description: string;
    items: string[];
    onUpdate: (newItems: string[]) => void;
}

const EditableList: React.FC<EditableListProps> = ({ title, description, items, onUpdate }) => {
    const [listItems, setListItems] = useState<string[]>(items);
    const [newItem, setNewItem] = useState('');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingText, setEditingText] = useState('');

    const handleAddItem = () => {
        if (newItem.trim() && !listItems.includes(newItem.trim())) {
            const updatedItems = [...listItems, newItem.trim()];
            setListItems(updatedItems);
            onUpdate(updatedItems);
            setNewItem('');
        }
    };

    const handleRemoveItem = (index: number) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            const updatedItems = listItems.filter((_, i) => i !== index);
            setListItems(updatedItems);
            onUpdate(updatedItems);
        }
    };

    const handleStartEditing = (index: number, text: string) => {
        setEditingIndex(index);
        setEditingText(text);
    };

    const handleCancelEditing = () => {
        setEditingIndex(null);
        setEditingText('');
    };

    const handleSaveEditing = (index: number) => {
        if (editingText.trim()) {
            const updatedItems = [...listItems];
            updatedItems[index] = editingText.trim();
            setListItems(updatedItems);
            onUpdate(updatedItems);
            handleCancelEditing();
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">{description}</p>
            <div className="flex space-x-2 mb-4">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add new item..."
                    className="flex-grow px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-atlas-blue text-gray-900"
                />
                <button
                    onClick={handleAddItem}
                    className="px-4 py-2 bg-atlas-blue text-white font-semibold rounded-md hover:bg-blue-700"
                >
                    Add
                </button>
            </div>
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {listItems.map((item, index) => (
                    <li key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                        {editingIndex === index ? (
                            <input
                                type="text"
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                className="flex-grow px-2 py-1 border border-atlas-blue rounded-md text-gray-900"
                                autoFocus
                            />
                        ) : (
                            <span className="text-gray-700">{item}</span>
                        )}
                        <div className="flex items-center space-x-2">
                            {editingIndex === index ? (
                                <>
                                    <button onClick={() => handleSaveEditing(index)} className="text-green-500 hover:text-green-700"><CheckCircleIcon className="h-5 w-5"/></button>
                                    <button onClick={handleCancelEditing} className="text-red-500 hover:text-red-700"><XCircleIcon className="h-5 w-5"/></button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleStartEditing(index, item)} className="text-gray-400 hover:text-atlas-blue"><PencilIcon className="h-5 w-5"/></button>
                                    <button onClick={() => handleRemoveItem(index)} className="text-gray-400 hover:text-red-500"><TrashIcon className="h-5 w-5"/></button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const KpiList: React.FC<{ kpis: string[], onUpdate: (newKpis: string[]) => void }> = ({ kpis, onUpdate }) => {
    // This is a simplified version of EditableList for inline use
    const [listItems, setListItems] = useState(kpis);
    const [newItem, setNewItem] = useState('');

    const handleAddItem = () => {
        if (newItem.trim() && !listItems.includes(newItem.trim())) {
            const updated = [...listItems, newItem.trim()];
            setListItems(updated);
            onUpdate(updated);
            setNewItem('');
        }
    };
    
    const handleRemoveItem = (index: number) => {
        const updated = listItems.filter((_, i) => i !== index);
        setListItems(updated);
        onUpdate(updated);
    };

    return (
        <div className="bg-gray-50 p-4 rounded-b-lg">
             <ul className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-2">
                {listItems.map((kpi, index) => (
                    <li key={index} className="flex items-center justify-between p-2 text-sm rounded-md bg-white">
                        <span className="text-gray-700">{kpi}</span>
                        <button onClick={() => handleRemoveItem(index)} className="text-gray-400 hover:text-red-500"><TrashIcon className="h-4 w-4"/></button>
                    </li>
                ))}
                {listItems.length === 0 && <p className="text-sm text-gray-500 text-center">No KPIs defined for this type.</p>}
            </ul>
             <div className="flex space-x-2">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add a new KPI..."
                    className="flex-grow px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-atlas-blue text-sm text-gray-900"
                />
                <button onClick={handleAddItem} className="px-3 py-1.5 bg-blue-500 text-white text-sm font-semibold rounded-md hover:bg-blue-600">Add KPI</button>
            </div>
        </div>
    );
};


const AgencySettingsPage: React.FC = () => {
    const { currentUser: user, showConfirmation, resetSystem } = useAppContext();
    const [agency, setAgency] = useState<Agency | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [newIncidentType, setNewIncidentType] = useState('');

    useEffect(() => {
        if (!user) return;
        const loadAgencyData = async () => {
            setIsLoading(true);
            try {
                const allAgencies = await getAgencies();
                const currentAgency = allAgencies.find(a => a.name === user.agency);
                setAgency(currentAgency || null);
            } catch (error) {
                console.error("Failed to load agency data", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadAgencyData();
    }, [user]);

    const handleUpdate = (updatedAgency: Agency) => {
        setAgency(updatedAgency);
        // Here you would typically call a service to save the updated agency data
        console.log("Saving updated agency:", updatedAgency);
    };

    const handleAddIncidentType = () => {
        if (newIncidentType.trim() && agency && !agency.customIncidentTypes?.includes(newIncidentType.trim())) {
            const updatedAgency = {
                ...agency,
                customIncidentTypes: [...(agency.customIncidentTypes || []), newIncidentType.trim()],
                customKpis: {
                    ...(agency.customKpis || {}),
                    [newIncidentType.trim()]: []
                }
            };
            handleUpdate(updatedAgency);
            setNewIncidentType('');
        }
    };

    const handleDeleteIncidentType = (typeToDelete: string) => {
        if (agency && window.confirm(`Are you sure you want to delete the "${typeToDelete}" incident type and all its associated KPIs?`)) {
            const updatedTypes = (agency.customIncidentTypes || []).filter(t => t !== typeToDelete);
            const updatedKpis = { ...(agency.customKpis || {}) };
            delete updatedKpis[typeToDelete];

            const updatedAgency = {
                ...agency,
                customIncidentTypes: updatedTypes,
                customKpis: updatedKpis,
            };
            handleUpdate(updatedAgency);
        }
    };
    
    const handleUpdateKpis = (incidentType: string, newKpis: string[]) => {
        if (agency) {
            const updatedAgency = {
                ...agency,
                customKpis: {
                    ...(agency.customKpis || {}),
                    [incidentType]: newKpis
                }
            };
            handleUpdate(updatedAgency);
        }
    };
    
    const handleResetSystem = () => {
        showConfirmation({
            title: 'Reset System Data?',
            message: 'WARNING: This will delete ALL local changes and restore the original mock data. This action cannot be undone. Use this to reset the demo environment.',
            onConfirm: async () => {
                await resetSystem();
            },
        });
    };
    
    if (isLoading) {
        return <div className="p-8"><div className="w-12 h-12 border-4 border-atlas-blue border-dashed rounded-full animate-spin"></div></div>;
    }

    if (!agency) {
        return <div className="p-8"><Header title="Agency Settings" /><p className="mt-4">Could not load agency data.</p></div>;
    }

    return (
        <div className="p-8 space-y-8">
            <Header title="Agency Settings" />
             <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                    <ClipboardListIcon className="h-6 w-6 text-atlas-blue mr-3"/>
                    <div>
                        <h2 className="font-semibold text-gray-800">Customize Your Agency's Forms</h2>
                        <p className="text-sm text-gray-600">
                            Manage the options available in dropdowns and selection lists within the BWC Analysis forms. 
                            Changes made here will apply to all new reports created by supervisors in your agency.
                        </p>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                {/* Incident Types & KPIs Manager */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                     <h3 className="text-lg font-semibold text-gray-800">Incident Types & KPIs</h3>
                    <p className="text-sm text-gray-500 mt-1 mb-4">Define Incident Types, then add the specific Key Performance Indicators (KPIs) for each type.</p>
                     <div className="flex space-x-2 mb-6">
                        <input
                            type="text"
                            value={newIncidentType}
                            onChange={(e) => setNewIncidentType(e.target.value)}
                            placeholder="Add new incident type..."
                            className="flex-grow px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-atlas-blue text-gray-900"
                        />
                        <button
                            onClick={handleAddIncidentType}
                            className="inline-flex items-center px-4 py-2 bg-atlas-blue text-white font-semibold rounded-md hover:bg-blue-700"
                        >
                           <PlusCircleIcon className="h-5 w-5 mr-2"/> Add Type
                        </button>
                    </div>
                    
                    <div className="space-y-2">
                        {(agency.customIncidentTypes || []).map((type) => (
                             <div key={type} className="border border-gray-200 rounded-lg">
                                <div className="w-full flex justify-between items-center p-3 text-left bg-gray-50 rounded-t-lg">
                                    <h4 className="font-semibold text-gray-800">{type}</h4>
                                     <div className="flex items-center space-x-3">
                                        <button onClick={() => handleDeleteIncidentType(type)} className="text-gray-400 hover:text-red-500"><TrashIcon className="h-5 w-5"/></button>
                                     </div>
                                </div>
                                <KpiList 
                                    kpis={agency.customKpis?.[type] || []}
                                    onUpdate={(newKpis) => handleUpdateKpis(type, newKpis)}
                                />
                             </div>
                        ))}
                    </div>
                </div>
                
                <EditableList 
                    title="Officer Safety Items"
                    description="Customize the list of officer safety items for BWC reviews."
                    items={agency.customSafetyItems || []}
                    onUpdate={(newItems) => handleUpdate({ ...agency, customSafetyItems: newItems })}
                />
                 <EditableList 
                    title="Dispositions"
                    description="Manage the possible dispositions or outcomes for an incident."
                    items={agency.customDispositions || []}
                    onUpdate={(newItems) => handleUpdate({ ...agency, customDispositions: newItems })}
                />
                
                <div className="bg-red-50 p-6 rounded-lg border border-red-200 mt-8">
                    <h3 className="text-lg font-semibold text-red-800 flex items-center"><ShieldExclamationIcon className="h-5 w-5 mr-2"/> Demo Controls</h3>
                    <p className="text-sm text-red-600 mt-2">
                        Reset the system to its original state. This will delete all new reports, users, and settings created during the demo session.
                    </p>
                    <button 
                        onClick={handleResetSystem}
                        className="mt-4 px-4 py-2 bg-white border border-red-300 text-red-600 font-semibold rounded-md hover:bg-red-100"
                    >
                        Reset System Data (Factory Reset)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgencySettingsPage;