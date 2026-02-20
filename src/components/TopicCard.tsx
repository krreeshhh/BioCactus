import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle2, Lock, ArrowUpRight } from "lucide-react";
import type { Topic } from "@/lib/data";
import { useTranslation } from "@/lib/i18n";

interface TopicCardProps {
  topic: Topic;
  index: number;
}

const TopicCard = ({ topic, index }: TopicCardProps) => {
  const { t } = useTranslation();
  const progress = topic.lessons > 0 ? (topic.completedLessons / topic.lessons) * 100 : 0;
  const isCompleted = progress === 100;
  const isLocked = false;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.2, 0, 0, 1] }}
      className="h-full"
    >
      <Link to={`/course/${topic.id}`} className="block h-full">
        <div className="m3-glass-interactive p-4 md:p-6 group cursor-pointer h-full relative overflow-hidden flex flex-col">
          {/* Glass light reflection effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10 flex-1">
            {/* Icon and status */}
            <div className="flex items-start justify-between mb-4 md:mb-6">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-[var(--radius)] bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner group-hover:bg-primary/10 group-hover:shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                <topic.icon className="w-6 h-6 md:w-8 md:h-8 text-foreground/80 group-hover:text-primary transition-colors" />
              </div>
              <div className="flex flex-col items-end gap-2">
                {isCompleted ? (
                  <div className="px-2.5 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                    {t('common.complete')}
                  </div>
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                )}
                {isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors tracking-tight">
              {topic.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
              {topic.description}
            </p>
          </div>

          <div className="relative z-10 mt-auto">
            {/* Progress */}
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-3">
              <span>{topic.completedLessons} / {topic.lessons} {t('common.lessons')}</span>
              <span className="text-xp font-black">{topic.xp} XP</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden border border-white/5 p-[1px]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: "circOut" }}
                className={`h-full rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)] ${isCompleted
                  ? "bg-gradient-to-r from-primary to-accent"
                  : "bg-gradient-to-r from-primary/60 to-primary"
                  }`}
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default TopicCard;
