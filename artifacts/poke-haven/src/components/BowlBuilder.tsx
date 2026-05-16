import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Step data (Dutch, exact pricing from spec) ─────────────────────────── */
const MATEN = [
  { name: "Regular",  prijs: 0,    omschrijving: "€13.90 – standaard maat" },
  { name: "Large",    prijs: 3.00, omschrijving: "+€3.00 – extra groot" },
];

const BASES = [
  { name: "Sushirijst" },
  { name: "Bruine rijst" },
  { name: "Salademix" },
  { name: "Nachos" },
];

const SAUZEN = [
  { name: "Haven Aioli" },
  { name: "Hawaiiaanse Mayo" },
  { name: "Sriracha Mayo", spicy: true },
  { name: "Wasabi Mayo" },
  { name: "Gember Saus" },
  { name: "Sriracha Hot Chili", spicy: true },
  { name: "Teriyaki Saus" },
  { name: "Sweet Soya" },
  { name: "Soya Saus" },
  { name: "Sweet Chili Saus" },
  { name: "Zonder Saus" },
];

const EIWITTEN = [
  { name: "Heerlijke Kip",        prijs: 0,    label: "Standaard" },
  { name: "Warme Crispy Kip",     prijs: 0,    label: "Standaard" },
  { name: "Zalm",                 prijs: 0,    label: "Standaard" },
  { name: "Tonijn",               prijs: 0,    label: "Standaard" },
  { name: "Falafel",              prijs: 0,    label: "Standaard" },
  { name: "Tofu",                 prijs: 0,    label: "Standaard" },
  { name: "Garnaal",              prijs: 0,    label: "Standaard" },
  { name: "Gemarineerd Rundvlees",prijs: 0,    label: "Standaard" },
  { name: "Gemarineerde Zalm",    prijs: 3.00, label: "Premium" },
  { name: "Gemarineerde Tonijn",  prijs: 3.00, label: "Premium" },
  { name: "Paling",               prijs: 3.00, label: "Premium" },
  { name: "Zonder Proteïne",      prijs: 0,    label: "Optie" },
];

const GARNERINGEN = [
  "Rode uien","Komkommer","Mango","Avocado","Cherrytomaatjes","Paprika",
  "Edamame","Wakame","Rode biet","Maïs","Wortel","Surimi krab",
  "Babyspinazie","Broccoli","Rode kool","Feta","Kikkererwt","Ei",
];

const TOPPINGS = [
  "Gefrituurde ui","Cashewnoten","Walnoten","Sesammix","Sesam fl. soja",
  "Sesam fl. gerookt","Wasabi crunch","Jalapeños","Gepekelde gember",
  "Japanse crunch","Chillivlokken","Kokosschaafsel","Zaadmix",
  "Masago","Lente ui","Olijven","Granaatappel",
];

const EXTRAS = [
  { name: "Extra Saus",      prijs: 1.00 },
  { name: "Extra Proteïne",  prijs: 3.00 },
  { name: "Extra Topping",   prijs: 1.00 },
  { name: "Extra Garnering", prijs: 1.50 },
];

const BASE_PRICE = 13.90;

interface Keuzes {
  maat: string[];
  basis: string[];
  saus: string[];
  eiwit: string[];
  garneringen: string[];
  toppings: string[];
  extras: string[];
}

const initKeuzes: Keuzes = {
  maat: [], basis: [], saus: [], eiwit: [], garneringen: [], toppings: [], extras: [],
};

function calcTotaal(k: Keuzes): number {
  let total = BASE_PRICE;
  if (k.maat.includes("Large")) total += 3.00;
  const eiwit = EIWITTEN.find(e => k.eiwit.includes(e.name));
  if (eiwit) total += eiwit.prijs;
  k.extras.forEach(ex => {
    const e = EXTRAS.find(x => x.name === ex);
    if (e) total += e.prijs;
  });
  return total;
}

const STAPPEN = [
  {
    id: "maat" as keyof Keuzes,
    titel: "Kies Je Maat",
    sub: "Regular (€13.90) of Large (+€3.00)",
    multi: false,
    max: 1,
    opties: MATEN.map(m => ({ name: m.name, extra: m.prijs > 0 ? `+€${m.prijs.toFixed(2)}` : "", hint: m.omschrijving })),
  },
  {
    id: "basis" as keyof Keuzes,
    titel: "Kies Je Basis",
    sub: "Kies 1 basis voor je bowl",
    multi: false,
    max: 1,
    opties: BASES.map(b => ({ name: b.name, extra: "", hint: "" })),
  },
  {
    id: "saus" as keyof Keuzes,
    titel: "Kies Je Saus",
    sub: "Kies 1 saus",
    multi: false,
    max: 1,
    opties: SAUZEN.map(s => ({ name: s.name, extra: "", hint: (s as any).spicy ? "🌶 Spicy" : "" })),
  },
  {
    id: "eiwit" as keyof Keuzes,
    titel: "Kies Je Proteïne",
    sub: "Premium proteïnen: +€3.00",
    multi: false,
    max: 1,
    opties: EIWITTEN.map(e => ({ name: e.name, extra: e.prijs > 0 ? `+€${e.prijs.toFixed(2)}` : "", hint: e.label })),
  },
  {
    id: "garneringen" as keyof Keuzes,
    titel: "Kies Je Garnering",
    sub: "Kies maximaal 4",
    multi: true,
    max: 4,
    opties: GARNERINGEN.map(g => ({ name: g, extra: "", hint: "" })),
  },
  {
    id: "toppings" as keyof Keuzes,
    titel: "Kies Je Toppings",
    sub: "Kies maximaal 3",
    multi: true,
    max: 3,
    opties: TOPPINGS.map(t => ({ name: t, extra: "", hint: "" })),
  },
  {
    id: "extras" as keyof Keuzes,
    titel: "Extra's (Optioneel)",
    sub: "Voeg extra's toe aan je bowl",
    multi: true,
    max: 99,
    opties: EXTRAS.map(e => ({ name: e.name, extra: `+€${e.prijs.toFixed(2)}`, hint: "" })),
  },
];

export function BowlBuilder() {
  const [stap, setStap] = useState(0);
  const [keuzes, setKeuzes] = useState<Keuzes>(initKeuzes);
  const [klaar, setKlaar] = useState(false);

  const huidig = STAPPEN[stap];
  const totaal = calcTotaal(keuzes);
  const voortgang = ((stap + 1) / STAPPEN.length) * 100;

  const toggle = (name: string) => {
    setKeuzes(prev => {
      const huidigeKeuzes = prev[huidig.id] || [];
      if (huidig.multi) {
        if (huidigeKeuzes.includes(name)) {
          return { ...prev, [huidig.id]: huidigeKeuzes.filter(x => x !== name) };
        }
        if (huidigeKeuzes.length >= huidig.max) return prev;
        return { ...prev, [huidig.id]: [...huidigeKeuzes, name] };
      }
      return { ...prev, [huidig.id]: [name] };
    });
  };

  const kanVolgende = huidig.id === "extras"
    ? true
    : (keuzes[huidig.id]?.length ?? 0) > 0;

  if (klaar) {
    return (
      <section id="builder" className="py-28" style={{ background: "#0E1621" }}>
        <div className="container mx-auto px-5 max-w-2xl text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl" style={{ background: "rgba(89,178,89,0.15)", border: "2px solid #59B259" }}>✓</div>
            <h2 className="font-display font-bold text-4xl text-white mb-4">Bowl Geplaatst!</h2>
            <p className="text-lg mb-2" style={{ color: "#A0AEC0" }}>
              {keuzes.basis[0]} · {keuzes.eiwit[0]} · {keuzes.saus[0]}
            </p>
            {keuzes.garneringen.length > 0 && (
              <p className="text-sm mb-4" style={{ color: "#A0AEC0" }}>{keuzes.garneringen.join(" · ")}</p>
            )}
            <p className="font-bold text-3xl mb-10" style={{ color: "#F26522" }}>€{totaal.toFixed(2)}</p>
            <button
              onClick={() => { setKeuzes(initKeuzes); setStap(0); setKlaar(false); }}
              className="px-8 py-4 rounded-full font-bold text-white hover:scale-105 active:scale-95 transition-all"
              style={{ background: "#F26522", touchAction: "manipulation" }}
              data-testid="button-opnieuw"
            >
              Nog een Bowl Samenstellen
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="builder" className="py-24 relative overflow-hidden" style={{ background: "#0E1621" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "rgba(89,178,89,0.2)" }} />
      <div
        className="absolute bottom-0 left-0 w-[50vw] h-[50vw] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(89,178,89,0.04) 0%, transparent 70%)" }}
      />
      <div className="container mx-auto px-5 max-w-4xl relative z-10">

        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "#59B259" }}>
            Maak Je Eigen Kom
          </p>
          <h2 className="font-display font-black text-white tracking-tight" style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}>
            Stel Je Bowl Samen
          </h2>
          <p className="text-lg mt-3" style={{ color: "#A0AEC0" }}>Vanaf €{BASE_PRICE.toFixed(2)}</p>
        </motion.div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-3 gap-1 overflow-x-auto">
            {STAPPEN.map((s, i) => (
              <button
                key={s.id}
                onClick={() => i < stap && setStap(i)}
                className="text-xs font-semibold transition-colors whitespace-nowrap"
                style={{ color: i <= stap ? "#F26522" : "rgba(255,255,255,0.25)", touchAction: "manipulation" }}
                data-testid={`stap-label-${s.id}`}
              >
                {i + 1}. {s.titel.split(" ").pop()}
              </button>
            ))}
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #F26522, #59B259)" }}
              animate={{ width: voortgang + "%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Step card */}
        <div className="rounded-3xl p-6 md:p-10 mb-6" style={{ background: "#1A2432", border: "1px solid rgba(255,255,255,0.07)" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={stap}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#F26522", color: "#fff" }}>
                    Stap {stap + 1} van {STAPPEN.length}
                  </span>
                  {huidig.multi && huidig.max < 99 && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(89,178,89,0.15)", color: "#59B259" }}>
                      max. {huidig.max} · gekozen: {keuzes[huidig.id].length}
                    </span>
                  )}
                </div>
                <h3 className="font-display font-bold text-3xl text-white mt-2">{huidig.titel}</h3>
                <p className="text-sm mt-1" style={{ color: "#A0AEC0" }}>{huidig.sub}</p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {huidig.opties.map((opt) => {
                  const geselecteerd = keuzes[huidig.id]?.includes(opt.name);
                  const vol = huidig.multi && !geselecteerd && keuzes[huidig.id].length >= huidig.max;
                  return (
                    <motion.button
                      key={opt.name}
                      onClick={() => !vol && toggle(opt.name)}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200"
                      style={{
                        background: geselecteerd ? "#F26522" : vol ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
                        borderColor: geselecteerd ? "#F26522" : "rgba(255,255,255,0.1)",
                        color: geselecteerd ? "#fff" : vol ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.75)",
                        boxShadow: geselecteerd ? "0 8px 20px -6px rgba(242,101,34,0.45)" : "none",
                        cursor: vol ? "not-allowed" : "pointer",
                        touchAction: "manipulation",
                      }}
                      whileHover={!vol ? { scale: 1.04 } : {}}
                      whileTap={!vol ? { scale: 0.97 } : {}}
                      data-testid={`optie-${huidig.id}-${opt.name.replace(/\s+/g, "-").toLowerCase()}`}
                    >
                      {opt.name}
                      {opt.extra && <span className="ml-1.5 font-normal opacity-75">{opt.extra}</span>}
                      {opt.hint && <span className="ml-1.5 text-xs opacity-60">{opt.hint}</span>}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Price + navigation */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: "#A0AEC0" }}>Jouw totaal</p>
            <motion.p
              key={totaal}
              className="font-display font-bold text-3xl"
              style={{ color: "#F26522" }}
              initial={{ scale: 1.15, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              €{totaal.toFixed(2)}
            </motion.p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStap(Math.max(0, stap - 1))}
              disabled={stap === 0}
              className="px-6 py-3 rounded-full font-semibold text-sm border transition-all disabled:opacity-30"
              style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", touchAction: "manipulation" }}
              data-testid="button-vorige-stap"
            >
              Vorige
            </button>
            {stap < STAPPEN.length - 1 ? (
              <button
                onClick={() => kanVolgende && setStap(stap + 1)}
                disabled={!kanVolgende}
                className="px-8 py-3 rounded-full font-bold text-sm text-white transition-all disabled:opacity-35 hover:scale-105 active:scale-95"
                style={{ background: "#F26522", touchAction: "manipulation" }}
                data-testid="button-volgende-stap"
              >
                Volgende Stap
              </button>
            ) : (
              <button
                onClick={() => setKlaar(true)}
                className="px-8 py-3 rounded-full font-bold text-sm text-white transition-all hover:scale-105 active:scale-95"
                style={{ background: "#59B259", boxShadow: "0 0 18px rgba(89,178,89,0.3)", touchAction: "manipulation" }}
                data-testid="button-bestelling-plaatsen"
              >
                Bestelling Plaatsen · €{totaal.toFixed(2)}
              </button>
            )}
          </div>
        </div>

        {/* Summary chips */}
        {Object.values(keuzes).some(v => v.length > 0) && (
          <motion.div className="mt-6 flex flex-wrap gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {Object.entries(keuzes).flatMap(([, vals]) => vals).map((v) => (
              <span
                key={v}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: "rgba(89,178,89,0.1)", color: "#59B259", border: "1px solid rgba(89,178,89,0.2)" }}
              >
                {v}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
