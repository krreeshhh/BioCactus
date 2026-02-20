import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import { AuthProvider } from "./hooks/useAuth";
import { I18nProvider } from "./lib/i18n";
import { PublicRoute, PrivateRoute } from "./components/AuthRoute";

// Lazy loading pages for better production performance
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Lesson = lazy(() => import("./pages/Lesson"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const CoursePath = lazy(() => import("./pages/CoursePath"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Curriculum = lazy(() => import("./pages/Curriculum"));
const ChatPage = lazy(() => import("./pages/ChatPage"));

const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Auth restricted routes (Logged in users go to dashboard) */}
                <Route element={<PublicRoute />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>

                {/* Protected routes (Requires login) */}
                <Route element={<PrivateRoute />}>
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/curriculum" element={<Curriculum />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/course/:topicId" element={<CoursePath />} />
                    <Route path="/lesson/:topicId/:lessonIndex" element={<Lesson />} />
                    <Route path="/quiz/:topicId/:lessonIndex" element={<Quiz />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/chat" element={<ChatPage />} />
                  </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
