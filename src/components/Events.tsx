"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useData } from "@/context/DataContext";

gsap.registerPlugin(ScrollTrigger);

export default function Events() {
  const sectionRef = useRef<HTMLElement>(null);
  const { events } = useData();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".events-title",
        { y: 40 },
        { y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".events-title", start: "top 85%", once: true } }
      );

      gsap.fromTo(".event-card",
        { y: 25 },
        { y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: ".events-grid", start: "top 90%", once: true } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="events"
      style={{
        padding: "120px 0",
        background: "linear-gradient(180deg, #E8EDF0 0%, #D4E1E8 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 10 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2 className="events-title" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, color: "#1C2B36", marginBottom: "20px" }}>
            <span style={{ color: "#5F8A9E" }}>Events</span> & Trade Shows
          </h2>
          <div style={{ width: "60px", height: "4px", background: "#C05621", margin: "0 auto 20px", borderRadius: "2px" }} />
          <p style={{ fontSize: "18px", color: "#5A6E78", maxWidth: "600px", margin: "0 auto" }}>
            Meet us at industry events and see our equipment in person.
          </p>
        </div>

        {/* Events Grid */}
        <div className="events-grid" style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {events.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "32px", marginBottom: "40px" }}>
              {events.map((event) => (
                <div
                  key={event.id}
                  className="event-card"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(95, 138, 158, 0.15)",
                    borderRadius: "16px",
                    padding: "40px",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                    borderTop: "4px solid #5F8A9E",
                  }}
                >
                  {/* Date Badge */}
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "10px 20px", background: "linear-gradient(135deg, #5F8A9E, #3D6478)", borderRadius: "100px", marginBottom: "24px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span style={{ color: "#ffffff", fontSize: "14px", fontWeight: 600 }}>{event.date}</span>
                  </div>

                  <h3 style={{ fontSize: "24px", fontWeight: 700, color: "#1C2B36", marginBottom: "16px", lineHeight: 1.3 }}>
                    {event.title}
                  </h3>

                  {/* Location */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C05621" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span style={{ color: "#5A6E78", fontSize: "15px" }}>{event.location}</span>
                  </div>

                  <p style={{ color: "#5A6E78", fontSize: "16px", lineHeight: 1.7 }}>
                    {event.description}
                  </p>

                  {event.link && (
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#C05621",
                        fontSize: "14px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        textDecoration: "none",
                        marginTop: "24px",
                        transition: "gap 0.3s ease",
                      }}
                    >
                      Learn More
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div
              className="event-card"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(95, 138, 158, 0.15)",
                borderRadius: "16px",
                padding: "60px 40px",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                marginBottom: "40px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                borderTop: "4px solid #5F8A9E",
              }}
            >
              {/* Calendar Icon */}
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  margin: "0 auto 32px",
                  background: "linear-gradient(135deg, rgba(95, 138, 158, 0.1), rgba(192, 86, 33, 0.1))",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="50" height="50" fill="none" stroke="#5F8A9E" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>

              <h3 style={{ fontSize: "28px", fontWeight: 600, color: "#1C2B36", marginBottom: "16px" }}>
                Upcoming Events
              </h3>
              <p style={{ fontSize: "17px", color: "#5A6E78", marginBottom: "40px", maxWidth: "500px", margin: "0 auto 40px", lineHeight: 1.7 }}>
                Check back soon for our upcoming trade show appearances and industry events.
              </p>

              <a
                href="#contact"
                style={{
                  display: "inline-block",
                  padding: "16px 36px",
                  background: "linear-gradient(135deg, #5F8A9E, #3D6478)",
                  border: "none",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: 600,
                  borderRadius: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(95, 138, 158, 0.3)",
                }}
              >
                Get Notified
              </a>
            </div>
          )}

          {/* Booth Photos */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "40px" }}>
            {[
              { src: "/images/eventbooth1.jpg", alt: "IBE trade show booth display" },
              { src: "/images/eventbooth2.jpg", alt: "IBE event booth showcase" },
            ].map((photo) => (
              <div
                key={photo.src}
                className="event-card"
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid rgba(95, 138, 158, 0.15)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={600}
                  height={400}
                  style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>

          {/* Info cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
            <div className="event-card" style={{ padding: "32px", background: "#FFFFFF", border: "1px solid rgba(95, 138, 158, 0.15)", borderRadius: "12px", textAlign: "center", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)", borderBottom: "3px solid #5F8A9E" }}>
              <div style={{ width: "56px", height: "56px", margin: "0 auto 16px", background: "rgba(95, 138, 158, 0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="28" height="28" fill="none" stroke="#5F8A9E" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <h4 style={{ fontSize: "18px", fontWeight: 600, color: "#1C2B36", marginBottom: "8px" }}>Fort Wayne, IN</h4>
              <p style={{ fontSize: "14px", color: "#5A6E78" }}>Visit our facility</p>
            </div>
            <div className="event-card" style={{ padding: "32px", background: "#FFFFFF", border: "1px solid rgba(192, 86, 33, 0.15)", borderRadius: "12px", textAlign: "center", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)", borderBottom: "3px solid #C05621" }}>
              <div style={{ width: "56px", height: "56px", margin: "0 auto 16px", background: "rgba(192, 86, 33, 0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="28" height="28" fill="none" stroke="#C05621" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              </div>
              <h4 style={{ fontSize: "18px", fontWeight: 600, color: "#1C2B36", marginBottom: "8px" }}>Live Demos</h4>
              <p style={{ fontSize: "14px", color: "#5A6E78" }}>See equipment in action</p>
            </div>
            <div className="event-card" style={{ padding: "32px", background: "#FFFFFF", border: "1px solid rgba(95, 138, 158, 0.15)", borderRadius: "12px", textAlign: "center", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)", borderBottom: "3px solid #5F8A9E" }}>
              <div style={{ width: "56px", height: "56px", margin: "0 auto 16px", background: "rgba(95, 138, 158, 0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="28" height="28" fill="none" stroke="#5F8A9E" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h4 style={{ fontSize: "18px", fontWeight: 600, color: "#1C2B36", marginBottom: "8px" }}>Meet the Team</h4>
              <p style={{ fontSize: "14px", color: "#5A6E78" }}>Talk with our experts</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
