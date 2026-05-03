import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import VaporCloud from "@/components/VaporCloud";
import { SectionNav } from "@/components/SectionNav";
import ProductSort from "@/components/ProductSort";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import VapeDetailModal from "@/components/VapeDetailModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Puffs = () => {
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const { toast } = useToast();

  const sections = [
    { id: 'low-range', label: '5K-8K' },
    { id: 'mid-range', label: '10K-12K' },
    { id: 'high-range', label: '15K+' },
  ];

  useEffect(() => {
    fetchPuffs();
  }, []);

  const fetchPuffs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('produit')
        .select(`
          *,
          puff!puff_id_produit_fkey(*)
        `)
        .not('puff', 'is', null);

      if (error) throw error;

      const transformedData = data?.map(product => {
        const puffData = product.puff?.[0] || product.puff;
        return {
          id: product.id_produit,
          nom: product.nom,
          prix: product.prix,
          image_principale: product.image_principale,
          description: product.description,
          stock: product.stock,
          seuil_alerte: product.seuil_alerte,
          brand: "Generic", // or appropriate brand logic
          // Puff specific fields
          puffs: puffData?.nombre_bouffees ? `${puffData.nombre_bouffees} Puffs` : "N/A",
          flavor: puffData?.saveur || "Unknown Flavor",
          rawPuffs: puffData?.nombre_bouffees || 0,
          specs: {
            format: { type: puffData?.rechargeable ? "Rechargeable" : "Disposable" },
            liquid: { fresh: "Yes" } // Example
          }
        };
      }) || [];

      setProducts(transformedData);
    } catch (error: any) {
      console.error("Error fetching puffs:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load products.",
      });
    } finally {
      setLoading(false);
    }
  };

  const categorizedProducts = useMemo(() => {
    const lowRange = products.filter(p => p.rawPuffs < 10000);
    const midRange = products.filter(p => p.rawPuffs >= 10000 && p.rawPuffs < 15000);
    const highRange = products.filter(p => p.rawPuffs >= 15000);

    return [
      {
        id: 'low-range',
        range: "5000 - 8000 Puffs",
        description: "Perfect for everyday use and portability",
        icon: "💨",
        products: lowRange
      },
      {
        id: 'mid-range',
        range: "10000 - 12000 Puffs",
        description: "Extended battery life for heavy users",
        icon: "⚡",
        products: midRange
      },
      {
        id: 'high-range',
        range: "15K+ Puffs",
        description: "Maximum capacity for ultimate value",
        icon: "🔥",
        products: highRange
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
            // Safely handle number or string price
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
          case "puff-desc":
            return sorted.sort((a, b) => b.rawPuffs - a.rawPuffs);
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

      {/* Animated Vapor Clouds Background */}
      <div className="fixed inset-0 pointer-events-none">
        <VaporCloud delay={0} size="large" className="top-10 left-10" />
        <VaporCloud delay={1.5} size="medium" className="bottom-20 right-10" />
      </div>

      <div className="pt-32 pb-20 px-4 relative z-10 animate-fade-in">
        <div className="container mx-auto space-y-16">
          <div className="text-center space-y-4" data-aos="fade-down">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Shop by
              <span className="text-primary"> Puff Count</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find the perfect vape based on your usage needs
            </p>
          </div>

          <ProductSort value={sortBy} onChange={setSortBy} />

          {loading ? (
            <div className="text-center text-primary animate-pulse">Loading puffs...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-muted-foreground">No puffs found.</div>
          ) : (
            sortedCategories.map((category, idx) => (
              category.products.length > 0 && (
                <div
                  key={idx}
                  id={category.id}
                  className="space-y-8 scroll-mt-24"
                >
                  <Card className="bg-card/50 border-primary/30" data-aos="fade-right">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-3xl">
                        <span className="text-4xl">{category.icon}</span>
                        <span className="text-primary">{category.range}</span>
                      </CardTitle>
                      <p className="text-muted-foreground text-lg">{category.description}</p>
                    </CardHeader>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

      <VapeDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Puffs;
