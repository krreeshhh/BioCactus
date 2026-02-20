import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import CactusAvatar from "@/components/CactusAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { api } from "@/lib/api";

const steps = [
    {
        id: "welcome",
        title: "Welcome to BioCactus!",
        message: "Hi there! I'm your biological guide. I'll help you dive into the wonders of life sciences! Before we start, tell me a bit about yourself.",
        cactusMood: "happy" as const,
    },
    {
        id: "experience",
        title: "Level of Experience",
        message: "How much do you already know about biology? This helps me tailor the lessons just for you!",
        cactusMood: "thinking" as const,
        options: [
            { label: "Beginner", value: "beginner", description: "I'm just starting my journey!" },
            { label: "Intermediate", value: "intermediate", description: "I know the basics, like DNA and cells." },
            { label: "Advanced", value: "advanced", description: "I'm a bio-pro! Surprise me." },
        ],
    },
    {
        id: "topics",
        title: "Interest Area",
        message: "What part of life fascinates you the most?",
        cactusMood: "celebrating" as const,
        options: [
            { label: "Molecular Biology", value: "molecular", description: "DNA, RNA, and the code of life." },
            { label: "Genetics", value: "genetics", description: "How traits are inherited." },
            { label: "Cell Biology", value: "cells", description: "The building blocks of life." },
            { label: "Biotechnology", value: "biotech", description: "CRISPR and modern bio-tools." },
        ],
    },
];

const Onboarding = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selections, setSelections] = useState<Record<string, string>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const navigate = useNavigate();

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsGenerating(true);
            try {
                toast.info("Cactus is preparing your personalized curriculum...", { duration: 5000 });
                await api.generateCurriculum(selections);
                toast.success("Profile updated! Let's start learning.");
                navigate("/dashboard");
            } catch (error) {
                console.error(error);
                toast.error("Failed to generate your curriculum. Please try again.");
            } finally {
                setIsGenerating(false);
            }
        }
    };

    const handleSelect = (value: string) => {
        const step = steps[currentStep];
        const newSelections = { ...selections, [step.id]: value };
        setSelections(newSelections);

        // Manual trigger for next to ensure local state is "captured" or just pass it directly
        // because setState is async. 
        if (currentStep === steps.length - 1) {
            // Last step, trigger completion with the latest state
            completeOnboarding(newSelections);
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const completeOnboarding = async (finalSelections: Record<string, string>) => {
        setIsGenerating(true);
        try {
            toast.info("Cactus is preparing your personalized curriculum...", { duration: 5000 });
            await api.generateCurriculum(finalSelections);
            toast.success("Curriculum ready! Let's start learning.");
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate your curriculum.");
        } finally {
            setIsGenerating(false);
        }
    };

    const step = steps[currentStep];

    if (isGenerating) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
                <CactusAvatar size="lg" mood="thinking" message="Growing your unique biological learning path..." />
                <div className="mt-8 text-xl font-bold text-primary animate-pulse">
                    Generating Course Modules...
                </div>
                <div className="mt-2 text-muted-foreground">
                    This takes about 10 seconds of photosynthesis.
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8 md:py-12">
            <div className="w-full max-w-lg">
                <div className="mb-6 md:mb-8 flex justify-center">
                    <CactusAvatar
                        size={typeof window !== 'undefined' && window.innerWidth < 640 ? "md" : "lg"}
                        mood={step.cactusMood}
                        message={step.message}
                    />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="border-primary/20 shadow-xl glass-card">
                            <CardContent className="p-4 md:p-6 pt-6 md:pt-8">
                                <h1 className="text-2xl font-bold text-center mb-6 text-primary">
                                    {step.title}
                                </h1>

                                {step.id === "welcome" ? (
                                    <div className="flex justify-center">
                                        <Button onClick={() => setCurrentStep(1)} className="w-full max-w-xs font-semibold py-6 text-lg">
                                            Let's Go!
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {step.options?.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => handleSelect(opt.value)}
                                                className="w-full text-left p-3 md:p-4 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                                            >
                                                <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                                                    {opt.label}
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1">
                                                    {opt.description}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>

                <div className="mt-8 flex justify-center gap-2">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 rounded-full transition-all duration-300 ${i === currentStep ? "w-8 bg-primary" : "w-2 bg-muted"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
