import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useNavigate } from "react-router-dom";
import {
    Bell,
    Search,
    User,
    LogOut,
    Settings,
    ChevronDown,
    Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TopBarProps {
    title?: string;
}

export const TopBar = ({ title = "Dashboard" }: TopBarProps) => {
    const { user, signOut } = useAuth();
    const { collapsed, toggle } = useSidebar();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSignOut = async () => {
        await signOut();
        navigate("/auth");
    };

    return (
        <header
            className={cn(
                "h-16 bg-card/80 backdrop-blur-md border-b border-border",
                "fixed top-0 right-0 z-30 flex items-center justify-between px-6",
                "transition-all duration-300"
            )}
            style={{ left: collapsed ? 80 : 260 }}
        >
            {/* Left Section */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggle}
                    className="lg:hidden"
                >
                    <Menu className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-xl font-semibold text-foreground">{title}</h1>
                </div>
            </div>

            {/* Center Section - Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search products, orders, clients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <Badge
                                variant="destructive"
                                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                            >
                                3
                            </Badge>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                            <span className="font-medium">New Order #1234</span>
                            <span className="text-sm text-muted-foreground">
                                A new order was placed 5 minutes ago
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                            <span className="font-medium">Low Stock Alert</span>
                            <span className="text-sm text-muted-foreground">
                                3 products are running low on stock
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                            <span className="font-medium">Payment Received</span>
                            <span className="text-sm text-muted-foreground">
                                Order #1230 payment confirmed
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="justify-center text-primary">
                            View all notifications
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 px-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-primary/20 text-primary">
                                    {user?.email?.[0]?.toUpperCase() || "A"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden lg:flex flex-col items-start">
                                <span className="text-sm font-medium">
                                    {user?.email?.split("@")[0] || "Admin"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    Administrator
                                </span>
                            </div>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/admin/profile")}>
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};
