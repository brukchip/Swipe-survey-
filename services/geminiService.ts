import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Singleton chat instance for the session
let chatSession: Chat | null = null;

export const initializeChat = () => {
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are ChipChip Bot, a friendly, empathetic, and casual customer support agent for a grocery delivery app called ChipChip in Ethiopia. 
      Your goal is to understand why a user hasn't ordered in a while (churned) and offer a personalized incentive to win them back.
      Keep responses short (under 40 words), conversational, and use emojis. 
      Do not sound like a corporate robot. Sound like a helpful friend on WhatsApp.
      If the user complains about price, offer a 5% discount code 'CHIP5'.
      If the user complains about quality, apologize and offer a replacement voucher.
      If the user forgot, remind them of our fresh carrots.
      `,
    },
  });
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    initializeChat();
  }
  
  try {
    if (!chatSession) throw new Error("Chat session not initialized");
    
    const result: GenerateContentResponse = await chatSession.sendMessage({
      message: message
    });

    return result.text || "I'm having a bit of trouble connecting right now, but we'd love to see you back!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops! My brain froze 🧊. But seriously, we miss you!";
  }
};