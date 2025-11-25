import React from 'react';

interface MetricCardProps {
    title: string;
    value: string | number;
    percentage?: number;
    icon: React.ReactNode;
    color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, percentage, icon, color }) => {
    return (
        <div className={`p-4 rounded-lg shadow-sm flex flex-col items-center justify-center text-center ${color}`}>
            <div className="mb-2">
                {icon}
            </div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-sm font-semibold text-gray-600">{title}</p>
            {percentage !== undefined && (
                <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(0)}% of reviews</p>
            )}
        </div>
    );
};

export default MetricCard;
