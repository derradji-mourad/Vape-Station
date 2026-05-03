import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Package,
    AlertTriangle,
    ShoppingCart,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Plus,
    ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface KPIData {
    totalProducts: number;
    lowStockProducts: number;
    pendingOrders: number;
    totalRevenue: number;
}

interface RecentOrder {
    id: number;
    clientName: string;
    total: number;
    status: string;
    date: string;
}

const Dashboard = () => {
    const navigate = useNavigate();
    const [kpiData, setKpiData] = useState<KPIData>({
        totalProducts: 0,
        lowStockProducts: 0,
        pendingOrders: 0,
        totalRevenue: 0,
    });
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch total products
            const { count: productCount } = await supabase
                .from("produit")
                .select("*", { count: "exact", head: true });

            // Fetch low stock products (stock < 10)
            const { count: lowStockCount } = await supabase
                .from("produit")
                .select("*", { count: "exact", head: true })
                .lt("stock", 10);

            // Fetch pending orders
            const { count: pendingCount } = await supabase
                .from("commande")
                .select("*", { count: "exact", head: true })
                .eq("statut", "En_attente");

            // Fetch recent orders with client info
            const { data: orders } = await supabase
                .from("commande")
                .select(`
          id_commande,
          statut,
          created_at,
          client:id_client (
            nom,
            prenom
          )
        `)
                .order("created_at", { ascending: false })
                .limit(5);

            setKpiData({
                totalProducts: productCount || 0,
                lowStockProducts: lowStockCount || 0,
                pendingOrders: pendingCount || 0,
                totalRevenue: 45231.89, // Placeholder - would need order items aggregation
            });

            if (orders) {
                setRecentOrders(
                    orders.map((order: any) => ({
                        id: order.id_commande,
                        clientName: order.client
                            ? `${order.client.prenom || ""} ${order.client.nom || ""}`.trim() || "Unknown"
                            : "Unknown",
                        total: Math.random() * 200 + 50, // Placeholder
                        status: order.statut,
                        date: new Date(order.created_at).toLocaleDateString(),
                    }))
                );
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const kpiCards = [
        {
            title: "Total Products",
            value: kpiData.totalProducts,
            icon: Package,
            trend: "+12%",
            trendUp: true,
            color: "text-blue-600",
            bgColor: "bg-blue-500/10",
        },
        {
            title: "Low Stock",
            value: kpiData.lowStockProducts,
            icon: AlertTriangle,
            trend: kpiData.lowStockProducts > 5 ? "Action needed" : "Good",
            trendUp: kpiData.lowStockProducts <= 5,
            color: "text-orange-600",
            bgColor: "bg-orange-500/10",
        },
        {
            title: "Pending Orders",
            value: kpiData.pendingOrders,
            icon: ShoppingCart,
            trend: "+5",
            trendUp: true,
            color: "text-purple-600",
            bgColor: "bg-purple-500/10",
        },
        {
            title: "Total Revenue",
            value: `$${kpiData.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            trend: "+20.1%",
            trendUp: true,
            color: "text-green-600",
            bgColor: "bg-green-500/10",
        },
    ];

    const statusColors: Record<string, string> = {
        En_attente: "bg-yellow-500/20 text-yellow-700",
        Validee: "bg-blue-500/20 text-blue-700",
        Terminee: "bg-green-500/20 text-green-700",
        Annulee: "bg-red-500/20 text-red-700",
    };

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpiCards.map((card, index) => (
                    <Card key={index} className="relative overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {card.title}
                            </CardTitle>
                            <div className={cn("p-2 rounded-lg", card.bgColor)}>
                                <card.icon className={cn("h-4 w-4", card.color)} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{card.value}</div>
                            <div className="flex items-center gap-1 mt-1">
                                {card.trendUp ? (
                                    <TrendingUp className="h-3 w-3 text-green-600" />
                                ) : (
                                    <TrendingDown className="h-3 w-3 text-red-600" />
                                )}
                                <span
                                    className={cn(
                                        "text-xs",
                                        card.trendUp ? "text-green-600" : "text-red-600"
                                    )}
                                >
                                    {card.trend}
                                </span>
                                <span className="text-xs text-muted-foreground ml-1">
                                    from last month
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section Placeholder */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Sales Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-lg">
                            <div className="text-center text-muted-foreground">
                                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>Sales chart will be displayed here</p>
                                <p className="text-sm">Install recharts for visualization</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Orders</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/orders")}>
                            View all
                            <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                    >
                                        <div>
                                            <p className="font-medium">#{order.id}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.clientName}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">${order.total.toFixed(2)}</p>
                                            <span
                                                className={cn(
                                                    "text-xs px-2 py-0.5 rounded-full",
                                                    statusColors[order.status] || "bg-gray-500/20 text-gray-700"
                                                )}
                                            >
                                                {order.status.replace("_", " ")}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p>No recent orders</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card
                        className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
                        onClick={() => navigate("/admin/products/new")}
                    >
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="p-3 rounded-lg bg-primary/10">
                                <Plus className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">Add Product</p>
                                <p className="text-sm text-muted-foreground">
                                    Create a new product
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
                        onClick={() => navigate("/admin/products")}
                    >
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="p-3 rounded-lg bg-blue-500/10">
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium">Manage Products</p>
                                <p className="text-sm text-muted-foreground">
                                    View and edit products
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
                        onClick={() => navigate("/admin/orders")}
                    >
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="p-3 rounded-lg bg-purple-500/10">
                                <ShoppingCart className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="font-medium">View Orders</p>
                                <p className="text-sm text-muted-foreground">
                                    Manage customer orders
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
                        onClick={() => navigate("/admin/statistics")}
                    >
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="p-3 rounded-lg bg-green-500/10">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium">View Statistics</p>
                                <p className="text-sm text-muted-foreground">
                                    Analytics & reports
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
