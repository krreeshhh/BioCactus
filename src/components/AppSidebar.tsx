import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  LayoutGrid,
  Trophy,
  User,
  Flame,
  Zap,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageSquare
} from "lucide-react";
import CactusAvatar from "./CactusAvatar";
import BrandLogo from "./BrandLogo";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useSidebar } from "./SidebarContext";
import { useTranslation } from "@/lib/i18n";

const AppSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const { isCompact, toggleCompact, isMobileOpen, setMobileOpen } = useSidebar();
  const { t } = useTranslation();
  const { data: progressData } = useQuery({
    queryKey: ["progress"],
    queryFn: api.getProgress,
  });

  const { xp = 0, level = 1, streak = 0, hearts = 5 } = progressData?.data || {};
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          width: isCompact ? 80 : 280,
          x: isMobileOpen ? 0 : (isMobile ? -280 : 0)
        }}
        className={`fixed left-0 top-0 bottom-0 bg-sidebar-background flex flex-col z-50 overflow-hidden border-r border-white/10 shadow-2xl transition-all duration-300 ease-in-out lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* App Header */}
        <div className={`pt-10 pb-8 flex flex-col ${isCompact ? 'items-center px-2' : 'items-start px-4'} flex-shrink-0 transition-all duration-300`}>
          <Link to="/" className="flex items-center gap-3 active:scale-95 transition-all group">
            <div className={`${isCompact ? 'scale-110' : 'ml-4 scale-125'} transition-all`}>
              <BrandLogo size="sm" />
            </div>
            {!isCompact && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60 ml-1"
              >
                Bio<span className="text-primary">Cactus</span>
              </motion.span>
            )}
          </Link>
        </div>

        {/* Stats Section */}
        <div className={`px-4 mb-8 transition-opacity duration-300 ${isCompact ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
          {!isCompact && (
            <div className="bg-white/5 rounded-[var(--radius)] p-4 border border-white/5 space-y-4 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-xp/20 flex items-center justify-center shadow-lg">
                    <Zap className="w-5 h-5 text-xp" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{t('common.experience')}</p>
                    <p className="text-sm font-black text-xp leading-none mt-1">{xp} XP</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{t('common.level')}</p>
                  <p className="text-sm font-black text-primary leading-none mt-1">{level}</p>
                </div>
              </div>

              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(xp % 100)}%` }}
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full shadow-[0_0_15px_rgba(var(--primary),0.4)]"
                />
              </div>

              <div className="flex items-center justify-around pt-2 border-t border-white/5">
                <div className="flex items-center gap-2" title={t('common.streak')}>
                  <Flame className="w-4 h-4 text-streak animate-pulse" />
                  <span className="text-xs font-black">{streak}</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-2" title={t('common.hearts')}>
                  <Heart className={`w-4 h-4 ${hearts > 0 ? "text-destructive fill-destructive" : "text-muted-foreground"}`} />
                  <span className="text-xs font-black">{hearts}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 ${isCompact ? 'px-2' : 'px-4'} space-y-8 overflow-y-auto custom-scrollbar pt-4`}>
          {/* Main Menu Section */}
          <div>
            {!isCompact && (
              <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-4 ml-1">
                {t('common.main_operations')}
              </p>
            )}
            <div className="space-y-2">
              {[
                { path: "/dashboard", label: t('common.dashboard'), icon: Home },
                { path: "/curriculum", label: t('common.curriculum'), icon: LayoutGrid },
                { path: "/chat", label: t('common.ai_assistant'), icon: MessageSquare },
                { path: "/leaderboard", label: t('common.leaderboard'), icon: Trophy },
                { path: "/profile", label: t('common.profile'), icon: User },
              ].map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center rounded-[var(--radius)] text-sm font-bold transition-all duration-300 group ${isCompact ? 'justify-center p-3' : 'gap-4 px-4 py-4'
                      } ${isActive ? "text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-[var(--radius)] z-0"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon className={`w-5 h-5 relative z-10 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    {!isCompact && <span className="relative z-10">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className={`py-12 space-y-4 ${isCompact ? 'px-2' : 'px-6'}`}>
          <button
            onClick={toggleCompact}
            className={`w-full flex items-center rounded-[var(--radius)] text-sm font-bold transition-all duration-300 m3-glass-interactive ${isCompact ? 'justify-center p-3' : 'gap-4 px-4 py-3.5'
              } border-white/10 hover:bg-white/10 text-primary`}
          >
            {isCompact ? <ChevronRight size={18} /> : (
              <>
                <ChevronLeft size={18} />
                <span>{t('common.collapse')}</span>
              </>
            )}
          </button>

          <button
            onClick={() => logout()}
            className={`w-full flex items-center text-sm font-black text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-[var(--radius)] transition-all group ${isCompact ? 'justify-center p-3' : 'gap-4 px-4 py-4'
              }`}
          >
            <LogOut className={`w-5 h-5 transition-transform ${isCompact ? '' : 'group-hover:-translate-x-1'}`} />
            {!isCompact && <span>{t('common.logout')}</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default AppSidebar;
