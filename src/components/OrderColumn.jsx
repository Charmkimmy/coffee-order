import React, { useState } from "react";
import { Minus, Plus, Trash2, Check, X, User, FileText, Clock, AlertCircle, Ban, Upload } from "lucide-react";import { PAYMENTS } from "../data/payments";
import { peso } from "../utils/format";
import OrderReceipt from "./OrderReceipt";
import PayMayaModal from "./PayMayaModal";

export default function OrderColumn({
  cart,
  total,
  payment,
  setPayment,
  orderPlaced,
  customerName,
  setCustomerName,
  orderNotes,
  setOrderNotes,
  onChangeQty,
  onRemoveItem,
  onPlaceOrder,
  onNewOrder,
  isMobile,
  onCloseCart,
}) {
  const [showPayMayaModal, setShowPayMayaModal] = useState(false);

  const handlePlaceOrder = () => {
    if (cart.length === 0 || !payment || !customerName.trim()) return;
    if (payment === "paymaya") {
      setShowPayMayaModal(true);
    } else {
      onPlaceOrder();
    }
  };

  const handlePayMayaConfirm = (paymentData = {}) => {
    setShowPayMayaModal(false);
    onPlaceOrder(paymentData);
  };

  // Determine what screen to show after order is placed
  const getOrderScreen = () => {
    if (!orderPlaced) return null;
    
    // Cash/other payments — instant confirmation
    if (orderPlaced.payment !== "paymaya") {
      return "receipt";
    }
    
    // Maya payments — check status
    if (orderPlaced.status === "confirmed") {
      return "receipt";
    }
    if (orderPlaced.status === "rejected") {
      return "rejected";
    }
    if (orderPlaced.status === "cancelled") {
      return "cancelled";
    }
    // pending_verification or no status yet
    return "pending";
  };

  const screen = getOrderScreen();

  return (
    <>
      <style>{`
        .calma-oc * { box-sizing: border-box; }

        .calma-oc-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 6px;
          background: rgba(198,162,101,0.06);
          font-size: 16px;
          font-family: 'Montserrat', sans-serif;
          color: #F2EAD9;
          outline: none;
        }
        .calma-oc-input::placeholder { color: #5C4E3C; }
        .calma-oc-input.filled { border: 1.5px solid #C6A265; }
        .calma-oc-input.empty { border: 1px solid rgba(198,162,101,0.25); }
        .calma-oc-input:focus { border-color: #E8D5A3; }

        .calma-qty-btn {
          border: 1px solid rgba(198,162,101,0.3);
          background: rgba(198,162,101,0.06);
          color: #F2EAD9;
          border-radius: 8px;
          width: 32px;
          height: 32px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          -webkit-tap-highlight-color: transparent;
        }
        .calma-qty-btn:active { background: rgba(198,162,101,0.16); }
        @media (hover: hover) {
          .calma-qty-btn:hover { border-color: #C6A265; }
        }

        .calma-remove-btn {
          border: none;
          background: none;
          cursor: pointer;
          color: #C2453A;
          margin-left: 4px;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .calma-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #8A7554;
          padding: 8px;
        }

        .calma-payment-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
          padding: 12px 14px;
          border-radius: 6px;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          min-height: 44px;
        }
        .calma-payment-btn.active {
          border: 1.5px solid #C6A265;
          background: rgba(198,162,101,0.1);
        }
        .calma-payment-btn.inactive {
          border: 1px solid rgba(198,162,101,0.25);
          background: rgba(198,162,101,0.03);
        }

        .calma-place-order {
          width: 100%;
          margin-top: 20px;
          padding: 16px;
          border-radius: 8px;
          border: none;
          font-size: 14px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          min-height: 52px;
          -webkit-tap-highlight-color: transparent;
        }
        .calma-place-order.disabled {
          color: #6b5c46;
          background: rgba(198,162,101,0.08);
          cursor: not-allowed;
        }
        .calma-place-order.enabled {
          color: #0B0805;
          background: #C6A265;
          cursor: pointer;
        }
        @media (hover: hover) {
          .calma-place-order.enabled:hover { background: #d6b578; }
        }
        .calma-place-order.danger {
          background: transparent;
          border: 1.5px solid rgba(194,69,58,0.5);
          color: #d4776c;
        }
      `}</style>

      <div className="calma-oc" style={{ width: "100%" }}>
        {!orderPlaced ? (
          <>
            {isMobile && onCloseCart && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#F2EAD9" }}>
                  Your order
                </div>
                <button onClick={onCloseCart} className="calma-close-btn">
                  <X size={20} />
                </button>
              </div>
            )}

            {!isMobile && (
              <div
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 11,
                  letterSpacing: 2,
                  color: "#C6A265",
                  textTransform: "uppercase",
                  marginBottom: 12,
                  borderBottom: "1px solid rgba(198,162,101,0.18)",
                  paddingBottom: 10,
                }}
              >
                Your order
              </div>
            )}

            {cart.length === 0 ? (
              <div style={{ color: "#8A7554", fontSize: 13, padding: "20px 0", textAlign: "center" }}>
                Nothing added yet. Tap + on a drink to start your order.
              </div>
            ) : (
              <div className="cos-scroll" style={{ maxHeight: isMobile ? "35vh" : 240, overflowY: "auto", marginBottom: 14 }}>
                {cart.map((c) => (
                  <div key={c.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(198,162,101,0.12)", fontSize: 14 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, color: "#F2EAD9", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                      <div style={{ color: "#8A7554", fontSize: 11, fontFamily: "'Montserrat', sans-serif" }}>{c.size} · {peso(c.price)} each</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <button onClick={() => onChangeQty(c.key, -1)} className="calma-qty-btn cos-btn">
                        <Minus size={14} />
                      </button>
                      <span style={{ width: 24, textAlign: "center", fontFamily: "'Montserrat', sans-serif", fontSize: 15, color: "#F2EAD9" }}>{c.qty}</span>
                      <button onClick={() => onChangeQty(c.key, 1)} className="calma-qty-btn cos-btn">
                        <Plus size={14} />
                      </button>
                      <button onClick={() => onRemoveItem(c.key)} className="calma-remove-btn cos-btn" aria-label={`Remove ${c.name}`}>
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
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 18,
                fontWeight: 700,
                padding: "14px 0",
                borderTop: "2px solid #C6A265",
                marginTop: 4,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                color: "#F2EAD9",
              }}
            >
              <span>Total</span>
              <span>{peso(total)}</span>
            </div>

            {/* Customer Name Input */}
            <div style={{ marginTop: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontFamily: "'Montserrat', sans-serif", textTransform: "uppercase", letterSpacing: 1.2, color: "#8A7554", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <User size={14} />
                Your name
              </div>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name..."
                className={`calma-oc-input ${customerName.trim() ? "filled" : "empty"}`}
              />
              {!customerName.trim() && cart.length > 0 && (
                <div style={{ fontSize: 11, color: "#C2453A", marginTop: 6 }}>
                  Please enter your name before placing order
                </div>
              )}
            </div>

            {/* Order Notes */}
            <div style={{ marginTop: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontFamily: "'Montserrat', sans-serif", textTransform: "uppercase", letterSpacing: 1.2, color: "#8A7554", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <FileText size={14} />
                Order notes
              </div>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Less sugar, extra ice, no lid..."
                className={`calma-oc-input ${orderNotes.trim() ? "filled" : "empty"}`}
                style={{ minHeight: 64, resize: "vertical" }}
              />
              {orderNotes.trim() && (
                <div style={{ fontSize: 11, color: "#8A7554", marginTop: 6 }}>
                  Staff will see this when preparing your order
                </div>
              )}
            </div>

            {/* Payment method */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, fontFamily: "'Montserrat', sans-serif", textTransform: "uppercase", letterSpacing: 1.2, color: "#8A7554", marginBottom: 10 }}>
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
                      className={`calma-payment-btn cos-btn ${active ? "active" : "inactive"}`}
                    >
                      <Icon size={20} color={active ? "#C6A265" : "#8A7554"} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#F2EAD9" }}>{p.label}</div>
                        <div style={{ fontSize: 12, color: "#8A7554" }}>{p.sub}</div>
                      </div>
                      {active && <Check size={18} color="#C6A265" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={cart.length === 0 || !payment || !customerName.trim()}
              className={`calma-place-order cos-btn ${cart.length === 0 || !payment || !customerName.trim() ? "disabled" : "enabled"}`}
            >
              {cart.length === 0
                ? "Add items to order"
                : !customerName.trim()
                ? "Enter your name"
                : !payment
                ? "Choose a payment method"
                : payment === "paymaya"
                ? `Pay with Maya · ${peso(total)}`
                : `Place order · ${peso(total)}`}
            </button>
          </>
        ) : screen === "receipt" ? (
          <OrderReceipt orderPlaced={orderPlaced} onNewOrder={onNewOrder} />
        ) : screen === "pending" ? (
          /* WAITING FOR VERIFICATION SCREEN */
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "rgba(198,162,101,0.1)",
              border: "2px solid rgba(198,162,101,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <Clock size={28} color="#C6A265" />
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#F2EAD9" }}>
              Payment submitted
            </div>
            <div style={{ fontSize: 13, color: "#8A7554", marginTop: 8, fontFamily: "'Montserrat', sans-serif" }}>
              Ref: <strong style={{ color: "#F2EAD9" }}>{orderPlaced.referenceNo || "—"}</strong>
            </div>
            <div style={{ fontSize: 13, color: "#C6A265", marginTop: 12, fontFamily: "'Montserrat', sans-serif", lineHeight: 1.6 }}>
              Your payment is being reviewed by our team.<br />
              You'll receive your receipt once verified.
            </div>
            <div style={{ marginTop: 24, padding: "14px 18px", background: "rgba(198,162,101,0.06)", borderRadius: 10, border: "1px solid rgba(198,162,101,0.2)" }}>
              <div style={{ fontSize: 11, color: "#8A7554", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
                Order #{orderPlaced.orderNo}
              </div>
              <div style={{ fontSize: 14, color: "#F2EAD9", fontWeight: 600 }}>
                {peso(orderPlaced.total)}
              </div>
              <div style={{ fontSize: 12, color: "#8A7554", marginTop: 4 }}>
                {orderPlaced.items.reduce((sum, i) => sum + i.qty, 0)} items
              </div>
            </div>
            <button onClick={onNewOrder} className="calma-receipt-newbtn cos-btn" style={{ marginTop: 20 }}>
              Start new order
            </button>
          </div>
        ) : screen === "rejected" ? (
          /* PAYMENT REJECTED SCREEN — with specific reason */
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "rgba(194,69,58,0.1)",
              border: "2px solid rgba(194,69,58,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <AlertCircle size={28} color="#C2453A" />
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#F2EAD9" }}>
              Payment rejected
            </div>
            
            {/* Show specific reject reason */}
            {orderPlaced.rejectReasonLabel && (
              <div style={{ 
                marginTop: 12, 
                padding: "10px 16px", 
                background: "rgba(194,69,58,0.08)", 
                borderRadius: 8,
                border: "1px solid rgba(194,69,58,0.25)",
                maxWidth: 280,
                margin: "12px auto 0",
              }}>
                <div style={{ fontSize: 11, color: "#8A7554", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>
                  Reason
                </div>
                <div style={{ fontSize: 14, color: "#E8A0A0", fontWeight: 600 }}>
                  {orderPlaced.rejectReasonLabel}
                </div>
              </div>
            )}
            
            <div style={{ fontSize: 13, color: "#8A7554", marginTop: 16, fontFamily: "'Montserrat', sans-serif", lineHeight: 1.6 }}>
              Please check your payment details and try again.<br />
              Make sure to send the exact amount and upload a clear screenshot.
            </div>
            
            <button 
              onClick={() => setShowPayMayaModal(true)}
              className="calma-place-order enabled cos-btn"
              style={{ marginTop: 24 }}
            >
              <Upload size={16} />
              Re-submit payment proof
            </button>
            <button onClick={onNewOrder} className="calma-receipt-newbtn cos-btn" style={{ marginTop: 12 }}>
              Cancel & start new order
            </button>
          </div>
        ) : screen === "cancelled" ? (
          /* ORDER CANCELLED SCREEN */
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "rgba(100,100,100,0.1)",
              border: "2px solid rgba(100,100,100,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <Ban size={28} color="#8A7554" />
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#F2EAD9" }}>
              Order cancelled
            </div>
            <div style={{ fontSize: 13, color: "#8A7554", marginTop: 8, fontFamily: "'Montserrat', sans-serif", lineHeight: 1.6 }}>
              This order has been cancelled by the admin.<br />
              Please place a new order if you still want to purchase.
            </div>
            <button onClick={onNewOrder} className="calma-receipt-newbtn cos-btn" style={{ marginTop: 24 }}>
              Start new order
            </button>
          </div>
        ) : null}
      </div>

      {showPayMayaModal && (
        <PayMayaModal 
          total={total} 
          onClose={() => setShowPayMayaModal(false)} 
          onConfirmPayment={handlePayMayaConfirm}
          onCancelOrder={onNewOrder}
          orderStatus={orderPlaced?.status}
          existingReferenceNo={orderPlaced?.referenceNo}
        />
      )}
    </>
  );
}