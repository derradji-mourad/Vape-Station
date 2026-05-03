import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    // Login State
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Register State
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [isMajor, setIsMajor] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password: loginPassword,
            });

            if (error) throw error;

            navigate("/profile");
            toast({
                title: "Welcome back!",
                description: "You have successfully logged in.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Login failed",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isMajor) {
            toast({
                variant: "destructive",
                title: "Age verification required",
                description: "You must be 18 or older to register.",
            });
            return;
        }

        setLoading(true);

        try {
            // 1. Sign up with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: registerEmail,
                password: registerPassword,
            });

            if (authError) throw authError;

            if (authData.user) {
                // 2. Create profile in 'client' table
                const { error: profileError } = await supabase
                    .from('client')
                    .insert([
                        {
                            id_client: authData.user.id,
                            nom: lastName,
                            prenom: firstName,
                            telephone: phone,
                            est_majeur: true,
                            carte_identite_url: "pending_upload" // Placeholder for now
                        }
                    ]);

                if (profileError) {
                    // If profile creation fails, we might want to warn the user or even delete the auth user
                    // For now, let's just show an error
                    console.error("Profile creation error:", profileError);
                    toast({
                        variant: "destructive",
                        title: "Profile Error",
                        description: "Account created but profile setup failed. Please contact support.",
                    });
                } else {
                    toast({
                        title: "Account created",
                        description: "Welcome to Vape Station! You can now log in.",
                    });
                    // Auto login or switch tab? 
                    // supabase.auth.signUp with email/pass usually auto-logs on unless confirm enabled.
                    navigate("/profile");
                }
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Registration failed",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 bg-background flex items-center justify-center">
            <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-primary">Vape Station Cloud</CardTitle>
                    <CardDescription>Join our community of vapers</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="login-email">Email</Label>
                                    <Input
                                        id="login-email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="login-password">Password</Label>
                                    <Input
                                        id="login-password"
                                        type="password"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Logging in..." : "Login"}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="register">
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="first-name">First Name</Label>
                                        <Input
                                            id="first-name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last-name">Last Name</Label>
                                        <Input
                                            id="last-name"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="register-email">Email</Label>
                                    <Input
                                        id="register-email"
                                        type="email"
                                        value={registerEmail}
                                        onChange={(e) => setRegisterEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="register-password">Password</Label>
                                    <Input
                                        id="register-password"
                                        type="password"
                                        value={registerPassword}
                                        onChange={(e) => setRegisterPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="flex items-center space-x-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="major"
                                        className="checkbox checkbox-primary"
                                        checked={isMajor}
                                        onChange={(e) => setIsMajor(e.target.checked)}
                                    />
                                    <Label htmlFor="major" className="text-sm cursor-pointer">
                                        I confirm I am 18 years or older
                                    </Label>
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Creating Account..." : "Create Account"}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default Auth;
