
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { VideoCameraIcon, TrashIcon } from './IconComponents.tsx';
import TermsModal from './TermsModal.tsx';

interface LoginPageProps {
    onGoToRegister: () => void;
    onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onGoToRegister, onLoginSuccess }) => {
    const { login, loginAsGuest, resetSystem, showConfirmation } = useAppContext();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const user = await login(id, password);
            if (user) {
                onLoginSuccess();
            } else {
                setError('Invalid ID or password.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTermsAccepted = (email: string) => {
        setShowTerms(false);
        loginAsGuest(email); // Logs in as Agency Supervisor and tracks the specific email
        onLoginSuccess();
    };

    const handleReset = () => {
        showConfirmation({
            title: 'Reset Demo Environment?',
            message: 'This will delete all locally stored data (users, reports, officers) and restore the original demo dataset. This enables a fresh start for a new presentation. This action cannot be undone.',
            onConfirm: () => {
                resetSystem();
            }
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-atlas-sidebar relative">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-2xl border border-gray-200 relative z-10">
                <div className="text-center">
                    <h1 className="text-5xl font-extrabold tracking-wider text-atlas-dark">ATLAS</h1>
                    <p className="mt-2 text-base font-medium text-atlas-blue tracking-wide">PERFORMANCE MANAGEMENT SYSTEM</p>
                    <p className="mt-1 text-xs text-gray-400">AI-Powered Oversight & Wellness</p>
                </div>

                {/* Primary Action: Guest Demo */}
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-6 text-center space-y-4 shadow-sm">
                    <h3 className="text-lg font-bold text-purple-900">Supervisor Evaluation Access</h3>
                    <p className="text-sm text-purple-700">
                        Access the full Agency Supervisor dashboard with AI analysis features enabled for a limited 24-hour review period.
                    </p>
                    <button
                        type="button"
                        onClick={() => setShowTerms(true)}
                        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-md transition-all transform hover:scale-[1.02]"
                    >
                        <VideoCameraIcon className="h-6 w-6 mr-2" />
                        Start Client Demo
                    </button>
                    <p className="text-xs text-gray-500">Pre-approved email required. Access expires 24 hours after authorization.</p>
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Authorized Personnel Login</span>
                    </div>
                </div>
                
                <form className="space-y-4" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="id-address" className="sr-only">ID / Badge Number</label>
                            <input
                                id="id-address"
                                name="id"
                                type="text"
                                autoComplete="username"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-gray-50 rounded-t-md focus:outline-none focus:ring-atlas-blue focus:border-atlas-blue focus:z-10 sm:text-sm focus:bg-white transition-colors"
                                placeholder="User ID or Badge Number"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password-input" className="sr-only">Password</label>
                            <input
                                id="password-input"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-gray-50 rounded-b-md focus:outline-none focus:ring-atlas-blue focus:border-atlas-blue focus:z-10 sm:text-sm focus:bg-white transition-colors"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                        >
                            {isLoading ? 'Verifying...' : 'Log In'}
                        </button>
                    </div>
                </form>
                
                <p className="text-xs text-center text-gray-400 mt-4">
                    Restricted Access System. All activities monitored.
                </p>
            </div>

            {/* Footer: Factory Reset for Demo Hygiene */}
            <div className="mt-8 text-center opacity-50 hover:opacity-100 transition-opacity">
                <button 
                    onClick={handleReset}
                    className="flex items-center text-xs text-gray-400 hover:text-red-400"
                    title="Clear all local data and restore defaults"
                >
                    <TrashIcon className="h-3 w-3 mr-1"/>
                    Reset System Data (Factory Reset)
                </button>
            </div>

            {/* Terms Modal Overlay */}
            {showTerms && (
                <TermsModal 
                    onClose={() => setShowTerms(false)} 
                    onAccept={handleTermsAccepted} 
                />
            )}
        </div>
    );
};

export default LoginPage;
