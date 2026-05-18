import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart";

/* ─── Signature bowls ─────────────────────────────────────────────────────── */
const SIGNATURE: { id: string; name: string; price: string; image: string | null; tag: string | null; desc: string; rating: number }[] = [
  { id: "crispy-kip",    name: "Warm Crispy Kip",       price: "€13.90", image: "/bowl-kip-new.png",         tag: "Bestseller", desc: "Sushirijst, crispy kip, srirachamayo, rode ui, mango, komkommer, avocado, gefrituurde ui, kameya, Japanse crisp, lente-ui", rating: 4.8 },
  { id: "del-kip",       name: "Delicious Kip",         price: "€13.90", image: null,                        tag: null,         desc: "Sushirijst, crispy kip, srirachamayo, rode ui, mango, komkommer, maïs, paprika, gefrituurde ui, kameya, Japanse crisp, lente-ui", rating: 4.6 },
  { id: "zalm",          name: "Poke Zalm",             price: "€13.90", image: "/bowl-zalim-new.png",        tag: "Populair",   desc: "Sushirijst, zalm, srirachamayo, wakame, wasabimayo, rode ui, komkommer, edamame, wasabi, gefrituurde ui, bosui", rating: 4.9 },
  { id: "tuna",          name: "Poke Tuna",             price: "€13.90", image: "/bowl-tuna-new.png",         tag: null,         desc: "Sushirijst, srirachamayo, wasabimayo, wakame, rode ui, komkommer, edamame, tonijn, jalapeños, wasabi crunch, bosui", rating: 4.7 },
  { id: "falafel",       name: "Poke Falafel",          price: "€13.90", image: "/bowl-falafel-new.png",      tag: "Vegan",      desc: "Bruine rijst, salademix, srirachamayo, falafel, maïs, paprika, edamame, avocado, gefrituurde ui, bosui", rating: 4.7 },
  { id: "paling",        name: "Poke Paling Teriyaki",  price: "€15.90", image: null,                        tag: "Premium",    desc: "Sushirijst, paling, teriyakisaus, komkommer, mango, avocado, Japanse crunch, wakame, masago, sesammix", rating: 4.9 },
  { id: "haven",         name: "Haven Speciaal",        price: "€14.90", image: "/bowl-haven.png",            tag: "Chef's keuze", desc: "Sushirijst, zalm & tonijn, srirachamayo, avocado, wakame, surimi, Japanse crunch, masago, sesammix", rating: 4.9 },
  { id: "garnalen",      name: "Poke Garnalen",         price: "€13.90", image: "/bowl-garnalen-png.png",     tag: null,         desc: "Sushirijst, Hawaiiaanse mayo, wakame, edamame, rode ui, rode biet, garnaal, sesammix, masago, wasabi", rating: 4.8 },
  { id: "vlees",         name: "Vlees Speciaal",        price: "€13.90", image: "/bowl-vlees.png",            tag: null,         desc: "Bruine rijst, Hawaiiaanse mayo, Haven aioli, wortel, cherrytomaatjes, paprika, rode ui, gemarineerd rundvlees, amandelen, cashewnoten, sesammix", rating: 4.8 },
  { id: "shoyu-tofu",    name: "Shoyu Tofu",            price: "€13.90", image: "/bowl-tofu.png",             tag: "Vegan",      desc: "Bruine rijst, Hawaiiaanse mayo, srirachamayo, avocado, komkommer, maïs, cherrytomaatjes, gemarineerde tofu, amandelen, cashewnoten, sesammix", rating: 4.7 },
];

/* ─── Drinks & desserts as structured text lists ──────────────────────────── */
const DRANKEN = {
  smoothies: [
    { name: "Rode Smoothie", desc: "Rode appel, aardbei, blauwe bes, braam, framboos", price: "€5.50" },
    { name: "Gele Smoothie",  desc: "Banaan, ananas, mango",                           price: "€5.50" },
  ],
  koud: [
    { name: "Spa plat",                              price: "€2.50" },
    { name: "Spa bruisend",                          price: "€2.50" },
    { name: "Coca-Cola",                             price: "€2.90" },
    { name: "Coca-Cola Zero",                        price: "€2.90" },
    { name: "Fanta Orange",                          price: "€2.90" },
    { name: "Fanta Lemon",                           price: "€2.90" },
    { name: "Sprite",                                price: "€2.90" },
    { name: "Lipton Ice Tea Green/Peach",            price: "€2.90" },
    { name: "Sap Sinaasappel / Multivitamine / Appel", price: "€3.20" },
    { name: "Tonissteiner Oranje / Citroen",         price: "€3.50" },
    { name: "Red Bull",                              price: "€3.70" },
  ],
  warm: [
    { name: "Espresso",                              price: "€2.50" },
    { name: "Americano",                             price: "€2.80" },
    { name: "Cappuccino",                            price: "€3.50" },
    { name: "Latte",                                 price: "€3.80" },
    { name: "Pot Thee (Zwart / Groen / Munt)",       price: "€5.00" },
  ],
  desserts: [
    { name: "Vanille Coupe",    desc: "Met chocoladesaus en slagroom", price: "€7.00" },
    { name: "Brazilliana",      desc: "Met karamel en gekarameliseerde noten", price: "€8.00" },
    { name: "Citroensorbet",    desc: "",                             price: "€6.00" },
    { name: "Taart van de dag", desc: "Vraag naar de dagelijkse selectie", price: "€6.00" },
  ],
};

const TAG_COLOR: Record<string, string> = {
  "Chef's keuze": "#F26522",
  Populair: "#F26522",
  Bestseller: "#F26522",
  Premium: "#F26522",
  Vegan: "#59B259",
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

function BowlCard({ item }: { item: typeof SIGNATURE[0] }) {
  const { addItem } = useCart();

  return (
    <motion.div
      data-testid={`card-${item.id}`}
      className="relative flex flex-col cursor-pointer"
      style={{ background: "#1A2432", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
      variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
      whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(0,0,0,0.45)", borderColor: "#F26522", transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
    >
      {item.tag && (
        <div
          className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full z-10"
          style={{ background: (TAG_COLOR[item.tag] || "#F26522") + "22", color: TAG_COLOR[item.tag] || "#F26522", border: `1px solid ${(TAG_COLOR[item.tag] || "#F26522")}44` }}
        >
          {item.tag}
        </div>
      )}
      <div className="flex justify-center pt-6 pb-2 overflow-hidden">
        {item.image ? (
          <motion.img
            src={item.image}
            alt={item.name}
            className="object-contain"
            style={{ width: 110, height: 110, background: "transparent" }}
            whileHover={{ scale: 1.06, rotate: 3, y: -4 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : (
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: 110, height: 110, background: "rgba(242,101,34,0.08)", border: "1.5px dashed rgba(242,101,34,0.25)" }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
              <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z" stroke="#F26522" strokeWidth="1.2" strokeLinecap="round" fill="rgba(242,101,34,0.08)" />
              <path d="M7 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="#F26522" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M5 14h14" stroke="#F26522" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-bold text-white text-sm mb-1">{item.name}</h3>
        <Stars n={item.rating} />
        <p className="text-xs mt-2 leading-relaxed flex-1" style={{ color: "#A0AEC0" }}>{item.desc}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-bold text-white text-sm">{item.price}</span>
          <motion.button
            className="px-4 py-2 rounded-full font-bold text-xs text-white"
            style={{ background: "#59B259", touchAction: "manipulation" }}
            whileHover={{ background: "#48BB78", scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            data-testid={`button-add-${item.id}`}
            onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image })}
          >
            + Bestellen
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Drinks & Desserts panel ─────────────────────────────────────────────── */
function DrinkRow({
  name, desc, price, onAdd,
}: { name: string; desc?: string; price: string; onAdd: () => void }) {
  return (
    <div
      className="flex items-center justify-between gap-3 py-3"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white text-sm">{name}</p>
        {desc && <p className="text-xs mt-0.5" style={{ color: "#A0AEC0" }}>{desc}</p>}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-bold text-sm whitespace-nowrap" style={{ color: "#F26522" }}>{price}</span>
        <motion.button
          onClick={onAdd}
          className="px-3 py-1.5 rounded-full font-bold text-xs text-white"
          style={{ background: "#59B259", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", minWidth: 72 }}
          whileHover={{ background: "#48BB78", scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
        >
          + Bestellen
        </motion.button>
      </div>
    </div>
  );
}

function DrinkSubSection({
  title, items, onAdd,
}: { title: string; items: { name: string; desc?: string; price: string }[]; onAdd: (name: string, price: string) => void }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#59B259" }}>{title}</p>
      {items.map(item => (
        <DrinkRow
          key={item.name}
          {...item}
          onAdd={() => onAdd(item.name, item.price)}
        />
      ))}
    </div>
  );
}

function DrankenPanel() {
  const { addItem } = useCart();
  const handleAdd = (name: string, price: string) =>
    addItem({ id: `drink-${name.toLowerCase().replace(/\s+/g, "-")}`, name, price, image: null });

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div
        className="rounded-2xl p-6"
        style={{ background: "#1A2432", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <DrinkSubSection title="Smoothies"     items={DRANKEN.smoothies} onAdd={handleAdd} />
        <DrinkSubSection title="Koude Dranken" items={DRANKEN.koud}      onAdd={handleAdd} />
      </div>
      <div
        className="rounded-2xl p-6"
        style={{ background: "#1A2432", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <DrinkSubSection title="Warme Dranken" items={DRANKEN.warm}     onAdd={handleAdd} />
        <DrinkSubSection title="IJs & Desserts" items={DRANKEN.desserts} onAdd={handleAdd} />
      </div>
    </div>
  );
}

export function MenuSection() {
  const [activeCat, setActiveCat] = useState("signature");

  const TABS = [
    { id: "signature", label: "Signature Bowls" },
    { id: "dranken",   label: "Dranken & Desserts" },
  ];

  return (
    <section id="menu" className="py-24 relative overflow-hidden" style={{ background: "#0E1621" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "rgba(242,101,34,0.2)" }} />

      <div className="container mx-auto px-5">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
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

        {/* Tabs */}
        <motion.div
          className="flex gap-2 justify-center mb-10 flex-wrap"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {TABS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              data-testid={`tab-${c.id}`}
              className="px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300"
              style={{
                background: activeCat === c.id ? "#F26522" : "#1A2432",
                color: activeCat === c.id ? "#fff" : "#A0AEC0",
                border: `1px solid ${activeCat === c.id ? "#F26522" : "rgba(255,255,255,0.08)"}`,
                touchAction: "manipulation",
              }}
            >
              {c.label}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeCat === "signature" ? (
            <motion.div
              key="signature"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5"
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
              variants={{ show: { transition: { staggerChildren: 0.08 } }, hidden: {} }}
            >
              {[...SIGNATURE].sort((a, b) => (a.image ? 0 : 1) - (b.image ? 0 : 1)).map((item) => <BowlCard key={item.id} item={item} />)}
            </motion.div>
          ) : (
            <motion.div
              key="dranken"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <DrankenPanel />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Explore more */}
        {activeCat === "signature" && (
          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" })}
              className="px-10 py-4 rounded-full font-bold text-white transition-all duration-300 hover:scale-[1.03]"
              style={{ background: "#F26522", boxShadow: "0 0 20px rgba(242,101,34,0.3)", touchAction: "manipulation" }}
              data-testid="button-stel-je-bowl-samen"
            >
              Stel Je Eigen Bowl Samen
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
