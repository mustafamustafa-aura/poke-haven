import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            className="relative h-[600px] rounded-[3rem] overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-secondary/20 mix-blend-overlay z-10" />
            <img 
              src="https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1200" 
              alt="Restaurant interior" 
              className="w-full h-full object-cover grayscale-[20%]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 text-left"
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight">
              A slice of the <span className="text-primary italic">island</span>,<br />
              right in the city.
            </h2>
            
            <p className="text-lg text-foreground/80 leading-relaxed">
              We started Poke Haven with a simple mission: to bring the authentic flavors, vibrant colors, and laid-back energy of Hawaii to your daily routine. 
            </p>
            
            <p className="text-lg text-foreground/80 leading-relaxed">
              Every bowl is crafted with sustainably sourced fish, crisp local produce, and house-made sauces that pack a punch. It's not just fast food—it's a moment of escape.
            </p>

            <div className="pt-8 grid grid-cols-2 gap-8 border-t border-border mt-8">
              <div>
                <h4 className="text-3xl font-display font-bold text-secondary mb-2">100%</h4>
                <p className="text-foreground/70 font-medium">Fresh Catch Daily</p>
              </div>
              <div>
                <h4 className="text-3xl font-display font-bold text-primary mb-2">0</h4>
                <p className="text-foreground/70 font-medium">Artificial Ingredients</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
