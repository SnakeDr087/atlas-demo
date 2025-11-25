import React from 'react';
import { mockReports } from '../data/mockReports';
import { DocumentTextIcon, UserCircleIcon } from './IconComponents';

const RecentActivity: React.FC = () => {
    const recentReports = mockReports.slice(0, 5); // Take the 5 most recent for display

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent System Activity</h3>
            <ul className="space-y-4">
                {recentReports.map(report => (
                    <li key={report.id} className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded-full">
                            <DocumentTextIcon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">
                                New Report Submitted: <span className="font-normal">{report.incidentType}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                                By {report.officer.firstName} {report.officer.lastName} on {report.reportDate}
                            </p>
                        </div>
                    </li>
                ))}
                 <li className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-full">
                        <UserCircleIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">
                            New Officer Registration Pending
                        </p>
                        <p className="text-sm text-gray-500">
                            Maria Solace from Central Police Department
                        </p>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default RecentActivity;