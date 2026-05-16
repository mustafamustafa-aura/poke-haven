import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  const title = "Fresh. Bold. Poke.".split(" ");

  const scrollToBuilder = () => {
    document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Animated Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] mix-blend-screen"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-start text-left space-y-8">
          <div className="overflow-hidden">
            <motion.h1 
              className="text-6xl md:text-8xl lg:text-9xl font-display font-black leading-[0.9] tracking-tighter"
            >
              {title.map((word, index) => (
                <motion.span
                  key={index}
                  className="inline-block mr-4"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {word === "Poke." ? <span className="text-primary">{word}</span> : word}
                </motion.span>
              ))}
            </motion.h1>
          </div>
          
          <motion.p 
            className="text-lg md:text-2xl text-foreground/80 max-w-xl font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Ocean vibes, tropical energy, and the freshest ingredients on the island. Build your perfect bowl.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg md:text-xl font-bold py-8 px-10 rounded-full shadow-[0_0_30px_rgba(255,107,71,0.3)] hover:shadow-[0_0_50px_rgba(255,107,71,0.5)] transition-all hover:scale-105"
              onClick={scrollToBuilder}
            >
              Build Your Bowl
            </Button>
          </motion.div>
        </div>

        <motion.div 
          className="relative flex justify-center items-center h-[50vh] lg:h-[80vh]"
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Decorative rotating circle behind bowl */}
          <motion.div 
            className="absolute w-[80%] h-[80%] rounded-full border border-secondary/30 border-dashed"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute w-[60%] h-[60%] rounded-full border border-primary/20 border-dashed"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />

          <motion.img
            src="/hero-bowl.png"
            alt="Delicious Poke Bowl"
            className="relative z-10 w-[90%] max-w-[600px] object-contain drop-shadow-2xl"
            animate={{
              y: [-15, 15, -15],
              rotate: [-2, 2, -2]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
