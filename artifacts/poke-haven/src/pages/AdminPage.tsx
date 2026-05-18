import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface OrderItem { id: string; name: string; price: string; quantity: number; }
interface Order {
  id: number;
  customerName: string | null;
  customerPhone: string | null;
  items: OrderItem[];
  total: string;
  notes: string | null;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending:   "#F26522",
  preparing: "#ECC94B",
  ready:     "#59B259",
  completed: "#4A5568",
  cancelled: "#FC8181",
};

const STATUS_LABELS: Record<string, string> = {
  pending:   "Wachtend",
  preparing: "In bereiding",
  ready:     "Klaar",
  completed: "Voltooid",
  cancelled: "Geannuleerd",
};

const FLOW: Record<string, string> = {
  pending:   "preparing",
  preparing: "ready",
  ready:     "completed",
};

export function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) setOrders((await res.json()).reverse());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 8000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  async function advance(order: Order) {
    const next = FLOW[order.status];
    if (!next) return;
    await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    fetchOrders();
  }

  async function cancel(order: Order) {
    await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    fetchOrders();
  }

  const TABS = ["all", "pending", "preparing", "ready", "completed", "cancelled"];
  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const activeCount = orders.filter((o) => o.status === "pending" || o.status === "preparing").length;

  return (
    <div className="min-h-screen" style={{ background: "#0E1621", color: "#fff" }}>
      {/* Header */}
      <div style={{ background: "#111C2B", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="container mx-auto px-5 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm font-medium" style={{ color: "#A0AEC0" }}>← Terug naar site</a>
          </div>
          <div className="text-center">
            <h1 className="font-display font-black text-white text-xl">Admin Dashboard</h1>
            <p className="text-xs" style={{ color: "#A0AEC0" }}>Poke Haven · Bestellingen</p>
          </div>
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(242,101,34,0.15)", color: "#F26522", border: "1px solid rgba(242,101,34,0.3)" }}>
                {activeCount} actief
              </span>
            )}
            <button onClick={fetchOrders} className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: "rgba(255,255,255,0.07)", color: "#A0AEC0" }}>
              Vernieuwen
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5 py-8">
        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={{
                background: filter === tab ? "#F26522" : "#1A2432",
                color: filter === tab ? "#fff" : "#A0AEC0",
                border: `1px solid ${filter === tab ? "#F26522" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              {tab === "all" ? "Alle" : STATUS_LABELS[tab]}
              {tab !== "all" && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({orders.filter((o) => o.status === tab).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#F26522", borderTopColor: "transparent" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24" style={{ color: "#4A5568" }}>
            <p className="text-lg font-bold">Geen bestellingen</p>
            <p className="text-sm mt-1">Bestellingen verschijnen hier automatisch</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((order) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-5 flex flex-col gap-4"
                style={{ background: "#1A2432", border: `1px solid ${STATUS_COLORS[order.status]}33` }}
              >
                {/* Order header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-black text-white text-lg">#{order.id}</span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: STATUS_COLORS[order.status] + "22", color: STATUS_COLORS[order.status], border: `1px solid ${STATUS_COLORS[order.status]}44` }}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: "#4A5568" }}>
                      {new Date(order.createdAt).toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit" })} · {new Date(order.createdAt).toLocaleDateString("nl-BE")}
                    </p>
                  </div>
                  <span className="font-black text-white">{order.total}</span>
                </div>

                {/* Customer info */}
                {(order.customerName || order.customerPhone) && (
                  <div className="text-sm rounded-lg px-3 py-2" style={{ background: "#0E1621" }}>
                    {order.customerName && <p className="font-semibold text-white">{order.customerName}</p>}
                    {order.customerPhone && <p style={{ color: "#A0AEC0" }}>{order.customerPhone}</p>}
                  </div>
                )}

                {/* Items */}
                <div className="flex flex-col gap-1.5">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span style={{ color: "#A0AEC0" }}><span className="font-bold text-white">{item.quantity}×</span> {item.name}</span>
                      <span style={{ color: "#A0AEC0" }}>{item.price}</span>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                {order.notes && (
                  <div className="text-xs rounded-lg px-3 py-2" style={{ background: "rgba(242,101,34,0.07)", color: "#F26522", border: "1px solid rgba(242,101,34,0.15)" }}>
                    📝 {order.notes}
                  </div>
                )}

                {/* Actions */}
                {(FLOW[order.status] || order.status === "pending" || order.status === "preparing") && (
                  <div className="flex gap-2 mt-auto pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    {FLOW[order.status] && (
                      <button
                        onClick={() => advance(order)}
                        className="flex-1 py-2 rounded-full text-xs font-bold text-white transition-all"
                        style={{ background: "#59B259" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#48BB78"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#59B259"; }}
                      >
                        → {STATUS_LABELS[FLOW[order.status]]}
                      </button>
                    )}
                    {(order.status === "pending" || order.status === "preparing") && (
                      <button
                        onClick={() => cancel(order)}
                        className="px-4 py-2 rounded-full text-xs font-bold transition-all"
                        style={{ background: "rgba(220,38,38,0.1)", color: "#F87171", border: "1px solid rgba(220,38,38,0.2)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.2)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.1)"; }}
                      >
                        Annuleren
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
