import React from 'react';
import type { SentimentReport } from '../types.ts';
import { EyeIcon, DownloadIcon, LinkIcon } from './IconComponents.tsx';

interface SentimentAnalysisListProps {
    reports: SentimentReport[];
    onView: (report: SentimentReport) => void;
}

const wellnessCategoryColors: { [key: string]: string } = {
    'Supportive': 'bg-green-100 text-green-800',
    'Monitor': 'bg-blue-100 text-blue-800',
    'Follow-up Recommended': 'bg-yellow-100 text-yellow-800',
};

const sentimentScoreColors: { [key: string]: string } = {
    'Low Stress': 'text-green-600',
    'Moderate Stress': 'text-blue-600',
    'High Stress': 'text-yellow-600',
};

const SentimentAnalysisList: React.FC<SentimentAnalysisListProps> = ({ reports, onView }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <caption className="sr-only">List of sentiment analysis reports with their details and available actions.</caption>
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Officer Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment Score</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wellness Category</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {reports.map((report) => (
                        <tr key={report.id} className="hover:bg-gray-50">
                            <th scope="row" className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium text-gray-900">{report.id}</th>
                             <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{report.officer.firstName} {report.officer.lastName}</div>
                                <div className="text-sm text-gray-500">{report.officer.badgeNumber}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.reviewDate}</td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${sentimentScoreColors[report.sentimentScore] || ''}`}>{report.sentimentScore}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${wellnessCategoryColors[report.wellnessCategory] || ''}`}>
                                    {report.wellnessCategory}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.createdBy}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-4">
                                    <button onClick={() => onView(report)} aria-label={`View report ${report.id}`} className="text-gray-400 hover:text-atlas-blue rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-atlas-blue" title="View Report"><EyeIcon className="h-5 w-5"/></button>
                                    <button aria-label={`Download PDF for report ${report.id}`} className="text-gray-400 hover:text-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-atlas-blue" title="Download PDF"><DownloadIcon className="h-5 w-5"/></button>
                                    <button aria-label={`Attach report ${report.id} to BWC Analysis`} className="text-gray-400 hover:text-purple-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-atlas-blue" title="Attach to BWC Analysis Report"><LinkIcon className="h-5 w-5"/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SentimentAnalysisList;