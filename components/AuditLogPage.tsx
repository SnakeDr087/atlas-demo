// FIX: Populating placeholder file to resolve module errors.
import React, { useState, useEffect } from 'react';
import Header from './Header.tsx';
import AuditLogList from './AuditLogList.tsx';
import { getAuditLog } from '../services/auditLogService.ts';
import type { AuditLogItem } from '../types.ts';

const AuditLogPage: React.FC = () => {
    const [logItems, setLogItems] = useState<AuditLogItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLog = async () => {
            setIsLoading(true);
            try {
                const data = await getAuditLog();
                setLogItems(data);
            } catch (error) {
                console.error("Failed to fetch audit log", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLog();
    }, []);

    return (
        <div className="p-8 space-y-8">
            <Header title="System Audit Log" />
            
            <div className="flex justify-between items-center">
                <div>
                    <input 
                        type="text" 
                        placeholder="Search by user, action, or IP..."
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-atlas-blue text-gray-900 placeholder-gray-400"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center pt-10">
                    <div className="w-12 h-12 border-4 border-atlas-blue border-dashed rounded-full animate-spin"></div>
                </div>
            ) : (
                <AuditLogList logItems={logItems} />
            )}
        </div>
    );
};

export default AuditLogPage;
