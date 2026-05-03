import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import VaporCloud from "@/components/VaporCloud";
import ProductSort from "@/components/ProductSort";
import VapeDetailModal from "@/components/VapeDetailModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Vapes = () => {
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchVapes();
  }, []);

  const fetchVapes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('produit')
        .select(`
          *,
          vape!vape_id_produit_fkey(*, marque:id_marque(*))
        `)
        .not('vape', 'is', null); // Only fetch products that have a vape entry

      if (error) throw error;

      // Transform data to match ProductCard props
      const transformedData = data?.map(product => {
        const vapeData = product.vape?.[0] || product.vape; // Handle array or object return

        return {
          id: product.id_produit,
          nom: product.nom,
          prix: product.prix,
          image_principale: product.image_principale,
          description: product.description,
          stock: product.stock,
          seuil_alerte: product.seuil_alerte,
          brand: vapeData?.marque?.nom || "Unknown",
          badge: product.stock <= 5 ? "Low Stock" : null,
          // Map Vape specs
          capacity: vapeData?.capacite_reservoir_ml ? `${vapeData.capacite_reservoir_ml} ml` : "N/A",
          port: "USB-C", // Default or fetch if available
          puffs: null,
          flavor: null,
          specs: {
            battery: {
              power: vapeData?.puissance_watt ? `${vapeData.puissance_watt}W` : undefined,
              batteries: vapeData?.capacite_batterie_mah ? `${vapeData.capacite_batterie_mah} mAh` : undefined,
            },
            tank: {
              capacity: vapeData?.capacite_reservoir_ml ? `${vapeData.capacite_reservoir_ml} ml` : undefined,
              airflow: vapeData?.airflow_reglable ? "Réglable" : "Fixe",
            }
          }
        };
      }) || [];

      setProducts(transformedData);
    } catch (error: any) {
      console.error("Error fetching vapes:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load products. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const keyForPrice = (p: any) => typeof p.prix === 'number' ? p.prix : parseFloat(p.prix.replace(/[^0-9.]/g, ""));

  const sortedVapes = useMemo(() => {
    const sorted = [...products];

    switch (sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => keyForPrice(a) - keyForPrice(b));
      case "price-desc":
        return sorted.sort((a, b) => keyForPrice(b) - keyForPrice(a));
      case "name-asc":
        return sorted.sort((a, b) => a.nom.localeCompare(b.nom));
      default:
        return sorted;
    }
  }, [sortBy, products]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      <div className="fixed inset-0 pointer-events-none">
        <VaporCloud delay={0} size="large" className="top-10 left-10" />
        <VaporCloud delay={1} size="medium" className="top-1/4 right-20" />
        <VaporCloud delay={2} size="large" className="bottom-20 left-1/3" />
      </div>
      <div className="pt-32 pb-20 px-4 relative z-10 animate-fade-in">
        <div className="container mx-auto space-y-12">
          <div className="text-center space-y-4" data-aos="fade-down">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">Premium<span className="text-primary"> Vapes</span></h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Explore our complete collection of cutting-edge vaping devices</p>
          </div>
          <ProductSort value={sortBy} onChange={setSortBy} />

          {loading ? (
            <div className="text-center text-primary animate-pulse">Loading premium devices...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-muted-foreground">No vapes found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {sortedVapes.map((vape, index) => (
                <div key={vape.id || index} data-aos="zoom-in" data-aos-delay={index * 100}>
                  <ProductCard
                    {...vape}
                    onProductClick={() => {
                      setSelectedProduct(vape);
                      setIsModalOpen(true);
                    }}
                  />
                </div>
              ))}
            </div>
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

export default Vapes;
