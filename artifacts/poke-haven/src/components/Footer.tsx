import { motion } from "framer-motion";

/* ─── Social icon SVGs ───────────────────────────────────────────────────── */
function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.83a8.18 8.18 0 0 0 4.78 1.52V6.9a4.85 4.85 0 0 1-1.01-.21z" />
    </svg>
  );
}

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/pokehavenkortrijk",
    icon: <FacebookIcon />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/pokehavenkortrijk",
    icon: <InstagramIcon />,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@pokehavenkortrijk",
    icon: <TikTokIcon />,
  },
];

const QUICK_LINKS = [
  { label: "Home",                    id: "" },
  { label: "Over Ons",                id: "about" },
  { label: "Menu",                    id: "menu" },
  { label: "Stel Je Eigen Bowl Samen",id: "builder" },
];

export function Footer() {
  const scrollTo = (id: string) => {
    if (!id) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer style={{ background: "#59B259" }}>
      <div style={{ height: 1, background: "rgba(242,101,34,0.25)" }} />

      <div className="container mx-auto px-5 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logo.png"
                alt="Poke Haven"
                style={{ height: 44, width: "auto" }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
              <span className="font-display font-black text-lg leading-none">
                <span style={{ color: "#fff" }}>PO</span>
                <span style={{ color: "#fff" }}>K</span>
                <span style={{ color: "#fff" }}>E </span>
                <span style={{ color: "#fff" }}>H</span>
                <span style={{ color: "#F26522" }}>A</span>
                <span style={{ color: "#fff" }}>VEN</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.85)" }}>
              Verse poke bowls op maat gemaakt met de lekkerste ingrediënten, bereid met passie.
            </p>
            {/* Social icons */}
            <div className="flex gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.2)", touchAction: "manipulation" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#F26522"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.2)"; }}
                  data-testid={`social-${s.label.toLowerCase()}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Address */}
          <div>
            <h5 className="font-display font-bold text-white text-base mb-4">Bezoek Ons</h5>
            <div className="space-y-1 text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
              <p className="font-semibold text-white">Poke Haven</p>
              <p>Steenpoort 13</p>
              <p>8500 Kortrijk</p>
              <p className="pt-2">
                <a href="tel:+32471843511" style={{ color: "rgba(255,255,255,0.85)" }}>+32 471 84 35 11</a>
              </p>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h5 className="font-display font-bold text-white text-base mb-4">Openingsuren</h5>
            <div className="space-y-2 text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
              <div className="flex justify-between gap-4">
                <span>Maandag – Zondag</span>
                <span className="font-semibold text-white">11:00 – 22:00</span>
              </div>
              <p className="text-xs pt-1" style={{ color: "rgba(255,255,255,0.65)" }}>7 dagen per week geopend</p>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="font-display font-bold text-white text-base mb-4">Snelle Links</h5>
            <ul className="space-y-2 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.id)}
                    className="text-left transition-colors duration-200"
                    style={{ color: "rgba(255,255,255,0.85)", touchAction: "manipulation" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                      (e.currentTarget as HTMLButtonElement).style.textDecoration = "underline";
                      (e.currentTarget as HTMLButtonElement).style.textDecorationColor = "#F26522";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.85)";
                      (e.currentTarget as HTMLButtonElement).style.textDecoration = "none";
                    }}
                    data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs"
          style={{ borderTop: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.65)" }}
        >
          <p>&copy; {new Date().getFullYear()} Poke Haven · Steenpoort 13, 8500 Kortrijk</p>
          <div className="flex gap-4">
            {["Privacybeleid", "Algemene Voorwaarden"].map((t) => (
              <button key={t} className="hover:text-white transition-colors" style={{ touchAction: "manipulation" }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
