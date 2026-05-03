import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ShoppingCart, Play, Rotate3D, HelpCircle, X, Truck, ShieldCheck, Star } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface VapeDetailModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

const VapeDetailModal = ({ product, isOpen, onClose }: VapeDetailModalProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedColor, setSelectedColor] = useState("noir");
  const [selectedVariant, setSelectedVariant] = useState("standard");
  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (!product) return null;

  const name = product.nom || product.name;
  const price = typeof product.prix === 'number' ? `${product.prix} €` : (product.prix || product.price);
  const mainImage = product.image_principale || product.image;
  const currentImage = activeImage || mainImage;
  const description = product.description;
  const capacity = product.capacity;
  const port = product.port;

  // Mock Gallery Data (in a real app, this would come from the DB)
  const galleryImages = [
    mainImage,
    "https://via.placeholder.com/500x500/e2e8f0/1e293b?text=Vue+Cote",
    "https://via.placeholder.com/500x500/e2e8f0/1e293b?text=Vue+Dessus",
  ];

  // Mock Options Data
  const colors = [
    { value: "noir", label: "Noir Graphite", class: "bg-neutral-900" },
    { value: "argent", label: "Argent Acier", class: "bg-slate-400" },
    { value: "bleu", label: "Bleu Abyssal", class: "bg-blue-700" },
  ];

  const variants = [
    { value: "standard", label: "Standard (3ml)" },
    { value: "xl", label: "XL (5ml) +2€" },
  ];

  const handleAddToCart = () => {
    setAddingToCart(true);
    addToCart({
      name: name,
      price: price,
      image: mainImage,
      description: description,
      capacity: capacity,
      port: port
    });
    toast({
      title: "Produit ajouté au panier",
      description: `${name} (${selectedColor}, ${selectedVariant}) a été ajouté`,
    });
    setTimeout(() => setAddingToCart(false), 600);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-background p-0 gap-0 border-none shadow-2xl">
        <div className="sticky top-0 z-50 flex justify-end p-4 bg-background/80 backdrop-blur-sm md:hidden">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 h-full">
          {/* LEFT COLUMN: GALLERY */}
          <div className="p-6 lg:p-10 bg-muted/20 flex flex-col gap-6">
            {/* Main Image Stage */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-border/50 shadow-sm group">
              <img
                src={currentImage}
                alt={name}
                className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-110"
              />
              <Badge className="absolute top-4 left-4 bg-green-500 hover:bg-green-600 text-white border-none shadow-lg shadow-green-500/20 px-3 py-1 text-sm font-semibold">
                En Stock
              </Badge>
              {product.badge && (
                <Badge variant="secondary" className="absolute top-4 right-4 shadow-sm">
                  {product.badge}
                </Badge>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 justify-center overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${currentImage === img
                      ? "border-primary ring-2 ring-primary/20 ring-offset-2"
                      : "border-transparent opacity-70 hover:opacity-100 hover:border-border"
                    } bg-white`}
                >
                  <img src={img} alt={`Vue ${idx + 1}`} className="w-full h-full object-contain p-2" />
                </button>
              ))}
            </div>

            {/* Media Actions */}
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <Button variant="outline" className="gap-2 h-12 hover:bg-primary/5 hover:border-primary/50 transition-colors">
                <Rotate3D className="w-4 h-4" />
                <span>Vue 360°</span>
              </Button>
              <Button variant="outline" className="gap-2 h-12 hover:bg-primary/5 hover:border-primary/50 transition-colors">
                <Play className="w-4 h-4" />
                <span>Vidéo Démo</span>
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: PRODUCT INFO */}
          <div className="p-6 lg:p-10 flex flex-col h-full overflow-y-auto max-h-[90vh]">
            {/* Brand & Title */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold tracking-wider text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
                  {product.brand || "Vaporesso"}
                </span>
                <div className="flex items-center text-yellow-400 text-sm gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium text-foreground">4.8</span>
                  <span className="text-muted-foreground">(120 avis)</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
                {name}
              </h1>

              <div className="flex items-baseline gap-4 border-b border-border/50 pb-6">
                <span className="text-4xl font-bold text-primary">{price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through decoration-red-500/50">
                    {product.originalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Options Selection */}
            <div className="space-y-6 mb-8">
              {/* Colors */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Couleur : <span className="text-muted-foreground font-normal ml-2 capitalize">{colors.find(c => c.value === selectedColor)?.label}</span></Label>
                <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex gap-3">
                  {colors.map((color) => (
                    <div key={color.value} className="relative">
                      <RadioGroupItem value={color.value} id={`color-${color.value}`} className="peer sr-only" />
                      <Label
                        htmlFor={`color-${color.value}`}
                        className={`block w-10 h-10 rounded-full cursor-pointer shadow-sm ${color.class} ring-offset-2 transition-all peer-checked:ring-2 peer-checked:ring-primary peer-hover:scale-110`}
                      />
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Variants */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Version</Label>
                <div className="flex flex-wrap gap-3">
                  {variants.map((variant) => (
                    <button
                      key={variant.value}
                      onClick={() => setSelectedVariant(variant.value)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${selectedVariant === variant.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                    >
                      {variant.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Add to Cart Action */}
            <div className="flex flex-col gap-4 mb-8">
              <Button
                size="lg"
                onClick={handleAddToCart}
                className={`w-full h-14 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 ${addingToCart ? "bg-green-600 hover:bg-green-700" : ""
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
                      <Check className="h-6 w-6" />
                      Ajouté au panier !
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart className="h-6 w-6" />
                      Ajouter au panier
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>

              <div className="flex justify-between items-center text-xs text-muted-foreground px-2">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-primary" />
                  <span>Livraison Rapide</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>Garantie 2 ans</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-primary" />
                  <span>Support 7/7</span>
                </div>
              </div>
            </div>

            {/* Collapsible Specs & Description */}
            <Accordion type="single" collapsible className="w-full" defaultValue="specs">
              <AccordionItem value="specs">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                  Caractéristiques Techniques
                </AccordionTrigger>
                <AccordionContent>
                  <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                    {product.detailedSpecs ? (
                      Object.entries(product.detailedSpecs).map(([category, specs]: [string, any]) => (
                        <div key={category} className="space-y-2">
                          <h4 className="font-semibold text-primary text-sm uppercase tracking-wide border-b border-border/50 pb-1">
                            {category.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {Object.entries(specs).map(([key, value]) => (
                              <div key={key} className="flex justify-between text-sm py-1">
                                <span className="text-muted-foreground capitalize">
                                  {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <span className="font-medium text-right">
                                  {Array.isArray(value) ? value.join(", ") : String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      // Fallback for legacy specs
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {Object.entries(product.specs || {}).map(([key, val]: [string, any]) => (
                          <div key={key}>
                            <span className="font-bold capitalize">{key}:</span> {JSON.stringify(val)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="description">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                  Description Détaillée
                </AccordionTrigger>
                <AccordionContent>
                  <div className="prose prose-sm dark:prose-invert text-muted-foreground leading-relaxed p-2">
                    <p>{description}</p>
                    <p className="mt-2">
                      Ce produit est conçu pour répondre aux exigences des vapoteurs modernes, alliant performance, esthétique et durabilité.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VapeDetailModal;
