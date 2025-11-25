export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = request.body;
    
    // Securely call Gemini API using your server-side API key
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      }
    );

    const data = await geminiResponse.json();
    return response.status(200).json(data);
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    return response.status(500).json({ error: 'Failed to process request' });
  }
}