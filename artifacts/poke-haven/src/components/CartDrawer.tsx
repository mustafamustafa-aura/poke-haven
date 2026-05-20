import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart";
import { apiUrl, readApiError } from "@/lib/api";

export function CartDrawer() {
  const { items, totalCount, totalPrice, isOpen, closeCart, updateQty, removeItem, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handlePlace() {
    if (items.length === 0) return;
    if (phone.trim() && !/^[\d\s+\-()]{6,20}$/.test(phone.trim())) {
      setError("Voer een geldig telefoonnummer in.");
      return;
    }
    setPlacing(true);
    setError("");
    try {
      const res = await fetch(apiUrl("/api/orders"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim() || undefined,
          customerPhone: phone.trim() || undefined,
          notes: notes.trim() || undefined,
          items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
          total: totalPrice,
        }),
      });
      if (!res.ok) {
        setError(await readApiError(res, "Er ging iets fout. Probeer het opnieuw."));
        return;
      }
      setSuccess(true);
      clearCart();
      setTimeout(() => { setSuccess(false); setName(""); setPhone(""); setNotes(""); closeCart(); }, 3000);
    } catch {
      setError("Kan geen verbinding maken met de server. Probeer het later opnieuw.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          <motion.div
            className="fixed top-0 right-0 h-full z-50 flex flex-col"
            style={{ width: "min(440px, 100vw)", background: "#111C2B", borderLeft: "1px solid rgba(255,255,255,0.07)" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-3">
                <span className="font-display font-black text-white text-lg">Jouw Bestelling</span>
                {totalCount > 0 && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#F26522", color: "#fff" }}>
                    {totalCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: "rgba(255,255,255,0.07)", color: "#A0AEC0" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.13)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)"; }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Success state */}
            {success ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(89,178,89,0.15)" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L19 7" stroke="#59B259" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="font-display font-black text-white text-xl text-center">Bestelling Geplaatst!</p>
                <p className="text-sm text-center" style={{ color: "#A0AEC0" }}>We bereiden je poke bowl zo snel mogelijk.</p>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4" style={{ color: "#4A5568" }}>
                      <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                        <circle cx="9" cy="21" r="1.5" fill="#4A5568" />
                        <circle cx="19" cy="21" r="1.5" fill="#4A5568" />
                        <path d="M1 1h3l2.68 13.39a2 2 0 001.98 1.61H19a2 2 0 001.96-1.61L23 6H6" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="text-sm font-medium">Je winkelwagen is leeg</p>
                      <p className="text-xs text-center" style={{ color: "#4A5568" }}>Voeg een bowl toe vanuit het menu</p>
                    </div>
                  ) : (
                    <>
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center gap-3 rounded-xl p-3"
                          style={{ background: "#1A2432", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                          {item.image ? (
                            <img src={item.image} alt={item.name} style={{ width: 52, height: 52, objectFit: "contain", borderRadius: 8, flexShrink: 0 }} />
                          ) : (
                            <div className="flex items-center justify-center rounded-lg" style={{ width: 52, height: 52, background: "rgba(242,101,34,0.08)", border: "1px dashed rgba(242,101,34,0.2)", flexShrink: 0 }}>
                              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z" stroke="#F26522" strokeWidth="1.4" fill="none" />
                                <path d="M7 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="#F26522" strokeWidth="1.4" strokeLinecap="round" />
                                <path d="M5 14h14" stroke="#F26522" strokeWidth="1.4" strokeLinecap="round" />
                              </svg>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white text-sm truncate">{item.name}</p>
                            <p className="text-xs mt-0.5" style={{ color: "#F26522" }}>{item.price}</p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: "rgba(255,255,255,0.08)", color: "#fff" }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#F26522"; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)"; }}>−</button>
                            <span className="text-white font-bold text-sm w-5 text-center">{item.quantity}</span>
                            <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: "rgba(255,255,255,0.08)", color: "#fff" }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#59B259"; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)"; }}>+</button>
                            <button onClick={() => removeItem(item.id)} className="w-7 h-7 rounded-full flex items-center justify-center ml-1" style={{ background: "rgba(255,255,255,0.04)", color: "#4A5568" }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.15)"; (e.currentTarget as HTMLButtonElement).style.color = "#F87171"; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLButtonElement).style.color = "#4A5568"; }}>
                              <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                            </button>
                          </div>
                        </motion.div>
                      ))}

                      {/* Customer details */}
                      <div className="mt-2 rounded-xl p-4 flex flex-col gap-3" style={{ background: "#1A2432", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#59B259" }}>Jouw gegevens (optioneel)</p>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Naam"
                          className="w-full rounded-lg px-3 py-2 text-sm text-white outline-none"
                          style={{ background: "#0E1621", border: "1px solid rgba(255,255,255,0.08)" }}
                        />
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Telefoonnummer"
                          type="tel"
                          className="w-full rounded-lg px-3 py-2 text-sm text-white outline-none"
                          style={{ background: "#0E1621", border: "1px solid rgba(255,255,255,0.08)" }}
                        />
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Opmerkingen (allergieën, etc.)"
                          rows={2}
                          className="w-full rounded-lg px-3 py-2 text-sm text-white outline-none resize-none"
                          style={{ background: "#0E1621", border: "1px solid rgba(255,255,255,0.08)" }}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                  <div className="px-6 py-5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium" style={{ color: "#A0AEC0" }}>Totaal</span>
                      <span className="font-black text-white text-xl">{totalPrice}</span>
                    </div>
                    {error && <p className="text-xs mb-3 text-center" style={{ color: "#F87171" }}>{error}</p>}
                    <motion.button
                      className="w-full py-4 rounded-full font-bold text-white text-sm disabled:opacity-60"
                      style={{ background: "#F26522", boxShadow: "0 0 20px rgba(242,101,34,0.3)" }}
                      whileHover={{ scale: 1.02, boxShadow: "0 0 28px rgba(242,101,34,0.45)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePlace}
                      disabled={placing}
                    >
                      {placing ? "Bezig..." : "Bestelling Plaatsen →"}
                    </motion.button>
                    <button onClick={clearCart} className="w-full mt-2 py-2 text-xs font-medium transition-colors" style={{ color: "#4A5568" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#A0AEC0"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#4A5568"; }}>
                      Winkelwagen leegmaken
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
