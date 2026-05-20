import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart";

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
  { name: "Extra Saus",      prijs: 1.00, icon: "🥣" },
  { name: "Extra Proteïne",  prijs: 3.00, icon: "🥩" },
  { name: "Extra Topping",   prijs: 1.00, icon: "✨" },
  { name: "Extra Garnering", prijs: 1.50, icon: "🥑" },
];

const EXTRA_SUBITEMS: Record<string, string[]> = {
  "Extra Saus":      SAUZEN.filter(s => s.name !== "Zonder Saus").map(s => s.name),
  "Extra Proteïne":  EIWITTEN.filter(e => e.name !== "Zonder Proteïne").map(e => e.name),
  "Extra Topping":   TOPPINGS,
  "Extra Garnering": GARNERINGEN,
};

const BASE_PRICE = 13.90;

interface ExtraKeuze {
  type: string;
  naam: string;
  prijs: number;
}

interface Keuzes {
  maat: string[];
  basis: string[];
  saus: string[];
  eiwit: string[];
  garneringen: string[];
  toppings: string[];
  extras: ExtraKeuze[];
}

const initKeuzes: Keuzes = {
  maat: [], basis: [], saus: [], eiwit: [], garneringen: [], toppings: [], extras: [],
};

function calcTotaal(k: Keuzes): number {
  let total = BASE_PRICE;
  if (k.maat.includes("Large")) total += 3.00;
  const eiwit = EIWITTEN.find(e => k.eiwit.includes(e.name));
  if (eiwit) total += eiwit.prijs;
  k.extras.forEach(e => { total += e.prijs; });
  return total;
}

const STAPPEN = [
  { id: "maat" as keyof Omit<Keuzes,"extras">,        titel: "Kies Je Maat",       sub: "Regular (€13.90) of Large (+€3.00)", multi: false, max: 1,  opties: MATEN.map(m => ({ name: m.name, extra: m.prijs > 0 ? `+€${m.prijs.toFixed(2)}` : "", hint: m.omschrijving })) },
  { id: "basis" as keyof Omit<Keuzes,"extras">,       titel: "Kies Je Basis",      sub: "Kies 1 basis voor je bowl",          multi: false, max: 1,  opties: BASES.map(b => ({ name: b.name, extra: "", hint: "" })) },
  { id: "saus" as keyof Omit<Keuzes,"extras">,        titel: "Kies Je Saus",       sub: "Kies 1 saus",                        multi: false, max: 1,  opties: SAUZEN.map(s => ({ name: s.name, extra: "", hint: (s as any).spicy ? "🌶 Spicy" : "" })) },
  { id: "eiwit" as keyof Omit<Keuzes,"extras">,       titel: "Kies Je Proteïne",   sub: "Premium proteïnen: +€3.00",          multi: false, max: 1,  opties: EIWITTEN.map(e => ({ name: e.name, extra: e.prijs > 0 ? `+€${e.prijs.toFixed(2)}` : "", hint: e.label })) },
  { id: "garneringen" as keyof Omit<Keuzes,"extras">, titel: "Kies Je Garnering",  sub: "Kies maximaal 4",                    multi: true,  max: 4,  opties: GARNERINGEN.map(g => ({ name: g, extra: "", hint: "" })) },
  { id: "toppings" as keyof Omit<Keuzes,"extras">,    titel: "Kies Je Toppings",   sub: "Kies maximaal 3",                    multi: true,  max: 3,  opties: TOPPINGS.map(t => ({ name: t, extra: "", hint: "" })) },
];

const STAP_EXTRAS = { id: "extras" as const, titel: "Extra's (Optioneel)", sub: "Voeg extra sauzen, proteïnen, toppings of garneringen toe" };
const ALL_STAP_IDS = [...STAPPEN.map(s => s.id), "extras"];
const TOTAAL_STAPPEN = STAPPEN.length + 1;

function buildCustomBowlId(keuzes: Keuzes): string {
  const parts = [
    keuzes.maat[0],
    keuzes.basis[0],
    keuzes.saus[0],
    keuzes.eiwit[0],
    ...keuzes.garneringen,
    ...keuzes.toppings,
    ...keuzes.extras.map((e) => e.naam),
  ].filter(Boolean);
  return `custom-${parts.join("-").replace(/\s+/g, "_").toLowerCase().slice(0, 120)}`;
}

function buildCustomBowlName(keuzes: Keuzes): string {
  return `Eigen Bowl · ${keuzes.eiwit[0] ?? "Custom"}`;
}

export function BowlBuilder() {
  const { addItem } = useCart();
  const [stap, setStap] = useState(0);
  const [keuzes, setKeuzes] = useState<Keuzes>(initKeuzes);
  const [klaar, setKlaar] = useState(false);
  const [activeExtraType, setActiveExtraType] = useState<string | null>(null);

  const isExtrasStap = stap === STAPPEN.length;
  const huidig = isExtrasStap ? null : STAPPEN[stap];
  const totaal = calcTotaal(keuzes);
  const voortgang = ((stap + 1) / TOTAAL_STAPPEN) * 100;

  const toggle = (name: string) => {
    if (!huidig) return;
    setKeuzes(prev => {
      const huidigeKeuzes = prev[huidig.id] || [];
      if (huidig.multi) {
        if (huidigeKeuzes.includes(name)) return { ...prev, [huidig.id]: huidigeKeuzes.filter((x: string) => x !== name) };
        if (huidigeKeuzes.length >= huidig.max) return prev;
        return { ...prev, [huidig.id]: [...huidigeKeuzes, name] };
      }
      return { ...prev, [huidig.id]: [name] };
    });
  };

  const addExtra = (type: string, naam: string) => {
    const extraDef = EXTRAS.find(e => e.name === type);
    if (!extraDef) return;
    setKeuzes(prev => ({
      ...prev,
      extras: [...prev.extras, { type, naam, prijs: extraDef.prijs }],
    }));
  };

  const removeExtra = (index: number) => {
    setKeuzes(prev => ({
      ...prev,
      extras: prev.extras.filter((_, i) => i !== index),
    }));
  };

  const kanVolgende = isExtrasStap ? true : (keuzes[huidig!.id]?.length ?? 0) > 0;

  const placeInCart = () => {
    const required = ["maat", "basis", "saus", "eiwit"] as const;
    if (!required.every((k) => keuzes[k].length > 0)) return;
    addItem({
      id: buildCustomBowlId(keuzes),
      name: buildCustomBowlName(keuzes),
      price: `€${totaal.toFixed(2)}`,
      image: null,
    });
    setKlaar(true);
  };

  if (klaar) {
    return (
      <section id="builder" className="py-24" style={{ background: "#0E1621" }}>
        <div className="container mx-auto px-5 max-w-2xl text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl" style={{ background: "rgba(89,178,89,0.15)", border: "2px solid #59B259" }}>✓</div>
            <h2 className="font-display font-bold text-3xl text-white mb-4">Bowl in Winkelwagen!</h2>
            <p className="text-base mb-2" style={{ color: "#A0AEC0" }}>
              {keuzes.basis[0]} · {keuzes.eiwit[0]} · {keuzes.saus[0]}
            </p>
            <p className="text-sm mb-4" style={{ color: "#59B259" }}>
              Open je winkelwagen om je bestelling te plaatsen.
            </p>
            {keuzes.garneringen.length > 0 && (
              <p className="text-sm mb-2" style={{ color: "#A0AEC0" }}>{keuzes.garneringen.join(" · ")}</p>
            )}
            {keuzes.extras.length > 0 && (
              <p className="text-sm mb-4" style={{ color: "#A0AEC0" }}>
                Extra's: {keuzes.extras.map(e => e.naam).join(" · ")}
              </p>
            )}
            <p className="font-bold text-3xl mb-8" style={{ color: "#F26522" }}>€{totaal.toFixed(2)}</p>
            <button
              onClick={() => { setKeuzes(initKeuzes); setStap(0); setKlaar(false); setActiveExtraType(null); }}
              className="px-8 py-4 rounded-full font-bold text-white active:scale-95 transition-all"
              style={{ background: "#F26522", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
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
    <section id="builder" className="py-16 md:py-24 relative overflow-hidden" style={{ background: "#0E1621" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "rgba(89,178,89,0.2)" }} />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(89,178,89,0.04) 0%, transparent 70%)" }} />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">

        {/* Header */}
        <motion.div
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-bold tracking-[0.22em] uppercase mb-2" style={{ color: "#59B259" }}>
            Maak Je Eigen Kom
          </p>
          <h2 className="font-display font-black text-white tracking-tight" style={{ fontSize: "clamp(2rem, 8vw, 4.5rem)" }}>
            Stel Je Bowl Samen
          </h2>
          <p className="text-base mt-2" style={{ color: "#A0AEC0" }}>Vanaf €{BASE_PRICE.toFixed(2)}</p>
        </motion.div>

        {/* Progress bar + step labels */}
        <div className="mb-6 md:mb-8">
          <div className="flex gap-3 mb-3 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: "none" }}>
            {[...STAPPEN.map(s => ({ id: s.id, titel: s.titel })), STAP_EXTRAS].map((s, i) => (
              <button
                key={s.id}
                onClick={() => i < stap && setStap(i)}
                className="text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
                style={{ color: i <= stap ? "#F26522" : "rgba(255,255,255,0.25)", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
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
        <div className="rounded-2xl md:rounded-3xl p-5 md:p-10 mb-5" style={{ background: "#1A2432", border: "1px solid rgba(255,255,255,0.07)" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={stap}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
            >
              {/* Step header */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#F26522", color: "#fff" }}>
                    Stap {stap + 1} van {TOTAAL_STAPPEN}
                  </span>
                  {!isExtrasStap && huidig!.multi && huidig!.max < 99 && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(89,178,89,0.15)", color: "#59B259" }}>
                      max. {huidig!.max} · gekozen: {(keuzes[huidig!.id] as string[]).length}
                    </span>
                  )}
                  {isExtrasStap && keuzes.extras.length > 0 && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(89,178,89,0.15)", color: "#59B259" }}>
                      {keuzes.extras.length} extra{keuzes.extras.length !== 1 ? "'s" : ""} · +€{keuzes.extras.reduce((s, e) => s + e.prijs, 0).toFixed(2)}
                    </span>
                  )}
                </div>
                <h3 className="font-display font-bold text-2xl md:text-3xl text-white mt-2">
                  {isExtrasStap ? STAP_EXTRAS.titel : huidig!.titel}
                </h3>
                <p className="text-sm mt-1" style={{ color: "#A0AEC0" }}>
                  {isExtrasStap ? STAP_EXTRAS.sub : huidig!.sub}
                </p>
              </div>

              {/* Normal steps: chip grid */}
              {!isExtrasStap && (
                <div className="flex flex-wrap gap-2">
                  {huidig!.opties.map((opt) => {
                    const geselecteerd = (keuzes[huidig!.id] as string[])?.includes(opt.name);
                    const vol = huidig!.multi && !geselecteerd && (keuzes[huidig!.id] as string[]).length >= huidig!.max;
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
                          WebkitTapHighlightColor: "transparent",
                          minHeight: 44,
                        }}
                        whileHover={!vol ? { scale: 1.04 } : {}}
                        whileTap={!vol ? { scale: 0.97 } : {}}
                        data-testid={`optie-${huidig!.id}-${opt.name.replace(/\s+/g, "-").toLowerCase()}`}
                      >
                        {opt.name}
                        {opt.extra && <span className="ml-1.5 font-normal opacity-75">{opt.extra}</span>}
                        {opt.hint && <span className="ml-1.5 text-xs opacity-60">{opt.hint}</span>}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Extras step: category cards + sub-panel */}
              {isExtrasStap && (
                <div>
                  {/* 4 extra type cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {EXTRAS.map((extra) => {
                      const count = keuzes.extras.filter(e => e.type === extra.name).length;
                      const isOpen = activeExtraType === extra.name;
                      return (
                        <motion.button
                          key={extra.name}
                          onClick={() => setActiveExtraType(isOpen ? null : extra.name)}
                          className="rounded-xl p-4 text-left border transition-all duration-200 relative"
                          style={{
                            background: isOpen ? "rgba(242,101,34,0.12)" : "rgba(255,255,255,0.04)",
                            borderColor: isOpen ? "#F26522" : count > 0 ? "rgba(242,101,34,0.4)" : "rgba(255,255,255,0.1)",
                            touchAction: "manipulation",
                            WebkitTapHighlightColor: "transparent",
                            minHeight: 80,
                          }}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          {count > 0 && (
                            <span
                              className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs font-bold text-white flex items-center justify-center"
                              style={{ background: "#F26522" }}
                            >
                              {count}
                            </span>
                          )}
                          <div className="text-xl mb-1">{extra.icon}</div>
                          <p className="font-semibold text-white text-xs leading-snug">{extra.name}</p>
                          <p className="text-xs mt-0.5 font-bold" style={{ color: "#F26522" }}>+€{extra.prijs.toFixed(2)}/stuk</p>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Sub-panel for selected extra type */}
                  <AnimatePresence>
                    {activeExtraType && (
                      <motion.div
                        key={activeExtraType}
                        initial={{ opacity: 0, height: 0, y: -8 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -8 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div
                          className="rounded-xl p-4 mb-4"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#59B259" }}>
                            Kies {activeExtraType} · +€{EXTRAS.find(e => e.name === activeExtraType)!.prijs.toFixed(2)} per keuze
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {EXTRA_SUBITEMS[activeExtraType].map((item) => (
                              <motion.button
                                key={item}
                                onClick={() => addExtra(activeExtraType, item)}
                                className="px-3 py-2 rounded-lg text-xs font-semibold border"
                                style={{
                                  background: "rgba(255,255,255,0.04)",
                                  borderColor: "rgba(255,255,255,0.1)",
                                  color: "rgba(255,255,255,0.8)",
                                  touchAction: "manipulation",
                                  WebkitTapHighlightColor: "transparent",
                                  minHeight: 36,
                                }}
                                whileHover={{ scale: 1.05, borderColor: "#F26522", color: "#fff" }}
                                whileTap={{ scale: 0.95 }}
                              >
                                + {item}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Selected extras chips */}
                  {keuzes.extras.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold mb-2" style={{ color: "#A0AEC0" }}>Geselecteerde extra's:</p>
                      <div className="flex flex-wrap gap-2">
                        {keuzes.extras.map((e, i) => (
                          <motion.span
                            key={i}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                            style={{ background: "rgba(242,101,34,0.12)", color: "#F26522", border: "1px solid rgba(242,101,34,0.3)" }}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                          >
                            {e.naam}
                            <span className="opacity-60 text-[10px]">+€{e.prijs.toFixed(2)}</span>
                            <button
                              onClick={() => removeExtra(i)}
                              className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity font-bold"
                              style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
                            >
                              ✕
                            </button>
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Price + navigation */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: "#A0AEC0" }}>Jouw totaal</p>
            <motion.p
              key={totaal}
              className="font-display font-bold text-2xl md:text-3xl"
              style={{ color: "#F26522" }}
              initial={{ scale: 1.15, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              €{totaal.toFixed(2)}
            </motion.p>
          </div>

          <div className="flex gap-2 md:gap-3">
            <button
              onClick={() => { setStap(Math.max(0, stap - 1)); setActiveExtraType(null); }}
              disabled={stap === 0}
              className="px-4 md:px-6 py-3 rounded-full font-semibold text-sm border transition-all disabled:opacity-30"
              style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", minHeight: 48 }}
              data-testid="button-vorige-stap"
            >
              Vorige
            </button>
            {stap < TOTAAL_STAPPEN - 1 ? (
              <button
                onClick={() => { if (kanVolgende) { setStap(stap + 1); setActiveExtraType(null); } }}
                disabled={!kanVolgende}
                className="px-5 md:px-8 py-3 rounded-full font-bold text-sm text-white transition-all disabled:opacity-35 active:scale-95"
                style={{ background: "#F26522", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", minHeight: 48 }}
                data-testid="button-volgende-stap"
              >
                Volgende
              </button>
            ) : (
              <button
                onClick={placeInCart}
                className="px-4 md:px-8 py-3 rounded-full font-bold text-sm text-white transition-all active:scale-95"
                style={{ background: "#59B259", boxShadow: "0 0 18px rgba(89,178,89,0.3)", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", minHeight: 48 }}
                data-testid="button-bestelling-plaatsen"
              >
                Plaatsen · €{totaal.toFixed(2)}
              </button>
            )}
          </div>
        </div>

        {/* Summary chips */}
        {(Object.entries(keuzes).filter(([k]) => k !== "extras").some(([, v]) => (v as string[]).length > 0) || keuzes.extras.length > 0) && (
          <motion.div className="mt-5 flex flex-wrap gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {Object.entries(keuzes)
              .filter(([k]) => k !== "extras")
              .flatMap(([, vals]) => vals as string[])
              .map((v) => (
                <span
                  key={v}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: "rgba(89,178,89,0.1)", color: "#59B259", border: "1px solid rgba(89,178,89,0.2)" }}
                >
                  {v}
                </span>
              ))}
            {keuzes.extras.map((e, i) => (
              <span
                key={`extra-${i}`}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: "rgba(242,101,34,0.1)", color: "#F26522", border: "1px solid rgba(242,101,34,0.2)" }}
              >
                {e.naam}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
