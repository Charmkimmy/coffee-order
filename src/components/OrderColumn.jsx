import React, { useState } from "react";
import { Minus, Plus, Trash2, Check, X} from "lucide-react";
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
  onChangeQty,
  onRemoveItem,
  onPlaceOrder,
  onNewOrder,
  isMobile,
  onCloseCart,
}) {
  const [showGCashModal, setShowGCashModal] = useState(false);

  const handlePlaceOrder = () => {
    if (cart.length === 0 || !payment) return;
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
            {/* Mobile close button */}
            {isMobile && onCloseCart && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700 }}>
                  Your Order
                </div>
                <button
                  onClick={onCloseCart}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#9A8770", padding: 4 }}
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Desktop header */}
            {!isMobile && (
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  letterSpacing: 2,
                  color: "#9A8770",
                  textTransform: "uppercase",
                  marginBottom: 12,
                  borderBottom: "1px dashed #D8C9AF",
                  paddingBottom: 10,
                }}
              >
                Your Order
              </div>
            )}

            {cart.length === 0 ? (
              <div style={{ color: "#B0A088", fontSize: 13, padding: "20px 0", textAlign: "center" }}>
                Nothing added yet. Tap + on a drink to start your order.
              </div>
            ) : (
              <div className="cos-scroll" style={{ maxHeight: isMobile ? "50vh" : 320, overflowY: "auto", marginBottom: 14 }}>
                {cart.map((c) => (
                  <div
                    key={c.key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom: "1px dashed #EEE3CF",
                      fontSize: 14,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>{c.name}</div>
                      <div style={{ color: "#9A8770", fontSize: 12 }}>{c.size} · {peso(c.price)} each</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => onChangeQty(c.key, -1)}
                        className="cos-btn"
                        style={{ border: "1px solid #E0D3BA", background: "#FFF", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ width: 24, textAlign: "center", fontFamily: "'Space Mono', monospace", fontSize: 15 }}>{c.qty}</span>
                      <button
                        onClick={() => onChangeQty(c.key, 1)}
                        className="cos-btn"
                        style={{ border: "1px solid #E0D3BA", background: "#FFF", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => onRemoveItem(c.key)}
                        className="cos-btn"
                        style={{ border: "none", background: "none", cursor: "pointer", color: "#C08A5A", marginLeft: 4, padding: 4 }}
                        aria-label={`Remove ${c.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "'Fraunces', serif",
                fontSize: 22,
                fontWeight: 700,
                padding: "14px 0",
                borderTop: "2px solid #2B1B12",
                marginTop: 4,
              }}
            >
              <span>Total</span>
              <span>{peso(total)}</span>
            </div>

            {/* Payment method */}
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2, color: "#7A6650", marginBottom: 10 }}>
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
                        borderRadius: 10,
                        border: active ? "1.5px solid #B8763E" : "1px solid #E7DCC7",
                        background: active ? "#FBF0E1" : "#FFF",
                        cursor: "pointer",
                      }}
                    >
                      <Icon size={20} color={active ? "#B8763E" : "#7A6650"} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{p.label}</div>
                        <div style={{ fontSize: 12, color: "#9A8770" }}>{p.sub}</div>
                      </div>
                      {active && <Check size={18} color="#B8763E" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={cart.length === 0 || !payment}
              className="cos-btn"
              style={{
                width: "100%",
                marginTop: 20,
                padding: "16px",
                borderRadius: 12,
                border: "none",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: 0.5,
                color: cart.length === 0 || !payment ? "#B0A088" : "#FFF",
                background: cart.length === 0 || !payment ? "#EFE6D6" : "#2B1B12",
                cursor: cart.length === 0 || !payment ? "not-allowed" : "pointer",
              }}
            >
              {cart.length === 0
                ? "Add items to order"
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
        <GCashModal
          total={total}
          onClose={() => setShowGCashModal(false)}
          onConfirmPayment={handleGCashConfirm}
        />
      )}
    </>
  );
}