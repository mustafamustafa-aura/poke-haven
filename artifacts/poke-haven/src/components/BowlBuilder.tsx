import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BASES = [
  { name: "White Rice", price: 0, cal: "280 kcal" },
  { name: "Brown Rice", price: 0, cal: "260 kcal" },
  { name: "Mixed Greens", price: 0, cal: "40 kcal" },
  { name: "Zoodles", price: 0, cal: "35 kcal" },
];

const PROTEINS = [
  { name: "Ahi Tuna", price: 3.5, cal: "120 kcal" },
  { name: "Atlantic Salmon", price: 3.5, cal: "140 kcal" },
  { name: "King Prawns", price: 3.5, cal: "100 kcal" },
  { name: "Wagyu Beef", price: 4.5, cal: "160 kcal" },
  { name: "Crispy Tofu", price: 2.0, cal: "80 kcal" },
  { name: "Chicken Teriyaki", price: 2.5, cal: "110 kcal" },
];

const TOPPINGS = [
  { name: "Edamame", price: 0 },
  { name: "Mango", price: 0.5 },
  { name: "Avocado", price: 0.75 },
  { name: "Cucumber", price: 0 },
  { name: "Tobiko", price: 1.0 },
  { name: "Seaweed Salad", price: 0.5 },
  { name: "Sweetcorn", price: 0 },
  { name: "Crispy Onion", price: 0 },
  { name: "Cherry Tomato", price: 0 },
  { name: "Radish", price: 0 },
];

const SAUCES = [
  { name: "Ponzu", price: 0 },
  { name: "Spicy Mayo", price: 0 },
  { name: "Sesame Ginger", price: 0 },
  { name: "Shoyu", price: 0 },
  { name: "Unagi Sauce", price: 0.5 },
  { name: "Sriracha Mayo", price: 0 },
];

const BASE_PRICE = 10.5;

const STEPS = [
  { id: "base",     title: "Choose Your Base",    sub: "The foundation of your bowl", options: BASES,    multi: false },
  { id: "protein",  title: "Pick Your Protein",   sub: "Fresh catch, daily delivered", options: PROTEINS,  multi: false },
  { id: "toppings", title: "Add Your Toppings",   sub: "Up to 5 toppings included",    options: TOPPINGS,  multi: true  },
  { id: "sauce",    title: "Finish with Sauce",   sub: "One sauce of your choice",     options: SAUCES,    multi: false },
];

type Sel = Record<string, string[]>;

const initSel: Sel = { base: [], protein: [], toppings: [], sauce: [] };

function calcTotal(sel: Sel): number {
  let total = BASE_PRICE;
  const protein = PROTEINS.find(p => sel.protein?.includes(p.name));
  if (protein) total += protein.price;
  const toppingExtras = (sel.toppings || []).slice(5);
  toppingExtras.forEach(t => {
    const tp = TOPPINGS.find(x => x.name === t);
    if (tp) total += tp.price;
  });
  const sauce = SAUCES.find(s => sel.sauce?.includes(s.name));
  if (sauce) total += sauce.price;
  const mango = TOPPINGS.find(t => t.name === "Mango");
  if (mango && sel.toppings?.includes("Mango")) total += 0;
  const avocado = TOPPINGS.find(t => t.name === "Avocado");
  if (avocado && sel.toppings?.includes("Avocado")) total += avocado.price;
  const tobiko = TOPPINGS.find(t => t.name === "Tobiko");
  if (tobiko && sel.toppings?.includes("Tobiko")) total += tobiko.price;
  return total;
}

export function BowlBuilder() {
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState<Sel>(initSel);
  const [done, setDone] = useState(false);

  const cur = STEPS[step];

  const toggle = (name: string) => {
    setSel(prev => {
      const current = prev[cur.id] || [];
      if (cur.multi) {
        return {
          ...prev,
          [cur.id]: current.includes(name) ? current.filter(x => x !== name) : [...current, name],
        };
      }
      return { ...prev, [cur.id]: [name] };
    });
  };

  const canNext = (sel[cur.id]?.length ?? 0) > 0;
  const total = calcTotal(sel);
  const progress = ((step + 1) / STEPS.length) * 100;

  if (done) {
    return (
      <section id="builder" className="py-28 bg-background">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl"
              style={{ background: "rgba(155,227,106,0.15)", border: "2px solid #9BE36A" }}
            >
              ✓
            </div>
            <h2 className="font-display font-bold text-4xl text-foreground mb-4">Bowl Queued!</h2>
            <p className="text-foreground/50 text-lg mb-8">
              {sel.base[0]} · {sel.protein[0]} · {sel.sauce[0]}
            </p>
            <p className="font-bold text-3xl mb-10" style={{ color: "#FF6B47" }}>
              €{total.toFixed(2)}
            </p>
            <button
              onClick={() => { setSel(initSel); setStep(0); setDone(false); }}
              className="px-8 py-4 rounded-full font-bold text-white"
              style={{ background: "linear-gradient(135deg,#FF6B47,#e8381a)" }}
              data-testid="button-order-again"
            >
              Build Another Bowl
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="builder" className="py-28 bg-background relative overflow-hidden">
      <div
        className="absolute bottom-0 left-0 w-[50vw] h-[50vw] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(155,227,106,0.05) 0%, transparent 70%)" }}
      />
      <div className="container mx-auto px-6 max-w-4xl relative z-10">

        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-bold tracking-[0.22em] uppercase mb-3" style={{ color: "#9BE36A" }}>
            Customise
          </p>
          <h2
            className="font-display font-black text-foreground tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
          >
            Build Your Bowl
          </h2>
          <p className="text-foreground/45 text-lg mt-3">Starting from €{BASE_PRICE.toFixed(2)}</p>
        </motion.div>

        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex justify-between mb-3">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => i < step && setStep(i)}
                className="text-xs font-semibold transition-colors"
                style={{ color: i <= step ? "#FF6B47" : "rgba(248,244,236,0.3)" }}
                data-testid={`step-label-${s.id}`}
              >
                {i + 1}. {s.title.split(" ").slice(-1)[0]}
              </button>
            ))}
          </div>
          <div className="h-1.5 rounded-full bg-foreground/8 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #FF6B47, #9BE36A)" }}
              animate={{ width: progress + "%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Step card */}
        <div
          className="rounded-3xl p-8 md:p-12 mb-6"
          style={{ background: "hsl(210 45% 13%)", border: "1px solid rgba(248,244,236,0.07)" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28 }}
            >
              <div className="mb-8">
                <h3 className="font-display font-bold text-3xl text-foreground mb-1">{cur.title}</h3>
                <p className="text-foreground/40 text-sm">{cur.sub}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                {cur.options.map((opt) => {
                  const isSelected = sel[cur.id]?.includes(opt.name);
                  const extra = (opt as any).price > 0 ? ` +€${(opt as any).price.toFixed(2)}` : "";
                  return (
                    <motion.button
                      key={opt.name}
                      onClick={() => toggle(opt.name)}
                      className="px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border"
                      style={{
                        background: isSelected ? "#FF6B47" : "rgba(248,244,236,0.04)",
                        borderColor: isSelected ? "#FF6B47" : "rgba(248,244,236,0.1)",
                        color: isSelected ? "#fff" : "rgba(248,244,236,0.7)",
                        boxShadow: isSelected ? "0 8px 20px -6px rgba(255,107,71,0.45)" : "none",
                      }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      data-testid={`option-${cur.id}-${opt.name.replace(/\s+/g, "-").toLowerCase()}`}
                    >
                      {opt.name}{extra}
                      {(opt as any).cal && (
                        <span className="ml-2 opacity-50 font-normal">{(opt as any).cal}</span>
                      )}
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
            <p className="text-foreground/40 text-xs uppercase tracking-widest mb-0.5">Your total</p>
            <motion.p
              key={total}
              className="font-display font-bold text-3xl"
              style={{ color: "#FF6B47" }}
              initial={{ scale: 1.15, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              €{total.toFixed(2)}
            </motion.p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="px-6 py-3 rounded-full font-semibold text-sm border transition-all disabled:opacity-30"
              style={{ borderColor: "rgba(248,244,236,0.15)", color: "rgba(248,244,236,0.6)" }}
              data-testid="button-step-back"
            >
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canNext}
                className="px-8 py-3 rounded-full font-bold text-sm text-white transition-all disabled:opacity-35 hover:scale-105 active:scale-95"
                style={{ background: "linear-gradient(135deg,#FF6B47,#e8381a)" }}
                data-testid="button-step-next"
              >
                Next Step
              </button>
            ) : (
              <button
                disabled={!canNext}
                onClick={() => setDone(true)}
                className="px-8 py-3 rounded-full font-bold text-sm transition-all disabled:opacity-35 hover:scale-105 active:scale-95"
                style={{ background: "#9BE36A", color: "#0D1B2A", boxShadow: "0 0 18px rgba(155,227,106,0.3)" }}
                data-testid="button-order-complete"
              >
                Add to Order · €{total.toFixed(2)}
              </button>
            )}
          </div>
        </div>

        {/* Summary chips */}
        {Object.values(sel).some(v => v.length > 0) && (
          <motion.div
            className="mt-8 flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {Object.entries(sel).flatMap(([, vals]) => vals).map((v) => (
              <span
                key={v}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: "rgba(155,227,106,0.1)", color: "#9BE36A", border: "1px solid rgba(155,227,106,0.2)" }}
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
