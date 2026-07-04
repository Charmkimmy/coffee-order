import React from "react";
import { Coffee, Receipt, ArrowLeft, ShoppingCart } from "lucide-react";

export default function Header({ itemCount, onBack, isCustomer, onCartToggle, showCart }) {
  return (
    <div
      style={{
        background: "#2B1B12",
        color: "#F7F2E9",
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
              color: "#D8A15C",
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
          <Coffee size={22} color="#D8A15C" />
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, letterSpacing: 0.3 }}>
              OUR MENU
            </div>
            <div style={{ fontSize: 10, color: "#C6B49A", letterSpacing: 1.5, textTransform: "uppercase" }}>
              Iced Coffee
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
            color: "#D8A15C",
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
                background: "#B8763E",
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
            color: "#D8A15C",
            fontFamily: "'Space Mono', monospace",
          }}
        >
          <Receipt size={15} />
          {itemCount} item{itemCount !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}