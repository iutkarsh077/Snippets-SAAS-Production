'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google AI client
const googleAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Helper function to generate content
const generate = async (question: string) => {
  try {
    const result = await geminiModel.generateContent(question);
    const response = await result.response.text();
    return response;
  } catch (error: any) {
    console.error("Error generating content from AI:", error.message);
    throw new Error("Failed to generate AI content");
  }
};

// Server Action
export async function askAI(data: any) {
  try {
    // Get the question from formData if using with a form
    const { question } = data; 

    if (!question || typeof question !== 'string') {
      throw new Error("Invalid or missing question");
    }

    // Generate the response
    const result = await generate(question);
    
    if (!result) {
      throw new Error("No content generated from the AI");
    }

    // Return successful response
    return { 
      data: result, 
      error: null,
      status: true
    };

  } catch (error) {
    console.error("askAI error:", error);
    
    // Return error response
    return { 
      data: null, 
      error: "An error occurred while processing your request",
      status: false
    };
  }
}