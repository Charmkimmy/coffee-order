import React from "react";
import { Check } from "lucide-react";
import { PAYMENTS } from "../data/payments";
import { peso } from "../utils/format";

export default function OrderReceipt({ orderPlaced, onNewOrder }) {
  return (
    <div style={{ textAlign: "center", padding: "10px 0" }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "#EAF3E6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 14px",
        }}
      >
        <Check size={24} color="#4C7A3D" />
      </div>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700 }}>
        Order placed
      </div>
      <div style={{ fontSize: 12, color: "#9A8770", marginBottom: 16 }}>
        {orderPlaced.time} · Order #{orderPlaced.orderNo}
      </div>

      <div
        style={{
          textAlign: "left",
          background: "#FBF7EE",
          border: "1px dashed #D8C9AF",
          borderRadius: 10,
          padding: "14px 16px",
          fontFamily: "'Space Mono', monospace",
          fontSize: 12,
        }}
      >
        {orderPlaced.items.map((c) => (
          <div key={c.key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span>{c.qty}× {c.name} ({c.size})</span>
            <span>{peso(c.price * c.qty)}</span>
          </div>
        ))}
        <div style={{ borderTop: "1px dashed #D8C9AF", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
          <span>Total</span>
          <span>{peso(orderPlaced.total)}</span>
        </div>
        <div style={{ marginTop: 6, color: "#7A6650" }}>
          Paid via {PAYMENTS.find((p) => p.id === orderPlaced.payment)?.label}
        </div>
      </div>

      <button
        onClick={onNewOrder}
        className="cos-btn"
        style={{
          width: "100%",
          marginTop: 16,
          padding: "12px",
          borderRadius: 10,
          border: "1px solid #2B1B12",
          background: "#FFF",
          color: "#2B1B12",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Start new order
      </button>
    </div>
  );
}