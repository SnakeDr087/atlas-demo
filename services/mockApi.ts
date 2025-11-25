
import { mockUsers } from '../data/mockUsers';
import { mockAgencies } from '../data/mockAgencies';
import { mockOfficers } from '../data/mockOfficers';
import { mockReports } from '../data/mockReports';
import { mockBwcReports } from '../data/mockBwcReports';
import { mockInPersonReviews } from '../data/mockInPersonReviews';
import { mockPips } from '../data/mockPips';
import { mockTickets } from '../data/mockTickets';
import { mockInvoices } from '../data/mockInvoices';
import { mockAuditLog } from '../data/mockAuditLog';
import { mockPendingOfficers } from '../data/mockPendingOfficers';
import { mockSentimentReports } from '../data/mockSentimentReports';
import { baselineDispositions, baselineIncidentTypes, baselineKpis, baselineSafetyItems } from '../data/baselineConfig';
import type { Agency, AuditLogItem, BwcReport, InPersonReview, Invoice, Officer, PendingOfficer, PerformanceImprovementPlan, Report, SentimentReport, TroubleTicket, User } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

// --- Persistence Helpers ---
export const STORAGE_KEYS = {
    USERS: 'atlas_users',
    AGENCIES: 'atlas_agencies',
    OFFICERS: 'atlas_officers',
    REPORTS: 'atlas_reports',
    BWC_REPORTS: 'atlas_bwc_reports',
    REVIEWS: 'atlas_reviews',
    PIPS: 'atlas_pips',
    TICKETS: 'atlas_tickets',
    INVOICES: 'atlas_invoices',
    AUDIT_LOG: 'atlas_audit_log',
    PENDING_OFFICERS: 'atlas_pending_officers',
    SENTIMENT_REPORTS: 'atlas_sentiment_reports',
    GUEST_EXPIRY: 'atlas_guest_expiry'
};

const loadFromStorage = <T>(key: string, defaultData: T[]): T[] => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultData;
    } catch (e) {
        console.error(`Error loading ${key} from storage`, e);
        return defaultData;
    }
};

const saveToStorage = (key: string, data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error(`Error saving ${key} to storage`, e);
    }
};

// --- Initialize Data from Storage or Mocks ---
let users: User[] = loadFromStorage(STORAGE_KEYS.USERS, [...mockUsers]);
let agencies: Agency[] = loadFromStorage(STORAGE_KEYS.AGENCIES, [...mockAgencies]);
let officers: Officer[] = loadFromStorage(STORAGE_KEYS.OFFICERS, [...mockOfficers]);
let reports: Report[] = loadFromStorage(STORAGE_KEYS.REPORTS, [...mockReports]);
let bwcReports: BwcReport[] = loadFromStorage(STORAGE_KEYS.BWC_REPORTS, [...mockBwcReports]);
let reviews: InPersonReview[] = loadFromStorage(STORAGE_KEYS.REVIEWS, [...mockInPersonReviews]);
let pips: PerformanceImprovementPlan[] = loadFromStorage(STORAGE_KEYS.PIPS, [...mockPips]);
let tickets: TroubleTicket[] = loadFromStorage(STORAGE_KEYS.TICKETS, [...mockTickets]);
let invoices: Invoice[] = loadFromStorage(STORAGE_KEYS.INVOICES, [...mockInvoices]);
let auditLog: AuditLogItem[] = loadFromStorage(STORAGE_KEYS.AUDIT_LOG, [...mockAuditLog]);
let pendingOfficers: PendingOfficer[] = loadFromStorage(STORAGE_KEYS.PENDING_OFFICERS, [...mockPendingOfficers]);
let sentimentReports: SentimentReport[] = loadFromStorage(STORAGE_KEYS.SENTIMENT_REPORTS, [...mockSentimentReports]);

const generatePassword = () => Math.random().toString(36).slice(-8);

// --- Reset Functionality ---
export const resetSystemData = async () => {
    // Force clear entire local storage to ensure no lingering data/tokens
    localStorage.clear();
    
    // Reload window to re-initialize from mocks
    window.location.reload();
    return true;
};

const apiRouter = async (url: string, options: RequestInit = {}) => {
    console.log(`Mock API call: ${options.method || 'GET'} ${url}`);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : {};

    // AUTH - UPDATED TO CHECK SUPABASE
    if (url === '/api/auth/login' && method === 'POST') {
        let user: User | undefined;

        // 1. Check Cloud Database (Secure)
        if (isSupabaseConfigured) {
            const { data, error } = await supabase
                .from('system_users')
                .select('*')
                .eq('id', body.id)
                .eq('password', body.password)
                .maybeSingle();
            
            if (data && !error) {
                user = data as User;
            }
        }

        // 2. Fallback to Local Mock Users (for demo/dev if DB fails or for Officer accounts not in DB)
        if (!user) {
            user = users.find(u => (u.id === body.id || (u.role === 'Officer' && u.id === body.id)) && u.password === body.password);
        }

        if (user) return new Response(JSON.stringify({ user }), { status: 200 });
        return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }

    // USERS
    if (url === '/api/users' && method === 'GET') {
        // Try Supabase first
        if (isSupabaseConfigured) {
            const { data, error } = await supabase.from('system_users').select('*');
            if (!error && data) {
                return new Response(JSON.stringify(data), { status: 200 });
            }
        }
        return new Response(JSON.stringify(users), { status: 200 });
    }

    if (url === '/api/users' && method === 'POST') {
        const tempPass = generatePassword();
        const newUser: User = {
            id: body.email,
            name: body.name,
            role: body.role,
            agency: body.agency,
            password: tempPass,
            status: 'Active',
        };

        // Try Supabase first
        if (isSupabaseConfigured) {
            const { error } = await supabase.from('system_users').insert([newUser]);
            if (!error) {
                return new Response(JSON.stringify({ user: newUser, tempPass }), { status: 201 });
            } else {
                console.error("Supabase insert error:", error);
            }
        }

        // Fallback
        users = [...users, newUser];
        saveToStorage(STORAGE_KEYS.USERS, users);
        return new Response(JSON.stringify({ user: newUser, tempPass }), { status: 201 });
    }

    const userMatch = url.match(/^\/api\/users\/(.+)$/);
    if (userMatch) {
        const userId = userMatch[1];
        
        // Toggle Status
        if (url.endsWith('/status') && method === 'PUT') {
            // Try Supabase
            if (isSupabaseConfigured) {
                const { data: currentUser } = await supabase.from('system_users').select('status').eq('id', userId).single();
                if (currentUser) {
                    const newStatus = currentUser.status === 'Active' ? 'Inactive' : 'Active';
                    const { data, error } = await supabase
                        .from('system_users')
                        .update({ status: newStatus })
                        .eq('id', userId)
                        .select()
                        .single();
                    if (!error && data) return new Response(JSON.stringify(data), { status: 200 });
                }
            }

            // Fallback
            const user = users.find(u => u.id === userId);
            if(user) {
                user.status = user.status === 'Active' ? 'Inactive' : 'Active';
                users = users.map(u => u.id === userId ? user! : u);
                saveToStorage(STORAGE_KEYS.USERS, users);
                return new Response(JSON.stringify(user), { status: 200 });
            }
        }

        // Reset Password
        if(url.endsWith('/reset-password') && method === 'POST') {
             const tempPass = generatePassword();
             
             // Try Supabase
             if (isSupabaseConfigured) {
                 const { error } = await supabase
                    .from('system_users')
                    .update({ password: tempPass })
                    .eq('id', userId);
                 if (!error) return new Response(JSON.stringify({ tempPass }), { status: 200 });
             }

             // Fallback
             const user = users.find(u => u.id === userId);
             if (user) {
                user.password = tempPass;
                return new Response(JSON.stringify({ tempPass }), { status: 200 });
             }
        }

        // Update User Details
        if (method === 'PUT') {
             // Try Supabase
             if (isSupabaseConfigured) {
                 const { data, error } = await supabase
                    .from('system_users')
                    .update(body)
                    .eq('id', userId)
                    .select()
                    .single();
                 if (!error && data) return new Response(JSON.stringify(data), { status: 200 });
             }

             // Fallback
             let user = users.find(u => u.id === userId);
             if (user) {
                 user = { ...user, ...body };
                 users = users.map(u => u.id === userId ? user! : u);
                 saveToStorage(STORAGE_KEYS.USERS, users);
                 return new Response(JSON.stringify(user), { status: 200 });
             }
        }
    }


    // AGENCIES
    if (url === '/api/agencies' && method === 'GET') return new Response(JSON.stringify(agencies), { status: 200 });
    if (url === '/api/agencies' && method === 'POST') {
        const tempPass = generatePassword();
        const newAgency: Agency = {
            id: `${body.name.substring(0, 3).toUpperCase()}-${String(agencies.length + 1).padStart(3, '0')}`,
            name: body.name,
            liaison: `${body.liaisonFirstName} ${body.liaisonLastName}`,
            contact: body.liaisonEmail,
            status: 'Pending',
            officerCount: 0,
            score: 0,
            openCases: 0,
            subscriptionPlan: 'Pro',
            monthlyCost: 4999,
            storageUsed: 0,
            storageAllocated: 1024,
            bwcVideoAnalysis: body.bwcVideoAnalysis,
            sentimentAnalysis: body.sentimentAnalysis,
            customIncidentTypes: baselineIncidentTypes,
            customKpis: baselineKpis,
            customSafetyItems: baselineSafetyItems,
            customDispositions: baselineDispositions,
        };
        agencies = [...agencies, newAgency];
        saveToStorage(STORAGE_KEYS.AGENCIES, agencies);

        const newAdmin: User = {
            id: body.liaisonEmail,
            name: `${body.liaisonFirstName} ${body.liaisonLastName}`,
            role: 'Agency Admin',
            agency: newAgency.name,
            password: tempPass,
            status: 'Active',
        };
        
        // Also create the agency admin in Supabase if configured
        if (isSupabaseConfigured) {
            await supabase.from('system_users').insert([newAdmin]);
        } else {
            users = [...users, newAdmin];
            saveToStorage(STORAGE_KEYS.USERS, users);
        }

        return new Response(JSON.stringify({ newAgency, credentials: { username: newAdmin.id, password: tempPass } }), { status: 201 });
    }
    const agencyMatch = url.match(/^\/api\/agencies\/(.+)$/);
    if (agencyMatch) {
        const agencyId = agencyMatch[1];
        if (method === 'PUT') {
            let agency = agencies.find(a => a.id === agencyId);
            if (agency) {
                agency = { ...agency, ...body };
                agencies = agencies.map(a => a.id === agencyId ? agency! : a);
                saveToStorage(STORAGE_KEYS.AGENCIES, agencies);
                return new Response(JSON.stringify(agency), { status: 200 });
            }
        }
        if (method === 'DELETE') {
            const agency = agencies.find(a => a.id === agencyId);
            if (agency) {
                agency.status = 'Inactive';
                agencies = agencies.map(a => a.id === agencyId ? agency! : a);
                saveToStorage(STORAGE_KEYS.AGENCIES, agencies);
                return new Response(JSON.stringify(agency), { status: 200 });
            }
        }
    }

    // OFFICERS
    if (url === '/api/officers' && method === 'GET') return new Response(JSON.stringify(officers), { status: 200 });
    if (url === '/api/officers' && method === 'POST') {
        const newOfficer: Officer = {
            id: `OFF-${String(officers.length + 10).padStart(3, '0')}`,
            incidents: 0,
            score: 100,
            ...body
        };
        officers = [...officers, newOfficer];
        saveToStorage(STORAGE_KEYS.OFFICERS, officers);

        const agency = agencies.find(a => a.name === newOfficer.agency);
        if (agency) {
            agency.officerCount++;
            saveToStorage(STORAGE_KEYS.AGENCIES, agencies);
        }

        return new Response(JSON.stringify(newOfficer), { status: 201 });
    }
    const officerMatch = url.match(/^\/api\/officers\/(.+)$/);
    if (officerMatch) {
        const officerId = officerMatch[1];
        if (method === 'PUT') {
            let officer = officers.find(o => o.id === officerId);
            if (officer) {
                officer = { ...officer, ...body };
                officers = officers.map(o => o.id === officerId ? officer! : o);
                saveToStorage(STORAGE_KEYS.OFFICERS, officers);
                return new Response(JSON.stringify(officer), { status: 200 });
            }
        }
        if (method === 'DELETE') {
            officers = officers.filter(o => o.id !== officerId);
            saveToStorage(STORAGE_KEYS.OFFICERS, officers);
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }
    }

    // REPORTS
    if (url === '/api/reports' && method === 'GET') return new Response(JSON.stringify(reports), { status: 200 });

    // BWC REPORTS
    if (url === '/api/bwc-reports' && method === 'GET') return new Response(JSON.stringify(bwcReports), { status: 200 });
    if (url === '/api/bwc-reports' && method === 'POST') {
        const newReport: BwcReport = {
            ...body,
            id: `BWC-REP-${Date.now()}`
        };
        bwcReports = [newReport, ...bwcReports];
        saveToStorage(STORAGE_KEYS.BWC_REPORTS, bwcReports);
        
        // Update summary reports list too for consistency if needed
        const summaryRep: Report = {
            id: `REP-${Date.now()}`,
            caseNumber: newReport.caseNumber,
            officer: officers.find(o => o.id === newReport.personnel.primaryOfficer) || officers[0],
            incidentDate: newReport.incidentDate,
            reportDate: newReport.reviewDate,
            status: 'Review Complete',
            outcome: newReport.followUp as any,
            incidentType: newReport.incidentType
        };
        reports = [summaryRep, ...reports];
        saveToStorage(STORAGE_KEYS.REPORTS, reports);

        return new Response(JSON.stringify(newReport), { status: 201 });
    }
    const bwcMatch = url.match(/^\/api\/bwc-reports\/(.+)$/);
    if (bwcMatch) {
        const reportId = bwcMatch[1];
        if (method === 'PUT') {
            bwcReports = bwcReports.map(r => r.id === reportId ? body : r);
            saveToStorage(STORAGE_KEYS.BWC_REPORTS, bwcReports);
            return new Response(JSON.stringify(body), { status: 200 });
        }
        if (method === 'DELETE') {
            bwcReports = bwcReports.filter(r => r.id !== reportId);
            saveToStorage(STORAGE_KEYS.BWC_REPORTS, bwcReports);
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }
    }

    // SENTIMENT REPORTS
    if (url === '/api/sentiment-reports' && method === 'GET') return new Response(JSON.stringify(sentimentReports), { status: 200 });
    if (url === '/api/sentiment-reports' && method === 'POST') {
        const newReport: SentimentReport = {
            ...body,
            id: `SENT-${Date.now()}`
        };
        sentimentReports = [newReport, ...sentimentReports];
        saveToStorage(STORAGE_KEYS.SENTIMENT_REPORTS, sentimentReports);
        return new Response(JSON.stringify(newReport), { status: 201 });
    }

    // IN-PERSON REVIEWS
    if (url === '/api/reviews' && method === 'GET') return new Response(JSON.stringify(reviews), { status: 200 });
    if (url === '/api/reviews' && method === 'POST') {
        const newReview = { ...body, id: `REV-${Date.now()}` };
        reviews = [newReview, ...reviews];
        saveToStorage(STORAGE_KEYS.REVIEWS, reviews);
        return new Response(JSON.stringify(newReview), { status: 201 });
    }
    const reviewMatch = url.match(/^\/api\/reviews\/(.+)$/);
    if (reviewMatch) {
        const reviewId = reviewMatch[1];
        if (method === 'PUT') {
            reviews = reviews.map(r => r.id === reviewId ? body : r);
            saveToStorage(STORAGE_KEYS.REVIEWS, reviews);
            return new Response(JSON.stringify(body), { status: 200 });
        }
        if (method === 'DELETE') {
            reviews = reviews.filter(r => r.id !== reviewId);
            saveToStorage(STORAGE_KEYS.REVIEWS, reviews);
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }
    }

    // PIPS
    if (url === '/api/pips' && method === 'GET') return new Response(JSON.stringify(pips), { status: 200 });

    // TICKETS
    if (url === '/api/tickets' && method === 'GET') return new Response(JSON.stringify(tickets), { status: 200 });
    if (url === '/api/tickets' && method === 'POST') {
        const newTicket: TroubleTicket = {
            id: `TKT-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            status: 'Open',
            ...body
        };
        tickets = [newTicket, ...tickets];
        saveToStorage(STORAGE_KEYS.TICKETS, tickets);
        
        // Add to Audit Log
        const logEntry: AuditLogItem = {
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            user: body.submitter,
            role: 'Agency Supervisor', // Inferred
            action: 'TICKET_SUBMITTED',
            details: `Submitted ticket: ${newTicket.subject}`,
            ipAddress: '127.0.0.1'
        };
        auditLog = [logEntry, ...auditLog];
        saveToStorage(STORAGE_KEYS.AUDIT_LOG, auditLog);

        return new Response(JSON.stringify(newTicket), { status: 201 });
    }

    // INVOICES
    if (url === '/api/invoices' && method === 'GET') return new Response(JSON.stringify(invoices), { status: 200 });
    if (url === '/api/invoices' && method === 'POST') {
        const newInvoice: Invoice = {
            id: `INV-${Date.now()}`,
            ...body
        };
        invoices = [newInvoice, ...invoices];
        saveToStorage(STORAGE_KEYS.INVOICES, invoices);
        return new Response(JSON.stringify(newInvoice), { status: 201 });
    }

    // AUDIT LOG
    if (url === '/api/audit-log' && method === 'GET') return new Response(JSON.stringify(auditLog), { status: 200 });
    if (url === '/api/audit-log' && method === 'POST') {
        const newLog = {
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            ipAddress: '127.0.0.1', // Mock IP
            ...body
        };
        auditLog = [newLog, ...auditLog];
        saveToStorage(STORAGE_KEYS.AUDIT_LOG, auditLog);
        return new Response(JSON.stringify(newLog), { status: 201 });
    }

    // REGISTRATIONS
    if (url === '/api/registrations/pending' && method === 'GET') return new Response(JSON.stringify(pendingOfficers), { status: 200 });
    if (url === '/api/registrations' && method === 'POST') {
        const newPending: PendingOfficer = {
            id: `PEND-${Date.now()}`,
            requestedDate: new Date().toISOString().split('T')[0],
            status: 'Pending',
            ...body
        };
        pendingOfficers = [...pendingOfficers, newPending];
        saveToStorage(STORAGE_KEYS.PENDING_OFFICERS, pendingOfficers);
        return new Response(JSON.stringify({ success: true }), { status: 201 });
    }
    const regApproveMatch = url.match(/^\/api\/registrations\/(.+)\/approve$/);
    if (regApproveMatch) {
        const id = regApproveMatch[1];
        const pending = pendingOfficers.find(p => p.id === id);
        if (pending) {
            // Remove from pending
            pendingOfficers = pendingOfficers.filter(p => p.id !== id);
            saveToStorage(STORAGE_KEYS.PENDING_OFFICERS, pendingOfficers);

            // Add to Officers
            const newOfficer: Officer = {
                id: `OFF-${String(officers.length + 100).padStart(3, '0')}`,
                firstName: body.firstName || pending.firstName,
                lastName: body.lastName || pending.lastName,
                badgeNumber: 'PENDING',
                rank: 'Officer',
                agency: body.agency || pending.agency,
                status: 'Active',
                incidents: 0,
                score: 100,
                dob: '',
                hireDate: new Date().toISOString().split('T')[0],
                education: '',
                gender: '',
                race: '',
                shift: 'Day',
            };
            officers = [...officers, newOfficer];
            saveToStorage(STORAGE_KEYS.OFFICERS, officers);

            // Add to Users
            const tempPass = generatePassword();
            const newUser: User = {
                id: pending.email,
                name: `${newOfficer.firstName} ${newOfficer.lastName}`,
                role: 'Officer',
                agency: newOfficer.agency,
                password: tempPass,
                status: 'Active'
            };
            users = [...users, newUser];
            saveToStorage(STORAGE_KEYS.USERS, users);

            return new Response(JSON.stringify({ success: true, tempPass }), { status: 200 });
        }
    }
    const regDenyMatch = url.match(/^\/api\/registrations\/(.+)\/deny$/);
    if (regDenyMatch) {
        const id = regDenyMatch[1];
        pendingOfficers = pendingOfficers.filter(p => p.id !== id);
        saveToStorage(STORAGE_KEYS.PENDING_OFFICERS, pendingOfficers);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404 });
};

// Export the "fetch" wrapper
export const apiFetch = apiRouter;
