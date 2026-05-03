import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import VaporCloud from "@/components/VaporCloud";
import { SectionNav } from "@/components/SectionNav";
import ProductSort from "@/components/ProductSort";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/vape-station-logo.png";
import ParallaxSection from "@/components/ParallaxSection";
import { useMouseParallax } from "@/hooks/use-parallax";

// Static data restored from original lists
import device1 from "@/assets/vape-device-1.jpg";
import device2 from "@/assets/vape-device-2.jpg";
import device3 from "@/assets/vape-device-3.jpg";
import device4 from "@/assets/vape-device-4.jpg";

import batteryImg from "@/assets/accessories/battery-18650.jpg";
import clearomizerImg from "@/assets/accessories/clearomizer.jpg";

const allVapes = [
  { id: "1", nom: "Pod Kroma Z Innokin", prix: 41.90, image_principale: device1, description: "Le Pod Kroma Z est une cigarette électronique polyvalente.", puffs: "N/A", flavor: "N/A", category: "vape" },
  { id: "2", nom: "Neon Pulse Mod", prix: 129.99, image_principale: device2, description: "RGB lighting effects with customizable settings.", puffs: "N/A", flavor: "N/A", category: "vape" },
  { id: "3", nom: "Stealth Pod System", prix: 59.99, image_principale: device3, description: "Compact and discreet with cyan LED indicator.", puffs: "5000 Puffs", flavor: "Cool Mint", category: "puff" },
  { id: "4", nom: "Inferno Elite", prix: 149.99, image_principale: device4, description: "Chrome accents and premium vapor production.", puffs: "15000 Puffs", flavor: "Mango Peach", category: "puff" },
];

const accessories = [
  { id: "a1", nom: "Clearomiseurs", prix: 24.99, image_principale: clearomizerImg, description: "High quality tank", category: "accessory" },
  { id: "a2", nom: "Batterie 18650", prix: 9.99, image_principale: batteryImg, description: "Reliable power cell", category: "accessory" },
];

const Index = () => {
  const [sortBy, setSortBy] = useState("default");
  const { addToCart } = useCart();
  const { toast } = useToast();
  const mousePosition = useMouseParallax(0.02);

  const sortProducts = (productsArray: any[]) => {
    const sorted = [...productsArray];
    switch (sortBy) {
      case "price-asc": return sorted.sort((a, b) => a.prix - b.prix);
      case "price-desc": return sorted.sort((a, b) => b.prix - a.prix);
      case "name-asc": return sorted.sort((a, b) => a.nom.localeCompare(b.nom));
      default: return sorted;
    }
  };

  const sortedVapes = useMemo(() => sortProducts(allVapes.filter(p => p.category === "vape")), [sortBy]);
  const sortedPuffs = useMemo(() => sortProducts(allVapes.filter(p => p.category === "puff")), [sortBy]);

  // handleAddToCart is now primarily managed within ProductCard, but kept here if needed for direct calls
  // The ProductCard component will handle the logic and display its own modal/toast

  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'vapes', label: 'Vapes' },
    { id: 'puffs', label: 'Puffs' },
    { id: 'accessories', label: 'Accessories' },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden scroll-smooth">
      <Navbar />
      <SectionNav sections={sections} />
      <div className="animate-fade-in">

        <div className="fixed inset-0 pointer-events-none">
          <VaporCloud delay={0} size="large" className="top-10 left-10" />
          <VaporCloud delay={1} size="medium" className="top-1/4 right-20" />
          <VaporCloud delay={2} size="large" className="bottom-20 left-1/3" />
        </div>

        <ParallaxSection id="hero" className="min-h-screen flex items-center justify-center px-4 py-20 pt-32" variant="primary" bgSpeed={0.4}>
          <div className="container mx-auto text-center space-y-8 relative z-10">
            <div className="animate-float" style={{ transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)` }}>
              <img src={logo} alt="Vape Station" className="w-64 md:w-96 mx-auto animate-glow-pulse" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground">
              STOP SMOKING
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary animate-neon-flicker"> JUST VAPE </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"> Experience the ultimate vaping revolution with premium devices. </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link to="/vapes"><Button size="lg" className="text-lg px-8 py-6">Shop Vapes</Button></Link>
              <Link to="/flavors"><Button size="lg" variant="outline" className="text-lg px-8 py-6">Browse Flavors</Button></Link>
            </div>
          </div>
        </ParallaxSection>

        <ParallaxSection id="vapes" className="py-20 px-4 scroll-mt-20" variant="secondary" bgSpeed={0.25}>
          <div className="container mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold"> Premium <span className="text-primary">Vapes</span> </h2>
            </div>
            <ProductSort value={sortBy} onChange={setSortBy} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {sortedVapes.map((vape) => (
                <ProductCard key={vape.id} {...vape} />
              ))}
            </div>
          </div>
        </ParallaxSection>

        <ParallaxSection id="puffs" className="py-20 px-4 scroll-mt-20 bg-card/30" variant="primary" bgSpeed={0.2}>
          <div className="container mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold"> Shop by <span className="text-primary">Puff Count</span> </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {sortedPuffs.map((puff) => (
                <ProductCard key={puff.id} {...puff} />
              ))}
            </div>
          </div>
        </ParallaxSection>

        <ParallaxSection id="accessories" className="py-20 px-4 scroll-mt-20" variant="secondary" bgSpeed={0.15}>
          <div className="container mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold"> Accessoires <span className="text-primary">Vape</span> </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {sortProducts(accessories).map((accessory) => (
                <ProductCard key={accessory.id} {...accessory} />
              ))}
            </div>
          </div>
        </ParallaxSection>
      </div>
    </div>
  );
};

export default Index;
