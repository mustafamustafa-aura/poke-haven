import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Menu data (from PDF — Haven Poke menu) ─────────────────────────────── */
const CATEGORIES = [
  {
    id: "signature",
    label: "Signature Bowls",
    items: [
      {
        id: "haven-speciaal",
        name: "Haven Speciaal",
        price: "€16.50",
        image: "/bowl-haven-speciaal.webp",
        tag: "Chef's Pick",
        tagColor: "#FF6B47",
        desc: "Tuna, salmon, crab surimi, avocado, tobiko, seaweed salad, sesame seeds",
        cal: "620 kcal",
      },
      {
        id: "garnalen",
        name: "Poke Garnalen",
        price: "€15.50",
        image: "/bowl-garnalen.webp",
        tag: "Popular",
        tagColor: "#9BE36A",
        desc: "King prawns, edamame, radish, red onion, seaweed salad, spicy mayo",
        cal: "540 kcal",
      },
      {
        id: "shoyu-tofu",
        name: "Shoyu Tofu",
        price: "€13.50",
        image: "/bowl-shoyu-tofu.webp",
        tag: "Vegan",
        tagColor: "#9BE36A",
        desc: "Crispy tofu, sweetcorn, cucumber, avocado, cherry tomato, shoyu dressing",
        cal: "480 kcal",
      },
      {
        id: "vlees-speciaal",
        name: "Vlees Speciaal",
        price: "€17.50",
        image: "/bowl-vlees-speciaal.webp",
        tag: "New",
        tagColor: "#FF6B47",
        desc: "Marinated beef strips, cherry tomato, bell pepper, red onion, carrot, sesame",
        cal: "680 kcal",
      },
    ],
  },
  {
    id: "classic",
    label: "Classic Bowls",
    items: [
      {
        id: "ahi-tuna",
        name: "Ahi Tuna",
        price: "€14.50",
        image: "/bowl-haven-speciaal.webp",
        tag: null,
        tagColor: "",
        desc: "Yellowfin tuna, sweet onion, cucumber, edamame, shoyu ponzu",
        cal: "490 kcal",
      },
      {
        id: "salmon-classic",
        name: "Atlantic Salmon",
        price: "€14.50",
        image: "/bowl-garnalen.webp",
        tag: "Bestseller",
        tagColor: "#FF6B47",
        desc: "Fresh salmon, mango, avocado, crispy onion, sesame ginger sauce",
        cal: "560 kcal",
      },
      {
        id: "spicy-tuna",
        name: "Spicy Tuna",
        price: "€14.50",
        image: "/bowl-haven-speciaal.webp",
        tag: null,
        tagColor: "",
        desc: "Spicy marinated tuna, jalapeño, spring onion, sriracha mayo, tobiko",
        cal: "510 kcal",
      },
      {
        id: "chicken-teriyaki",
        name: "Chicken Teriyaki",
        price: "€13.00",
        image: "/bowl-vlees-speciaal.webp",
        tag: null,
        tagColor: "",
        desc: "Teriyaki chicken, pineapple, edamame, cucumber, teriyaki glaze",
        cal: "520 kcal",
      },
    ],
  },
  {
    id: "drinks",
    label: "Drinks & Sides",
    items: [
      {
        id: "mango-lemonade",
        name: "Mango Lemonade",
        price: "€4.00",
        image: "/bowl-garnalen.webp",
        tag: "Favourite",
        tagColor: "#9BE36A",
        desc: "Fresh mango, lemon juice, sparkling water, mint",
        cal: "120 kcal",
      },
      {
        id: "coconut-water",
        name: "Coconut Water",
        price: "€3.50",
        image: "/bowl-shoyu-tofu.webp",
        tag: null,
        tagColor: "",
        desc: "100% natural coconut water, chilled",
        cal: "65 kcal",
      },
      {
        id: "edamame",
        name: "Edamame",
        price: "€3.50",
        image: "/bowl-shoyu-tofu.webp",
        tag: "Vegan",
        tagColor: "#9BE36A",
        desc: "Steamed edamame with sea salt and sesame oil",
        cal: "140 kcal",
      },
      {
        id: "miso-soup",
        name: "Miso Soup",
        price: "€3.00",
        image: "/bowl-shoyu-tofu.webp",
        tag: null,
        tagColor: "",
        desc: "Traditional white miso, tofu, wakame, spring onion",
        cal: "80 kcal",
      },
    ],
  },
];

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.08 } } },
  item: {
    initial: { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  },
};

export function MenuSection() {
  const [activeCat, setActiveCat] = useState("signature");
  const cat = CATEGORIES.find((c) => c.id === activeCat)!;

  return (
    <section id="menu" className="py-28 relative overflow-hidden" style={{ background: "hsl(210 45% 12%)" }}>
      {/* Subtle background glow */}
      <div
        className="absolute top-0 right-0 w-[40vw] h-[40vw] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(155,227,106,0.05) 0%, transparent 70%)" }}
      />

      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "#FF6B47" }}>
            Our Menu
          </p>
          <h2
            className="font-display font-black text-foreground tracking-tight leading-none"
            style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
          >
            Fresh Every Day
          </h2>
          <p className="text-foreground/45 text-lg mt-4 max-w-lg">
            Every bowl is crafted to order with the freshest catch and seasonal produce.
          </p>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          className="flex gap-2 mb-12 flex-wrap"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              data-testid={`tab-menu-${c.id}`}
              className="px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300"
              style={{
                background: activeCat === c.id ? "#FF6B47" : "rgba(248,244,236,0.06)",
                color: activeCat === c.id ? "#fff" : "rgba(248,244,236,0.55)",
                border: `1px solid ${activeCat === c.id ? "#FF6B47" : "rgba(248,244,236,0.1)"}`,
              }}
            >
              {c.label}
            </button>
          ))}
        </motion.div>

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCat}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
            variants={stagger.container}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0 }}
          >
            {cat.items.map((item) => (
              <motion.div
                key={item.id}
                variants={stagger.item}
                data-testid={`card-menu-${item.id}`}
                className="group relative rounded-2xl overflow-hidden cursor-pointer flex flex-col"
                style={{
                  background: "hsl(210 51% 11%)",
                  border: "1px solid rgba(248,244,236,0.07)",
                }}
                whileHover={{
                  y: -6,
                  boxShadow: "0 20px 44px -10px rgba(255,107,71,0.16)",
                  borderColor: "rgba(255,107,71,0.3)",
                }}
                transition={{ duration: 0.25 }}
              >
                {/* Bowl image — hover: scale 10% + rotate ~7° */}
                <div className="relative aspect-square bg-foreground/5 flex items-center justify-center overflow-hidden p-3">
                  <motion.img
                    src={item.image}
                    alt={item.name}
                    className="w-[82%] h-[82%] object-cover rounded-full"
                    style={{ filter: "drop-shadow(0 10px 24px rgba(0,0,0,0.45))" }}
                    whileHover={{ scale: 1.1, rotate: 7 }}
                    transition={{ duration: 0.38, ease: [0.34, 1.56, 0.64, 1] }}
                    data-testid={`img-menu-${item.id}`}
                  />
                  {/* Tag badge */}
                  {item.tag && (
                    <div
                      className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: item.tagColor + "22",
                        color: item.tagColor,
                        border: `1px solid ${item.tagColor}44`,
                      }}
                      data-testid={`badge-${item.id}`}
                    >
                      {item.tag}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-1.5">
                    <h3 className="font-display font-bold text-base text-foreground leading-tight pr-2">
                      {item.name}
                    </h3>
                    <span className="font-bold text-sm shrink-0" style={{ color: "#FF6B47" }}>
                      {item.price}
                    </span>
                  </div>

                  <p className="text-foreground/40 text-xs leading-relaxed mb-1 flex-1">{item.desc}</p>
                  <p className="text-foreground/25 text-xs mb-4">{item.cal}</p>

                  {/* Add to Order — lime green, high contrast on hover */}
                  <motion.button
                    className="w-full py-2.5 rounded-full font-bold text-xs transition-all duration-300"
                    style={{
                      background: "rgba(155,227,106,0.1)",
                      color: "#9BE36A",
                      border: "1px solid rgba(155,227,106,0.22)",
                    }}
                    whileHover={{
                      background: "#9BE36A",
                      color: "#0D1B2A",
                      boxShadow: "0 0 18px rgba(155,227,106,0.3)",
                      scale: 1.02,
                    }}
                    whileTap={{ scale: 0.96 }}
                    data-testid={`button-add-${item.id}`}
                  >
                    Add to Order
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Extended menu note */}
        <motion.div
          className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-2xl"
          style={{ background: "rgba(255,107,71,0.07)", border: "1px solid rgba(255,107,71,0.15)" }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div>
            <h3 className="font-display font-bold text-2xl text-foreground mb-1">All bowls are customisable</h3>
            <p className="text-foreground/50 text-sm max-w-md">
              Choose your base (white rice, brown rice, mixed greens, or zoodles), protein, toppings, and sauce. Starting from €12.50.
            </p>
          </div>
          <button
            onClick={() => document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" })}
            data-testid="button-build-from-menu"
            className="shrink-0 px-7 py-3.5 rounded-full font-bold text-base text-white transition-all duration-300 hover:scale-105"
            style={{ background: "linear-gradient(135deg,#FF6B47,#e8381a)", boxShadow: "0 0 22px rgba(255,107,71,0.3)" }}
          >
            Build Your Own
          </button>
        </motion.div>
      </div>
    </section>
  );
}
