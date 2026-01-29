"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, defaultProducts } from "@/data/products";
import { Event, defaultEvents } from "@/data/events";

interface DataContextType {
  products: Product[];
  events: Event[];
  setProducts: (products: Product[]) => void;
  setEvents: (events: Event[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const PRODUCTS_KEY = "ibe_products";
const EVENTS_KEY = "ibe_events";

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProductsState] = useState<Product[]>(defaultProducts);
  const [events, setEventsState] = useState<Event[]>(defaultEvents);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProducts = localStorage.getItem(PRODUCTS_KEY);
      const storedEvents = localStorage.getItem(EVENTS_KEY);

      if (storedProducts) {
        try {
          setProductsState(JSON.parse(storedProducts));
        } catch (e) {
          console.error("Failed to parse stored products", e);
        }
      }

      if (storedEvents) {
        try {
          setEventsState(JSON.parse(storedEvents));
        } catch (e) {
          console.error("Failed to parse stored events", e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    }
  }, [products, isLoaded]);

  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    }
  }, [events, isLoaded]);

  const setProducts = (newProducts: Product[]) => {
    setProductsState(newProducts);
  };

  const setEvents = (newEvents: Event[]) => {
    setEventsState(newEvents);
  };

  const addProduct = (product: Product) => {
    setProductsState((prev) => [...prev, product]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProductsState((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProductsState((prev) => prev.filter((p) => p.id !== id));
  };

  const addEvent = (event: Event) => {
    setEventsState((prev) => [...prev, event]);
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEventsState((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const deleteEvent = (id: string) => {
    setEventsState((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        products,
        events,
        setProducts,
        setEvents,
        addProduct,
        updateProduct,
        deleteProduct,
        addEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
