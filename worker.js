import { GoogleGenerativeAI } from "@google/generative-ai";

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // Only handle /api/ai
        if (url.pathname === "/api/ai") {
            // Enable CORS
            const corsHeaders = {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            };

            if (request.method === "OPTIONS") {
                return new Response(null, { headers: corsHeaders });
            }

            if (request.method !== "POST") {
                return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
            }

            try {
                const { action, payload, modelName = "gemini-1.5-flash" } = await request.json();

                const API_KEY = env.VITE_GOOGLE_API_KEY;
                if (!API_KEY) {
                    return new Response(JSON.stringify({ error: "API Key not configured on server" }), {
                        status: 500,
                        headers: { ...corsHeaders, "Content-Type": "application/json" }
                    });
                }

                const genAI = new GoogleGenerativeAI(API_KEY);
                const model = genAI.getGenerativeModel({ model: modelName });

                let result;
                if (action === "generateContent") {
                    // payload can be a string or an array (for vision)
                    result = await model.generateContent(payload);
                    const response = await result.response;
                    return new Response(JSON.stringify({ text: response.text() }), {
                        headers: { ...corsHeaders, "Content-Type": "application/json" }
                    });
                } else {
                    return new Response(JSON.stringify({ error: "Invalid action" }), {
                        status: 400,
                        headers: { ...corsHeaders, "Content-Type": "application/json" }
                    });
                }

            } catch (error) {
                console.error("Worker error:", error);
                return new Response(JSON.stringify({ error: error.message }), {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                });
            }
        }

        // Fallback to static assets
        return env.ASSETS.fetch(request);
    },
};
