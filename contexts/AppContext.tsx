import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';

// Import all services
import * as authService from '../services/authService';
import * as agencyService from '../services/agencyService';
import * as officerService from '../services/officerService';
import * as reportService from '../services/reportService';
import * as reviewService from '../services/reviewService';
import * as pipService from '../services/pipService';
import * as ticketService from '../services/ticketService';
import * as registrationService from '../services/registrationService';
import * as userService from '../services/userService';
import * as auditLogService from '../services/auditLogService';
import * as accessService from '../services/accessService';
import { resetSystemData } from '../services/mockApi';

// Import all types
import type {
    User,
    Agency,
    Officer,
    Report,
    BwcReport,
    SentimentReport,
    InPersonReview,
    PerformanceImprovementPlan,
    TroubleTicket,
    Invoice,
    PendingOfficer,
    AuditLogItem,
    Toast,
    ConfirmationState,
    UserRole,
    ViewType,
} from '../types';

// --- CONFIGURATION ---
// Configured with provided Formspree ID for login tracking
const FORMSPREE_FORM_ID: string = "xdkveqeg"; 

interface AppContextType {
    currentUser: User | null;
    isLoading: boolean;
    login: (id: string, pass: string) => Promise<User | null>;
    loginAsGuest: (email: string) => void;
    validateGuestAccess: (email: string) => Promise<boolean>;
    logout: () => void;
    isTrialExpired: boolean;
    
    // Data states
    users: User[];
    agencies: Agency[];
    officers: Officer[];
    reports: Report[];
    bwcReports: BwcReport[];
    sentimentReports: SentimentReport[];
    reviews: InPersonReview[];
    pips: PerformanceImprovementPlan[];
    tickets: TroubleTicket[];
    invoices: Invoice[];
    pendingOfficers: PendingOfficer[];
    auditLog: AuditLogItem[];

    // CRUD functions
    addAgency: (agencyData: any) => Promise<{ newAgency: Agency; credentials?: { username: string; password: string; }; } | undefined>;
    updateAgency: (agencyData: Agency) => Promise<void>;
    deleteAgency: (agencyId: string) => Promise<void>;
    
    addOfficer: (officerData: Omit<Officer, 'id' | 'incidents' | 'score'>) => Promise<void>;
    updateOfficer: (officerData: Officer) => Promise<void>;
    deleteOfficer: (officerId: string) => void;

    addBwcReport: (reportData: Omit<BwcReport, 'id'>) => Promise<void>;
    updateBwcReport: (reportData: BwcReport) => Promise<void>;
    deleteBwcReport: (reportId: string) => Promise<void>;

    addSentimentReport: (reportData: Omit<SentimentReport, 'id'>) => Promise<void>;
    
    addReview: (reviewData: Omit<InPersonReview, 'id'>) => Promise<void>;
    updateReview: (reviewData: InPersonReview) => Promise<void>;
    deleteReview: (reviewId: string) => void;

    addPip: (pipData: Omit<PerformanceImprovementPlan, 'id'>) => Promise<void>;
    updatePip: (pipData: PerformanceImprovementPlan) => Promise<void>;
    deletePip: (pipId: string) => void;

    addTicket: (ticketData: Omit<TroubleTicket, 'id' | 'submitter' | 'agency' | 'date' | 'status'>) => Promise<void>;

    addInvoice: (invoiceData: Omit<Invoice, 'id'>) => Promise<void>;

    approveRegistration: (pendingOfficerId: string, updatedData?: Partial<Omit<PendingOfficer, 'id' | 'status'>>) => Promise<void>;
    denyRegistration: (pendingOfficerId: string) => void;

    addUser: (userData: {name: string; email: string; role: UserRole; agency?: string;}) => Promise<{ user: User; tempPass: string } | undefined>;
    updateUser: (userId: string, userData: Partial<User>) => Promise<void>;
    toggleUserStatus: (userId: string) => Promise<void>;
    resetUserPassword: (userId: string) => Promise<{ tempPass: string } | undefined>;
    
    // Access Control
    getAuthorizedGuests: () => Promise<{email: string, created_at?: string}[]>;
    addAuthorizedGuest: (email: string) => Promise<boolean>;
    removeAuthorizedGuest: (email: string) => Promise<boolean>;
    
    resetSystem: () => Promise<void>;

    // UI states
    toasts: Toast[];
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
    removeToast: (id: number) => void;
    confirmation: ConfirmationState;
    showConfirmation: (payload: Omit<ConfirmationState, 'isOpen'>) => void;
    hideConfirmation: () => void;
    activePage: ViewType;
    setActivePage: React.Dispatch<React.SetStateAction<ViewType>>;
    editingBwcReportId: string | null;
    setEditingBwcReportId: React.Dispatch<React.SetStateAction<string | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children?: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activePage, setActivePage] = useState<ViewType>('Dashboard');
    const [editingBwcReportId, setEditingBwcReportId] = useState<string | null>(null);
    const [isTrialExpired, setIsTrialExpired] = useState(false);
    
    // Data states
    const [users, setUsers] = useState<User[]>([]);
    const [agencies, setAgencies] = useState<Agency[]>([]);
    const [officers, setOfficers] = useState<Officer[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [bwcReports, setBwcReports] = useState<BwcReport[]>([]);
    const [sentimentReports, setSentimentReports] = useState<SentimentReport[]>([]);
    const [reviews, setReviews] = useState<InPersonReview[]>([]);
    const [pips, setPips] = useState<PerformanceImprovementPlan[]>([]);
    const [tickets, setTickets] = useState<TroubleTicket[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [pendingOfficers, setPendingOfficers] = useState<PendingOfficer[]>([]);
    const [auditLog, setAuditLog] = useState<AuditLogItem[]>([]);

    // UI states
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [confirmation, setConfirmation] = useState<ConfirmationState>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

    // UI Feedback Handlers
    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
        const newToast: Toast = { id: Date.now(), message, type };
        setToasts(prev => [...prev, newToast]);
    }, []);
    const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));
    const showConfirmation = (payload: Omit<ConfirmationState, 'isOpen'>) => setConfirmation({ ...payload, isOpen: true });
    const hideConfirmation = () => setConfirmation({ isOpen: false, title: '', message: '', onConfirm: () => {} });

    // Data Fetching
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const dataPromises = [
                userService.getUsers(),
                agencyService.getAgencies(),
                officerService.getOfficers(),
                reportService.getReports(),
                reportService.getBwcReports(),
                reportService.getSentimentReports(),
                reviewService.getInPersonReviews(),
                pipService.getPips(),
                ticketService.getTickets(),
                agencyService.getInvoices(),
                registrationService.getPendingRegistrations(),
                auditLogService.getAuditLog(),
            ];
            const [
                usersData, agenciesData, officersData, reportsData, bwcReportsData,
                sentimentReportsData, reviewsData, pipsData, ticketsData, invoicesData,
                pendingData, auditLogData
            ] = await Promise.all(dataPromises);

            setUsers(usersData);
            setAgencies(agenciesData);
            setOfficers(officersData);
            setReports(reportsData);
            setBwcReports(bwcReportsData);
            setSentimentReports(sentimentReportsData);
            setReviews(reviewsData);
            setPips(pipsData);
            setTickets(ticketsData);
            setInvoices(invoicesData);
            setPendingOfficers(pendingData);
            setAuditLog(auditLogData);
        } catch (error) {
            console.error("Failed to fetch initial data:", error);
            showToast('Failed to load application data.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        if (currentUser) {
            fetchData();
        }
    }, [currentUser, fetchData]);

    // --- Telemetry Helper ---
    const sendLoginTelemetry = async (type: string, username: string) => {
        if (FORMSPREE_FORM_ID === "YOUR_FORMSPREE_ID") return; 

        try {
            await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    event: 'LOGIN_SUCCESS',
                    type: type,
                    username: username,
                    timestamp: new Date().toLocaleString(),
                    userAgent: navigator.userAgent
                })
            });
        } catch (error) {
            console.error("Telemetry error:", error);
        }
    };

    // Authentication
    const login = async (id: string, pass: string): Promise<User | null> => {
        const user = await authService.authenticate(id, pass);
        if (user) {
            setCurrentUser(user);
            setActivePage('Dashboard');
            setIsTrialExpired(false);
            sendLoginTelemetry('Direct Login', user.name);
        }
        return user;
    };

    // Check if guest email is approved via Service (Supabase/Local)
    const validateGuestAccess = async (email: string): Promise<boolean> => {
        return await accessService.checkEmailAuthorized(email);
    };

    // GUEST / DEMO LOGIN LOGIC
    const loginAsGuest = (email: string) => {
        const guestUser: User = {
            id: 'guest_demo',
            name: 'Guest Reviewer',
            role: 'Agency Supervisor',
            agency: 'Central Police Department',
            status: 'Active',
            isGuest: true
        };
        
        // Set expiry for 24 hours from now
        const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
        localStorage.setItem('atlas_guest_expiry', expiryTime.toString());
        
        setCurrentUser(guestUser);
        setActivePage('Dashboard');
        setIsTrialExpired(false);

        // Fire silent telemetry with specific email
        sendLoginTelemetry('Guest Demo Access', email);
    };

    // Check trial expiry ONLY for guests
    useEffect(() => {
        if (currentUser?.isGuest) {
            const checkExpiry = () => {
                const expiry = localStorage.getItem('atlas_guest_expiry');
                if (expiry && Date.now() > parseInt(expiry, 10)) {
                    setIsTrialExpired(true);
                }
            };
            
            // Check immediately and then every minute
            checkExpiry();
            const interval = setInterval(checkExpiry, 60000);
            return () => clearInterval(interval);
        }
    }, [currentUser]);

    const logout = () => {
        setCurrentUser(null);
        setActivePage('Dashboard');
        setIsTrialExpired(false);
    };
    
    const addAuditLog = useCallback(async (action: string, details: string) => {
        if (!currentUser) return;
        if (currentUser.isGuest) return; 

        try {
            const newLog = await auditLogService.addAuditLogItem({
                user: currentUser.name,
                role: currentUser.role,
                action,
                details
            });
            setAuditLog(prev => [newLog, ...prev]);
        } catch (error) {
            console.error("Failed to add audit log:", error);
        }
    }, [currentUser]);

    // CRUD Functions
    const addAgency = async (agencyData: any) => {
        try {
            const result = await agencyService.addAgency(agencyData);
            if (result) {
                setAgencies(prev => [...prev, result.newAgency]);
                setUsers(prev => [...prev, {
                    id: result.credentials?.username || '',
                    name: result.newAgency.liaison,
                    role: 'Agency Admin',
                    agency: result.newAgency.name,
                    status: 'Active'
                }]);
                showToast('Agency created successfully!', 'success');
                return result;
            }
        } catch (e) { showToast('Failed to create agency.', 'error'); }
    };
    const updateAgency = async (agencyData: Agency) => {
        try {
            const updated = await agencyService.updateAgency(agencyData);
            setAgencies(prev => prev.map(a => a.id === updated.id ? updated : a));
            showToast('Agency updated successfully!', 'success');
        } catch (e) { showToast('Failed to update agency.', 'error'); }
    };
    const deleteAgency = async (agencyId: string) => {
        try {
            const updated = await agencyService.deleteAgency(agencyId);
            setAgencies(prev => prev.map(a => a.id === updated.id ? updated : a));
            showToast('Agency deactivated.', 'info');
        } catch (e) { showToast('Failed to deactivate agency.', 'error'); }
    };

    const addOfficer = async (officerData: Omit<Officer, 'id' | 'incidents' | 'score'>) => {
        try {
            const newOfficer = await officerService.addOfficer(officerData);
            setOfficers(prev => [...prev, newOfficer]);
            showToast('Officer added successfully!', 'success');
        } catch (e) { showToast('Failed to add officer.', 'error'); }
    };
    const updateOfficer = async (officerData: Officer) => {
        try {
            const updated = await officerService.updateOfficer(officerData);
            setOfficers(prev => prev.map(o => o.id === updated.id ? updated : o));
            showToast('Officer updated successfully!', 'success');
        } catch (e) { showToast('Failed to update officer.', 'error'); }
    };
    const deleteOfficer = (officerId: string) => {
        showConfirmation({
            title: 'Delete Officer?',
            message: 'Are you sure you want to delete this officer? This action cannot be undone.',
            onConfirm: async () => {
                try {
                    await officerService.deleteOfficer(officerId);
                    setOfficers(prev => prev.filter(o => o.id !== officerId));
                    showToast('Officer deleted.', 'info');
                } catch (e) { showToast('Failed to delete officer.', 'error'); }
            },
        });
    };
    
    const addUser = async (userData: {name: string, email: string, role: UserRole, agency?: string}) => {
        try {
            const result = await userService.addUser(userData);
            setUsers(prev => [...prev, result.user]);
            showToast('User created successfully!', 'success');
            return result;
        } catch (e) { showToast('Failed to create user.', 'error'); }
    };
    const updateUser = async (userId: string, userData: Partial<User>) => {
        try {
            const updated = await userService.updateUser(userId, userData);
            setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
            showToast('User updated successfully!', 'success');
        } catch(e) { showToast('Failed to update user.', 'error'); }
    };
    const toggleUserStatus = async (userId: string) => {
        try {
            const updated = await userService.toggleUserStatus(userId);
            setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
            showToast(`User status changed to ${updated.status}.`, 'info');
        } catch (e) { showToast('Failed to update user status.', 'error'); }
    };
    const resetUserPassword = async (userId: string) => {
        try {
            const result = await userService.resetPassword(userId);
            showToast('Password reset successfully!', 'success');
            return result;
        } catch (e) { showToast('Failed to reset password.', 'error'); }
    };

    const addBwcReport = async (reportData: Omit<BwcReport, 'id'>) => {
        try {
            const newReport = await reportService.addBwcReport(reportData);
            setBwcReports(prev => [newReport, ...prev]);
            const officer = officers.find(o => o.id === newReport.personnel.primaryOfficer);
            const officerName = officer ? `${officer.firstName} ${officer.lastName}` : 'Unknown';
            addAuditLog('BWC_REPORT_CREATED', `Created report ${newReport.caseNumber} for officer ${officerName}.`);
            showToast('BWC report created!', 'success');
        } catch (e) { showToast('Failed to create BWC report.', 'error'); }
    };
    const updateBwcReport = async (reportData: BwcReport) => {
        try {
            const updated = await reportService.updateBwcReport(reportData);
            setBwcReports(prev => prev.map(r => r.id === updated.id ? updated : r));
            addAuditLog('BWC_REPORT_UPDATED', `Updated report ${updated.caseNumber} (ID: ${updated.id}).`);
            showToast('BWC report updated.', 'success');
        } catch (e) { showToast('Failed to update BWC report.', 'error'); }
    };
    const deleteBwcReport = async (reportId: string) => {
        try {
            await reportService.deleteBwcReport(reportId);
            setBwcReports(prev => prev.filter(r => r.id !== reportId));
            addAuditLog('BWC_REPORT_DELETED', `Deleted report ID: ${reportId}.`);
            showToast('BWC report deleted.', 'info');
        } catch (e) { showToast('Failed to delete BWC report.', 'error'); }
    };

    const addSentimentReport = async (reportData: Omit<SentimentReport, 'id'>) => {
        try {
            const newReport = await reportService.addSentimentReport(reportData);
            setSentimentReports(prev => [newReport, ...prev]);
            showToast('Sentiment report added.', 'success');
        } catch (e) { showToast('Failed to add sentiment report.', 'error'); }
    };

    const addReview = async (reviewData: Omit<InPersonReview, 'id'>) => {
        try {
            const newReview = await reviewService.addReview(reviewData);
            setReviews(prev => [newReview, ...prev].sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime()));
            showToast('Review saved successfully!', 'success');
        } catch (e) { showToast('Failed to save review.', 'error'); }
    };
    const updateReview = async (reviewData: InPersonReview) => {
        try {
            const updated = await reviewService.updateReview(reviewData);
            setReviews(prev => prev.map(r => r.id === updated.id ? updated : r));
            showToast('Review updated successfully!', 'success');
        } catch (e) { showToast('Failed to update review.', 'error'); }
    };
    const deleteReview = (reviewId: string) => {
        showConfirmation({
            title: 'Delete Review?',
            message: 'Are you sure you want to delete this review record?',
            onConfirm: async () => {
                try {
                    await reviewService.deleteReview(reviewId);
                    setReviews(prev => prev.filter(r => r.id !== reviewId));
                    showToast('Review deleted.', 'info');
                } catch (e) { showToast('Failed to delete review.', 'error'); }
            },
        });
    };
    
    const addPip = async (pipData: any) => {};
    const updatePip = async (pipData: any) => {};
    const deletePip = (pipId: string) => {
        showConfirmation({
            title: 'Delete PIP?',
            message: 'Are you sure you want to delete this Performance Improvement Plan?',
            onConfirm: () => showToast(`PIP ${pipId} deleted.`, 'info'),
        });
    };
    
    const addTicket = async (ticketData: any) => {
        if (!currentUser) return;
        const newTicket = { ...ticketData, submitter: currentUser.name, agency: currentUser.agency || 'N/A' };
        setTickets(prev => [newTicket, ...prev]);
        showToast('Support ticket submitted successfully!', 'success');
    };
    
    const addInvoice = async (invoiceData: Omit<Invoice, 'id'>) => {
        try {
            const newInvoice = await agencyService.addInvoice(invoiceData);
            setInvoices(prev => [newInvoice, ...prev]);
            showToast('Invoice added successfully!', 'success');
        } catch (e) { showToast('Failed to add invoice.', 'error'); }
    };

    const approveRegistration = async (pendingOfficerId: string, updatedData?: Partial<Omit<PendingOfficer, 'id' | 'status'>>) => {
        try {
            await registrationService.approveRegistration(pendingOfficerId, updatedData);
            setPendingOfficers(prev => prev.filter(p => p.id !== pendingOfficerId));
            await fetchData(); // Re-fetch all data to get new officer/user
            showToast('Registration approved!', 'success');
        } catch (e) { showToast('Failed to approve registration.', 'error'); }
    };
    const denyRegistration = (pendingOfficerId: string) => {
        showConfirmation({
            title: 'Deny Registration?',
            message: "Are you sure you want to deny this officer's registration request?",
            onConfirm: async () => {
                try {
                    await registrationService.denyRegistration(pendingOfficerId);
                    setPendingOfficers(prev => prev.filter(p => p.id !== pendingOfficerId));
                    showToast('Registration denied.', 'info');
                } catch (e) { showToast('Failed to deny registration.', 'error'); }
            },
        });
    };
    
    // --- Access Control Methods ---
    const getAuthorizedGuests = async () => {
        return await accessService.getAuthorizedGuests();
    };
    
    const addAuthorizedGuest = async (email: string) => {
        try {
            const success = await accessService.addAuthorizedGuest(email);
            if (success) {
                showToast('Guest email added to authorized list.', 'success');
            } else {
                showToast('Guest email already exists.', 'info');
            }
            return success;
        } catch (e) {
            showToast('Failed to add guest email.', 'error');
            return false;
        }
    };

    const removeAuthorizedGuest = async (email: string) => {
        try {
            await accessService.removeAuthorizedGuest(email);
            showToast('Guest email removed.', 'info');
            return true;
        } catch (e) {
            showToast('Failed to remove guest.', 'error');
            return false;
        }
    }
    
    const resetSystem = async () => {
        await resetSystemData();
    };

    const value = {
        currentUser, isLoading, login, loginAsGuest, validateGuestAccess, logout, isTrialExpired,
        users, agencies, officers, reports, bwcReports,
        sentimentReports, reviews, pips, tickets, invoices, pendingOfficers, auditLog,
        addAgency, updateAgency, deleteAgency, addOfficer, updateOfficer, deleteOfficer,
        addUser, updateUser, toggleUserStatus, resetUserPassword,
        addBwcReport, updateBwcReport, deleteBwcReport, addSentimentReport,
        addReview, updateReview, deleteReview, addPip, updatePip, deletePip, addTicket, addInvoice,
        approveRegistration, denyRegistration, resetSystem,
        getAuthorizedGuests, addAuthorizedGuest, removeAuthorizedGuest,
        toasts, removeToast, showToast, confirmation, showConfirmation, hideConfirmation,
        activePage, setActivePage,
        editingBwcReportId, setEditingBwcReportId,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};