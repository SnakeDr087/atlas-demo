

// FIX: Populating placeholder file to resolve module errors.
import React from 'react';
import type { RecentCustomerActivityItem } from '../types.ts';
// FIX: Add .ts extension to import path for mockRecentCustomerActivity.
import { mockRecentCustomerActivity } from '../data/mockRecentCustomerActivity.ts';
// FIX: Replaced non-existent UserIcon with UserCircleIcon.
import { UserCircleIcon, UploadIcon, TicketIcon, CreditCardIcon } from './IconComponents.tsx';

const iconMap: { [key: string]: React.ReactNode } = {
    user: <UserCircleIcon className="h-5 w-5 text-blue-500" />,
    upload: <UploadIcon className="h-5 w-5 text-green-500" />,
    ticket: <TicketIcon className="h-5 w-5 text-yellow-500" />,
    payment: <CreditCardIcon className="h-5 w-5 text-purple-500" />,
};

const RecentCustomerActivity: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm h-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Customer Activity</h3>
            <ul className="space-y-4">
                {mockRecentCustomerActivity.map((item) => (
                    <li key={item.id} className="flex items-start space-x-4">
                        <div className="p-2 bg-gray-100 rounded-full">
                           {iconMap[item.icon]}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">{item.action}</p>
                            <p className="text-sm text-gray-500">{item.agencyName} - {item.date}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentCustomerActivity;
