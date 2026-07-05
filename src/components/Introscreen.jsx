import React, { useState, useEffect, useRef } from "react";
import { Coffee, ArrowRight, Shield, Star } from "lucide-react";

export default function IntroScreen({ onGetStarted, onAdminLogin }) {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState(false);
  const [stamping, setStamping] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const ticketRef = useRef(null);
  const containerRef = useRef(null);

  // Animate steps appearing one by one
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

  // Parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: (e.clientX - rect.left - rect.width / 2) / 30,
          y: (e.clientY - rect.top - rect.height / 2) / 30,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
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
      ref={containerRef}
      style={{
        minHeight: "100vh",
        width: "100%",
        fontFamily: "'Public Sans', sans-serif",
        background: "#F2E9D8",
        backgroundImage:
          "radial-gradient(#E4D7BC 1px, transparent 1px), radial-gradient(#E4D7BC 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        backgroundPosition: "0 0, 12px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      {/* Animated floating coffee beans */}
      {[...Array(6)].map((_, i) => (
        <div
          key={`bean-${i}`}
          style={{
            position: "absolute",
            width: 8 + i * 3,
            height: 8 + i * 3,
            borderRadius: "50% 40%",
            background: `rgba(178, 58, 30, ${0.08 + i * 0.02})`,
            top: `${10 + i * 15}%`,
            left: `${5 + i * 18}%`,
            animation: `floatBean ${3 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
            transform: `translate(${mousePos.x * (0.5 + i * 0.2)}px, ${mousePos.y * (0.5 + i * 0.2)}px)`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Coffee stain watermark */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          right: "10%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          border: "3px solid rgba(178, 58, 30, 0.06)",
          transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "15%",
          right: "10%",
          width: 160,
          height: 160,
          borderRadius: "50%",
          border: "2px solid rgba(178, 58, 30, 0.04)",
          transform: `translate(${mousePos.x * 0.3 + 20}px, ${mousePos.y * 0.3 + 20}px)`,
          pointerEvents: "none",
        }}
      />

      {/* Steam wisps */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      >
        {[...Array(3)].map((_, i) => (
          <div
            key={`steam-${i}`}
            style={{
              position: "absolute",
              width: 40,
              height: 80,
              background: "linear-gradient(180deg, rgba(178,58,30,0.08) 0%, transparent 100%)",
              borderRadius: "50%",
              filter: "blur(8px)",
              left: -20 + i * 20,
              animation: `steamRise ${2.5 + i * 0.3}s ease-out infinite`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
      </div>

      {/* staff tag - top right */}
      <div style={{ position: "absolute", top: 100, right: 30, zIndex: 30 }}>
        {!showAdminLogin ? (
          <button
            onClick={() => setShowAdminLogin(true)}
            aria-label="Staff access"
            style={{
              background: "#EFE6D3",
              border: "1px solid #C9BB9E",
              borderRadius: 4,
              color: "#5C5140",
              fontSize: 10,
              fontFamily: "'Space Mono', monospace",
              letterSpacing: 1,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 10px",
              transform: "rotate(3deg)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "rotate(0deg) scale(1.05)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "rotate(3deg) scale(1)";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.12)";
            }}
          >
            <Shield size={12} />
            STAFF
          </button>
        ) : (
          <form
            onSubmit={handleAdminSubmit}
            style={{
              width: 200,
              background: "#FCFAF5",
              border: "1px solid #C9BB9E",
              borderRadius: 6,
              padding: 12,
              boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
              animation: "formPop 0.3s ease-out",
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "#8A7F6C",
                marginBottom: 8,
                fontFamily: "'Space Mono', monospace",
                letterSpacing: 1,
              }}
            >
              OVERRIDE CODE
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
                padding: "8px 10px",
                borderRadius: 4,
                border: error ? "1.5px solid #B23A1E" : "1px solid #C9BB9E",
                background: "#FFFDF9",
                fontSize: 16,
                fontFamily: "'Space Mono', monospace",
                color: "#241A12",
                marginBottom: 8,
                outline: "none",
                boxSizing: "border-box",
              }}
              autoFocus
            />
            {error && (
              <div style={{ color: "#B23A1E", fontSize: 10, marginBottom: 8, fontFamily: "'Space Mono', monospace", animation: "shake 0.4s ease" }}>
                DENIED — TRY AGAIN
              </div>
            )}
            <div style={{ display: "flex", gap: 6 }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: "7px",
                  borderRadius: 4,
                  border: "none",
                  background: "#241A12",
                  color: "#FCFAF5",
                  fontSize: 11,
                  fontFamily: "'Space Mono', monospace",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#3E2723"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#241A12"}
              >
                ENTER
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
                  padding: "7px",
                  borderRadius: 4,
                  border: "1px solid #C9BB9E",
                  background: "transparent",
                  color: "#8A7F6C",
                  fontSize: 11,
                  fontFamily: "'Space Mono', monospace",
                  cursor: "pointer",
                }}
              >
                BACK
              </button>
            </div>
          </form>
        )}
      </div>

      {/* THE TICKET */}
      <div
        ref={ticketRef}
        className="ticket"
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 380,
          transform: `rotate(-1.2deg) translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* zigzag top edge */}
        <div
          style={{
            height: 12,
            backgroundImage:
              "linear-gradient(135deg, #FCFAF5 50%, transparent 50%), linear-gradient(-135deg, #FCFAF5 50%, transparent 50%)",
            backgroundSize: "16px 16px",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "bottom",
          }}
        />

        <div
          style={{
            background: "#FCFAF5",
            padding: "28px 26px 22px",
            boxShadow: "0 18px 40px rgba(36,26,18,0.18)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Animated scan line on barcode */}
          <div style={{ position: "relative", marginBottom: 16 }}>
            <div
              style={{
                height: 22,
                background:
                  "repeating-linear-gradient(90deg, #241A12 0px, #241A12 2px, transparent 2px, transparent 4px, #241A12 4px, #241A12 5px, transparent 5px, transparent 9px)",
                opacity: 0.85,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 2,
                height: "100%",
                background: "rgba(178, 58, 30, 0.6)",
                animation: "scanLine 2.5s linear infinite",
                boxShadow: "0 0 6px rgba(178, 58, 30, 0.4)",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#8A7F6C", letterSpacing: 1 }}>
              NO. 001
            </span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#8A7F6C", letterSpacing: 1 }}>
              {new Date().toLocaleDateString(undefined, { month: "2-digit", day: "2-digit", year: "2-digit" })}
            </span>
          </div>

          {/* Logo with steam */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              margin: "10px 0 6px",
              position: "relative",
            }}
          >
            <div style={{ position: "relative" }}>
              <Coffee size={26} color="#241A12" />
              {/* Mini steam from cup */}
              <div
                style={{
                  position: "absolute",
                  top: -8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 8,
                  height: 12,
                  background: "linear-gradient(180deg, rgba(178,58,30,0.15), transparent)",
                  borderRadius: "50%",
                  filter: "blur(2px)",
                  animation: "miniSteam 1.5s ease-out infinite",
                }}
              />
            </div>
            <h1
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: "clamp(24px, 7vw, 30px)",
                letterSpacing: 2,
                color: "#241A12",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              Calma Cafe
            </h1>
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "#5C5140",
              marginBottom: 18,
              lineHeight: 1.6,
            }}
          >
            iced coffee, no line, no wait
          </div>

          <div style={{ borderTop: "1.5px dashed #C9BB9E", marginBottom: 16 }} />

          {/* receipt line items = the steps with typewriter effect */}
          <div style={{ marginBottom: 16 }}>
            {steps.map((s, i) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 6,
                  marginBottom: 10,
                  fontFamily: "'Space Mono', monospace",
                  opacity: visibleSteps > i ? 1 : 0,
                  transform: visibleSteps > i ? "translateX(0)" : "translateX(-20px)",
                  transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  transitionDelay: `${i * 0.15}s`,
                }}
              >
                <span style={{ fontSize: 12, color: "#B23A1E", fontWeight: 700 }}>{i + 1}</span>
                <span style={{ fontSize: "clamp(11px, 3.2vw, 12.5px)", color: "#241A12", fontWeight: 700 }}>
                  {s.label}
                </span>
                <span style={{ flex: 1, minWidth: 12, borderBottom: "1.5px dotted #C9BB9E", transform: "translateY(-3px)" }} />
                <span style={{ fontSize: "clamp(9px, 2.6vw, 10.5px)", color: "#8A7F6C", whiteSpace: "nowrap" }}>{s.note}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1.5px dashed #C9BB9E", marginBottom: 20 }} />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              color: "#5C5140",
              marginBottom: 22,
              letterSpacing: 0.5,
            }}
          >
            <span>THANK YOU</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Star size={10} fill="#B23A1E" color="#B23A1E" />
              <Star size={10} fill="#B23A1E" color="#B23A1E" />
              <Star size={10} fill="#B23A1E" color="#B23A1E" />
              <Star size={10} fill="#B23A1E" color="#B23A1E" />
              <Star size={10} color="#C9BB9E" />
            </span>
          </div>

          {/* stamp CTA with enhanced animation */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
            <button
              onClick={handleGetStarted}
              className="stamp-btn"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: 1.5,
                color: "#B23A1E",
                background: "transparent",
                border: "3px solid #B23A1E",
                borderRadius: "50% / 45%",
                padding: "16px 30px",
                minHeight: 48,
                cursor: "pointer",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transform: stamping ? "rotate(-12deg) scale(0.85)" : "rotate(-4deg) scale(1)",
                transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                boxShadow: stamping
                  ? "0 0 0 1px #B23A1E inset, 0 8px 20px rgba(178,58,30,0.3)"
                  : "0 0 0 1px #B23A1E inset",
                touchAction: "manipulation",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                if (!stamping) {
                  e.currentTarget.style.transform = "rotate(-2deg) scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 0 0 1px #B23A1E inset, 0 6px 16px rgba(178,58,30,0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (!stamping) {
                  e.currentTarget.style.transform = "rotate(-4deg) scale(1)";
                  e.currentTarget.style.boxShadow = "0 0 0 1px #B23A1E inset";
                }
              }}
            >
              {/* Stamp ink splash effect */}
              {stamping && (
                <div
                  style={{
                    position: "absolute",
                    inset: -10,
                    background: "radial-gradient(circle, rgba(178,58,30,0.15) 0%, transparent 70%)",
                    borderRadius: "50%",
                    animation: "inkSplash 0.4s ease-out",
                  }}
                />
              )}
              <span style={{ position: "relative", zIndex: 1 }}>Start Order</span>
              <ArrowRight size={16} style={{ position: "relative", zIndex: 1 }} />
            </button>
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: 10,
              fontStyle: "italic",
              color: "#8A7F6C",
              marginBottom: 4,
              animation: "fadeInUp 1s ease 2s both",
            }}
          >
            thank you · brew again soon
          </div>
        </div>

        <div
          style={{
            height: 12,
            backgroundImage:
              "linear-gradient(45deg, #FCFAF5 50%, transparent 50%), linear-gradient(-45deg, #FCFAF5 50%, transparent 50%)",
            backgroundSize: "16px 16px",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "top",
          }}
        />
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes floatBean {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes steamRise {
          0% { opacity: 0; transform: translateY(10px) scale(0.8); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-40px) scale(1.2); }
        }
        @keyframes miniSteam {
          0% { opacity: 0; transform: translateX(-50%) translateY(2px) scale(0.8); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateX(-50%) translateY(-6px) scale(1.2); }
        }
        @keyframes scanLine {
          0% { left: 0; }
          100% { left: 100%; }
        }
        @keyframes inkSplash {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes formPop {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .stamp-btn:active {
          transform: rotate(-4deg) scale(0.95) !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .ticket * { transition: none !important; animation: none !important; }
        }
      `}</style>
    </div>
  );
}