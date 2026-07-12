"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Cart } from "@/lib/commerce/types";

interface CartApiResponse {
  success: boolean;
  data: Cart | null;
  error: string | null;
}

interface CartContextValue {
  cart: Cart | null;
  isOpen: boolean;
  isPending: boolean;
  error: string | null;
  openCart: () => void;
  closeCart: () => void;
  addLine: (merchandiseId: string, quantity?: number) => Promise<void>;
  updateLine: (merchandiseId: string, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

async function requestCart(input: RequestInfo, init?: RequestInit): Promise<Cart> {
  const response = await fetch(input, init);
  const payload = (await response.json()) as CartApiResponse;

  if (!response.ok || !payload.success || payload.data === null) {
    throw new Error(payload.error ?? "Cart request failed");
  }

  return payload.data;
}

function optimisticSetQuantity(cart: Cart, merchandiseId: string, quantity: number): Cart {
  const lines =
    quantity < 1
      ? cart.lines.filter((line) => line.merchandise.id !== merchandiseId)
      : cart.lines.map((line) =>
          line.merchandise.id === merchandiseId ? { ...line, quantity } : line,
        );

  return {
    ...cart,
    lines,
    totalQuantity: lines.reduce((total, line) => total + line.quantity, 0),
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    requestCart("/api/cart")
      .then((initial) => {
        if (!cancelled) setCart(initial);
      })
      .catch(() => {
        /* cold start without a cart is fine */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const flashError = useCallback((message: string) => {
    setError(message);
    if (errorTimer.current) clearTimeout(errorTimer.current);
    errorTimer.current = setTimeout(() => setError(null), 4000);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addLine = useCallback(
    async (merchandiseId: string, quantity = 1) => {
      setIsPending(true);
      try {
        const next = await requestCart("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ merchandiseId, quantity }),
        });
        setCart(next);
        setIsOpen(true);
      } catch {
        flashError("Could not add to cart. Please try again.");
      } finally {
        setIsPending(false);
      }
    },
    [flashError],
  );

  const updateLine = useCallback(
    async (merchandiseId: string, quantity: number) => {
      const snapshot = cart;
      if (snapshot) {
        setCart(optimisticSetQuantity(snapshot, merchandiseId, quantity));
      }

      try {
        const next = await requestCart("/api/cart", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ merchandiseId, quantity }),
        });
        setCart(next);
      } catch {
        setCart(snapshot);
        flashError("Could not update the cart. Please try again.");
      }
    },
    [cart, flashError],
  );

  const value = useMemo(
    () => ({ cart, isOpen, isPending, error, openCart, closeCart, addLine, updateLine }),
    [cart, isOpen, isPending, error, openCart, closeCart, addLine, updateLine],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
