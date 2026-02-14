"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Product } from "@/data/products";
import { useQuote } from "@/context/QuoteContext";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

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

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useQuote();

  // Reset quantity when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setAdded(false);
    }
  }, [product]);

  // GSAP entrance animation
  useEffect(() => {
    if (isOpen && cardRef.current && overlayRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" }
        );
        gsap.fromTo(
          cardRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.5)" }
        );
      });
      return () => ctx.revert();
    }
  }, [isOpen]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const handleAdd = () => {
    if (!product) return;
    addItem(product.id, product.name, quantity);
    setAdded(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  if (!isOpen || !product) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        ref={cardRef}
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          maxWidth: "700px",
          width: "90%",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "none",
            background: "rgba(0,0,0,0.06)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            fontSize: "18px",
            color: "#5a6578",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.12)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.06)")}
        >
          ✕
        </button>

        {/* Product image */}
        <div
          style={{
            width: "100%",
            height: "400px",
            background: "#F3F1ED",
            position: "relative",
            borderRadius: "16px 16px 0 0",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              style={{ objectFit: "contain", padding: "16px" }}
              sizes="700px"
            />
          ) : (
            <div style={{ width: "150px", height: "150px", opacity: 0.5 }}>
              <DefaultProductIcon />
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "32px" }}>
          {/* Category badge */}
          <span
            style={{
              display: "inline-block",
              padding: "4px 14px",
              background: "rgba(43, 108, 176, 0.08)",
              color: "#2b6cb0",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "12px",
            }}
          >
            {categoryLabels[product.category] || product.category}
          </span>

          <h2
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#1a202c",
              marginBottom: "12px",
            }}
          >
            {product.name}
          </h2>
          <div
            style={{
              fontSize: "16px",
              color: "#5a6578",
              lineHeight: 1.7,
              marginBottom: "32px",
            }}
          >
            {product.description.split("\n\n").map((paragraph, i) => (
              <p key={i} style={{ marginBottom: i < product.description.split("\n\n").length - 1 ? "12px" : 0 }}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Quantity selector + Add to Quote */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid rgba(26, 54, 93, 0.15)",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{
                  width: "44px",
                  height: "44px",
                  border: "none",
                  background: "#F3F1ED",
                  cursor: "pointer",
                  fontSize: "20px",
                  color: "#1a202c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                −
              </button>
              <span
                style={{
                  width: "52px",
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1a202c",
                }}
              >
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                style={{
                  width: "44px",
                  height: "44px",
                  border: "none",
                  background: "#F3F1ED",
                  cursor: "pointer",
                  fontSize: "20px",
                  color: "#1a202c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={added}
              style={{
                flex: 1,
                minWidth: "180px",
                padding: "14px 32px",
                backgroundColor: added ? "#48bb78" : "#c05621",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "1px",
                cursor: added ? "default" : "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (!added) e.currentTarget.style.backgroundColor = "#9c4119";
              }}
              onMouseLeave={(e) => {
                if (!added) e.currentTarget.style.backgroundColor = "#c05621";
              }}
            >
              {added ? "Added!" : "Add to Quote"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
