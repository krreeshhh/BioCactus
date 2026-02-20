const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateLesson = async (topicTitle, userPrefs = {}, languageName = 'English') => {
  const { experience = 'beginner', topics = 'molecular' } = userPrefs;
  const prompt = `Explain the topic "${topicTitle}" in a way suitable for a ${experience} level student. 
    The student is specifically interested in ${topics}. 
    Keep under 250 words. Friendly and encouraging tone. 
    Use a cactus-themed metaphor if possible.
    
    CRITICAL: Generate the response STRICTLY in ${languageName} using native script.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Lesson Generation Failed:", error.message);
    return `Welcome! (Note: Generation failed, fallback shown). Lesson on ${topicTitle} for ${experience} level. Language: ${languageName}`;
  }
};

const generateQuiz = async (topicTitle, userPrefs = {}, languageName = 'English') => {
  const { experience = 'beginner' } = userPrefs;
  const prompt = `Generate exactly 5 distinct multiple-choice questions about the biotech topic: "${topicTitle}".
  Target Audience: ${experience} level student.
  
  CRITICAL INSTRUCTIONS:
  1. DO NOT use placeholder text like "Option A", "Option B", etc. for options. Provide actual plausible answers.
  2. Ensure the "correctAnswer" matches one of the "options" EXACTLY.
  3. Provide a helpful "explanation" for why the answer is correct.
  4. Generate EVERYTHING (questions, options, explanations) STRICTLY in ${languageName} using native script.
  
  Return ONLY a structured JSON array:
  [
    {
      "question": "Question text in ${languageName}",
      "options": ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
      "correctAnswer": "Choice 1",
      "explanation": "Explanation in ${languageName}"
    }
  ]`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Quiz Generation Failed:", error.message);
    // Return empty array or localized fallback if needed
    return [];
  }
};

const generateFeedback = async (score, total, userPrefs = {}, languageName = 'English') => {
  const { experience = 'beginner' } = userPrefs;
  const prompt = `User at ${experience} level scored ${score} out of ${total} in a biology quiz. 
  Generate a short, friendly, and encouraging feedback message.
  
  CRITICAL: Generate the response STRICTLY in ${languageName} using native script.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    return `Great effort! ${score}/${total}. (Language fallback)`;
  }
};

const generateCactusMessage = async (type, languageName = 'English') => {
  const prompt = `Generate a short cactus-themed message for a ${type} scenario in a biology learning app.
    Scenarios could be: welcoming back, encouraging after a lesson, celebrating a streak, or a fun biology fact.
    
    CRITICAL: Generate the response STRICTLY in ${languageName} using native script.
    Keep it under 15 words. Friendly and cactus-like!`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    return "Keep growing!";
  }
};

const generateCurriculum = async (experience, interest, languageName = 'English') => {
  const prompt = `Create a personalized biology curriculum for a ${experience} level student interested in ${interest}.
  Return exactly 4 course modules.
  Each module should have: 
  - id (url-friendly slug)
  - title
  - description (max 20 words)
  - icon (emoji)
  - color (Tailwind-compatible gradient like "from-X to-Y")
  - order (1-4)
  - lessonsCount (integer between 5 and 10)
  - xpGoal (integer, e.g., 500)
  
  CRITICAL: Generate titles and descriptions STRICTLY in ${languageName} using native script.
  
  Return structured JSON format ONLY:
  [
    {
      "id": "module-slug",
      "title": "Module Title in ${languageName}",
      "description": "Short description in ${languageName}",
      "icon": "🧬",
      "color": "from-emerald-500 to-teal-600",
      "order": 1,
      "lessonsCount": 5,
      "xpGoal": 500
    }
  ]`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
  } catch (error) {
    console.error("Gemini Curriculum Generation Failed:", error.message);
    return [];
  }
};

module.exports = {
  generateLesson,
  generateQuiz,
  generateFeedback,
  generateCurriculum,
  generateCactusMessage
};

