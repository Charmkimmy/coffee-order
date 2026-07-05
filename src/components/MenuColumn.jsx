import React from "react";
import { Plus } from "lucide-react";
import { MENU } from "../data/menu";
import { peso } from "../utils/format";

export default function MenuColumn({ size, setSize, onAddToCart }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
              background: "#FCFAF5",
              border: "1px solid #E7DCC7",
              borderRadius: 8,
              padding: "14px 16px",
              gap: 12,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#241A12",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.name}
                </span>
                <span style={{ flex: 1, minWidth: 8, borderBottom: "1.5px dotted #C9BB9E", transform: "translateY(-3px)" }} />
              </div>
              <div style={{ fontSize: 11, color: "#8A7F6C", fontFamily: "'Space Mono', monospace", marginTop: 4 }}>
                {peso(item.price16)} / 16oz · {peso(item.price22)} / 22oz
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, fontWeight: 700, color: "#241A12" }}>
                {peso(price)}
              </span>
              <button
                onClick={() => onAddToCart(item, size)}
                className="cos-btn"
                style={{
                  border: "2px solid #B23A1E",
                  background: "transparent",
                  color: "#B23A1E",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
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