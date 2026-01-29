"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useQuote } from "@/context/QuoteContext";

export default function QuoteCart() {
  const {
    items,
    totalItems,
    isCartOpen,
    setCartOpen,
    removeItem,
    updateQuantity,
    clearCart,
    formatCartForSubmission,
  } = useQuote();

  const fabRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const prevTotalRef = useRef(0);

  // FAB bounce-in when first item added
  useEffect(() => {
    if (totalItems > 0 && prevTotalRef.current === 0 && fabRef.current) {
      gsap.fromTo(
        fabRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }
      );
    }
    prevTotalRef.current = totalItems;
  }, [totalItems]);

  // Drawer slide-in animation
  useEffect(() => {
    if (isCartOpen && drawerRef.current && backdropRef.current) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        drawerRef.current,
        { x: "100%" },
        { x: "0%", duration: 0.35, ease: "power3.out" }
      );
    }
    if (!isCartOpen) {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const closeDrawer = useCallback(() => {
    if (drawerRef.current && backdropRef.current) {
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.25 });
      gsap.to(drawerRef.current, {
        x: "100%",
        duration: 0.3,
        ease: "power3.in",
        onComplete: () => setCartOpen(false),
      });
    } else {
      setCartOpen(false);
    }
  }, [setCartOpen]);

  // Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) closeDrawer();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isCartOpen, closeDrawer]);

  const handleSubmitQuote = () => {
    closeDrawer();
    // Small delay for drawer to close before scrolling
    setTimeout(() => {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 350);
  };

  return (
    <>
      {/* Floating cart button */}
      {totalItems > 0 && (
        <button
          ref={fabRef}
          onClick={() => setCartOpen(true)}
          style={{
            position: "fixed",
            bottom: "32px",
            right: "32px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#2b6cb0",
            color: "#ffffff",
            border: "none",
            cursor: "pointer",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(43, 108, 176, 0.4)",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          {/* Badge */}
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: "#c05621",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {totalItems}
          </span>
        </button>
      )}

      {/* Drawer */}
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <div
            ref={backdropRef}
            onClick={closeDrawer}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 1000,
            }}
          />
          {/* Drawer panel */}
          <div
            ref={drawerRef}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "420px",
              maxWidth: "90vw",
              background: "#FFFFFF",
              zIndex: 1001,
              display: "flex",
              flexDirection: "column",
              boxShadow: "-4px 0 30px rgba(0,0,0,0.15)",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "24px",
                borderBottom: "1px solid rgba(43, 108, 176, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#1a202c", margin: 0 }}>
                  Quote Cart
                </h3>
                <p style={{ fontSize: "14px", color: "#5a6578", margin: "4px 0 0" }}>
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </p>
              </div>
              <button
                onClick={closeDrawer}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#5a6578",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>

            {/* Items list */}
            <div style={{ flex: 1, overflow: "auto", padding: "16px 24px" }}>
              {items.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    color: "#5a6578",
                    fontSize: "16px",
                  }}
                >
                  Your quote cart is empty
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.productId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 0",
                      borderBottom: "1px solid rgba(43, 108, 176, 0.08)",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "#1a202c",
                          margin: 0,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.productName}
                      </p>
                      <button
                        onClick={() => removeItem(item.productId)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#c53030",
                          fontSize: "13px",
                          cursor: "pointer",
                          padding: "4px 0 0",
                          textDecoration: "underline",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid rgba(43, 108, 176, 0.15)",
                        borderRadius: "6px",
                        overflow: "hidden",
                        marginLeft: "12px",
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        style={{
                          width: "32px",
                          height: "32px",
                          border: "none",
                          background: "#F3F1ED",
                          cursor: "pointer",
                          fontSize: "16px",
                          color: "#1a202c",
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          width: "36px",
                          textAlign: "center",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#1a202c",
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        style={{
                          width: "32px",
                          height: "32px",
                          border: "none",
                          background: "#F3F1ED",
                          cursor: "pointer",
                          fontSize: "16px",
                          color: "#1a202c",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div
                style={{
                  padding: "24px",
                  borderTop: "1px solid rgba(43, 108, 176, 0.1)",
                }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    color: "#5a6578",
                    marginBottom: "16px",
                    lineHeight: 1.6,
                  }}
                >
                  {formatCartForSubmission()}
                </p>
                <button
                  onClick={handleSubmitQuote}
                  style={{
                    width: "100%",
                    padding: "16px",
                    backgroundColor: "#c05621",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    cursor: "pointer",
                    transition: "background 0.2s ease",
                    marginBottom: "12px",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#9c4119")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#c05621")}
                >
                  Submit Quote Request
                </button>
                <button
                  onClick={clearCart}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: "none",
                    border: "none",
                    color: "#5a6578",
                    fontSize: "14px",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
