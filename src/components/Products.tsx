"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useData } from "@/context/DataContext";
import { Product, productCategories } from "@/data/products";
import ProductModal from "@/components/ProductModal";

gsap.registerPlugin(ScrollTrigger);

const categoryIcons: Record<string, ReactNode> = {
  bakery: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: "28px", height: "28px" }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12 8.25V6.75" />
    </svg>
  ),
  "blast-freeze": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: "28px", height: "28px" }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  carts: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: "28px", height: "28px" }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  ),
};

const DefaultProductIcon = () => (
  <svg viewBox="0 0 60 60" style={{ width: "100%", height: "100%" }}>
    <rect x="10" y="5" width="4" height="50" fill="#a0aec0" rx="1" />
    <rect x="46" y="5" width="4" height="50" fill="#a0aec0" rx="1" />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x="14" y={12 + i * 12} width="32" height="3" fill="#718096" rx="1" />
    ))}
    <circle cx="12" cy="58" r="3" fill="#a0aec0" />
    <circle cx="48" cy="58" r="3" fill="#a0aec0" />
  </svg>
);

const categoryLabels: Record<string, string> = {
  bakery: "Bakery",
  "blast-freeze": "Blast Freeze",
  carts: "Carts",
};

export default function Products() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState("bakery");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { products } = useData();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".products-title",
        { y: 40 },
        { y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".products-title", start: "top 85%", once: true } }
      );

      gsap.fromTo(".category-tab",
        { y: 25 },
        { y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".category-tabs", start: "top 90%", once: true } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    gsap.fromTo(".product-card", { y: 25 }, { y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" });
  }, [activeCategory]);

  const filteredProducts = products.filter((p) => p.category === activeCategory);

  return (
    <section
      ref={sectionRef}
      id="products"
      style={{
        padding: "120px 0",
        background: "linear-gradient(180deg, #FAFAF8 0%, #e8eef6 50%, #FAFAF8 100%)",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2 className="products-title" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, color: "#1a202c", marginBottom: "20px" }}>
            Our <span style={{ color: "#2b6cb0" }}>Products</span>
          </h2>
          <div style={{ width: "60px", height: "4px", background: "#dd6b20", margin: "0 auto 20px", borderRadius: "2px" }} />
          <p style={{ fontSize: "18px", color: "#5a6578", maxWidth: "600px", margin: "0 auto" }}>
            Quality industrial equipment built with precision and durability in mind.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs" style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "60px", flexWrap: "wrap" }}>
          {productCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className="category-tab"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 32px",
                borderRadius: "8px",
                border: "2px solid",
                borderColor: activeCategory === category.id ? "#2b6cb0" : "rgba(43, 108, 176, 0.2)",
                background: activeCategory === category.id ? "linear-gradient(135deg, #2b6cb0, #2c5282)" : "#FFFFFF",
                color: activeCategory === category.id ? "#ffffff" : "#4a5568",
                fontSize: "15px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "1px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: activeCategory === category.id ? "0 4px 15px rgba(43, 108, 176, 0.3)" : "0 2px 4px rgba(0,0,0,0.04)",
              }}
            >
              <span style={{ color: activeCategory === category.id ? "#ffffff" : "#2b6cb0" }}>
                {categoryIcons[category.id]}
              </span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "32px" }}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="product-card"
              style={{
                background: "#FFFFFF",
                borderRadius: "16px",
                overflow: "hidden",
                transition: "all 0.3s ease",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                border: "1px solid rgba(43, 108, 176, 0.1)",
              }}
              onClick={() => {
                setSelectedProduct(product);
                setIsModalOpen(true);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(43, 108, 176, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.06)";
              }}
            >
              {/* Product Image */}
              <div style={{ position: "relative", width: "100%", height: "220px", background: "#f0f4f8", overflow: "hidden" }}>
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #e8eef6, #f0f4f8)" }}>
                    <div style={{ width: "100px", height: "100px", opacity: 0.4 }}>
                      <DefaultProductIcon />
                    </div>
                  </div>
                )}
                {/* Category badge overlay */}
                <div style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  padding: "6px 14px",
                  background: "rgba(43, 108, 176, 0.9)",
                  borderRadius: "20px",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  backdropFilter: "blur(4px)",
                }}>
                  {categoryLabels[product.category] || product.category}
                </div>
              </div>

              {/* Product Info */}
              <div style={{ padding: "24px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#1a202c", marginBottom: "10px" }}>
                  {product.name}
                </h3>
                <p style={{ fontSize: "14px", color: "#5a6578", lineHeight: 1.7, marginBottom: "16px" }}>
                  {product.description}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#dd6b20", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  View Details
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "80px" }}>
          <a
            href="#contact"
            style={{
              display: "inline-block",
              padding: "20px 56px",
              background: "linear-gradient(135deg, #dd6b20, #c05621)",
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: 600,
              borderRadius: "8px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontSize: "14px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 20px rgba(221, 107, 32, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(221, 107, 32, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(221, 107, 32, 0.3)";
            }}
          >
            Request Product Information
          </a>
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </section>
  );
}
