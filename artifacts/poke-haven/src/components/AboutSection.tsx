import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section id="about" className="py-24 relative overflow-hidden" style={{ background: "#0E1621" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "rgba(242,101,34,0.2)" }} />

      <div className="container mx-auto px-5">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Image — the greenery/neon interior banner */}
          <motion.div
            className="relative rounded-3xl overflow-hidden"
            style={{ height: "min(520px, 70vw)" }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{ background: "linear-gradient(135deg, rgba(89,178,89,0.15) 0%, rgba(242,101,34,0.1) 100%)", mixBlendMode: "overlay" }}
            />
            <img
              src="/footer-interior.jpg"
              alt="Poke Haven interieur"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 35%" }}
            />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 text-left"
          >
            <h2
              className="font-display font-black leading-tight tracking-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: "#fff" }}
            >
              An island escape,{" "}
              <span style={{ color: "#F26522" }}>right in</span>{" "}
              the cityscape.
            </h2>

            <p className="text-base leading-relaxed" style={{ color: "#A0AEC0" }}>
              At Poke Haven, we serve handcrafted poke bowls made with responsibly sourced ingredients, house-made sauces, and flavors that transport you straight to the islands.
            </p>

            <p className="text-base leading-relaxed" style={{ color: "#A0AEC0" }}>
              Every bowl is built to order — fresh, vibrant, and packed with the energy of the Pacific. It's not just a meal, it's a moment of escape in the middle of your day.
            </p>

            <div
              className="pt-6 grid grid-cols-2 gap-8 mt-6"
              style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div>
                <h4 className="font-display font-bold text-3xl mb-1" style={{ color: "#59B259" }}>100%</h4>
                <p className="font-medium text-sm" style={{ color: "#A0AEC0" }}>Vers bereide ingrediënten</p>
              </div>
              <div>
                <h4 className="font-display font-bold text-3xl mb-1" style={{ color: "#F26522" }}>0</h4>
                <p className="font-medium text-sm" style={{ color: "#A0AEC0" }}>Kunstmatige toevoegingen</p>
              </div>
            </div>

            <motion.button
              onClick={() => document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-block px-8 py-4 rounded-full font-bold text-white text-base transition-all duration-300 hover:scale-[1.03] active:scale-95"
              style={{ background: "#59B259", boxShadow: "0 0 20px rgba(89,178,89,0.3)", touchAction: "manipulation" }}
              whileHover={{ background: "#48BB78" }}
              data-testid="button-about-cta"
            >
              Stel Je Bowl Samen
            </motion.button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
