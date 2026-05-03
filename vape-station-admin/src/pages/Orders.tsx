import { useState, useEffect } from "react";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
    Search,
    ShoppingCart,
    Loader2,
    Eye,
    Package,
    User,
    MapPin,
    Calendar,
    TrendingUp,
    TrendingDown,
    Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface Order {
    id_commande: number;
    statut: string;
    created_at: string;
    client: {
        nom: string | null;
        prenom: string | null;
        telephone: string | null;
        adresse: string | null;
        wilaya: {
            nom: string;
        } | null;
    } | null;
}

interface OrderDetail {
    order: Order;
    items: {
        id_ligne: number;
        quantite: number;
        prix_unitaire: number;
        cout_achat: number | null;
        produit: {
            nom: string;
            image_principale: string;
            cout_achat: number | null;
        };
    }[];
}

const statusOptions = [
    { value: "En_attente", label: "Pending", color: "bg-yellow-500/20 text-yellow-700" },
    { value: "Validee", label: "Validated", color: "bg-blue-500/20 text-blue-700" },
    { value: "Terminee", label: "Completed", color: "bg-green-500/20 text-green-700" },
    { value: "Annulee", label: "Cancelled", color: "bg-red-500/20 text-red-700" },
];

const Orders = () => {
    const { toast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [wilayas, setWilayas] = useState<{ id_wilaya: number; nom: string }[]>([]);
    const [wilayaFilter, setWilayaFilter] = useState("all");

    useEffect(() => {
        fetchOrders();
        fetchWilayas();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("commande")
                .select(`
          id_commande,
          statut,
          created_at,
          client:id_client (
            nom,
            prenom,
            telephone,
            adresse,
            wilaya:id_wilaya (nom)
          )
        `)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error fetching orders",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchWilayas = async () => {
        const { data } = await supabase.from("wilaya").select("*").order("nom");
        setWilayas(data || []);
    };

    const fetchOrderDetail = async (orderId: number) => {
        setLoadingDetail(true);
        try {
            const order = orders.find(o => o.id_commande === orderId);
            if (!order) return;

            // Fetch order items - need to get through panier
            const { data: orderData } = await supabase
                .from("commande")
                .select("id_panier")
                .eq("id_commande", orderId)
                .single();

            if (orderData?.id_panier) {
                const { data: items } = await supabase
                    .from("ligne_panier")
                    .select(`
            id_ligne,
            quantite,
            prix_unitaire,
            produit:id_produit (
              nom,
              image_principale,
              cout_achat
            )
          `)
                    .eq("id_panier", orderData.id_panier);

                setSelectedOrder({
                    order,
                    items: (items || []).map((item: any) => ({
                        ...item,
                        cout_achat: item.produit?.cout_achat || null,
                        produit: item.produit || { nom: "Unknown Product", image_principale: "", cout_achat: null }
                    })),
                });
            } else {
                setSelectedOrder({ order, items: [] });
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error fetching order details",
                description: error.message,
            });
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!selectedOrder) return;
        setUpdatingStatus(true);

        try {
            const { error } = await supabase
                .from("commande")
                .update({ statut: newStatus as any })
                .eq("id_commande", selectedOrder.order.id_commande);

            if (error) throw error;

            // Update local state
            setOrders(orders.map(o =>
                o.id_commande === selectedOrder.order.id_commande
                    ? { ...o, statut: newStatus }
                    : o
            ));
            setSelectedOrder({
                ...selectedOrder,
                order: { ...selectedOrder.order, statut: newStatus }
            });

            toast({
                title: "Status updated",
                description: `Order #${selectedOrder.order.id_commande} is now ${statusOptions.find(s => s.value === newStatus)?.label}`,
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error updating status",
                description: error.message,
            });
        } finally {
            setUpdatingStatus(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        // Search filter
        const clientName = `${order.client?.prenom || ""} ${order.client?.nom || ""}`.toLowerCase();
        if (searchQuery && !clientName.includes(searchQuery.toLowerCase()) &&
            !order.id_commande.toString().includes(searchQuery)) {
            return false;
        }
        // Status filter
        if (statusFilter !== "all" && order.statut !== statusFilter) {
            return false;
        }
        // Wilaya filter
        if (wilayaFilter !== "all" && order.client?.wilaya?.nom !== wilayaFilter) {
            return false;
        }
        return true;
    });

    const getStatusBadge = (status: string) => {
        const statusConfig = statusOptions.find(s => s.value === status);
        return (
            <Badge className={cn(statusConfig?.color || "bg-gray-500/20 text-gray-700")}>
                {statusConfig?.label || status}
            </Badge>
        );
    };

    const getOrderTotal = (items: OrderDetail["items"]) => {
        return items.reduce((sum, item) => sum + (item.prix_unitaire || 0) * (item.quantite || 1), 0);
    };

    const getOrderCost = (items: OrderDetail["items"]) => {
        return items.reduce((sum, item) => {
            const cost = item.cout_achat || item.produit?.cout_achat || 0;
            return sum + cost * (item.quantite || 1);
        }, 0);
    };

    const getOrderProfit = (items: OrderDetail["items"]) => {
        const revenue = getOrderTotal(items);
        const cost = getOrderCost(items);
        return revenue - cost;
    };

    const getProfitabilityBadge = (profit: number) => {
        if (profit > 0) {
            return (
                <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Profitable
                </Badge>
            );
        }
        if (profit < 0) {
            return (
                <Badge variant="destructive">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    Loss
                </Badge>
            );
        }
        return (
            <Badge className="bg-gray-500/20 text-gray-700">
                <Minus className="h-3 w-3 mr-1" />
                Zero Profit
            </Badge>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold">Orders</h2>
                <p className="text-muted-foreground">
                    Manage and track customer orders
                </p>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by order ID or client name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full lg:w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                {statusOptions.map(status => (
                                    <SelectItem key={status.value} value={status.value}>
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={wilayaFilter} onValueChange={setWilayaFilter}>
                            <SelectTrigger className="w-full lg:w-[180px]">
                                <SelectValue placeholder="Wilaya" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Wilayas</SelectItem>
                                {wilayas.map(wilaya => (
                                    <SelectItem key={wilaya.id_wilaya} value={wilaya.nom}>
                                        {wilaya.nom}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <ShoppingCart className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <p className="text-lg font-medium">No orders found</p>
                            <p className="text-muted-foreground">
                                {searchQuery || statusFilter !== "all" || wilayaFilter !== "all"
                                    ? "Try adjusting your filters"
                                    : "Orders will appear here once customers place them"}
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Wilaya</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order.id_commande}>
                                        <TableCell className="font-medium">
                                            #{order.id_commande}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {order.client?.prenom || ""} {order.client?.nom || "Unknown"}
                                                </p>
                                                {order.client?.telephone && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {order.client.telephone}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {order.client?.wilaya?.nom || "-"}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(order.statut)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => fetchOrderDetail(order.id_commande)}
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Order Detail Dialog */}
            <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            Order #{selectedOrder?.order.id_commande}
                        </DialogTitle>
                    </DialogHeader>

                    {loadingDetail ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : selectedOrder && (
                        <div className="space-y-6">
                            {/* Client Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <User className="h-4 w-4" />
                                        <span className="text-sm">Client</span>
                                    </div>
                                    <p className="font-medium">
                                        {selectedOrder.order.client?.prenom}{" "}
                                        {selectedOrder.order.client?.nom}
                                    </p>
                                    {selectedOrder.order.client?.telephone && (
                                        <p className="text-sm text-muted-foreground">
                                            {selectedOrder.order.client.telephone}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        <span className="text-sm">Delivery Address</span>
                                    </div>
                                    <p className="font-medium">
                                        {selectedOrder.order.client?.adresse || "Not provided"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedOrder.order.client?.wilaya?.nom || ""}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-sm">Order Date</span>
                                    </div>
                                    <p className="font-medium">
                                        {new Date(selectedOrder.order.created_at).toLocaleString()}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Package className="h-4 w-4" />
                                        <span className="text-sm">Status</span>
                                    </div>
                                    <Select
                                        value={selectedOrder.order.statut}
                                        onValueChange={handleStatusChange}
                                        disabled={updatingStatus}
                                    >
                                        <SelectTrigger className="w-[150px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map(status => (
                                                <SelectItem key={status.value} value={status.value}>
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h4 className="font-medium mb-3">Order Items</h4>
                                {selectedOrder.items.length > 0 ? (
                                    <div className="space-y-3">
                                        {selectedOrder.items.map((item) => (
                                            <div
                                                key={item.id_ligne}
                                                className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                                            >
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                                                    {item.produit.image_principale ? (
                                                        <img
                                                            src={item.produit.image_principale}
                                                            alt={item.produit.nom}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package className="h-5 w-5 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium">{item.produit.nom}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Qty: {item.quantite} × ${item.prix_unitaire?.toFixed(2)}
                                                    </p>
                                                </div>
                                                <p className="font-medium">
                                                    ${((item.prix_unitaire || 0) * (item.quantite || 1)).toFixed(2)}
                                                </p>
                                            </div>
                                        ))}

                                        {/* Order Financial Summary */}
                                        <div className="pt-3 mt-3 border-t space-y-2">
                                            {/* Revenue */}
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Order Revenue</span>
                                                <span className="font-medium">
                                                    ${getOrderTotal(selectedOrder.items).toFixed(2)}
                                                </span>
                                            </div>
                                            {/* Cost */}
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Order Cost</span>
                                                <span className="font-medium text-muted-foreground">
                                                    ${getOrderCost(selectedOrder.items).toFixed(2)}
                                                </span>
                                            </div>
                                            {/* Net Profit */}
                                            <div className="flex items-center justify-between pt-2 border-t">
                                                <span className="font-medium">Net Profit</span>
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        "text-lg font-bold",
                                                        getOrderProfit(selectedOrder.items) >= 0
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    )}>
                                                        ${getOrderProfit(selectedOrder.items).toFixed(2)}
                                                    </span>
                                                    {getProfitabilityBadge(getOrderProfit(selectedOrder.items))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-center py-4">
                                        No items found for this order
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Orders;
