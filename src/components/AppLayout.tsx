import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import AppSidebar from "./AppSidebar";
import FloatingCactus from "./FloatingCactus";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import DashboardTopBar from "./DashboardTopBar";

const AppLayoutContent = () => {
  const { isCompact } = useSidebar();

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">

      <AppSidebar />

      <main
        className={`transition-all duration-300 ease-in-out relative z-10 ${isCompact ? "lg:ml-20" : "lg:ml-[280px]"
          } ml-0`}
      >
        <DashboardTopBar />
        <div className="max-w-[1400px] mx-auto min-h-screen px-3 md:px-4 py-6 md:py-8 pb-20 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>

      <FloatingCactus />
    </div>
  );
};

const AppLayout = () => (
  <SidebarProvider>
    <AppLayoutContent />
  </SidebarProvider>
);

export default AppLayout;
