import { motion } from "framer-motion";
import { Zap, Sparkles } from "lucide-react";

interface XPBarProps {
  currentXP: number;
  nextLevelXP?: number;
  level: number;
}

const XPBar = ({ currentXP, nextLevelXP = 100, level }: XPBarProps) => {
  const progress = (currentXP % nextLevelXP); // Progress within current level

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
      className="m3-glass p-5 flex flex-col gap-4 group hover:bg-card/60 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[var(--radius)] bg-xp/20 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Zap className="w-6 h-6 text-xp fill-xp/20" />
          </div>
          <div>
            <div className="text-xl font-black text-foreground tracking-tighter">Level {level}</div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Bio Pioneer</p>
          </div>
        </div>

        <div className="text-right">
          <motion.div
            key={currentXP}
            initial={{ y: 10, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            className="text-2xl font-black text-xp tracking-tighter"
          >
            {currentXP}
          </motion.div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Total XP</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black text-primary uppercase tracking-tighter flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Next Reward
          </span>
          <span className="text-[10px] font-bold text-muted-foreground/40">{progress}% to Level {level + 1}</span>
        </div>
        <div className="h-4 rounded-full bg-white/5 border border-white/5 p-1 overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-xp to-orange-400 shadow-[0_0_15px_rgba(var(--xp-gold),0.4)] relative"
          >
            {/* Glossy highlight on the bar */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default XPBar;
