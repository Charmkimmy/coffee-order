import React from "react";
import { Check, User, FileText } from "lucide-react";
import { PAYMENTS } from "../data/payments";
import { peso } from "../utils/format";

export default function OrderReceipt({ orderPlaced, onNewOrder }) {
  return (
    <div style={{ textAlign: "center", padding: "6px 0" }}>
      {/* stamped approval mark */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: "3px solid #4C7A3D",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 14px",
          transform: "rotate(-8deg)",
        }}
      >
        <Check size={26} color="#4C7A3D" strokeWidth={3} />
      </div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#241A12" }}>
        Order Placed
      </div>
      <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: "#8A7F6C", marginBottom: 16, letterSpacing: 0.5 }}>
        {orderPlaced.time} · NO. {orderPlaced.orderNo}
      </div>

      {/* Customer Name */}
      {orderPlaced.customerName && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 14, fontSize: 13, color: "#5C5140", fontFamily: "'Space Mono', monospace" }}>
          <User size={13} color="#B23A1E" />
          <span style={{ fontWeight: 700 }}>{orderPlaced.customerName}</span>
        </div>
      )}

      {/* the ticket */}
      <div style={{ position: "relative", boxShadow: "0 6px 16px rgba(36,26,18,0.12)" }}>
        <div
          style={{
            height: 8,
            backgroundImage:
              "linear-gradient(135deg, #FCFAF5 50%, transparent 50%), linear-gradient(-135deg, #FCFAF5 50%, transparent 50%)",
            backgroundSize: "12px 12px",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "bottom",
            backgroundColor: "#F2E9D8",
          }}
        />
        <div style={{ textAlign: "left", background: "#FCFAF5", padding: "16px 18px", fontFamily: "'Space Mono', monospace", fontSize: 12 }}>
          {orderPlaced.items.map((c) => (
            <div key={c.key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, color: "#241A12" }}>
              <span>{c.qty}× {c.name} ({c.size})</span>
              <span>{peso(c.price * c.qty)}</span>
            </div>
          ))}
          <div style={{ borderTop: "1.5px dashed #C9BB9E", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#241A12", textTransform: "uppercase" }}>
            <span>Total</span>
            <span>{peso(orderPlaced.total)}</span>
          </div>
          <div style={{ marginTop: 8, color: "#8A7F6C", fontSize: 11 }}>
            Paid via {PAYMENTS.find((p) => p.id === orderPlaced.payment)?.label}
          </div>
          {/* Order Notes */}
          {orderPlaced.notes && (
            <div style={{ marginTop: 14, padding: "10px 12px", background: "#F2E9D8", borderRadius: 6, borderLeft: "3px solid #B23A1E" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                <FileText size={11} color="#B23A1E" />
                <span style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", textTransform: "uppercase", letterSpacing: 1, color: "#8A7F6C" }}>Notes</span>
              </div>
              <div style={{ fontSize: 13, color: "#241A12", fontStyle: "italic" }}>{orderPlaced.notes}</div>
            </div>
          )}
          {/* barcode */}
          <div
            style={{
              height: 20,
              marginTop: 14,
              background:
                "repeating-linear-gradient(90deg, #241A12 0px, #241A12 2px, transparent 2px, transparent 4px, #241A12 4px, #241A12 5px, transparent 5px, transparent 9px)",
              opacity: 0.8,
            }}
          />
        </div>
        <div
          style={{
            height: 8,
            backgroundImage:
              "linear-gradient(45deg, #FCFAF5 50%, transparent 50%), linear-gradient(-45deg, #FCFAF5 50%, transparent 50%)",
            backgroundSize: "12px 12px",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "top",
            backgroundColor: "#F2E9D8",
          }}
        />
      </div>

      <button
        onClick={onNewOrder}
        className="cos-btn"
        style={{
          width: "100%",
          marginTop: 18,
          padding: "13px",
          borderRadius: 6,
          border: "2px solid #241A12",
          background: "transparent",
          color: "#241A12",
          fontSize: 12,
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        Start new order
      </button>
    </div>
  );
}