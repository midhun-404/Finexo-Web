import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.VITE_GOOGLE_API_KEY;
console.log("Testing with API Key:", API_KEY ? API_KEY.substring(0, 10) + "..." : "NOT SET");

const MODELS_TO_TEST = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-2.5-flash-exp",
    "gemini-2.5-flash"
];

const testModel = async (modelName) => {
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, are you working?");
        console.log(`[SUCCESS] ${modelName} is working.`);
        return true;
    } catch (error) {
        console.log(`[FAILED] ${modelName}: ${error.message}`);
        return false;
    }
};

const run = async () => {
    console.log("Starting model verification...");
    for (const model of MODELS_TO_TEST) {
        await testModel(model);
    }
    console.log("Verification complete.");
};

run();
