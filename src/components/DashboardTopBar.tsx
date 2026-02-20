import { Search, Bell, Settings, Command, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { useSidebar } from "./SidebarContext";

const TopBar = () => {
    const { user } = useAuth();
    const { isMobileOpen, setMobileOpen } = useSidebar();

    return (
        <header className="h-16 md:h-20 border-b border-white/10 flex items-center justify-between px-4 md:px-8 bg-background/60 backdrop-blur-xl sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setMobileOpen(!isMobileOpen)}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 lg:hidden text-muted-foreground"
                >
                    {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                {/* Search Bar - Mimicking stocks.ai search */}
                <div className="flex-1 max-w-xl relative group hidden md:block">
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

                <div className="md:hidden">
                    <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground">
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-3">
                <button className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors relative">
                    <Bell className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full border-2 border-background" />
                </button>
                <button className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <Settings className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                </button>

                <div className="h-8 md:h-10 w-px bg-white/5 mx-1 md:mx-2" />

                <div className="flex items-center gap-2 md:gap-3 pl-1 md:pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs md:text-sm font-bold leading-none">{user?.displayName || "Explorer"}</p>
                        <p className="text-[9px] md:text-[10px] text-muted-foreground mt-1 lowercase truncate max-w-[100px]">{user?.email || "guest@biocactus.io"}</p>
                    </div>
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary/10 border border-primary/20 p-0.5 shadow-lg shadow-primary/5">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="" className="w-full h-full rounded-[var(--radius)] object-cover" />
                        ) : (
                            <div className="w-full h-full rounded-[10px] bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs md:text-sm font-bold">
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
