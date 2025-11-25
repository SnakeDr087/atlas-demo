import React, { useState } from 'react';
import { TicketIcon, DocumentTextIcon, UploadIcon } from './IconComponents.tsx';
import type { TroubleTicket } from '../types.ts';
import { useAppContext } from '../contexts/AppContext.tsx';

const SubmitTicketPage: React.FC = () => {
    const { addTicket } = useAppContext();
    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-atlas-blue focus:border-atlas-blue sm:text-sm text-gray-900 placeholder-gray-400";

    const [formData, setFormData] = useState({
        category: 'Bug Report' as TroubleTicket['category'],
        priority: 'Medium' as TroubleTicket['priority'],
        subject: '',
        pageAffected: '',
        description: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addTicket(formData);
        setIsSubmitted(true);
        setFormData({
            category: 'Bug Report',
            priority: 'Medium',
            subject: '',
            pageAffected: '',
            description: '',
        });
        setTimeout(() => setIsSubmitted(false), 5000); // Reset confirmation message after 5 seconds
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Submit a Support Ticket</h1>

            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
                {isSubmitted ? (
                    <div className="text-center p-8 bg-green-50 rounded-lg">
                        <h2 className="text-2xl font-semibold text-green-800">Ticket Submitted Successfully!</h2>
                        <p className="mt-2 text-gray-600">Thank you for your feedback. Our support team will review your ticket shortly and get in touch if more information is needed.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Ticket Details Section */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 pb-4 border-b">
                                <TicketIcon className="h-6 w-6 text-atlas-blue" />
                                <h2 className="text-lg font-semibold text-gray-700">Ticket Details</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category *</label>
                                    <select id="category" name="category" value={formData.category} onChange={handleChange} className={inputStyle} required>
                                        <option>Bug Report</option>
                                        <option>Feature Request</option>
                                        <option>Account Issue</option>
                                        <option>Data Discrepancy</option>
                                        <option>UI/UX Feedback</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority *</label>
                                    <select id="priority" name="priority" value={formData.priority} onChange={handleChange} className={inputStyle} required>
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                        <option>Critical</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="pageAffected" className="block text-sm font-medium text-gray-700">Page/Feature Affected</label>
                                    <input type="text" id="pageAffected" name="pageAffected" value={formData.pageAffected} onChange={handleChange} className={inputStyle} placeholder="e.g., BWC Analysis Page" />
                                </div>
                            </div>
                        </div>

                        {/* Issue Description Section */}
                        <div className="space-y-6">
                             <div className="flex items-center space-x-3 pb-4 border-b">
                                <DocumentTextIcon className="h-6 w-6 text-atlas-blue" />
                                <h2 className="text-lg font-semibold text-gray-700">Issue Description</h2>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject *</label>
                                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className={inputStyle} required placeholder="A brief, clear summary of the issue" />
                            </div>
                             <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Detailed Description *</label>
                                <textarea 
                                    id="description" 
                                    name="description" 
                                    rows={8} 
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={inputStyle} 
                                    required
                                    placeholder="Please provide as much detail as possible, including steps to reproduce the issue, any error messages, and the expected outcome."
                                ></textarea>
                            </div>
                        </div>
                        
                        {/* Attachments Section */}
                         <div className="space-y-4">
                             <div className="flex items-center space-x-3 pb-4 border-b">
                                <UploadIcon className="h-6 w-6 text-atlas-blue" />
                                <h2 className="text-lg font-semibold text-gray-700">Attachments</h2>
                            </div>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <UploadIcon className="mx-auto h-10 w-10 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-atlas-blue hover:text-blue-700">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF, PDF up to 10MB</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="submit" className="inline-flex items-center px-6 py-2 bg-atlas-blue text-white rounded-md hover:bg-blue-700 transition-colors">
                                <DocumentTextIcon className="h-5 w-5 mr-2" />
                                Submit Ticket
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SubmitTicketPage;
