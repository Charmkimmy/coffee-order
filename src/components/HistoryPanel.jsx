import React from "react";
import { X, Clock, Trash } from "lucide-react";
import { PAYMENTS } from "../data/payments";
import { peso } from "../utils/format";

export default function HistoryPanel({ orderHistory, onClose, onDeleteOrder, onClearHistory }) {
  return (
    <div
      className="cos-scroll calma-history"
      style={{
        background: "#100A06",
        borderBottom: "1px solid rgba(198,162,101,0.2)",
        padding: "20px 24px",
        maxHeight: 400,
        overflowY: "auto",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Montserrat:wght@400;500;600;700&display=swap');

        .calma-history-clear {
          display: flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: 1px solid rgba(194,69,58,0.5);
          color: #d4776c;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 11px;
          cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          min-height: 32px;
          -webkit-tap-highlight-color: transparent;
        }
        .calma-history-clear:active { background: rgba(194,69,58,0.12); }

        .calma-history-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #8A7554;
          padding: 6px;
          -webkit-tap-highlight-color: transparent;
        }
        .calma-history-close:active { color: #C6A265; }

        .calma-history-delete {
          position: absolute;
          top: 8px;
          right: 8px;
          background: none;
          border: none;
          cursor: pointer;
          color: #d4776c;
          padding: 6px;
          -webkit-tap-highlight-color: transparent;
        }

        .calma-history-ticket {
          transition: border-color 0.2s ease;
        }
        @media (hover: hover) {
          .calma-history-ticket:hover { border-color: rgba(198,162,101,0.3); }
        }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#F2EAD9" }}>
          Order history
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {orderHistory.length > 0 && (
            <button onClick={onClearHistory} className="cos-btn calma-history-clear">
              <Trash size={12} />
              Clear all
            </button>
          )}
          <button onClick={onClose} className="cos-btn calma-history-close">
            <X size={18} />
          </button>
        </div>
      </div>

      {orderHistory.length === 0 ? (
        <div style={{ color: "#8A7554", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
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
                    "linear-gradient(135deg, #100A06 50%, transparent 50%), linear-gradient(-135deg, #100A06 50%, transparent 50%)",
                  backgroundSize: "10px 10px",
                  backgroundRepeat: "repeat-x",
                  backgroundPosition: "bottom",
                  backgroundColor: "#150F09",
                }}
              />
              <div
                className="calma-history-ticket"
                style={{
                  background: "#150F09",
                  border: "1px solid rgba(198,162,101,0.14)",
                  borderTop: "none",
                  borderBottom: "none",
                  padding: "14px 16px",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 12,
                  position: "relative",
                }}
              >
                <button onClick={() => onDeleteOrder(order.timestamp)} className="cos-btn calma-history-delete" aria-label="Delete order">
                  <X size={14} />
                </button>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, paddingRight: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#8A7554" }}>
                    <Clock size={12} />
                    <span>{order.date} · {order.time}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: "#F2EAD9" }}>Order #{order.orderNo}</span>
                </div>
                {order.items.map((c) => (
                  <div key={c.key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, color: "#C9BB9E" }}>
                    <span>{c.qty}× {c.name} ({c.size})</span>
                    <span>{peso(c.price * c.qty)}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px dashed rgba(198,162,101,0.25)", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#F2EAD9" }}>
                  <span>Total</span>
                  <span>{peso(order.total)}</span>
                </div>
                <div style={{ marginTop: 6, color: "#8A7554", fontSize: 11 }}>
                  Paid via {PAYMENTS.find((p) => p.id === order.payment)?.label}
                </div>
              </div>
              <div
                style={{
                  height: 6,
                  backgroundImage:
                    "linear-gradient(45deg, #100A06 50%, transparent 50%), linear-gradient(-45deg, #100A06 50%, transparent 50%)",
                  backgroundSize: "10px 10px",
                  backgroundRepeat: "repeat-x",
                  backgroundPosition: "top",
                  backgroundColor: "#150F09",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}