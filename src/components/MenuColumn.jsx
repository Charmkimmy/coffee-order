import React from "react";
import { Plus } from "lucide-react";
import { MENU } from "../data/menu";
import { peso } from "../utils/format";

export default function MenuColumn({ size, setSize, onAddToCart }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {MENU.map((item) => {
        const price = size === "16oz" ? item.price16 : item.price22;
        return (
          <div
            key={item.id}
            className="cos-card"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#FFFDF9",
              border: "1px solid #E7DCC7",
              borderRadius: 12,
              padding: "16px",
              gap: 12,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                {item.name}
              </div>
              <div style={{ fontSize: 12, color: "#9A8770" }}>
                {peso(item.price16)} / 16oz · {peso(item.price22)} / 22oz
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, fontWeight: 700, color: "#2B1B12" }}>
                {peso(price)}
              </span>
              <button
                onClick={() => onAddToCart(item, size)}
                className="cos-btn"
                style={{
                  border: "none",
                  background: "#B8763E",
                  color: "#FFF",
                  borderRadius: 10,
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                aria-label={`Add ${item.name}`}
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}