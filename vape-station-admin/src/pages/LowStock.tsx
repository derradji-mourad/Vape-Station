import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
    AlertTriangle,
    Search,
    Pencil,
    Package,
    Loader2,
    RefreshCw,
    TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LowStockProduct {
    id_produit: number;
    nom: string;
    prix: number | null;
    stock: number;
    seuil_alerte: number;
    cout_achat: number | null;
    image_principale: string;
    type: string;
}

const LowStock = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [products, setProducts] = useState<LowStockProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"stock" | "threshold" | "urgency">("urgency");

    useEffect(() => {
        fetchLowStockProducts();
    }, []);

    const fetchLowStockProducts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("produit")
                .select("id_produit,nom,prix,stock,seuil_alerte,cout_achat,image_principale,puff:puff!puff_id_produit_fkey(*),vape:vape!vape_id_produit_fkey(*),liquide:liquide!liquide_id_produit_fkey(*),clearomiseur:clearomiseur!clearomiseur_id_produit_fkey(*)")
                .order("stock", { ascending: true });

            if (error) throw error;

            // Filter products where stock <= threshold
            const lowStockProducts = (data || [])
                .filter((p: any) => (p.stock || 0) <= (p.seuil_alerte || 5))
                .map((p: any) => ({
                    ...p,
                    stock: p.stock || 0,
                    seuil_alerte: p.seuil_alerte || 5,
                    type: p.puff ? "puff" : p.vape ? "vape" : p.liquide ? "liquid" : p.clearomiseur ? "accessory" : "unknown",
                }));

            setProducts(lowStockProducts);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error fetching low stock products",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const sortedProducts = useMemo(() => {
        const filtered = products.filter((p) =>
            p.nom.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return filtered.sort((a, b) => {
            switch (sortBy) {
                case "stock":
                    return a.stock - b.stock;
                case "threshold":
                    return b.seuil_alerte - a.seuil_alerte;
                case "urgency":
                    // Urgency = how far below threshold (lower = more urgent)
                    const urgencyA = a.stock - a.seuil_alerte;
                    const urgencyB = b.stock - b.seuil_alerte;
                    return urgencyA - urgencyB;
                default:
                    return 0;
            }
        });
    }, [products, searchQuery, sortBy]);

    const getStockSeverity = (stock: number, threshold: number) => {
        if (stock === 0) return "critical";
        if (stock <= threshold * 0.5) return "severe";
        return "warning";
    };

    const getStockBadge = (stock: number, threshold: number) => {
        const severity = getStockSeverity(stock, threshold);

        if (severity === "critical") {
            return (
                <Badge variant="destructive" className="animate-pulse">
                    Out of Stock
                </Badge>
            );
        }
        if (severity === "severe") {
            return (
                <Badge className="bg-orange-500/20 text-orange-700 hover:bg-orange-500/30 animate-pulse">
                    Critical ({stock})
                </Badge>
            );
        }
        return (
            <Badge className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">
                Low ({stock})
            </Badge>
        );
    };

    const getTypeBadge = (type: string) => {
        const typeColors: Record<string, string> = {
            vape: "bg-blue-500/20 text-blue-700",
            puff: "bg-purple-500/20 text-purple-700",
            liquid: "bg-cyan-500/20 text-cyan-700",
            accessory: "bg-orange-500/20 text-orange-700",
        };
        return (
            <Badge className={cn("capitalize", typeColors[type] || "bg-gray-500/20 text-gray-700")}>
                {type}
            </Badge>
        );
    };

    const outOfStockCount = products.filter((p) => p.stock === 0).length;
    const criticalCount = products.filter((p) => p.stock > 0 && p.stock <= (p.seuil_alerte * 0.5)).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-6 w-6 text-yellow-500" />
                        <h2 className="text-2xl font-bold">Low Stock Alerts</h2>
                    </div>
                    <p className="text-muted-foreground">
                        Products that need restocking attention
                    </p>
                </div>
                <Button variant="outline" onClick={fetchLowStockProducts} disabled={loading}>
                    <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                    Refresh
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-yellow-500/30 bg-yellow-500/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Low Stock</p>
                                <p className="text-3xl font-bold text-yellow-600">{products.length}</p>
                            </div>
                            <AlertTriangle className="h-10 w-10 text-yellow-500/50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-red-500/30 bg-red-500/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Out of Stock</p>
                                <p className="text-3xl font-bold text-red-600">{outOfStockCount}</p>
                            </div>
                            <Package className="h-10 w-10 text-red-500/50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-orange-500/30 bg-orange-500/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Critical Level</p>
                                <p className="text-3xl font-bold text-orange-600">{criticalCount}</p>
                            </div>
                            <TrendingDown className="h-10 w-10 text-orange-500/50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="urgency">Most Urgent</SelectItem>
                                <SelectItem value="stock">Lowest Stock</SelectItem>
                                <SelectItem value="threshold">Highest Threshold</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Products Table */}
            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : sortedProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Package className="h-12 w-12 text-green-500/50 mb-4" />
                            <p className="text-lg font-medium text-green-600">All stocked up!</p>
                            <p className="text-muted-foreground">
                                No products are currently below their alert threshold
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Image</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-center">Current</TableHead>
                                    <TableHead className="text-center">Threshold</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedProducts.map((product) => (
                                    <TableRow
                                        key={product.id_produit}
                                        className={cn(
                                            product.stock === 0 && "bg-red-500/5"
                                        )}
                                    >
                                        <TableCell>
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                                                {product.image_principale ? (
                                                    <img
                                                        src={product.image_principale}
                                                        alt={product.nom}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium">{product.nom}</p>
                                            {product.prix && (
                                                <p className="text-sm text-muted-foreground">
                                                    ${product.prix.toFixed(2)}
                                                </p>
                                            )}
                                        </TableCell>
                                        <TableCell>{getTypeBadge(product.type)}</TableCell>
                                        <TableCell className="text-center">
                                            <span
                                                className={cn(
                                                    "text-lg font-bold",
                                                    product.stock === 0
                                                        ? "text-red-600"
                                                        : product.stock <= product.seuil_alerte * 0.5
                                                            ? "text-orange-600"
                                                            : "text-yellow-600"
                                                )}
                                            >
                                                {product.stock}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center text-muted-foreground">
                                            {product.seuil_alerte}
                                        </TableCell>
                                        <TableCell>
                                            {getStockBadge(product.stock, product.seuil_alerte)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    navigate(`/admin/products/${product.id_produit}/edit`)
                                                }
                                            >
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Update Stock
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default LowStock;
