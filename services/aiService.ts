import { GoogleGenAI, Type } from "@google/genai";
import type { Report, User, TranscriptSegment } from '../types';

// Ensure the API key is being accessed correctly from environment variables
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY! });
// Helper to convert file to a base64 string for the API
const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};


interface GetChatbotResponseProps {
    user: User;
    message: string;
    systemInstruction: string;
    policyGuidelines: string;
}

export const getChatbotResponse = async ({
    user,
    message,
    systemInstruction,
    policyGuidelines,
}: GetChatbotResponseProps): Promise<string> => {
    try {
        const fullPrompt = `
CONTEXT:
- User Role: ${user.role}
- User Agency: ${user.agency || 'N/A'}
- Current Date: ${new Date().toISOString().split('T')[0]}

KNOWLEDGE BASE:
${policyGuidelines}

USER QUERY:
${message}
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        
        return response.text || "I couldn't generate a response.";
    } catch (error) {
        console.error("Error getting chatbot response:", error);
        return "Sorry, I encountered an error while processing your request.";
    }
};


export const generateSummaryReport = async (reports: Report[], filters: any): Promise<string> => {
     try {
        const reportsJson = JSON.stringify(reports.slice(0, 50), null, 2); // Limit context size
        const filtersJson = JSON.stringify(filters, null, 2);

        const prompt = `
Generate a summary report based on the following JSON data of incident reports and filters.

**Instructions:**
1.  Analyze the provided JSON data which contains an array of incident reports.
2.  Use the provided filters to understand the scope of the user's query.
3.  Structure your response using the following markdown sections exactly: \`[FILTER_CRITERIA]\`, \`[EXECUTIVE_SUMMARY]\`, \`[REPORT_OVERVIEW]\`, \`[INCIDENT_ANALYSIS]\`, \`[OFFICER_ANALYSIS]\`, and \`[KEY_FINDINGS]\`.
4.  For \`[FILTER_CRITERIA]\`, list the filters that were applied.
5.  For \`[EXECUTIVE_SUMMARY]\`, provide a brief, high-level overview of the key trends and findings.
6.  For \`[REPORT_OVERVIEW]\`, state the total number of reports analyzed.
7.  For \`[INCIDENT_ANALYSIS]\`, provide a breakdown of reports by 'outcome', 'incidentType', and 'shift' using markdown bullet points.
8.  For \`[OFFICER_ANALYSIS]\`, list the officers involved and the number of reports for each.
9.  For \`[KEY_FINDINGS]\`, synthesize the most important insights from the data in 2-3 sentences.
10. Ensure the entire output is a single, continuous block of text formatted in markdown. Do not use JSON.

**Filters Used:**
\`\`\`json
${filtersJson}
\`\`\`

**Incident Reports Data:**
\`\`\`json
${reportsJson}
\`\`\`
`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Using a faster model for demo purposes
            contents: prompt,
        });

        return response.text || "No summary generated.";

    } catch (error) {
        console.error("Error generating summary report:", error);
        throw new Error("Failed to generate AI summary.");
    }
};


export const generateTranscriptAndSummary = async (videoFile: File): Promise<{ summary: string, transcript: TranscriptSegment[] }> => {
    try {
        const videoPart = await fileToGenerativePart(videoFile);
        
        const transcriptSchema = {
            type: Type.OBJECT,
            properties: {
                summary: {
                    type: Type.STRING,
                    description: "A concise, 1-2 sentence summary of the entire video interaction."
                },
                transcript: {
                    type: Type.ARRAY,
                    description: "An array of transcript segments.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            timestamp: { 
                                type: Type.NUMBER,
                                description: "The start time of the speech segment in seconds."
                            },
                            speaker: { 
                                type: Type.STRING,
                                description: "The identified speaker. Should be one of: 'Officer', 'Civilian', 'Dispatch'."
                            },
                            text: { 
                                type: Type.STRING,
                                description: "The transcribed text of the speech segment."
                            }
                        },
                        required: ["timestamp", "speaker", "text"]
                    }
                }
            },
            required: ["summary", "transcript"]
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { 
                parts: [
                    { text: "Transcribe the audio from this video. Identify each speaker as 'Officer', 'Civilian', or 'Dispatch'. Provide timestamps for each segment. Also, provide a brief, 1-2 sentence summary of the entire video interaction. Format the entire output as a single JSON object that matches the provided schema." },
                    videoPart
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: transcriptSchema,
            },
        });

        const jsonString = response.text;
        if (!jsonString) {
            console.error("AI response for transcript is empty or invalid.", response);
            throw new Error("AI returned empty or invalid response for transcript generation.");
        }

        const parsedResponse = JSON.parse(jsonString.trim());
        const { summary, transcript } = parsedResponse;
        
        // Add an ID to each transcript segment for React keys
        const transcriptWithIds = transcript.map((segment: Omit<TranscriptSegment, 'id'>, index: number) => ({
            ...segment,
            id: Date.now() + index
        }));

        return { summary, transcript: transcriptWithIds };

    } catch (error) {
        console.error("Error in generateTranscriptAndSummary:", error);
        const detail = error instanceof Error ? error.message : 'An unknown error occurred';
        throw new Error(`Failed to generate transcript from video. Details: ${detail}`);
    }
};

export const generateSentimentAnalysis = async (videoFile: File): Promise<Partial<any>> => {
     // This is a mock implementation. In a real scenario, you would upload the video file
    // to a service that can process it, extract audio, and then send the audio to Gemini.
    // For this demo, we'll return mock data after a delay.
    
    console.log("Analyzing video file:", videoFile.name);
    await new Promise(resolve => setTimeout(resolve, 4000)); // Simulate processing time

    // Mock response based on some fictional analysis
    const mockResponses = [
        {
            sentimentScore: 'Low Stress',
            wellnessCategory: 'Supportive',
            indicators: ['Calm Tone', 'Empathetic Language'],
            emotionalCues: 'Tone was calm and measured throughout the interaction.',
            emotionalTone: ['Calmness', 'Empathy'],
            communicationStyle: 'Collaborative',
            keyPhrases: ["I understand you're frustrated.", "How can I help you?"],
        },
        {
            sentimentScore: 'Moderate Stress',
            wellnessCategory: 'Monitor',
            indicators: ['Raised Voice', 'Long Pauses', 'Rapid Speech'],
            emotionalCues: 'Officer sounded fatigued and speech quickened when challenged.',
            emotionalTone: ['Frustration', 'Anxiety'],
            communicationStyle: 'Assertive',
            keyPhrases: ["Just let me see your license.", "I've already explained it."],
        },
        {
            sentimentScore: 'High Stress',
            wellnessCategory: 'Follow-up Recommended',
            indicators: ['Defensive Tone', 'Repeated Interruptions', 'Sarcasm'],
            emotionalCues: 'Officer\'s tone became increasingly defensive and sarcastic.',
            emotionalTone: ['Anger', 'Defensiveness'],
            communicationStyle: 'Aggressive',
            keyPhrases: ["Are we done here?", "I don't need a lecture."],
        }
    ];

    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
};