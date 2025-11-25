
import React, { useState, useEffect } from 'react';
import { InformationCircleIcon, CloseIcon, ServerIcon, ShieldCheckIcon } from './IconComponents.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { isSupabaseConfigured } from '../services/supabaseClient.ts';

const DemoBanner: React.FC = () => {
    const { currentUser } = useAppContext();
    const [isVisible, setIsVisible] = useState(true);
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        if (currentUser?.isGuest) {
            const updateTimer = () => {
                const expiry = localStorage.getItem('atlas_guest_expiry');
                if (expiry) {
                    const diff = parseInt(expiry, 10) - Date.now();
                    if (diff > 0) {
                        const hrs = Math.floor(diff / (1000 * 60 * 60));
                        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                        setTimeLeft(`${hrs}h ${mins}m`);
                    } else {
                        setTimeLeft('Expired');
                    }
                }
            };
            updateTimer();
            const interval = setInterval(updateTimer, 60000);
            return () => clearInterval(interval);
        }
    }, [currentUser]);

    if (!isVisible) return null;

    return (
        <div className={`border-b px-4 py-3 sm:px-6 relative z-50 transition-colors duration-500 ${currentUser?.isGuest ? 'bg-purple-50 border-purple-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center flex-1 min-w-0">
                    <span className={`flex p-2 rounded-lg flex-shrink-0 ${currentUser?.isGuest ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-600'}`}>
                        <InformationCircleIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className={`ml-3 font-medium truncate ${currentUser?.isGuest ? 'text-purple-800' : 'text-amber-800'}`}>
                        {currentUser?.isGuest ? (
                            <span>
                                <span className="font-bold">GUEST VIEW MODE:</span> Access resets in {timeLeft}.
                            </span>
                        ) : (
                            <span>
                                <span className="hidden md:inline">DEMO MODE: Application is running in prototype mode.</span>
                                <span className="md:hidden">DEMO MODE</span>
                            </span>
                        )}
                    </div>
                </div>
                
                {/* Security / Storage Indicator */}
                <div className="hidden sm:flex items-center px-3 py-1 rounded-full bg-white/60 border border-gray-200 text-xs font-semibold text-gray-600">
                    {isSupabaseConfigured ? (
                        <>
                            <ShieldCheckIcon className="h-4 w-4 text-green-600 mr-1.5" />
                            Storage: Secure Cloud
                        </>
                    ) : (
                        <>
                            <ServerIcon className="h-4 w-4 text-amber-500 mr-1.5" />
                            Storage: Local Browser (Insecure)
                        </>
                    )}
                </div>

                <div className="flex-shrink-0 sm:ml-3">
                    <button
                        type="button"
                        onClick={() => setIsVisible(false)}
                        className={`-mr-1 flex p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white ${currentUser?.isGuest ? 'hover:bg-purple-100 text-purple-600' : 'hover:bg-amber-100 text-amber-600'}`}
                    >
                        <span className="sr-only">Dismiss</span>
                        <CloseIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DemoBanner;
