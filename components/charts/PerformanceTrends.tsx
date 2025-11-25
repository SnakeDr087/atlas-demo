import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ReportCategory } from '../../types.ts';

interface PerformanceTrendsProps {
    data: { name: string; [key: string]: string | number }[];
}

const COLORS: Record<ReportCategory, string> = {
    'No Action': '#22c55e',
    'Commendation': '#3b82f6',
    'Coaching': '#f59e0b',
    'Training': '#8b5cf6',
    'Internal Affairs': '#ef4444',
    'Performance Improvement Plan': '#f97316',
};
const categories: ReportCategory[] = ['No Action', 'Commendation', 'Coaching', 'Training', 'Internal Affairs', 'Performance Improvement Plan'];

const PerformanceTrends: React.FC<PerformanceTrendsProps> = ({ data }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm h-full">
            <h3 className="text-lg font-semibold text-gray-800">Performance Trends Over Time</h3>
            <p className="text-sm text-gray-500 mb-4">6-Month Performance Trend Analysis</p>
            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" style={{ fontSize: '12px' }} />
                        <YAxis style={{ fontSize: '12px' }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                        {categories.map(cat => (
                           <Line key={cat} type="monotone" dataKey={cat} stroke={COLORS[cat]} strokeWidth={2} dot={{ r: 4 }} />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
             <div className="mt-8 bg-blue-50 p-4 rounded-md">
                <h4 className="font-semibold text-sm text-blue-800">Trend Analysis</h4>
                <p className="text-xs text-blue-700 mt-1">
                    System-wide performance shows consistent improvement across all agencies. Strong focus on professional development with balanced approach to training and recognition programs.
                </p>
            </div>
        </div>
    );
};

export default PerformanceTrends;
