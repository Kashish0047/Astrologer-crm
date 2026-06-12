import { GoogleGenerativeAI } from '@google/generative-ai';

export const generateConsultationSummary = async (discussionNotes: string): Promise<string> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  const prompt = `You are an expert astrology consultation assistant. 
  Based on the following consultation discussion notes, generate a concise, professional summary 
  that captures the key concerns, insights provided, and recommendations made during the session.
  Keep it to 3-4 sentences maximum. Be professional and clear.
  
  Discussion Notes:
  ${discussionNotes}
  
  Professional Summary:`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};
