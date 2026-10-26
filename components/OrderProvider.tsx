"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ORDERABLES } from "@/lib/data";

type Lines = Record<string, number>;

type OrderContextValue = {
  lines: Lines;
  count: number;
  total: number;
  open: boolean;
  bump: number;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
};

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Lines>({});
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(0);

  const add = useCallback((id: string) => {
    setLines((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    setBump((b) => b + 1);
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) => {
      const next = { ...prev };
      const qty = (next[id] ?? 0) - 1;
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }, []);

  const clear = useCallback(() => setLines({}), []);

  const value = useMemo(() => {
    let count = 0;
    let total = 0;
    for (const [id, qty] of Object.entries(lines)) {
      const item = ORDERABLES[id];
      if (!item) continue;
      count += qty;
      total += item.price * qty;
    }
    return { lines, count, total, open, bump, add, remove, clear, setOpen };
  }, [lines, open, bump, add, remove, clear]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder debe usarse dentro de <OrderProvider>");
  return ctx;
}
