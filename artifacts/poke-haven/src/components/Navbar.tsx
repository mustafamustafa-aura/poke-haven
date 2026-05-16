import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    if (!id) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const links = [
    { label: "Menu", id: "menu" },
    { label: "Stel Je Eigen Bowl Samen", id: "builder" },
    { label: "Over Ons", id: "about" },
  ];

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: isScrolled ? "rgba(14,22,33,0.9)" : "transparent",
        backdropFilter: isScrolled ? "blur(14px)" : "none",
        borderBottom: isScrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        padding: isScrolled ? "12px 0" : "20px 0",
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container mx-auto px-5 flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => scrollTo("")}
          className="flex items-center gap-3"
          style={{ touchAction: "manipulation" }}
          data-testid="button-logo"
        >
          <img
            src="/logo.png"
            alt="Poke Haven"
            style={{ height: 48, width: "auto" }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
          <span className="font-display font-black tracking-tight leading-none" style={{ fontSize: 22 }}>
            <span style={{ color: "#fff" }}>PO</span>
            <span style={{ color: "#59B259" }}>K</span>
            <span style={{ color: "#fff" }}>E </span>
            <span style={{ color: "#fff" }}>H</span>
            <span style={{ color: "#F26522" }}>A</span>
            <span style={{ color: "#fff" }}>VEN</span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7 font-medium text-sm">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              style={{ color: "#A0AEC0", touchAction: "manipulation" }}
              className="transition-colors duration-200 hover:text-white whitespace-nowrap"
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#A0AEC0"; }}
              data-testid={`nav-${link.id}`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* CTA */}
          <button
            onClick={() => scrollTo("builder")}
            className="font-bold text-sm px-5 py-2.5 rounded-full text-white transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ background: "#F26522", boxShadow: "0 0 16px rgba(242,101,34,0.35)", touchAction: "manipulation" }}
            data-testid="button-order-now"
          >
            Bestel Nu
          </button>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ touchAction: "manipulation" }}
            data-testid="button-mobile-menu"
          >
            {[0,1,2].map(i => (
              <span key={i} className="block w-5 h-0.5 rounded-full" style={{ background: "#fff" }} />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <motion.div
          className="lg:hidden px-5 pb-4 pt-2 flex flex-col gap-3"
          style={{ background: "rgba(14,22,33,0.97)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-left py-2 font-medium text-sm"
              style={{ color: "#A0AEC0", touchAction: "manipulation" }}
              data-testid={`mobile-nav-${link.id}`}
            >
              {link.label}
            </button>
          ))}
        </motion.div>
      )}
    </motion.header>
  );
}
