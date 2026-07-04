import React, { useState, useEffect, useRef } from "react";
import { Coffee, ArrowRight, Shield, ChevronDown } from "lucide-react";

export default function IntroScreen({ onGetStarted, onAdminLogin }) {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const parallaxRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        setScrollY(parallaxRef.current.scrollTop);
      }
    };

    const el = parallaxRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (adminCode === "admin123") {
      setError(false);
      onAdminLogin();
    } else {
      setError(true);
      setAdminCode("");
    }
  };

  // Parallax speed multipliers
  const bgY = scrollY * 0.3;
  const midY = scrollY * 0.5;
  const frontY = scrollY * 0.8;

  return (
    <div
      ref={parallaxRef}
      style={{
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        fontFamily: "'Public Sans', sans-serif",
        position: "relative",
      }}
    >
      {/* ===== PARALLAX BACKGROUND LAYERS ===== */}

      {/* Layer 1: Deep background - slowest */}
       <button
                type="button"
                onClick={() => {
                  setShowAdminLogin(false);
                  setAdminCode("");
                  setError(false);
                }}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: 10,
                  border: "1px solid #5C4A38",
                  background: "transparent",
                  color: "#9A8770",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
      <div
        style={{
          position: "fixed",
          top: -bgY,
          left: 0,
          width: "100%",
          height: "120vh",
          background: "linear-gradient(180deg, #2B1B12 0%, #4A2E1F 40%, #6B4423 70%, #8B5E3C 100%)",
          zIndex: 1,
        }}
      />

      {/* Layer 2: Floating coffee beans - slow */}
      <div
        style={{
          position: "fixed",
          top: -midY + 50,
          left: "10%",
          width: 80,
          height: 80,
          borderRadius: "50% 40% 45% 55%",
          background: "radial-gradient(circle at 30% 30%, #B8763E, #8B5E3C)",
          opacity: 0.15,
          transform: `rotate(${scrollY * 0.1}deg)`,
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: -midY + 200,
          right: "15%",
          width: 60,
          height: 60,
          borderRadius: "45% 55% 50% 40%",
          background: "radial-gradient(circle at 30% 30%, #D8A15C, #B8763E)",
          opacity: 0.12,
          transform: `rotate(${-scrollY * 0.15}deg)`,
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: -midY + 400,
          left: "5%",
          width: 100,
          height: 100,
          borderRadius: "50% 45% 55% 50%",
          background: "radial-gradient(circle at 30% 30%, #9A6B3C, #6B4423)",
          opacity: 0.08,
          transform: `rotate(${scrollY * 0.08}deg)`,
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: -midY + 550,
          right: "8%",
          width: 45,
          height: 45,
          borderRadius: "55% 45% 50% 60%",
          background: "radial-gradient(circle at 30% 30%, #C4956A, #9A6B3C)",
          opacity: 0.1,
          transform: `rotate(${-scrollY * 0.12}deg)`,
          zIndex: 2,
        }}
      />

      {/* Layer 3: Steam wisps - medium speed */}
      <div
        style={{
          position: "fixed",
          top: -frontY + 100,
          left: "20%",
          width: 120,
          height: 200,
          background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)",
          borderRadius: "50%",
          filter: "blur(20px)",
          transform: `translateX(${Math.sin(scrollY * 0.01) * 20}px)`,
          zIndex: 3,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: -frontY + 250,
          right: "25%",
          width: 100,
          height: 180,
          background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)",
          borderRadius: "50%",
          filter: "blur(25px)",
          transform: `translateX(${Math.cos(scrollY * 0.01) * 15}px)`,
          zIndex: 3,
        }}
      />

      {/* ===== CONTENT SECTIONS ===== */}

      {/* Section 1: Hero */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          textAlign: "center",
        }}
      >
        {/* Logo with glow */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "radial-gradient(circle, #B8763E 0%, #8B5E3C 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
            boxShadow: "0 0 60px rgba(184, 118, 62, 0.4), 0 0 120px rgba(184, 118, 62, 0.2)",
            animation: "float 3s ease-in-out infinite",
          }}
        >
          <Coffee size={44} color="#FFF" />
        </div>

        <div
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(36px, 8vw, 64px)",
            fontWeight: 700,
            color: "#F7F2E9",
            marginBottom: 12,
            textShadow: "0 4px 20px rgba(0,0,0,0.3)",
            transform: `translateY(${-scrollY * 0.1}px)`,
            opacity: Math.max(0, 1 - scrollY / 400),
          }}
        >
          Brew & Bean
        </div>

        <div
          style={{
            fontSize: "clamp(14px, 3vw, 18px)",
            color: "#D8C9AF",
            marginBottom: 48,
            maxWidth: 400,
            lineHeight: 1.7,
            transform: `translateY(${-scrollY * 0.05}px)`,
            opacity: Math.max(0, 1 - scrollY / 350),
          }}
        >
          Your favorite iced coffee, just a tap away.
          <br />
          Order, pay, and enjoy — no waiting in line.
        </div>

        <button
          onClick={onGetStarted}
          className="cos-btn"
          style={{
            padding: "16px 40px",
            borderRadius: 14,
            border: "none",
            background: "#B8763E",
            color: "#FFF",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 8px 30px rgba(184, 118, 62, 0.4)",
            transform: `translateY(${-scrollY * 0.03}px)`,
            opacity: Math.max(0, 1 - scrollY / 300),
          }}
        >
          Get Started
          <ArrowRight size={20} />
        </button>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: Math.max(0, 1 - scrollY / 200),
          }}
        >
          <span style={{ fontSize: 11, color: "#9A8770", letterSpacing: 2, textTransform: "uppercase" }}>
            Scroll
          </span>
          <ChevronDown size={20} color="#9A8770" className="bounce" />
        </div>
      </div>

      {/* Section 2: Features (parallax reveal) */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "80px 24px",
          background: "linear-gradient(180deg, transparent 0%, rgba(43, 27, 18, 0.95) 20%, #2B1B12 100%)",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: 60,
              transform: `translateY(${Math.max(0, 100 - (scrollY - 200) * 0.3)}px)`,
              opacity: Math.min(1, Math.max(0, (scrollY - 200) / 300)),
            }}
          >
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 700, color: "#F7F2E9", marginBottom: 12 }}>
              How It Works
            </div>
            <div style={{ fontSize: 14, color: "#9A8770", maxWidth: 400, margin: "0 auto" }}>
              Three simple steps to your perfect cup
            </div>
          </div>

          {/* Feature cards with staggered parallax */}
          {[
            { num: "01", title: "Choose Your Drink", desc: "Browse our menu of handcrafted iced coffees" },
            { num: "02", title: "Pick Your Size", desc: "16oz or 22oz — your call" },
            { num: "03", title: "Pay & Enjoy", desc: "Cash, GCash, or card. We'll have it ready" },
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 20,
                padding: "24px",
                background: "rgba(255, 253, 249, 0.05)",
                border: "1px solid rgba(216, 201, 175, 0.15)",
                borderRadius: 14,
                marginBottom: 16,
                transform: `translateX(${Math.max(0, 50 - (scrollY - 400 - i * 100) * 0.2)}px)`,
                opacity: Math.min(1, Math.max(0, (scrollY - 400 - i * 100) / 200)),
                transition: "border-color 0.3s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(184, 118, 62, 0.4)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(216, 201, 175, 0.15)"}
            >
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#B8763E",
                  lineHeight: 1,
                }}
              >
                {feature.num}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#F7F2E9", marginBottom: 4 }}>
                  {feature.title}
                </div>
                <div style={{ fontSize: 13, color: "#9A8770", lineHeight: 1.6 }}>
                  {feature.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Bottom CTA */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "60px 24px 100px",
          textAlign: "center",
          background: "#2B1B12",
        }}
      >
        <div
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(20px, 4vw, 28px)",
            fontWeight: 700,
            color: "#F7F2E9",
            marginBottom: 24,
            transform: `translateY(${Math.max(0, 50 - (scrollY - 800) * 0.2)}px)`,
            opacity: Math.min(1, Math.max(0, (scrollY - 800) / 300)),
          }}
        >
          Ready to order?
        </div>

        <button
          onClick={onGetStarted}
          className="cos-btn"
          style={{
            padding: "16px 48px",
            borderRadius: 14,
            border: "none",
            background: "#B8763E",
            color: "#FFF",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: 40,
            boxShadow: "0 8px 30px rgba(184, 118, 62, 0.4)",
            transform: `translateY(${Math.max(0, 30 - (scrollY - 900) * 0.15)}px)`,
            opacity: Math.min(1, Math.max(0, (scrollY - 900) / 200)),
          }}
        >
          Start Ordering
          <ArrowRight size={20} />
        </button>

        {/* Admin Login */}
        {!showAdminLogin ? (
          <button
            onClick={() => setShowAdminLogin(true)}
            style={{
              background: "none",
              border: "none",
              color: "#5C4A38",
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              margin: "0 auto",
            }}
          >
            <Shield size={12} />
            Admin Access
          </button>
        ) : (
          <form onSubmit={handleAdminSubmit} style={{ maxWidth: 320, margin: "0 auto" }}>
            <div style={{ fontSize: 11, color: "#7A6650", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1.5 }}>
              Enter Admin Code
            </div>
            <input
              type="password"
              value={adminCode}
              onChange={(e) => {
                setAdminCode(e.target.value);
                setError(false);
              }}
              placeholder="Enter code..."
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 10,
                border: error ? "1.5px solid #C44" : "1px solid #5C4A38",
                background: "rgba(255, 253, 249, 0.05)",
                fontSize: 15,
                fontFamily: "'Space Mono', monospace",
                color: "#F7F2E9",
                marginBottom: 10,
                outline: "none",
                textAlign: "center",
              }}
              autoFocus
            />
            {error && (
              <div style={{ color: "#C44", fontSize: 12, marginBottom: 10 }}>
                Incorrect code. Try again.
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: 10,
                  border: "none",
                  background: "#B8763E",
                  color: "#FFF",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Login
              </button>
         
            </div>
          </form>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        .bounce {
          animation: bounce 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}