import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const MODELS = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite-preview-02-05",
    "gemini-1.5-flash"
];

// --- 1. Statement Analysis (Vision) ---
export const analyzeStatement = async (fileBase64) => {
    let lastError;

    for (const modelName of MODELS) {
        try {
            console.log(`Attempting analysis with model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const base64Data = fileBase64.split(',')[1];
            const mimeType = fileBase64.split(';')[0].split(':')[1];

            const prompt = `
            You are a highly skilled financial assistant. Your task is to analyze the provided bank statement image and extract transaction details with high precision.
            
            INSTRUCTIONS:
            1.  **Identify Transactions**: Look for all financial transactions listed in the statement.
            2.  **Extract Details**: For each transaction, extract:
                -   **Date**: The date of the transaction. Format it strictly as "MMM DD, YYYY" (e.g., "Dec 01, 2025").
                -   **Description**: The description or merchant name.
                -   **Amount**: The transaction amount. Ensure you include the currency symbol (e.g., ₹, $, €). Prefix expenses with "-" and income with "+".
                -   **Type**: Classify as "income" (deposits, salary, refunds) or "expense" (purchases, withdrawals, fees).
                -   **Category**: Assign a category based on the description (e.g., "Food", "Transport", "Salary", "Utilities", "Shopping", "Transfer", "Subscription").
            3.  **Financial Advice**: Based on the extracted transactions, provide a brief, actionable piece of financial advice (1-2 sentences).

            OUTPUT FORMAT:
            Return ONLY a valid JSON object with the following structure. Do not include markdown formatting.
            {
                "transactions": [
                    {
                        "id": "unique_id_1",
                        "title": "Transaction Description",
                        "date": "MMM DD, YYYY",
                        "amount": "-₹500.00",
                        "type": "expense",
                        "category": "Food"
                    }
                ],
                "advice": "Your financial advice here."
            }
            `;

            const imagePart = {
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                }
            };

            const result = await model.generateContent([prompt, imagePart]);
            const response = await result.response;
            const text = response.text();
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanText);

        } catch (error) {
            console.error(`Error analyzing statement with ${modelName}:`, error);
            lastError = error;
        }
    }
    throw lastError || new Error("All models failed to analyze the statement.");
};

// --- 2. Felica Chatbot ---
export const chatWithFelica = async (message, contextData) => {
    const systemPrompt = `
    You are Felica, an exclusive financial assistant for the Finexo app. 
    Your goal is to help users manage their finances, save money, and understand their spending habits.
    
    CONTEXT:
    User's recent transactions: ${JSON.stringify(contextData.transactions.slice(0, 20))}
    User's current balance: ${contextData.balance}
    
    RULES:
    1. Answer ONLY queries related to the user's finances, Finexo app features, or general financial advice.
    2. If the user asks about anything else (e.g., "Who is the president?", "Write a poem"), politely refuse and say you only discuss finances.
    3. Be friendly, encouraging, and professional.
    4. Use the provided context to give personalized answers.
    5. Keep answers concise (under 3 sentences unless detailed analysis is asked).
    `;

    for (const modelName of MODELS) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent([systemPrompt, message]);
            return result.response.text();
        } catch (error) {
            console.error("Felica error:", error);
        }
    }
    return "I'm having trouble connecting to my financial brain right now. Please try again.";
};

// --- 3. Advanced Analysis Features ---

export const detectSubscriptions = async (transactions) => {
    const prompt = `
    Analyze these transactions and identify potential recurring subscriptions (e.g., Netflix, Spotify, Amazon Prime, Gym, Internet).
    Return a JSON array of objects with { name, amount, frequency, likelihood }.
    Transactions: ${JSON.stringify(transactions)}
    `;
    // Implementation similar to above...
    // For brevity, using a simpler heuristic or calling AI if needed.
    // Here we will call AI for accuracy.

    try {
        const model = genAI.getGenerativeModel({ model: MODELS[0] });
        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    } catch (e) {
        return [];
    }
};

export const getFinancialAdvice = async (transactions) => {
    // Existing implementation...
    for (const modelName of MODELS) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const prompt = `
            You are a highly skilled financial advisor. Analyze the following transaction history and provide 3 specific, actionable, and personalized tips.
            Transactions: ${JSON.stringify(transactions.slice(0, 50))}
            
            OUTPUT FORMAT:
            Return ONLY a valid JSON array of strings.
            [ "Tip 1...", "Tip 2...", "Tip 3..." ]
            `;

            const result = await model.generateContent(prompt);
            const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(text);
        } catch (error) {
            console.error(`Error getting advice with ${modelName}:`, error);
        }
    }
    return ["Could not generate advice at this time."];
};
