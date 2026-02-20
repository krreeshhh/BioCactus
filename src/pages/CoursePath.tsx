import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Lock, Play, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import CactusAvatar from "@/components/CactusAvatar";

const CoursePath = () => {
    const { topicId } = useParams<{ topicId: string }>();

    const { data: progressData, isLoading } = useQuery({
        queryKey: ["progress"],
        queryFn: api.getProgress,
    });

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground h-screen flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
        </div>;
    }

    const topic = progressData?.data?.topics.find((t: any) => t.topicId === topicId || t.id === topicId);

    if (!topic) {
        return (
            <div className="p-8 text-center h-screen flex flex-col items-center justify-center">
                <CactusAvatar mood="sad" message="Path not found!" size="lg" />
                <Link to="/dashboard" className="text-primary mt-4 font-bold hover:underline transition-all">← Back to Dashboard</Link>
            </div>
        );
    }

    const lessonsCount = topic.lessonsCount || topic.lessons || 5;
    const completedCount = topic.completedLessons?.length || 0;

    // Generate path points in a winding vertical zigzag
    const levels = Array.from({ length: lessonsCount }, (_, i) => {
        const isCompleted = i < completedCount;
        const isCurrent = i === completedCount;
        const isLocked = i > completedCount;

        // Zigzag logic responsive: use smaller offset on mobile
        const xOffsetMult = typeof window !== 'undefined' && window.innerWidth < 768 ? 40 : 100;
        const xOffset = Math.sin(i * 1.2) * xOffsetMult;

        return {
            id: i + 1,
            x: xOffset,
            isCompleted,
            isCurrent,
            isLocked,
        };
    });

    const cactusM = completedCount === lessonsCount ? "celebrating" : (completedCount > 0 ? "happy" : "thinking");

    return (
        <div className="min-h-screen w-full bg-[#0a0c10] overflow-x-hidden pb-32 selection:bg-primary/30">
            {/* Bio-themed Decorations */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] -left-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] -right-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] right-[10%] w-40 h-40 bg-xp-gold/5 rounded-full blur-[80px]" />
            </div>

            {/* Header Space */}
            <div className="p-6 lg:p-8 flex items-center justify-between sticky top-0 z-50 bg-[#0a0c10]/90 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-5">
                    <Link to="/dashboard" className="w-10 h-10 flex items-center justify-center rounded-xl bg-secondary/80 hover:bg-secondary border border-white/5 transition-all hover:scale-105 active:scale-95 group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2.5">
                            <span className="text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{topic.icon}</span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">{topic.title}</span>
                        </h1>
                        <div className="flex items-center gap-3 mt-0.5">
                            <div className="flex -space-x-1">
                                {Array.from({ length: Math.min(completedCount, 3) }).map((_, i) => (
                                    <div key={i} className="w-3.5 h-3.5 rounded-full bg-primary border-2 border-[#0a0c10] shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                ))}
                            </div>
                            <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-muted-foreground opacity-70">{completedCount} / {lessonsCount} Lessons Mastery</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl">
                    <div className="p-1 rounded-full bg-xp-gold/20 mr-1">
                        <Star className="w-3.5 h-3.5 text-xp-gold fill-xp-gold" />
                    </div>
                    <span className="text-sm font-black text-white/90 leading-none">{topic.xp || 0} <span className="text-[10px] text-muted-foreground ml-0.5 uppercase">XP</span></span>
                </div>
            </div>

            {/* The Winding Path Root */}
            <div className="max-w-xl mx-auto relative mt-24 mb-20 px-10">
                {/* Curvy Connecting Line (SVG) */}
                <div className="absolute inset-0 flex justify-center pointer-events-none">
                    <svg width="400" height={levels.length * 180 + 200} viewBox={`0 0 400 ${levels.length * 180 + 200}`} className="opacity-20 translate-y-20">
                        <defs>
                            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#22c55e" />
                                <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                        </defs>
                        <path
                            d={`M ${200 + levels[0].x} ${levels.length * 180} ${levels.slice(1).map((_, i) => {
                                const idx = i;
                                const nextIdx = i + 1;
                                const currX = 200 + levels[idx].x;
                                const currY = (levels.length - idx) * 180;
                                const nextX = 200 + levels[nextIdx].x;
                                const nextY = (levels.length - nextIdx) * 180;
                                return `C ${currX} ${currY - 90}, ${nextX} ${nextY + 90}, ${nextX} ${nextY}`;
                            }).join(' ')}`}
                            fill="none"
                            stroke="url(#pathGradient)"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray="1 25"
                        />
                    </svg>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                    {levels.slice().reverse().map((level, i) => {
                        return (
                            <div
                                key={level.id}
                                className="relative mb-24 flex items-center justify-center"
                                style={{
                                    transform: `translateX(${level.x}px)`,
                                    height: '100px'
                                }}
                            >
                                {/* Level Node */}
                                <Link to={level.isLocked ? "#" : `/lesson/${topicId}/${level.id}`} className={level.isLocked ? "cursor-not-allowed" : ""}>
                                    <div className="relative group">
                                        {/* Outer Rings & Glows for Current Level */}
                                        {level.isCurrent && (
                                            <div className="absolute inset-0 -m-5 rounded-full bg-primary/20 animate-ping opacity-40" />
                                        )}
                                        {level.isCurrent && (
                                            <div className="absolute inset-0 -m-3 rounded-full border-4 border-primary/30 animate-pulse" />
                                        )}

                                        <motion.div
                                            whileHover={!level.isLocked ? { scale: 1.15, y: -5 } : {}}
                                            whileTap={!level.isLocked ? { scale: 0.9 } : {}}
                                            className={`
                          w-24 h-24 rounded-full flex items-center justify-center relative
                          shadow-[0_12px_15px_rgba(0,0,0,0.5)] 
                          transition-all duration-500 border-[6px]
                          ${level.isCompleted ? 'bg-gradient-to-b from-primary to-emerald-700 border-emerald-900/50' :
                                                    level.isCurrent ? 'bg-gradient-to-b from-xp-gold to-orange-500 border-orange-800/50 ring-4 ring-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.4)]' :
                                                        'bg-gradient-to-b from-[#1a1c24] to-[#0a0c10] border-white/5 opacity-80'}
                        `}
                                        >
                                            {level.isCompleted ? (
                                                <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }}>
                                                    <CheckCircle2 className="w-11 h-11 text-white drop-shadow-md" />
                                                </motion.div>
                                            ) : level.isLocked ? (
                                                <Lock className="w-8 h-8 text-white/10" />
                                            ) : (
                                                <Play className="w-11 h-11 text-white fill-white ml-2 drop-shadow-md" />
                                            )}

                                            {/* Level Label Background */}
                                            <div className={`
                            absolute -bottom-14 whitespace-nowrap px-4 py-2 rounded-2xl 
                             backdrop-blur-md border shadow-2xl transition-all duration-300
                            ${level.isLocked ? 'bg-black/40 border-white/5 opacity-50' : 'bg-white/10 border-white/20 group-hover:bg-white/20 group-hover:border-white/40 group-hover:-translate-y-1'}
                        `}>
                                                <span className={`text-[10px] font-black tracking-[0.2em] uppercase ${level.isCurrent ? 'text-xp-gold' : 'text-white/80'}`}>
                                                    Lesson {level.id}
                                                </span>
                                            </div>

                                            {/* Current Level Marker (BioCactus Avatar) */}
                                            {level.isCurrent && (
                                                <div className="absolute -top-24 z-20 pointer-events-none">
                                                    <motion.div
                                                        animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
                                                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                                        className="filter drop-shadow-[0_10px_20px_rgba(34,197,94,0.5)]"
                                                    >
                                                        <CactusAvatar size="lg" mood="celebrating" showBubble={false} />
                                                    </motion.div>
                                                </div>
                                            )}

                                            {/* Finish Flag at the top */}
                                            {level.id === lessonsCount && (
                                                <div className="absolute -top-16 opacity-30">
                                                    <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                                                        <Star className="w-12 h-12 text-xp-gold fill-xp-gold opacity-50" />
                                                    </motion.div>
                                                </div>
                                            )}
                                        </motion.div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Start Indicator */}
            <div className="flex flex-col items-center mt-20 pb-20">
                <div className="w-16 h-1.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full mb-4" />
                <div className="text-[10px] font-black tracking-[0.5em] uppercase text-primary/40 animate-pulse">Base Camp</div>
            </div>
        </div>
    );
};

export default CoursePath;
