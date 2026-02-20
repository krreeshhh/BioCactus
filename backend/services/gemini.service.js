const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

const generateLesson = async (topicTitle, userPrefs = {}) => {
  const { experience = 'beginner', topics = 'molecular' } = userPrefs;
  const prompt = `Explain the topic "${topicTitle}" in a way suitable for a ${experience} level student. 
    The student is specifically interested in ${topics}. 
    Keep under 250 words. Friendly and encouraging tone. 
    Use a cactus-themed metaphor if possible.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Lesson Generation Failed:", error.message);
    return `Welcome to your lesson on ${topicTitle}! As a ${experience} learner, you're about to explore the fascinating world of ${topics}. Just like a cactus stores water for the long haul, we're going to build a solid foundation of knowledge here. Stay curious and keep growing!`;
  }
};

const generateQuiz = async (topicTitle, userPrefs = {}) => {
  const { experience = 'beginner' } = userPrefs;
  const prompt = `Generate exactly 5 distinct multiple-choice questions about the biotech topic: "${topicTitle}".
  Target Audience: ${experience} level student.
  
  CRITICAL INSTRUCTIONS:
  1. DO NOT use placeholder text like "Option A", "Option B", etc. for options. Provide actual plausible answers.
  2. Ensure the "correctAnswer" matches one of the "options" EXACTLY.
  3. Provide a helpful "explanation" for why the answer is correct.
  
  Return ONLY a structured JSON array:
  [
    {
      "question": "Clear question text?",
      "options": ["Real Choice 1", "Real Choice 2", "Real Choice 3", "Real Choice 4"],
      "correctAnswer": "Real Choice 1",
      "explanation": "Scientific explanation here."
    }
  ]`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response if it contains markdown code blocks
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Quiz Generation Failed:", error.message);
    return [
      {
        "question": `What is the primary goal of ${topicTitle || 'Biotechnology'}?`,
        "options": ["Genetic manipulation", "Observation only", "Waste disposal", "Painting"],
        "correctAnswer": "Genetic manipulation",
        "explanation": "Biotechnology focuses on using living systems and organisms to develop or make products."
      },
      {
        "question": "Which molecule carries genetic information?",
        "options": ["DNA", "ATP", "Glucose", "Hemoglobin"],
        "correctAnswer": "DNA",
        "explanation": "DNA (Deoxyribonucleic acid) is the hereditary material in humans and almost all other organisms."
      },
      {
        "question": "What does CRISPR stand for?",
        "options": ["Clustered Regularly Interspaced Short Palindromic Repeats", "Critical Response in Species Research", "Cellular Regeneration in Synthetic Protein", "Cybernetic Research in Species"],
        "correctAnswer": "Clustered Regularly Interspaced Short Palindromic Repeats",
        "explanation": "CRISPR is a revolutionary gene-editing technology."
      },
      {
        "question": "Which of these is a common use of biotechnology in agriculture?",
        "options": ["Pest-resistant crops", "Manual weeding", "Coloring soil", "Cloud seeding"],
        "correctAnswer": "Pest-resistant crops",
        "explanation": "BT cotton and other crops are engineered to be resistant to specific pests."
      },
      {
        "question": "What is 'Molecular Cloning'?",
        "options": ["Creating copies of DNA fragments", "Cloning whole humans", "Mixing chemicals", "Cleaning lab equipment"],
        "correctAnswer": "Creating copies of DNA fragments",
        "explanation": "Molecular cloning is a set of experimental methods used to assemble recombinant DNA molecules."
      }
    ];
  }
};

const generateFeedback = async (score, total, userPrefs = {}) => {
  const { experience = 'beginner' } = userPrefs;
  const prompt = `User at ${experience} level scored ${score} out of ${total} in a biology quiz. Generate a short, friendly, and encouraging feedback message.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    return `Great effort! You scored ${score}/${total}. Keep practicing to level up your ${experience} skills!`;
  }
};

const generateCurriculum = async (experience, interest) => {
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
  
  Return structured JSON format ONLY:
  [
    {
      "id": "module-slug",
      "title": "Module Title",
      "description": "Short description",
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
    console.log("Raw Gemini Curriculum Response:", text);
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
  } catch (error) {
    console.error("Gemini Curriculum Generation Failed, using fallback:", error.message);
    // Fallback curriculum based on interests
    return [
      {
        "id": "intro-bio",
        "title": `Introduction to ${interest}`,
        "description": `Master the fundamentals of ${interest} at a ${experience} level.`,
        "icon": "🌿",
        "color": "from-emerald-500 to-teal-600",
        "order": 1,
        "lessonsCount": 6,
        "xpGoal": 600
      },
      {
        "id": "advanced-topics",
        "title": `Advanced ${interest}`,
        "description": "Deep dive into complex biological systems and theories.",
        "icon": "🧪",
        "color": "from-blue-500 to-indigo-600",
        "order": 2,
        "lessonsCount": 8,
        "xpGoal": 800
      },
      {
        "id": "bio-tech-apply",
        "title": "Applied Biotechnology",
        "description": "Real-world applications of modern biological tools.",
        "icon": "🔬",
        "color": "from-purple-500 to-pink-600",
        "order": 3,
        "lessonsCount": 5,
        "xpGoal": 500
      },
      {
        "id": "future-horizons",
        "title": "Future of Biology",
        "description": "Exploring the cutting-edge research and ethics.",
        "icon": "🚀",
        "color": "from-orange-500 to-red-600",
        "order": 4,
        "lessonsCount": 7,
        "xpGoal": 700
      }
    ];
  }
};

module.exports = {
  generateLesson,
  generateQuiz,
  generateFeedback,
  generateCurriculum
};
