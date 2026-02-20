import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Zap, BookOpen, Trophy, Flame, Sparkles, ChevronRight, Dna, Brain, Target, BarChart3, Users, Lightbulb, Smartphone } from "lucide-react";
import CactusAvatar from "@/components/CactusAvatar";
import BrandLogo from "@/components/BrandLogo";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";

const Index = () => {
  const { t } = useTranslation();
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

      {/* Nav */}
      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[95%] md:w-[90%] max-w-6xl z-50">
        <div className="bg-white/[0.03] backdrop-blur-2xl py-2 md:py-3 px-4 md:px-8 flex items-center justify-between border border-white/10 rounded-2xl shadow-2xl">
          <Link to="/" className="flex items-center gap-2 md:gap-3 active:scale-95 transition-transform">
            <div className="p-1 rounded-xl bg-primary/10">
              <BrandLogo size="sm" />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight">
              Bio<span className="text-primary">Cactus</span>
            </span>
          </Link>
          <div className="flex items-center gap-3 md:gap-6">
            <Link
              to="/login"
              className="text-xs md:text-sm font-bold text-muted-foreground hover:text-primary transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="glossy-button px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
        <div className="container relative z-10 px-6">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <CactusAvatar size="lg" mood="celebrating" message={t('common.hero_avatar_message')} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-8xl font-black text-foreground mb-8 leading-[1.1] md:leading-[0.95] tracking-tighter px-4">
                {t('common.hero_headline_hard')}<br />
                <span className="text-primary text-glow font-black">{t('common.hero_headline_easy')}</span>
              </h1>
              <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-medium px-6">
                {t('common.hero_subheadline')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center sm:justify-center w-full max-w-xs sm:max-w-none px-6"
            >
              <Link to="/register" className="glossy-button px-8 md:px-10 py-4 md:py-5 text-lg md:text-xl group flex items-center justify-center gap-3 w-full sm:w-auto">
                {t('common.hero_cta_start')} <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="m3-glass-interactive px-8 md:px-10 py-4 md:py-5 text-lg md:text-xl font-bold flex items-center justify-center gap-3 border-white/10 group w-full sm:w-auto">
                <Smartphone className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" /> {t('common.hero_cta_app')}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 md:py-32 px-4 md:px-6">
        <div className="container max-w-5xl mx-auto">
          <div className="m3-glass p-6 md:p-12 relative overflow-hidden">
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-destructive/10 blur-[100px]" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight">{t('common.problem_title')}</h2>
                <div className="space-y-4">
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    {t('common.problem_p1')}
                  </p>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    {t('common.problem_p2')}
                  </p>
                </div>
                <div className="pt-2">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold uppercase text-[10px] md:text-xs tracking-widest">
                    <Sparkles className="w-3.5 h-3.5" /> {t('common.problem_fix')}
                  </div>
                </div>
              </div>
              <div className="flex justify-center md:justify-end">
                <CactusAvatar size="lg" mood="thinking" message={t('common.problem_avatar_message')} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What BioCactus Does */}
      <section className="py-20 md:py-32 px-4 md:px-6 bg-white/[0.02]">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6 md:mb-8 tracking-tighter px-4">{t('common.does_title')}</h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 md:mb-12 px-4">
            {t('common.does_desc')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-4">
            <div className="p-5 md:p-6 rounded-3xl bg-white/5 border border-white/5">
              <p className="text-sm md:text-base font-bold text-foreground">{t('common.does_p1')}</p>
            </div>
            <div className="p-5 md:p-6 rounded-3xl bg-white/5 border border-white/5">
              <p className="text-sm md:text-base font-bold text-foreground">{t('common.does_p2')}</p>
            </div>
            <div className="p-5 md:p-6 rounded-3xl bg-primary/10 border border-primary/20">
              <p className="text-sm md:text-base font-bold text-primary">{t('common.does_p3')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 md:py-32 px-4 md:px-10">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-20 px-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">{t('common.features_title')}</h2>
            <p className="text-muted-foreground mt-4 text-base md:text-lg">{t('common.features_subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-2 md:px-0">
            {[
              {
                icon: Dna,
                title: t('common.feat_adaptive_title'),
                desc: t('common.feat_adaptive_desc'),
                color: "text-blue-400"
              },
              {
                icon: Brain,
                title: t('common.feat_quiz_title'),
                desc: t('common.feat_quiz_desc'),
                color: "text-primary"
              },
              {
                icon: Target,
                title: t('common.feat_path_title'),
                desc: t('common.feat_path_desc'),
                color: "text-accent"
              },
              {
                icon: BarChart3,
                title: t('common.feat_analytics_title'),
                desc: t('common.feat_analytics_desc'),
                color: "text-xp"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="m3-glass-interactive p-6 md:p-10 group"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform ${feature.color}`}>
                  <feature.icon className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-4">{feature.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32 px-4 md:px-6">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-16 md:mb-20 px-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">{t('common.works_title')}</h2>
          </div>
          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              { step: "01", title: t('common.works_step1_title'), desc: t('common.works_step1_desc') },
              { step: "02", title: t('common.works_step2_title'), desc: t('common.works_step2_desc') },
              { step: "03", title: t('common.works_step3_title'), desc: t('common.works_step3_desc') },
              { step: "04", title: t('common.works_step4_title'), desc: t('common.works_step4_desc') },
              { step: "05", title: t('common.works_step5_title'), desc: t('common.works_step5_desc') }
            ].map((item, i) => (
              <div key={i} className="m3-glass p-6 md:p-8 flex flex-col md:flex-row gap-4 md:gap-6 md:items-center border-white/5 hover:bg-white/[0.03] transition-colors">
                <span className="text-3xl md:text-4xl font-black text-primary/40 leading-none">{item.step}</span>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20 md:py-32 px-4 md:px-6 bg-accent/5">
        <div className="container max-w-4xl mx-auto text-center px-4">
          <Users className="w-12 h-12 md:w-16 md:h-16 text-accent mx-auto mb-8" />
          <h2 className="text-3xl md:text-4xl font-black mb-8 tracking-tighter">{t('common.who_title')}</h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
            {t('common.who_p1')}
          </p>
          <p className="text-xl md:text-2xl font-black text-foreground">
            {t('common.who_p2')}
          </p>
        </div>
      </section>

      {/* Why BioCactus Over Everything Else? */}
      <section className="py-20 md:py-32 px-4 md:px-6 lg:px-20 overflow-hidden relative">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="relative flex justify-center order-2 md:order-1">
              <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-full" />
              <BrandLogo size="xl" className="relative z-10 scale-125 md:scale-150 animate-float" />
            </div>
            <div className="space-y-6 md:space-y-8 order-1 md:order-2 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight flex items-center justify-center md:justify-start gap-4">
                <Lightbulb className="w-8 h-8 md:w-10 md:h-10 text-primary" /> {t('common.why_title')}
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed italic px-4 md:px-0">
                {t('common.why_quote')}
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed px-4 md:px-0">
                {t('common.why_p1')}
              </p>
              <div className="p-6 rounded-3xl bg-primary/10 border-2 border-primary/20 mx-4 md:mx-0">
                <p className="text-lg md:text-xl font-black text-primary">
                  {t('common.why_p2')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-40 px-4 md:px-6 container max-w-4xl mx-auto text-center">
        <motion.div
          whileInView={{ scale: [0.95, 1], opacity: [0, 1] }}
          className="m3-glass p-8 md:p-16 relative overflow-hidden group shadow-2xl border-primary/20 rounded-[2rem] md:rounded-[3rem]"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] -mr-[250px] -mt-[250px]" />
          <div className="relative z-10">
            <h2 className="text-xl md:text-3xl font-black text-muted-foreground uppercase tracking-widest mb-4">{t('common.final_ready')}</h2>
            <h3 className="text-3xl md:text-7xl font-black text-foreground mb-10 md:mb-12 tracking-tighter leading-tight md:leading-[0.95]">
              {t('common.final_headline_p1')}<br className="hidden md:block" />
              {t('common.final_headline_p2')}
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center max-w-xs sm:max-w-none mx-auto">
              <Link to="/register" className="glossy-button px-10 md:px-14 py-4 md:py-6 text-xl md:text-2xl font-black shadow-[0_0_60px_rgba(var(--primary),0.4)] w-full sm:w-auto">
                {t('common.final_cta_button')}
              </Link>
              <button className="m3-glass-interactive px-10 md:px-14 py-4 md:py-6 text-xl md:text-2xl font-black border-white/10 w-full sm:w-auto">
                {t('common.hero_cta_app')}
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-16 text-center border-t border-white/5">
        <div className="flex items-center justify-center gap-4 mb-6 opacity-40 grayscale">
          <BrandLogo size="md" />
          <div className="text-left">
            <p className="font-black text-xl leading-none">BioCactus</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Intelligence Layer v2.0</p>
          </div>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/30">
          Accelerated by Google Gemini LLM · Build 2024.02.21
        </p>
      </footer>
    </div>
  );
};

export default Index;
