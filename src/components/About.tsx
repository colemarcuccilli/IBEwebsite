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
      gsap.fromTo(".about-content",
        { y: 30 },
        { y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".about-content", start: "top 85%", once: true } }
      );

      gsap.fromTo(".industry-tag",
        { scale: 0.8 },
        { scale: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.7)", scrollTrigger: { trigger: ".industries-container", start: "top 90%", once: true } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        padding: "100px 0",
        background: "#1C2B36",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
        <div className="about-content" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: "#ffffff", marginBottom: "24px", lineHeight: 1.3 }}>
            Steel &amp; stainless steel wire and sheet metal equipment for over a dozen industries.
          </h2>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.75)", lineHeight: 1.8, marginBottom: "20px", maxWidth: "650px", margin: "0 auto 20px" }}>
            Steel and stainless steel fabrication for many industries including baking, chicken processing, seafood processing, meat drying and smoking, government and military, dietary supplement, restaurant, hotel, snack food, and retail grocery.
          </p>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: "12px", maxWidth: "600px", margin: "0 auto 12px" }}>
            Fort Wayne, IN &mdash; In business since 2008
          </p>
          <a href="mailto:ibepurchasing@yahoo.com" style={{ display: "inline-block", fontSize: "16px", color: "#5F8A9E", textDecoration: "none", marginBottom: "48px", fontWeight: 500, transition: "color 0.3s ease" }}>
            ibepurchasing@yahoo.com
          </a>

          <div className="industries-container" style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
            {industries.map((industry) => (
              <span
                key={industry}
                className="industry-tag"
                style={{
                  padding: "8px 18px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "100px",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
