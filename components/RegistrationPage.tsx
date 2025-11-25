import React, { useState, useEffect } from 'react';
import { getAgencies } from '../services/agencyService.ts';
import { submitRegistration } from '../services/registrationService.ts';
import type { Agency } from '../types.ts';

interface RegistrationPageProps {
    onGoToLogin: () => void;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ onGoToLogin }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        agency: '',
        password: '',
        confirmPassword: '',
    });
    const [agencies, setAgencies] = useState<Agency[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        getAgencies().then(data => setAgencies(data.filter(a => a.status === 'Active')));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const { confirmPassword, ...submissionData } = formData;
            const result = await submitRegistration(submissionData);
            if (result.success) {
                setIsSubmitted(true);
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (err) {
            setError('An error occurred during registration.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-atlas-sidebar">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Registration Submitted</h2>
                    <p className="text-gray-600">Your registration request has been sent to the agency supervisor for approval. You will be notified once your account is activated.</p>
                    <button onClick={onGoToLogin} className="w-full mt-4 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-atlas-blue hover:bg-blue-700">
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-atlas-sidebar">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Officer Registration</h1>
                    <p className="mt-2 text-sm text-gray-500">Create your account to access the ATLAS system.</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="firstName" type="text" required placeholder="First Name" value={formData.firstName} onChange={handleChange} className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900" />
                        <input name="lastName" type="text" required placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900" />
                    </div>
                    <input name="email" type="email" required placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900" />
                    <select name="agency" required value={formData.agency} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900">
                        <option value="">Select Your Agency</option>
                        {agencies.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                    </select>
                    <input name="password" type="password" required placeholder="Password (min. 8 characters)" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900" />
                    <input name="confirmPassword" type="password" required placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900" />
                    
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    
                    <button type="submit" disabled={isLoading} className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-atlas-blue hover:bg-blue-700 disabled:bg-blue-300">
                        {isLoading ? 'Submitting...' : 'Submit for Approval'}
                    </button>
                </form>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <button onClick={onGoToLogin} className="font-medium text-atlas-blue hover:text-blue-700">
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegistrationPage;