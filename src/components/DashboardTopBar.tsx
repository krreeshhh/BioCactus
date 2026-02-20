import { Search, Bell, Settings, Command } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const TopBar = () => {
    const { user } = useAuth();

    return (
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-background sticky top-0 z-30">
            {/* Navigation Pills - Left side */}


            {/* Search Bar - Mimicking stocks.ai search */}
            <div className="flex-1 max-w-xl relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Ask BioCactus AI anything..."
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/10 transition-all placeholder:text-muted-foreground/50"
                />
                <div className="absolute right-4 inset-y-0 flex items-center">
                    <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-muted-foreground font-medium">
                        <Command className="w-3 h-3" /> K
                    </kbd>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors relative">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
                </button>
                <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <Settings className="w-5 h-5 text-muted-foreground" />
                </button>

                <div className="h-10 w-px bg-white/5 mx-2" />

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold leading-none">{user?.displayName || "Explorer"}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 lowercase">{user?.email || "guest@biocactus.io"}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 p-0.5 shadow-lg shadow-primary/5">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="" className="w-full h-full rounded-[var(--radius)] object-cover" />
                        ) : (
                            <div className="w-full h-full rounded-[10px] bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                                {user?.displayName?.charAt(0) || "B"}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
