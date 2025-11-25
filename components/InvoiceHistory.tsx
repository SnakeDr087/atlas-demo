import React from 'react';
import type { Invoice } from '../types.ts';
import { DownloadIcon } from './IconComponents.tsx';

interface InvoiceHistoryProps {
    invoices: Invoice[];
}

const statusColors: { [key: string]: string } = {
    Paid: 'bg-green-100 text-green-800',
    Due: 'bg-yellow-100 text-yellow-800',
    Overdue: 'bg-red-100 text-red-800',
};

const InvoiceHistory: React.FC<InvoiceHistoryProps> = ({ invoices }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Invoice History</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {invoices.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-8 text-gray-500">No invoices found for this agency.</td></tr>
                        ) : (
                            invoices.map((invoice) => (
                                <tr key={invoice.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${invoice.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[invoice.status]}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="inline-flex items-center text-atlas-blue hover:text-blue-700">
                                            <DownloadIcon className="h-4 w-4 mr-1" />
                                            Download
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvoiceHistory;
