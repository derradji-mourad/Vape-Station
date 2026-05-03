import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
    User,
    Lock,
    Bell,
    Palette,
    Shield,
    Store,
    Save,
    Loader2,
} from "lucide-react";

const Settings = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [saving, setSaving] = useState(false);

    // Store settings
    const [storeSettings, setStoreSettings] = useState({
        storeName: "Vape Station",
        storeEmail: "contact@vapestation.dz",
        storePhone: "+213 XXX XXX XXX",
        currency: "DZD",
        lowStockThreshold: "10",
    });

    // Notification settings
    const [notifications, setNotifications] = useState({
        newOrders: true,
        lowStock: true,
        newClients: false,
        orderUpdates: true,
    });

    const handleSave = async () => {
        setSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);

        toast({
            title: "Settings saved",
            description: "Your settings have been updated successfully.",
        });
    };

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account and store preferences
                </p>
            </div>

            {/* Profile Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Profile</CardTitle>
                    </div>
                    <CardDescription>
                        Your account information
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                value={user?.email || ""}
                                disabled
                                className="bg-muted"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Input
                                value="Administrator"
                                disabled
                                className="bg-muted"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Store Settings */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Store className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Store Settings</CardTitle>
                    </div>
                    <CardDescription>
                        General store configuration
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="storeName">Store Name</Label>
                            <Input
                                id="storeName"
                                value={storeSettings.storeName}
                                onChange={(e) =>
                                    setStoreSettings({ ...storeSettings, storeName: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="storeEmail">Store Email</Label>
                            <Input
                                id="storeEmail"
                                type="email"
                                value={storeSettings.storeEmail}
                                onChange={(e) =>
                                    setStoreSettings({ ...storeSettings, storeEmail: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="storePhone">Phone Number</Label>
                            <Input
                                id="storePhone"
                                value={storeSettings.storePhone}
                                onChange={(e) =>
                                    setStoreSettings({ ...storeSettings, storePhone: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lowStock">Low Stock Threshold</Label>
                            <Input
                                id="lowStock"
                                type="number"
                                min="1"
                                value={storeSettings.lowStockThreshold}
                                onChange={(e) =>
                                    setStoreSettings({ ...storeSettings, lowStockThreshold: e.target.value })
                                }
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Notifications</CardTitle>
                    </div>
                    <CardDescription>
                        Configure when you receive notifications
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>New Orders</Label>
                                <p className="text-sm text-muted-foreground">
                                    Get notified when a new order is placed
                                </p>
                            </div>
                            <Switch
                                checked={notifications.newOrders}
                                onCheckedChange={(checked) =>
                                    setNotifications({ ...notifications, newOrders: checked })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Low Stock Alerts</Label>
                                <p className="text-sm text-muted-foreground">
                                    Alert when products fall below threshold
                                </p>
                            </div>
                            <Switch
                                checked={notifications.lowStock}
                                onCheckedChange={(checked) =>
                                    setNotifications({ ...notifications, lowStock: checked })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>New Client Registrations</Label>
                                <p className="text-sm text-muted-foreground">
                                    Notify when new clients sign up
                                </p>
                            </div>
                            <Switch
                                checked={notifications.newClients}
                                onCheckedChange={(checked) =>
                                    setNotifications({ ...notifications, newClients: checked })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Order Status Updates</Label>
                                <p className="text-sm text-muted-foreground">
                                    Track order status changes
                                </p>
                            </div>
                            <Switch
                                checked={notifications.orderUpdates}
                                onCheckedChange={(checked) =>
                                    setNotifications({ ...notifications, orderUpdates: checked })
                                }
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Security */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Security</CardTitle>
                    </div>
                    <CardDescription>
                        Manage your security settings
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button variant="outline">
                        <Lock className="h-4 w-4 mr-2" />
                        Change Password
                    </Button>
                </CardContent>
            </Card>

            {/* Appearance placeholder */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Palette className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Appearance</CardTitle>
                    </div>
                    <CardDescription>
                        Customize the dashboard appearance
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Theme settings are controlled by your system preferences.
                    </p>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Settings
                </Button>
            </div>
        </div>
    );
};

export default Settings;
