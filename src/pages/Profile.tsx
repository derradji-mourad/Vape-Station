import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { User, Package, LogOut, Settings } from "lucide-react";

const Profile = () => {
    const { user, profile, loading, signOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate("/auth");
        }
    }, [user, loading, navigate]);

    if (loading) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-primary">Loading profile...</div>;
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-32 pb-20 px-4 container mx-auto space-y-8">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar */}
                    <div className="w-full md:w-1/4 space-y-4">
                        <Card>
                            <CardContent className="p-6 text-center space-y-4">
                                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto flex items-center justify-center text-primary">
                                    <User className="w-12 h-12" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{profile?.prenom || "User"} {profile?.nom}</h2>
                                    <p className="text-muted-foreground text-sm">{user.email}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <nav className="space-y-2">
                            <Button variant="outline" className="w-full justify-start gap-3" onClick={() => { }}>
                                <Settings className="w-4 h-4" /> Account Settings
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-3" onClick={() => { }}>
                                <Package className="w-4 h-4" /> My Orders
                            </Button>
                            <Button variant="destructive" className="w-full justify-start gap-3" onClick={() => {
                                signOut();
                                navigate("/");
                            }}>
                                <LogOut className="w-4 h-4" /> Sign Out
                            </Button>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>My Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-muted-foreground">First Name</label>
                                        <p className="text-lg">{profile?.prenom || "N/A"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                                        <p className="text-lg">{profile?.nom || "N/A"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                                        <p className="text-lg">{user.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                        <p className="text-lg">{profile?.telephone || "N/A"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-muted-foreground">Member Status</label>
                                        <p className="text-lg flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span> Active
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Orders</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>No orders yet.</p>
                                    <Button variant="link" className="text-primary" onClick={() => navigate("/vapes")}>Start Shopping</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
