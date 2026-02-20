import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Lesson from "./pages/Lesson";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import CoursePath from "./pages/CoursePath";
import Leaderboard from "./pages/Leaderboard";
import Curriculum from "./pages/Curriculum";
import AppLayout from "./components/AppLayout";
import { AuthProvider } from "./hooks/useAuth";


import { PublicRoute, PrivateRoute } from "./components/AuthRoute";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
