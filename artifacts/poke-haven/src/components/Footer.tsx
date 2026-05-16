import { motion } from "framer-motion";

const QUICK_LINKS = ["Home", "About", "Menu", "Build Your Bowl", "Contact"];
const SOCIALS = ["FB", "IG", "TW", "YT"];

export function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer style={{ background: "#59B259" }}>
      {/* Thin orange separator */}
      <div style={{ height: 1, background: "rgba(242,101,34,0.25)" }} />

      <div className="container mx-auto px-6 pt-14 pb-8">
        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Poke Haven" className="h-10 w-auto" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              <span className="font-display font-black text-lg leading-none">
                <span style={{ color: "#fff" }}>PO</span>
                <span style={{ color: "#fff", opacity: 0.9 }}>K</span>
                <span style={{ color: "#fff" }}>E </span>
                <span style={{ color: "#fff" }}>H</span>
                <span style={{ color: "#F26522" }}>A</span>
                <span style={{ color: "#fff" }}>VEN</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
              Fresh poke bowls made to order with the finest ingredients, delivered with good vibes.
            </p>
            {/* Social icons */}
            <div className="flex gap-2 mt-5">
              {SOCIALS.map((s) => (
                <button
                  key={s}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white transition-all duration-200 hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#F26522"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)"; }}
                  data-testid={`social-${s.toLowerCase()}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Address */}
          <div>
            <h5 className="font-display font-bold text-white text-base mb-4">Bezoek ons</h5>
            <div className="space-y-1 text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
              <p className="font-semibold text-white">Poke Haven</p>
              <p>Steenpoort 13</p>
              <p>8500 Kortrijk</p>
              <p className="pt-2">+32 471 84 35 11</p>
            </div>
          </div>

          {/* Opening hours */}
          <div>
            <h5 className="font-display font-bold text-white text-base mb-4">Openingsuren</h5>
            <div className="space-y-1 text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
              <div className="flex justify-between gap-4">
                <span>Maandag – Zondag</span>
                <span className="text-white font-semibold">11:00 – 22:00</span>
              </div>
              <p className="pt-2 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                Open 7 dagen per week
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="font-display font-bold text-white text-base mb-4">Snelle links</h5>
            <ul className="space-y-2 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link}>
                  <button
                    onClick={() => scrollTo(link === "Home" ? "" : link.toLowerCase().replace(/\s+/g, ""))}
                    className="transition-colors duration-200 underline-offset-2"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                      (e.currentTarget as HTMLButtonElement).style.textDecoration = "underline";
                      (e.currentTarget as HTMLButtonElement).style.textDecorationColor = "#F26522";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.8)";
                      (e.currentTarget as HTMLButtonElement).style.textDecoration = "none";
                    }}
                    data-testid={`footer-link-${link.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs" style={{ borderTop: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }}>
          <p>&copy; {new Date().getFullYear()} Poke Haven · Steenpoort 13, 8500 Kortrijk</p>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms of Service"].map((t) => (
              <button key={t} className="hover:text-white transition-colors" data-testid={`footer-legal-${t.toLowerCase().replace(/\s+/g, "-")}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
