import React from "react";
import { ShoppingBag, ArrowLeft, ShoppingCart } from "lucide-react";

const CalmaLogo = ({ size = 80 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      border: "1px solid #C6A265",
      padding: 2,
      flexShrink: 0,
    }}
  >
    <img
      src="/logo192.png"
      alt="Calma Cafe"
      width="100%"
      height="100%"
      style={{
        objectFit: "cover",
        borderRadius: "50%",
        display: "block",
      }}
    />
  </div>
);

export default function Header({ itemCount, onBack, isCustomer, onCartToggle, showCart }) {
  return (
    <div className="calma-header-wrap" style={{ position: "sticky", top: 0, zIndex: 50 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Montserrat:wght@400;500;600;700&display=swap');

        .calma-header-bar {
          background: #0B0805;
          border-bottom: 1px solid rgba(198,162,101,0.18);
          padding: max(14px, env(safe-area-inset-top)) 20px 14px;
        }

        .calma-icon-btn {
          background: none;
          border: none;
          color: #8A7554;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          -webkit-tap-highlight-color: transparent;
        }
        .calma-icon-btn:active { background: rgba(198,162,101,0.12); color: #C6A265; }
        @media (hover: hover) {
          .calma-icon-btn:hover { color: #C6A265; }
        }

        .calma-cart-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #0B0805;
          border: 1px solid #C6A265;
          color: #E8D5A3;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <div className="calma-header-bar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isCustomer && (
            <button onClick={onBack} className="calma-icon-btn cos-btn">
              <ArrowLeft size={20} />
            </button>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <CalmaLogo size={32} />
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: "#F2EAD9",
                  lineHeight: 1.1,
                }}
              >
                Calma Cafe
              </div>
              <div
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 9,
                  color: "#8A7554",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                Brewed with calm
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Mobile cart toggle button */}
          <button onClick={onCartToggle} className="calma-icon-btn cos-btn mobile-cart-btn" style={{ display: "none", position: "relative" }}>
            <ShoppingCart size={20} />
            {itemCount > 0 && <span className="calma-cart-badge">{itemCount}</span>}
          </button>

          <div
            className="desktop-item-count"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "#8A7554",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 500,
            }}
          >
            <ShoppingBag size={15} />
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </div>
  );
}