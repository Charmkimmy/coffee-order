import React, { useState, useEffect } from "react";
import { ArrowRight, Shield } from "lucide-react";

export default function IntroScreen({ onGetStarted, onAdminLogin }) {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState(false);
  const [stamping, setStamping] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleSteps((prev) => {
        if (prev >= 3) {
          clearInterval(timer);
          return 3;
        }
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(timer);
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

  const handleGetStarted = () => {
    setStamping(true);
    setTimeout(() => {
      onGetStarted();
    }, 400);
  };

  const steps = [
    { label: "CHOOSE YOUR DRINK", note: "5 flavors on tap" },
    { label: "PICK YOUR SIZE", note: "16oz or 22oz" },
    { label: "PAY & ENJOY", note: "cash · gcash" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        fontFamily: "'Georgia', 'Playfair Display', serif",
        background: "#1a1208",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      {/* Background glow effects */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)",
          top: -150,
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 70%)",
          bottom: 100,
          right: -100,
          pointerEvents: "none",
        }}
      />

      {/* Staff button - top right */}
      <div style={{ position: "absolute", top: 24, right: 24, zIndex: 10 }}>
        {!showAdminLogin ? (
          <button
            onClick={() => setShowAdminLogin(true)}
            style={{
              background: "rgba(44,24,16,0.8)",
              border: "1px solid rgba(201,169,110,0.3)",
              borderRadius: 8,
              color: "#C9A96E",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 10,
              letterSpacing: 2,
              padding: "8px 14px",
              cursor: "pointer",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: 6,
              backdropFilter: "blur(10px)",
            }}
          >
            <Shield size={12} />
            Staff
          </button>
        ) : (
          <form
            onSubmit={handleAdminSubmit}
            style={{
              width: 220,
              background: "rgba(26,18,8,0.95)",
              border: "1px solid rgba(201,169,110,0.3)",
              borderRadius: 12,
              padding: 16,
              backdropFilter: "blur(20px)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "#8a7f6c",
                marginBottom: 10,
                fontFamily: "'Montserrat', sans-serif",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Override Code
            </div>
            <input
              type="password"
              value={adminCode}
              onChange={(e) => {
                setAdminCode(e.target.value);
                setError(false);
              }}
              placeholder="••••••"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: error ? "1.5px solid #c0392b" : "1px solid rgba(201,169,110,0.3)",
                background: "rgba(44,24,16,0.6)",
                fontSize: 16,
                fontFamily: "'Montserrat', sans-serif",
                color: "#F5F0EB",
                marginBottom: 10,
                outline: "none",
                boxSizing: "border-box",
              }}
              autoFocus
            />
            {error && (
              <div style={{ color: "#c0392b", fontSize: 10, marginBottom: 10, fontFamily: "'Montserrat', sans-serif" }}>
                Denied — Try Again
              </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: 6,
                  border: "none",
                  background: "#C9A96E",
                  color: "#1a1208",
                  fontSize: 11,
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  cursor: "pointer",
                  textTransform: "uppercase",
                }}
              >
                Enter
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAdminLogin(false);
                  setAdminCode("");
                  setError(false);
                }}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: 6,
                  border: "1px solid rgba(201,169,110,0.3)",
                  background: "transparent",
                  color: "#8a7f6c",
                  fontSize: 11,
                  fontFamily: "'Montserrat', sans-serif",
                  cursor: "pointer",
                }}
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>

      {/* HEADER - Logo Area */}
      <div style={{ textAlign: "center", marginBottom: 32, position: "relative", zIndex: 2 }}>
        {/* Logo with gold ring */}
        <div
          style={{
            width: 120,
            height: 120,
            margin: "0 auto 20px",
            borderRadius: "50%",
            border: "2px solid #C9A96E",
            padding: 4,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -8,
              border: "1px solid rgba(201,169,110,0.3)",
              borderRadius: "50%",
            }}
          />
          <img
            src="/logo512.png"
            alt="Calma Cafe"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "#F5F0EB",
            letterSpacing: 10,
            textTransform: "uppercase",
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          CALMA
        </div>
        <div
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 12,
            fontWeight: 300,
            letterSpacing: 8,
            color: "#C9A96E",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          CAFE
        </div>
        <div
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 12,
            color: "#8a7f6c",
            fontStyle: "italic",
          }}
        >
          Coffee · Comfort · Calma
        </div>
      </div>

      {/* STEPS CARD */}
      <div
        style={{
          background: "rgba(44,24,16,0.6)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(201,169,110,0.2)",
          borderRadius: 16,
          width: "100%",
          maxWidth: 360,
          padding: 24,
          marginBottom: 24,
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: 3,
            color: "#C9A96E",
            marginBottom: 20,
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          How It Works
        </div>

        {steps.map((s, i) => (
          <div
            key={s.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "14px 0",
              borderBottom: i < steps.length - 1 ? "1px solid rgba(201,169,110,0.1)" : "none",
              opacity: visibleSteps > i ? 1 : 0,
              transform: visibleSteps > i ? "translateX(0)" : "translateX(-20px)",
              transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
              transitionDelay: `${i * 0.15}s`,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "1.5px solid #C9A96E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: "#C9A96E",
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#F5F0EB",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 2,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 11,
                  color: "#8a7f6c",
                }}
              >
                {s.note}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA BUTTON */}
      <div style={{ width: "100%", maxWidth: 360, marginBottom: 32, position: "relative", zIndex: 2 }}>
        <button
          onClick={handleGetStarted}
          style={{
            width: "100%",
            padding: 18,
            background: stamping ? "#a88a4e" : "#C9A96E",
            color: "#1a1208",
            border: "none",
            borderRadius: 12,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            transition: "all 0.3s ease",
            transform: stamping ? "scale(0.95)" : "scale(1)",
            boxShadow: stamping
              ? "0 4px 12px rgba(201,169,110,0.2)"
              : "0 4px 16px rgba(201,169,110,0.3)",
          }}
          onMouseEnter={(e) => {
            if (!stamping) {
              e.currentTarget.style.background = "#e8d5a3";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(201,169,110,0.4)";
            }
          }}
          onMouseLeave={(e) => {
            if (!stamping) {
              e.currentTarget.style.background = "#C9A96E";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(201,169,110,0.3)";
            }
          }}
        >
          Start Order
          <ArrowRight size={18} />
        </button>
      </div>

      {/* FOOTER */}
      <div
        style={{
          textAlign: "center",
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 10,
          color: "#5a4a3a",
          letterSpacing: 2,
          textTransform: "uppercase",
          position: "relative",
          zIndex: 2,
        }}
      >
        Est. 2026 · Specialty Coffee
      </div>
    </div>
  );
}