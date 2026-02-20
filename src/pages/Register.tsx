import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { toast } from "sonner";
import BrandLogo from "@/components/BrandLogo";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { registerWithEmail, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }
        setIsLoading(true);
        try {
            const isNew = await registerWithEmail(email, password, name);
            toast.success(isNew ? "Welcome to the frontier!" : "Welcome back!");
            navigate(isNew ? "/onboarding" : "/dashboard");
        } catch (error: any) {
            toast.error(error.message || "Failed to create account.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const isNew = await loginWithGoogle();
            toast.success(isNew ? "Identity verified! Welcome." : "Welcome back!");
            navigate(isNew ? "/onboarding" : "/dashboard");
        } catch (error: any) {
            toast.error("Google verify failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
                <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[100px]" />
            </div>

            <Card className="w-full max-w-md m3-glass border-white/5 relative z-10 p-2">
                <CardHeader className="space-y-2 text-center pb-8">
                    <div className="flex justify-center mb-2">
                        <BrandLogo size="md" />
                    </div>
                    <CardTitle className="text-4xl font-black tracking-tighter text-foreground">
                        Join <span className="text-primary">BioCactus</span>
                    </CardTitle>
                    <CardDescription className="text-muted-foreground font-medium">
                        Begin your journey into the biological code
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <form onSubmit={handleRegister} className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="Charles Darwin"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={isLoading}
                                className="bg-white/5 border-white/10 rounded-[var(--radius)] h-12 focus:ring-primary/50 transition-all font-medium"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                className="bg-white/5 border-white/10 rounded-[var(--radius)] h-12 focus:ring-primary/50 transition-all font-medium"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                placeholder="********"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                className="bg-white/5 border-white/10 rounded-[var(--radius)] h-12 focus:ring-primary/50 transition-all font-medium"
                            />
                        </div>
                        <Button type="submit" variant="glossy" size="lg" className="w-full mt-2" disabled={isLoading}>
                            {isLoading ? "Evolution in progress..." : "Join the Frontier"}
                        </Button>
                    </form>
                    <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/5" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                            <span className="bg-transparent px-4 text-muted-foreground/40">Secure Access</span>
                        </div>
                    </div>
                    <Button variant="outline" type="button" disabled={isLoading} onClick={handleGoogleLogin} className="w-full h-12 border-white/10 bg-white/5 hover:bg-white/10 font-bold transition-all">
                        {isLoading ? (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Icons.google className="mr-2 h-4 w-4" />
                        )}{" "}
                        Continue with Google
                    </Button>
                </CardContent>
                <CardFooter className="flex flex-wrap items-center justify-center gap-2 pt-6">
                    <div className="text-sm font-medium text-muted-foreground">
                        Already have an identity?{" "}
                        <Link to="/login" className="text-primary hover:text-primary/80 transition-colors font-bold">
                            Sign In
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Register;
