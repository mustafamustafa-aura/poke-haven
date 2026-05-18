import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string | null;
  quantity: number;
}

interface CartCtx {
  items: CartItem[];
  totalCount: number;
  totalPrice: string;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartCtx | null>(null);

function parsePrice(p: string): number {
  return parseFloat(p.replace("€", "").replace(",", ".")) || 0;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const totalCount = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = "€" + items.reduce((s, i) => s + parsePrice(i.price) * i.quantity, 0).toFixed(2).replace(".", ",");

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty < 1) { removeItem(id); return; }
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity: qty } : i));
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  return (
    <CartContext.Provider value={{ items, totalCount, totalPrice, isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false), addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
