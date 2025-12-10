import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.VITE_GOOGLE_API_KEY;

async function testGemini() {
    try {
        console.log("Testing Gemini API...");
        if (!API_KEY) {
            throw new Error("API Key not found in environment variables.");
        }
        console.log("API Key found (first 5 chars):", API_KEY.substring(0, 5));

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = "Hello, are you working?";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Gemini Response:", text);
    } catch (error) {
        console.error("Error testing Gemini:", error);
        if (error.response) {
            console.error("Error details:", JSON.stringify(error.response, null, 2));
        }
    }
}

testGemini();
