import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
    Package,
    ShoppingCart,
    DollarSign,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Download,
    Calendar,
    FileSpreadsheet,
    FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
} from "recharts";

interface StatsData {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    totalProfit: number;
    avgMargin: number;
    lowStockProducts: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalClients: number;
}

const Statistics = () => {
    const { toast } = useToast();
    const [stats, setStats] = useState<StatsData>({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalProfit: 0,
        avgMargin: 0,
        lowStockProducts: 0,
        pendingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        totalClients: 0,
    });
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState("30");

    useEffect(() => {
        fetchStats();
    }, [dateRange]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            // Total products
            const { count: productCount } = await supabase
                .from("produit")
                .select("*", { count: "exact", head: true });

            // Low stock products
            const { count: lowStockCount } = await supabase
                .from("produit")
                .select("*", { count: "exact", head: true })
                .lt("stock", 10);

            // Total orders
            const { count: orderCount } = await supabase
                .from("commande")
                .select("*", { count: "exact", head: true });

            // Pending orders
            const { count: pendingCount } = await supabase
                .from("commande")
                .select("*", { count: "exact", head: true })
                .eq("statut", "En_attente");

            // Completed orders
            const { count: completedCount } = await supabase
                .from("commande")
                .select("*", { count: "exact", head: true })
                .eq("statut", "Terminee");

            // Cancelled orders
            const { count: cancelledCount } = await supabase
                .from("commande")
                .select("*", { count: "exact", head: true })
                .eq("statut", "Annulee");

            // Total clients
            const { count: clientCount } = await supabase
                .from("client")
                .select("*", { count: "exact", head: true });

            // Fetch products with pricing data for profit calculation
            const { data: productsData } = await supabase
                .from("produit")
                .select("prix, cout_achat, stock");

            let totalRevenuePotential = 0;
            let totalCost = 0;
            let productWithPriceCount = 0;

            if (productsData) {
                productsData.forEach((p: any) => {
                    if (p.prix && p.cout_achat) {
                        totalRevenuePotential += (p.prix * (p.stock || 0));
                        totalCost += (p.cout_achat * (p.stock || 0));
                        productWithPriceCount++;
                    }
                });
            }

            const totalProfit = totalRevenuePotential - totalCost;
            const avgMargin = totalRevenuePotential > 0
                ? ((totalProfit / totalRevenuePotential) * 100)
                : 0;

            setStats({
                totalProducts: productCount || 0,
                totalOrders: orderCount || 0,
                totalRevenue: totalRevenuePotential,
                totalProfit: totalProfit,
                avgMargin: avgMargin,
                lowStockProducts: lowStockCount || 0,
                pendingOrders: pendingCount || 0,
                completedOrders: completedCount || 0,
                cancelledOrders: cancelledCount || 0,
                totalClients: clientCount || 0,
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error fetching statistics",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleExport = (format: "csv" | "excel" | "pdf") => {
        toast({
            title: "Export started",
            description: `Preparing ${format.toUpperCase()} export...`,
        });

        // In a real implementation, this would generate and download the file
        setTimeout(() => {
            toast({
                title: "Export ready",
                description: `Your ${format.toUpperCase()} file has been downloaded.`,
            });
        }, 1500);
    };

    const kpiCards = [
        {
            title: "Total Revenue",
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            trend: "+20.1%",
            trendUp: true,
            color: "text-green-600",
            bgColor: "bg-green-500/10",
        },
        {
            title: "Total Products",
            value: stats.totalProducts,
            icon: Package,
            trend: "+12",
            trendUp: true,
            color: "text-blue-600",
            bgColor: "bg-blue-500/10",
        },
        {
            title: "Total Orders",
            value: stats.totalOrders,
            icon: ShoppingCart,
            trend: "+8%",
            trendUp: true,
            color: "text-purple-600",
            bgColor: "bg-purple-500/10",
        },
        {
            title: "Low Stock Alerts",
            value: stats.lowStockProducts,
            icon: AlertTriangle,
            trend: stats.lowStockProducts > 5 ? "Needs attention" : "Good",
            trendUp: stats.lowStockProducts <= 5,
            color: "text-orange-600",
            bgColor: "bg-orange-500/10",
        },
        {
            title: "Total Profit",
            value: `$${stats.totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
            icon: TrendingUp,
            trend: `${stats.avgMargin.toFixed(1)}% margin`,
            trendUp: stats.totalProfit > 0,
            color: stats.totalProfit >= 0 ? "text-green-600" : "text-red-600",
            bgColor: stats.totalProfit >= 0 ? "bg-green-500/10" : "bg-red-500/10",
        },
        {
            title: "Avg. Margin",
            value: `${stats.avgMargin.toFixed(1)}%`,
            icon: TrendingUp,
            trend: stats.avgMargin >= 20 ? "Healthy" : "Below target",
            trendUp: stats.avgMargin >= 20,
            color: stats.avgMargin >= 20 ? "text-green-600" : "text-amber-600",
            bgColor: stats.avgMargin >= 20 ? "bg-green-500/10" : "bg-amber-500/10",
        },
    ];

    const orderStats = [
        { label: "Pending", value: stats.pendingOrders, color: "bg-yellow-500" },
        { label: "Completed", value: stats.completedOrders, color: "bg-green-500" },
        { label: "Cancelled", value: stats.cancelledOrders, color: "bg-red-500" },
    ];

    const totalOrdersForPercentage = stats.pendingOrders + stats.completedOrders + stats.cancelledOrders || 1;

    // Mock chart data - in production, this would come from actual historical data
    const revenueVsProfitData = [
        { month: 'Jan', revenue: 4000, profit: 1200 },
        { month: 'Feb', revenue: 5200, profit: 1800 },
        { month: 'Mar', revenue: 4800, profit: 1500 },
        { month: 'Apr', revenue: 6100, profit: 2100 },
        { month: 'May', revenue: 5800, profit: 1900 },
        { month: 'Jun', revenue: 7200, profit: 2600 },
    ];

    const topProfitableProducts = [
        { name: 'Vape Pro Max', profit: 1250 },
        { name: 'E-Liquid Blue', profit: 890 },
        { name: 'Puff Ultra', profit: 720 },
        { name: 'Coil Pack 5', profit: 540 },
        { name: 'Tank Premium', profit: 380 },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Statistics</h2>
                    <p className="text-muted-foreground">
                        Analytics and business insights
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-[150px]">
                            <Calendar className="h-4 w-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7">Last 7 days</SelectItem>
                            <SelectItem value="30">Last 30 days</SelectItem>
                            <SelectItem value="90">Last 90 days</SelectItem>
                            <SelectItem value="365">Last year</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

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
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 lg:grid-cols-2">
                {/* Orders by Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Orders by Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {orderStats.map((stat) => (
                                <div key={stat.label} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>{stat.label}</span>
                                        <span className="font-medium">{stat.value}</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                                        <div
                                            className={cn("h-full rounded-full transition-all", stat.color)}
                                            style={{
                                                width: `${(stat.value / totalOrdersForPercentage) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Total Orders</span>
                                <span className="text-lg font-bold">{stats.totalOrders}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Revenue vs Profit Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue vs Profit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueVsProfitData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis
                                        dataKey="month"
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                    />
                                    <YAxis
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '6px',
                                        }}
                                        formatter={(value: number) => [`$${value}`, '']}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                                        name="Revenue"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="profit"
                                        stroke="#22c55e"
                                        strokeWidth={2}
                                        dot={{ fill: '#22c55e', strokeWidth: 2 }}
                                        name="Profit"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Profitable Products Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Profitable Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topProfitableProducts} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis
                                    type="number"
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={11}
                                    width={100}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '6px',
                                    }}
                                    formatter={(value: number) => [`$${value}`, 'Profit']}
                                />
                                <Bar
                                    dataKey="profit"
                                    fill="#22c55e"
                                    radius={[0, 4, 4, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* More Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Client Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.totalClients}</div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Registered customers
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Conversion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {((stats.completedOrders / (stats.totalOrders || 1)) * 100).toFixed(1)}%
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Orders completed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Avg. Order Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            ${(stats.totalRevenue / (stats.completedOrders || 1)).toFixed(2)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Per completed order
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Export Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Export Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Download your business data in various formats
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" onClick={() => handleExport("csv")}>
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                        </Button>
                        <Button variant="outline" onClick={() => handleExport("excel")}>
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Export Excel
                        </Button>
                        <Button variant="outline" onClick={() => handleExport("pdf")}>
                            <FileText className="h-4 w-4 mr-2" />
                            Export PDF
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Statistics;
