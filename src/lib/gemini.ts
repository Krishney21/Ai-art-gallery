import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// User requested flash model. Using standard ID: gemini-1.5-flash
export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
