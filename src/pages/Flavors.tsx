import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import VaporCloud from "@/components/VaporCloud";
import { SectionNav } from "@/components/SectionNav";
import ProductSort from "@/components/ProductSort";
import { Card, CardContent } from "@/components/ui/card";
import LiquidDetailModal from "@/components/LiquidDetailModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Flavors = () => {
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const { toast } = useToast();

  const sections = [
    { id: 'best-sellers', label: 'Best Sellers' },
    { id: 'fruity-sweet', label: 'Fruity & Sweet' },
    { id: 'classic-gourmand', label: 'Classic & Gourmand' },
  ];

  useEffect(() => {
    fetchLiquids();
  }, []);

  const fetchLiquids = async () => {
    try {
      setLoading(true);
      // Fetch products that are liquids, including their flavor relations
      const { data, error } = await supabase
        .from('produit')
        .select(`
          *,
          liquide!liquide_id_produit_fkey(
            *,
            liquide_saveur!liquide_saveur_id_produit_fkey(
              saveur!liquide_saveur_id_saveur_fkey(nom)
            )
          )
        `)
        .not('liquide', 'is', null);

      if (error) throw error;

      const transformedData = data?.map(product => {
        const liquidData = product.liquide?.[0] || product.liquide; // Handle single/array
        // Extract flavor names from the junction table
        const flavors = liquidData?.liquide_saveur?.map((ls: any) => ls.saveur?.nom).filter(Boolean) || [];
        const flavorString = flavors.join(", ") || "Original";

        return {
          id: product.id_produit,
          nom: product.nom,
          prix: product.prix,
          image_principale: product.image_principale,
          description: product.description,
          stock: product.stock,
          seuil_alerte: product.seuil_alerte,
          brand: "Glowy Mix",
          // Liquid specific
          flavor: flavorString,
          flavorsArray: flavors, // Keep for filtering
          reviews: "4.8/5", // Mock for now
          badge: product.stock <= 5 ? "Low Stock" : null,
          specs: {
            liquid: {
              notes: flavorString,
              fresh: flavorString.toLowerCase().includes("menthe") || flavorString.toLowerCase().includes("frais") ? "Oui" : "Non",
              capacity: liquidData?.volume_ml ? `${liquidData.volume_ml} ml` : "10 ml",
              type: "E liquide",
              ratio: liquidData?.composition_pgv || "50/50",
              origin: "France"
            }
          }
        };
      }) || [];

      setProducts(transformedData);
    } catch (error: any) {
      console.error("Error fetching liquids:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load e-liquids.",
      });
    } finally {
      setLoading(false);
    }
  };

  const categorizedProducts = useMemo(() => {
    // Helper to check flavor categories
    const isClassicOrGourmand = (p: any) => {
      const f = p.flavor.toLowerCase();
      return f.includes("tabac") || f.includes("classic") || f.includes("vanille") || f.includes("caramel") || f.includes("custard") || f.includes("café") || f.includes("noisette");
    };

    const isFruityOrSweet = (p: any) => {
      const f = p.flavor.toLowerCase();
      // If it's not classic, default to fruity for now, or check specific fruits
      return !isClassicOrGourmand(p);
    };

    const bestSellers = products.slice(0, 3); // Just take first 3 as best sellers for now
    const fruitySweet = products.filter(isFruityOrSweet);
    const classicGourmand = products.filter(isClassicOrGourmand);

    return [
      {
        id: 'best-sellers',
        category: "BEST SELLERS",
        emoji: "🏆",
        color: "from-yellow-500/20 to-orange-500/5",
        products: bestSellers
      },
      {
        id: 'fruity-sweet',
        category: "FRUITY & SWEET",
        emoji: "🍓",
        color: "from-primary/20 to-primary/5",
        products: fruitySweet
      },
      {
        id: 'classic-gourmand',
        category: "CLASSIC & GOURMAND",
        emoji: "🍂",
        color: "from-amber-700/20 to-amber-500/5",
        products: classicGourmand
      }
    ];
  }, [products]);

  const sortedCategories = useMemo(() => {
    return categorizedProducts.map(category => ({
      ...category,
      products: (() => {
        const sorted = [...category.products];
        switch (sortBy) {
          case "price-asc":
            return sorted.sort((a, b) => {
              const pA = typeof a.prix === 'number' ? a.prix : parseFloat(a.prix.replace(/[^0-9.]/g, "") || "0");
              const pB = typeof b.prix === 'number' ? b.prix : parseFloat(b.prix.replace(/[^0-9.]/g, "") || "0");
              return pA - pB;
            });
          case "price-desc":
            return sorted.sort((a, b) => {
              const pA = typeof a.prix === 'number' ? a.prix : parseFloat(a.prix.replace(/[^0-9.]/g, "") || "0");
              const pB = typeof b.prix === 'number' ? b.prix : parseFloat(b.prix.replace(/[^0-9.]/g, "") || "0");
              return pB - pA;
            });
          case "name-asc":
            return sorted.sort((a, b) => a.nom.localeCompare(b.nom));
          default:
            return sorted;
        }
      })()
    }));
  }, [sortBy, categorizedProducts]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden scroll-smooth">
      <Navbar />
      <SectionNav sections={sections} />
      <div className="fixed inset-0 pointer-events-none">
        <VaporCloud delay={0} size="medium" className="top-20 left-20" />
        <VaporCloud delay={1} size="large" className="bottom-10 right-10" />
        <VaporCloud delay={2} size="small" className="top-1/2 left-1/2" />
      </div>
      <div className="pt-32 pb-20 px-4 relative z-10 animate-fade-in">
        <div className="container mx-auto space-y-16">
          <div className="text-center space-y-4" data-aos="fade-down">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">Explore<span className="text-primary"> Flavors</span></h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Discover your perfect taste sensation</p>
          </div>
          <ProductSort value={sortBy} onChange={setSortBy} />

          {loading ? (
            <div className="text-center text-primary animate-pulse">Loading flavors...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-muted-foreground">No flavors found.</div>
          ) : (
            sortedCategories.map((category, idx) => (
              category.products.length > 0 && (
                <div key={idx} id={category.id} className="space-y-6 scroll-mt-24">
                  <Card className={`bg-gradient-to-r ${category.color} border-border overflow-hidden`} data-aos="fade-right">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-4">
                        <span className="text-6xl">{category.emoji}</span>
                        <div>
                          <h2 className="text-3xl font-bold text-foreground">{category.category}</h2>
                          <p className="text-muted-foreground">{category.products.length} delicious options available</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {category.products.map((product, index) => (
                      <div key={product.id || index} data-aos="zoom-in" data-aos-delay={index * 100}>
                        <ProductCard
                          {...product}
                          onProductClick={() => {
                            setSelectedProduct(product);
                            setIsModalOpen(true);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))
          )}
        </div>
      </div>

      <LiquidDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Flavors;
