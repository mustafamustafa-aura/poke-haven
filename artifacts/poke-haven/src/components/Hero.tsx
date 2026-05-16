import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const bowls = [
  {
    id: "haven",
    name: "Haven Speciaal",
    tagline: "Tuna, salmon, crab & avocado",
    image: "/bowl-haven-speciaal.webp",
  },
  {
    id: "garnalen",
    name: "Shrimp Deluxe",
    tagline: "Prawns, edamame & spicy mayo",
    image: "/bowl-garnalen.webp",
  },
  {
    id: "tofu",
    name: "Shoyu Tofu",
    tagline: "Crispy tofu, corn & cucumber",
    image: "/bowl-shoyu-tofu.webp",
  },
  {
    id: "vlees",
    name: "Beef Speciaal",
    tagline: "Wagyu beef, tomato & sesame",
    image: "/bowl-vlees-speciaal.webp",
  },
];

const DEBRIS = [
  { id: 1, shape: "circle", color: "#FF6B47", size: 52, top: "12%", left: "6%", delay: 0, duration: 3.8, rotateRange: 18 },
  { id: 2, shape: "leaf", color: "#9BE36A", size: 44, top: "68%", left: "4%", delay: 0.7, duration: 4.4, rotateRange: -22 },
  { id: 3, shape: "circle", color: "#9BE36A", size: 28, top: "22%", right: "8%", delay: 1.1, duration: 3.2, rotateRange: 14 },
  { id: 4, shape: "ring", color: "#FF6B47", size: 56, top: "75%", right: "6%", delay: 0.3, duration: 5.0, rotateRange: -12 },
  { id: 5, shape: "circle", color: "#F8F4EC", size: 20, top: "45%", left: "2%", delay: 1.6, duration: 3.5, rotateRange: 20 },
  { id: 6, shape: "leaf", color: "#FF6B47", size: 36, top: "50%", right: "3%", delay: 0.9, duration: 4.2, rotateRange: -16 },
];

const SPIN_EASE: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

function DebrisShape({ shape, color, size }: { shape: string; color: string; size: number }) {
  if (shape === "leaf") {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <ellipse cx="20" cy="20" rx="18" ry="10" fill={color} opacity="0.85" transform="rotate(-35 20 20)" rx="18" ry="10" />
        <line x1="20" y1="10" x2="20" y2="32" stroke={color} strokeWidth="1.5" opacity="0.5" />
      </svg>
    );
  }
  if (shape === "ring") {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="15" fill="none" stroke={color} strokeWidth="4" opacity="0.7" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="17" fill={color} opacity="0.75" />
    </svg>
  );
}

export function Hero() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [entered, setEntered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  const startAutoPlay = () => {
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % bowls.length);
    }, 4500);
  };

  useEffect(() => {
    startAutoPlay();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const go = (next: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDirection(next > index ? 1 : -1);
    setIndex(next);
    startAutoPlay();
  };

  const scrollToBuilder = () => {
    document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  const titleWords = ["Fresh.", "Bold.", "Poke."];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background pt-20">
      {/* Background blobs — z-index layer 1 */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,107,71,0.13) 0%, transparent 70%)" }}
          animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-[-5%] right-[-5%] w-[45vw] h-[45vw] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(155,227,106,0.10) 0%, transparent 70%)" }}
          animate={{ x: [0, -50, 0], y: [0, 60, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Debris layer — some go behind bowl (z5), some in front (z20) */}
      {DEBRIS.map((d, i) => (
        <motion.div
          key={d.id}
          className="absolute pointer-events-none"
          style={{
            top: d.top,
            left: (d as any).left,
            right: (d as any).right,
            zIndex: i % 2 === 0 ? 5 : 20,
          }}
          animate={{
            y: [0, -22, 0],
            rotate: [0, d.rotateRange, 0],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <DebrisShape shape={d.shape} color={d.color} size={d.size} />
        </motion.div>
      ))}

      {/* Main content grid */}
      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-[1fr_1fr] gap-12 items-center min-h-[calc(100vh-5rem)]">

        {/* Left — text, strictly left-aligned */}
        <div className="flex flex-col items-start text-left space-y-8">
          <div className="overflow-hidden">
            {titleWords.map((word, i) => (
              <motion.div
                key={word}
                className="overflow-hidden"
                initial="hidden"
                animate={entered ? "visible" : "hidden"}
              >
                <motion.span
                  className={`block font-display font-black leading-[0.88] tracking-tighter ${
                    word === "Poke."
                      ? "text-primary"
                      : "text-foreground"
                  }`}
                  style={{ fontSize: "clamp(4rem, 10vw, 9rem)" }}
                  variants={{
                    hidden: { y: "105%", opacity: 0 },
                    visible: {
                      y: 0,
                      opacity: 1,
                      transition: { duration: 0.75, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                >
                  {word}
                </motion.span>
              </motion.div>
            ))}
          </div>

          <motion.p
            className="text-lg md:text-xl text-foreground/70 max-w-md font-medium leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={entered ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            Ocean vibes, tropical energy, and the freshest ingredients on the island. Build your perfect bowl.
          </motion.p>

          <motion.div
            className="flex gap-4 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={entered ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.65 }}
          >
            <button
              onClick={scrollToBuilder}
              data-testid="button-build-bowl"
              className="px-8 py-4 rounded-full font-bold text-lg text-white transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #FF6B47, #ff4a1f)",
                boxShadow: "0 0 30px rgba(255,107,71,0.35)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 50px rgba(255,107,71,0.55)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 30px rgba(255,107,71,0.35)";
              }}
            >
              Build Your Bowl
            </button>
            <button
              onClick={scrollToMenu}
              data-testid="button-see-menu"
              className="px-8 py-4 rounded-full font-bold text-lg border-2 border-foreground/20 text-foreground/80 hover:border-primary hover:text-primary transition-all duration-300"
            >
              See Menu
            </button>
          </motion.div>

          {/* Thumbnail navigation */}
          <motion.div
            className="flex gap-3 pt-4"
            initial={{ opacity: 0 }}
            animate={entered ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            {bowls.map((bowl, i) => (
              <button
                key={bowl.id}
                onClick={() => go(i)}
                data-testid={`button-bowl-thumb-${bowl.id}`}
                className="relative w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-300"
                style={{
                  borderColor: i === index ? "#FF6B47" : "rgba(248,244,236,0.2)",
                  transform: i === index ? "scale(1.15)" : "scale(1)",
                }}
              >
                <img src={bowl.image} alt={bowl.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </motion.div>

          {/* Bowl name + tagline below thumbnails */}
          <AnimatePresence mode="wait">
            <motion.div
              key={bowls[index].id + "-label"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-1"
            >
              <p className="font-display font-bold text-xl text-foreground" data-testid="text-bowl-name">{bowls[index].name}</p>
              <p className="text-foreground/50 text-sm" data-testid="text-bowl-tagline">{bowls[index].tagline}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right — the spinning bowl product — z-index layer 2 (10) sits between debris layers */}
        <div className="relative flex justify-center items-center h-[50vh] lg:h-[80vh]" style={{ zIndex: 10 }}>
          {/* Rotating dashed rings */}
          <motion.div
            className="absolute rounded-full border border-dashed"
            style={{ width: "88%", height: "88%", borderColor: "rgba(155,227,106,0.2)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute rounded-full border border-dashed"
            style={{ width: "68%", height: "68%", borderColor: "rgba(255,107,71,0.15)" }}
            animate={{ rotate: -360 }}
            transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          />

          {/* Spin-in/out carousel */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={bowls[index].id}
              custom={direction}
              className="absolute w-[85%] max-w-[520px] flex items-center justify-center"
              style={{ zIndex: 10 }}
              variants={{
                enter: (dir: number) => ({
                  rotate: dir * 280,
                  scale: 0.5,
                  opacity: 0,
                  x: dir * 120,
                }),
                center: {
                  rotate: 0,
                  scale: 1,
                  opacity: 1,
                  x: 0,
                },
                exit: (dir: number) => ({
                  rotate: dir * -280,
                  scale: 0.4,
                  opacity: 0,
                  x: dir * -120,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                rotate: { duration: 0.9, ease: SPIN_EASE },
                scale: { duration: 0.9, ease: SPIN_EASE },
                opacity: { duration: 0.4 },
                x: { duration: 0.7, ease: SPIN_EASE },
              }}
            >
              {/* Continuous float on the centered bowl */}
              <motion.img
                src={bowls[index].image}
                alt={bowls[index].name}
                className="w-full h-full object-contain rounded-full"
                style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.5))" }}
                animate={{ y: [-14, 14, -14] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                data-testid={`img-hero-bowl-${bowls[index].id}`}
              />
            </motion.div>
          </AnimatePresence>

          {/* Next / Prev arrows */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center border border-foreground/20 text-foreground/60 hover:border-primary hover:text-primary transition-all z-30 bg-background/40 backdrop-blur-sm"
            onClick={() => go((index - 1 + bowls.length) % bowls.length)}
            data-testid="button-bowl-prev"
          >
            &#8592;
          </button>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center border border-foreground/20 text-foreground/60 hover:border-primary hover:text-primary transition-all z-30 bg-background/40 backdrop-blur-sm"
            onClick={() => go((index + 1) % bowls.length)}
            data-testid="button-bowl-next"
          >
            &#8594;
          </button>
        </div>
      </div>
    </section>
  );
}
