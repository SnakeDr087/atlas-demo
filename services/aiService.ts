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


