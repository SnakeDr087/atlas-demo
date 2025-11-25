import React from 'react';

interface GaugeProps {
    value: number; // 0 to 100
    label: string;
}

const Gauge: React.FC<GaugeProps> = ({ value, label }) => {
    const clampedValue = Math.max(0, Math.min(100, value));
    const circumference = 2 * Math.PI * 45; // r=45
    const dashoffset = circumference - (clampedValue / 100) * circumference;

    const getColor = () => {
        if (clampedValue < 40) return '#ef4444'; // red-500
        if (clampedValue < 70) return '#f59e0b'; // amber-500
        return '#22c55e'; // green-500
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 100 100">
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb" // gray-200
                    strokeWidth="10"
                />
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={getColor()}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashoffset}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                />
                <text x="50" y="50" textAnchor="middle" dy=".3em" fontSize="20" fontWeight="bold" fill="#1f2937">
                    {clampedValue.toFixed(0)}%
                </text>
            </svg>
            <p className="text-sm font-semibold text-gray-700 mt-2">{label}</p>
        </div>
    );
};

export default Gauge;
