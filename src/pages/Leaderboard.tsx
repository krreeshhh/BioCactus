import { motion } from "framer-motion";
import { Trophy, Zap, Flame, Crown, Medal, Heart } from "lucide-react";
import { GiPlantSeed } from "react-icons/gi";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import CactusAvatar from "@/components/CactusAvatar";
import { useTranslation } from "@/lib/i18n";

const rankConfig: Record<number, { icon: React.ReactNode; color: string; glow: string }> = {
    1: {
        icon: <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400/30" />,
        color: "from-yellow-500/20 to-amber-500/10 border-yellow-500/30",
        glow: "shadow-[0_0_30px_rgba(234,179,8,0.15)]",
    },
    2: {
        icon: <Medal className="w-5 h-5 text-slate-300 fill-slate-300/30" />,
        color: "from-slate-400/20 to-slate-500/10 border-slate-400/30",
        glow: "shadow-[0_0_20px_rgba(148,163,184,0.1)]",
    },
    3: {
        icon: <Medal className="w-5 h-5 text-amber-600 fill-amber-600/30" />,
        color: "from-amber-700/20 to-amber-800/10 border-amber-700/30",
        glow: "shadow-[0_0_20px_rgba(180,83,9,0.1)]",
    },
};

const Leaderboard = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    const { data: lbData, isLoading } = useQuery({
        queryKey: ["leaderboard"],
        queryFn: api.getLeaderboard,
        refetchInterval: 30_000, // refresh every 30s
    });

    const { data: progressData } = useQuery({
        queryKey: ["progress"],
        queryFn: api.getProgress,
    });

    const { streak = 0, hearts = 5, xp: myXP = 0 } = progressData?.data || {};

    const entries: any[] = lbData?.data || [];

    return (
        <div className="p-6 lg:p-10 w-full max-w-3xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-500/30 to-amber-500/10 border border-yellow-500/30 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-foreground tracking-tight">{t('common.leaderboard')}</h1>
                        <p className="text-xs text-muted-foreground">{t('common.leaderboard_desc')}</p>
                    </div>
                </div>
            </motion.div>

            {/* Your Stats Summary Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-4 md:p-5 mb-8 flex flex-col sm:flex-row items-center gap-4 md:gap-6"
            >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <CactusAvatar size="sm" showBubble={false} mood="happy" />
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground font-bold mb-0.5">{t('common.your_stats')}</p>
                        <p className="text-sm font-bold text-foreground truncate">{user?.displayName || t('common.profile')}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 md:gap-5 w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5 text-xp" />
                            <span className="text-sm font-black text-xp">{myXP}</span>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest text-muted-foreground">{t('common.experience')}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-streak" />
                            <span className="text-sm font-black text-streak">{streak}</span>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest text-muted-foreground">{t('common.lb_streak')}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1">
                            <Heart className={`w-3.5 h-3.5 ${hearts > 0 ? "text-destructive fill-destructive/20" : "text-muted-foreground"}`} />
                            <span className={`text-sm font-black ${hearts > 0 ? "text-destructive" : "text-muted-foreground"}`}>{hearts}</span>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest text-muted-foreground">{t('common.lb_hearts')}</span>
                    </div>
                </div>
            </motion.div>

            {/* Leaderboard List */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                        className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
                    />
                </div>
            ) : entries.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <CactusAvatar size="lg" mood="thinking" message={t('common.no_lb_data')} />
                </div>
            ) : (
                <div className="space-y-3">
                    {entries.map((entry, i) => {
                        const rank = i + 1;
                        const cfg = rankConfig[rank];
                        const isMe = entry.isUser;

                        return (
                            <motion.div
                                key={entry.name + i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`
                  relative flex items-center gap-4 px-5 py-4 rounded-2xl border
                  bg-gradient-to-r transition-all duration-300
                  ${cfg ? `${cfg.color} ${cfg.glow}` : isMe
                                        ? "from-primary/10 to-transparent border-primary/20 shadow-[0_0_20px_rgba(34,197,94,0.08)]"
                                        : "from-white/[0.03] to-transparent border-white/5 hover:border-white/10"}
                `}
                            >
                                {/* Rank Badge */}
                                <div className={`
                  w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-black text-sm
                  ${rank === 1 ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                        : rank === 2 ? "bg-slate-400/20 text-slate-300 border border-slate-400/30"
                                            : rank === 3 ? "bg-amber-700/20 text-amber-600 border border-amber-700/30"
                                                : "bg-white/5 text-muted-foreground border border-white/5"}
                `}>
                                    {cfg ? cfg.icon : `#${rank}`}
                                </div>

                                {/* Avatar */}
                                <div className="w-9 h-9 rounded-full bg-secondary border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                    {entry.avatar && entry.avatar.startsWith("http") ? (
                                        <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <GiPlantSeed className="w-5 h-5 text-primary" />
                                    )}
                                </div>

                                {/* Name */}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-bold truncate ${isMe ? "text-primary" : "text-foreground"}`}>
                                        {entry.name}
                                        {isMe && <span className="ml-2 text-[10px] uppercase tracking-widest bg-primary/15 text-primary px-2 py-0.5 rounded-full">You</span>}
                                    </p>
                                </div>

                                {/* XP */}
                                <div className="flex items-center gap-1 md:gap-1.5 shrink-0">
                                    <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-xp" />
                                    <span className="text-xs md:text-sm font-black text-xp">{entry.xp.toLocaleString()} <span className="hidden sm:inline">XP</span></span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Footer note */}
            <p className="text-center text-[10px] text-muted-foreground/50 uppercase tracking-widest mt-8">
                Refreshes every 30 seconds · Complete lessons to earn XP
            </p>
        </div>
    );
};

export default Leaderboard;
