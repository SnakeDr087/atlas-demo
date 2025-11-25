import React from 'react';
import type { UserRole, ViewType } from '../types';
import {
    TrendingUpIcon,
    BuildingIcon,
    UsersIcon,
    DocumentTextIcon,
    VideoCameraIcon,
    AcademicCapIcon,
    ChatAlt2Icon,
    PipIcon,
    TicketIcon,
    CreditCardIcon,
    ShieldCheckIcon,
    CogIcon,
    LogoutIcon,
    ClipboardListIcon,
    BookOpenIcon
} from './IconComponents';
import { useAppContext } from '../contexts/AppContext';

interface SidebarProps {
    activePage: ViewType;
    setPage: (page: ViewType) => void;
    onLogout: () => void;
}

const navLinks: { [key in UserRole]: { name: ViewType; icon: React.FC<{ className?: string }> }[][] } = {
    'Super Admin': [
        [
            { name: 'Dashboard', icon: TrendingUpIcon },
            { name: 'Agencies', icon: BuildingIcon },
            { name: 'User Management', icon: UsersIcon },
        ],
        [
            { name: 'Summary Reports', icon: DocumentTextIcon },
            { name: 'Billing', icon: CreditCardIcon },
            { name: 'Trouble Tickets', icon: TicketIcon },
        ],
        [
            { name: 'Audit Log', icon: ShieldCheckIcon },
            { name: 'AI Settings', icon: CogIcon },
        ]
    ],
    'Agency Admin': [
        [
            { name: 'Dashboard', icon: TrendingUpIcon },
            { name: 'Officers', icon: UsersIcon },
            { name: 'Pending Approvals', icon: ClipboardListIcon },
            { name: 'User Management', icon: UsersIcon },
        ],
        [
            { name: 'BWC Analysis', icon: VideoCameraIcon },
            { name: 'In-Person Review', icon: AcademicCapIcon },
            { name: 'Sentiment Analysis', icon: ChatAlt2Icon },
            { name: 'Summary Reports', icon: DocumentTextIcon },
            { name: 'PIPs', icon: PipIcon },
        ],
        [
            { name: 'Submit Ticket', icon: TicketIcon },
            { name: 'Tutorial', icon: BookOpenIcon },
            { name: 'Agency Settings', icon: BuildingIcon },
            { name: 'AI Settings', icon: CogIcon },
            { name: 'Billing', icon: CreditCardIcon },
        ]
    ],
    'Agency Supervisor': [
        [
            { name: 'Dashboard', icon: TrendingUpIcon },
            { name: 'Officers', icon: UsersIcon },
            { name: 'Pending Approvals', icon: ClipboardListIcon },
        ],
        [
            { name: 'BWC Analysis', icon: VideoCameraIcon },
            { name: 'In-Person Review', icon: AcademicCapIcon },
            { name: 'Sentiment Analysis', icon: ChatAlt2Icon },
            { name: 'Summary Reports', icon: DocumentTextIcon },
            { name: 'PIPs', icon: PipIcon },
        ],
        [
            { name: 'Submit Ticket', icon: TicketIcon },
            { name: 'Tutorial', icon: BookOpenIcon },
        ]
    ],
    'Officer': [
        [
            { name: 'Dashboard', icon: TrendingUpIcon },
            { name: 'My Reports', icon: DocumentTextIcon },
            { name: 'My PIPs', icon: PipIcon },
        ],
        [
            { name: 'Submit Ticket', icon: TicketIcon },
        ]
    ]
};

const Sidebar: React.FC<SidebarProps> = ({ activePage, setPage, onLogout }) => {
    const { currentUser } = useAppContext();

    if (!currentUser) return null;

    const roleLinks = navLinks[currentUser.role];

    return (
        <aside className="w-64 bg-atlas-sidebar text-white flex flex-col">
            <div className="p-6 text-center border-b border-gray-700">
                <h1 className="text-2xl font-bold tracking-wider">ATLAS</h1>
                <p className="text-xs text-gray-400">PERFORMANCE MANAGEMENT</p>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
                {roleLinks.map((group, groupIndex) => (
                    <div key={groupIndex} className="space-y-2">
                        {group.map(({ name, icon: Icon }) => (
                            <button
                                key={name}
                                onClick={() => setPage(name)}
                                className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                                    activePage === name
                                        ? 'bg-atlas-blue text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <Icon className="h-5 w-5 mr-3" />
                                <span>{name}</span>
                            </button>
                        ))}
                    </div>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-700">
                <div className="px-4 py-3">
                    <p className="text-sm font-semibold">{currentUser.name}</p>
                    <p className="text-xs text-gray-400">{currentUser.role}</p>
                </div>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                    <LogoutIcon className="h-5 w-5 mr-3" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;