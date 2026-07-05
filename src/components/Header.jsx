import React from "react";
import { ShoppingBag, ArrowLeft, ShoppingCart } from "lucide-react";

// Inline SVG coffee bean logo matching Calma Cafe brand
const CalmaLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* Outer ring */}
    <circle cx="50" cy="50" r="45" stroke="#D8A15C" strokeWidth="3" fill="none" />
    {/* Inner ring */}
    <circle cx="50" cy="50" r="32" stroke="#D8A15C" strokeWidth="2.5" fill="none" />
    {/* Coffee bean shape */}
    <ellipse cx="50" cy="50" rx="18" ry="26" stroke="#D8A15C" strokeWidth="2.5" fill="none" transform="rotate(-15 50 50)" />
    {/* Bean center line */}
    <path
      d="M42 38 Q50 50 42 62"
      stroke="#D8A15C"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

export default function Header({ itemCount, onBack, isCustomer, onCartToggle, showCart }) {
  return (
    <div
      style={{
        background: "#3E2723",
        color: "#EFEBE9",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {isCustomer && (
          <button
            onClick={onBack}
            className="cos-btn"
            style={{
              background: "none",
              border: "none",
              color: "#A1887F",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: 4,
            }}
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CalmaLogo size={28} />
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>
              Calma Cafe
            </div>
            <div style={{ fontSize: 9, color: "#A1887F", letterSpacing: 2, textTransform: "uppercase" }}>
              Brewed with Calm
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Mobile cart toggle button */}
        <button
          onClick={onCartToggle}
          className="cos-btn mobile-cart-btn"
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "#A1887F",
            cursor: "pointer",
            position: "relative",
            padding: 4,
          }}
        >
          <ShoppingCart size={20} />
          {itemCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                background: "#8D6E63",
                color: "#FFF",
                borderRadius: "50%",
                width: 18,
                height: 18,
                fontSize: 10,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {itemCount}
            </span>
          )}
        </button>

        <div
          className="desktop-item-count"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "#A1887F",
            fontFamily: "'Space Mono', monospace",
          }}
        >
          <ShoppingBag size={15} />
          {itemCount} item{itemCount !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}