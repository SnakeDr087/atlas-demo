
import React, { useState, useMemo } from 'react';
import type { Invoice } from '../types.ts';
import { DownloadIcon } from './IconComponents.tsx';

interface AllInvoicesListProps {
    invoices: Invoice[];
}

const statusColors: { [key: string]: string } = {
    Paid: 'bg-green-100 text-green-800',
    Due: 'bg-yellow-100 text-yellow-800',
    Overdue: 'bg-red-100 text-red-800',
};

const AllInvoicesList: React.FC<AllInvoicesListProps> = ({ invoices }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredInvoices = useMemo(() => {
        return invoices.filter(invoice => {
            const matchesSearch = searchTerm === '' || 
                                  invoice.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [invoices, searchTerm, statusFilter]);
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-semibold text-gray-800">All Client Invoices</h3>
                 <div className="flex items-center space-x-4">
                    <select 
                        value={statusFilter} 
                        onChange={e => setStatusFilter(e.target.value)}
                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlas-blue text-sm"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Paid">Paid</option>
                        <option value="Due">Due</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                    <input 
                        type="text" 
                        placeholder="Search by agency or invoice ID..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlas-blue text-sm"
                    />
                 </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agency</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                         {filteredInvoices.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{invoice.agencyName}</td>
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
                        ))}
                         {filteredInvoices.length === 0 && (
                            <tr><td colSpan={6} className="text-center py-8 text-gray-500">No invoices match your criteria.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllInvoicesList;
