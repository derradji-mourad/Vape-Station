import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminLayout } from "./components/layout/AdminLayout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductWizard from "./pages/ProductWizard";
import Orders from "./pages/Orders";
import Clients from "./pages/Clients";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import LowStock from "./pages/LowStock";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Auth Route */}
                <Route path="/auth" element={<Auth />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/new" element={<ProductWizard />} />
                  <Route path="products/:id/edit" element={<ProductWizard />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="clients" element={<Clients />} />
                  <Route path="statistics" element={<Statistics />} />
                  <Route path="low-stock" element={<LowStock />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Redirect root to admin */}
                <Route path="/" element={<Navigate to="/admin" replace />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
