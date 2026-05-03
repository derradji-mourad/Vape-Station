import { ReactNode, useRef, useEffect, useState } from 'react';

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  bgSpeed?: number;
  id?: string;
  variant?: 'primary' | 'secondary' | 'neutral';
}

const ParallaxSection = ({ 
  children, 
  className = '', 
  bgSpeed = 0.3,
  id,
  variant = 'neutral'
}: ParallaxSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollProgress = -rect.top * bgSpeed;
      setScrollOffset(scrollProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [bgSpeed]);

  const getOrbColors = () => {
    switch (variant) {
      case 'primary':
        return ['parallax-orb-primary', 'parallax-orb-secondary'];
      case 'secondary':
        return ['parallax-orb-secondary', 'parallax-orb-primary'];
      default:
        return ['parallax-orb-primary', 'parallax-orb-secondary'];
    }
  };

  const [orb1, orb2] = getOrbColors();

  return (
    <section 
      ref={sectionRef}
      id={id}
      className={`parallax-section ${className}`}
    >
      {/* Parallax grid */}
      <div 
        className="parallax-grid"
        style={{ 
          transform: `translateY(${scrollOffset * 0.2}px)`,
        }}
      />
      
      {/* Decorative orbs with parallax */}
      <div 
        className={`parallax-orb ${orb1} w-[500px] h-[500px] -top-40 -left-40`}
        style={{ 
          transform: `translate(${scrollOffset * 0.15}px, ${scrollOffset * 0.1}px)`,
        }}
      />
      <div 
        className={`parallax-orb ${orb2} w-[400px] h-[400px] -bottom-20 -right-20`}
        style={{ 
          transform: `translate(${-scrollOffset * 0.1}px, ${scrollOffset * 0.15}px)`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
};

export default ParallaxSection;
