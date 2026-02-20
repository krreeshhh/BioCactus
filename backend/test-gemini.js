const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const result = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).generateContent("Hi");
        console.log("Gemini 1.5 Flash works!");
    } catch (e) {
        console.error("Gemini 1.5 Flash failed:", e.message);
    }

    try {
        // This is not directly in the SDK to list models easily without a separate fetch usually
        // but let's try a known alternative
        const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent("Hi");
        console.log("Gemini Pro works!");
    } catch (e) {
        console.error("Gemini Pro failed:", e.message);
    }
}

listModels();
