import React from 'react';

interface HeaderProps {
    title: string;
    score?: {
        label: string;
        value: number;
    };
}

const Header: React.FC<HeaderProps> = ({ title, score }) => {
    return (
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            {score && (
                <div className="flex items-center">
                    <span className="bg-atlas-blue text-white text-sm font-semibold px-4 py-2 rounded-md shadow-sm">
                        {score.label}: {score.value.toFixed(0)}%
                    </span>
                </div>
            )}
        </div>
    );
};

export default Header;