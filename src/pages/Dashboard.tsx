import { motion } from "framer-motion";
import {
  Zap,
  Trophy,
  Flame,
  Heart,
  LayoutGrid,
  ArrowRight
} from "lucide-react";
import { FaDna } from "react-icons/fa";
import { GiPlantSeed } from "react-icons/gi";
import { topicIconMap } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import TopicCard from "@/components/TopicCard";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/lib/i18n";

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data: progressData, isLoading } = useQuery({
    queryKey: ["progress"],
    queryFn: api.getProgress,
  });
  const { data: lbData } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: api.getLeaderboard,
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

  const { topics = [], xp = 0, level = 1, streak = 0, hearts = 5 } =
    progressData?.data || {};

  const topLb: any[] = (lbData?.data || []).slice(0, 5);

  return (
    <div className="space-y-12 max-w-[1200px] mx-auto">
      {/* Top Stats - Clean & Focused */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="m3-glass p-5 md:p-8 flex items-center justify-between group hover:bg-white/[0.02] transition-colors"
        >
          <div className="space-y-1">
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/40">{t('common.current_streak')}</p>
            <h3 className="text-2xl md:text-4xl font-black text-streak tracking-tighter">{streak} {t('common.days')}</h3>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-streak/10 flex items-center justify-center border border-streak/20 shadow-lg shadow-streak/5 group-hover:scale-110 transition-transform">
            <Flame className="w-6 h-6 md:w-7 md:h-7 text-streak fill-streak/20" />
          </div>
        </motion.div>

        {/* Points (XP) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="m3-glass p-5 md:p-8 flex items-center justify-between group hover:bg-white/[0.02] transition-colors"
        >
          <div className="space-y-1">
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/40">{t('common.total_points')}</p>
            <h3 className="text-2xl md:text-4xl font-black text-xp tracking-tighter">{xp.toLocaleString()} XP</h3>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-xp/10 flex items-center justify-center border border-xp/20 shadow-lg shadow-xp/5 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6 md:w-7 md:h-7 text-xp fill-xp/20" />
          </div>
        </motion.div>

        {/* Hearts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="m3-glass p-5 md:p-8 flex items-center justify-between group hover:bg-white/[0.02] transition-colors"
        >
          <div className="space-y-1">
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/40">{t('common.energy_cells')}</p>
            <h3 className={`text-2xl md:text-4xl font-black tracking-tighter ${hearts > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>{hearts} {t('common.hearts')}</h3>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-destructive/10 flex items-center justify-center border border-destructive/20 shadow-lg shadow-destructive/5 group-hover:scale-110 transition-transform">
            <Heart className={`w-6 h-6 md:w-7 md:h-7 ${hearts > 0 ? "text-destructive fill-destructive/20" : "text-muted-foreground"}`} />
          </div>
        </motion.div>
      </div>

      {/* Courses - Your Biotech Path */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
            <LayoutGrid className="w-6 h-6 text-primary" /> {t('common.my_path')}
          </h2>
          <Link to="/curriculum" className="text-sm font-bold text-primary hover:underline flex items-center gap-1 group">
            {t('common.view_all')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {topics.map((topic: any, i: number) => (
            <TopicCard
              key={topic.topicId}
              topic={{
                ...topic,
                id: topic.topicId,
                lessons: topic.lessonsCount || topic.lessons || 5,
                completedLessons: topic.completedLessons?.length || 0,
                xp: topic.xpGoal || topic.xp || 100,
                color: topic.color || "from-emerald-500 to-teal-600",
                icon: topicIconMap[topic.topicId] || FaDna,
              }}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* Leaderboard - Bottom Rankings */}
      <section className="space-y-6 pb-20">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
            <Trophy className="w-6 h-6 text-xp" /> {t('common.leaderboard')}
          </h2>
          <Link to="/leaderboard" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors">
            {t('common.full_leaderboard')}
          </Link>
        </div>

        <div className="m3-glass overflow-hidden border-white/10 group">
          {topLb.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              {t('common.empty_leaderboard')}
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {topLb.map((entry, i) => (
                <div
                  key={entry.uid || i}
                  className={`flex items-center gap-3 md:gap-6 px-4 md:px-8 py-4 md:py-5 hover:bg-white/[0.02] transition-colors ${entry.isUser ? "bg-primary/5 border-l-2 border-primary" : "border-l-2 border-transparent"}`}
                >
                  <span className={`text-base md:text-lg font-black w-6 md:w-8 text-center ${i === 0 ? "text-xp" : i === 1 ? "text-slate-300" : i === 2 ? "text-amber-700" : "text-muted-foreground/20"}`}>
                    {i + 1}
                  </span>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-secondary border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                    {entry.avatar?.startsWith("http") ? (
                      <img src={entry.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <GiPlantSeed className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm md:text-base font-bold truncate ${entry.isUser ? "text-primary" : "text-foreground"}`}>
                      {entry.name} {entry.isUser && `(${t('common.profile')})`}
                    </p>
                    <p className="text-[9px] md:text-[10px] uppercase font-black text-muted-foreground/40 tracking-tighter">{t('common.level')} {Math.floor(entry.xp / 100) + 1}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base md:text-lg font-black text-xp tracking-tight">{entry.xp.toLocaleString()}</p>
                    <p className="text-[9px] md:text-[10px] font-bold uppercase text-muted-foreground/30">{t('common.points_earned')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
