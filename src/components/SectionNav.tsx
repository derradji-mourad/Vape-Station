import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { Link } from "react-scroll";

interface SectionNavProps {
  sections: { id: string; label: string }[];
}

export const SectionNav = ({ sections }: SectionNavProps) => {
  const activeSection = useScrollSpy(sections.map(s => s.id));

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block animate-fade-in">
      <nav className="space-y-3">
        {sections.map((section) => (
          <Link
            key={section.id}
            to={section.id}
            spy={true}
            smooth={true}
            offset={-80}
            duration={500}
            className={`group flex items-center gap-3 transition-all duration-300 cursor-pointer ${
              activeSection === section.id ? 'scale-110' : ''
            }`}
            aria-label={`Scroll to ${section.label}`}
          >
            <span
              className={`text-xs font-medium transition-all duration-300 ${
                activeSection === section.id
                  ? 'opacity-100 text-primary translate-x-0'
                  : 'opacity-0 group-hover:opacity-100 text-muted-foreground translate-x-2 group-hover:translate-x-0'
              }`}
            >
              {section.label}
            </span>
            <div
              className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                activeSection === section.id
                  ? 'border-primary bg-primary shadow-[0_0_10px_rgba(255,0,0,0.5)]'
                  : 'border-muted-foreground group-hover:border-primary group-hover:scale-125'
              }`}
            />
          </Link>
        ))}
      </nav>
    </div>
  );
};
