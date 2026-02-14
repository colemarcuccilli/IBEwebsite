"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, defaultProducts, productCategories } from "@/data/products";
import { Event, defaultEvents } from "@/data/events";
import { supabase } from "@/lib/supabase/client";

export interface Category {
  id: string;
  name: string;
  sort_order: number;
}

interface DataContextType {
  products: Product[];
  events: Event[];
  categories: Category[];
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const defaultCategories: Category[] = productCategories.map((c, i) => ({
  id: c.id,
  name: c.name,
  sort_order: i,
}));

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [events, setEvents] = useState<Event[]>(defaultEvents);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, eventsRes, categoriesRes] = await Promise.all([
          supabase.from("products").select("*").order("sort_order"),
          supabase.from("events").select("*").order("date"),
          supabase.from("categories").select("*").order("sort_order"),
        ]);

        if (productsRes.data && productsRes.data.length > 0) {
          setProducts(
            productsRes.data.map((p) => ({
              id: p.id,
              name: p.name,
              description: p.description,
              image_url: p.image_url || "",
              category: p.category,
            }))
          );
        }

        if (eventsRes.data && eventsRes.data.length > 0) {
          setEvents(
            eventsRes.data.map((e) => ({
              id: e.id,
              title: e.title,
              date: e.date,
              location: e.location,
              description: e.description,
              link: e.link || "",
            }))
          );
        }

        if (categoriesRes.data && categoriesRes.data.length > 0) {
          setCategories(
            categoriesRes.data.map((c) => ({
              id: c.id,
              name: c.name,
              sort_order: c.sort_order ?? 0,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch from Supabase, using defaults", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ products, events, categories, loading }}>
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
