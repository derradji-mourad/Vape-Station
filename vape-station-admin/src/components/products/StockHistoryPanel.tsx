import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Package,
    ArrowUp,
    ArrowDown,
    RefreshCw,
    ShoppingCart,
    XCircle,
    History,
    Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export type StockMovementType = "manual_update" | "order_completed" | "order_canceled";

export interface StockMovement {
    id: string;
    date: Date;
    actionType: StockMovementType;
    quantityChange: number;
    resultingStock: number;
    orderId?: number;
    note?: string;
}

interface StockHistoryPanelProps {
    productId: number;
    currentStock: number;
}

const actionConfig: Record<StockMovementType, {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
}> = {
    manual_update: {
        label: "Manual Update",
        icon: RefreshCw,
        color: "text-blue-600",
        bgColor: "bg-blue-500/10",
    },
    order_completed: {
        label: "Order Completed",
        icon: ShoppingCart,
        color: "text-green-600",
        bgColor: "bg-green-500/10",
    },
    order_canceled: {
        label: "Order Canceled",
        icon: XCircle,
        color: "text-orange-600",
        bgColor: "bg-orange-500/10",
    },
};

// Mock data generator - replace with actual Supabase query when table exists
const generateMockHistory = (productId: number, currentStock: number): StockMovement[] => {
    const movements: StockMovement[] = [];
    let stock = currentStock;
    const now = new Date();

    // Generate some sample movements going back in time
    for (let i = 0; i < 8; i++) {
        const daysAgo = i * 3 + Math.floor(Math.random() * 3);
        const date = new Date(now);
        date.setDate(date.getDate() - daysAgo);

        const actionTypes: StockMovementType[] = ["manual_update", "order_completed", "order_canceled"];
        const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)];

        let quantityChange: number;
        if (actionType === "order_completed") {
            quantityChange = -(Math.floor(Math.random() * 5) + 1);
        } else if (actionType === "order_canceled") {
            quantityChange = Math.floor(Math.random() * 3) + 1;
        } else {
            quantityChange = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 5);
        }

        movements.push({
            id: `${productId}-${i}`,
            date,
            actionType,
            quantityChange,
            resultingStock: stock,
            orderId: actionType !== "manual_update" ? 1000 + Math.floor(Math.random() * 500) : undefined,
        });

        stock -= quantityChange; // Go back in time
    }

    return movements;
};

export const StockHistoryPanel = ({ productId, currentStock }: StockHistoryPanelProps) => {
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<string>("all");

    useEffect(() => {
        // TODO: Replace with actual Supabase query when stock_movement table exists
        // For now, using mock data
        const fetchHistory = async () => {
            setLoading(true);
            try {
                // Simulate API delay
                await new Promise((resolve) => setTimeout(resolve, 500));
                const mockData = generateMockHistory(productId, currentStock);
                setMovements(mockData);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [productId, currentStock]);

    const filteredMovements = movements.filter((m) => {
        if (filterType === "all") return true;
        return m.actionType === filterType;
    });

    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <History className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">Stock History</CardTitle>
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[160px] h-8">
                            <Filter className="h-3 w-3 mr-2" />
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Actions</SelectItem>
                            <SelectItem value="manual_update">Manual Updates</SelectItem>
                            <SelectItem value="order_completed">Order Completed</SelectItem>
                            <SelectItem value="order_canceled">Order Canceled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : filteredMovements.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                            <Package className="h-8 w-8 mb-2 opacity-50" />
                            <p>No stock movements found</p>
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-border" />

                            <AnimatePresence>
                                <div className="space-y-4">
                                    {filteredMovements.map((movement, index) => {
                                        const config = actionConfig[movement.actionType];
                                        const Icon = config.icon;
                                        const isPositive = movement.quantityChange > 0;

                                        return (
                                            <motion.div
                                                key={movement.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="relative flex gap-4"
                                            >
                                                {/* Timeline dot */}
                                                <div
                                                    className={cn(
                                                        "z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                                                        config.bgColor
                                                    )}
                                                >
                                                    <Icon className={cn("h-5 w-5", config.color)} />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="font-medium text-sm">
                                                            {config.label}
                                                        </span>
                                                        <div className="flex items-center gap-1">
                                                            {isPositive ? (
                                                                <ArrowUp className="h-3 w-3 text-green-600" />
                                                            ) : (
                                                                <ArrowDown className="h-3 w-3 text-red-600" />
                                                            )}
                                                            <span
                                                                className={cn(
                                                                    "font-bold text-sm",
                                                                    isPositive ? "text-green-600" : "text-red-600"
                                                                )}
                                                            >
                                                                {isPositive ? "+" : ""}
                                                                {movement.quantityChange}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <span className="text-xs text-muted-foreground">
                                                            {format(movement.date, "MMM d, yyyy 'at' h:mm a")}
                                                        </span>
                                                        <Badge variant="outline" className="text-xs">
                                                            Stock: {movement.resultingStock}
                                                        </Badge>
                                                    </div>
                                                    {movement.orderId && (
                                                        <span className="text-xs text-muted-foreground">
                                                            Order #{movement.orderId}
                                                        </span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </AnimatePresence>
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default StockHistoryPanel;
