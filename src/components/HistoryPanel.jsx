import React from "react";
import { X, Clock, Trash } from "lucide-react";
import { PAYMENTS } from "../data/payments";
import { peso } from "../utils/format";

export default function HistoryPanel({ orderHistory, onClose, onDeleteOrder, onClearHistory }) {
  return (
    <div
      style={{
        background: "#FCFAF5",
        borderBottom: "2px solid #C9BB9E",
        padding: "20px 24px",
        maxHeight: 400,
        overflowY: "auto",
      }}
      className="cos-scroll"
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#241A12" }}>
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
                border: "1px solid #B23A1E",
                color: "#B23A1E",
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
              color: "#8A7F6C",
              padding: 4,
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {orderHistory.length === 0 ? (
        <div style={{ color: "#8A7F6C", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
          No orders yet. Place your first order to see it here!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orderHistory.map((order) => (
            <div key={order.timestamp} style={{ position: "relative" }}>
              <div
                style={{
                  height: 6,
                  backgroundImage:
                    "linear-gradient(135deg, #F2E9D8 50%, transparent 50%), linear-gradient(-135deg, #F2E9D8 50%, transparent 50%)",
                  backgroundSize: "10px 10px",
                  backgroundRepeat: "repeat-x",
                  backgroundPosition: "bottom",
                  backgroundColor: "#FCFAF5",
                }}
              />
              <div
                style={{
                  background: "#F2E9D8",
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
                  color: "#B23A1E",
                  padding: 2,
                }}
                aria-label="Delete order"
              >
                <X size={14} />
              </button>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, paddingRight: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#8A7F6C" }}>
                  <Clock size={12} />
                  <span>{order.date} · {order.time}</span>
                </div>
                <span style={{ fontWeight: 700, color: "#241A12" }}>Order #{order.orderNo}</span>
              </div>
              {order.items.map((c) => (
                <div key={c.key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, color: "#5C5140" }}>
                  <span>{c.qty}× {c.name} ({c.size})</span>
                  <span>{peso(c.price * c.qty)}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px dashed #C9BB9E", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#241A12" }}>
                <span>Total</span>
                <span>{peso(order.total)}</span>
              </div>
              <div style={{ marginTop: 6, color: "#8A7F6C", fontSize: 11 }}>
                Paid via {PAYMENTS.find((p) => p.id === order.payment)?.label}
              </div>
              </div>
              <div
                style={{
                  height: 6,
                  backgroundImage:
                    "linear-gradient(45deg, #F2E9D8 50%, transparent 50%), linear-gradient(-45deg, #F2E9D8 50%, transparent 50%)",
                  backgroundSize: "10px 10px",
                  backgroundRepeat: "repeat-x",
                  backgroundPosition: "top",
                  backgroundColor: "#FCFAF5",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}