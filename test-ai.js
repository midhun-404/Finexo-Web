// Using built-in fetch
import fs from 'fs';

const API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function testAI() {
    try {
        console.log("Testing OpenRouter API...");
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:5173',
                'X-Title': 'Finexo',
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-lite-preview-02-05:free',
                messages: [
                    {
                        role: 'user',
                        content: "Hello"
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error: ${response.status}`);
            fs.writeFileSync('error.log', errorText);
        } else {
            const data = await response.json();
            console.log("Success:", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

testAI();
