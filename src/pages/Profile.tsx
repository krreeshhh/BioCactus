import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Zap,
  Target,
  BookOpen,
  Trophy,
  LogOut,
  Edit3,
  Camera,
  Check,
  Award,
  ShieldCheck,
  Star,
  Activity,
  User as UserIcon,
  ChevronRight
} from "lucide-react";
import { GiDna1 } from "react-icons/gi";
import CactusAvatar from "@/components/CactusAvatar";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";

const Profile = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const { language, setLanguage, t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: progressData, isLoading } = useQuery({
    queryKey: ["progress"],
    queryFn: api.getProgress,
  });

  const { data: lbData } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: api.getLeaderboard,
  });

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleUpdateProfile = async () => {
    if (!newName.trim()) return;
    setIsUpdating(true);
    try {
      await updateUserProfile({ displayName: newName });
      setIsEditing(false);
      toast.success(t('common.profile_updated'));
    } catch (error) {
      toast.error(t('common.profile_update_failed'));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, you'd upload this to Firebase Storage
    // For now, we'll just show a toast that it's a demo feature or use a placeholder
    toast.info("Image upload would typically sync to Cloud Storage here.");
  };

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

  const { topics = [], xp = 0, level = 1, streak = 0 } = progressData?.data || {};
  const leaderboard = lbData?.data || [];
  const userRank = leaderboard.findIndex((entry: any) => entry.uid === user?.uid) + 1;

  const completedLessons = topics.reduce((sum: number, t: any) => sum + (t.completedLessons?.length || 0), 0);
  const accuracy = "92%"; // Mocked

  const achievements = [
    { title: "First Sync", desc: "Completed your first lesson", icon: Star, unlocked: completedLessons > 0, date: "2d ago" },
    { title: "Streak Master", desc: "Maintain a 7-day learning streak", icon: Flame, unlocked: streak >= 7, date: "Locked" },
    { title: "Bio-Architect", desc: "Reach Level 5 in Genomics", icon: ShieldCheck, unlocked: level >= 5, date: "Locked" },
    { title: "Frontier Legend", desc: "Rank in the Top 3 on Leaderboard", icon: Trophy, unlocked: userRank > 0 && userRank <= 3, date: "Locked" },
    { title: "Rapid Synapse", desc: "Complete 3 lessons in one day", icon: Zap, unlocked: true, date: "1w ago" },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-[1200px] mx-auto space-y-10 pb-20">
      {/* Profile Header */}
      <div className="relative overflow-hidden m3-glass p-6 md:p-8 lg:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] -mr-48 -mt-48" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 text-center md:text-left">
          {/* Avatar Section */}
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-3xl overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-all duration-500 shadow-2xl">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <UserIcon className="w-16 h-16 text-primary" />
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          {/* User Info Section */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-2"
                  >
                    <input
                      autoFocus
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="bg-white/5 border border-primary/40 rounded-xl px-4 py-2 text-2xl font-black tracking-tighter outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      onClick={handleUpdateProfile}
                      disabled={isUpdating}
                      className="p-2 rounded-xl bg-primary text-white hover:bg-primary/80 transition-all disabled:opacity-50"
                    >
                      {isUpdating ? <Activity className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-4 justify-center md:justify-start"
                  >
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground">{user?.displayName || t('common.researcher')}</h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 rounded-xl hover:bg-white/5 text-muted-foreground transition-colors"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="text-muted-foreground font-medium">{user?.email}</p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest leading-none">
                {t('common.bio_level')} {level}
              </div>
              <div className="px-4 py-1.5 rounded-full bg-xp/10 border border-xp/20 text-xp text-[10px] font-black uppercase tracking-widest leading-none">
                {userRank > 0 ? `${t('common.ranked')} #${userRank}` : t('common.unranked')}
              </div>
              <div className="px-4 py-1.5 rounded-full bg-streak/10 border border-streak/20 text-streak text-[10px] font-black uppercase tracking-widest leading-none">
                {t('common.pioneer_status')}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="flex flex-col gap-3 mt-4 md:mt-0 w-full md:w-auto">
            <button
              onClick={handleLogout}
              className="p-3 md:p-4 rounded-2xl bg-white/5 border border-white/5 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5 md:w-6 md:h-6" />
              <span className="md:hidden font-bold text-sm">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Language Selector */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Language Interface</p>
          <div className="flex flex-wrap gap-2">
            {[
              { code: 'en', name: 'English', native: 'English' },
              { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
              { code: 'hi', name: 'Hindi', native: 'हिन्दी' }
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={async () => {
                  setLanguage(lang.code);
                  try {
                    await api.updateLanguage(lang.code);
                    toast.success(`${t('common.lang_set_to')} ${lang.native}`);
                    // Optional: Refresh or redirect to apply changes everywhere
                    window.location.reload();
                  } catch (e) {
                    toast.error(t('common.lang_sync_failed'));
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${language === lang.code
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                  }`}
              >
                {lang.native}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Zap, label: t('common.total_points'), value: `${xp.toLocaleString()} XP`, color: "text-xp", bg: "bg-xp/10" },
          { icon: Flame, label: t('common.streak'), value: `${streak} ${t('common.days')}`, color: "text-streak", bg: "bg-streak/10" },
          { icon: BookOpen, label: t('common.lessons'), value: completedLessons, color: "text-primary", bg: "bg-primary/10" },
          { icon: Target, label: t('common.sync_accuracy'), value: accuracy, color: "text-accent", bg: "bg-accent/10" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="m3-glass p-6 text-center space-y-2 group hover:bg-white/[0.02] transition-colors"
          >
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mx-auto mb-2 border border-white/5 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-2xl font-black tracking-tighter">{stat.value}</p>
            <p className="text-[10px] uppercase font-bold text-muted-foreground/40 tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Achievements Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
              <Award className="w-6 h-6 text-primary" /> {t('common.merits')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((ach, i) => (
              <motion.div
                key={ach.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`m3-glass p-5 flex items-center gap-5 transition-all ${ach.unlocked ? "opacity-100" : "opacity-40 grayscale"}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${ach.unlocked ? "bg-primary/10 border-primary/20" : "bg-white/5 border-white/5"}`}>
                  <ach.icon className={`w-7 h-7 ${ach.unlocked ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">{ach.title}</h4>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{ach.desc}</p>
                </div>
                {ach.unlocked && (
                  <div className="text-[9px] font-black uppercase text-primary/40 rotate-90 whitespace-nowrap">
                    {ach.date}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Frontier Standings Preview */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
              <Trophy className="w-6 h-6 text-xp" /> {t('common.standings')}
            </h2>
            <Link to="/leaderboard" className="text-xs font-bold text-primary hover:underline flex items-center gap-1 group">
              {t('common.view_all_link')} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="m3-glass p-1 divide-y divide-white/5">
            {leaderboard.slice(0, 5).map((entry: any, i: number) => (
              <div
                key={entry.uid || i}
                className={`flex items-center gap-4 p-4 ${entry.uid === user?.uid ? "bg-primary/5 border-l-2 border-primary" : "border-l-2 border-transparent"}`}
              >
                <span className="text-xs font-black w-4 text-center text-muted-foreground/40">{i + 1}</span>
                <div className="w-8 h-8 rounded-lg bg-secondary border border-white/10 flex items-center justify-center overflow-hidden">
                  {entry.avatar?.startsWith("http") ? <img src={entry.avatar} className="w-full h-full object-cover" /> : <GiDna1 className="w-4 h-4 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{entry.name} {entry.uid === user?.uid && t('common.you_label')}</p>
                </div>
                <p className="text-[10px] font-black text-xp">{entry.xp.toLocaleString()}</p>
              </div>
            ))}

            {userRank > 5 && (
              <div className="flex items-center gap-4 p-4 bg-primary/5 border-l-2 border-primary">
                <span className="text-xs font-black w-4 text-center text-primary">{userRank}</span>
                <div className="w-8 h-8 rounded-lg bg-secondary border border-white/10 flex items-center justify-center overflow-hidden italic">
                  {user?.photoURL ? <img src={user.photoURL} className="w-full h-full object-cover" /> : <GiDna1 className="w-4 h-4 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{user?.displayName} {t('common.you_label')}</p>
                </div>
                <p className="text-[10px] font-black text-xp">{xp.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
