import React, { useState, useEffect } from 'react';
import type { ViewType, ChatMessage } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AgenciesPage from './components/AgenciesPage';
import OfficersPage from './components/OfficersPage';
import ReportsPage from './components/ReportsPage';
import BwcAnalysisPage from './components/BwcAnalysisPage';
import BwcAnalysisForm from './components/BwcAnalysisForm';
import InPersonReviewPage from './components/InPersonReviewPage';
import SentimentAnalysisPage from './components/SentimentAnalysisPage';
import PipPage from './components/PipPage';
import TroubleTicketPage from './components/TroubleTicketPage';
import SubmitTicketPage from './components/SubmitTicketPage';
import OfficerReportsPage from './components/OfficerReportsPage';
import AiSettingsPage from './components/AiSettingsPage';
import AgencySettingsPage from './components/AgencySettingsPage';
import Chatbot from './components/Chatbot';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import PendingApprovalsPage from './components/PendingApprovalsPage';
import BillingPage from './components/BillingPage';
import AuditLogPage from './components/AuditLogPage';
import UserManagementPage from './components/UserManagementPage';
import TutorialPage from './components/TutorialPage';
import ToastContainer from './components/ToastContainer';
import ConfirmationModal from './components/ConfirmationModal';
import DemoBanner from './components/DemoBanner';
import TrialExpired from './components/TrialExpired';

import { useAppContext } from './contexts/AppContext';
import { getChatbotResponse } from './services/aiService';


// Default AI settings
const defaultSystemInstruction = `You are ATLAS, an AI assistant for law enforcement performance analysis. Your primary function is to analyze the JSON data provided in the context of this prompt to answer user questions accurately and concisely.

**Core Directives:**
1.  **Data-First:** Base your answers strictly on the provided JSON data. Do not infer information not present in the context.
2.  **Acknowledge Limits:** If the data required to answer a question is not available in the provided context, you MUST explicitly state that the information was not found in the retrieved data. Do not apologize or invent information.
3.  **Clarity and Formatting:** When presenting lists of data (e.g., multiple officers, reports), format your response using markdown bullet points for clarity. For numerical summaries, be precise.
4.  **Professional Tone:** Maintain a professional, objective, and impartial tone at all times. Avoid speculation, opinions, or conversational filler.
5.  **Use the Knowledge Base:** Refer to the 'Knowledge Base' section for agency policies and guidelines when a user's query is related to policy or procedure.`;

const defaultPolicyGuidelines = `# Agency Policy Manual - Key Sections

## Section 1: Body-Worn Camera (BWC) Usage
**Policy 1.1: Activation**
- Officers must activate their BWC at the initiation of any law enforcement action, including but not limited to: traffic stops, citizen contacts, and responses to calls for service.
- BWC must remain active for the duration of the event.

**Policy 1.2: Deactivation**
- BWC may be deactivated only when the incident has concluded, the officer has left the scene, or as directed by a supervisor.
- Officers must state the reason for deactivation before turning off the device.

**Policy 1.3: Review Timeline**
- All BWC footage related to use-of-force incidents must be reviewed by a supervisor within 48 hours.
- All BWC footage flagged for review by the ATLAS AI system must be reviewed within 72 hours.

## Section 2: Use of Force
**Policy 2.1: De-escalation**
- De-escalation techniques should be the primary strategy and must be employed and documented in all applicable situations before resorting to force.
- Applicable situations include encounters with subjects who are verbally non-compliant but not an immediate physical threat.

**Policy 2.2: Reporting Use of Force**
- Any use of force beyond compliant handcuffing must be documented in a dedicated Use of Force report.
- The associated BWC footage must be tagged for mandatory supervisory review.

## Section 3: Vehicle Pursuits
**Policy 3.1: Initiation Criteria**
- Pursuits may only be initiated for violent felony offenses where the suspect poses an immediate threat to public safety.
- The risk to the public must be continually weighed against the need to apprehend the suspect.

**Policy 3.2: Termination Criteria**
- A pursuit must be terminated if the risk to the public or officers outweighs the need for immediate apprehension.
- Supervisors may order the termination of a pursuit at any time.

## Section 4: Officer Conduct & Demeanor
**Policy 4.1: Professionalism**
- Officers shall conduct themselves in a professional, courteous, and respectful manner in all interactions with the public.
- Language should be free of profanity and bias. ATLAS Sentiment Analysis may be used as a tool to identify potential coaching opportunities in this area.

## Section 5: Performance Management
**Policy 5.1: Coaching & Training**
- A 'Coaching' outcome in an ATLAS BWC review is considered non-disciplinary and is intended for performance improvement.
- A 'Training' outcome indicates a need for formal skill development and will be documented by the Training Division.

**Policy 5.2: Performance Improvement Plans (PIPs)**
- A PIP is a formal process initiated when an officer's performance does not meet standards over a period of time.
- All PIPs must be created, managed, and documented within the ATLAS PIP management module.

## Section 6: Crisis Intervention
**Policy 6.1: Objective**
- The primary objective is to de-escalate situations involving individuals experiencing a mental health crisis and connect them with appropriate resources, prioritizing the safety of all involved.

**Policy 6.2: Identifying a Crisis**
- Officers should look for indicators such as disorganized speech, erratic behavior, delusions, or suicidal ideations.
- ATLAS Sentiment Analysis can be a tool to flag interactions with high emotional distress for review.

**Policy 6.3: Response Protocol**
- Request a CIT-certified officer to respond if one is available.
- Use non-confrontational language and a calm, patient tone.
- Create space and avoid cornering the individual.
- Focus on active listening and empathizing with their state of mind.
- The use of force should be a last resort and should be proportional to the threat posed.`;

const App: React.FC = () => {
    const { currentUser, logout, isLoading, confirmation, hideConfirmation, activePage, setActivePage, isTrialExpired } = useAppContext();
    const [authView, setAuthView] = useState<'login' | 'register'>('login');

    // AI Chatbot State
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isChatLoading, setIsChatLoading] = useState(false);
    
    // AI Settings State
    const [systemInstruction, setSystemInstruction] = useState(defaultSystemInstruction);
    const [policyGuidelines, setPolicyGuidelines] = useState(defaultPolicyGuidelines);
    
    const handleLogout = () => {
        logout();
        setChatHistory([]);
        setIsChatbotOpen(false);
    };
    
     const handleSendMessage = async (message: string) => {
        if (!currentUser) return;
        
        const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: message }];
        setChatHistory(newHistory);
        setIsChatLoading(true);

        try {
            const aiResponse = await getChatbotResponse({
                user: currentUser,
                message,
                systemInstruction,
                policyGuidelines
            });
            setChatHistory([...newHistory, { role: 'model', content: aiResponse }]);
        } catch (error) {
            console.error(error);
            setChatHistory([...newHistory, { role: 'model', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const renderPage = () => {
        switch (activePage) {
            case 'Dashboard':
                return <Dashboard />;
            case 'Agencies':
                return <AgenciesPage />;
            case 'Officers':
                return <OfficersPage />;
            case 'Summary Reports':
                return <ReportsPage />;
            case 'BWC Analysis':
                return <BwcAnalysisPage />;
            case 'New BWC Report':
                return <BwcAnalysisForm />;
            case 'In-Person Review':
                return <InPersonReviewPage />;
            case 'Sentiment Analysis':
                return <SentimentAnalysisPage />;
            case 'PIPs':
                return <PipPage />;
            case 'Trouble Tickets':
                return <TroubleTicketPage />;
            case 'Submit Ticket':
                return <SubmitTicketPage />;
            case 'My Reports':
                return <OfficerReportsPage />;
            case 'My PIPs':
                return <PipPage />;
            case 'Tutorial':
                return <TutorialPage />;
            case 'AI Settings':
                return <AiSettingsPage 
                    systemInstruction={systemInstruction}
                    setSystemInstruction={setSystemInstruction}
                    policyGuidelines={policyGuidelines}
                    setPolicyGuidelines={setPolicyGuidelines}
                    defaultSystemInstruction={defaultSystemInstruction}
                    defaultPolicyGuidelines={defaultPolicyGuidelines}
                />;
            case 'Agency Settings':
                 return <AgencySettingsPage />;
            case 'Pending Approvals':
                return <PendingApprovalsPage />;
            case 'Billing':
                return <BillingPage />;
            case 'Audit Log':
                return <AuditLogPage />;
            case 'User Management':
                return <UserManagementPage />;
            default:
                return <Dashboard />;
        }
    };

    if (!currentUser) {
        if (authView === 'register') {
            return <RegistrationPage onGoToLogin={() => setAuthView('login')} />;
        }
        return (
            <>
                <DemoBanner />
                <LoginPage onGoToRegister={() => setAuthView('register')} onLoginSuccess={() => setActivePage('Dashboard')} />
            </>
        );
    }
    
    if (isTrialExpired) {
        return <TrialExpired onLogout={handleLogout} />;
    }
    
    if (isLoading) {
        return (
            <div className="flex h-screen bg-atlas-gray items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-atlas-blue border-dashed rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-semibold">Loading ATLAS Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-atlas-gray">
            <ToastContainer />
            <ConfirmationModal 
                isOpen={confirmation.isOpen}
                title={confirmation.title}
                message={confirmation.message}
                onConfirm={() => {
                    confirmation.onConfirm();
                    hideConfirmation();
                }}
                onCancel={hideConfirmation}
            />
            <DemoBanner />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar 
                    activePage={activePage} 
                    setPage={setActivePage}
                    onLogout={handleLogout}
                />
                <main className="flex-1 overflow-y-auto">
                    {renderPage()}
                </main>
            </div>
            {currentUser.role !== 'Officer' && (
                 <Chatbot 
                    isOpen={isChatbotOpen}
                    setIsOpen={setIsChatbotOpen}
                    history={chatHistory}
                    isLoading={isChatLoading}
                    onSendMessage={handleSendMessage}
                />
            )}
        </div>
    );
};

export default App;