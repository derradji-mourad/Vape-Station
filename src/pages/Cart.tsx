import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import VaporCloud from "@/components/VaporCloud";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems } = useCart();
  const { toast } = useToast();
  const [orderForm, setOrderForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const price = parseFloat(item.price.replace("$", ""));
      return sum + price * item.quantity;
    }, 0);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items before placing an order",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Order Placed! 🎉",
      description: `Your order for ${totalItems} items has been received. Total: $${calculateTotal().toFixed(2)}`,
    });

    clearCart();
    setOrderForm({ name: "", email: "", phone: "", address: "" });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none">
        <VaporCloud delay={0} size="large" className="top-10 left-10" />
        <VaporCloud delay={1} size="medium" className="top-1/4 right-20" />
        <VaporCloud delay={2} size="large" className="bottom-20 left-1/3" />
      </div>

      <div className="pt-32 pb-20 px-4 relative z-10 animate-fade-in">
        <div className="container mx-auto max-w-6xl space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Your <span className="text-primary">Cart</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              {totalItems > 0 ? `${totalItems} items in your cart` : "Your cart is empty"}
            </p>
          </div>

          {items.length === 0 ? (
            <Card className="p-12 text-center bg-card/50 backdrop-blur-sm border-border">
              <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-4" />
              <p className="text-2xl text-muted-foreground mb-6">Your cart is empty</p>
              <Link to="/vapes">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(255,0,0,0.5)]">
                  Browse Products
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.name} className="bg-card/50 backdrop-blur-sm border-border">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1 space-y-2">
                          <h3 className="text-xl font-bold text-foreground">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <div className="flex gap-4 text-xs">
                            {item.puffs && <span className="text-secondary">💨 {item.puffs}</span>}
                            {item.capacity && <span className="text-secondary">🫙 {item.capacity}</span>}
                            {item.flavor && <span className="text-accent">🍃 {item.flavor}</span>}
                            {item.port && <span className="text-accent">🔌 {item.port}</span>}
                          </div>
                          <div className="flex items-center justify-between pt-4">
                            <span className="text-2xl font-bold text-primary">{item.price}</span>
                            <div className="flex items-center gap-3">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => updateQuantity(item.name, item.quantity - 1)}
                                className="h-8 w-8"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="text-lg font-semibold w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => updateQuantity(item.name, item.quantity + 1)}
                                className="h-8 w-8"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => removeFromCart(item.name)}
                                className="h-8 w-8 ml-2"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-6">
                <Card className="bg-card/50 backdrop-blur-sm border-border p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Place Order</h2>
                  <form onSubmit={handleSubmitOrder} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        required
                        value={orderForm.name}
                        onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={orderForm.email}
                        onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={orderForm.phone}
                        onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Delivery Address</Label>
                      <Input
                        id="address"
                        required
                        value={orderForm.address}
                        onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                      />
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between text-lg font-semibold mb-4">
                        <span className="text-foreground">Total:</span>
                        <span className="text-primary text-2xl">
                          ${calculateTotal().toFixed(2)}
                        </span>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(255,0,0,0.5)] hover:shadow-[0_0_30px_rgba(255,0,0,0.7)]"
                      >
                        Place Order
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
