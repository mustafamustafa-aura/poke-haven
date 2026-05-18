import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOWLS = [
  { id: "haven",    name: "Haven Speciaal",  tagline: "Zalm & tonijn · Avocado · Surimi · Masago",          price: "€14.90", image: "/bowl-haven.png" },
  { id: "garnalen", name: "Poke Garnalen",   tagline: "Garnaal · Edamame · Rode biet · Sesammix",            price: "€13.90", image: "/bowl-garnalen-png.png" },
  { id: "tofu",     name: "Shoyu Tofu",      tagline: "Gemarineerde tofu · Maïs · Komkommer · Avocado",     price: "€13.90", image: "/bowl-tofu.png" },
  { id: "vlees",    name: "Vlees Speciaal",  tagline: "Gemarineerd rundvlees · Paprika · Sesammix",          price: "€13.90", image: "/bowl-vlees.png" },
];

const OX = 760, OY = 300, OR = 320;
const ANGLES = [180, 212, 247, 148, 113];
function pt(deg: number) {
  const r = (deg * Math.PI) / 180;
  return { x: OX + OR * Math.cos(r), y: OY + OR * Math.sin(r) };
}
const SLOTS = ANGLES.map(pt);
const arcStart = pt(247);
const arcEnd   = pt(113);
const ARC_PATH = `M ${arcStart.x.toFixed(1)} ${arcStart.y.toFixed(1)} A ${OR} ${OR} 0 0 0 ${arcEnd.x.toFixed(1)} ${arcEnd.y.toFixed(1)}`;

const LEAVES = [
  { id: 1, w: 52, top: "9%",  left: "5%",  z: 5,  dur: 8.5, delay: 0,    rot: 8,   tx: 18, ty: -14 },
  { id: 2, w: 36, top: "22%", left: "2%",  z: 20, dur: 10,  delay: -3,   rot: -10, tx: 12, ty: -22 },
  { id: 3, w: 28, top: "58%", left: "3%",  z: 5,  dur: 9.2, delay: -5,   rot: 7,   tx: 16, ty: -18 },
  { id: 4, w: 20, top: "75%", left: "6%",  z: 20, dur: 7.8, delay: -1.5, rot: -6,  tx: 10, ty: -14 },
  { id: 5, w: 44, top: "86%", left: "2%",  z: 5,  dur: 11,  delay: -7,   rot: 9,   tx: 20, ty: -12 },
  { id: 6, w: 30, top: "42%", left: "1%",  z: 20, dur: 9.5, delay: -4,   rot: -8,  tx: 14, ty: -20 },
  { id: 7, w: 24, top: "35%", right: "4%", z: 5,  dur: 8.2, delay: -2,   rot: 7,   tx: -14, ty: -16 },
  { id: 8, w: 38, top: "65%", right: "3%", z: 20, dur: 10.5,delay: -6,   rot: -9,  tx: -18, ty: -12 },
];

function LeafSvg({ w }: { w: number }) {
  return (
    <svg width={w} height={w} viewBox="0 0 50 50">
      <ellipse cx="25" cy="25" rx="21" ry="10" fill="#59B259" opacity="0.8" transform="rotate(-38 25 25)" />
      <line x1="25" y1="14" x2="25" y2="38" stroke="#59B259" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

const SPRING        = { type: "spring" as const, stiffness: 220, damping: 32, mass: 0.75 };
const SPRING_MOBILE = { duration: 0.48, ease: [0.22, 1, 0.36, 1] } as const;

export function Hero() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [entered, setEntered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setDirection(1);
      setActive((i) => (i + 1) % BOWLS.length);
    }, 4800);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const navigate = (next: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDirection(next > active || (active === BOWLS.length - 1 && next === 0) ? 1 : -1);
    setActive(next);
    startTimer();
  };

  const thumbBowls = BOWLS.filter((_, i) => i !== active);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
      style={{ background: "#0E1621" }}
    >
      {/* Radial glow */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[55vw] h-[90vh] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, #1A2432 0%, #0E1621 70%)", zIndex: 1 }}
      />

      {/* Behind-bowl leaves z:5 */}
      {LEAVES.filter(l => l.z === 5).map((l) => (
        <motion.div
          key={l.id}
          className="absolute pointer-events-none"
          style={{ top: l.top, left: (l as any).left, right: (l as any).right, zIndex: 5 }}
          animate={{ x: [0, l.tx, 0], y: [0, l.ty, 0], rotate: [0, l.rot, 0] }}
          transition={{ duration: l.dur, delay: l.delay, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
        >
          <LeafSvg w={l.w} />
        </motion.div>
      ))}

      <div
        className="container mx-auto px-5 relative w-full"
        style={{ zIndex: 10 }}
      >
        {/* ── MOBILE layout (hidden on lg+) ── */}
        <div className="flex flex-col items-start text-left lg:hidden pt-4 pb-8">
          {/* Mobile bowl image — centered, large */}
          <div className="relative w-full flex justify-center mb-2" style={{ minHeight: 240 }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={BOWLS[active].id + "-mobile"}
                custom={direction}
                className="absolute"
                style={{ width: 240, height: 240 }}
                variants={{
                  enter: (dir: number) => ({ x: dir * 36, y: 10, rotate: dir * 4, scale: 0.9, opacity: 0 }),
                  center: { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
                  exit:  (dir: number) => ({ x: dir * -36, y: -10, rotate: dir * -4, scale: 0.9, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={SPRING_MOBILE}
              >
                <motion.img
                  src={BOWLS[active].image}
                  alt={BOWLS[active].name}
                  className="w-full h-full object-contain"
                  style={{ filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.7))" }}
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute top-0 right-0 px-3 py-1.5 rounded-full font-bold text-sm text-white"
                  style={{ background: "#F26522", boxShadow: "0 4px 14px rgba(242,101,34,0.5)" }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 20 }}
                >
                  {BOWLS[active].price}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Headline */}
          {["Vers.", "Gedurfd.", "Poke."].map((word, i) => (
            <div key={word} className="overflow-hidden">
              <motion.span
                className="block font-display font-black leading-[0.85] tracking-tighter"
                style={{ fontSize: "clamp(3rem, 15vw, 5rem)", color: word === "Poke." ? "#F26522" : "#FFFFFF" }}
                initial={{ y: "108%", opacity: 0 }}
                animate={entered ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.75, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
              </motion.span>
            </div>
          ))}

          <motion.p
            className="text-sm mt-4 leading-relaxed max-w-xs"
            style={{ color: "#A0AEC0" }}
            initial={{ opacity: 0, y: 16 }}
            animate={entered ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Ocean vibes, tropische energie en de meest verse ingrediënten — vers voor u bereid.
          </motion.p>

          {/* Bowl name / tagline */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active + "-lbl-mob"}
              className="mt-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-display font-bold text-lg text-white">{BOWLS[active].name}</p>
              <p className="text-xs mt-0.5" style={{ color: "#A0AEC0" }}>{BOWLS[active].tagline}</p>
            </motion.div>
          </AnimatePresence>

          {/* Dot pagination (mobile) */}
          <div className="flex gap-2 mt-5">
            {BOWLS.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => navigate(i)}
                className="rounded-full"
                animate={{ width: i === active ? 22 : 7, background: i === active ? "#F26522" : "rgba(255,255,255,0.2)" }}
                style={{ height: 7, touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>

          {/* CTA buttons */}
          <motion.div
            className="flex gap-3 flex-wrap mt-6"
            initial={{ opacity: 0, y: 16 }}
            animate={entered ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            <button
              onClick={() => document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" })}
              style={{ background: "#F26522", boxShadow: "0 0 24px rgba(242,101,34,0.35)", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
              className="px-7 py-3.5 rounded-full font-bold text-base text-white transition-all duration-300 active:scale-95"
              data-testid="button-bestel-nu"
            >
              Bestel Nu
            </button>
            <button
              onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
              style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#A0AEC0", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
              className="px-7 py-3.5 rounded-full font-bold text-base transition-all duration-300 active:scale-95"
              data-testid="button-ons-menu"
            >
              Ons Menu
            </button>
          </motion.div>
        </div>

        {/* ── DESKTOP layout (hidden below lg) ── */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_1fr] gap-8 items-center min-h-[calc(100vh-5rem)]">
          {/* Left: Text */}
          <div className="flex flex-col items-start text-left space-y-5">
            {["Vers.", "Gedurfd.", "Poke."].map((word, i) => (
              <div key={word} className="overflow-hidden">
                <motion.span
                  className="block font-display font-black leading-[0.85] tracking-tighter"
                  style={{ fontSize: "clamp(3.5rem, 9vw, 8.5rem)", color: word === "Poke." ? "#F26522" : "#FFFFFF" }}
                  initial={{ y: "108%", opacity: 0 }}
                  animate={entered ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.75, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                </motion.span>
              </div>
            ))}

            <motion.p
              className="text-base max-w-xs leading-relaxed"
              style={{ color: "#A0AEC0" }}
              initial={{ opacity: 0, y: 20 }}
              animate={entered ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.45 }}
            >
              Ocean vibes, tropische energie en de meest verse ingrediënten — vers voor u bereid.
            </motion.p>

            <motion.div
              className="flex gap-3 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={entered ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.58 }}
            >
              <button
                onClick={() => document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" })}
                style={{ background: "#F26522", boxShadow: "0 0 24px rgba(242,101,34,0.35)", touchAction: "manipulation" }}
                className="px-8 py-4 rounded-full font-bold text-base text-white transition-all duration-300 hover:scale-[1.03] active:scale-95"
                data-testid="button-bestel-nu"
              >
                Bestel Nu
              </button>
              <button
                onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
                style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#A0AEC0", touchAction: "manipulation" }}
                className="px-8 py-4 rounded-full font-bold text-base transition-all duration-300 hover:scale-[1.03]"
                data-testid="button-ons-menu"
              >
                Ons Menu
              </button>
            </motion.div>

            <motion.div
              className="flex gap-6 pt-1"
              initial={{ opacity: 0 }}
              animate={entered ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <button
                onClick={() => navigate((active - 1 + BOWLS.length) % BOWLS.length)}
                className="text-sm font-semibold flex items-center gap-2"
                style={{ color: "#A0AEC0", touchAction: "manipulation" }}
                data-testid="button-vorige"
              >
                <span style={{ display: "inline-block", width: 20, height: 1, background: "#F26522", verticalAlign: "middle" }} />
                Vorige
              </button>
              <button
                onClick={() => navigate((active + 1) % BOWLS.length)}
                className="text-sm font-semibold flex items-center gap-2"
                style={{ color: "#A0AEC0", touchAction: "manipulation" }}
                data-testid="button-volgende"
              >
                Volgende
                <span style={{ display: "inline-block", width: 20, height: 1, background: "#F26522", verticalAlign: "middle" }} />
              </button>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active + "-lbl"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28 }}
              >
                <p className="font-display font-bold text-2xl text-white" data-testid="text-bowl-name">
                  {BOWLS[active].name}
                </p>
                <p className="text-sm mt-0.5" style={{ color: "#A0AEC0" }}>{BOWLS[active].tagline}</p>
                <p className="font-bold text-xl mt-1" style={{ color: "#F26522" }}>{BOWLS[active].price}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Orbital carousel */}
          <div className="relative" style={{ height: "min(620px, 82vh)" }}>
            <svg viewBox="0 0 700 600" className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }} aria-hidden="true">
              <path d={ARC_PATH} fill="none" stroke="#F26522" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="6 8" strokeLinecap="round" />
              {SLOTS.slice(1).map((s, i) => (
                <circle key={i} cx={s.x} cy={s.y} r="3.5" fill="#F26522" fillOpacity="0.3" />
              ))}
            </svg>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={BOWLS[active].id + "-main"}
                custom={direction}
                className="absolute"
                style={{ width: 320, height: 320, left: SLOTS[0].x / 700 * 100 + "%", top: SLOTS[0].y / 600 * 100 + "%", transform: "translate(-50%, -50%)", zIndex: 10 }}
                variants={{
                  enter: (dir: number) => ({ x: dir * 70, y: 16, rotate: dir * 5, scale: 0.88, opacity: 0 }),
                  center: { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
                  exit:  (dir: number) => ({ x: dir * -70, y: -16, rotate: dir * -5, scale: 0.88, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={SPRING}
              >
                <motion.img
                  src={BOWLS[active].image}
                  alt={BOWLS[active].name}
                  className="w-full h-full object-contain"
                  style={{ filter: "drop-shadow(0 32px 64px rgba(0,0,0,0.7))" }}
                  animate={{ y: [-7, 7, -7], x: [-2, 2, -2] }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute -top-2 -right-2 px-3 py-1.5 rounded-full font-bold text-sm text-white"
                  style={{ background: "#F26522", boxShadow: "0 4px 14px rgba(242,101,34,0.5)" }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.25, type: "spring", stiffness: 400, damping: 20 }}
                >
                  {BOWLS[active].price}
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {thumbBowls.map((bowl, tIdx) => {
              const slot = tIdx + 1;
              if (slot >= SLOTS.length) return null;
              const pos = SLOTS[slot];
              const isHighlight = slot === 1;
              return (
                <motion.button
                  key={bowl.id + "-thumb"}
                  className="absolute rounded-full overflow-hidden"
                  style={{
                    width: 80, height: 80,
                    left: pos.x / 700 * 100 + "%", top: pos.y / 600 * 100 + "%",
                    transform: "translate(-50%, -50%)", zIndex: 8,
                    border: isHighlight ? "2px solid #F26522" : "2px solid #1A2432",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.4)", background: "#1A2432",
                    touchAction: "manipulation",
                  }}
                  onClick={() => navigate(BOWLS.indexOf(bowl))}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: isHighlight ? 1.15 : 1 }}
                  transition={{ ...SPRING, delay: 0.08 * tIdx }}
                  whileHover={{ scale: 1.18, borderColor: "#F26522" }}
                >
                  <img src={bowl.image} alt={bowl.name} className="w-full h-full object-contain" />
                </motion.button>
              );
            })}

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 20 }}>
              {BOWLS.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => navigate(i)}
                  className="rounded-full"
                  animate={{ width: i === active ? 22 : 7, background: i === active ? "#F26522" : "rgba(255,255,255,0.2)" }}
                  style={{ height: 7, touchAction: "manipulation" }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Front leaves z:20 */}
      {LEAVES.filter(l => l.z === 20).map((l) => (
        <motion.div
          key={l.id}
          className="absolute pointer-events-none"
          style={{ top: l.top, left: (l as any).left, right: (l as any).right, zIndex: 20 }}
          animate={{ x: [0, l.tx, 0], y: [0, l.ty, 0], rotate: [0, l.rot, 0] }}
          transition={{ duration: l.dur, delay: l.delay, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
        >
          <LeafSvg w={l.w} />
        </motion.div>
      ))}

      <div className="absolute bottom-6 left-6 text-xs font-medium tracking-widest uppercase" style={{ color: "#A0AEC0", opacity: 0.6, zIndex: 10 }}>
        Vers Bereid · Elke Dag
      </div>
    </section>
  );
}
