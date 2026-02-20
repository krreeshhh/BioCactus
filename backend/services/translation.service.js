const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Translates text into the target language using Gemini AI.
 * @param {string} text - The text to translate.
 * @param {string} languageName - The name of the target language (e.g., 'Tamil').
 * @returns {Promise<string>} - The translated text.
 */
const translateText = async (text, languageName) => {
    if (!text || languageName === 'English') return text;

    const prompt = `Translate the following educational biotechnology text into ${languageName}.
    Rules:
    - Return ONLY the translated text.
    - Use the native script of ${languageName}.
    - Do not include any explanations, notes, or original text.
    - Maintain the technical accuracy of scientific terms (keep in English in parentheses if necessary for clarity, e.g., "DNA (DNA)").
    - Tone: Helpful and educational.

    Text to translate:
    "${text}"`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error(`Translation to ${languageName} failed:`, error.message);
        return text; // Fallback to original text
    }
};

module.exports = { translateText };
