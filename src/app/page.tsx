"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Products from "@/components/Products";
import Events from "@/components/Events";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import QuoteCart from "@/components/QuoteCart";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <main className="min-h-screen">
      <a href="#products" style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }} onFocus={(e) => { e.currentTarget.style.position = "fixed"; e.currentTarget.style.left = "16px"; e.currentTarget.style.top = "16px"; e.currentTarget.style.width = "auto"; e.currentTarget.style.height = "auto"; e.currentTarget.style.overflow = "visible"; e.currentTarget.style.zIndex = "9999"; e.currentTarget.style.padding = "12px 24px"; e.currentTarget.style.background = "#C05621"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderRadius = "4px"; e.currentTarget.style.textDecoration = "none"; e.currentTarget.style.fontWeight = "600"; }} onBlur={(e) => { e.currentTarget.style.position = "absolute"; e.currentTarget.style.left = "-9999px"; e.currentTarget.style.width = "1px"; e.currentTarget.style.height = "1px"; e.currentTarget.style.overflow = "hidden"; }}>Skip to Content</a>
      <Navbar />
      <Hero />
      <About />
      <Products />
      <Events />
      <Contact />
      <Footer />
      <QuoteCart />
    </main>
  );
}
