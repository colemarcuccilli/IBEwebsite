"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import ibeLogo from "@/assets/IBENewLogo.png";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Products", href: "#products" },
  { name: "Events", href: "#events" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const ctx = gsap.context(() => {
      gsap.fromTo(".nav-item",
        { y: -15 },
        { y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.3 }
      );

      gsap.fromTo(".nav-logo",
        { x: -20 },
        { x: 0, duration: 0.8, ease: "power2.out" }
      );
    }, navRef);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setIsMobileMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      ctx.revert();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "all 0.3s ease",
        backgroundColor: isMobileMenuOpen ? "rgba(28, 43, 54, 0.98)" : isScrolled ? "rgba(242,245,247,0.95)" : "transparent",
        backdropFilter: isScrolled || isMobileMenuOpen ? "blur(12px)" : "none",
        boxShadow: isScrolled ? "0 1px 12px rgba(0,0,0,0.08)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "80px",
          }}
        >
          <a
            href="#home"
            className="nav-logo"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textDecoration: "none",
            }}
          >
            <Image
              src={ibeLogo}
              alt="IBE - Industrial Bakery Equipment"
              height={48}
              width={96}
              style={{ objectFit: "contain" }}
              priority
            />
            <span className="chrome-italic" style={{ fontSize: "18px", letterSpacing: "1.5px", whiteSpace: "nowrap" }}>
              Industrial Bakery Equipment
            </span>
          </a>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "40px",
              }}
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="nav-item"
                  style={{
                    color: isScrolled ? "#1C2B36" : "#ffffff",
                    textDecoration: "none",
                    fontSize: "16px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    transition: "color 0.3s ease",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#C05621")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = isScrolled ? "#1C2B36" : "#ffffff")}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                className="nav-item"
                style={{
                  backgroundColor: "#C05621",
                  color: "#ffffff",
                  padding: "14px 28px",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontSize: "15px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(192, 86, 33, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#9c4119";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(192, 86, 33, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#C05621";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(192, 86, 33, 0.3)";
                }}
              >
                Get Quote
              </a>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              style={{
                background: "none",
                border: "none",
                color: isScrolled ? "#1C2B36" : "#ffffff",
                padding: "8px",
                cursor: "pointer",
                transition: "color 0.3s ease",
              }}
            >
              <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && isMobileMenuOpen && (
          <div
            style={{
              backgroundColor: "rgba(28, 43, 54, 0.98)",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "16px 0",
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "16px 24px",
                  color: "rgba(255, 255, 255, 0.85)",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {link.name}
              </a>
            ))}
            <div style={{ padding: "8px 24px 8px" }}>
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "16px 24px",
                  backgroundColor: "#C05621",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  borderRadius: "6px",
                  textAlign: "center",
                }}
              >
                Get Quote
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
