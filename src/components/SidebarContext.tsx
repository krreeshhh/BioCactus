import React, { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
    isCompact: boolean;
    isMobileOpen: boolean;
    toggleCompact: () => void;
    setMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
    const [isCompact, setIsCompact] = useState(() => {
        const saved = localStorage.getItem("sidebar_compact");
        return saved === "true";
    });
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleCompact = () => {
        setIsCompact((prev) => {
            const newVal = !prev;
            localStorage.setItem("sidebar_compact", String(newVal));
            return newVal;
        });
    };

    return (
        <SidebarContext.Provider value={{ isCompact, isMobileOpen, toggleCompact, setMobileOpen: setIsMobileOpen }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};
