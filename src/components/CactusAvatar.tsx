import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import cactusImg from "@/assets/cactus-avatar.png";
import { FaSmile, FaQuestionCircle, FaStar, FaDumbbell, FaSadTear } from "react-icons/fa";

type Mood = "happy" | "thinking" | "celebrating" | "encouraging" | "sad";

interface CactusAvatarProps {
  mood?: Mood;
  message?: string;
  size?: "sm" | "md" | "lg";
  showBubble?: boolean;
}

const moodIcons: Record<Mood, React.ComponentType<{ className?: string }>> = {
  happy: FaSmile,
  thinking: FaQuestionCircle,
  celebrating: FaStar,
  encouraging: FaDumbbell,
  sad: FaSadTear,
};

const moodColors: Record<Mood, string> = {
  happy: "text-yellow-400",
  thinking: "text-blue-400",
  celebrating: "text-xp",
  encouraging: "text-primary",
  sad: "text-blue-300",
};

const CactusAvatar = ({ mood = "happy", message, size = "md", showBubble = true }: CactusAvatarProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
  };

  const MoodIcon = moodIcons[mood];

  return (
    <div className="relative inline-flex flex-col items-center">
      <AnimatePresence>
        {message && showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="glass-card px-4 py-2 mb-2 max-w-[200px] text-sm text-foreground relative"
          >
            {message}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-card/60 border-b border-r border-border/50 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        animate={
          mood === "celebrating"
            ? { rotate: [0, -5, 5, -5, 0], scale: [1, 1.1, 1] }
            : mood === "thinking"
              ? { rotate: [0, 3, 0, -3, 0] }
              : { y: [0, -4, 0] }
        }
        transition={{
          duration: mood === "celebrating" ? 0.6 : 2,
          repeat: Infinity,
          repeatType: "loop",
        }}
        className="relative"
      >
        <img
          src={cactusImg}
          alt="BioCactus mascot"
          className={`${sizeClasses[size]} object-contain drop-shadow-[0_0_10px_hsl(142_70%_45%/0.3)]`}
        />
        {mood !== "happy" && (
          <span className="absolute -top-1 -right-1">
            <MoodIcon className={`w-4 h-4 ${moodColors[mood]}`} />
          </span>
        )}
      </motion.div>
    </div>
  );
};

export default CactusAvatar;
