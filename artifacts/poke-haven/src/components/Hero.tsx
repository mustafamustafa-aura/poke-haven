import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";

const BOWLS = [
  {
    id: "haven",
    name: "Haven Speciaal",
    tagline: "Tuna · Salmon · Crab · Avocado",
    price: "€16.50",
    image: "/bowl-haven-speciaal.webp",
  },
  {
    id: "garnalen",
    name: "Poke Garnalen",
    tagline: "Prawns · Edamame · Radish · Ponzu",
    price: "€15.50",
    image: "/bowl-garnalen.webp",
  },
  {
    id: "tofu",
    name: "Shoyu Tofu",
    tagline: "Crispy Tofu · Corn · Cucumber · Sesame",
    price: "€13.50",
    image: "/bowl-shoyu-tofu.webp",
  },
  {
    id: "vlees",
    name: "Vlees Speciaal",
    tagline: "Wagyu Beef · Tomato · Bell Pepper · Shoyu",
    price: "€17.50",
    image: "/bowl-vlees-speciaal.webp",
  },
];

/* ─── Orbital geometry in SVG units (viewBox="0 0 700 600") ───────────────── */
const OX = 760; // orbit centre x  (off-screen right)
const OY = 300; // orbit centre y
const OR = 320; // orbit radius

const ANGLES = [180, 212, 247, 148, 113]; // [active, thumb1-upper-near, thumb2-upper-far, thumb3-lower-near, thumb4-lower-far]

function pt(deg: number) {
  const r = (deg * Math.PI) / 180;
  return { x: OX + OR * Math.cos(r), y: OY + OR * Math.sin(r) };
}

const SLOTS = ANGLES.map(pt);
// SLOTS[0] → active centre ≈ (440, 300)

/* ─── Debris particles ────────────────────────────────────────────────────── */
const DEBRIS = [
  { id: 1, shape: "circle", color: "#FF6B47", w: 56, h: 56, top: "8%",  left: "4%",  zBehind: true,  dur: 3.8, delay: 0,   rotRange: 20,  parallax: 0.6 },
  { id: 2, shape: "leaf",   color: "#9BE36A", w: 48, h: 48, top: "18%", left: "2%",  zBehind: false, dur: 4.5, delay: 0.9, rotRange: -25, parallax: 1.2 },
  { id: 3, shape: "ring",   color: "#9BE36A", w: 60, h: 60, top: "60%", left: "3%",  zBehind: true,  dur: 5.1, delay: 0.4, rotRange: 15,  parallax: 0.4 },
  { id: 4, shape: "dot",    color: "#FF6B47", w: 24, h: 24, top: "75%", left: "6%",  zBehind: false, dur: 3.2, delay: 1.2, rotRange: -18, parallax: 0.8 },
  { id: 5, shape: "leaf",   color: "#FF6B47", w: 40, h: 40, top: "88%", left: "2%",  zBehind: true,  dur: 4.0, delay: 0.6, rotRange: 22,  parallax: 1.0 },
  { id: 6, shape: "circle", color: "#F8F4EC", w: 20, h: 20, top: "42%", left: "1%",  zBehind: false, dur: 3.6, delay: 1.5, rotRange: -14, parallax: 1.4 },
];

function DebrisSvg({ shape, color, w, h }: { shape: string; color: string; w: number; h: number }) {
  if (shape === "leaf")
    return (
      <svg width={w} height={h} viewBox="0 0 50 50">
        <ellipse cx="25" cy="25" rx="22" ry="11" fill={color} opacity="0.8" transform="rotate(-38 25 25)" />
        <line x1="25" y1="14" x2="25" y2="38" stroke={color} strokeWidth="1.5" opacity="0.5" />
      </svg>
    );
  if (shape === "ring")
    return (
      <svg width={w} height={h} viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="19" fill="none" stroke={color} strokeWidth="5" opacity="0.65" />
      </svg>
    );
  if (shape === "dot")
    return (
      <svg width={w} height={h} viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="22" fill={color} opacity="0.7" />
      </svg>
    );
  return (
    <svg width={w} height={h} viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="20" fill={color} opacity="0.72" />
    </svg>
  );
}

/* ─── Orbital arc SVG path from slot[4] to slot[1] through the leftward arc ─ */
// Arc goes from upper-far (247°) down through 180° to lower-far (113°)
const arcStart = pt(247);
const arcEnd = pt(113);
const ARC_PATH = `M ${arcStart.x.toFixed(1)} ${arcStart.y.toFixed(1)} A ${OR} ${OR} 0 0 0 ${arcEnd.x.toFixed(1)} ${arcEnd.y.toFixed(1)}`;

const SPRING = { type: "spring" as const, stiffness: 120, damping: 14, mass: 1 };
const THUMB_SIZES = [300, 78, 60, 78, 60]; // px: active | near | far | near | far

export function Hero() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [entered, setEntered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { setTimeout(() => setEntered(true), 120); }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setDirection(1);
      setActive((i) => (i + 1) % BOWLS.length);
    }, 4800);
  };

  useEffect(() => { startTimer(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  const navigate = (next: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDirection(next > active || (active === BOWLS.length - 1 && next === 0) ? 1 : -1);
    setActive(next);
    startTimer();
  };

  const words = ["Fresh.", "Bold.", "Poke."];

  // Map bowl indices to orbital slots
  // slot 0 = active bowl
  // slot 1 = bowl that was active before (upper-near)
  // slot 2 = upper-far
  // slot 3 = next bowl (lower-near)
  // slot 4 = lower-far
  const bowlOrder = BOWLS.map((_, i) => {
    const diff = ((i - active) % BOWLS.length + BOWLS.length) % BOWLS.length;
    return diff; // 0=active, 1=next, 2=next+1, 3=prev(near), ...
  });

  const thumbBowls = BOWLS.filter((_, i) => i !== active);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background pt-20">

      {/* ── Layer 1: background blobs ───────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <motion.div
          className="absolute rounded-full"
          style={{ top: "-5%", left: "-8%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(255,107,71,0.12) 0%, transparent 70%)" }}
          animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{ bottom: "-5%", right: "-5%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(155,227,106,0.08) 0%, transparent 70%)" }}
          animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* ── Layer 2 (BEHIND bowl): debris that stays behind ─────────────────── */}
      {DEBRIS.filter(d => d.zBehind).map((d) => (
        <motion.div
          key={d.id}
          className="absolute pointer-events-none"
          style={{ top: d.top, left: d.left, zIndex: 5 }}
          animate={{ y: [0, -24 * d.parallax, 0], rotate: [0, d.rotRange, 0] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <DebrisSvg shape={d.shape} color={d.color} w={d.w} h={d.h} />
        </motion.div>
      ))}

      {/* ── Main layout grid ────────────────────────────────────────────────── */}
      <div className="container mx-auto px-6 relative grid lg:grid-cols-[1fr_1fr] gap-8 items-center min-h-[calc(100vh-5rem)]" style={{ zIndex: 10 }}>

        {/* ── Text column ─────────────────────────────────────────────────── */}
        <div className="flex flex-col items-start text-left space-y-7">
          {words.map((word, i) => (
            <div key={word} className="overflow-hidden">
              <motion.span
                className="block font-display font-black leading-[0.85] tracking-tighter"
                style={{
                  fontSize: "clamp(3.5rem, 9vw, 8.5rem)",
                  color: word === "Poke." ? "#FF6B47" : "hsl(var(--foreground))",
                }}
                initial={{ y: "108%", opacity: 0 }}
                animate={entered ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.78, delay: i * 0.13, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
              </motion.span>
            </div>
          ))}

          <motion.p
            className="text-lg text-foreground/60 max-w-sm font-medium leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={entered ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.44 }}
          >
            Ocean vibes, tropical energy, and the freshest ingredients on the island.
          </motion.p>

          <motion.div
            className="flex gap-4 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={entered ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.57 }}
          >
            <button
              onClick={() => document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" })}
              data-testid="button-build-bowl"
              className="px-8 py-4 rounded-full font-bold text-lg text-white transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ background: "linear-gradient(135deg,#FF6B47,#e8381a)", boxShadow: "0 0 28px rgba(255,107,71,0.35)" }}
            >
              Build Your Bowl
            </button>
            <button
              onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
              data-testid="button-see-menu"
              className="px-8 py-4 rounded-full font-bold text-lg border border-foreground/20 text-foreground/70 hover:border-primary hover:text-primary transition-all duration-300"
            >
              Our Menu
            </button>
          </motion.div>

          {/* Active bowl label */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active + "-label"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28 }}
              className="pt-2 space-y-0.5"
            >
              <p className="font-display font-bold text-2xl text-foreground" data-testid="text-bowl-name">
                {BOWLS[active].name}
              </p>
              <p className="text-foreground/45 text-sm" data-testid="text-bowl-tagline">
                {BOWLS[active].tagline}
              </p>
              <p className="font-bold text-primary text-lg mt-1" data-testid="text-bowl-price">
                {BOWLS[active].price}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Orbital carousel column ──────────────────────────────────────── */}
        <div className="relative" style={{ height: "min(600px, 80vh)" }}>
          {/* SVG container that defines the orbital space */}
          <svg
            viewBox="0 0 700 600"
            className="absolute inset-0 w-full h-full"
            style={{ overflow: "visible" }}
            aria-hidden="true"
          >
            {/* Dotted orbital track */}
            <path
              d={ARC_PATH}
              fill="none"
              stroke="rgba(155,227,106,0.22)"
              strokeWidth="1.5"
              strokeDasharray="6 10"
              strokeLinecap="round"
            />
            {/* Track dots at slot positions */}
            {SLOTS.slice(1).map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r="4" fill="rgba(155,227,106,0.3)" />
            ))}
          </svg>

          {/* ── Active (main) bowl — Layer 2 (z:10) ── */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={BOWLS[active].id + "-main"}
              custom={direction}
              className="absolute"
              style={{
                width: 300,
                height: 300,
                left: SLOTS[0].x / 700 * 100 + "%",
                top:  SLOTS[0].y / 600 * 100 + "%",
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
              variants={{
                enter: (dir: number) => ({
                  rotate: dir * 360,
                  scale: 0.5,
                  opacity: 0,
                  x: dir * 80,
                  y: dir * 60,
                }),
                center: { rotate: 0, scale: 1, opacity: 1, x: 0, y: 0 },
                exit:  (dir: number) => ({
                  rotate: dir * -360,
                  scale: 0,
                  opacity: 0,
                  x: dir * -80,
                  y: dir * -60,
                }),
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
                className="w-full h-full object-cover rounded-full"
                style={{ filter: "drop-shadow(0 28px 56px rgba(0,0,0,0.55))" }}
                animate={{ y: [-12, 12, -12] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                data-testid={`img-hero-bowl-${BOWLS[active].id}`}
              />

              {/* Price tag floating on bowl */}
              <motion.div
                className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full font-bold text-sm"
                style={{ background: "#FF6B47", color: "#fff", boxShadow: "0 4px 16px rgba(255,107,71,0.5)" }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 20 }}
              >
                {BOWLS[active].price}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* ── Thumbnail bowls sliding along the arc ── */}
          {thumbBowls.map((bowl, tIdx) => {
            const slot = tIdx + 1; // slots 1-3 (we only have 3 thumbs for 4 bowls)
            if (slot >= SLOTS.length) return null;
            const pos = SLOTS[slot];
            const sz = THUMB_SIZES[slot];
            return (
              <motion.button
                key={bowl.id + "-thumb"}
                className="absolute rounded-full overflow-hidden border-2 border-foreground/10 hover:border-primary/60 transition-colors"
                style={{
                  width: sz,
                  height: sz,
                  left: pos.x / 700 * 100 + "%",
                  top: pos.y / 600 * 100 + "%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 8,
                }}
                onClick={() => navigate(BOWLS.indexOf(bowl))}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...SPRING, delay: 0.1 * tIdx }}
                whileHover={{ scale: 1.15, borderColor: "#FF6B47" }}
                data-testid={`button-bowl-thumb-${bowl.id}`}
              >
                <img src={bowl.image} alt={bowl.name} className="w-full h-full object-cover" />
              </motion.button>
            );
          })}

          {/* Navigation arrows */}
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-foreground/20 text-foreground/50 hover:border-primary hover:text-primary flex items-center justify-center transition-all bg-background/40 backdrop-blur-sm"
            style={{ zIndex: 20 }}
            onClick={() => navigate((active - 1 + BOWLS.length) % BOWLS.length)}
            data-testid="button-bowl-prev"
          >
            &#8592;
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-foreground/20 text-foreground/50 hover:border-primary hover:text-primary flex items-center justify-center transition-all bg-background/40 backdrop-blur-sm"
            style={{ zIndex: 20 }}
            onClick={() => navigate((active + 1) % BOWLS.length)}
            data-testid="button-bowl-next"
          >
            &#8594;
          </button>

          {/* Dot pagination */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 20 }}>
            {BOWLS.map((_, i) => (
              <button
                key={i}
                onClick={() => navigate(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === active ? 24 : 8,
                  height: 8,
                  background: i === active ? "#FF6B47" : "rgba(248,244,236,0.25)",
                }}
                data-testid={`button-dot-${i}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Layer 3 (FRONT of bowl): debris that overlaps ───────────────────── */}
      {DEBRIS.filter(d => !d.zBehind).map((d) => (
        <motion.div
          key={d.id}
          className="absolute pointer-events-none"
          style={{ top: d.top, left: d.left, zIndex: 20 }}
          animate={{ y: [0, -20 * d.parallax, 0], rotate: [0, d.rotRange, 0] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <DebrisSvg shape={d.shape} color={d.color} w={d.w} h={d.h} />
        </motion.div>
      ))}
    </section>
  );
}
