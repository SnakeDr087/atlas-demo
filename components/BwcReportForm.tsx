import React, { useMemo, useEffect } from 'react';
import type { BwcReport, Officer, Agency, ReportCategory, User } from '../types';
import { 
    DocumentTextIcon, 
    UsersIcon, 
    LocationMarkerIcon, 
    VideoCameraIcon, 
    ShieldExclamationIcon,
    PencilAltIcon,
    UploadIcon,
    PlusIcon,
    TrashIcon,
    ClockIcon,
    CheckCircleIcon,
} from './IconComponents';
import { states } from './states';

interface BwcReportFormProps {
    formData: BwcReport;
    setFormData: React.Dispatch<React.SetStateAction<BwcReport>>;
    allOfficers: Officer[];
    allAgencies: Agency[];
    currentUser: User;
    readOnly?: boolean;
}

const followUpActions = [
    {
        title: 'No Action',
        description: 'Performance met or exceeded expectations',
        tags: [{ text: 'Positive', color: 'bg-green-100 text-green-800' }],
    },
    {
        title: 'Commendation',
        description: 'Exemplary performance deserving formal recognition',
        tags: [
            { text: 'Positive', color: 'bg-green-100 text-green-800' },
            { text: 'Approval Optional', color: 'bg-gray-100 text-gray-800' }
        ],
    },
    {
        title: 'Coaching',
        description: 'Informal coaching and developmental guidance',
        tags: [{ text: 'Neutral', color: 'bg-blue-100 text-blue-800' }],
    },
    {
        title: 'Training',
        description: 'Additional training needed; not disciplinary',
        tags: [
            { text: 'Neutral', color: 'bg-blue-100 text-blue-800' },
            { text: 'Approval Recommended', color: 'bg-yellow-100 text-yellow-800' }
        ],
    },
    {
        title: 'Performance Improvement Plan',
        description: 'Formal performance improvement plan triggered by persistent deficiencies',
        tags: [
            { text: 'Corrective', color: 'bg-orange-100 text-orange-800' },
            { text: 'Requires Approval', color: 'bg-blue-100 text-blue-800' }
        ],
    },
    {
        title: 'Internal Affairs',
        description: 'Formal misconduct investigation initiated',
        tags: [
            { text: 'Disciplinary', color: 'bg-red-100 text-red-800' },
            { text: 'Approval Mandatory', color: 'bg-red-100 text-red-800' }
        ],
    },
];

const Section: React.FC<{ title: string; subtitle: string; icon: React.ReactNode; children: React.ReactNode, isBlue?: boolean }> = ({ title, subtitle, icon, children, isBlue = false }) => (
    <div className={`p-6 rounded-lg ${isBlue ? 'bg-blue-50/50' : 'bg-white'}`}>
        <div className="flex items-start space-x-4 pb-4 border-b border-gray-200">
            <div className="bg-white p-2 rounded-lg border">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
        </div>
        <div className="pt-6">
            {children}
        </div>
    </div>
);

const BwcReportForm: React.FC<BwcReportFormProps> = ({ formData, setFormData, allOfficers, allAgencies, currentUser, readOnly }) => {
    
    const selectedAgency = useMemo(() => {
        return allAgencies.find(a => a.name === formData.department);
    }, [allAgencies, formData.department]);
    
    const officersForDropdown = useMemo(() => {
        return allOfficers.filter(o => o.agency === formData.department);
    }, [allOfficers, formData.department]);

    const availableKpis = useMemo(() => {
        if (!selectedAgency || !selectedAgency.customKpis || !formData.incidentType) return [];
        return selectedAgency.customKpis[formData.incidentType] || [];
    }, [selectedAgency, formData.incidentType]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as any }));
    };

    const handleNestedChange = (section: keyof BwcReport, field: string, value: string) => {
        setFormData(prev => {
            const sectionValue = prev[section];
            if (typeof sectionValue === 'object' && sectionValue !== null && !Array.isArray(sectionValue)) {
                return { ...prev, [section]: { ...sectionValue, [field]: value } };
            }
            return prev;
        });
    };
    
    // Reset officer selection if department changes
    useEffect(() => {
        const isPrimaryOfficerValid = officersForDropdown.some(o => o.id === formData.personnel.primaryOfficer);
        const isBackupOfficerValid = !formData.personnel.backupOfficer || officersForDropdown.some(o => o.id === formData.personnel.backupOfficer);

        if (!isPrimaryOfficerValid) {
            handleNestedChange('personnel', 'primaryOfficer', officersForDropdown[0]?.id || '');
        }
        if (!isBackupOfficerValid) {
            handleNestedChange('personnel', 'backupOfficer', '');
        }
    }, [officersForDropdown, formData.personnel.primaryOfficer, formData.personnel.backupOfficer]);

    const handleFollowUpSelect = (title: string) => {
        if (!readOnly) {
            setFormData(prev => ({ ...prev, followUp: title as ReportCategory }));
        }
    };

    const inputStyle = "block w-full mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-atlas-blue disabled:bg-gray-100 disabled:text-gray-500 text-gray-900";
    const labelStyle = "text-sm font-medium text-gray-700";

    return (
        <div className="space-y-6">
            <Section title="Review Details" subtitle="Enter the basic details about this report" icon={<DocumentTextIcon className="h-6 w-6 text-blue-500" />} isBlue>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div><label htmlFor="caseNumber" className={labelStyle}>Police Case #</label><input type="text" name="caseNumber" value={formData.caseNumber} onChange={handleInputChange} className={inputStyle} disabled={readOnly} /></div>
                    <div>
                        <label htmlFor="department" className={labelStyle}>Department</label>
                        <select name="department" value={formData.department} onChange={handleInputChange} className={inputStyle} disabled={currentUser.role !== 'Super Admin' || readOnly}>
                            {allAgencies.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                        </select>
                    </div>
                    <div><label htmlFor="reviewDate" className={labelStyle}>Review Date</label><input type="date" name="reviewDate" value={formData.reviewDate} onChange={handleInputChange} className={inputStyle} disabled={readOnly} /></div>
                    <div><label htmlFor="incidentDate" className={labelStyle}>Incident Date</label><input type="date" name="incidentDate" value={formData.incidentDate} onChange={handleInputChange} className={inputStyle} disabled={readOnly} /></div>
                    <div><label htmlFor="start" className={labelStyle}>Start Time</label><input type="time" name="start" value={formData.time.start} onChange={e => handleNestedChange('time', 'start', e.target.value)} className={inputStyle} disabled={readOnly} /></div>
                    <div><label htmlFor="end" className={labelStyle}>End Time</label><input type="time" name="end" value={formData.time.end} onChange={e => handleNestedChange('time', 'end', e.target.value)} className={inputStyle} disabled={readOnly} /></div>
                </div>
            </Section>
            
            <Section title="Address Information" subtitle="Enter the incident location details" icon={<LocationMarkerIcon className="h-6 w-6 text-green-500" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div><label htmlFor="street" className={labelStyle}>Street</label><input type="text" name="street" value={formData.location.street} onChange={e => handleNestedChange('location', 'street', e.target.value)} className={inputStyle} disabled={readOnly} /></div>
                     <div><label htmlFor="apt" className={labelStyle}>Apt/Suite</label><input type="text" name="apt" value={formData.location.apt} onChange={e => handleNestedChange('location', 'apt', e.target.value)} className={inputStyle} disabled={readOnly} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div><label htmlFor="floor" className={labelStyle}>Floor</label><input type="text" name="floor" value={formData.location.floor} onChange={e => handleNestedChange('location', 'floor', e.target.value)} className={inputStyle} disabled={readOnly} /></div>
                    <div><label htmlFor="city" className={labelStyle}>City</label><input type="text" name="city" value={formData.location.city} onChange={e => handleNestedChange('location', 'city', e.target.value)} className={inputStyle} disabled={readOnly} /></div>
                    <div><label htmlFor="state" className={labelStyle}>State</label><select name="state" value={formData.location.state} onChange={e => handleNestedChange('location', 'state', e.target.value)} className={inputStyle} disabled={readOnly}><option value="">Select state</option>{states.map(s => <option key={s.abbreviation} value={s.abbreviation}>{s.name}</option>)}</select></div>
                </div>
            </Section>

             <Section title="Personnel Information" subtitle="Enter the involved personnel details" icon={<UsersIcon className="h-6 w-6 text-indigo-500" />} isBlue>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div><label className={labelStyle}>Supervisor</label><input type="text" value={formData.personnel.supervisor} readOnly className={`${inputStyle} bg-gray-100`} /></div>
                    <div><label htmlFor="primaryOfficer" className={labelStyle}>Officer Involved</label><select name="primaryOfficer" value={formData.personnel.primaryOfficer} onChange={e => handleNestedChange('personnel', 'primaryOfficer', e.target.value)} className={inputStyle} disabled={readOnly}><option value="">Select officer</option>{officersForDropdown.map(o => <option key={o.id} value={o.id}>{`${o.lastName}, ${o.firstName}`}</option>)}</select></div>
                    <div><label htmlFor="backupOfficer" className={labelStyle}>Backup Officer</label><select name="backupOfficer" value={formData.personnel.backupOfficer} onChange={e => handleNestedChange('personnel', 'backupOfficer', e.target.value)} className={inputStyle} disabled={readOnly}><option value="">Select backup officer</option>{officersForDropdown.map(o => <option key={o.id} value={o.id}>{`${o.lastName}, ${o.firstName}`}</option>)}</select></div>
                </div>
            </Section>
            
             <Section title="Incident Analysis" subtitle="Analyze the incident details and outcomes" icon={<ShieldExclamationIcon className="h-6 w-6 text-red-500" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div><label htmlFor="incidentType" className={labelStyle}>Incident Type</label><select name="incidentType" value={formData.incidentType} onChange={handleInputChange} className={inputStyle} disabled={readOnly}><option value="">Select incident type</option>{selectedAgency?.customIncidentTypes?.map(it => <option key={it} value={it}>{it}</option>)}</select></div>
                     <div><label htmlFor="kpi" className={labelStyle}>KPI</label><select name="kpi" value={formData.kpi} onChange={handleInputChange} className={inputStyle} disabled={readOnly || !formData.incidentType}><option value="">Select KPI</option>{availableKpis.map(k => <option key={k} value={k}>{k}</option>)}</select></div>
                     <div><label htmlFor="officerSafetyItems" className={labelStyle}>Officer Safety</label><select name="officerSafetyItems" value={formData.officerSafetyItems[0] || ''} onChange={e => setFormData(prev => ({...prev, officerSafetyItems: [e.target.value]}))} className={inputStyle} disabled={readOnly}><option value="">Select officer safety item</option>{selectedAgency?.customSafetyItems?.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                     <div><label htmlFor="disposition" className={labelStyle}>Disposition</label><select name="disposition" value={formData.disposition} onChange={handleInputChange} className={inputStyle} disabled={readOnly}><option value="">Select disposition</option>{selectedAgency?.customDispositions?.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                </div>
            </Section>

            <Section title="Follow-up Action" subtitle="Select the appropriate follow-up action for this review" icon={<CheckCircleIcon className="h-6 w-6 text-teal-500" />} isBlue>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {followUpActions.map((action) => (
                        <button
                            key={action.title}
                            type="button"
                            onClick={() => handleFollowUpSelect(action.title)}
                            disabled={readOnly}
                            className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                                formData.followUp === action.title
                                    ? 'bg-atlas-light-blue border-atlas-blue ring-2 ring-atlas-blue'
                                    : 'bg-white hover:border-gray-400 hover:shadow-md'
                            } disabled:cursor-not-allowed disabled:bg-gray-100 disabled:hover:shadow-none disabled:hover:border-gray-200`}
                        >
                            <h4 className="font-bold text-gray-800">{action.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {action.tags.map((tag, index) => (
                                    <span key={index} className={`px-2 py-0.5 text-xs font-semibold rounded-full ${tag.color}`}>
                                        {tag.text}
                                    </span>
                                ))}
                            </div>
                        </button>
                    ))}
                </div>
            </Section>
            
            <Section title="Supervisor Notes" subtitle="Enter internal and report-facing notes" icon={<PencilAltIcon className="h-6 w-6 text-yellow-600" />}>
                <div className="space-y-4">
                    <div><label htmlFor="internal" className={labelStyle}>Internal Notes</label><p className="text-xs text-gray-500">Not visible in final report</p><textarea name="internal" value={formData.supervisorNotes.internal} onChange={e => handleNestedChange('supervisorNotes', 'internal', e.target.value)} rows={4} className={inputStyle} disabled={readOnly}></textarea></div>
                    <div><label htmlFor="reportFacing" className={labelStyle}>Report-Facing Notes</label><p className="text-xs text-gray-500">Notes that will appear in the final report</p><textarea name="reportFacing" value={formData.supervisorNotes.reportFacing} onChange={e => handleNestedChange('supervisorNotes', 'reportFacing', e.target.value)} rows={6} className={inputStyle} disabled={readOnly}></textarea></div>
                </div>
            </Section>
        </div>
    );
};

export default BwcReportForm;