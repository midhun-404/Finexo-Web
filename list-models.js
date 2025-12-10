// Using built-in fetch
const API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/models';

async function listModels() {
    try {
        console.log("Listing models...");
        const response = await fetch(API_URL);
        const data = await response.json();

        const freeModels = data.data.filter(m =>
            (m.id.includes('free') || m.pricing.prompt === '0') &&
            (m.id.includes('vision') || m.id.includes('gemini') || m.id.includes('llama-3.2'))
        );
        console.log("Free Vision Models:", freeModels.map(m => m.id));
    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
