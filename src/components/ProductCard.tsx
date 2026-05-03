import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShoppingCart } from "lucide-react";

interface ProductSpecs {
  resistance?: string[];
  tank?: {
    capacity?: string;
    airflow?: string;
    airIntake?: string;
    dripTip?: string;
  };
  battery?: {
    power?: string;
    batteries?: string;
    controls?: string;
    port?: string;
  };
  format?: {
    type?: string;
    dimensions?: string;
    diameter?: string;
    weight?: string;
  };
  liquid?: {
    notes?: string;
    fresh?: string;
    capacity?: string;
    type?: string;
    ratio?: string;
    origin?: string;
  };
}

interface ProductCardProps {
  // French schema matching props
  nom: string;
  prix: string | number;
  image_principale: string;
  description: string;
  // Optional extras or mapped fields
  puffs?: string;
  flavor?: string;
  capacity?: string;
  port?: string;
  specs?: ProductSpecs;
  stock?: number;
  seuil_alerte?: number;
  onProductClick?: () => void;
}

const ProductCard = ({ nom, prix, image_principale, description, puffs, flavor, capacity, port, specs, stock, seuil_alerte, onProductClick }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  // Stock Logic
  const isOutOfStock = stock !== undefined && stock <= 0;
  const isLowStock = stock !== undefined && seuil_alerte !== undefined && stock <= seuil_alerte && stock > 0;

  // Helper to format price if it's a number
  const formattedPrice = typeof prix === 'number' ? `${prix} €` : prix;

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    console.log("[ProductCard] Add to cart clicked", { nom });
    setAddingToCart(true);
    addToCart({
      name: nom,
      price: formattedPrice,
      image: image_principale,
      description,
      puffs,
      flavor,
      capacity,
      port
    });
    toast({
      title: "Produit ajouté",
      description: `${nom} a été ajouté au panier`,
    });
    setTimeout(() => setAddingToCart(false), 600);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Card className="group relative overflow-hidden bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,0,0,0.3)]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <CardHeader>
          <CardTitle className="text-foreground group-hover:text-primary transition-colors duration-300">
            {nom}
          </CardTitle>
          <div className="absolute top-2 right-2 flex gap-2">
            {isOutOfStock && (
              <span className="bg-destructive/90 text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                Rupture
              </span>
            )}
            {isLowStock && (
              <span className="bg-orange-500/90 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,165,0,0.5)]">
                Plus que {stock} !
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div
            className="relative aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer"
            onClick={() => {
              if (onProductClick) {
                onProductClick();
              } else {
                setIsOpen(true);
              }
            }}
          >
            <img
              src={image_principale}
              alt={nom}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-primary-foreground font-semibold bg-primary/80 px-4 py-2 rounded-md">View Details</span>
            </div>
          </div>

          <p className="text-muted-foreground text-sm line-clamp-2">
            {description}
          </p>

          <div className="space-y-2">
            {puffs && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-secondary">💨 {puffs}</span>
              </div>
            )}
            {capacity && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-secondary">🫙 {capacity}</span>
              </div>
            )}
            {flavor && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-accent">🍃 {flavor}</span>
              </div>
            )}
            {port && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-accent">🔌 {port}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold text-primary animate-neon-flicker">
              {formattedPrice}
            </span>
          </div>
        </CardContent>

        <CardFooter>
          <motion.div className="w-full" whileTap={{ scale: 0.95 }}>
            <Button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock || addingToCart}
              className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(255,0,0,0.5)] hover:shadow-[0_0_30px_rgba(255,0,0,0.7)] transition-all duration-300 ${addingToCart ? 'bg-green-600 hover:bg-green-600' : ''} ${isOutOfStock ? 'opacity-50 cursor-not-allowed bg-muted hover:bg-muted text-muted-foreground shadow-none' : ''}`}
            >
              <AnimatePresence mode="wait">
                {addingToCart ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Ajouté !
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>

      <DialogContent className="bg-card border-primary/20 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">{nom}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Complete product details and specifications
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={image_principale}
                alt={nom}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {puffs && (
                <div className="flex flex-col items-center gap-2 p-3 bg-secondary/10 rounded-lg">
                  <span className="text-2xl">💨</span>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Puffs</p>
                    <p className="font-semibold text-foreground text-sm">{puffs}</p>
                  </div>
                </div>
              )}

              {capacity && (
                <div className="flex flex-col items-center gap-2 p-3 bg-secondary/10 rounded-lg">
                  <span className="text-2xl">🫙</span>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Contenance</p>
                    <p className="font-semibold text-foreground text-sm">{capacity}</p>
                  </div>
                </div>
              )}

              {flavor && (
                <div className="flex flex-col items-center gap-2 p-3 bg-accent/10 rounded-lg">
                  <span className="text-2xl">🍃</span>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Flavor</p>
                    <p className="font-semibold text-foreground text-sm">{flavor}</p>
                  </div>
                </div>
              )}

              {port && (
                <div className="flex flex-col items-center gap-2 p-3 bg-accent/10 rounded-lg">
                  <span className="text-2xl">🔌</span>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Port</p>
                    <p className="font-semibold text-foreground text-sm">{port}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center gap-2 p-3 bg-primary/10 rounded-lg">
                <span className="text-2xl">💰</span>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="font-bold text-foreground">{formattedPrice}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground text-sm">{description}</p>
            </div>

            {specs && (
              <div className="space-y-4">
                {specs.resistance && specs.resistance.length > 0 && (
                  <div className="border border-border rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <span className="text-primary">⚡</span> Résistance
                    </h4>
                    <div className="space-y-1">
                      {specs.resistance.map((res, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground">{res}</p>
                      ))}
                    </div>
                  </div>
                )}

                {specs.tank && (
                  <div className="border border-border rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <span className="text-primary">🫙</span> Clearomiseur
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {specs.tank.capacity && (
                        <div>
                          <span className="text-muted-foreground">Contenance:</span>
                          <p className="font-medium">{specs.tank.capacity}</p>
                        </div>
                      )}
                      {specs.tank.airflow && (
                        <div>
                          <span className="text-muted-foreground">Tirage:</span>
                          <p className="font-medium">{specs.tank.airflow}</p>
                        </div>
                      )}
                      {specs.tank.airIntake && (
                        <div>
                          <span className="text-muted-foreground">Arrivées d'air:</span>
                          <p className="font-medium">{specs.tank.airIntake}</p>
                        </div>
                      )}
                      {specs.tank.dripTip && (
                        <div>
                          <span className="text-muted-foreground">Embout:</span>
                          <p className="font-medium">{specs.tank.dripTip}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {specs.battery && (
                  <div className="border border-border rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <span className="text-primary">🔋</span> Batterie
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {specs.battery.power && (
                        <div>
                          <span className="text-muted-foreground">Puissance:</span>
                          <p className="font-medium">{specs.battery.power}</p>
                        </div>
                      )}
                      {specs.battery.batteries && (
                        <div>
                          <span className="text-muted-foreground">Accu(s):</span>
                          <p className="font-medium">{specs.battery.batteries}</p>
                        </div>
                      )}
                      {specs.battery.controls && (
                        <div>
                          <span className="text-muted-foreground">Réglages:</span>
                          <p className="font-medium">{specs.battery.controls}</p>
                        </div>
                      )}
                      {specs.battery.port && (
                        <div>
                          <span className="text-muted-foreground">Port:</span>
                          <p className="font-medium">{specs.battery.port}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {specs.format && (
                  <div className="border border-border rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <span className="text-primary">📐</span> Format
                    </h4>
                    <div className="space-y-1 text-sm">
                      {specs.format.type && (
                        <div>
                          <span className="text-muted-foreground">Type:</span>
                          <p className="font-medium">{specs.format.type}</p>
                        </div>
                      )}
                      {specs.format.dimensions && (
                        <div>
                          <span className="text-muted-foreground">Dimensions:</span>
                          <p className="font-medium">{specs.format.dimensions}</p>
                        </div>
                      )}
                      {specs.format.diameter && (
                        <div>
                          <span className="text-muted-foreground">Diamètre:</span>
                          <p className="font-medium">{specs.format.diameter}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <motion.div className="w-full" whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => {
                  handleAddToCart();
                  setTimeout(() => setIsOpen(false), 500);
                }}
                className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(255,0,0,0.5)] hover:shadow-[0_0_30px_rgba(255,0,0,0.7)] transition-all duration-300 ${addingToCart ? 'bg-green-600 hover:bg-green-600' : ''
                  }`}
              >
                <AnimatePresence mode="wait">
                  {addingToCart ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Ajouté !
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog >
  );
};

export default ProductCard;
