import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const API_KEY = process.env.VITE_GOOGLE_API_KEY;

async function listModels() {
    try {
        console.log("Listing Gemini models to file...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();

        if (data.models) {
            const modelNames = data.models.map(m => m.name);
            fs.writeFileSync('gemini_models.txt', JSON.stringify(modelNames, null, 2));
            console.log("Models saved to gemini_models.txt");
        } else {
            console.log("No models found or error:", data);
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
