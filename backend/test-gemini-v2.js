const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // The SDK doesn't have a direct listModels but we can try to find valid ones
        const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];
        for (const modelName of models) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("test");
                console.log(`✅ ${modelName} works!`);
            } catch (e) {
                console.log(`❌ ${modelName} failed: ${e.message}`);
            }
        }
    } catch (e) {
        console.error("General error:", e);
    }
}

listModels();
