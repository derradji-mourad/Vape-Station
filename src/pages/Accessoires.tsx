import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import VaporCloud from "@/components/VaporCloud";
import ProductCard from "@/components/ProductCard";
import VapeDetailModal from "@/components/VapeDetailModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Accessoires = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const sections = [
    {
      id: "clearo",
      title: "Clearomiseurs & Résistances",
      categories: ["Clearomiseurs", "Résistances", "Réservoirs", "Drip-tips"]
    },
    {
      id: "expert",
      title: "Coin des Experts",
      categories: ["Atomiseurs", "Fils résistifs", "Coton", "Pièces"]
    },
    {
      id: "mods",
      title: "Mods & Accus",
      categories: ["Batteries", "Mods", "Accus & chargeurs"]
    },
    {
      id: "divers",
      title: "Accessoires Divers",
      categories: ["Flacons", "Rangement", "Outillage", "Divers"]
    }
  ];

  useEffect(() => {
    fetchAccessories();
  }, []);

  const fetchAccessories = async () => {
    try {
      setLoading(true);

      // Fetch products and check for sub-tables existence to exclude others
      // precise filtering to get items that are Clearomiseurs OR just simple Products (Accessories)
      // We exclude Vapes, Puffs, Liquids
      const { data, error } = await supabase
        .from('produit')
        .select(`
          *,
          clearomiseur:clearomiseur!clearomiseur_id_produit_fkey(*),
          vape:vape!vape_id_produit_fkey(id_produit),
          puff:puff!puff_id_produit_fkey(id_produit),
          liquide:liquide!liquide_id_produit_fkey(id_produit)
        `);

      if (error) throw error;

      const accessories = data?.filter(p => {
        // Exclude if it is a Vape, Puff or Liquid
        if (p.vape || p.puff || p.liquide) return false;
        return true;
      }).map(p => {
        let category = "Divers";
        const name = p.nom.toLowerCase();
        const desc = (p.description || "").toLowerCase();

        // Heuristic Categorization
        if (p.clearomiseur) category = "Clearomiseurs";
        else if (name.includes("résistance") || name.includes("coil")) category = "Résistances";
        else if (name.includes("pyrex") || name.includes("tank")) category = "Réservoirs";
        else if (name.includes("drip tip") || name.includes("embout")) category = "Drip-tips";
        else if (name.includes("atomiseur") || name.includes("rdta") || name.includes("rda") || name.includes("rta")) category = "Atomiseurs";
        else if (name.includes("fil") && name.includes("résistif")) category = "Fils résistifs";
        else if (name.includes("coton") || name.includes("cotton")) category = "Coton";
        else if (name.includes("joint") || name.includes("vis") || name.includes("service")) category = "Pièces";
        else if (name.includes("batterie") && !name.includes("mod")) category = "Batteries";
        else if (name.includes("mod ") || name.includes("box")) category = "Mods";
        else if (name.includes("accu") || name.includes("chargeur")) category = "Accus & chargeurs";
        else if (name.includes("flacon") || name.includes("bouteille")) category = "Flacons";
        else if (name.includes("pince") || name.includes("outil") || name.includes("kit")) category = "Outillage";

        const clearoData = p.clearomiseur; // Object or array depending on relation, usually object for 1:1

        return {
          id: p.id_produit,
          nom: p.nom,
          prix: p.prix,
          image_principale: p.image_principale,
          description: p.description,
          category: category,
          stock: p.stock,
          seuil_alerte: p.seuil_alerte,
          brand: "Generic", // Could infer from name
          badge: p.stock <= 5 ? "Low Stock" : null,
          detailedSpecs: clearoData ? {
            réservoir: {
              contenance: clearoData.contenance_ml ? `${clearoData.contenance_ml} ml` : "N/A",
              embout: clearoData.embout || "Standard",
              remplissage: clearoData.remplissage || "Standard"
            },
            tirage: {
              type: clearoData.tirage || "Standard",
              arrivées_d_air: clearoData.arrivee_air || "Standard",
              réglable: clearoData.airflow_reglable ? "Oui" : "Non"
            },
            format: {
              type: clearoData.format || "Clearomiseur",
              diametre: clearoData.diametre_mm ? `${clearoData.diametre_mm} mm` : undefined
            }
          } : null
        };
      }) || [];

      setProducts(accessories);
    } catch (error: any) {
      console.error("Error fetching accessories:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load accessories.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(item => item.category === category);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />

      {/* Animated Vapor Clouds Background */}
      <div className="fixed inset-0 pointer-events-none">
        <VaporCloud delay={0} size="large" className="top-10 left-10" />
        <VaporCloud delay={1.5} size="medium" className="top-1/4 right-20" />
        <VaporCloud delay={2.5} size="large" className="bottom-20 left-1/3" />
        <VaporCloud delay={1} size="small" className="top-1/2 right-1/4" />
        <VaporCloud delay={0.5} size="medium" className="bottom-10 right-10" />
      </div>

      {/* Main Content */}
      <main className="relative pt-32 pb-20 px-4 animate-fade-in">
        <div className="container mx-auto space-y-12 relative z-10">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Accessoires
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary animate-neon-flicker">
                Vape
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Découvrez notre gamme complète d'accessoires pour personnaliser et optimiser votre expérience de vape
            </p>
          </div>

          {loading ? (
            <div className="text-center text-primary animate-pulse">Loading accessories...</div>
          ) : (
            <Tabs defaultValue="clearo" className="w-full space-y-8">
              <div className="flex justify-center w-full">
                <TabsList className="grid w-full max-w-4xl grid-cols-2 md:grid-cols-4 h-auto p-1 bg-muted/50 backdrop-blur-sm border border-border/50 rounded-xl">
                  {sections.map((section) => (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      className="py-3 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-lg transition-all duration-300"
                    >
                      {section.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {sections.map((section) => (
                <TabsContent key={section.id} value={section.id} className="space-y-16 animate-fade-in">
                  {section.categories.map((category) => {
                    const categoryProducts = getProductsByCategory(category);
                    if (categoryProducts.length === 0) return null;

                    return (
                      <div key={category} className="space-y-6">
                        <div className="flex items-center gap-4">
                          <h2 className="text-2xl font-bold text-foreground pl-4 border-l-4 border-primary">
                            {category}
                          </h2>
                          <div className="h-[1px] flex-1 bg-border/50"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {categoryProducts.map((item, index) => (
                            <div
                              key={item.id || index}
                              onClick={() => {
                                setSelectedProduct(item);
                                setIsModalOpen(true);
                              }}
                              className="group relative bg-card/40 backdrop-blur-md border border-border rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 cursor-pointer flex flex-col"
                            >
                              {/* Image Area */}
                              <div className="relative aspect-square bg-white/5 p-8 flex items-center justify-center overflow-hidden border-b border-white/5">
                                <img
                                  src={item.image_principale}
                                  alt={item.nom}
                                  className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    Voir
                                  </span>
                                </div>
                              </div>

                              {/* Content Area */}
                              <div className="p-6 flex flex-col flex-grow space-y-4">
                                <div className="space-y-2">
                                  <h3 className="font-bold text-xl text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                    {item.nom}
                                  </h3>
                                  <div className="h-0.5 w-12 bg-primary/50 group-hover:w-full transition-all duration-500" />
                                </div>

                                {/* Quick Specs Summary - Visible on Card */}
                                <div className="space-y-2 text-sm text-muted-foreground flex-grow">
                                  {item.detailedSpecs ? (
                                    Object.entries(item.detailedSpecs).slice(0, 3).map(([category, specs]: [string, any]) => (
                                      <div key={category} className="flex justify-between items-center border-b border-border/30 pb-1 last:border-0">
                                        <span className="capitalize text-xs font-medium text-foreground/70">
                                          {category.replace(/_/g, ' ')}
                                        </span>
                                        <span className="text-xs truncate max-w-[120px] text-right font-semibold text-primary/80">
                                          {Object.values(specs)[0] as string}
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="line-clamp-3 text-xs italic opacity-70">{item.description}</p>
                                  )}
                                </div>

                                {/* Footer: Price & Action */}
                                <div className="pt-4 mt-auto flex items-center justify-between border-t border-border/50">
                                  <span className="text-2xl font-bold text-primary">
                                    {typeof item.prix === 'number' ? item.prix.toFixed(2) : item.prix} €
                                  </span>
                                  <Button size="sm" variant="ghost" className="group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                    Détails
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </main>

      <VapeDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Accessoires;
