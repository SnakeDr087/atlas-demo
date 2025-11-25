import React, { useState, useEffect } from 'react';
import { 
    CloseIcon, 
    DocumentTextIcon,
    UserCircleIcon,
    VideoCameraIcon,
    ShieldCheckIcon,
    AcademicCapIcon,
    CheckCircleIcon,
    PencilAltIcon,
} from './IconComponents.tsx';
import CollapsibleSection from './CollapsibleSection.tsx';
import type { InPersonReview, Officer } from '../types.ts';
import { getOfficers } from '../services/officerService.ts';
import { useAppContext } from '../contexts/AppContext.tsx';

interface CreateReviewRecordModalProps {
    onClose: () => void;
    onSave: (reviewData: Omit<InPersonReview, 'id'> | InPersonReview) => void;
    review?: InPersonReview;
}

const outcomeCategories = {
    coaching: 'Coaching',
    commendation: 'Commendation Nomination',
    informational: 'Informational Only',
    referralToTraining: 'Referral to Training',
    referralToPolicy: 'Referral to Policy Team',
    followUpRequired: 'Follow-up Required',
};
type OutcomeCategoryKey = keyof typeof outcomeCategories;

const policyAlignmentOptions: (keyof NonNullable<InPersonReview['policyAlignment']>)[] = [
    'useOfForce', 'bwcActivation', 'communication', 'deescalation', 'searchAndSeizure'
];
const policyLabels: Record<string, string> = {
    useOfForce: 'Use of Force',
    bwcActivation: 'BWC Activation',
    communication: 'Communication',
    deescalation: 'De-escalation',
    searchAndSeizure: 'Search & Seizure'
};

const getInitialFormData = (review?: InPersonReview, officers: Officer[] = []): Omit<InPersonReview, 'id'> => {
    if (review) return {
        ...review,
        officer: review.officer || officers[0],
        status: 'Completed', // When this modal is opened, we assume completion
    };

    const defaultOfficer = officers[0] || null;

    return {
        caseNumber: '',
        officer: defaultOfficer,
        reviewDate: new Date().toISOString().split('T')[0],
        reviewTime: '',
        reviewLocation: '',
        bwcFootageDate: '',
        reviewer: 'Sgt. Miller',
        status: 'Completed',
        reviewPurpose: { purpose: '', statement: '' },
        officerReflection: { summary: '', challenge: '', alternatives: '' },
        supervisorReview: { keyMoments: '' },
        policyAlignment: { useOfForce: 'N/A', bwcActivation: 'N/A', communication: 'N/A', deescalation: 'N/A', searchAndSeizure: 'N/A', observations: '' },
        problemSolving: { trainingComparison: '', supportNeeded: '' },
        reviewOutcome: {
            categories: { coaching: false, commendation: false, informational: false, referralToTraining: false, referralToPolicy: false, followUpRequired: false },
            explanation: ''
        },
        acknowledgement: { officerPresent: true, supervisorSignature: 'Sgt. Miller' }
    };
};


const CreateReviewRecordModal: React.FC<CreateReviewRecordModalProps> = ({ onClose, onSave, review }) => {
    const { currentUser: user } = useAppContext();
    const isEditing = !!review;
    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-atlas-blue focus:border-atlas-blue sm:text-sm text-gray-900 placeholder-gray-400";
    
    const [officers, setOfficers] = useState<Officer[]>([]);
    const [formData, setFormData] = useState<Omit<InPersonReview, 'id'>>(() => getInitialFormData(review, officers));

    useEffect(() => {
        if (!user) return;
        getOfficers().then(officerData => {
            let agencyOfficers: Officer[];
            if (user.role === 'Super Admin') {
                agencyOfficers = officerData;
            } else if (user.agency) {
                agencyOfficers = officerData.filter(o => o.agency === user.agency);
            } else {
                agencyOfficers = [];
            }
            setOfficers(agencyOfficers);
            setFormData(getInitialFormData(review, agencyOfficers));
        });
    }, [review, user]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, section?: string, subkey?: string) => {
        const { name, value } = e.target;
        if (section && subkey) {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...(prev[section as keyof Omit<InPersonReview, 'id'>] as object),
                    [subkey]: value
                }
            }));
        } else {
             setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleOfficerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOfficer = officers.find(o => o.id === e.target.value);
        if (selectedOfficer) {
            setFormData(prev => ({ ...prev, officer: selectedOfficer }));
        }
    };

    const handleCheckboxChange = (category: OutcomeCategoryKey) => {
        setFormData(prev => {
            const newCategories = {
                ...prev.reviewOutcome!.categories,
                [category]: !prev.reviewOutcome!.categories[category],
            };
            return { ...prev, reviewOutcome: { ...prev.reviewOutcome!, categories: newCategories } };
        });
    };
    
    const handleSubmit = () => {
        if (!formData.officer) {
            alert("Please select an officer.");
            return;
        }
        onSave({ ...review, ...formData });
    };

    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b sticky top-0 bg-white z-10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">{isEditing ? 'Edit' : 'Create'} BWC Review Record</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon className="h-6 w-6" /></button>
                    </div>
                </div>

                <div className="p-8 space-y-4 overflow-y-auto">
                     {/* Core Info */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Officer Name</label>
                            <select value={formData.officer?.id} onChange={handleOfficerChange} className={inputStyle}>
                                {officers.map(o => <option key={o.id} value={o.id}>{o.lastName}, {o.firstName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Incident ID / CAD #</label>
                            <input type="text" value={formData.caseNumber} onChange={e => setFormData({...formData, caseNumber: e.target.value})} className={inputStyle} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">BWC Footage Date</label>
                            <input type="date" value={formData.bwcFootageDate} onChange={e => setFormData({...formData, bwcFootageDate: e.target.value})} className={inputStyle} />
                        </div>
                    </div>
                    
                    <CollapsibleSection title="Officer-Led Reflection" icon={<UserCircleIcon className="h-5 w-5"/>} defaultOpen={true}>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-medium text-gray-700">Officer's Summary of the Incident</label><textarea rows={3} value={formData.officerReflection?.summary} onChange={(e) => handleInputChange(e, 'officerReflection', 'summary')} placeholder="Officer's perspective..." className={inputStyle}></textarea></div>
                            <div><label className="block text-sm font-medium text-gray-700">Most Challenging Aspect</label><textarea rows={2} value={formData.officerReflection?.challenge} onChange={(e) => handleInputChange(e, 'officerReflection', 'challenge')} placeholder="What the officer found difficult..." className={inputStyle}></textarea></div>
                            <div><label className="block text-sm font-medium text-gray-700">What Could Have Been Done Differently</label><textarea rows={2} value={formData.officerReflection?.alternatives} onChange={(e) => handleInputChange(e, 'officerReflection', 'alternatives')} placeholder="Officer's thoughts on alternatives..." className={inputStyle}></textarea></div>
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection title="Supervisor Review & Policy Alignment" icon={<ShieldCheckIcon className="h-5 w-5"/>}>
                         <div className="space-y-4">
                             <div><label className="block text-sm font-medium text-gray-700">Key Moments & Observations from BWC Footage</label><textarea rows={4} value={formData.supervisorReview?.keyMoments} onChange={(e) => handleInputChange(e, 'supervisorReview', 'keyMoments')} placeholder="Objective observations from the footage..." className={inputStyle}></textarea></div>
                             <div><label className="block text-sm font-medium text-gray-700">Policy Alignment</label>
                                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                                {policyAlignmentOptions.map(key => (
                                     <div key={key}><label className="text-xs font-medium text-gray-600">{policyLabels[key]}</label><select value={formData.policyAlignment?.[key]} onChange={e => handleInputChange(e, 'policyAlignment', key)} className={inputStyle}><option>N/A</option><option>Aligned</option><option>Not Aligned</option></select></div>
                                ))}
                                </div>
                             </div>
                        </div>
                    </CollapsibleSection>
                    
                     <CollapsibleSection title="Review Outcome & Next Steps" icon={<CheckCircleIcon className="h-5 w-5"/>}>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-medium text-gray-700">Select all applicable outcome categories:</label>
                                <div className="mt-2 grid grid-cols-2 gap-4">
                                {(Object.keys(outcomeCategories) as OutcomeCategoryKey[]).map(key => (
                                    <div key={key} className="flex items-center"><input id={key} type="checkbox" checked={formData.reviewOutcome?.categories[key]} onChange={() => handleCheckboxChange(key)} className="h-4 w-4 text-atlas-blue border-gray-300 rounded focus:ring-atlas-blue" /><label htmlFor={key} className="ml-2 block text-sm text-gray-900">{outcomeCategories[key]}</label></div>
                                ))}
                                </div>
                            </div>
                            <div><label className="block text-sm font-medium text-gray-700">Explanation of Outcome & Next Steps</label><textarea rows={3} value={formData.reviewOutcome?.explanation} onChange={(e) => handleInputChange(e, 'reviewOutcome', 'explanation')} placeholder="Summarize the final outcome..." className={inputStyle}></textarea></div>
                        </div>
                    </CollapsibleSection>
                </div>

                <div className="p-6 bg-gray-50 border-t sticky bottom-0 z-10 mt-auto">
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Cancel</button>
                        <button type="button" onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-atlas-blue rounded-md shadow-sm hover:bg-blue-700">Save Review Record</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateReviewRecordModal;
