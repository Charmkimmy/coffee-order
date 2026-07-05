import React, { useState } from "react";
import { Coffee, ArrowRight, Shield } from "lucide-react";

export default function IntroScreen({ onGetStarted, onAdminLogin }) {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState(false);
  const [stamping, setStamping] = useState(false);

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
    }, 260);
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
      {/* ambient iced-drink accents */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "6%",
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(110,156,151,0.25), transparent 70%)",
          filter: "blur(4px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "8%",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(178,58,30,0.10), transparent 70%)",
        }}
      />

      {/* staff tag - top right, styled like a clipped badge */}
      <div style={{ position: "absolute", top: 20, right: 20, zIndex: 30 }}>
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
              <div style={{ color: "#B23A1E", fontSize: 10, marginBottom: 8, fontFamily: "'Space Mono', monospace" }}>
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
                }}
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
        className="ticket"
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 380,
          transform: "rotate(-1.2deg)",
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
          }}
        >
          {/* barcode strip */}
          <div
            style={{
              height: 22,
              marginBottom: 16,
              background:
                "repeating-linear-gradient(90deg, #241A12 0px, #241A12 2px, transparent 2px, transparent 4px, #241A12 4px, #241A12 5px, transparent 5px, transparent 9px)",
              opacity: 0.85,
            }}
          />

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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              margin: "10px 0 6px",
            }}
          >
            <Coffee size={26} color="#241A12" />
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

          {/* receipt line items = the steps */}
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
          </div>

          {/* stamp CTA */}
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
                transform: stamping ? "rotate(-8deg) scale(0.94)" : "rotate(-4deg) scale(1)",
                transition: "transform 0.18s ease-out",
                boxShadow: "0 0 0 1px #B23A1E inset",
                touchAction: "manipulation",
              }}
            >
              Start Order
              <ArrowRight size={16} />
            </button>
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: 10,
              fontStyle: "italic",
              color: "#8A7F6C",
              marginBottom: 4,
            }}
          >
            thank you  brew again soon
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

      <style>{`
        .stamp-btn:active {
          transform: rotate(-4deg) scale(0.95) !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .ticket * { transition: none !important; }
        }
      `}</style>
    </div>
  );
}