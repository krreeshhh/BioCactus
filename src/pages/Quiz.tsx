import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle, Zap } from "lucide-react";
import CactusAvatar from "@/components/CactusAvatar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { quizQuestions } from "@/lib/data";

const Quiz = () => {
  const { topicId, lessonIndex } = useParams<{ topicId: string, lessonIndex: string }>();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  const { data: quizData, isLoading } = useQuery({
    queryKey: ["quiz", topicId, lessonIndex],
    queryFn: () => api.getQuiz(topicId!, lessonIndex),
    enabled: !!topicId,
  });

  const mutation = useMutation({
    mutationFn: (data: any) => api.submitQuiz(topicId!, data.answers, data.questions, lessonIndex),
    onSuccess: (data) => {
      setSubmissionResult(data.data);
      setQuizFinished(true);
    },
  });

  if (isLoading) {
    return <div className="p-8 text-center">Generating your AI quiz...</div>;
  }

  const questions = quizData?.data?.questions || [];
  const question = questions[currentQ];

  if (!question) {
    return (
      <div className="p-8 text-center">
        <CactusAvatar mood="sad" message="Quiz not found!" size="lg" />
        <Link to="/dashboard" className="text-primary mt-4 inline-block">← Back to Dashboard</Link>
      </div>
    );
  }

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setShowResult(true);

    const newAnswers = [...userAnswers];
    newAnswers[currentQ] = question.options[index];
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      mutation.mutate({ answers: userAnswers, questions });
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const cactusM = quizFinished
    ? (submissionResult?.score === questions.length ? "celebrating" as const : "happy" as const)
    : selected === null ? "thinking" as const
      : selected === question.options.indexOf(question.correctAnswer) ? "celebrating" as const : "sad" as const;

  if (quizFinished && submissionResult) {
    const hasPassed = submissionResult.passed;

    return (
      <div className="min-h-screen w-full bg-[#0a0c10] overflow-x-hidden flex flex-col relative justify-center">
        <div className="p-6 lg:p-8 max-w-2xl mx-auto text-center w-full relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 relative overflow-hidden">
            {/* Background Decorations */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 ${hasPassed ? 'bg-primary' : 'bg-destructive'}`} />

            <CactusAvatar
              size="lg"
              mood={hasPassed ? "celebrating" : "sad"}
              message={hasPassed ? "PERFECT!" : "Not quite there..."}
            />

            <h1 className={`text-3xl font-bold mt-8 mb-2 ${hasPassed ? 'text-primary' : 'text-foreground'}`}>
              {hasPassed ? 'Level Cleared!' : 'Keep Practicing!'}
            </h1>

            <p className="text-muted-foreground mb-6">
              You scored <span className={`font-bold ${hasPassed ? 'text-primary' : 'text-destructive'}`}>{submissionResult.score}/{submissionResult.total}</span>
              {!hasPassed && " (Need 50% to Pass)"}
            </p>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-lg mb-8 shadow-lg ${hasPassed ? 'gradient-xp text-background shadow-xp-gold/20' : 'bg-secondary text-muted-foreground'}`}
            >
              <Zap className={`w-5 h-5 ${hasPassed ? 'fill-background' : ''}`} /> +{submissionResult.xpGained} XP
            </motion.div>

            <div className={`mb-8 p-6 rounded-2xl text-left border hidden md:block ${hasPassed ? 'bg-primary/5 border-primary/20' : 'bg-white/5 border-white/10'}`}>
              <p className="text-sm leading-relaxed text-muted-foreground">
                " {submissionResult.feedback} "
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to={`/course/${topicId}`}
                className="w-full px-6 py-4 rounded-xl border-2 border-border/50 text-sm font-bold text-foreground hover:bg-secondary transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Exit to Path
              </Link>

              <button
                onClick={() => window.location.reload()}
                className={`w-full px-6 py-4 rounded-xl text-sm font-bold text-white transition-all shadow-xl flex items-center justify-center gap-2 ${hasPassed ? 'gradient-primary shadow-primary/20 hover:scale-105' : 'bg-white/10 border-2 border-primary/50 text-primary hover:bg-primary/5'}`}
              >
                {hasPassed ? 'Clear & Review' : 'Retry Level'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0c10] overflow-x-hidden flex flex-col relative">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="p-6 lg:p-10 w-full max-w-3xl mx-auto flex-1 flex flex-col relative z-10">
        <Link
          to={`/course/${topicId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Path
        </Link>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Progress</span>
            <span className="text-sm font-bold text-foreground">
              {currentQ + 1} <span className="text-muted-foreground font-medium">/ {questions.length}</span>
            </span>
          </div>
          <div className="flex-1 h-3 rounded-full bg-secondary/50 p-1 border border-border/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
              className="h-full rounded-full gradient-primary shadow-[0_0_15px_rgba(34,197,94,0.3)]"
            />
          </div>
          <CactusAvatar size="sm" showBubble={false} mood={cactusM} />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            className="flex-1"
          >
            <div className="glass-card p-8 mb-8 relative overflow-hidden group">
              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-all group-hover:bg-primary/10" />

              <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-4 block">Question</span>
              <h2 className="text-2xl font-bold text-foreground leading-tight">{question.question}</h2>
            </div>

            <div className="grid gap-4 mb-8">
              {question.options.map((opt: string, i: number) => {
                const isCorrect = opt === question.correctAnswer;
                const isSelected = i === selected;

                let containerClass = "glass-card border-2 border-border/50 hover:border-primary/40 hover:bg-primary/5";
                let letterClass = "bg-secondary text-muted-foreground";

                if (showResult) {
                  if (isCorrect) {
                    containerClass = "border-primary bg-primary/10 shadow-[0_0_20px_rgba(34,197,94,0.15)] ring-1 ring-primary/20";
                    letterClass = "bg-primary text-primary-foreground";
                  } else if (isSelected) {
                    containerClass = "border-destructive/60 bg-destructive/10 ring-1 ring-destructive/20";
                    letterClass = "bg-destructive text-destructive-foreground";
                  } else {
                    containerClass = "border-border/30 opacity-60 grayscale-[0.3]";
                    letterClass = "bg-muted text-muted-foreground";
                  }
                } else if (isSelected) {
                  containerClass = "border-primary/60 bg-primary/5 ring-1 ring-primary/20 scale-[1.01]";
                  letterClass = "bg-primary/20 text-primary";
                }

                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={!showResult ? { scale: 1.015, x: 4 } : {}}
                    whileTap={!showResult ? { scale: 0.985 } : {}}
                    onClick={() => handleSelect(i)}
                    disabled={showResult}
                    className={`w-full text-left px-6 py-5 rounded-2xl transition-all duration-300 ${containerClass} flex items-center gap-4 group relative overflow-hidden`}
                  >
                    {/* Subtle Background Glow on Hover */}
                    {!showResult && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}

                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold shrink-0 transition-colors duration-300 shadow-sm ${letterClass}`}>
                      {String.fromCharCode(65 + i)}
                    </span>

                    <span className="text-[15px] font-semibold text-foreground/90 leading-tight">
                      {opt}
                    </span>

                    <div className="ml-auto flex items-center">
                      {showResult && isCorrect && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-1 rounded-full bg-primary/20">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        </motion.div>
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-1 rounded-full bg-destructive/20">
                          <XCircle className="w-5 h-5 text-destructive" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4 mb-6"
                >
                  <div className="flex items-start gap-3">
                    <CactusAvatar
                      size="sm"
                      showBubble={false}
                      mood={question.options[selected!] === question.correctAnswer ? "celebrating" : "encouraging"}
                    />
                    <div>
                      <p className={`text-sm font-semibold ${question.options[selected!] === question.correctAnswer ? "text-primary" : "text-destructive"}`}>
                        {question.options[selected!] === question.correctAnswer ? "Correct!" : "Not quite!"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{question.explanation}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {showResult && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleNext}
                disabled={mutation.isPending}
                className="w-full py-3.5 rounded-xl gradient-primary text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {mutation.isPending ? "Submitting..." : (currentQ + 1 >= questions.length ? "See Results" : "Next Question →")}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;
