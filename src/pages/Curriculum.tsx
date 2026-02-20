import { motion } from "framer-motion";
import {
    LayoutGrid,
    CheckCircle2,
    Circle,
    Lock,
    Zap,
    Trophy,
    ArrowRight,
    BookOpen,
    Milestone
} from "lucide-react";
import { GiDna1 } from "react-icons/gi";
import { topicIconMap } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";

const Curriculum = () => {
    const { t } = useTranslation();
    const { data: progressData, isLoading } = useQuery({
        queryKey: ["progress"],
        queryFn: api.getProgress,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                    className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
                />
            </div>
        );
    }

    const { topics = [], overallCompletion = 0 } = progressData?.data || {};

    return (
        <div className="space-y-10 max-w-[1200px] mx-auto pb-20">
            {/* Header section */}
            <div className="relative overflow-hidden m3-glass p-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32" />
                <div className="relative z-10 space-y-4 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">{t('common.curriculum_title')}</h1>
                    <p className="text-muted-foreground text-lg max-w-xl">
                        {t('common.curriculum_desc')}
                    </p>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="58"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-white/5"
                            />
                            <motion.circle
                                cx="64"
                                cy="64"
                                r="58"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={364.4}
                                initial={{ strokeDashoffset: 364.4 }}
                                animate={{ strokeDashoffset: 364.4 - (364.4 * overallCompletion) / 100 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="text-primary"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-3xl font-black tracking-tighter">{Math.round(overallCompletion)}%</span>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest leading-none">{t('common.complete')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Path Section */}
            <div className="space-y-12">
                {topics.map((topic: any, topicIdx: number) => {
                    const completedCount = topic.completedLessons?.length || 0;
                    const totalLessons = topic.lessonsCount || 5;
                    const progress = (completedCount / totalLessons) * 100;

                    return (
                        <motion.div
                            key={topic.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: topicIdx * 0.1 }}
                            className="relative"
                        >
                            {/* Vertical connecting line between sections */}
                            {topicIdx < topics.length - 1 && (
                                <div className="absolute left-10 top-20 bottom-[-48px] w-0.5 bg-gradient-to-b from-primary/30 to-transparent z-0" />
                            )}

                            <div className="flex gap-8 relative z-10">
                                {/* Topic Node Indicator */}
                                <div className="hidden md:flex flex-col items-center pt-2 shrink-0">
                                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border-2 transition-all duration-500 shadow-2xl ${progress === 100
                                        ? "bg-primary border-primary shadow-primary/20"
                                        : progress > 0
                                            ? "bg-primary/20 border-primary/40"
                                            : "bg-white/5 border-white/10"
                                        }`}>
                                        {(() => {
                                            const Icon = topicIconMap[topic.id || topic.topicId] || GiDna1;
                                            return <Icon className="w-9 h-9 text-white/90" />;
                                        })()}
                                    </div>
                                </div>

                                <div className="flex-1 space-y-6">
                                    {/* Topic Header */}
                                    <div className="m3-glass p-8 group hover:bg-white/[0.02] transition-all">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <h2 className="text-2xl font-black tracking-tighter">{topic.title}</h2>
                                                    {progress === 100 && <CheckCircle2 className="w-5 h-5 text-primary" />}
                                                </div>
                                                <p className="text-sm text-muted-foreground/80 line-clamp-1">{topic.description}</p>
                                            </div>
                                            <Link
                                                to={`/course/${topic.id}`}
                                                className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95"
                                            >
                                                <ArrowRight className="w-5 h-5" />
                                            </Link>
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                                                <p className="text-[10px] font-black uppercase text-muted-foreground/40 mb-1 tracking-widest">{t('common.progress')}</p>
                                                <p className="text-lg font-black">{completedCount} / {totalLessons} {t('common.lessons')}</p>
                                            </div>
                                            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                                                <p className="text-[10px] font-black uppercase text-muted-foreground/40 mb-1 tracking-widest">{t('common.rewards')}</p>
                                                <div className="flex items-center gap-2">
                                                    <Zap className="w-4 h-4 text-xp" />
                                                    <p className="text-lg font-black text-xp">{topic.xp || 100} XP</p>
                                                </div>
                                            </div>
                                            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                                                <p className="text-[10px] font-black uppercase text-muted-foreground/40 mb-1 tracking-widest">{t('common.status')}</p>
                                                <p className={`text-lg font-black ${progress === 100 ? "text-primary" : progress > 0 ? "text-accent" : "text-muted-foreground/60"}`}>
                                                    {progress === 100 ? t('common.mastered') : progress > 0 ? t('common.in_transit') : t('common.unmapped')}
                                                </p>
                                            </div>
                                            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                                                <p className="text-[10px] font-black uppercase text-muted-foreground/40 mb-1 tracking-widest">{t('common.milestone')}</p>
                                                <div className="flex items-center gap-2">
                                                    <Milestone className={`w-4 h-4 ${progress === 100 ? "text-primary" : "text-muted-foreground/20"}`} />
                                                    <p className="text-lg font-black leading-none">{topicIdx + 1}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mini Progress Bar */}
                                        <div className="mt-6 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                className="h-full bg-primary"
                                            />
                                        </div>
                                    </div>

                                    {/* Lessons Preview Grid (Simulated milestones) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                        {Array.from({ length: totalLessons }).map((_, i) => {
                                            const isComplete = i < completedCount;
                                            const isUpcoming = i === completedCount;

                                            return (
                                                <div
                                                    key={i}
                                                    className={`p-4 rounded-2xl border transition-all ${isComplete
                                                        ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
                                                        : isUpcoming
                                                            ? "bg-white/5 border-white/20 hover:border-primary/40 cursor-pointer"
                                                            : "bg-white/5 border-white/5 opacity-40"
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <span className="text-[10px] font-bold text-muted-foreground/60">{t('common.module')} {i + 1}</span>
                                                        {isComplete ? (
                                                            <CheckCircle2 className="w-4 h-4 text-primary" />
                                                        ) : isUpcoming ? (
                                                            <Circle className="w-4 h-4 text-muted-foreground/40" />
                                                        ) : (
                                                            <Lock className="w-3.5 h-3.5 text-muted-foreground/20" />
                                                        )}
                                                    </div>
                                                    <p className={`text-xs font-bold leading-tight ${isUpcoming ? "text-foreground" : "text-muted-foreground"}`}>
                                                        {isComplete ? t('common.sync_finalized') : isUpcoming ? t('common.ready_for_sync') : t('common.access_encrypted')}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer Incentive */}
            <div className="m3-glass p-12 text-center space-y-6 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                <Trophy className="w-16 h-16 text-xp mx-auto mb-4 animate-bounce" />
                <h2 className="text-3xl font-black tracking-tighter">{t('common.next_frontier')}</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    {t('common.frontier_desc')}
                </p>
                <button className="glossy-button mx-auto mt-4 px-10 py-4 text-base uppercase tracking-[0.2em]">
                    {t('common.initiate_module')}
                </button>
            </div>
        </div>
    );
};

export default Curriculum;
