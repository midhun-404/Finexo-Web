const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL_NAME = "qwen/qwen-2.5-vl-7b-instruct:free";

// Helper for OpenRouter API Calls
const callOpenRouter = async (messages, functions = null) => {
    try {
        const payload = {
            model: MODEL_NAME,
            messages: messages,
            // Qwen 2.5 VL supports JSON mode via strict prompt instruction usually, 
            // but we'll try to keep it simple. OpenRouter auto-maps standard parameters.
        };

        const response = await fetch(OPENROUTER_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": window.location.origin, // Required by OpenRouter for free tier
                "X-Title": "Finexo App",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `OpenRouter API failed: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error) {
        console.error("AI Service Error:", error);
        throw error;
    }
};

// Helper to reliably parse JSON response
const extractJSON = (text) => {
    try {
        // First try direct parse
        return JSON.parse(text);
    } catch (e) {
        // Try extracting code block
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) ||
            text.match(/\{[\s\S]*\}/) ||
            text.match(/\[[\s\S]*\]/);

        if (jsonMatch) {
            try {
                // If regex matched a group (like the code block content), use that, else use the whole match
                const content = jsonMatch[1] ? jsonMatch[1] : jsonMatch[0];
                return JSON.parse(content);
            } catch (k) {
                console.warn("Failed to extract JSON from markdown");
            }
        }
        console.warn("Could not parse JSON response:", text);
        return null;
    }
};

// --- 1. Statement Analysis (Vision) ---
export const analyzeStatement = async (fileBase64) => {
    const prompt = `
    You are a highly skilled financial assistant. Your task is to analyze the provided bank statement image and extract transaction details.

    IMPORTANT:
    - Focus ONLY on the transaction table.
    - Extract Date, Description, Amount (with currency symbol, prefix - for expense, + for income), Type (income/expense), and Category.
    - LOGIC RULES FOR CLASSIFICATION:
        - "TRANSFER TO" or similar wording (e.g. "To User", "Paid to") means money leaving the account -> CLASSIFY AS EXPENSE (DEBIT).
        - "TRANSFER FROM" or similar wording (e.g. "From User", "Received from") means money entering the account -> CLASSIFY AS INCOME (CREDIT).
        - Correctly apply the negative sign (-) for expenses and positive sign (+) for income based on this logic.
    - Provide brief financial advice based on the data.

    OUTPUT FORMAT:
    Return ONLY a valid JSON object. No Markdown.
    {
        "transactions": [
            {
                "id": "unique_id",
                "title": "Merchant Name/Description",
                "date": "MMM DD, YYYY",
                "amount": "-$50.00",
                "type": "expense",
                "category": "Food/Transfer"
            }
        ],
        "advice": "Short advice string."
    }
    `;

    // Construct Multimodal Message
    const messages = [
        {
            role: "user",
            content: [
                { type: "text", text: prompt },
                {
                    type: "image_url",
                    image_url: {
                        url: fileBase64 // OpenRouter/Qwen supports data URI
                    }
                }
            ]
        }
    ];

    try {
        const responseText = await callOpenRouter(messages);
        const data = extractJSON(responseText);
        if (!data) throw new Error("Invalid JSON response from AI");
        return data;
    } catch (error) {
        console.error("Statement Analysis Failed:", error);
        throw error;
    }
};

// --- 2. Felica Chatbot ---
export const chatWithFelica = async (message, contextData) => {
    const systemPrompt = `
    You are Felica, an exclusive financial assistant for the Finexo app.
    
    CONTEXT:
    User's recent transactions: ${JSON.stringify(contextData.transactions.slice(0, 20))}
    User's current balance: ${contextData.balance}
    
    RULES:
    1. Answer ONLY queries related to finances or the app.
    2. Be friendly, encouraging, and professional.
    3. Keep answers concise (<3 sentences).
    `;

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
    ];

    try {
        return await callOpenRouter(messages);
    } catch (error) {
        return "I'm having trouble connecting to my financial brain right now. Please try again.";
    }
};

// --- 3. Advanced Analysis Features ---

export const detectSubscriptions = async (transactions) => {
    const prompt = `
    Analyze these transactions and identify recurring subscriptions.
    Transactions: ${JSON.stringify(transactions)}
    Output JSON array: [{ "name": "Netflix", "amount": "15.00", "frequency": "Monthly", "likelihood": "High" }]
    Return ONLY JSON.
    `;

    try {
        const text = await callOpenRouter([{ role: "user", content: prompt }]);
        return extractJSON(text) || [];
    } catch (e) {
        return [];
    }
};

export const getFinancialAdvice = async (transactions) => {
    const prompt = `
    Analyze these transactions and provide 3 specific financial tips.
    Transactions: ${JSON.stringify(transactions.slice(0, 50))}
    Output: JSON array of strings e.g. ["Tip 1", "Tip 2"]. Return ONLY JSON.
    `;

    try {
        const text = await callOpenRouter([{ role: "user", content: prompt }]);
        return extractJSON(text) || ["Keep tracking your expenses to gain better insights."];
    } catch (e) {
        return ["Could not generate specific advice at this moment."];
    }
};

// --- 4. NEW AI FEATURES ---

// 4.1 Life-Event Predictor
export const predictLifeEvents = async (transactions) => {
    const prompt = `
    Predict upcoming life events based on spending patterns (e.g. moving, travel).
    Transactions: ${JSON.stringify(transactions.slice(0, 50))}
    Output: JSON array of strings. Return ONLY JSON.
    `;
    try {
        const text = await callOpenRouter([{ role: "user", content: prompt }]);
        return extractJSON(text) || [];
    } catch (e) { return []; }
};

// 4.2 Warranty Extraction
export const extractWarranty = async (text) => {
    const prompt = `
    Extract warranty info from text: "${text.substring(0, 1000)}"
    Output JSON: { productName, purchaseDate, warrantyPeriod, expiryDate, serialNo }. Return null if none.
    Return ONLY JSON.
    `;
    try {
        const res = await callOpenRouter([{ role: "user", content: prompt }]);
        return extractJSON(res);
    } catch (e) { return null; }
};

// 4.3 Emotional Spending Detector
export const analyzeEmotionalSpending = async (transactions) => {
    const prompt = `
    Detect emotional spending (late night, stress eating).
    Transactions: ${JSON.stringify(transactions.slice(0, 50))}
    Output JSON: { mood, insight, score (1-10) }. Return ONLY JSON.
    `;
    try {
        const res = await callOpenRouter([{ role: "user", content: prompt }]);
        return extractJSON(res) || { mood: "Neutral", insight: "No data", score: 0 };
    } catch (e) { return { mood: "Neutral", insight: "Error analyzing", score: 0 }; }
};

// 4.4 Future Projection
export const detectFutureTrends = async (transactions) => {
    const prompt = `
    Predict total monthly expense for next 6 months based on history.
    Transactions: ${JSON.stringify(transactions.slice(0, 100))}
    Output JSON: { projection: [{month, predictedExpense}], analysis }. Return ONLY JSON.
    `;
    try {
        const res = await callOpenRouter([{ role: "user", content: prompt }]);
        return extractJSON(res) || { projection: [], analysis: "No data" };
    } catch (e) { return { projection: [], analysis: "Error projecting" }; }
};
