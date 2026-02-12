import { Link, useLocation } from "react-router-dom";
import { GraduationCap, Menu } from "lucide-react";
import { useState } from "react";
import universityLogo from "@/assets/university-logo.png";
const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [{
    path: "/",
    label: "Accueil"
  }, {
    path: "/prediction",
    label: "Prédiction"
  }, {
    path: "/dashboard",
    label: "Dashboard"
  }, {
    path: "/collective",
    label: "Collectif"
  }, {
    path: "/technical-report",
    label: "Rapport ML"
  }];
  const isActive = (path: string) => location.pathname === path;
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img alt="Université Sultan Moulay Slimane" className="h-10 w-auto object-fill" src="/lovable-uploads/90c0384c-7c0d-4789-9a84-f44b9bcb008b.png" />
          <span className="text-lg font-bold text-foreground hidden sm:inline">AR.Predict AI<span className="text-secondary">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(link => <Link key={link.path} to={link.path} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.path) ? "bg-secondary/10 text-secondary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
              {link.label}
            </Link>)}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setMobileOpen(!mobileOpen)}>
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border px-4 pb-4">
          {links.map(link => <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)} className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive(link.path) ? "bg-secondary/10 text-secondary" : "text-muted-foreground hover:text-foreground"}`}>
              {link.label}
            </Link>)}
        </div>}
    </nav>;
};
export default Navbar;