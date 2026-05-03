import { Outlet, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const pageTitles: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/products": "Products",
    "/admin/products/new": "Add New Product",
    "/admin/orders": "Orders",
    "/admin/clients": "Clients",
    "/admin/statistics": "Statistics",
    "/admin/exports": "Exports",
    "/admin/settings": "Settings",
};

const AdminLayoutContent = () => {
    const location = useLocation();
    const { collapsed } = useSidebar();

    const title = pageTitles[location.pathname] || "Dashboard";

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <TopBar title={title} />
            <motion.main
                initial={false}
                animate={{ marginLeft: collapsed ? 80 : 260 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="pt-16 min-h-screen"
            >
                <div className="p-6">
                    <Outlet />
                </div>
            </motion.main>
        </div>
    );
};

export const AdminLayout = () => {
    const { user, isAdmin, loading } = useAuth();

    // Show loading state with a visible background
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0f0f0f' }}>
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    // If no user at all, redirect to auth
    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    // For now, allow any authenticated user to access admin
    // TODO: Re-enable admin check once admin table is properly set up
    // if (!isAdmin) {
    //     return <Navigate to="/auth" replace />;
    // }

    return (
        <SidebarProvider>
            <AdminLayoutContent />
        </SidebarProvider>
    );
};
