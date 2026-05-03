import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ShoppingCart, HelpCircle, X, Droplets } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface LiquidDetailModalProps {
    product: any;
    isOpen: boolean;
    onClose: () => void;
}

const LiquidDetailModal = ({ product, isOpen, onClose }: LiquidDetailModalProps) => {
    const { addToCart } = useCart();
    const { toast } = useToast();
    const [addingToCart, setAddingToCart] = useState(false);

    if (!product) return null;

    // Handle potential mixed English/French keys from different sources if necessary, 
    // but prioritizing French as per new schema.
    const name = product.nom || product.name;
    const price = typeof product.prix === 'number' ? `${product.prix} €` : (product.prix || product.price);
    const image = product.image_principale || product.image;
    const description = product.description;

    const handleAddToCart = () => {
        setAddingToCart(true);
        addToCart({
            name: name,
            price: price,
            image: image,
            description: description,
            puffs: "",
            flavor: product.flavor || product.specs?.liquid?.notes
        });
        toast({
            title: "Produit ajouté",
            description: `${name} a été ajouté au panier`,
        });
        setTimeout(() => setAddingToCart(false), 600);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-background p-0 gap-0">
                <div className="sticky top-0 z-50 flex justify-end p-4 bg-background/80 backdrop-blur-sm md:hidden">
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="grid md:grid-cols-2">
                    {/* Left Column: Image */}
                    <div className="p-6 md:p-8 bg-muted/10 md:border-r border-border flex flex-col justify-center">
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-border/50 shadow-inner p-8">
                            <img
                                src={image}
                                alt={name}
                                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                            />
                            {product.badge && (
                                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg shadow-primary/20">
                                    {product.badge || "Meilleure vente"}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary cursor-pointer transition-colors pt-6">
                            <HelpCircle className="w-4 h-4" />
                            <span className="underline">Une question ?</span>
                        </div>
                    </div>

                    {/* Right Column: Info & Specs */}
                    <div className="p-6 md:p-8 space-y-8 h-full overflow-y-auto max-h-[90vh]">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-primary tracking-wide uppercase">{product.brand || "Le Petit Vapoteur"}</h3>
                                <h2 className="text-3xl font-bold leading-tight">{name}</h2>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex text-yellow-500">
                                    {/* Placeholder stars */}
                                    {"★".repeat(5)}
                                </div>
                                <span className="text-muted-foreground text-sm font-medium">{product.reviews || "1046 Avis"}</span>
                                {product.teamChoice && (
                                    <span className="bg-accent/20 text-accent px-2 py-1 rounded text-xs font-bold">Choix de l'équipe</span>
                                )}
                            </div>

                            <div className="flex items-end gap-3 pt-2">
                                <span className="text-4xl font-bold text-primary">{price}</span>
                            </div>
                        </div>

                        <p className="text-muted-foreground">
                            {product.description}
                        </p>

                        <Button
                            size="lg"
                            onClick={handleAddToCart}
                            className={`w-full text-lg h-14 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(255,0,0,0.5)] hover:shadow-[0_0_30px_rgba(255,0,0,0.7)] transition-all duration-300 ${addingToCart ? 'bg-green-600 hover:bg-green-600' : ''
                                }`}
                        >
                            <AnimatePresence mode="wait">
                                {addingToCart ? (
                                    <motion.span
                                        key="added"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex items-center gap-2 font-bold"
                                    >
                                        <Check className="h-6 w-6" />
                                        Ajouté au panier !
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="add"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex items-center gap-2 font-bold"
                                    >
                                        <ShoppingCart className="h-6 w-6" />
                                        Ajouter au panier
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Button>

                        <div className="space-y-6 pt-6 border-t border-border">
                            {/* Saveurs Section */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold border-b border-border pb-2 flex items-center gap-2">
                                    <Droplets className="w-5 h-5 text-primary" />
                                    Saveurs
                                </h4>
                                <div className="grid gap-3 text-sm">
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-muted-foreground w-1/3">Notes :</span>
                                        <span className="font-medium text-right w-2/3">{product.specs?.liquid?.notes || product.flavor || "Non renseigné"}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-muted-foreground">Frais :</span>
                                        <span className="font-medium">{product.specs?.liquid?.fresh || "Non"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Informations Section */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold border-b border-border pb-2 flex items-center gap-2">
                                    <HelpCircle className="w-5 h-5 text-primary" />
                                    Informations
                                </h4>
                                <div className="grid gap-3 text-sm">
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-muted-foreground">Contenance :</span>
                                        <span className="font-medium">{product.specs?.liquid?.capacity || "10 ml"}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-muted-foreground">Type :</span>
                                        <span className="font-medium">{product.specs?.liquid?.type || "E liquide nicotiné"}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-muted-foreground">Ratio :</span>
                                        <span className="font-medium">{product.specs?.liquid?.ratio || "60 % PG / 40 % VG"}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-muted-foreground">Origine :</span>
                                        <span className="font-medium">{product.specs?.liquid?.origin || "France métropolitaine"}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LiquidDetailModal;
