import { useCart } from "@/contexts/CartContext";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const MiniCartSummary = () => {
  const { items, totalItems } = useCart();

  if (totalItems === 0) return null;

  const totalPrice = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('€', '').replace(',', '.'));
    return sum + (price * item.quantity);
  }, 0);

  return (
    <Link to="/cart">
      <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
        <Button
          size="lg"
          className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-[0_0_30px_rgba(255,0,0,0.4)] transition-all duration-300 px-6 py-6 rounded-full"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-glow to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative flex items-center gap-3">
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-scale-in">
                {totalItems}
              </span>
            </div>
            
            <div className="flex flex-col items-start">
              <span className="text-xs opacity-90">Panier</span>
              <span className="font-bold">{totalPrice.toFixed(2)}€</span>
            </div>
          </div>
        </Button>
      </div>
    </Link>
  );
};
