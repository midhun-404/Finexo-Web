const WORKER_URL = window.location.origin + "/api/ai";

// Helper for Secure AI Calls via Worker
const callWorkerAI = async (action, payload, modelName = "gemini-1.5-flash") => {
    try {
        const response = await fetch("/api/ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, payload, modelName })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Worker request failed");
        }

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error("AI Service Error:", error);
        throw error;
    }
};

const MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
];

// Helper for Robust AI Calls (Defined first to ensure availability)
const safeAIRequest = async (prompt, fallbackValue) => {
    for (const modelName of MODELS) {
        try {
            const text = await callWorkerAI("generateContent", prompt, modelName);

            // Robust JSON extraction
            const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
            const cleanText = jsonMatch ? jsonMatch[0] : text;
            return JSON.parse(cleanText);
        } catch (error) {
            console.warn(`Model ${modelName} failed:`, error);
        }
    }
    return fallbackValue;
};

// --- 1. Statement Analysis (Vision) ---
export const analyzeStatement = async (fileBase64) => {
    let lastError;

    for (const modelName of MODELS) {
        try {
            console.log(`Attempting analysis with model: ${modelName} via Worker`);
            const base64Data = fileBase64.split(',')[1];
            const mimeType = fileBase64.split(';')[0].split(':')[1];

            const prompt = `
            You are a highly skilled financial assistant. Your task is to analyze the provided bank statement image and extract transaction details with high precision.
            
            IMPORTANT:
            - **Focus ONLY on the transaction table.** Ignore any other text, headers, or footers outside the table.
            - If headers are present in the crop, use them to identify columns but do not extract them as a transaction.
            - This is a cropped image of a transaction table, so trust the content is relevant.

            INSTRUCTIONS:
            1.  **Identify Transactions**: Look for all financial transactions listed in the table.
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

            const text = await callWorkerAI("generateContent", [prompt, imagePart], modelName);
            console.log("Raw AI Response from Worker:", text); // Debug log

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            const cleanText = jsonMatch ? jsonMatch[0] : text;

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
            return await callWorkerAI("generateContent", [systemPrompt, message], modelName);
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

    try {
        const text = await callWorkerAI("generateContent", prompt, MODELS[0]);
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (e) {
        return [];
    }
};

export const getFinancialAdvice = async (transactions) => {
    for (const modelName of MODELS) {
        try {
            const prompt = `
            You are a highly skilled financial advisor. Analyze the following transaction history and provide 3 specific, actionable, and personalized tips.
            Transactions: ${JSON.stringify(transactions.slice(0, 50))}
            
            OUTPUT FORMAT:
            Return ONLY a valid JSON array of strings.
            [ "Tip 1...", "Tip 2...", "Tip 3..." ]
            `;

            const text = await callWorkerAI("generateContent", prompt, modelName);
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanText);
        } catch (error) {
            console.error(`Error getting advice with ${modelName}:`, error);
        }
    }
    return ["Could not generate advice at this time."];
};

// --- 4. NEW AI FEATURES ---

// 4.1 Life-Event Predictor
export const predictLifeEvents = async (transactions) => {
    const prompt = `
    Analyze this transaction history and predict potential upcoming life events or lifestyle shifts (e.g., "Moving soon", "Planning a trip", "High stress week", "Health kick").
    Focus on clusters of spending (e.g., suitcases + tickets = Travel; boxes + furniture = Moving).
    
    Transactions: ${JSON.stringify(transactions.slice(0, 50))}

    OUTPUT: Return a JSON array of strings, e.g., ["Likely planning a vacation", "Increased dining out suggests busy schedule"]. return empty array if no strong signals.
    `;
    return await safeAIRequest(prompt, []);
};

// 4.2 Warranty Extraction
export const extractWarranty = async (text) => {
    const prompt = `
    Extract product warranty details from this text (OCR from receipt).
    Text: "${text.substring(0, 1000)}"

    OUTPUT: Valid JSON object:
    {
        "productName": "Name or Generic Title",
        "purchaseDate": "YYYY-MM-DD",
        "warrantyPeriod": "e.g., 1 Year, 2 Years",
        "expiryDate": "YYYY-MM-DD",
        "serialNo": "if found, else null"
    }
    If no warranty info found, return null.
    `;
    return await safeAIRequest(prompt, null);
};

// 4.3 Emotional Spending Detector
export const analyzeEmotionalSpending = async (transactions) => {
    const prompt = `
    Analyze timestamps and categories to detect emotional spending patterns.
    - Late night (11 PM - 4 AM) = "Late Night Impulse"
    - High frequency food delivery = "Stress Eating"
    - Rapid succession shopping = "Retail Therapy"

    Transactions: ${JSON.stringify(transactions.slice(0, 50))}

    OUTPUT: Valid JSON object:
    {
        "mood": "Stable" | "Stressed" | "Impulsive" | "Happy",
        "insight": "Brief explanation of why.",
        "score": 1-10 (10 is high emotional spending)
    }
    `;
    return await safeAIRequest(prompt, { mood: "Neutral", insight: "Not enough data.", score: 0 });
};

// 4.4 Future Projection
export const detectFutureTrends = async (transactions) => {
    const prompt = `
    Based on past spending, predict the total monthly expense for the next 6 months.
    Transactions: ${JSON.stringify(transactions.slice(0, 100))}

    OUTPUT: Valid JSON object:
    {
        "projection": [
            { "month": "Next Month Name", "predictedExpense": 1200 },
            ... (6 months)
        ],
        "analysis": "Brief reason for trend."
    }
    `;
    return await safeAIRequest(prompt, { projection: [], analysis: "Insufficient data." });
};
