
import React from 'react';
import type { Officer } from '../types.ts';

interface ReportFiltersProps {
    filters: { [key: string]: string };
    onFilterChange: (name: string, value: string) => void;
    officers: Officer[];
}

const ReportFilters: React.FC<ReportFiltersProps> = ({ filters, onFilterChange, officers }) => {
    const inputStyle = "w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-atlas-blue focus:border-atlas-blue sm:text-sm text-gray-900 placeholder-gray-400";
    
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        onFilterChange(e.target.name, e.target.value);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
            {/* Row 1 */}
            <div>
                <label htmlFor="officer" className="block text-sm font-medium text-gray-700">Officer Involved</label>
                <select id="officer" name="officer" value={filters.officer} onChange={handleChange} className={inputStyle}>
                    <option value="">Select Officer</option>
                    {officers.map(o => <option key={o.id} value={`${o.firstName} ${o.lastName}`}>{o.firstName} {o.lastName}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="reportDateRange" className="block text-sm font-medium text-gray-700">Report Date Range</label>
                <div className="flex items-center space-x-2">
                    <input type="date" name="reportDateStart" value={filters.reportDateStart} onChange={handleChange} className={inputStyle} />
                    <span className="text-gray-500">to</span>
                    <input type="date" name="reportDateEnd" value={filters.reportDateEnd} onChange={handleChange} className={inputStyle} />
                </div>
            </div>
            <div>
                <label htmlFor="followUp" className="block text-sm font-medium text-gray-700">Follow Up</label>
                <select id="followUp" name="followUp" value={filters.followUp} onChange={handleChange} className={inputStyle}>
                    <option value="">Select Follow up</option>
                     <option>No Action</option>
                    <option>Commendation</option>
                    <option>Coaching</option>
                    <option>Training</option>
                    <option>Internal Affairs</option>
                </select>
            </div>
            <div>
                <label htmlFor="reportCreator" className="block text-sm font-medium text-gray-700">Report Created By</label>
                <select id="reportCreator" name="reportCreator" value={filters.reportCreator} onChange={handleChange} className={inputStyle}>
                    <option value="">Select Report Creator</option>
                    <option>Sgt. Williams</option>
                    <option>Lt. Rodriguez</option>
                </select>
            </div>

            {/* Row 2 */}
            <div>
                <label htmlFor="shift" className="block text-sm font-medium text-gray-700">Shift</label>
                <select id="shift" name="shift" value={filters.shift} onChange={handleChange} className={inputStyle}>
                    <option value="">Select shift</option>
                    <option>Day</option>
                    <option>Night</option>
                    <option>Swing</option>
                </select>
            </div>
             <div>
                <label htmlFor="incidentType" className="block text-sm font-medium text-gray-700">Incident Type</label>
                <select id="incidentType" name="incidentType" value={filters.incidentType} onChange={handleChange} className={inputStyle}>
                    <option value="">Select Incident type</option>
                    <option>Traffic Stop</option>
                    <option>Domestic Violence</option>
                    <option>Use of Force</option>
                    <option>Welfare Check</option>
                </select>
            </div>
            <div>
                <label htmlFor="incidentDate" className="block text-sm font-medium text-gray-700">Incident Date</label>
                <input type="date" id="incidentDate" name="incidentDate" value={filters.incidentDate} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
                <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700">Education Level</label>
                 <select id="educationLevel" name="educationLevel" value={filters.educationLevel} onChange={handleChange} className={inputStyle}>
                    <option value="">Highest Education Level</option>
                    <option>High School Diploma</option>
                    <option>Associate's Degree</option>
                    <option>Bachelor's Degree</option>
                    <option>Master's Degree</option>
                </select>
            </div>

             {/* Row 3 */}
             <div className="md:col-span-1">
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Years of Experience</label>
                <select id="experience" name="experience" value={filters.experience} onChange={handleChange} className={inputStyle}>
                    <option value="">Select Experience</option>
                    <option>0-1 years</option>
                    <option>1-3 years</option>
                    <option>3-5 years</option>
                    <option>5-10 years</option>
                    <option>10+ years</option>
                </select>
            </div>
        </div>
    );
};

export default ReportFilters;
