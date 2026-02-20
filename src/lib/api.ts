import { auth } from "./firebase";

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000/api" : "/api");

const fetchWithToken = async (endpoint: string, options: RequestInit = {}) => {
    if (!auth) {
        throw new Error("Firebase Auth not initialized. Check your .env file.");
    }
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User not authenticated");
    }

    const token = await user.getIdToken();
    const headers = {
        ...options.headers,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "x-language": localStorage.getItem("preferredLanguage") || "en",
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "API request failed");
    }

    return data;
};

export const api = {
    login: () => fetchWithToken("/auth/login", { method: "POST" }),
    getUser: () => fetchWithToken("/user"),
    getLesson: (topicId: string, lessonIndex?: string) => fetchWithToken(`/lesson/${topicId}?index=${lessonIndex}`),
    getQuiz: (topicId: string, lessonIndex?: string) => fetchWithToken(`/quiz/${topicId}?index=${lessonIndex}`),
    submitQuiz: (topicId: string, answers: any, questions: any, lessonIndex?: string) =>
        fetchWithToken("/quiz/submit", {
            method: "POST",
            body: JSON.stringify({ topicId, answers, questions, lessonIndex })
        }),
    getProgress: () => fetchWithToken("/progress"),
    generateCurriculum: (prefs: any) => fetchWithToken("/user/curriculum", {
        method: "POST",
        body: JSON.stringify(prefs)
    }),
    getLeaderboard: () => fetchWithToken("/user/leaderboard"),
    updateLanguage: (languageCode: string) => fetchWithToken("/user/language", {
        method: "POST",
        body: JSON.stringify({ languageCode })
    }),
    chat: (message: string, history: { role: string; content: string }[]) =>
        fetchWithToken("/chat", {
            method: "POST",
            body: JSON.stringify({ message, history }),
        }),
    submitFeedback: (data: { type: string; message: string; rating: number }) =>
        fetchWithToken("/feedback", {
            method: "POST",
            body: JSON.stringify(data)
        }),
};
