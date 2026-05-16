import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/80 backdrop-blur-md py-4 border-b border-border/50 shadow-sm" 
          : "bg-transparent py-6"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div 
          className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          POKE<span className="text-primary">HAVEN</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-medium">
          <button 
            onClick={() => scrollToSection("menu")} 
            className="text-foreground/80 hover:text-primary transition-colors"
          >
            Menu
          </button>
          <button 
            onClick={() => scrollToSection("builder")} 
            className="text-foreground/80 hover:text-primary transition-colors"
          >
            Build Your Bowl
          </button>
          <button 
            onClick={() => scrollToSection("about")} 
            className="text-foreground/80 hover:text-primary transition-colors"
          >
            About
          </button>
        </nav>

        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full px-6 shadow-[0_0_20px_rgba(255,107,71,0.3)] transition-all hover:shadow-[0_0_30px_rgba(255,107,71,0.5)] hover:scale-105"
          onClick={() => scrollToSection("builder")}
        >
          Order Now
        </Button>
      </div>
    </motion.header>
  );
}
