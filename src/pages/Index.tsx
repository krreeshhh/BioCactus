import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Zap, BookOpen, Trophy, Flame, Sparkles, ChevronRight } from "lucide-react";
import CactusAvatar from "@/components/CactusAvatar";
import BrandLogo from "@/components/BrandLogo";
import heroBg from "@/assets/hero-bg.jpg";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

const features = [
  { icon: BookOpen, title: "AI-Powered Lessons", desc: "Gemini generates personalized biotech lessons", color: "text-primary" },
  { icon: Trophy, title: "Interactive Quizzes", desc: "Test your knowledge and earn XP rewards", color: "text-xp" },
  { icon: Flame, title: "Streak System", desc: "Build habits with daily learning streaks", color: "text-streak" },
  { icon: Zap, title: "Level Up", desc: "Track progress and climb the leaderboard", color: "text-primary" },
];

const topics = ["DNA", "RNA", "CRISPR", "Cells", "Genetics", "Proteins"];

const Index = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const isNewUser = await loginWithGoogle();
      await api.login(); // Sync with backend
      navigate(isNewUser ? "/onboarding" : "/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-white">
      {/* Background Deep Blur Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Nav - Material You Rail style but at top */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50">
        <div className="m3-glass py-3 px-8 flex items-center justify-between border-white/5 shadow-2xl">
          <Link to="/" className="flex items-center gap-3 active:scale-95 transition-transform">
            <div className="p-1 rounded-xl bg-primary/10">
              <BrandLogo size="sm" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Bio<span className="text-primary">Cactus</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="glossy-button px-6 py-2.5 text-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center pt-24 overflow-hidden">
        <div className="container relative z-10 px-6">
          <div className="flex flex-col items-center text-center">
            {/* Mascot Reveal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.2 }}
              className="mb-8 relative"
            >
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150" />
              <CactusAvatar size="lg" mood="celebrating" message="Ready to evolve?" />
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            >
              <h1 className="text-6xl md:text-8xl font-black text-foreground mb-6 leading-[0.9] tracking-tighter">
                Evolve your
                <span className="text-primary text-glow"> Knowledge</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                The free, AI-powered way to master <span className="text-foreground">Biotechnology</span> like a pro. Fun, fast, and interactive.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 items-center"
            >
              <Link
                to="/register"
                className="glossy-button w-full sm:w-auto px-10 py-5 text-lg group flex items-center gap-2"
              >
                Start Learning <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="m3-glass-interactive w-full sm:w-auto px-10 py-5 text-lg font-bold flex items-center gap-2"
              >
                I have an account
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 relative z-10">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="android-pill inline-flex gap-2 items-center mb-6 text-primary">
              <Sparkles className="w-4 h-4" /> Features 2.0
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">Built for the next decade</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="m3-glass-interactive p-8 group border-white/5"
              >
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 shadow-inner transition-all group-hover:scale-110 group-hover:bg-primary/10 ${feat.color}`}>
                  <feat.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 container max-w-4xl mx-auto text-center">
        <div className="m3-glass p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-8 tracking-tighter">Ready to break the code?</h2>
            <Link
              to="/register"
              className="glossy-button px-12 py-5 text-xl font-black shadow-[0_0_50px_rgba(var(--primary),0.3)]"
            >
              Join for Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-white/5">
        <div className="flex items-center justify-center gap-3 mb-4 grayscale opacity-60">
          <BrandLogo size="sm" />
          <span className="font-bold">BioCactus OS</span>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40">
          v2.0 Beta — Accelerated by Gemini AI
        </p>
      </footer>
    </div>
  );
};

export default Index;
