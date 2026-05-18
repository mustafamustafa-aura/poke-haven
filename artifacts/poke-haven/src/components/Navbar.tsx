import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    { label: "Menu",                     id: "menu" },
    { label: "Stel Je Eigen Bowl Samen", id: "builder" },
    { label: "Over Ons",                 id: "about" },
  ];

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: isScrolled ? "rgba(14,22,33,0.95)" : "transparent",
        backdropFilter: isScrolled ? "blur(16px)" : "none",
        borderBottom: isScrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        padding: isScrolled ? "10px 0" : "16px 0",
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => scrollTo("")}
          className="flex items-center gap-2"
          style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
          data-testid="button-logo"
        >
          <img
            src="/logo.png"
            alt="Poke Haven"
            style={{ height: 48, width: "auto" }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
          <span className="font-display font-black tracking-tight leading-none" style={{ fontSize: 20 }}>
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

        <div className="flex items-center gap-2">
          {/* CTA */}
          <button
            onClick={() => scrollTo("builder")}
            className="font-bold text-sm px-4 py-2.5 rounded-full text-white transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ background: "#F26522", boxShadow: "0 0 16px rgba(242,101,34,0.35)", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
            data-testid="button-order-now"
          >
            Bestel Nu
          </button>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-xl"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent", background: menuOpen ? "rgba(255,255,255,0.08)" : "transparent" }}
            aria-label="Menu"
            data-testid="button-mobile-menu"
          >
            <motion.span
              className="block w-5 h-0.5 rounded-full origin-center"
              style={{ background: "#fff" }}
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
              transition={{ duration: 0.22 }}
            />
            <motion.span
              className="block w-5 h-0.5 rounded-full"
              style={{ background: "#fff" }}
              animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
              transition={{ duration: 0.18 }}
            />
            <motion.span
              className="block w-5 h-0.5 rounded-full origin-center"
              style={{ background: "#fff" }}
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
              transition={{ duration: 0.22 }}
            />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="lg:hidden overflow-hidden"
            style={{ background: "rgba(14,22,33,0.98)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-5 py-3 flex flex-col">
              {links.map((link, i) => (
                <motion.button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="text-left py-4 font-semibold text-base border-b"
                  style={{
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.06)",
                    touchAction: "manipulation",
                    WebkitTapHighlightColor: "transparent",
                  }}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.05 }}
                  data-testid={`mobile-nav-${link.id}`}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
