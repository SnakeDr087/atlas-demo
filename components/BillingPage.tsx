import React, { useState, useEffect } from 'react';
import Header from './Header.tsx';
import InvoiceHistory from './InvoiceHistory.tsx';
import ContractViewerModal from './ContractViewerModal.tsx';
import AllInvoicesList from './AllInvoicesList.tsx';
import PricingOnePagerModal from './PricingOnePagerModal.tsx';
import { CreditCardIcon, CheckCircleIcon, StarIcon, DocumentTextIcon, CloseIcon, UploadIcon } from './IconComponents.tsx';
import type { Agency, Invoice } from '../types.ts';
import { useAppContext } from '../contexts/AppContext.tsx';

const pricingTiers = [
    {
      "name": "Core" as const,
      "onboardingFee": 2000,
      "year1Cost": 12000,
      "year2PlusCost": 10000,
      "features": [
        "Manual Review",
        "Performance Improvement Plan"
      ],
      "description": "Core plan includes foundational review services and improvement planning tools."
    },
    {
      "name": "Pro" as const,
      "onboardingFee": 2000,
      "year1Cost": 17000,
      "year2PlusCost": 15000,
      "features": [
        "Manual Review",
        "Performance Improvement Plan",
        "Sentiment Analysis",
        "In-Person Review (Form)",
        "BWC (AI) Analysis"
      ],
      "description": "Pro plan adds advanced analytics and in-person review tools to support deeper performance insight."
    },
    {
      "name": "Elite" as const,
      "onboardingFee": 2000,
      "year1Cost": 27000,
      "year2PlusCost": 25000,
      "features": [
        "All Pro features",
        "Full BWC Reviews by Atlas team",
        "Monthly Performance Reports"
      ],
      "description": "Elite plan includes hands-on support from the Atlas team with full video review and monthly reporting."
    }
];

interface UploadInvoiceModalProps {
    agencies: Agency[];
    onClose: () => void;
    // FIX: Update onSave to accept Omit<Invoice, 'id'> to align with API.
    onSave: (newInvoice: Omit<Invoice, 'id'>) => void;
}

const UploadInvoiceModal: React.FC<UploadInvoiceModalProps> = ({ agencies, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        agencyId: agencies.length > 0 ? agencies[0].id : '',
        invoiceId: `INV-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
        date: new Date().toISOString().split('T')[0],
        amount: '',
        status: 'Due' as Invoice['status'],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        const selectedAgency = agencies.find(a => a.id === formData.agencyId);
        if (!selectedAgency || !formData.amount) {
            alert('Please fill out all required fields.');
            return;
        }

        // FIX: Create an object without the client-generated ID.
        const newInvoice: Omit<Invoice, 'id'> = {
            agencyId: selectedAgency.id,
            agencyName: selectedAgency.name,
            date: formData.date,
            amount: parseFloat(formData.amount),
            status: formData.status,
        };
        onSave(newInvoice);
    };

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-atlas-blue focus:border-atlas-blue sm:text-sm text-gray-900";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Upload New Invoice</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon className="h-6 w-6" /></button>
                </div>
                <div className="p-8 space-y-6">
                    <div>
                        <label htmlFor="agencyId" className="block text-sm font-medium text-gray-700">Agency</label>
                        <select id="agencyId" name="agencyId" value={formData.agencyId} onChange={handleChange} className={inputStyle}>
                            {agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="invoiceId" className="block text-sm font-medium text-gray-700">Invoice ID</label>
                            <input type="text" id="invoiceId" name="invoiceId" value={formData.invoiceId} onChange={handleChange} className={`${inputStyle} bg-gray-100`} readOnly title="Invoice ID is generated automatically on save." />
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className={inputStyle} />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount ($)</label>
                            <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} className={inputStyle} placeholder="e.g., 17000.00" />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                            <select id="status" name="status" value={formData.status} onChange={handleChange} className={inputStyle}>
                                <option value="Due">Due</option>
                                <option value="Paid">Paid</option>
                                <option value="Overdue">Overdue</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Invoice PDF</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <UploadIcon className="mx-auto h-10 w-10 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-atlas-blue hover:text-blue-700">
                                        <span>Upload file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PDF up to 5MB</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-gray-50 border-t flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Cancel</button>
                    <button type="button" onClick={handleSubmit} className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-atlas-blue rounded-md shadow-sm hover:bg-blue-700">
                        <CreditCardIcon className="h-5 w-5 mr-2" />
                        Save Invoice
                    </button>
                </div>
            </div>
        </div>
    );
};

const BillingPage: React.FC = () => {
    // FIX: Get invoices and addInvoice function from AppContext.
    const { currentUser: user, agencies, invoices, updateAgency, addInvoice } = useAppContext();
    const [agency, setAgency] = useState<Agency | null>(null);
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

    useEffect(() => {
        if (!user) return;
        if (user.role !== 'Super Admin' && user.agency) {
            const currentAgency = agencies.find(a => a.name === user.agency);
            setAgency(currentAgency || null);
        }
    }, [user, agencies]);

    const handlePlanChange = (newPlan: 'Core' | 'Pro' | 'Elite') => {
        if (agency) {
            const updatedAgency = { ...agency, subscriptionPlan: newPlan };
            setAgency(updatedAgency);
            updateAgency(updatedAgency); // Update in global context
        }
    };

    // FIX: Update handleAddInvoice to call the context function.
    const handleAddInvoice = async (newInvoiceData: Omit<Invoice, 'id'>) => {
        await addInvoice(newInvoiceData);
        setIsUploadModalOpen(false);
    };

    if (!user) {
        return null;
    }

    if (user.role === 'Super Admin') {
        return (
            <div className="p-8 space-y-8">
                <Header title="Billing Management" />
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">Manage all client invoices and service agreements.</p>
                     <div className="flex items-center space-x-4">
                        <button 
                            onClick={() => setIsPricingModalOpen(true)}
                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                            <DocumentTextIcon className="h-5 w-5 mr-2" />
                            View Pricing Sheet
                        </button>
                        <button 
                            onClick={() => setIsContractModalOpen(true)}
                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                            <DocumentTextIcon className="h-5 w-5 mr-2" />
                            View Master Agreement
                        </button>
                        <button 
                            onClick={() => setIsUploadModalOpen(true)}
                            className="inline-flex items-center px-4 py-2 bg-atlas-blue text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            <CreditCardIcon className="h-5 w-5 mr-2" />
                            Upload Invoice
                        </button>
                     </div>
                </div>
                <AllInvoicesList invoices={invoices} />
                {isContractModalOpen && <ContractViewerModal onClose={() => setIsContractModalOpen(false)} />}
                {isUploadModalOpen && <UploadInvoiceModal agencies={agencies} onClose={() => setIsUploadModalOpen(false)} onSave={handleAddInvoice} />}
                {isPricingModalOpen && <PricingOnePagerModal onClose={() => setIsPricingModalOpen(false)} />}
            </div>
        );
    }

    if (!agency) {
        return (
            <div className="p-8">
                <Header title="Billing & Subscription" />
                <div className="mt-8 bg-white p-8 rounded-lg shadow-sm text-center">
                    <h2 className="text-xl font-semibold text-gray-700">Could not load agency information.</h2>
                </div>
            </div>
        );
    }
    
    const agencyInvoices = invoices.filter(inv => inv.agencyId === agency.id);

    return (
        <div className="p-8 space-y-8">
            <Header title="Billing & Subscription" />

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Subscription Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Current Plan</p>
                        <p className="text-xl font-bold text-atlas-blue">{agency.subscriptionPlan}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Next Billing Date</p>
                        <p className="text-lg font-semibold text-gray-700">January 1, 2026</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800">Choose the plan that's right for you</h2>
                    <p className="mt-2 text-gray-600">All plans are billed annually and include a one-time onboarding fee for the first year.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
                    {pricingTiers.map(plan => {
                        const isCurrentPlan = agency.subscriptionPlan === plan.name;
                        return (
                            <div key={plan.name} className={`relative border rounded-lg p-6 flex flex-col h-full transition-all duration-300 ${isCurrentPlan ? 'border-atlas-blue ring-2 ring-atlas-blue shadow-xl' : 'border-gray-200 bg-gray-50'}`}>
                                {plan.name === 'Pro' && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-800 text-xs font-bold px-3 py-1 rounded-full flex items-center shadow"><StarIcon className="h-4 w-4 mr-1"/> MOST POPULAR</span>}

                                <h3 className="text-2xl font-bold text-gray-800">{plan.name}</h3>
                                <p className="text-sm text-gray-500 mt-2 flex-grow">{plan.description}</p>
                                
                                <div className="my-6">
                                    <p className="text-gray-800">
                                        <span className="text-4xl font-extrabold">${plan.year1Cost.toLocaleString()}</span>
                                        <span className="text-base font-medium text-gray-500">/ Year 1</span>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Includes ${plan.onboardingFee.toLocaleString()} onboarding fee (Year 1 only)</p>
                                    <p className="text-lg font-semibold text-gray-700 mt-2">${plan.year2PlusCost.toLocaleString()} <span className="text-base font-medium text-gray-500">/ Year 2+</span></p>
                                </div>

                                <ul className="space-y-3 text-sm mb-8">
                                    {plan.features.map(feature => (
                                        <li key={feature} className="flex items-start">
                                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"/>
                                            <span className="text-gray-600">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button 
                                    onClick={() => handlePlanChange(plan.name)}
                                    disabled={isCurrentPlan}
                                    className={`w-full mt-auto px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                                        isCurrentPlan 
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                        : 'bg-atlas-blue text-white hover:bg-blue-700'
                                    }`}
                                >
                                    {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>

            <InvoiceHistory invoices={agencyInvoices} />

            {isContractModalOpen && <ContractViewerModal onClose={() => setIsContractModalOpen(false)} />}
        </div>
    );
};

export default BillingPage;