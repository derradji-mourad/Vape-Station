import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/contexts/SidebarContext";
import {
    LayoutDashboard,
    Package,
    Wind,
    Droplets,
    Wrench,
    ShoppingCart,
    Users,
    BarChart3,
    FileDown,
    Settings,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Cigarette,
    Disc,
    Pipette,
    CircleDot,
    Zap,
    Codesandbox,
    Cpu,
    Battery,
    AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface NavItem {
    label: string;
    icon: React.ElementType;
    href?: string;
    children?: NavItem[];
    badge?: number;
}

const navigation: NavItem[] = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin",
    },
    {
        label: "Products",
        icon: Package,
        children: [
            { label: "Vapes", icon: Wind, href: "/admin/products?type=vape" },
            { label: "Puffs", icon: Cigarette, href: "/admin/products?type=puff" },
            { label: "Liquids", icon: Droplets, href: "/admin/products?type=liquid" },
            {
                label: "Accessories",
                icon: Wrench,
                children: [
                    { label: "Clearomizers", icon: Disc, href: "/admin/products?type=clearomizer" },
                    { label: "Coils / Resistances", icon: Zap, href: "/admin/products?type=resistance" },
                    { label: "Tanks", icon: Pipette, href: "/admin/products?type=tank" },
                    { label: "Drip Tips", icon: CircleDot, href: "/admin/products?type=drip_tip" },
                    { label: "Atomizers", icon: Codesandbox, href: "/admin/products?type=atomizer" },
                    { label: "Wires", icon: Cpu, href: "/admin/products?type=wire" },
                    { label: "Cotton", icon: Package, href: "/admin/products?type=cotton" },
                    { label: "Mods & Batteries", icon: Battery, href: "/admin/products?type=mod" },
                ],
            },
        ],
    },
    {
        label: "Orders",
        icon: ShoppingCart,
        href: "/admin/orders",
    },
    {
        label: "Clients",
        icon: Users,
        href: "/admin/clients",
    },
    {
        label: "Statistics",
        icon: BarChart3,
        href: "/admin/statistics",
    },
    {
        label: "Low Stock",
        icon: AlertTriangle,
        href: "/admin/low-stock",
    },
    {
        label: "Exports",
        icon: FileDown,
        href: "/admin/exports",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/admin/settings",
    },
];

interface NavItemProps {
    item: NavItem;
    depth?: number;
}

const NavItemComponent = ({ item, depth = 0 }: NavItemProps) => {
    const [expanded, setExpanded] = useState(false);
    const location = useLocation();
    const { collapsed } = useSidebar();
    const hasChildren = item.children && item.children.length > 0;
    const isActive = item.href === location.pathname ||
        (item.href && location.pathname.startsWith(item.href) && item.href !== "/admin");

    const Icon = item.icon;

    const content = (
        <div
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200",
                "hover:bg-primary/10 hover:text-primary",
                isActive && "bg-primary/15 text-primary font-medium",
                depth > 0 && "ml-4",
                depth > 1 && "ml-8"
            )}
            style={{ paddingLeft: collapsed ? "12px" : `${12 + depth * 12}px` }}
            onClick={() => hasChildren && setExpanded(!expanded)}
        >
            <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary")} />
            {!collapsed && (
                <>
                    <span className="flex-1 text-sm">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                        <Badge
                            variant="destructive"
                            className="h-5 min-w-5 px-1.5 text-[10px] font-bold animate-pulse"
                        >
                            {item.badge}
                        </Badge>
                    )}
                    {hasChildren && (
                        <ChevronDown
                            className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                expanded && "rotate-180"
                            )}
                        />
                    )}
                </>
            )}
        </div>
    );

    if (collapsed && !hasChildren) {
        return (
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <Link to={item.href || "#"}>{content}</Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                    {item.label}
                </TooltipContent>
            </Tooltip>
        );
    }

    return (
        <div>
            {item.href && !hasChildren ? (
                <Link to={item.href}>{content}</Link>
            ) : (
                content
            )}
            {hasChildren && !collapsed && (
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            {item.children?.map((child, index) => (
                                <NavItemComponent key={index} item={child} depth={depth + 1} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
};

export const Sidebar = () => {
    const { collapsed, toggle } = useSidebar();
    const [lowStockCount, setLowStockCount] = useState(0);

    useEffect(() => {
        const fetchLowStockCount = async () => {
            try {
                // Get products where stock <= threshold
                const { data } = await supabase
                    .from("produit")
                    .select("stock");

                if (data) {
                    const count = data.filter(
                        (p: any) => (p.stock || 0) <= (p.seuil_alerte || 5)
                    ).length;
                    setLowStockCount(count);
                }
            } catch (error) {
                console.error("Error fetching low stock count:", error);
            }
        };

        fetchLowStockCount();
        // Refresh every 30 seconds
        const interval = setInterval(fetchLowStockCount, 30000);
        return () => clearInterval(interval);
    }, []);

    // Create navigation with dynamic badge
    const navWithBadges = navigation.map((item) => {
        if (item.label === "Low Stock") {
            return { ...item, badge: lowStockCount };
        }
        return item;
    });

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 80 : 260 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
                "h-screen bg-card border-r border-border flex flex-col",
                "fixed left-0 top-0 z-40"
            )}
        >
            {/* Logo Section */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                    >
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                            <Wind className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            VapeAdmin
                        </span>
                    </motion.div>
                )}
                {collapsed && (
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto">
                        <Wind className="h-5 w-5 text-white" />
                    </div>
                )}
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 py-4">
                <nav className="px-2 space-y-1">
                    {navWithBadges.map((item, index) => (
                        <NavItemComponent key={index} item={item} />
                    ))}
                </nav>
            </ScrollArea>

            {/* Collapse Button */}
            <div className="p-3 border-t border-border">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggle}
                    className="w-full justify-center"
                >
                    {collapsed ? (
                        <ChevronRight className="h-5 w-5" />
                    ) : (
                        <>
                            <ChevronLeft className="h-5 w-5 mr-2" />
                            <span>Collapse</span>
                        </>
                    )}
                </Button>
            </div>
        </motion.aside>
    );
};
