import React from "react";
import { X, Clock, Trash } from "lucide-react";
import { PAYMENTS } from "../data/payments";
import { peso } from "../utils/format";

export default function HistoryPanel({ orderHistory, onClose, onDeleteOrder, onClearHistory }) {
  return (
    <div
      style={{
        background: "#FFFDF9",
        borderBottom: "2px solid #E7DCC7",
        padding: "20px 24px",
        maxHeight: 400,
        overflowY: "auto",
      }}
      className="cos-scroll"
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700 }}>
          Order History
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {orderHistory.length > 0 && (
            <button
              onClick={onClearHistory}
              className="cos-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "transparent",
                border: "1px solid #C08A5A",
                color: "#C08A5A",
                padding: "4px 10px",
                borderRadius: 6,
                fontSize: 11,
                cursor: "pointer",
                fontFamily: "'Public Sans', sans-serif",
              }}
            >
              <Trash size={12} />
              Clear all
            </button>
          )}
          <button
            onClick={onClose}
            className="cos-btn"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9A8770",
              padding: 4,
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {orderHistory.length === 0 ? (
        <div style={{ color: "#B0A088", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
          No orders yet. Place your first order to see it here!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orderHistory.map((order) => (
            <div
              key={order.timestamp}
              style={{
                background: "#FBF7EE",
                border: "1px dashed #D8C9AF",
                borderRadius: 10,
                padding: "14px 16px",
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                position: "relative",
              }}
            >
              <button
                onClick={() => onDeleteOrder(order.timestamp)}
                className="cos-btn"
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#C08A5A",
                  padding: 2,
                }}
                aria-label="Delete order"
              >
                <X size={14} />
              </button>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, paddingRight: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#7A6650" }}>
                  <Clock size={12} />
                  <span>{order.date} · {order.time}</span>
                </div>
                <span style={{ fontWeight: 700, color: "#2B1B12" }}>Order #{order.orderNo}</span>
              </div>
              {order.items.map((c) => (
                <div key={c.key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, color: "#5C4A38" }}>
                  <span>{c.qty}× {c.name} ({c.size})</span>
                  <span>{peso(c.price * c.qty)}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px dashed #D8C9AF", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#2B1B12" }}>
                <span>Total</span>
                <span>{peso(order.total)}</span>
              </div>
              <div style={{ marginTop: 6, color: "#7A6650", fontSize: 11 }}>
                Paid via {PAYMENTS.find((p) => p.id === order.payment)?.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}