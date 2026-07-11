import React from "react";
import { Check, User, FileText } from "lucide-react";
import { PAYMENTS } from "../data/payments";
import { peso } from "../utils/format";

export default function OrderReceipt({ orderPlaced, onNewOrder }) {
  // Safety: don't show receipt for unverified InstaPay payments
  if (orderPlaced.payment === "instapay" && orderPlaced.status !== "confirmed") {
    return null;
  }

  return (
    <div className="beanito-receipt" style={{ textAlign: "center", padding: "6px 0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');

        .beanito-receipt-newbtn {
          width: 100%;
          margin-top: 18px;
          padding: 13px;
          border-radius: 6px;
          border: 1.5px solid #D4A574;
          background: transparent;
          color: #D4A574;
          font-size: 12px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          min-height: 46px;
          -webkit-tap-highlight-color: transparent;
        }
        .beanito-receipt-newbtn:active { background: rgba(212,165,116,0.12); }
        @media (hover: hover) {
          .beanito-receipt-newbtn:hover { background: rgba(212,165,116,0.1); }
        }
      `}</style>

      {/* stamped approval mark */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: "3px solid #7FAE68",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 14px",
          transform: "rotate(-8deg)",
        }}
      >
        <Check size={26} color="#7FAE68" strokeWidth={3} />
      </div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#F5E6C8" }}>
        Order placed
      </div>
      <div style={{ fontSize: 11, fontFamily: "'Montserrat', sans-serif", color: "#8B7355", marginBottom: 16, letterSpacing: 0.5 }}>
        {orderPlaced.time} · NO. {orderPlaced.orderNo}
      </div>

      {/* Customer Name */}
      {orderPlaced.customerName && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 14, fontSize: 13, color: "#C9BB9E", fontFamily: "'Montserrat', sans-serif" }}>
          <User size={13} color="#D4A574" />
          <span style={{ fontWeight: 700, color: "#F5E6C8" }}>{orderPlaced.customerName}</span>
        </div>
      )}

      {/* the ticket */}
      <div style={{ position: "relative", boxShadow: "0 6px 20px rgba(0,0,0,0.4)" }}>
        <div
          style={{
            height: 8,
            backgroundImage:
              "linear-gradient(135deg, #0D0D0D 50%, transparent 50%), linear-gradient(-135deg, #0D0D0D 50%, transparent 50%)",
            backgroundSize: "12px 12px",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "bottom",
            backgroundColor: "#1A1A1A",
          }}
        />
        <div style={{ textAlign: "left", background: "#1A1A1A", border: "1px solid rgba(245,230,200,0.1)", borderTop: "none", borderBottom: "none", padding: "16px 18px", fontFamily: "'Montserrat', sans-serif", fontSize: 12 }}>
          {orderPlaced.items.map((c) => (
            <div key={c.key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, color: "#F5E6C8" }}>
              <span>{c.qty}× {c.name} ({c.size})</span>
              <span>{peso(c.price * c.qty)}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px dashed rgba(245,230,200,0.2)", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#D4A574", textTransform: "uppercase" }}>
            <span>Total</span>
            <span>{peso(orderPlaced.total)}</span>
          </div>
          <div style={{ marginTop: 8, color: "#8B7355", fontSize: 11 }}>
            Paid via {PAYMENTS.find((p) => p.id === orderPlaced.payment)?.label}
          </div>
          {/* Order Notes */}
          {orderPlaced.notes && (
            <div style={{ marginTop: 14, padding: "10px 12px", background: "rgba(212,165,116,0.06)", borderRadius: 6, borderLeft: "3px solid #D4A574" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                <FileText size={11} color="#D4A574" />
                <span style={{ fontSize: 10, fontFamily: "'Montserrat', sans-serif", textTransform: "uppercase", letterSpacing: 1, color: "#8B7355" }}>Notes</span>
              </div>
              <div style={{ fontSize: 13, color: "#F5E6C8", fontStyle: "italic" }}>{orderPlaced.notes}</div>
            </div>
          )}
          {/* barcode */}
          <div
            style={{
              height: 20,
              marginTop: 14,
              background:
                "repeating-linear-gradient(90deg, #D4A574 0px, #D4A574 2px, transparent 2px, transparent 4px, #D4A574 4px, #D4A574 5px, transparent 5px, transparent 9px)",
              opacity: 0.75,
            }}
          />
        </div>
        <div
          style={{
            height: 8,
            backgroundImage:
              "linear-gradient(45deg, #0D0D0D 50%, transparent 50%), linear-gradient(-45deg, #0D0D0D 50%, transparent 50%)",
            backgroundSize: "12px 12px",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "top",
            backgroundColor: "#1A1A1A",
          }}
        />
      </div>

      <button onClick={onNewOrder} className="beanito-receipt-newbtn cos-btn">
        Start new order
      </button>
    </div>
  );
}