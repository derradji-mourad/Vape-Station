import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/vape-station-logo.png";
import { ShoppingCart, User, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
const Navbar = () => {
  const location = useLocation();
  const { totalItems } = useCart();
  const { user, isAdmin } = useAuth();
  const [cartBounce, setCartBounce] = useState(false);
  const [prevTotal, setPrevTotal] = useState(totalItems);

  useEffect(() => {
    if (totalItems > prevTotal) {
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 600);
    }
    setPrevTotal(totalItems);
  }, [totalItems, prevTotal]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="Vape Station"
              className="h-12 w-auto group-hover:animate-glow-pulse transition-all duration-300"
            />
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/"
              className={`relative text-sm font-semibold transition-all duration-300 hover:scale-110 ${isActive("/")
                ? "text-primary shadow-[0_0_10px_rgba(255,0,0,0.5)]"
                : "text-muted-foreground hover:text-foreground"
                } after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-primary after:left-0 after:bottom-0 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100`}
            >
              HOME
            </Link>
            <Link
              to="/vapes"
              className={`relative text-sm font-semibold transition-all duration-300 hover:scale-110 ${isActive("/vapes")
                ? "text-primary shadow-[0_0_10px_rgba(255,0,0,0.5)]"
                : "text-muted-foreground hover:text-foreground"
                } after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-primary after:left-0 after:bottom-0 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100`}
            >
              VAPES
            </Link>
            <Link
              to="/puffs"
              className={`relative text-sm font-semibold transition-all duration-300 hover:scale-110 ${isActive("/puffs")
                ? "text-primary shadow-[0_0_10px_rgba(255,0,0,0.5)]"
                : "text-muted-foreground hover:text-foreground"
                } after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-primary after:left-0 after:bottom-0 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100`}
            >
              PUFFS
            </Link>
            <Link
              to="/flavors"
              className={`relative text-sm font-semibold transition-all duration-300 hover:scale-110 ${isActive("/flavors")
                ? "text-primary shadow-[0_0_10px_rgba(255,0,0,0.5)]"
                : "text-muted-foreground hover:text-foreground"
                } after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-primary after:left-0 after:bottom-0 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100`}
            >
              FLAVORS
            </Link>
            <Link
              to="/accessoires"
              className={`relative text-sm font-semibold transition-all duration-300 hover:scale-110 ${isActive("/accessoires")
                ? "text-primary shadow-[0_0_10px_rgba(255,0,0,0.5)]"
                : "text-muted-foreground hover:text-foreground"
                } after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-primary after:left-0 after:bottom-0 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100`}
            >
              ACCESSOIRES
            </Link>





            <Link to={user ? "/profile" : "/auth"}>
              <Button variant="ghost" className="relative hover:bg-primary/10 hover:text-primary transition-colors">
                <User className="h-5 w-5" />
                {user && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-background"></span>
                )}
              </Button>
            </Link>

            <Link to="/cart">
              <motion.div
                animate={cartBounce ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Button variant="outline" className="relative border-primary/30 hover:border-primary">
                  <ShoppingCart className="h-5 w-5" />
                  <AnimatePresence>
                    {totalItems > 0 && (
                      <motion.span
                        key={totalItems}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(255,0,0,0.5)]"
                      >
                        {totalItems}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
