import { CartProvider } from "@/lib/cart";
import { CartDrawer } from "@/components/CartDrawer";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { MenuSection } from "@/components/MenuSection";
import { BowlBuilder } from "@/components/BowlBuilder";
import { AboutSection } from "@/components/AboutSection";
import { Footer } from "@/components/Footer";

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans overflow-x-hidden">
        <Navbar />
        <CartDrawer />
        <main>
          <Hero />
          <MenuSection />
          <BowlBuilder />
          <AboutSection />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
