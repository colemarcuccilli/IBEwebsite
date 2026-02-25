"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useData } from "@/context/DataContext";
import { Product } from "@/data/products";
import { useQuote } from "@/context/QuoteContext";

gsap.registerPlugin(ScrollTrigger);

function AccordionCard({ product }: { product: Product }) {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { addItem } = useQuote();

  const handleAdd = () => {
    addItem(product.id, product.name, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  useEffect(() => {
    if (!contentRef.current) return;
    if (isOpen) {
      gsap.fromTo(contentRef.current, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" });
    } else {
      gsap.to(contentRef.current, { height: 0, opacity: 0, duration: 0.3, ease: "power2.in" });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setAdded(false);
    }
  }, [isOpen]);

  return (
    <div
      className="product-card"
      style={{
        background: "#FFFFFF",
        borderRadius: "12px",
        overflow: "hidden",
        border: isOpen ? "1px solid rgba(95, 138, 158, 0.3)" : "1px solid rgba(95, 138, 158, 0.1)",
        boxShadow: isOpen ? "0 8px 24px rgba(95, 138, 158, 0.12)" : "0 2px 8px rgba(0, 0, 0, 0.04)",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {/* Header - always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 28px",
          background: "none",
          border: "none",
          cursor: "pointer",
          gap: "16px",
          textAlign: "left",
        }}
      >
        <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1C2B36", margin: 0, flex: 1 }}>
          {product.name}
        </h3>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#5A6E78"
          strokeWidth="2"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            flexShrink: 0,
          }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Expandable content */}
      <div ref={contentRef} style={{ height: 0, opacity: 0, overflow: "hidden" }}>
        <div style={{ padding: "0 28px 28px", display: "flex", gap: "32px", flexWrap: "wrap" }}>
          {/* Image - natural aspect ratio */}
          {product.image_url && (
            <div style={{
              flex: "0 0 auto",
              maxWidth: "400px",
              width: "100%",
              background: "#E8EDF0",
              borderRadius: "12px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Image
                src={product.image_url}
                alt={product.name}
                width={400}
                height={500}
                style={{ width: "100%", height: "auto", objectFit: "contain", display: "block" }}
                sizes="400px"
              />
            </div>
          )}

          {/* Details */}
          <div style={{ flex: "1 1 300px", minWidth: 0 }}>
            <div style={{ fontSize: "15px", color: "#5A6E78", lineHeight: 1.8, marginBottom: "24px" }}>
              {product.description.split("\n\n").map((paragraph, i) => (
                <p key={i} style={{ marginBottom: i < product.description.split("\n\n").length - 1 ? "12px" : 0 }}>
                  {paragraph}
                </p>
              ))}
              {product.pdf_url && (
                <a
                  href={product.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "16px",
                    padding: "10px 20px",
                    backgroundColor: "#5F8A9E",
                    color: "#ffffff",
                    textDecoration: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#3D6478";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#5F8A9E";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download PDF Spec Sheet
                </a>
              )}
            </div>

            {/* Quantity + Add to Quote */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid rgba(28, 43, 54, 0.15)",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); setQuantity((q) => Math.max(1, q - 1)); }}
                  style={{ width: "40px", height: "40px", border: "none", background: "#E8EDF0", cursor: "pointer", fontSize: "18px", color: "#1C2B36", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  -
                </button>
                <span style={{ width: "44px", textAlign: "center", fontSize: "15px", fontWeight: 600, color: "#1C2B36" }}>
                  {quantity}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); setQuantity((q) => q + 1); }}
                  style={{ width: "40px", height: "40px", border: "none", background: "#E8EDF0", cursor: "pointer", fontSize: "18px", color: "#1C2B36", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  +
                </button>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); handleAdd(); }}
                disabled={added}
                style={{
                  padding: "12px 28px",
                  backgroundColor: added ? "#48bb78" : "#c05621",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  cursor: added ? "default" : "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => { if (!added) e.currentTarget.style.backgroundColor = "#9c4119"; }}
                onMouseLeave={(e) => { if (!added) e.currentTarget.style.backgroundColor = "#c05621"; }}
              >
                {added ? "Added!" : "Add to Quote"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const sectionRef = useRef<HTMLElement>(null);
  const { products } = useData();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".products-title",
        { y: 40 },
        { y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".products-title", start: "top 85%", once: true } }
      );

      gsap.fromTo(".product-card",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out", scrollTrigger: { trigger: ".products-list", start: "top 90%", once: true } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="products"
      style={{
        padding: "120px 0",
        background: "linear-gradient(180deg, #F2F5F7 0%, #D4E1E8 50%, #F2F5F7 100%)",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2 className="products-title" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, color: "#1C2B36", marginBottom: "20px" }}>
            Our <span style={{ color: "#5F8A9E" }}>Products</span>
          </h2>
          <div style={{ width: "60px", height: "4px", background: "#C05621", margin: "0 auto 20px", borderRadius: "2px" }} />
          <p style={{ fontSize: "18px", color: "#5A6E78", maxWidth: "600px", margin: "0 auto" }}>
            Quality industrial equipment built with precision and durability in mind.
          </p>
        </div>

        {/* All Products */}
        <div className="products-list" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {products.map((product) => (
            <AccordionCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "60px" }}>
          <a
            href="#contact"
            style={{
              display: "inline-block",
              padding: "20px 56px",
              background: "linear-gradient(135deg, #C05621, #c05621)",
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: 600,
              borderRadius: "8px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontSize: "14px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 20px rgba(192, 86, 33, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(192, 86, 33, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(192, 86, 33, 0.3)";
            }}
          >
            Request Product Information
          </a>
        </div>
      </div>
    </section>
  );
}
