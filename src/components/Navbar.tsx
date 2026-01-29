"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

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

  useEffect(() => {
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
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      ctx.revert();
      window.removeEventListener("scroll", handleScroll);
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
        backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.95)" : "transparent",
        backdropFilter: isScrolled ? "blur(12px)" : "none",
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
            <span
              style={{
                fontSize: "32px",
                fontWeight: 800,
                color: "#2b6cb0",
                letterSpacing: "-1px",
              }}
            >
              IBE
            </span>
            <span
              style={{
                fontSize: "14px",
                color: "#5a6578",
                display: "none",
              }}
              className="sm:inline-block"
            >
              Industrial Bakery Equipment
            </span>
          </a>

          {/* Desktop Navigation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "40px",
            }}
            className="hidden md:flex"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="nav-item"
                style={{
                  color: "#4a5568",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  transition: "color 0.3s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#c05621")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#4a5568")}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              className="nav-item"
              style={{
                backgroundColor: "#2b6cb0",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "1px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#dd6b20";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#2b6cb0";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Get Quote
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            style={{
              background: "none",
              border: "none",
              color: "#1a202c",
              padding: "8px",
              cursor: "pointer",
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
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.98)",
              borderTop: "1px solid rgba(26, 54, 93, 0.12)",
              padding: "20px 0",
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
                  color: "#1a202c",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: 500,
                  transition: "background 0.3s ease",
                }}
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
