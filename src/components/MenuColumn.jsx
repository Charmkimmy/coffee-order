import React from "react";
import { Plus } from "lucide-react";
import { MENU } from "../data/menu";
import { peso } from "../utils/format";

export default function MenuColumn({ size, setSize, onAddToCart }) {
  return (
    <div className="calma-menu" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <style>{`
        .calma-menu-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(198,162,101,0.04);
          border: 1px solid rgba(198,162,101,0.16);
          border-radius: 8px;
          padding: 14px 16px;
          gap: 12px;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        @media (hover: hover) {
          .calma-menu-card:hover {
            border-color: rgba(198,162,101,0.32);
            background: rgba(198,162,101,0.06);
          }
        }

        .calma-add-btn {
          border: 1.5px solid #C6A265;
          background: transparent;
          color: #C6A265;
          border-radius: 50%;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
          transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
        }
        .calma-add-btn:active { background: rgba(198,162,101,0.25); box-shadow: 0 0 14px rgba(198,162,101,0.4); }
        @media (hover: hover) {
          .calma-add-btn:hover { background: #C6A265; color: #0B0805; box-shadow: 0 0 16px rgba(198,162,101,0.45); }
        }
      `}</style>

      {MENU.map((item) => {
        const price = size === "16oz" ? item.price16 : item.price22;
        return (
          <div key={item.id} className="cos-card calma-menu-card">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#F2EAD9",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.name}
                </span>
                <span style={{ flex: 1, minWidth: 8, borderBottom: "1.5px dotted rgba(198,162,101,0.35)", transform: "translateY(-3px)" }} />
              </div>
              <div style={{ fontSize: 11, color: "#8A7554", fontFamily: "'Montserrat', sans-serif", marginTop: 4 }}>
                {peso(item.price16)} / 16oz · {peso(item.price22)} / 22oz
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, fontWeight: 700, color: "#C6A265" }}>
                {peso(price)}
              </span>
              <button
                onClick={() => onAddToCart(item, size)}
                className="calma-add-btn cos-btn"
                aria-label={`Add ${item.name}`}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}