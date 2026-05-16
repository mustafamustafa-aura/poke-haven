import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Full menu from PDF ───────────────────────────────────────────────────── */
const CATEGORIES = [
  {
    id: "signature",
    label: "Signature Bowls",
    items: [
      {
        id: "haven-speciaal",
        name: "Haven Speciaal",
        price: "€16.50",
        image: "/bowl-haven.png",
        tag: "Chef's Pick",
        desc: "Tuna, salmon, crab surimi, avocado, tobiko, zeewierssalade, sesam",
        rating: 4.9,
      },
      {
        id: "garnalen",
        name: "Poke Garnalen",
        price: "€15.50",
        image: "/bowl-garnalen-png.png",
        tag: "Popular",
        desc: "Garnalen, edamame, radijs, rode ui, zeewierssalade, spicy mayo",
        rating: 4.8,
      },
      {
        id: "shoyu-tofu",
        name: "Shoyu Tofu",
        price: "€13.50",
        image: "/bowl-tofu.png",
        tag: "Vegan",
        desc: "Krokante tofu, maïs, komkommer, avocado, cherrytomaat, shoyu",
        rating: 4.7,
      },
      {
        id: "vlees-speciaal",
        name: "Vlees Speciaal",
        price: "€17.50",
        image: "/bowl-vlees.png",
        tag: "New",
        desc: "Gemarineerd rund, cherrytomaat, paprika, rode ui, wortel, sesam",
        rating: 4.9,
      },
    ],
  },
  {
    id: "classic",
    label: "Klassieke Bowls",
    items: [
      {
        id: "tuna",
        name: "Poke Tuna",
        price: "€14.50",
        image: "/bowl-tuna.webp",
        tag: null,
        desc: "Yellowfin tonijn, komkommer, edamame, zeewier, ponzu-shoyu",
        rating: 4.8,
      },
      {
        id: "zalim",
        name: "Poke Zalm",
        price: "€14.50",
        image: "/bowl-zalim.webp",
        tag: "Bestseller",
        desc: "Verse zalm, avocado, edamame, wortel, sesamdressing",
        rating: 4.9,
      },
      {
        id: "falafel",
        name: "Poke Falafel",
        price: "€13.00",
        image: "/bowl-falafel.webp",
        tag: "Vegan",
        desc: "Krokante falafel, edamame, maïs, avocado, lente-ui, sriracha",
        rating: 4.7,
      },
      {
        id: "kip",
        name: "Warm Crispy Kip",
        price: "€14.00",
        image: "/bowl-kip.webp",
        tag: null,
        desc: "Krokante kip, mango, komkommer, rode ui, spicy mayo",
        rating: 4.6,
      },
    ],
  },
  {
    id: "drinks",
    label: "Dranken",
    items: [
      {
        id: "smoothie-rood",
        name: "Rode Smoothie",
        price: "€5.50",
        image: "/bowl-garnalen-png.png",
        tag: "Fresh",
        desc: "Rode appel, aardbei, bosbes, braambes, framboos",
        rating: 4.8,
      },
      {
        id: "smoothie-geel",
        name: "Gele Smoothie",
        price: "€5.50",
        image: "/bowl-tofu.png",
        tag: "Fresh",
        desc: "Banaan, ananas, mango",
        rating: 4.7,
      },
      {
        id: "cola",
        name: "Frisdranken",
        price: "€2.90",
        image: "/bowl-falafel.webp",
        tag: null,
        desc: "Coca-Cola, Coca-Cola Zero, Fanta Orange, Fanta Lemon, Sprite, Lipton Ice Tea",
        rating: 4.5,
      },
      {
        id: "koffie",
        name: "Warme Dranken",
        price: "v.a. €2.50",
        image: "/bowl-kip.webp",
        tag: null,
        desc: "Espresso, Americano, Cappuccino, Latte, Zwarte/Groene/Muntthee",
        rating: 4.6,
      },
    ],
  },
  {
    id: "desserts",
    label: "Ijs & Desserts",
    items: [
      {
        id: "vanille",
        name: "Vanille Coupe",
        price: "€7.00",
        image: "/bowl-tofu.png",
        tag: "Sweet",
        desc: "Vanille-ijs met chocoladesaus en slagroom",
        rating: 4.8,
      },
      {
        id: "brazilliana",
        name: "Brazilliana",
        price: "€8.00",
        image: "/bowl-haven.png",
        tag: "Popular",
        desc: "Met karamel en gekarameliseerde noten",
        rating: 4.9,
      },
      {
        id: "citroensorbet",
        name: "Citroensorbet",
        price: "€6.00",
        image: "/bowl-garnalen-png.png",
        tag: "Vegan",
        desc: "Fris citroensorbet",
        rating: 4.7,
      },
      {
        id: "taart",
        name: "Taart van de Dag",
        price: "€6.00",
        image: "/bowl-vlees.png",
        tag: null,
        desc: "Vraag naar de dagelijkse selectie",
        rating: 4.8,
      },
    ],
  },
];

const TAG_COLOR: Record<string, string> = {
  "Chef's Pick": "#F26522",
  Popular: "#F26522",
  New: "#F26522",
  Bestseller: "#F26522",
  Vegan: "#59B259",
  Fresh: "#59B259",
  Sweet: "#F26522",
};

function Stars({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 12 12">
          <path d="M6 1l1.4 2.8 3.1.4-2.25 2.2.53 3.1L6 8.1l-2.78 1.4.53-3.1L1.5 4.2l3.1-.4z"
            fill={i <= Math.round(n) ? "#F26522" : "rgba(255,255,255,0.15)"} />
        </svg>
      ))}
      <span className="text-xs ml-1" style={{ color: "#A0AEC0" }}>{n}</span>
    </span>
  );
}

export function MenuSection() {
  const [activeCat, setActiveCat] = useState("signature");
  const cat = CATEGORIES.find(c => c.id === activeCat)!;

  return (
    <section id="menu" className="py-28 relative overflow-hidden" style={{ background: "#0E1621" }}>
      {/* Orange separator line from spec */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "rgba(242,101,34,0.2)" }} />

      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display font-black tracking-tight leading-none" style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}>
            <span style={{ color: "#fff" }}>Ons </span>
            <span style={{ color: "#F26522" }}>Populair </span>
            <span style={{ color: "#fff" }}>Menu</span>
          </h2>
          <p className="mt-4 text-base max-w-md mx-auto" style={{ color: "#A0AEC0" }}>
            Elke bowl vers bereid met de lekkerste ingrediënten — dagelijks geleverd.
          </p>
        </motion.div>

        {/* Category filter tabs */}
        <motion.div
          className="flex gap-2 justify-center mb-12 flex-wrap"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              data-testid={`tab-${c.id}`}
              className="px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300"
              style={{
                background: activeCat === c.id ? "#F26522" : "#1A2432",
                color: activeCat === c.id ? "#fff" : "#A0AEC0",
                border: `1px solid ${activeCat === c.id ? "#F26522" : "rgba(255,255,255,0.08)"}`,
              }}
              onMouseEnter={(e) => {
                if (activeCat !== c.id) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(242,101,34,0.5)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeCat !== c.id) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
                }
              }}
            >
              {c.label}
            </button>
          ))}
        </motion.div>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCat}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            variants={{ show: { transition: { staggerChildren: 0.12 } }, hidden: {} }}
          >
            {cat.items.map((item) => (
              <motion.div
                key={item.id}
                data-testid={`card-${item.id}`}
                className="relative flex flex-col cursor-pointer"
                style={{
                  background: "#1A2432",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 16,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                }}
                whileHover={{
                  y: -6,
                  boxShadow: "0 20px 48px rgba(0,0,0,0.45)",
                  borderColor: "#F26522",
                  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                }}
              >
                {/* Tag */}
                {item.tag && (
                  <div
                    className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full z-10"
                    style={{
                      background: (TAG_COLOR[item.tag] || "#F26522") + "22",
                      color: TAG_COLOR[item.tag] || "#F26522",
                      border: `1px solid ${(TAG_COLOR[item.tag] || "#F26522")}44`,
                    }}
                    data-testid={`badge-${item.id}`}
                  >
                    {item.tag}
                  </div>
                )}

                {/* Image — circular, slightly overlapping top, hover: scale 10% + rotate ~7° */}
                <div className="flex justify-center pt-6 pb-2 overflow-hidden">
                  <motion.img
                    src={item.image}
                    alt={item.name}
                    className="object-contain rounded-full"
                    style={{ width: 110, height: 110, background: "rgba(255,255,255,0.04)" }}
                    whileHover={{ scale: 1.1, rotate: 7 }}
                    transition={{ duration: 0.38, ease: [0.34, 1.56, 0.64, 1] }}
                    data-testid={`img-${item.id}`}
                  />
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-display font-bold text-white text-sm mb-1">{item.name}</h3>
                  <Stars n={item.rating} />
                  <p className="text-xs mt-2 leading-relaxed flex-1" style={{ color: "#A0AEC0" }}>{item.desc}</p>

                  <div className="flex items-center justify-between mt-4">
                    <span className="font-bold text-white text-sm">{item.price}</span>
                    {/* Add to cart — leaf green button */}
                    <motion.button
                      className="px-4 py-2 rounded-full font-bold text-xs text-white flex items-center gap-1"
                      style={{ background: "#59B259" }}
                      whileHover={{ background: "#48BB78", scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      data-testid={`button-add-${item.id}`}
                    >
                      + Bestellen
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Explore More button */}
        <motion.div
          className="flex justify-center mt-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <button
            className="px-10 py-4 rounded-full font-bold text-white transition-all duration-300 hover:scale-[1.03]"
            style={{ background: "#F26522", boxShadow: "0 0 20px rgba(242,101,34,0.3)" }}
            data-testid="button-explore-more"
          >
            Meer Bekijken
          </button>
        </motion.div>
      </div>
    </section>
  );
}
