import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MessageCircle, X, Sparkles } from "lucide-react";
import CactusAvatar from "./CactusAvatar";

const tips = [
  "DNA stands for Deoxyribonucleic Acid!",
  "Did you know? Human DNA is 99.9% identical across all people!",
  "Keep up your streak! Consistency is key to learning.",
  "CRISPR was discovered in bacteria's immune system!",
  "Try a quiz to earn bonus XP!",
  "Mitochondria have their own DNA!",
];

const FloatingCactus = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const nextTip = () => {
    setTipIndex((prev) => (prev + 1) % tips.length);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="m3-glass p-6 mb-6 w-72 border-white/20 shadow-primary/10 overflow-hidden relative group"
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/20">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Bio Tip</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-muted-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm font-medium leading-relaxed text-foreground/90 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500 relative z-10">
              {tips[tipIndex]}
            </p>

            <button
              onClick={nextTip}
              className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold text-primary transition-all active:scale-95 relative z-10 border border-white/5"
            >
              Get another tip
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-500 ${isOpen ? 'bg-secondary rotate-90' : 'glossy-button rotate-0'
          }`}
      >
        {isOpen ? (
          <X className="w-7 h-7 text-foreground" />
        ) : (
          <CactusAvatar size="sm" showBubble={false} mood="happy" />
        )}
      </motion.button>
    </div>
  );
};

export default FloatingCactus;
