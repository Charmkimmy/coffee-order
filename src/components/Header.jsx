import React from "react";
import { ShoppingBag, ArrowLeft, ShoppingCart } from "lucide-react";

const BeanitoLogo = ({ size = 80 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "12px",
      border: "1px solid rgba(198,162,101,0.35)",
      padding: 2,
      flexShrink: 0,
      overflow: "hidden",
      background: "#0B0805",
      boxShadow: "0 0 12px rgba(198,162,101,0.18)",
    }}
  >
    <img
      src="/beanito.png"
      alt="Beanito Coffee Shop"
      width="100%"
      height="100%"
      style={{
        objectFit: "contain",
        borderRadius: "10px",
        display: "block",
      }}
    />
  </div>
);

export default function Header({ itemCount, onBack, isCustomer, onCartToggle, showCart }) {
  return (
    <div className="beanito-header-wrap" style={{ position: "sticky", top: 0, zIndex: 50 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kaushan+Script&family=Montserrat:wght@400;500;600;700&display=swap');

        .beanito-header-bar {
          background: #0B0805;
          border-bottom: 1px solid rgba(198,162,101,0.16);
          padding: max(14px, env(safe-area-inset-top)) 20px 14px;
        }

        .beanito-icon-btn {
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
        .beanito-icon-btn:active { background: rgba(198,162,101,0.12); color: #C6A265; }
        @media (hover: hover) {
          .beanito-icon-btn:hover { color: #C6A265; }
        }

        .beanito-cart-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #0B0805;
          border: 1px solid #C6A265;
          color: #F2EAD9;
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

      <div className="beanito-header-bar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isCustomer && (
            <button onClick={onBack} className="beanito-icon-btn cos-btn">
              <ArrowLeft size={20} />
            </button>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <BeanitoLogo size={36} />
            <div>
              <div
                style={{
                  fontFamily: "'Kaushan Script', cursive",
                  fontSize: 22,
                  fontWeight: 400,
                  letterSpacing: 0.3,
                  color: "#F0CE97",
                  lineHeight: 1,
                  textShadow: "0 0 8px rgba(230,166,84,0.4)",
                }}
              >
                Beanito
              </div>
              <div
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 9,
                  color: "#8A7554",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                Coffee Shop
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Mobile cart toggle button */}
          <button onClick={onCartToggle} className="beanito-icon-btn cos-btn mobile-cart-btn" style={{ display: "none", position: "relative" }}>
            <ShoppingCart size={20} />
            {itemCount > 0 && <span className="beanito-cart-badge">{itemCount}</span>}
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