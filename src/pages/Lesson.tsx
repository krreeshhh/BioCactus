import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import CactusAvatar from "@/components/CactusAvatar";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { topicIconMap } from "@/lib/data";
import { useTranslation } from "@/lib/i18n";

const Lesson = () => {
  const { t } = useTranslation();
  const { topicId, lessonIndex } = useParams<{ topicId: string, lessonIndex: string }>();

  const { data: lessonData, isLoading } = useQuery({
    queryKey: ["lesson", topicId, lessonIndex],
    queryFn: () => api.getLesson(topicId!, lessonIndex),
    enabled: !!topicId,
  });

  if (isLoading) {
    return <div className="p-8 text-center">{t('common.generating_lesson')}</div>;
  }

  const lesson = lessonData?.data;
  const topic = lesson?.topic;

  if (!lesson) {
    return (
      <div className="p-8 text-center">
        <CactusAvatar mood="sad" message={t('common.topic_not_found')} size="lg" />
        <Link to="/dashboard" className="text-primary mt-4 inline-block">← {t('common.back_to_dashboard')}</Link>
      </div>
    );
  }

  // The backend returns content as a string of text. 
  // We can split it into paragraphs or just show it as is.
  const content = lesson.content;

  return (
    <div className="p-6 lg:p-10 w-full mb-10">
      {/* Back */}
      <Link
        to={`/course/${topicId}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> {t('common.back_to_course')}
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 mb-6 relative overflow-hidden"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-10`} />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {(() => {
                const Icon = topicIconMap[topic.id || topic.topicId];
                return Icon ? <Icon className="w-6 h-6 text-primary" /> : null;
              })()}
              <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider font-black">
                {t('common.lesson')} {(topic.completedLessons?.length || 0)} {t('common.of')} {topic.lessonsCount || topic.lessons || 5}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {content?.title || topic.title}
            </h1>
            <p className="text-sm text-muted-foreground">{topic.description}</p>
          </div>
          <CactusAvatar size="md" mood="thinking" message={t('common.dive_in')} />
        </div>
      </motion.div>

      {/* Lesson Content */}
      <div className="space-y-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">{t('common.ai_lesson_title')}</h2>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-between"
      >
        <Link
          to={`/course/${topicId}`}
          className="px-5 py-3 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
        >
          ← {t('common.back_to_path')}
        </Link>
        <Link
          to={`/quiz/${topicId}/${lessonIndex}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg gradient-primary text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
        >
          {t('common.start_quiz')} <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
};

export default Lesson;
