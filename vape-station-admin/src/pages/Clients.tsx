import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
    Search,
    Users,
    Loader2,
    Phone,
    MapPin,
    ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Client {
    id_client: string;
    nom: string | null;
    prenom: string | null;
    telephone: string | null;
    adresse: string | null;
    est_majeur: boolean | null;
    wilaya: {
        nom: string;
    } | null;
    orderCount?: number;
}

const Clients = () => {
    const { toast } = useToast();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("client")
                .select(`
          id_client,
          nom,
          prenom,
          telephone,
          adresse,
          est_majeur,
          wilaya:id_wilaya (nom)
        `)
                .order("nom");

            if (error) throw error;

            // Get order counts for each client
            const clientsWithOrders = await Promise.all(
                (data || []).map(async (client: any) => {
                    const { count } = await supabase
                        .from("commande")
                        .select("*", { count: "exact", head: true })
                        .eq("id_client", client.id_client);

                    return { ...client, orderCount: count || 0 };
                })
            );

            setClients(clientsWithOrders);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error fetching clients",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredClients = clients.filter((client) => {
        const searchStr = searchQuery.toLowerCase();
        const fullName = `${client.prenom || ""} ${client.nom || ""}`.toLowerCase();
        const phone = client.telephone?.toLowerCase() || "";
        return fullName.includes(searchStr) || phone.includes(searchStr);
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold">Clients</h2>
                <p className="text-muted-foreground">
                    View and manage your customer base
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-blue-500/10">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{clients.length}</p>
                                <p className="text-sm text-muted-foreground">Total Clients</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-green-500/10">
                                <ShoppingBag className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {clients.filter(c => (c.orderCount || 0) > 0).length}
                                </p>
                                <p className="text-sm text-muted-foreground">Active Buyers</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-purple-500/10">
                                <MapPin className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {new Set(clients.map(c => c.wilaya?.nom).filter(Boolean)).size}
                                </p>
                                <p className="text-sm text-muted-foreground">Wilayas Covered</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Clients Table */}
            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : filteredClients.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <p className="text-lg font-medium">No clients found</p>
                            <p className="text-muted-foreground">
                                {searchQuery
                                    ? "Try adjusting your search"
                                    : "Clients will appear here once they register"}
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Wilaya</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Orders</TableHead>
                                    <TableHead>Verified</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClients.map((client) => (
                                    <TableRow key={client.id_client}>
                                        <TableCell>
                                            <p className="font-medium">
                                                {client.prenom || ""} {client.nom || "Unknown"}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                {client.telephone || "-"}
                                            </div>
                                        </TableCell>
                                        <TableCell>{client.wilaya?.nom || "-"}</TableCell>
                                        <TableCell>
                                            <p className="max-w-[200px] truncate text-muted-foreground">
                                                {client.adresse || "-"}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={cn(
                                                    (client.orderCount || 0) > 0
                                                        ? "bg-green-500/20 text-green-700"
                                                        : "bg-gray-500/20 text-gray-700"
                                                )}
                                            >
                                                {client.orderCount || 0} orders
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={cn(
                                                    client.est_majeur
                                                        ? "bg-green-500/20 text-green-700"
                                                        : "bg-yellow-500/20 text-yellow-700"
                                                )}
                                            >
                                                {client.est_majeur ? "Verified" : "Pending"}
                                            </Badge>
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

export default Clients;
