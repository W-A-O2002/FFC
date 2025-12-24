// services/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateRecipe = async (ingredient: string): Promise<string> => {
  console.log("Loaded API Key:", process.env.EXPO_PUBLIC_GEMINI_API_KEY);
  try {
    const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!API_KEY) {
      return `**Mock Recipe for ${ingredient}:**\n1. Wash the ${ingredient}.\n2. Slice thinly.\n3. Season and enjoy!`;
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Suggest a simple, healthy recipe using ${ingredient} as the main ingredient. Keep it under 100 words. Format with simple steps.`;
    const result = await model.generateContent(prompt);
    return result.response.text() || "Recipe generation failed.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I couldn’t generate a recipe right now.";
  }
};