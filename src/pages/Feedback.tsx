import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Star, Send, Rocket, Heart, AlertCircle, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";
import CactusAvatar from "@/components/CactusAvatar";

const FEEDBACK_TYPES = [
    { value: "bug", label: "Bug Report", icon: AlertCircle, color: "text-destructive" },
    { value: "feature", label: "Feature Request", icon: Rocket, color: "text-primary" },
    { value: "improvement", label: "Improvement", icon: Sparkles, color: "text-xp-gold" },
    { value: "other", label: "Other", icon: MessageSquare, color: "text-muted-foreground" },
];

import { Sparkles } from "lucide-react";

const Feedback = () => {
    const { t } = useTranslation();
    const [type, setType] = useState("feature");
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            toast.error("Please enter a message");
            return;
        }

        setIsSubmitting(true);
        try {
            await api.submitFeedback({ type, message, rating });
            setSubmitted(true);
            toast.success("Feedback submitted! BioCactus is growing thanks to you.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit feedback. Our cacti are working on it.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-card p-12 max-w-lg w-full relative overflow-hidden"
                >
                    <div className="absolute top-0 inset-x-0 h-1.5 gradient-primary" />
                    <CactusAvatar mood="celebrating" size="lg" message="Got it! Your feedback has been planted." />

                    <h1 className="text-3xl font-black mt-10 mb-4 bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">
                        Thank You!
                    </h1>
                    <p className="text-muted-foreground mb-10 leading-relaxed">
                        Your thoughts mean the world to the BioCactus team. We're actively reviewing every response to make your biotech journey even better.
                    </p>

                    <button
                        onClick={() => setSubmitted(false)}
                        className="w-full py-4 rounded-xl gradient-primary text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Send More Feedback
                    </button>

                    <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                        <Heart className="w-3 h-3 text-destructive fill-destructive" /> Crafted with Bio-Engineers
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row items-center gap-6 mb-12"
            >
                <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/5">
                    <MessageSquare className="w-10 h-10 text-primary" />
                </div>
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-black tracking-tight mb-2">Help Us Evolve</h1>
                    <p className="text-muted-foreground font-medium">Found a bug? Have a brilliant idea? We're all ears.</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Information Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                >
                    <div className="glass-card p-6 border-l-4 border-l-xp-gold">
                        <div className="flex items-center gap-3 mb-4">
                            <Star className="w-5 h-5 text-xp-gold fill-xp-gold" />
                            <h3 className="font-bold">Evolving Together</h3>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            BioCactus is an AI-first platform. Your feedback directly trains our internal models to provide clearer lessons and more challenging quizzes.
                        </p>
                    </div>

                    <div className="glass-card p-6 border-l-4 border-l-primary">
                        <div className="flex items-center gap-3 mb-4">
                            <Rocket className="w-5 h-5 text-primary" />
                            <h3 className="font-bold">Our Promise</h3>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Every single submission is read by our core engineering team. We prioritize feature requests that get mentioned the most!
                        </p>
                    </div>
                </motion.div>

                {/* Main Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <form onSubmit={handleSubmit} className="glass-card p-6 md:p-10 space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none" />

                        {/* Type Selection */}
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                                Feedback Type
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {FEEDBACK_TYPES.map((f) => (
                                    <button
                                        key={f.value}
                                        type="button"
                                        onClick={() => setType(f.value)}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2 ${type === f.value
                                                ? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
                                                : "bg-white/5 border-transparent hover:bg-white/8"
                                            }`}
                                    >
                                        <f.icon className={`w-6 h-6 ${type === f.value ? "text-primary" : "text-muted-foreground"}`} />
                                        <span className={`text-[10px] font-bold uppercase tracking-tight ${type === f.value ? "text-primary" : "text-muted-foreground"
                                            }`}>
                                            {f.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                                Overall Satisfaction
                            </label>
                            <div className="flex items-center gap-3">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setRating(s)}
                                        className="focus:outline-none transition-transform active:scale-90"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${s <= rating
                                                    ? "text-xp-gold fill-xp-gold filter drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]"
                                                    : "text-white/10"
                                                } transition-colors`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                                Your Message
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Describe your experience or suggest a feature..."
                                rows={6}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/8 transition-all resize-none custom-scrollbar"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 rounded-xl gradient-primary text-sm font-black flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                                    <Rocket className="w-5 h-5 text-primary-foreground" />
                                </motion.div>
                            ) : (
                                <>
                                    <Send className="w-5 h-5 text-primary-foreground" />
                                    <span>Transmit Feedback</span>
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Feedback;
