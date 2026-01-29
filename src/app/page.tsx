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
