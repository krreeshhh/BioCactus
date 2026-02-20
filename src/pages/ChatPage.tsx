import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Trash2, User, Loader2, Sparkles } from "lucide-react";
import { FaDna as FaDnaIcon } from "react-icons/fa";
import { api } from "@/lib/api";
import CactusAvatar from "@/components/CactusAvatar";
import { useTranslation } from "@/lib/i18n";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
    "What is CRISPR and how does it work?",
    "Explain the difference between DNA and RNA.",
    "How does the XP system work in BioCactus?",
    "What are proteins and why are they important?",
    "How do I maintain my learning streak?",
    "What happens during DNA replication?",
];

const ChatPage = () => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content:
                "Hey there, Explorer! I'm **BioCactus AI** — your personal guide to biotech and biology.\n\nAsk me anything about:\n- **Biology & Biotech** — DNA, RNA, CRISPR, genetics, proteins, cells, and more\n- **Platform Help** — how XP works, streaks, lessons, quizzes, leaderboard\n\nWhat would you like to explore today?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Update welcome message when translation language changes
    useEffect(() => {
        // Only update if it's the default welcome (could use a translation key here)
        // For simplicity, we can just use t('chat.welcome') if we add it to JSON
    }, [t]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || isLoading) return;

        const userMsg: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: trimmed,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        // Build conversation history (exclude welcome)
        const history = messages
            .filter((m) => m.id !== "welcome")
            .map((m) => ({ role: m.role, content: m.content }));

        try {
            const res = await api.chat(trimmed, history);
            const assistantMsg: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: res.data.reply,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMsg]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content:
                        "Sorry, I'm having trouble connecting right now. Please try again in a moment!",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    const clearChat = () => {
        const welcome: Message = {
            id: "welcome",
            role: "assistant",
            content:
                "Hey there, Explorer! I'm **BioCactus AI** — your personal guide to biotech and biology.\n\nAsk me anything about:\n- **Biology & Biotech** — DNA, RNA, CRISPR, genetics, proteins, cells, and more\n- **Platform Help** — how XP works, streaks, lessons, quizzes, leaderboard\n\nWhat would you like to explore today?",
            timestamp: new Date(),
        };
        setMessages([welcome]);
    };

    const formatTime = (date: Date) =>
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto px-4 py-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-6 flex-shrink-0"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/10">
                        <FaDnaIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter">{t('common.ai_assistant')}</h1>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                                Online · Powered by Gemini
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={clearChat}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all border border-white/5 hover:border-destructive/20"
                >
                    <Trash2 className="w-4 h-4" />
                    Reset
                </button>
            </motion.div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-6 pb-4 custom-scrollbar pr-1">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                        >
                            {/* Avatar */}
                            <div className="shrink-0 mt-1">
                                {msg.role === "assistant" ? (
                                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center shadow-md">
                                        <CactusAvatar size="sm" showBubble={false} mood="happy" />
                                    </div>
                                ) : (
                                    <div className="w-9 h-9 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-md">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                )}
                            </div>

                            {/* Bubble */}
                            <div className={`flex flex-col gap-1 max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                                <div
                                    className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-lg ${msg.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-tr-sm shadow-primary/20"
                                        : "bg-white/5 border border-white/8 text-foreground rounded-tl-sm"
                                        }`}
                                >
                                    {msg.role === "assistant" ? (
                                        <div className="space-y-1.5 text-sm leading-relaxed">
                                            {msg.content.split("\n").map((line, i) => {
                                                if (line.startsWith("- ") || line.startsWith("* ")) {
                                                    return (
                                                        <div key={i} className="flex items-start gap-2">
                                                            <span className="text-primary mt-1 shrink-0 text-xs">•</span>
                                                            <span dangerouslySetInnerHTML={{
                                                                __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                            }} />
                                                        </div>
                                                    );
                                                }
                                                if (line === "") return <div key={i} className="h-1" />;
                                                return (
                                                    <p key={i} dangerouslySetInnerHTML={{
                                                        __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                    }} />
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                    )}
                                </div>
                                <span className="text-[10px] text-muted-foreground/40 font-medium px-1">
                                    {formatTime(msg.timestamp)}
                                </span>
                            </div>
                        </motion.div>
                    ))}

                    {/* Typing indicator */}
                    {isLoading && (
                        <motion.div
                            key="typing"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex gap-3"
                        >
                            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                                <CactusAvatar size="sm" showBubble={false} mood="thinking" />
                            </div>
                            <div className="px-5 py-4 rounded-2xl rounded-tl-sm bg-white/5 border border-white/8 flex items-center gap-1.5">
                                {[0, 1, 2].map((i) => (
                                    <motion.span
                                        key={i}
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                                        className="w-2 h-2 rounded-full bg-primary/60 block"
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={bottomRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length <= 1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-shrink-0 mb-4"
                >
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-3 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> {t('chat.suggested')}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {SUGGESTED_QUESTIONS.map((q) => (
                            <button
                                key={q}
                                onClick={() => sendMessage(q)}
                                className="text-left px-4 py-3 rounded-xl bg-white/3 border border-white/8 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/8 hover:border-primary/20 transition-all text-ellipsis overflow-hidden whitespace-nowrap"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Input Bar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-shrink-0 flex gap-3 items-end mt-2"
            >
                <div className="flex-1 relative bg-white/5 border border-white/10 rounded-2xl focus-within:border-primary/40 focus-within:bg-white/8 transition-all shadow-lg">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            e.target.style.height = "auto";
                            e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={t('chat.placeholder')}
                        rows={1}
                        disabled={isLoading}
                        className="w-full bg-transparent resize-none px-5 py-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none max-h-40 custom-scrollbar disabled:opacity-50"
                    />
                </div>

                <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || isLoading}
                    className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 hover:bg-primary/80 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-primary-foreground" />
                    ) : (
                        <Send className="w-5 h-5 text-primary-foreground" />
                    )}
                </button>
            </motion.div>

            <p className="text-center text-[10px] text-muted-foreground/30 font-medium mt-3 flex-shrink-0">
                Press Enter to send · Shift+Enter for new line · Powered by Gemini AI
            </p>
        </div>
    );
};

export default ChatPage;
