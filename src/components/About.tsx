"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const industries = [
  "Baking",
  "Chicken Processing",
  "Seafood Processing",
  "Meat Drying/Smoking",
  "Government/Military",
  "Dietary Supplement",
  "Restaurant",
  "Hotel",
  "Snack Food",
  "Retail Grocery Store",
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".about-title",
        { y: 40 },
        { y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".about-title", start: "top 85%", once: true } }
      );

      gsap.fromTo(".about-content",
        { y: 30 },
        { y: 0, duration: 0.8, ease: "power3.out", delay: 0.2, scrollTrigger: { trigger: ".about-content", start: "top 85%", once: true } }
      );

      gsap.fromTo(".industry-tag",
        { scale: 0.8 },
        { scale: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.7)", scrollTrigger: { trigger: ".industries-container", start: "top 90%", once: true } }
      );

      gsap.fromTo(".stat-item",
        { y: 25 },
        { y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: ".stats-container", start: "top 90%", once: true } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        padding: "120px 0",
        background: "linear-gradient(180deg, #e8eef6 0%, #F3F1ED 100%)",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 10 }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <h2 className="about-title" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, color: "#1a202c", marginBottom: "20px" }}>
            About <span style={{ color: "#2b6cb0" }}>IBE</span>
          </h2>
          <div style={{ width: "60px", height: "4px", background: "#dd6b20", margin: "0 auto 20px", borderRadius: "2px" }} />
          <p style={{ fontSize: "18px", color: "#5a6578", maxWidth: "600px", margin: "0 auto" }}>
            Crafting quality industrial equipment since 2008
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "80px", alignItems: "center" }} className="lg:grid-cols-2">
          {/* Left - Stats */}
          <div>
            <div className="stats-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <div className="stat-item" style={{ textAlign: "center", padding: "32px 20px", background: "#FAFAF8", borderRadius: "12px", border: "1px solid rgba(43, 108, 176, 0.15)", borderTop: "4px solid #2b6cb0" }}>
                <div style={{ fontSize: "48px", fontWeight: 700, color: "#2b6cb0" }}>2008</div>
                <div style={{ fontSize: "14px", color: "#5a6578", textTransform: "uppercase", letterSpacing: "1px", marginTop: "8px" }}>Established</div>
              </div>
              <div className="stat-item" style={{ textAlign: "center", padding: "32px 20px", background: "#FAFAF8", borderRadius: "12px", border: "1px solid rgba(221, 107, 32, 0.15)", borderTop: "4px solid #dd6b20" }}>
                <div style={{ fontSize: "48px", fontWeight: 700, color: "#dd6b20" }}>10+</div>
                <div style={{ fontSize: "14px", color: "#5a6578", textTransform: "uppercase", letterSpacing: "1px", marginTop: "8px" }}>Industries</div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="about-content">
            <div style={{ marginBottom: "40px" }}>
              <h3 style={{ fontSize: "28px", fontWeight: 600, color: "#1a202c", marginBottom: "24px" }}>
                Precision Equipment for Modern Industry
              </h3>
              <p style={{ fontSize: "17px", color: "#5a6578", lineHeight: 1.8, marginBottom: "20px" }}>
                Around since 2008, we specialize in food service equipment, wire carts, and various wire and sheet metal related products.
              </p>
              <p style={{ fontSize: "17px", color: "#5a6578", lineHeight: 1.8 }}>
                Our capabilities encompass both standard steel and stainless steel wire and sheet metal, allowing us to serve a diverse range of industries with precision-crafted equipment.
              </p>
            </div>

            {/* Capabilities */}
            <div style={{ marginBottom: "40px", padding: "24px", background: "#FAFAF8", borderRadius: "8px", borderLeft: "4px solid #dd6b20" }}>
              <h4 style={{ fontSize: "18px", fontWeight: 600, color: "#2b6cb0", marginBottom: "16px" }}>Our Capabilities</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {["Standard Steel Wire & Sheet Metal", "Stainless Steel Wire & Sheet Metal", "Custom Food Service Equipment"].map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", color: "#1a202c", fontSize: "15px" }}>
                    <svg width="20" height="20" fill="#dd6b20" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Industries */}
            <div>
              <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#1a202c", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>Industries We Serve</h4>
              <div className="industries-container" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {industries.map((industry) => (
                  <span
                    key={industry}
                    className="industry-tag"
                    style={{
                      padding: "10px 18px",
                      background: "#FFFFFF",
                      border: "1px solid rgba(43, 108, 176, 0.25)",
                      borderRadius: "100px",
                      color: "#2b6cb0",
                      fontSize: "13px",
                      fontWeight: 500,
                      transition: "all 0.3s ease",
                      cursor: "default",
                    }}
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
