import React, { useState, useEffect } from 'react';
import type { PerformanceImprovementPlan, PipImprovementArea, PipObjective, PipCheckIn, Officer } from '../types.ts';
import { getOfficers } from '../services/officerService.ts';
import CollapsibleSection from './CollapsibleSection.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { 
    CloseIcon, 
    DocumentTextIcon, 
    PlusCircleIcon, 
    TrashIcon,
    CheckCircleIcon,
    AcademicCapIcon,
    UserCircleIcon,
    PencilAltIcon,
    BullseyeIcon,
    ClockIcon,
    PencilIcon,
} from './IconComponents.tsx';

interface NewPipModalProps {
    onClose: () => void;
    onSave: (pipData: Omit<PerformanceImprovementPlan, 'id'>) => void;
    pip?: PerformanceImprovementPlan;
}

const getInitialFormData = (officer: Officer): Omit<PerformanceImprovementPlan, 'id'> => ({
    officer: officer,
    supervisor: 'Sgt. Miller (Current User)', // Placeholder
    agency: officer.agency,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'Draft',
    reason: {
        summary: 'This Performance Improvement Plan is initiated to address performance areas identified during routine or incident-specific BWC reviews. The purpose is to support the officer in aligning their actions with departmental KPIs, legal standards, and operational protocols to ensure consistent, professional, and policy-compliant behavior.',
        areas: [{ id: Date.now(), area: '', description: '', relatedKpis: '', examples: '' }],
    },
    objectives: [{ id: Date.now(), objective: '', expectedOutcome: '', successMetrics: '', deadline: '' }],
    supportAndResources: { trainingModules: '', mentorship: '', rideAlongs: '', resourceAccess: '' },
    checkIns: [],
    finalEvaluation: {
        improvementAchieved: null,
        remainingConcerns: '',
        recommendations: { removeFromPip: false, extendPip: false, additionalTraining: false, furtherReview: false },
    },
    signatures: { officerSignature: '', officerDate: '', supervisorSignature: '', supervisorDate: '' },
});


const NewPipModal: React.FC<NewPipModalProps> = ({ onClose, onSave, pip }) => {
    const { currentUser: user } = useAppContext();
    const isEditing = !!pip;
    const [officers, setOfficers] = useState<Officer[]>([]);
    const [formData, setFormData] = useState<Omit<PerformanceImprovementPlan, 'id'> | null>(null);

    useEffect(() => {
        if (!user) return;
        getOfficers().then(data => {
            let agencyOfficers: Officer[];
            if (user.role === 'Super Admin') {
                agencyOfficers = data;
            } else if (user.agency) {
                agencyOfficers = data.filter(o => o.agency === user.agency);
            } else {
                agencyOfficers = [];
            }
            setOfficers(agencyOfficers);
            if (pip) {
                setFormData(pip);
            } else if (agencyOfficers.length > 0) {
                setFormData(getInitialFormData(agencyOfficers[0]));
            }
        });
    }, [pip, user]);

    const handleNestedChange = (path: string, value: any) => {
        setFormData(prev => {
            if (!prev) return null;
            const keys = path.split('.');
            const newState = { ...prev };
            let current: any = newState;
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newState;
        });
    };

    const handleDynamicListChange = (listName: 'areas' | 'objectives' | 'checkIns', index: number, field: string, value: string) => {
        setFormData(prev => {
            if (!prev) return null;
            const listKey = listName === 'areas' ? 'reason' : listName;
            const list = listName === 'areas' ? prev.reason.areas : (listName === 'objectives' ? prev.objectives : prev.checkIns);
            
            const newList = [...list];
            newList[index] = { ...newList[index], [field]: value };

            if (listName === 'areas') {
                return { ...prev, reason: { ...prev.reason, areas: newList as PipImprovementArea[] }};
            }
            return { ...prev, [listKey]: newList };
        });
    };

    const addDynamicListItem = (listName: 'areas' | 'objectives' | 'checkIns') => {
        setFormData(prev => {
            if (!prev) return null;
            if (listName === 'areas') {
                const newArea = { id: Date.now(), area: '', description: '', relatedKpis: '', examples: '' };
                return { ...prev, reason: { ...prev.reason, areas: [...prev.reason.areas, newArea] } };
            }
            if (listName === 'objectives') {
                const newObjective = { id: Date.now(), objective: '', expectedOutcome: '', successMetrics: '', deadline: '' };
                return { ...prev, objectives: [...prev.objectives, newObjective] };
            }
            if (listName === 'checkIns') {
                const newCheckIn = { id: Date.now(), date: new Date().toISOString().split('T')[0], method: 'In-Person' as const, topics: '', notes: '' };
                return { ...prev, checkIns: [...prev.checkIns, newCheckIn] };
            }
            return prev;
        });
    };
    
    const removeDynamicListItem = (listName: 'areas' | 'objectives' | 'checkIns', id: number) => {
         setFormData(prev => {
            if (!prev) return null;
            if (listName === 'areas') {
                return { ...prev, reason: { ...prev.reason, areas: prev.reason.areas.filter(item => item.id !== id) } };
            }
            if (listName === 'objectives') {
                return { ...prev, objectives: prev.objectives.filter(item => item.id !== id) };
            }
            if (listName === 'checkIns') {
                return { ...prev, checkIns: prev.checkIns.filter(item => item.id !== id) };
            }
            return prev;
        });
    };

    const handleOfficerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOfficer = officers.find(o => o.id === e.target.value);
        if (selectedOfficer) {
            handleNestedChange('officer', selectedOfficer);
        }
    };

    const handleSubmit = () => {
        if(formData) onSave(formData);
    };

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-atlas-blue focus:border-atlas-blue sm:text-sm text-gray-900";

    if (!formData || !user) {
        return <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"><div className="w-12 h-12 border-4 border-atlas-blue border-dashed rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[95vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b sticky top-0 bg-white z-10">
                    <div className="flex justify-between items-center"><h2 className="text-xl font-semibold text-gray-800">{isEditing ? 'Edit' : 'New'} Performance Improvement Plan</h2><button onClick={onClose}><CloseIcon className="h-6 w-6" /></button></div>
                </div>
                
                <div className="p-8 space-y-4 overflow-y-auto">
                    <CollapsibleSection title="1. Officer Information" icon={<UserCircleIcon className="h-5 w-5"/>} defaultOpen>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div><label className="text-sm">Name</label><select value={formData.officer.id} onChange={handleOfficerChange} className={inputStyle}>{officers.map(o => <option key={o.id} value={o.id}>{o.lastName}, {o.firstName}</option>)}</select></div>
                            <div><label className="text-sm">Badge Number</label><input type="text" value={formData.officer.badgeNumber} className={`${inputStyle} bg-gray-100`} readOnly /></div>
                            <div><label className="text-sm">Position/Assignment</label><input type="text" value={formData.officer.rank} className={`${inputStyle} bg-gray-100`} readOnly /></div>
                            <div><label className="text-sm">Supervisor</label><input type="text" value={formData.supervisor} className={`${inputStyle} bg-gray-100`} readOnly /></div>
                            <div><label className="text-sm">PIP Start Date</label><input type="date" value={formData.startDate} onChange={e => handleNestedChange('startDate', e.target.value)} className={inputStyle} /></div>
                            <div><label className="text-sm">PIP End Date</label><input type="date" value={formData.endDate} onChange={e => handleNestedChange('endDate', e.target.value)} className={inputStyle} /></div>
                        </div>
                    </CollapsibleSection>
                     <CollapsibleSection title="2. Purpose of the PIP" icon={<DocumentTextIcon className="h-5 w-5"/>}><p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{formData.reason.summary}</p></CollapsibleSection>

                    <CollapsibleSection title="3. Performance Areas Requiring Improvement" icon={<PencilAltIcon className="h-5 w-5"/>} defaultOpen>
                        {formData.reason.areas.map((area, index) => (
                            <div key={area.id} className="p-4 border rounded-lg space-y-2 relative bg-gray-50 mb-4">
                                <button type="button" onClick={() => removeDynamicListItem('areas', area.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><TrashIcon className="h-5 w-5"/></button>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-sm">Area of Improvement</label><input type="text" value={area.area} onChange={e => handleDynamicListChange('areas', index, 'area', e.target.value)} className={inputStyle}/></div>
                                    <div><label className="text-sm">Related KPI(s)</label><input type="text" value={area.relatedKpis} onChange={e => handleDynamicListChange('areas', index, 'relatedKpis', e.target.value)} className={inputStyle}/></div>
                                    <div className="col-span-2"><label className="text-sm">Description</label><textarea value={area.description} onChange={e => handleDynamicListChange('areas', index, 'description', e.target.value)} rows={2} className={inputStyle}></textarea></div>
                                    <div className="col-span-2"><label className="text-sm">Example(s) from BWC Review</label><input type="text" value={area.examples} onChange={e => handleDynamicListChange('areas', index, 'examples', e.target.value)} className={inputStyle}/></div>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={() => addDynamicListItem('areas')} className="text-sm text-atlas-blue mt-2">+ Add Area</button>
                    </CollapsibleSection>

                    <CollapsibleSection title="4. Performance Objectives & Metrics" icon={<BullseyeIcon className="h-5 w-5"/>} defaultOpen>
                        {formData.objectives.map((obj, index) => (
                            <div key={obj.id} className="p-4 border rounded-lg space-y-2 relative bg-gray-50 mb-4">
                                <button type="button" onClick={() => removeDynamicListItem('objectives', obj.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><TrashIcon className="h-5 w-5"/></button>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2"><label className="text-sm">Objective</label><textarea value={obj.objective} onChange={e => handleDynamicListChange('objectives', index, 'objective', e.target.value)} rows={2} className={inputStyle}></textarea></div>
                                    <div className="col-span-2"><label className="text-sm">Expected Outcome</label><textarea value={obj.expectedOutcome} onChange={e => handleDynamicListChange('objectives', index, 'expectedOutcome', e.target.value)} rows={2} className={inputStyle}></textarea></div>
                                    <div><label className="text-sm">Success Metrics</label><input type="text" value={obj.successMetrics} onChange={e => handleDynamicListChange('objectives', index, 'successMetrics', e.target.value)} className={inputStyle}/></div>
                                    <div><label className="text-sm">Deadline</label><input type="date" value={obj.deadline} onChange={e => handleDynamicListChange('objectives', index, 'deadline', e.target.value)} className={inputStyle}/></div>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={() => addDynamicListItem('objectives')} className="text-sm text-atlas-blue mt-2">+ Add Objective</button>
                    </CollapsibleSection>

                    <CollapsibleSection title="5. Support, Resources & Interventions" icon={<AcademicCapIcon className="h-5 w-5"/>}>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="text-sm">Training Modules Assigned</label><textarea value={formData.supportAndResources.trainingModules} onChange={e => handleNestedChange('supportAndResources.trainingModules', e.target.value)} rows={2} className={inputStyle}></textarea></div>
                            <div><label className="text-sm">Mentorship/Coaching</label><textarea value={formData.supportAndResources.mentorship} onChange={e => handleNestedChange('supportAndResources.mentorship', e.target.value)} rows={2} className={inputStyle}></textarea></div>
                            <div><label className="text-sm">Ride-Alongs / Shadowing Sessions</label><textarea value={formData.supportAndResources.rideAlongs} onChange={e => handleNestedChange('supportAndResources.rideAlongs', e.target.value)} rows={2} className={inputStyle}></textarea></div>
                            <div><label className="text-sm">Resource Access</label><textarea value={formData.supportAndResources.resourceAccess} onChange={e => handleNestedChange('supportAndResources.resourceAccess', e.target.value)} rows={2} className={inputStyle}></textarea></div>
                        </div>
                    </CollapsibleSection>
                    
                     <CollapsibleSection title="6. Monitoring & Check-In Schedule" icon={<ClockIcon className="h-5 w-5"/>}>
                         {formData.checkIns.map((checkIn, index) => (
                            <div key={checkIn.id} className="p-4 border rounded-lg space-y-2 relative bg-gray-50 mb-4">
                                <button type="button" onClick={() => removeDynamicListItem('checkIns', checkIn.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><TrashIcon className="h-5 w-5"/></button>
                                <div className="grid grid-cols-3 gap-4">
                                    <div><label className="text-sm">Check-In Date</label><input type="date" value={checkIn.date} onChange={e => handleDynamicListChange('checkIns', index, 'date', e.target.value)} className={inputStyle}/></div>
                                    <div className="col-span-2"><label className="text-sm">Method</label><select value={checkIn.method} onChange={e => handleDynamicListChange('checkIns', index, 'method', e.target.value)} className={inputStyle}><option>In-Person</option><option>Virtual</option></select></div>
                                    <div className="col-span-3"><label className="text-sm">Topics to Review</label><textarea value={checkIn.topics} onChange={e => handleDynamicListChange('checkIns', index, 'topics', e.target.value)} rows={2} className={inputStyle}></textarea></div>
                                    <div className="col-span-3"><label className="text-sm">Notes</label><textarea value={checkIn.notes} onChange={e => handleDynamicListChange('checkIns', index, 'notes', e.target.value)} rows={3} className={inputStyle}></textarea></div>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={() => addDynamicListItem('checkIns')} className="text-sm text-atlas-blue mt-2">+ Add Check-In</button>
                    </CollapsibleSection>

                    <CollapsibleSection title="7. Final Evaluation" icon={<CheckCircleIcon className="h-5 w-5"/>}>
                        <div><label className="text-sm">Was performance improvement achieved in all target areas?</label>
                            <div className="flex space-x-4 mt-1"><label><input type="radio" name="improvementAchieved" value="Yes" checked={formData.finalEvaluation.improvementAchieved === 'Yes'} onChange={e => handleNestedChange('finalEvaluation.improvementAchieved', e.target.value)}/> Yes</label><label><input type="radio" name="improvementAchieved" value="No" checked={formData.finalEvaluation.improvementAchieved === 'No'} onChange={e => handleNestedChange('finalEvaluation.improvementAchieved', e.target.value)}/> No</label></div>
                        </div>
                        <div><label className="text-sm">Remaining concerns (if any)</label><textarea value={formData.finalEvaluation.remainingConcerns} onChange={e => handleNestedChange('finalEvaluation.remainingConcerns', e.target.value)} rows={3} className={inputStyle}></textarea></div>
                        <div><label className="text-sm">Recommendations</label>
                             <div className="space-y-1 mt-1">
                                <label className="flex items-center"><input type="checkbox" checked={formData.finalEvaluation.recommendations.removeFromPip} onChange={e => handleNestedChange('finalEvaluation.recommendations.removeFromPip', e.target.checked)} className="mr-2"/> Remove from PIP</label>
                                <label className="flex items-center"><input type="checkbox" checked={formData.finalEvaluation.recommendations.extendPip} onChange={e => handleNestedChange('finalEvaluation.recommendations.extendPip', e.target.checked)} className="mr-2"/> Extend PIP</label>
                                <label className="flex items-center"><input type="checkbox" checked={formData.finalEvaluation.recommendations.additionalTraining} onChange={e => handleNestedChange('finalEvaluation.recommendations.additionalTraining', e.target.checked)} className="mr-2"/> Additional training required</label>
                                <label className="flex items-center"><input type="checkbox" checked={formData.finalEvaluation.recommendations.furtherReview} onChange={e => handleNestedChange('finalEvaluation.recommendations.furtherReview', e.target.checked)} className="mr-2"/> Further review needed</label>
                            </div>
                        </div>
                    </CollapsibleSection>

                     <CollapsibleSection title="8. Officer & Supervisor Acknowledgment" icon={<PencilIcon className="h-5 w-5"/>}>
                        <p className="text-xs text-gray-500 mb-4">I, {formData.officer.firstName} {formData.officer.lastName}, acknowledge receipt of this Performance Improvement Plan and understand its goals, expectations, and available supports.</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-sm">Officer Signature</label><input type="text" placeholder="Type name to sign..." value={formData.signatures.officerSignature} onChange={e => handleNestedChange('signatures.officerSignature', e.target.value)} className={inputStyle}/></div>
                             <div><label className="text-sm">Date</label><input type="date" value={formData.signatures.officerDate} onChange={e => handleNestedChange('signatures.officerDate', e.target.value)} className={inputStyle}/></div>
                            <div><label className="text-sm">Supervisor Signature</label><input type="text" placeholder="Type name to sign..." value={formData.signatures.supervisorSignature} onChange={e => handleNestedChange('signatures.supervisorSignature', e.target.value)} className={inputStyle}/></div>
                            <div><label className="text-sm">Date</label><input type="date" value={formData.signatures.supervisorDate} onChange={e => handleNestedChange('signatures.supervisorDate', e.target.value)} className={inputStyle}/></div>
                        </div>
                    </CollapsibleSection>
                </div>
                
                <div className="p-6 bg-gray-50 border-t sticky bottom-0 z-10">
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Cancel</button>
                        <button type="button" onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-atlas-blue rounded-md shadow-sm hover:bg-blue-700">{isEditing ? 'Save Changes' : 'Create PIP'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewPipModal;
