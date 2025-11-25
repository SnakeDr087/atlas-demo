import React from 'react';
import Header from './Header.tsx';
import type { TroubleTicket } from '../types.ts';
import { EyeIcon } from './IconComponents.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';

const statusColors: { [key: string]: string } = {
    Open: 'bg-red-100 text-red-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    Resolved: 'bg-green-100 text-green-800',
};

const priorityColors: { [key: string]: string } = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-blue-100 text-blue-800',
    High: 'bg-yellow-100 text-yellow-800',
    Critical: 'bg-red-100 text-red-800',
};

const TroubleTicketPage: React.FC = () => {
    const { tickets } = useAppContext();

    return (
        <div className="p-8 space-y-8">
            <Header title="Trouble Tickets" />

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <caption className="sr-only">List of all trouble tickets with their details and available actions.</caption>
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitter</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tickets.map((ticket: TroubleTicket) => (
                            <tr key={ticket.id} className="hover:bg-gray-50">
                                <th scope="row" className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium text-gray-900">{ticket.id}</th>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{ticket.submitter}</div>
                                    <div className="text-sm text-gray-500">{ticket.agency}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate" title={ticket.subject}>{ticket.subject}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityColors[ticket.priority] || ''}`}>
                                        {ticket.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[ticket.status] || ''}`}>
                                        {ticket.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button aria-label={`View details for ticket ${ticket.id}`} className="text-gray-400 hover:text-atlas-blue rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-atlas-blue" title="View Ticket"><EyeIcon className="h-5 w-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TroubleTicketPage;
