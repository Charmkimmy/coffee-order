import React, { useState } from "react";
import { Coffee, ArrowRight, Shield} from "lucide-react";

export default function IntroScreen({ onGetStarted, onAdminLogin }) {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState(false);

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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F2E9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'Public Sans', sans-serif",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 400, width: "100%" }}>
        {/* Logo */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#2B1B12",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <Coffee size={36} color="#D8A15C" />
        </div>

        {/* Title */}
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 700, color: "#2B1B12", marginBottom: 8 }}>
          COLD BREW COFFEE
        </div>
        <div style={{ fontSize: 14, color: "#9A8770", marginBottom: 32, lineHeight: 1.6 }}>
          Your favorite iced coffee, just a tap away.
          <br />
          Order, pay, and enjoy.
        </div>

        {/* Get Started Button */}
        <button
          onClick={onGetStarted}
          className="cos-btn"
          style={{
            width: "100%",
            padding: "14px 24px",
            borderRadius: 12,
            border: "none",
            background: "#2B1B12",
            color: "#F7F2E9",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          Get Started
          <ArrowRight size={18} />
        </button>

        {/* Admin Login Toggle */}
        {!showAdminLogin ? (
          <button
            onClick={() => setShowAdminLogin(true)}
            style={{
              background: "none",
              border: "none",
              color: "#9A8770",
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              margin: "0 auto",
            }}
          >
            <Shield size={12} />
            Admin Access
          </button>
        ) : (
          <form onSubmit={handleAdminSubmit} style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, color: "#7A6650", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
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
                padding: "10px 14px",
                borderRadius: 8,
                border: error ? "1.5px solid #C44" : "1px solid #D8C9AF",
                background: "#FFFDF9",
                fontSize: 14,
                fontFamily: "'Space Mono', monospace",
                color: "#2B1B12",
                marginBottom: 8,
                outline: "none",
              }}
              autoFocus
            />
            {error && (
              <div style={{ color: "#C44", fontSize: 12, marginBottom: 8 }}>
                Incorrect code. Try again.
              </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 8,
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
              <button
                type="button"
                onClick={() => {
                  setShowAdminLogin(false);
                  setAdminCode("");
                  setError(false);
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 8,
                  border: "1px solid #D8C9AF",
                  background: "#FFF",
                  color: "#7A6650",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}