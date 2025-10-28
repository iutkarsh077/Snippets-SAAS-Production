"use server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY!,
});

type Message = {
  role: "user" | "model";
  parts: { text: string }[];
};

const systemPrompt = `You are a helpful, knowledgeable, and friendly AI assistant. 
Your goal is to provide accurate, clear, and concise answers to user questions.
When referencing previous parts of the conversation, acknowledge the context naturally.
Be conversational but professional in your responses.`;

const conversationHistory: Message[] = [];

export async function askAI(data: any) {
  try {
    const { question } = data;

    if (!question || typeof question !== "string") {
      throw new Error("Invalid or missing question");
    }

    conversationHistory.push({
      role: "user",
      parts: [{ text: question }],
    });

    // console.log("conversation history si: ", conversationHistory)

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: conversationHistory, 
      config: {
        systemInstruction: systemPrompt,
      },
    });

    if (!result || !result.text) {
      throw new Error("No content generated from the AI");
    }


    conversationHistory.push({
      role: "model",
      parts: [{ text: result.text }],
    });

    return {
      data: result.text,
      error: null,
      status: true,
    };
  } catch (error) {
    console.error("askAI error:", error);

    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while processing your request",
      status: false,
    };
  }
}
