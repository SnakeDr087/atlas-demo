import type { Report, User, TranscriptSegment } from '../types';

// Ensure the API key is being accessed correctly from environment variables
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

    // Call your serverless function instead of Gemini directly
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get response');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    throw error;
  }
};


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