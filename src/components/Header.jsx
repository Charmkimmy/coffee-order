import React from "react";
import { ShoppingBag, ArrowLeft, ShoppingCart } from "lucide-react";

const CalmaLogo = ({ size = 60 }) => (
  <img 
    src="/logo192.png" 
    alt="Calma Cafe" 
    width={size} 
    height={size} 
    style={{ 
      objectFit: 'contain',
      borderRadius: '50%',
    }}

  />
);

export default function Header({ itemCount, onBack, isCustomer, onCartToggle, showCart }) {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
      <div
        style={{
          background: "#FCFAF5",
          color: "#241A12",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
                color: "#8A7F6C",
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
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 15, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#241A12" }}>
                Calma Cafe
              </div>
              <div style={{ fontSize: 9, color: "#8A7F6C", letterSpacing: 2, textTransform: "uppercase" }}>
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
              color: "#8A7F6C",
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
                  background: "#B23A1E",
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
              color: "#8A7F6C",
              fontFamily: "'Space Mono', monospace",
            }}
          >
            <ShoppingBag size={15} />
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* torn perforation edge */}
      <div
        style={{
          height: 10,
          backgroundImage:
            "linear-gradient(45deg, #FCFAF5 50%, transparent 50%), linear-gradient(-45deg, #FCFAF5 50%, transparent 50%)",
          backgroundSize: "16px 16px",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "top",
          backgroundColor: "#F2E9D8",
        }}
      />
    </div>
  );
}