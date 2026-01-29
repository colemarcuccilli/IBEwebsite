"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuote } from "@/context/QuoteContext";

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        "expired-callback"?: () => void;
        "error-callback"?: () => void;
        theme?: "light" | "dark" | "auto";
      }) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const { items, formatCartForSubmission, clearCart, setCartOpen } = useQuote();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
    productInterest: "",
    products: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);

  // Sync cart items into form data
  useEffect(() => {
    setFormData((prev) => ({ ...prev, products: formatCartForSubmission() }));
  }, [items, formatCartForSubmission]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".contact-title",
        { y: 40 },
        { y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".contact-title", start: "top 85%", once: true } }
      );

      gsap.fromTo(".contact-form",
        { y: 25 },
        { y: 0, duration: 0.6, ease: "power3.out", delay: 0.2, scrollTrigger: { trigger: ".contact-form", start: "top 90%", once: true } }
      );

      gsap.fromTo(".contact-info",
        { x: 25 },
        { x: 0, duration: 0.6, ease: "power3.out", delay: 0.3, scrollTrigger: { trigger: ".contact-info", start: "top 90%", once: true } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Render Turnstile widget
  const renderTurnstile = useCallback(() => {
    if (
      window.turnstile &&
      turnstileRef.current &&
      !turnstileWidgetId.current
    ) {
      turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
        callback: (token: string) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
        theme: "light",
      });
    }
  }, []);

  useEffect(() => {
    // Try rendering immediately if script is already loaded
    renderTurnstile();

    // Also poll briefly in case the script loads after mount
    const interval = setInterval(() => {
      if (window.turnstile && turnstileRef.current && !turnstileWidgetId.current) {
        renderTurnstile();
        clearInterval(interval);
      }
    }, 500);

    return () => {
      clearInterval(interval);
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = null;
      }
    };
  }, [renderTurnstile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!turnstileToken) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, turnstileToken }),
      });

      if (!res.ok) {
        throw new Error("Submission failed");
      }

      setSubmitStatus("success");
      setFormData({ name: "", email: "", company: "", phone: "", message: "", productInterest: "", products: "" });
      clearCart();

      // Reset Turnstile for next submission
      setTurnstileToken("");
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId.current);
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "16px 20px",
    background: "#FFFFFF",
    border: "1px solid rgba(26, 54, 93, 0.15)",
    borderRadius: "8px",
    color: "#1a202c",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#5a6578",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{
        padding: "120px 0",
        background: "linear-gradient(180deg, #FAFAF8 0%, #e8eef6 100%)",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2 className="contact-title" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, color: "#1a202c", marginBottom: "20px" }}>
            Contact <span style={{ color: "#2b6cb0" }}>Us</span>
          </h2>
          <div style={{ width: "60px", height: "4px", background: "#dd6b20", margin: "0 auto 20px", borderRadius: "2px" }} />
          <p style={{ fontSize: "18px", color: "#5a6578", maxWidth: "600px", margin: "0 auto" }}>
            Ready to discuss your equipment needs? Get in touch with our team.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "60px" }} className="lg:grid-cols-5">
          {/* Form */}
          <div style={{ gridColumn: "span 1" }} className="lg:col-span-3">
            {items.length > 0 && (
              <div
                style={{
                  background: "rgba(192, 86, 33, 0.08)",
                  border: "1px solid rgba(192, 86, 33, 0.25)",
                  borderRadius: "12px",
                  padding: "20px 24px",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#c05621", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Quoted Products
                  </p>
                  <p style={{ fontSize: "15px", color: "#1a202c", margin: 0 }}>
                    {formatCartForSubmission()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCartOpen(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#c05621",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0,
                  }}
                >
                  Edit Cart
                </button>
              </div>
            )}
            <form onSubmit={handleSubmit} className="contact-form" style={{ background: "#F3F1ED", padding: "40px", borderRadius: "16px", border: "1px solid rgba(26, 54, 93, 0.08)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#2b6cb0")} onBlur={(e) => (e.target.style.borderColor = "rgba(26, 54, 93, 0.15)")} />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#2b6cb0")} onBlur={(e) => (e.target.style.borderColor = "rgba(26, 54, 93, 0.15)")} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                <div>
                  <label style={labelStyle}>Company</label>
                  <input type="text" name="company" value={formData.company} onChange={handleChange} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#2b6cb0")} onBlur={(e) => (e.target.style.borderColor = "rgba(26, 54, 93, 0.15)")} />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#2b6cb0")} onBlur={(e) => (e.target.style.borderColor = "rgba(26, 54, 93, 0.15)")} />
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={labelStyle}>Additional Product Interest</label>
                <select name="productInterest" value={formData.productInterest} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }} onFocus={(e) => (e.target.style.borderColor = "#2b6cb0")} onBlur={(e) => (e.target.style.borderColor = "rgba(26, 54, 93, 0.15)")}>
                  <option value="" style={{ background: "#FFFFFF" }}>Select a category</option>
                  <option value="bakery" style={{ background: "#FFFFFF" }}>Bakery Products</option>
                  <option value="blast-freeze" style={{ background: "#FFFFFF" }}>Blast Freeze Racks</option>
                  <option value="carts" style={{ background: "#FFFFFF" }}>Carts</option>
                  <option value="custom" style={{ background: "#FFFFFF" }}>Custom Solution</option>
                  <option value="other" style={{ background: "#FFFFFF" }}>Other</option>
                </select>
              </div>

              <div style={{ marginBottom: "32px" }}>
                <label style={labelStyle}>Message *</label>
                <textarea name="message" required rows={5} value={formData.message} onChange={handleChange} style={{ ...inputStyle, resize: "none" }} onFocus={(e) => (e.target.style.borderColor = "#2b6cb0")} onBlur={(e) => (e.target.style.borderColor = "rgba(26, 54, 93, 0.15)")} />
              </div>

              {/* Cloudflare Turnstile */}
              <div ref={turnstileRef} style={{ marginBottom: "24px" }} />

              <button
                type="submit"
                disabled={isSubmitting || !turnstileToken}
                style={{
                  width: "100%",
                  padding: "18px 40px",
                  background: (isSubmitting || !turnstileToken) ? "#a0aec0" : "linear-gradient(135deg, #dd6b20, #c05621)",
                  backgroundColor: (isSubmitting || !turnstileToken) ? "#a0aec0" : "#dd6b20",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  cursor: (isSubmitting || !turnstileToken) ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 20px rgba(221, 107, 32, 0.3)",
                }}
                onMouseEnter={(e) => { if (!isSubmitting) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(221, 107, 32, 0.4)"; }}}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(221, 107, 32, 0.3)"; }}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {submitStatus === "success" && (
                <div style={{ marginTop: "20px", padding: "16px", background: "rgba(72, 187, 120, 0.1)", border: "1px solid rgba(72, 187, 120, 0.3)", borderRadius: "8px", color: "#2f855a", textAlign: "center" }}>
                  Thank you! Your message has been sent successfully.
                </div>
              )}
              {submitStatus === "error" && (
                <div style={{ marginTop: "20px", padding: "16px", background: "rgba(245, 101, 101, 0.1)", border: "1px solid rgba(245, 101, 101, 0.3)", borderRadius: "8px", color: "#c53030", textAlign: "center" }}>
                  Something went wrong. Please try again.
                </div>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div style={{ gridColumn: "span 1" }} className="lg:col-span-2 contact-info">
            <div style={{ background: "#F3F1ED", padding: "40px", borderRadius: "16px", border: "1px solid rgba(26, 54, 93, 0.08)", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "24px", fontWeight: 600, color: "#1a202c", marginBottom: "32px" }}>Get In Touch</h3>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "28px" }}>
                <div style={{ width: "50px", height: "50px", background: "rgba(26, 54, 93, 0.08)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="24" height="24" fill="none" stroke="#1a365d" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: "14px", color: "#5a6578", marginBottom: "4px" }}>Location</p>
                  <p style={{ fontSize: "18px", color: "#1a202c", fontWeight: 500 }}>Fort Wayne, IN</p>
                </div>
              </div>
            </div>

            <div style={{ background: "rgba(26, 54, 93, 0.05)", padding: "32px", borderRadius: "16px", border: "1px solid rgba(26, 54, 93, 0.08)" }}>
              <h4 style={{ fontSize: "20px", fontWeight: 600, color: "#2b6cb0", marginBottom: "20px" }}>Why Choose IBE?</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {["In business since 2008", "Quality craftsmanship", "Custom solutions available", "Industry expertise"].map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px", color: "#1a202c", fontSize: "15px" }}>
                    <span style={{ width: "8px", height: "8px", background: "#c05621", borderRadius: "50%" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
