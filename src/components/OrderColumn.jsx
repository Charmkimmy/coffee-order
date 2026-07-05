import React, { useState } from "react";
import { Minus, Plus, Trash2, Check, X, User } from "lucide-react";
import { PAYMENTS } from "../data/payments";
import { peso } from "../utils/format";
import OrderReceipt from "./OrderReceipt";
import GCashModal from "./GCashModal";

export default function OrderColumn({
  cart,
  total,
  payment,
  setPayment,
  orderPlaced,
  customerName,
  setCustomerName,
  onChangeQty,
  onRemoveItem,
  onPlaceOrder,
  onNewOrder,
  isMobile,
  onCloseCart,
}) {
  const [showGCashModal, setShowGCashModal] = useState(false);

  const handlePlaceOrder = () => {
    if (cart.length === 0 || !payment || !customerName.trim()) return;
    if (payment === "gcash") {
      setShowGCashModal(true);
    } else {
      onPlaceOrder();
    }
  };

  const handleGCashConfirm = () => {
    setShowGCashModal(false);
    onPlaceOrder();
  };

  return (
    <>
      <div style={{ width: "100%" }}>
        {!orderPlaced ? (
          <>
            {isMobile && onCloseCart && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 15, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#241A12" }}>Your Order</div>
                <button onClick={onCloseCart} style={{ background: "none", border: "none", cursor: "pointer", color: "#8A7F6C", padding: 4 }}>
                  <X size={20} />
                </button>
              </div>
            )}

            {!isMobile && (
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 2, color: "#8A7F6C", textTransform: "uppercase", marginBottom: 12, borderBottom: "1px dashed #C9BB9E", paddingBottom: 10 }}>
                Your Order
              </div>
            )}

            {cart.length === 0 ? (
              <div style={{ color: "#8A7F6C", fontSize: 13, padding: "20px 0", textAlign: "center" }}>
                Nothing added yet. Tap + on a drink to start your order.
              </div>
            ) : (
              <div className="cos-scroll" style={{ maxHeight: isMobile ? "35vh" : 240, overflowY: "auto", marginBottom: 14 }}>
                {cart.map((c) => (
                  <div key={c.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px dashed #DCCFB0", fontSize: 14 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: "#241A12", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                      <div style={{ color: "#8A7F6C", fontSize: 11, fontFamily: "'Space Mono', monospace" }}>{c.size} · {peso(c.price)} each</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <button onClick={() => onChangeQty(c.key, -1)} className="cos-btn" style={{ border: "1px solid #C9BB9E", background: "#FCFAF5", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Minus size={14} />
                      </button>
                      <span style={{ width: 24, textAlign: "center", fontFamily: "'Space Mono', monospace", fontSize: 15 }}>{c.qty}</span>
                      <button onClick={() => onChangeQty(c.key, 1)} className="cos-btn" style={{ border: "1px solid #C9BB9E", background: "#FCFAF5", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Plus size={14} />
                      </button>
                      <button onClick={() => onRemoveItem(c.key)} className="cos-btn" style={{ border: "none", background: "none", cursor: "pointer", color: "#B23A1E", marginLeft: 4, padding: 4 }} aria-label={`Remove ${c.name}`}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Space Mono', monospace", fontSize: 18, fontWeight: 700, padding: "14px 0", borderTop: "2px solid #241A12", marginTop: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
              <span>Total</span>
              <span>{peso(total)}</span>
            </div>

            {/* Customer Name Input */}
            <div style={{ marginTop: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", textTransform: "uppercase", letterSpacing: 1.2, color: "#8A7F6C", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <User size={14} />
                Your Name
              </div>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name..."
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 6,
                  border: customerName.trim() ? "1.5px solid #B23A1E" : "1px solid #C9BB9E",
                  background: "#FCFAF5",
                  fontSize: 14,
                  fontFamily: "'Public Sans', sans-serif",
                  color: "#241A12",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              {!customerName.trim() && cart.length > 0 && (
                <div style={{ fontSize: 11, color: "#B23A1E", marginTop: 6 }}>
                  Please enter your name before placing order
                </div>
              )}
            </div>

            {/* Payment method */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", textTransform: "uppercase", letterSpacing: 1.2, color: "#8A7F6C", marginBottom: 10 }}>
                Payment method
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {PAYMENTS.map((p) => {
                  const Icon = p.icon;
                  const active = payment === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPayment(p.id)}
                      className="cos-btn"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        textAlign: "left",
                        padding: "12px 14px",
                        borderRadius: 6,
                        border: active ? "1.5px solid #B23A1E" : "1px solid #C9BB9E",
                        background: active ? "#F2E9D8" : "#FCFAF5",
                        cursor: "pointer",
                      }}
                    >
                      <Icon size={20} color={active ? "#B23A1E" : "#8A7F6C"} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{p.label}</div>
                        <div style={{ fontSize: 12, color: "#8A7F6C" }}>{p.sub}</div>
                      </div>
                      {active && <Check size={18} color="#B23A1E" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={cart.length === 0 || !payment || !customerName.trim()}
              className="cos-btn"
              style={{
                width: "100%",
                marginTop: 20,
                padding: "16px",
                borderRadius: 8,
                border: "none",
                fontSize: 14,
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: cart.length === 0 || !payment || !customerName.trim() ? "#8A7F6C" : "#FCFAF5",
                background: cart.length === 0 || !payment || !customerName.trim() ? "#EFE6D3" : "#241A12",
                cursor: cart.length === 0 || !payment || !customerName.trim() ? "not-allowed" : "pointer",
              }}
            >
              {cart.length === 0
                ? "Add items to order"
                : !customerName.trim()
                ? "Enter your name"
                : !payment
                ? "Choose a payment method"
                : payment === "gcash"
                ? `Pay with GCash · ${peso(total)}`
                : `Place order · ${peso(total)}`}
            </button>
          </>
        ) : (
          <OrderReceipt orderPlaced={orderPlaced} onNewOrder={onNewOrder} />
        )}
      </div>

      {showGCashModal && (
        <GCashModal total={total} onClose={() => setShowGCashModal(false)} onConfirmPayment={handleGCashConfirm} />
      )}
    </>
  );
}