import React, { useState } from 'react';
import Header from './Header.tsx';
import { 
    BookOpenIcon, 
    TrendingUpIcon,
    VideoCameraIcon,
    AcademicCapIcon,
    ChatAlt2Icon,
    DocumentTextIcon,
    PipIcon,
    ChatBubbleIcon,
    TicketIcon
} from './IconComponents.tsx';

type SectionId = 'intro' | 'dashboard' | 'bwc' | 'in-person' | 'sentiment' | 'reports' | 'pips' | 'ai' | 'help';

const tutorialSections: { id: SectionId, title: string, icon: React.FC<{className?: string}> }[] = [
    { id: 'intro', title: 'Introduction to ATLAS', icon: BookOpenIcon },
    { id: 'dashboard', title: 'The Dashboard', icon: TrendingUpIcon },
    { id: 'bwc', title: 'BWC Analysis', icon: VideoCameraIcon },
    { id: 'in-person', title: 'In-Person Reviews', icon: AcademicCapIcon },
    { id: 'sentiment', title: 'Sentiment Analysis', icon: ChatAlt2Icon },
    { id: 'reports', title: 'Summary Reports', icon: DocumentTextIcon },
    { id: 'pips', title: 'Managing PIPs', icon: PipIcon },
    { id: 'ai', title: 'Using the AI Assistant', icon: ChatBubbleIcon },
    { id: 'help', title: 'Getting Help', icon: TicketIcon },
];

const TutorialContent: React.FC<{ sectionId: SectionId }> = ({ sectionId }) => {
    
    const contentStyle = {
        h2: "text-2xl font-bold text-gray-800 mb-4",
        h3: "text-xl font-semibold text-gray-700 mt-6 mb-2",
        p: "text-gray-600 leading-relaxed mb-4",
        ul: "list-disc list-inside space-y-2 mb-4 pl-4 text-gray-600",
        strong: "font-semibold text-gray-800",
    };

    switch (sectionId) {
        case 'intro':
            return (
                <div>
                    <h2 className={contentStyle.h2}>Welcome to ATLAS, Supervisor!</h2>
                    <p className={contentStyle.p}>This guide will walk you through the key features of the ATLAS Performance Management System from your perspective as an Agency Supervisor. Your primary role in ATLAS is to review officer performance, provide coaching, and ensure your team adheres to agency policies.</p>
                    
                    <h3 className={contentStyle.h3}>Explainer Video</h3>
                    <p className={contentStyle.p}>Watch this short video for a high-level overview of what ATLAS can do for your agency.</p>
                    <a href="https://youtu.be/DT8eCiDv4nU" target="_blank" rel="noopener noreferrer" className="block my-6 relative group cursor-pointer">
                        <img 
                            src="https://img.youtube.com/vi/DT8eCiDv4nU/maxresdefault.jpg" 
                            alt="ATLAS Explainer Video Thumbnail" 
                            className="w-full aspect-video rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center rounded-lg transition-all duration-300">
                            <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 scale-90">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </a>

                    <p className={contentStyle.p}>Use the menu on the left to navigate through the different sections of this tutorial. Each section corresponds to a page in the ATLAS system and explains its purpose and how to use it effectively.</p>
                </div>
            );
        case 'dashboard':
            return (
                <div>
                    <h2 className={contentStyle.h2}>Navigating Your Dashboard</h2>
                    <p className={contentStyle.p}>The Dashboard provides a high-level overview of your agency's performance metrics based on completed BWC reviews.</p>
                    <h3 className={contentStyle.h3}>Key Metrics</h3>
                    <ul className={contentStyle.ul}>
                        <li><strong className={contentStyle.strong}>Agency Score:</strong> A percentage based on the ratio of positive outcomes ('No Action', 'Commendation') to total reviews.</li>
                        <li><strong className={contentStyle.strong}>Metric Cards:</strong> These cards show the total count and percentage for each possible review outcome, from 'No Action' to 'Performance Improvement Plan'.</li>
                    </ul>
                    <h3 className={contentStyle.h3}>Visualizations</h3>
                    <ul className={contentStyle.ul}>
                        <li><strong className={contentStyle.strong}>Outcome Profile:</strong> This pie chart gives you a visual breakdown of all review outcomes, helping you quickly identify trends.</li>
                        <li><strong className={contentStyle.strong}>Performance Trends:</strong> This line chart tracks the number of different outcomes over the last six months, allowing you to see patterns and the impact of training or policy changes over time.</li>
                    </ul>
                </div>
            );
        case 'bwc':
            return (
                 <div>
                    <h2 className={contentStyle.h2}>BWC Video Analysis</h2>
                    <p className={contentStyle.p}>This is where you'll conduct detailed reviews of Body-Worn Camera footage. The system uses AI to provide an initial summary and allows you to perform a structured, KPI-driven assessment.</p>
                    <h3 className={contentStyle.h3}>Creating a New Report</h3>
                    <ol className="list-decimal list-inside space-y-2 mb-4 pl-4 text-gray-600">
                        <li>Click the <strong className={contentStyle.strong}>+ New BWC Report</strong> button.</li>
                        <li>Fill in the incident details like Case Number, Date, and Incident Type. The KPIs available for selection will change based on the Incident Type.</li>
                        <li>Select the Primary and (if applicable) Backup officers involved.</li>
                        <li>Upload the BWC video file. The AI will begin processing it for a summary and transcript.</li>
                    </ol>
                     <h3 className={contentStyle.h3}>Conducting the Review</h3>
                     <ul className={contentStyle.ul}>
                        <li><strong className={contentStyle.strong}>Video & Transcript:</strong> Play the video and follow along with the AI-generated transcript. The transcript will highlight as the video plays.</li>
                        <li><strong className={contentStyle.strong}>Timestamped Comments:</strong> As you watch, you can add comments at specific timestamps. This is perfect for noting key moments for coaching.</li>
                        <li><strong className={contentStyle.strong}>KPIs & Safety Items:</strong> Select the relevant Key Performance Indicators (KPIs) for improvement and any Officer Safety items that were observed.</li>
                        <li><strong className={contentStyle.strong}>Supervisor Notes & Outcome:</strong> Write your detailed analysis in the Supervisor Notes section and select the final Follow-up Action (e.g., Coaching, No Action).</li>
                    </ul>
                </div>
            );
        case 'in-person':
             return (
                <div>
                    <h2 className={contentStyle.h2}>In-Person Review & Coaching</h2>
                    <p className={contentStyle.p}>This module helps you schedule, conduct, and document formal and informal coaching sessions based on BWC reviews or other performance observations.</p>
                    <h3 className={contentStyle.h3}>Scheduling a Review</h3>
                    <ul className={contentStyle.ul}>
                        <li>Use the <strong className={contentStyle.strong}>Interactive Calendar</strong> to find an open date and click on it to open the scheduling modal.</li>
                        <li>Select the officer, set the time and location, and add any notes about the purpose of the review.</li>
                    </ul>
                    <h3 className={contentStyle.h3}>Creating a Review Record</h3>
                    <p className={contentStyle.p}>After a review is scheduled or completed, you can fill out a detailed record by clicking <strong className={contentStyle.strong}>+ New Review Record</strong> or editing a scheduled item from the list.</p>
                    <p className={contentStyle.p}>The form is structured to guide a productive conversation:</p>
                    <ul className={contentStyle.ul}>
                        <li><strong className={contentStyle.strong}>Officer-Led Reflection:</strong> Document the officer's perspective on the incident.</li>
                        <li><strong className={contentStyle.strong}>Supervisor Review & Policy Alignment:</strong> Note your objective observations and check if actions aligned with key agency policies.</li>
                        <li><strong className={contentStyle.strong}>Review Outcome:</strong> Select the final outcome categories and explain the next steps.</li>
                    </ul>
                </div>
            );
        case 'sentiment':
             return (
                <div>
                    <h2 className={contentStyle.h2}>Sentiment Analysis</h2>
                    <p className={contentStyle.p}><strong className={contentStyle.strong}>Important:</strong> This tool is designed for officer wellness and support, not for punitive action. It analyzes the audio from BWC footage to detect indicators of stress.</p>
                    <h3 className={contentStyle.h3}>How to Use It</h3>
                    <ol className="list-decimal list-inside space-y-2 mb-4 pl-4 text-gray-600">
                        <li>Click <strong className={contentStyle.strong}>+ New Sentiment Analysis Report</strong>.</li>
                        <li>Select an officer and upload the relevant BWC video file.</li>
                        <li>Click <strong className={contentStyle.strong}>Analyze with AI</strong>. The system will process the audio and generate findings.</li>
                    </ol>
                    <h3 className={contentStyle.h3}>Interpreting the Results</h3>
                    <ul className={contentStyle.ul}>
                        <li><strong className={contentStyle.strong}>Sentiment Score & Wellness Category:</strong> These give you a quick assessment, from 'Low Stress' to 'High Stress'.</li>
                        <li><strong className={contentStyle.strong}>Indicators & Key Phrases:</strong> The AI identifies specific vocal cues (like raised voice) and exact phrases that indicate stress.</li>
                        <li><strong className={contentStyle.strong}>Supervisor Reflection & Recommendations:</strong> Based on the AI findings and your knowledge of the officer, add your comments and select recommended next steps, such as a wellness check-in or peer support.</li>
                    </ul>
                </div>
            );
        case 'reports':
            return (
                <div>
                    <h2 className={contentStyle.h2}>Generating Summary Reports</h2>
                    <p className={contentStyle.p}>This powerful tool allows you to analyze trends across multiple incidents. You can filter your agency's entire report database and have the AI generate a high-level summary.</p>
                    <h3 className={contentStyle.h3}>How it Works</h3>
                    <ol className="list-decimal list-inside space-y-2 mb-4 pl-4 text-gray-600">
                        <li>Use the <strong className={contentStyle.strong}>Filter Reports</strong> section to narrow down the data. You can filter by officer, date range, incident type, outcome, and more.</li>
                        <li>As you apply filters, the text below will update to show how many incident reports match your criteria.</li>
                        <li>Once you are satisfied with your filters, click the <strong className={contentStyle.strong}>Generate AI Summary</strong> button.</li>
                        <li>The AI will analyze all matching reports and produce a structured summary, including key findings, officer analysis, and incident breakdowns.</li>
                    </ol>
                </div>
            );
        case 'pips':
            return (
                <div>
                    <h2 className={contentStyle.h2}>Managing Performance Improvement Plans (PIPs)</h2>
                    <p className={contentStyle.p}>When coaching and training are not enough to correct a performance issue, a PIP provides a formal, documented path for improvement.</p>
                    <h3 className={contentStyle.h3}>Creating a New PIP</h3>
                    <ol className="list-decimal list-inside space-y-2 mb-4 pl-4 text-gray-600">
                        <li>Click the <strong className={contentStyle.strong}>+ New PIP</strong> button.</li>
                        <li>Select the officer and set the start and end dates for the plan.</li>
                        <li>In <strong className={contentStyle.strong}>Performance Areas</strong>, clearly define what needs to be improved, citing specific KPIs and examples from BWC reviews.</li>
                        <li>In <strong className={contentStyle.strong}>Performance Objectives</strong>, define clear, measurable goals for the officer to achieve. What does success look like?</li>
                        <li>Document the <strong className={contentStyle.strong}>Support & Resources</strong> you will provide, such as training modules or mentorship.</li>
                        <li>Schedule regular <strong className={contentStyle.strong}>Check-ins</strong> to monitor progress.</li>
                    </ol>
                </div>
            );
        case 'ai':
            return (
                <div>
                    <h2 className={contentStyle.h2}>Using the AI Assistant</h2>
                    <p className={contentStyle.p}>The ATLAS AI Assistant (the chat window at the bottom right) is your personal data analyst. You can ask it questions in natural language to quickly find information without manually searching or applying filters.</p>
                    <h3 className={contentStyle.h3}>What to Ask</h3>
                    <p className={contentStyle.p}>The AI knows about your agency's officers, reports, and policies. Try asking questions like:</p>
                    <ul className={contentStyle.ul}>
                        <li>"Show me all reports for Officer John Davis."</li>
                        <li>"How many Use of Force incidents were there in January?"</li>
                        <li>"What is our agency's policy on vehicle pursuits?"</li>
                        <li>"Which officers have pending reports to be reviewed?"</li>
                    </ul>
                    <p className={contentStyle.p}>The AI will answer based only on the data available in the system and the policies in the Knowledge Base.</p>
                </div>
            );
        case 'help':
            return (
                <div>
                    <h2 className={contentStyle.h2}>Getting Help</h2>
                    <p className={contentStyle.p}>If you encounter a bug, have a problem, or think of a great new feature, you can let the ATLAS team know by submitting a support ticket.</p>
                    <h3 className={contentStyle.h3}>How to Submit a Ticket</h3>
                    <ul className={contentStyle.ul}>
                        <li>Navigate to the <strong className={contentStyle.strong}>Submit Ticket</strong> page from the sidebar.</li>
                        <li>Fill out the form with as much detail as possible. Be sure to select the correct Category and Priority.</li>
                        <li>If the issue is on a specific page, mention it in the <strong className={contentStyle.strong}>Page/Feature Affected</strong> field.</li>
                        <li>Describe the issue clearly in the description box. What did you do? What did you expect to happen? What actually happened?</li>
                        <li>Click <strong className={contentStyle.strong}>Submit Ticket</strong>. The ATLAS support team will be notified.</li>
                    </ul>
                </div>
            );
        default:
            return <div>Select a topic to begin.</div>
    }
}


const TutorialPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState<SectionId>('intro');
    
    return (
        <div className="flex h-full bg-atlas-gray">
            {/* Left Sidebar for Navigation */}
            <aside className="w-1/4 bg-white border-r border-gray-200 p-6 flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Supervisor Tutorial</h2>
                <nav className="space-y-2">
                    {tutorialSections.map(({ id, title, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveSection(id)}
                            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors text-left ${
                                activeSection === id
                                    ? 'bg-atlas-light-blue text-atlas-blue'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                           <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                           <span>{title}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
                    <TutorialContent sectionId={activeSection} />
                </div>
            </main>
        </div>
    );
};

export default TutorialPage;