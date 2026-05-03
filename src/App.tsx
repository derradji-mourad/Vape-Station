import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { MiniCartSummary } from "@/components/MiniCartSummary";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { ScrollToTop } from "./components/ScrollToTop";
import { PageTransition } from "./components/PageTransition";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import Vapes from "./pages/Vapes";
import Puffs from "./pages/Puffs";
import Flavors from "./pages/Flavors";
import Accessoires from "./pages/Accessoires";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/vapes" element={<PageTransition><Vapes /></PageTransition>} />
        <Route path="/puffs" element={<PageTransition><Puffs /></PageTransition>} />
        <Route path="/flavors" element={<PageTransition><Flavors /></PageTransition>} />
        <Route path="/accessoires" element={<PageTransition><Accessoires /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />


        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out-cubic',
      once: true,
      mirror: false,
      offset: 100,
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <ScrollToTop />
              <Toaster />
              <Sonner />
              <AnimatedRoutes />
              <MiniCartSummary />
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
