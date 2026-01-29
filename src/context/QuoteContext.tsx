"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface QuoteItem {
  productId: string;
  productName: string;
  quantity: number;
}

interface QuoteContextType {
  items: QuoteItem[];
  addItem: (productId: string, productName: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  formatCartForSubmission: () => string;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

const STORAGE_KEY = "ibe_quote_cart";

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setItems(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse stored quote cart", e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = useCallback((productId: string, productName: string, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId, productName, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.productId !== productId));
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const formatCartForSubmission = useCallback(() => {
    return items.map((item) => `${item.productName} (x${item.quantity})`).join(", ");
  }, [items]);

  return (
    <QuoteContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        isCartOpen,
        setCartOpen,
        formatCartForSubmission,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (context === undefined) {
    throw new Error("useQuote must be used within a QuoteProvider");
  }
  return context;
}
