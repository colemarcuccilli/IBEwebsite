"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import breadHeaderImg from "@/assets/BreadHeader.jpeg";
import ibeLogo from "@/assets/IBENewLogo.png";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(".hero-title", { y: 60 }, { y: 0, duration: 1, ease: "power3.out" })
        .fromTo(".hero-subtitle", { y: 40 }, { y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
        .fromTo(".hero-mission", { y: 25 }, { y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
        .fromTo(".hero-cta", { y: 15 }, { y: 0, duration: 0.6, ease: "power3.out" }, "-=0.3");
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #1C2B36 0%, #2A3F4D 50%, #1C2B36 100%)",
      }}
    >
      {/* Background image overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <Image
          src={breadHeaderImg}
          alt=""
          fill
          style={{ objectFit: "cover" }}
          sizes="100vw"
          priority
        />
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "120px 24px 80px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div style={{ position: "relative", zIndex: 10, maxWidth: "800px" }}>
          <div
            className="hero-title"
            style={{
              marginBottom: "24px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Image
              src={ibeLogo}
              alt="IBE"
              width={280}
              height={140}
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <p
            className="hero-subtitle"
            style={{
              fontSize: "clamp(24px, 4vw, 42px)",
              color: "#ffffff",
              marginBottom: "32px",
              fontWeight: 700,
              fontStyle: "italic",
              letterSpacing: "3px",
            }}
          >
            Industrial Bakery Equipment
          </p>
          <p
            className="hero-mission"
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.7)",
              marginBottom: "48px",
              lineHeight: 1.8,
              maxWidth: "600px",
              margin: "0 auto 48px",
            }}
          >
            Our mission is to use Industrial Bakery Equipment&apos;s accumulated experience and knowledge, coupled with select partners, to produce the highest quality equipment.
          </p>
          <div className="hero-cta" style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
            <a
              href="#products"
              style={{
                display: "inline-block",
                padding: "18px 40px",
                backgroundColor: "#C05621",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 600,
                borderRadius: "4px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontSize: "14px",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 20px rgba(192,86,33,0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(192,86,33,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(192,86,33,0.3)";
              }}
            >
              View Products
            </a>
            <a
              href="#contact"
              style={{
                display: "inline-block",
                padding: "18px 40px",
                backgroundColor: "transparent",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 600,
                borderRadius: "4px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontSize: "14px",
                border: "2px solid #ffffff",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#C05621";
                e.currentTarget.style.borderColor = "#C05621";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "#ffffff";
                e.currentTarget.style.color = "#ffffff";
              }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <svg width="24" height="24" fill="none" stroke="rgba(255,255,255,0.5)" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
