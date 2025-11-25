
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { ReportCategory } from '../../types.ts';

interface SystemWideOutcomeProfileProps {
    data: Record<ReportCategory, number>;
    total: number;
}

const COLORS: Record<ReportCategory, string> = {
    'No Action': '#22c55e', // green-500
    'Commendation': '#3b82f6', // blue-500
    'Coaching': '#f59e0b', // amber-500
    'Training': '#8b5cf6', // violet-500
    'Internal Affairs': '#ef4444', // red-500
    'Performance Improvement Plan': '#f97316', // orange-500
};

const SystemWideOutcomeProfile: React.FC<SystemWideOutcomeProfileProps> = ({ data, total }) => {
    // FIX: Changed to Object.keys to ensure proper type inference for 'value' as a number.
    const chartData = (Object.keys(data) as ReportCategory[]).map((name) => ({
        name,
        value: data[name],
    }));
    
    const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-gray-800 text-white p-2 rounded-md shadow-lg text-sm">
            <p>{`${payload[0].name} : ${payload[0].value} incidents`}</p>
          </div>
        );
      }
      return null;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm h-full">
            <h3 className="text-lg font-semibold text-gray-800">System-wide Outcome Profile</h3>
            <p className="text-sm text-gray-500 mb-4">Review Period: Jan 1 – Jan 15, 2025 | Total Incidents: {total} | All Agencies</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center h-[250px]">
                <div className="h-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                nameKey="name"
                            >
                                {chartData.map((entry) => (
                                    <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div>
                    <ul className="space-y-2">
                        {/* FIX: Replaced direct calculation with a safer one to prevent division by zero and resolve type errors. */}
                        {chartData.map(entry => {
                            const percentage = total > 0 ? (entry.value / total) * 100 : 0;
                            return (
                                <li key={entry.name} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center">
                                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[entry.name] }}></span>
                                        <span className="text-gray-700">{entry.name}</span>
                                    </div>
                                    <span className="font-semibold text-gray-800">
                                        {entry.value}
                                        <span className="text-gray-500 font-normal ml-2">({percentage.toFixed(0)}%)</span>
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SystemWideOutcomeProfile;