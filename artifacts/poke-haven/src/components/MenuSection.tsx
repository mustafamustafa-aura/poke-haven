import { motion } from "framer-motion";

const bowls = [
  {
    id: "haven-speciaal",
    name: "Haven Speciaal",
    price: "$16.99",
    image: "/bowl-haven-speciaal.webp",
    ingredients: "Tuna, Salmon, Crab, Avocado, Tobiko, Sesame",
    tag: "Chef's Pick",
  },
  {
    id: "garnalen",
    name: "Shrimp Deluxe",
    price: "$15.49",
    image: "/bowl-garnalen.webp",
    ingredients: "Prawns, Edamame, Radish, Seaweed, Spicy Mayo",
    tag: "Popular",
  },
  {
    id: "shoyu-tofu",
    name: "Shoyu Tofu",
    price: "$13.49",
    image: "/bowl-shoyu-tofu.webp",
    ingredients: "Crispy Tofu, Corn, Cucumber, Avocado, Sesame",
    tag: "Vegan",
  },
  {
    id: "vlees-speciaal",
    name: "Beef Speciaal",
    price: "$17.99",
    image: "/bowl-vlees-speciaal.webp",
    ingredients: "Wagyu Beef, Cherry Tomato, Bell Pepper, Shoyu",
    tag: "New",
  },
];

const TAG_COLORS: Record<string, string> = {
  "Chef's Pick": "#FF6B47",
  Popular: "#9BE36A",
  Vegan: "#9BE36A",
  New: "#FF6B47",
};

export function MenuSection() {
  return (
    <section id="menu" className="py-28" style={{ background: "hsl(210 45% 13%)" }}>
      <div className="container mx-auto px-6">
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#FF6B47" }}>
            Our Menu
          </p>
          <h2
            className="font-display font-black leading-none tracking-tight text-foreground"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            Signature Bowls
          </h2>
          <p className="text-foreground/50 text-lg mt-4 max-w-xl">
            Crafted by our chefs for the perfect flavor balance, every single time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bowls.map((bowl, index) => (
            <motion.div
              key={bowl.id}
              data-testid={`card-bowl-${bowl.id}`}
              className="group relative rounded-3xl overflow-hidden cursor-pointer"
              style={{
                background: "hsl(210 51% 11%)",
                border: "1px solid rgba(248,244,236,0.08)",
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{
                y: -8,
                boxShadow: "0 24px 48px -12px rgba(255,107,71,0.18)",
                borderColor: "rgba(255,107,71,0.35)",
              }}
            >
              {/* Tag */}
              {bowl.tag && (
                <div
                  className="absolute top-4 left-4 z-10 text-xs font-bold px-3 py-1 rounded-full"
                  style={{
                    background: TAG_COLORS[bowl.tag] + "22",
                    color: TAG_COLORS[bowl.tag],
                    border: `1px solid ${TAG_COLORS[bowl.tag]}44`,
                  }}
                  data-testid={`badge-bowl-${bowl.id}`}
                >
                  {bowl.tag}
                </div>
              )}

              {/* Bowl image with hover scale + rotate */}
              <div className="relative aspect-square overflow-hidden bg-foreground/5 flex items-center justify-center p-4">
                <motion.img
                  src={bowl.image}
                  alt={bowl.name}
                  className="w-[85%] h-[85%] object-cover rounded-full"
                  style={{ filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.4))" }}
                  whileHover={{ scale: 1.1, rotate: 7 }}
                  transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                  data-testid={`img-menu-bowl-${bowl.id}`}
                />
              </div>

              {/* Card content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display font-bold text-lg text-foreground leading-tight">{bowl.name}</h3>
                  <span className="font-bold text-base ml-2 shrink-0" style={{ color: "#FF6B47" }}>
                    {bowl.price}
                  </span>
                </div>
                <p className="text-foreground/45 text-sm leading-relaxed mb-5">{bowl.ingredients}</p>

                {/* Add to Order — high-contrast lime green button */}
                <motion.button
                  className="w-full py-3 rounded-full font-bold text-sm transition-all duration-300"
                  style={{
                    background: "rgba(155,227,106,0.12)",
                    color: "#9BE36A",
                    border: "1px solid rgba(155,227,106,0.25)",
                  }}
                  whileHover={{
                    background: "#9BE36A",
                    color: "#0D1B2A",
                    scale: 1.02,
                    boxShadow: "0 0 20px rgba(155,227,106,0.3)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  data-testid={`button-add-${bowl.id}`}
                >
                  Add to Order
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
