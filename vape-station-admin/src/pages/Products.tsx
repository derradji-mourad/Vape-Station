import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Package,
    Loader2,
    Filter,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface Product {
    id_produit: number;
    nom: string;
    description: string | null;
    prix: number | null;
    stock: number | null;
    cout_achat: number | null;
    seuil_alerte: number | null;
    actif: boolean | null;
    image_principale: string;
    created_at: string | null;
    type: string;
    brand?: string;
    puff?: { nombre_bouffees: number | null; saveur: string | null };
    vape?: { type: string | null; puissance_watt: number | null };
    liquide?: { volume_ml: number | null };
    clearomiseur?: { contenance_ml: number | null };
}

const Products = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { toast } = useToast();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "all");
    const [stockFilter, setStockFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("produit")
                .select("*,puff:puff!puff_id_produit_fkey(*),vape:vape!vape_id_produit_fkey(*,marque:id_marque(nom)),liquide:liquide!liquide_id_produit_fkey(*),clearomiseur:clearomiseur!clearomiseur_id_produit_fkey(*)")
                .order("created_at", { ascending: false });

            if (error) throw error;

            // Map products with type detection
            const mappedProducts = (data || []).map((p: any) => ({
                ...p,
                type: p.puff ? "puff" : p.vape ? "vape" : p.liquide ? "liquid" : p.clearomiseur ? "accessory" : "unknown",
                brand: p.vape?.marque?.nom || null,
            }));

            setProducts(mappedProducts);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error fetching products",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteProductId) return;
        setDeleting(true);
        try {
            const { error } = await supabase
                .from("produit")
                .delete()
                .eq("id_produit", deleteProductId);

            if (error) throw error;

            toast({
                title: "Product deleted",
                description: "The product has been successfully deleted.",
            });
            fetchProducts();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error deleting product",
                description: error.message,
            });
        } finally {
            setDeleting(false);
            setDeleteProductId(null);
        }
    };

    const handleToggleActive = async (productId: number, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from("produit")
                .update({ actif: !currentStatus })
                .eq("id_produit", productId);

            if (error) throw error;

            setProducts(products.map(p =>
                p.id_produit === productId ? { ...p, actif: !currentStatus } : p
            ));

            toast({
                title: !currentStatus ? "Product activated" : "Product deactivated",
                description: `The product is now ${!currentStatus ? "visible" : "hidden"} to customers.`,
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error updating product",
                description: error.message,
            });
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            // Search filter
            if (searchQuery && !product.nom.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            // Type filter
            if (typeFilter !== "all" && product.type !== typeFilter) {
                return false;
            }
            // Stock filter
            if (stockFilter === "low" && (product.stock || 0) >= 10) {
                return false;
            }
            if (stockFilter === "out" && (product.stock || 0) > 0) {
                return false;
            }
            if (stockFilter === "in" && (product.stock || 0) === 0) {
                return false;
            }
            // Status filter
            if (statusFilter === "active" && !product.actif) {
                return false;
            }
            if (statusFilter === "inactive" && product.actif) {
                return false;
            }
            return true;
        });
    }, [products, searchQuery, typeFilter, stockFilter, statusFilter]);

    const getStockBadge = (stock: number | null, threshold: number | null = 5) => {
        const s = stock || 0;
        const t = threshold || 5;

        if (s === 0) {
            return <Badge variant="destructive">Out of Stock</Badge>;
        }
        if (s <= t) {
            return <Badge className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30 animate-pulse">Low ({s})</Badge>;
        }
        return <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">In Stock ({s})</Badge>;
    };

    const getProfitBadge = (price: number | null, cost: number | null) => {
        if (!price || !cost) return <span className="text-muted-foreground">-</span>;
        const profit = price - cost;
        const margin = (profit / price) * 100;

        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex flex-col items-end cursor-help">
                        <span className={cn("font-bold text-xs", profit >= 0 ? "text-green-600" : "text-red-500")}>
                            ${profit.toFixed(2)}
                        </span>
                        <span className={cn("text-[10px]", margin >= 20 ? "text-green-500" : "text-amber-500")}>
                            {margin.toFixed(1)}%
                        </span>
                    </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="text-xs">
                    <p className="font-medium">Profit Calculation</p>
                    <p className="text-muted-foreground">Selling: ${price.toFixed(2)}</p>
                    <p className="text-muted-foreground">Cost: ${cost.toFixed(2)}</p>
                    <p className={cn("font-bold", profit >= 0 ? "text-green-500" : "text-red-500")}>
                        Profit: ${profit.toFixed(2)} ({margin.toFixed(1)}%)
                    </p>
                </TooltipContent>
            </Tooltip>
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

    const clearFilters = () => {
        setSearchQuery("");
        setTypeFilter("all");
        setStockFilter("all");
        setStatusFilter("all");
        setSearchParams({});
    };

    const hasActiveFilters = searchQuery || typeFilter !== "all" || stockFilter !== "all" || statusFilter !== "all";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Products</h2>
                    <p className="text-muted-foreground">
                        Manage your product catalog
                    </p>
                </div>
                <Button onClick={() => navigate("/admin/products/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Type Filter */}
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-full lg:w-[150px]">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="vape">Vapes</SelectItem>
                                <SelectItem value="puff">Puffs</SelectItem>
                                <SelectItem value="liquid">Liquids</SelectItem>
                                <SelectItem value="accessory">Accessories</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Stock Filter */}
                        <Select value={stockFilter} onValueChange={setStockFilter}>
                            <SelectTrigger className="w-full lg:w-[150px]">
                                <SelectValue placeholder="Stock" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Stock</SelectItem>
                                <SelectItem value="in">In Stock</SelectItem>
                                <SelectItem value="low">Low Stock</SelectItem>
                                <SelectItem value="out">Out of Stock</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Status Filter */}
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full lg:w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>

                        {hasActiveFilters && (
                            <Button variant="ghost" size="icon" onClick={clearFilters}>
                                <X className="h-4 w-4" />
                            </Button>
                        )}
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
                    ) : filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <p className="text-lg font-medium">No products found</p>
                            <p className="text-muted-foreground mb-4">
                                {hasActiveFilters
                                    ? "Try adjusting your filters"
                                    : "Get started by adding your first product"}
                            </p>
                            {!hasActiveFilters && (
                                <Button onClick={() => navigate("/admin/products/new")}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Product
                                </Button>
                            )}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Brand</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Cost</TableHead>
                                    <TableHead className="text-right">Profit/Unit</TableHead>
                                    <TableHead className="text-right">Total Profit</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Active</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map((product) => (
                                    <TableRow key={product.id_produit}>
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
                                            {product.puff && (
                                                <p className="text-sm text-muted-foreground">
                                                    {product.puff.nombre_bouffees} puffs
                                                </p>
                                            )}
                                        </TableCell>
                                        <TableCell>{getTypeBadge(product.type)}</TableCell>
                                        <TableCell>{product.brand || "-"}</TableCell>
                                        <TableCell className="text-right font-medium">
                                            ${product.prix?.toFixed(2) || "0.00"}
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground">
                                            ${product.cout_achat?.toFixed(2) || "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {getProfitBadge(product.prix, product.cout_achat)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {(() => {
                                                const price = product.prix || 0;
                                                const cost = product.cout_achat || 0;
                                                const stock = product.stock || 0;
                                                if (!product.prix || !product.cout_achat) return <span className="text-muted-foreground">-</span>;
                                                const totalProfit = (price - cost) * stock;
                                                return (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span className={cn(
                                                                "font-bold text-sm cursor-help",
                                                                totalProfit >= 0 ? "text-green-600" : "text-red-500"
                                                            )}>
                                                                ${totalProfit.toFixed(2)}
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="left" className="text-xs">
                                                            <p>Profit × Stock = Total</p>
                                                            <p>${(price - cost).toFixed(2)} × {stock} = ${totalProfit.toFixed(2)}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                );
                                            })()}
                                        </TableCell>
                                        <TableCell>{getStockBadge(product.stock, product.seuil_alerte)}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={product.actif || false}
                                                onCheckedChange={() =>
                                                    handleToggleActive(product.id_produit, product.actif || false)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => navigate(`/admin/products/${product.id_produit}/edit`)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => setDeleteProductId(product.id_produit)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this product? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Products;
