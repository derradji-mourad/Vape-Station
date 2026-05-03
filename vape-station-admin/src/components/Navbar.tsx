import { Link } from "react-router-dom";
import logo from "@/assets/vape-station-logo.png";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="Vape Station Admin"
              className="h-12 w-auto group-hover:animate-glow-pulse transition-all duration-300"
            />
            <span className="font-bold text-xl hidden md:block">ADMIN DASHBOARD</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="relative text-sm font-semibold transition-all duration-300 hover:scale-110 text-primary shadow-[0_0_10px_rgba(255,0,0,0.5)]"
            >
              DASHBOARD
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
                <Button onClick={signOut} variant="outline" className="border-primary/30 hover:border-primary">
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="outline" className="border-primary/30 hover:border-primary ml-4">
                  <User className="h-5 w-5 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
