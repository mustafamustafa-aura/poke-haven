import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── The 4 hero bowls (transparent PNG backgrounds) ─────────────────────── */
const BOWLS = [
  {
    id: "haven",
    name: "Haven Speciaal",
    tagline: "Tuna · Salmon · Crab · Avocado · Tobiko",
    price: "€16.50",
    image: "/bowl-haven.png",
  },
  {
    id: "garnalen",
    name: "Poke Garnalen",
    tagline: "Prawns · Edamame · Radish · Ponzu",
    price: "€15.50",
    image: "/bowl-garnalen-png.png",
  },
  {
    id: "tofu",
    name: "Shoyu Tofu",
    tagline: "Crispy Tofu · Corn · Cucumber · Avocado",
    price: "€13.50",
    image: "/bowl-tofu.png",
  },
  {
    id: "vlees",
    name: "Vlees Speciaal",
    tagline: "Marinated Beef · Bell Pepper · Sesame",
    price: "€17.50",
    image: "/bowl-vlees.png",
  },
];

/* ─── Orbital geometry (SVG units: viewBox 0 0 700 600) ──────────────────── */
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

/* ─── Floating leaf particles ─────────────────────────────────────────────── */
const LEAVES = [
  { id: 1, w: 52, top: "9%",  left: "5%",  z: 5,  dur: 7.5, delay: 0,    rot: 18,  tx: 40, ty: -30 },
  { id: 2, w: 36, top: "22%", left: "2%",  z: 20, dur: 9.0, delay: -3,   rot: -22, tx: 25, ty: -50 },
  { id: 3, w: 28, top: "58%", left: "3%",  z: 5,  dur: 8.2, delay: -5,   rot: 15,  tx: 35, ty: -40 },
  { id: 4, w: 20, top: "75%", left: "6%",  z: 20, dur: 6.8, delay: -1.5, rot: -14, tx: 20, ty: -35 },
  { id: 5, w: 44, top: "86%", left: "2%",  z: 5,  dur: 10,  delay: -7,   rot: 20,  tx: 45, ty: -25 },
  { id: 6, w: 30, top: "42%", left: "1%",  z: 20, dur: 8.5, delay: -4,   rot: -18, tx: 30, ty: -45 },
  { id: 7, w: 24, top: "35%", right: "4%", z: 5,  dur: 7.2, delay: -2,   rot: 16,  tx: -30, ty: -35 },
  { id: 8, w: 38, top: "65%", right: "3%", z: 20, dur: 9.5, delay: -6,   rot: -20, tx: -40, ty: -28 },
];

function LeafSvg({ w }: { w: number }) {
  return (
    <svg width={w} height={w} viewBox="0 0 50 50">
      <ellipse cx="25" cy="25" rx="21" ry="10" fill="#59B259" opacity="0.8" transform="rotate(-38 25 25)" />
      <line x1="25" y1="14" x2="25" y2="38" stroke="#59B259" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

const SPRING = { type: "spring" as const, stiffness: 120, damping: 14, mass: 1 };

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
      {/* Radial glow behind bowl area */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[55vw] h-[90vh] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, #1A2432 0%, #0E1621 70%)",
          zIndex: 1,
        }}
      />

      {/* ── Behind-bowl leaves (z:5) ──────────────────────────────────────── */}
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

      {/* ── Main grid ─────────────────────────────────────────────────────── */}
      <div
        className="container mx-auto px-6 relative grid lg:grid-cols-[1fr_1fr] gap-8 items-center min-h-[calc(100vh-5rem)]"
        style={{ zIndex: 10 }}
      >
        {/* ── Left: Text ──────────────────────────────────────────────────── */}
        <div className="flex flex-col items-start text-left space-y-6">

          {/* Headline — staggered word reveal */}
          {["Fresh.", "Bold.", "Poke."].map((word, i) => (
            <div key={word} className="overflow-hidden">
              <motion.span
                className="block font-display font-black leading-[0.85] tracking-tighter"
                style={{
                  fontSize: "clamp(3.5rem, 9vw, 8.5rem)",
                  color: word === "Poke." ? "#F26522" : "#FFFFFF",
                }}
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
            Ocean vibes, tropical energy, and the freshest ingredients — crafted fresh to order.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex gap-3 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={entered ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.58 }}
          >
            <button
              onClick={() => document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" })}
              data-testid="button-build-bowl"
              className="px-8 py-4 rounded-full font-bold text-base text-white transition-all duration-300 hover:scale-[1.03] active:scale-95"
              style={{ background: "#F26522", boxShadow: "0 0 24px rgba(242,101,34,0.35)" }}
            >
              Order Now
            </button>
            <button
              onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
              data-testid="button-see-menu"
              className="px-8 py-4 rounded-full font-bold text-base transition-all duration-300 hover:scale-[1.03]"
              style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#A0AEC0" }}
            >
              Our Menu
            </button>
          </motion.div>

          {/* Nav text "Previous · Next" style */}
          <motion.div
            className="flex gap-6 pt-2"
            initial={{ opacity: 0 }}
            animate={entered ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <button
              onClick={() => navigate((active - 1 + BOWLS.length) % BOWLS.length)}
              className="text-sm font-semibold flex items-center gap-2 transition-colors"
              style={{ color: "#A0AEC0" }}
              data-testid="button-prev-text"
            >
              <span style={{ display: "inline-block", width: 20, height: 1, background: "#F26522", verticalAlign: "middle" }} />
              Previous
            </button>
            <button
              onClick={() => navigate((active + 1) % BOWLS.length)}
              className="text-sm font-semibold flex items-center gap-2 transition-colors"
              style={{ color: "#A0AEC0" }}
              data-testid="button-next-text"
            >
              Next
              <span style={{ display: "inline-block", width: 20, height: 1, background: "#F26522", verticalAlign: "middle" }} />
            </button>
          </motion.div>

          {/* Active bowl label + price */}
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
              <p className="text-sm mt-0.5" style={{ color: "#A0AEC0" }} data-testid="text-bowl-tagline">
                {BOWLS[active].tagline}
              </p>
              <p className="font-bold text-xl mt-1" style={{ color: "#F26522" }} data-testid="text-bowl-price">
                {BOWLS[active].price}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Right: Orbital carousel ──────────────────────────────────────── */}
        <div className="relative" style={{ height: "min(620px, 82vh)" }}>
          {/* SVG arc track */}
          <svg
            viewBox="0 0 700 600"
            className="absolute inset-0 w-full h-full"
            style={{ overflow: "visible" }}
            aria-hidden="true"
          >
            <path
              d={ARC_PATH}
              fill="none"
              stroke="#F26522"
              strokeOpacity="0.35"
              strokeWidth="1.5"
              strokeDasharray="6 8"
              strokeLinecap="round"
            />
            {SLOTS.slice(1).map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r="3.5" fill="#F26522" fillOpacity="0.3" />
            ))}
          </svg>

          {/* ── Active bowl — Layer 2 (z:10), spring spin-in/out ── */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={BOWLS[active].id + "-main"}
              custom={direction}
              className="absolute"
              style={{
                width: 320, height: 320,
                left: SLOTS[0].x / 700 * 100 + "%",
                top:  SLOTS[0].y / 600 * 100 + "%",
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
              variants={{
                enter: (dir: number) => ({ rotate: dir * 360, scale: 0.5, opacity: 0, x: dir * 80, y: dir * 60 }),
                center: { rotate: 0, scale: 1, opacity: 1, x: 0, y: 0 },
                exit:  (dir: number) => ({ rotate: dir * -360, scale: 0, opacity: 0, x: dir * -80, y: dir * -60 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={SPRING}
            >
              {/* Continuous float */}
              <motion.img
                src={BOWLS[active].image}
                alt={BOWLS[active].name}
                className="w-full h-full object-contain"
                style={{ filter: "drop-shadow(0 32px 64px rgba(0,0,0,0.7))" }}
                animate={{ y: [-12, 12, -12] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                data-testid={`img-hero-bowl-${BOWLS[active].id}`}
              />
              {/* Price tag */}
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

          {/* ── Thumbnail bowls on arc ── */}
          {thumbBowls.map((bowl, tIdx) => {
            const slot = tIdx + 1;
            if (slot >= SLOTS.length) return null;
            const pos = SLOTS[slot];
            const sz = slot <= 2 ? 80 : 80;
            const isHighlight = slot === 1;
            return (
              <motion.button
                key={bowl.id + "-thumb"}
                className="absolute rounded-full overflow-hidden transition-all"
                style={{
                  width: sz, height: sz,
                  left: pos.x / 700 * 100 + "%",
                  top: pos.y / 600 * 100 + "%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 8,
                  border: isHighlight ? "2px solid #F26522" : "2px solid #1A2432",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                  background: "#1A2432",
                }}
                onClick={() => navigate(BOWLS.indexOf(bowl))}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: isHighlight ? 1.15 : 1 }}
                transition={{ ...SPRING, delay: 0.08 * tIdx }}
                whileHover={{ scale: 1.18, borderColor: "#F26522" }}
                data-testid={`button-bowl-thumb-${bowl.id}`}
              >
                <img src={bowl.image} alt={bowl.name} className="w-full h-full object-contain" />
              </motion.button>
            );
          })}

          {/* Dot pagination */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 20 }}>
            {BOWLS.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => navigate(i)}
                className="rounded-full"
                animate={{
                  width: i === active ? 22 : 7,
                  background: i === active ? "#F26522" : "rgba(255,255,255,0.2)",
                }}
                style={{ height: 7 }}
                transition={{ duration: 0.3 }}
                data-testid={`button-dot-${i}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Front leaves (z:20 — pass over bowl) ─────────────────────────── */}
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

      {/* "Stay healthy · Stay fresh" bottom text */}
      <div
        className="absolute bottom-6 left-6 text-xs font-medium tracking-widest uppercase"
        style={{ color: "#A0AEC0", opacity: 0.6, zIndex: 10 }}
      >
        Stay Fresh · Stay Healthy
      </div>
    </section>
  );
}
