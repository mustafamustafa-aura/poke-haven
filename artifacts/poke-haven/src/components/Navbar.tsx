import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: isScrolled ? "rgba(14,22,33,0.85)" : "transparent",
        backdropFilter: isScrolled ? "blur(12px)" : "none",
        borderBottom: isScrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        padding: isScrolled ? "14px 0" : "22px 0",
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">

        {/* Logo — image + styled text fallback */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3"
          data-testid="button-logo"
        >
          <img
            src="/logo.png"
            alt="Poke Haven"
            className="h-10 w-auto"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
          {/* Text logo matching brand mark: PO + K(green) + E + space + H + A(orange) + VEN */}
          <span className="font-display font-black text-xl tracking-tight leading-none hidden sm:block">
            <span style={{ color: "#fff" }}>PO</span>
            <span style={{ color: "#59B259" }}>K</span>
            <span style={{ color: "#fff" }}>E </span>
            <span style={{ color: "#fff" }}>H</span>
            <span style={{ color: "#F26522" }}>A</span>
            <span style={{ color: "#fff" }}>VEN</span>
          </span>
        </button>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
          {[
            { label: "Menu", id: "menu" },
            { label: "Build Your Bowl", id: "builder" },
            { label: "About", id: "about" },
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="transition-colors duration-200"
              style={{ color: "#A0AEC0" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#A0AEC0"; }}
              data-testid={`nav-${link.id}`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <button
          onClick={() => scrollTo("builder")}
          className="font-bold text-sm px-5 py-2.5 rounded-full text-white transition-all duration-300 hover:scale-105 active:scale-95"
          style={{ background: "#F26522", boxShadow: "0 0 16px rgba(242,101,34,0.35)" }}
          data-testid="button-order-now"
        >
          Order Now
        </button>
      </div>
    </motion.header>
  );
}
