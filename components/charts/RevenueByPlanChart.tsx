import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Agency } from '../../types.ts';

interface RevenueByPlanChartProps {
    agencies: Agency[];
}

const COLORS = {
    Basic: '#a0aec0', // gray-500
    Pro: '#4299e1', // blue-400
    Enterprise: '#9f7aea', // purple-500
};

const RevenueByPlanChart: React.FC<RevenueByPlanChartProps> = ({ agencies }) => {
    const data = agencies.reduce((acc, agency) => {
        if (agency.status === 'Active') {
            const plan = agency.subscriptionPlan;
            acc[plan] = (acc[plan] || 0) + agency.monthlyCost;
        }
        return acc;
    }, {} as Record<Agency['subscriptionPlan'], number>);

    const chartData = Object.entries(data).map(([name, value]) => ({
        name: name as Agency['subscriptionPlan'],
        revenue: value,
    }));

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm h-full">
            <h3 className="text-lg font-semibold text-gray-800">Monthly Revenue by Plan</h3>
            <p className="text-sm text-gray-500 mb-4">Total MRR from active subscriptions</p>
            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                        <Tooltip
                            cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}
                            formatter={(value: number) => `$${value.toLocaleString()}`}
                        />
                        <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                            {chartData.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueByPlanChart;
