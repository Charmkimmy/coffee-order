import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useFirebaseOrders } from "../hooks/useFirebaseOrders";
import Header from "./Header";
import MenuColumn from "./MenuColumn";
import OrderColumn from "./OrderColumn";

export default function CoffeeOrderingSystem({ onBack }) {
  const [size, setSize] = useState("16oz");
  const [cart, setCart] = useState([]);
  const [payment, setPayment] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  const { addOrder } = useFirebaseOrders();

  const addToCart = (item, selectedSize) => {
    const price = selectedSize === "16oz" ? item.price16 : item.price22;
    setCart((prev) => {
      const key = `${item.id}-${selectedSize}`;
      const existing = prev.find((c) => c.key === key);
      if (existing) {
        return prev.map((c) => (c.key === key ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { key, id: item.id, name: item.name, size: selectedSize, price, qty: 1 }];
    });
  };

  const changeQty = (key, delta) => {
    setCart((prev) =>
      prev
        .map((c) => (c.key === key ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const removeItem = (key) => {
    setCart((prev) => prev.filter((c) => c.key !== key));
  };

  const total = useMemo(
    () => cart.reduce((sum, c) => sum + c.price * c.qty, 0),
    [cart]
  );

  const itemCount = useMemo(() => cart.reduce((s, c) => s + c.qty, 0), [cart]);

 const placeOrder = (paymentData = {}) => {
  if (cart.length === 0 || !payment || !customerName.trim()) return;

  const orderNo = Math.floor(100 + Math.random() * 900);
  const orderData = {
    orderNo,
    items: [...cart],
    total,
    payment,
    customerName: customerName.trim(),
    notes: orderNotes.trim(),
    referenceNo: paymentData.referenceNo || null,
    screenshotPreview: paymentData.screenshotPreview || null,
    status: payment === "paymaya" ? "pending_verification" : "confirmed",
    verified: false,
  };

  addOrder(orderData);
  setOrderPlaced({
    ...orderData,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  });
  setShowCart(false);
};

  const newOrder = () => {
    setCart([]);
    setPayment(null);
    setOrderPlaced(null);
    setCustomerName("");
    setOrderNotes("");
  };

  return (
    <div className="calma-cos">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Montserrat:wght@400;500;600;700&display=swap');

        .calma-cos {
          font-family: 'Montserrat', sans-serif;
          background: #0B0805;
          background-image: radial-gradient(rgba(198,162,101,0.10) 1px, transparent 1px);
          background-size: 22px 22px;
          min-height: 100dvh;
          color: #F2EAD9;
          overflow-x: hidden;
        }

        .calma-size-label {
          font-size: 11px;
          font-family: 'Montserrat', sans-serif;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #8A7554;
        }

        .calma-size-toggle {
          display: flex;
          background: rgba(198,162,101,0.08);
          border: 1px solid rgba(198,162,101,0.18);
          border-radius: 999px;
          padding: 4px;
          gap: 4px;
        }

        .calma-size-btn {
          border: none;
          padding: 7px 18px;
          border-radius: 999px;
          font-size: 12px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          cursor: pointer;
          min-height: 32px;
          -webkit-tap-highlight-color: transparent;
        }

        .calma-divider {
          border-top: 1px solid rgba(198,162,101,0.18);
          margin-bottom: 18px;
        }

        .calma-panel {
          background: #100A06;
          border-left: 1px solid rgba(198,162,101,0.18);
        }

        .calma-cart-panel {
          background: #0B0805;
          box-shadow: -4px 0 24px rgba(0,0,0,0.45);
        }

        .calma-cart-backdrop {
          background: rgba(0,0,0,0.6);
        }

        .calma-cart-fab {
          background: #C6A265;
          color: #0B0805;
          border: none;
          border-radius: 50%;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(198,162,101,0.35);
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.15s ease;
        }
        .calma-cart-fab:active { transform: scale(0.94); }
        @media (hover: hover) {
          .calma-cart-fab:hover { background: #d6b578; }
        }

        .calma-cart-fab-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #0B0805;
          border: 1.5px solid #C6A265;
          color: #F2EAD9;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .calma-panel-lip {
          height: 6px;
          background: linear-gradient(90deg, transparent, #C6A265 20%, #C6A265 80%, transparent);
          opacity: 0.35;
          flex-shrink: 0;
        }
      `}</style>

      <Header
        itemCount={itemCount}
        onBack={onBack}
        isCustomer={true}
        onCartToggle={() => setShowCart(!showCart)}
        showCart={showCart}
      />

      {/* Desktop: Side by side */}
      <div className="desktop-layout" style={{ display: "grid", gridTemplateColumns: "1fr 340px" }}>
        <div style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <span className="calma-size-label">Size</span>
            <div className="calma-size-toggle">
              {["16oz", "22oz"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className="calma-size-btn cos-btn"
                  style={{
                    background: size === s ? "#C6A265" : "transparent",
                    color: size === s ? "#0B0805" : "#8A7554",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="calma-divider" />
          <MenuColumn size={size} setSize={setSize} onAddToCart={addToCart} />
        </div>

        <div className="calma-panel" style={{ position: "sticky", top: 0, minHeight: "600px", padding: "24px 20px" }}>
          <OrderColumn
            cart={cart}
            total={total}
            payment={payment}
            setPayment={setPayment}
            orderPlaced={orderPlaced}
            customerName={customerName}
            setCustomerName={setCustomerName}
            orderNotes={orderNotes}
            setOrderNotes={setOrderNotes}
            onChangeQty={changeQty}
            onRemoveItem={removeItem}
            onPlaceOrder={placeOrder}
            onNewOrder={newOrder}
            isMobile={false}
          />
        </div>
      </div>

      {/* Mobile: Menu always visible, cart slides from right */}
      <div className="mobile-layout" style={{ position: "relative", padding: "16px", paddingBottom: "max(80px, calc(64px + env(safe-area-inset-bottom)))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <span className="calma-size-label">Size</span>
          <div className="calma-size-toggle">
            {["16oz", "22oz"].map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className="calma-size-btn cos-btn"
                style={{
                  background: size === s ? "#C6A265" : "transparent",
                  color: size === s ? "#0B0805" : "#8A7554",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="calma-divider" />
        <MenuColumn size={size} setSize={setSize} onAddToCart={addToCart} />
      </div>

      {/* Mobile Cart Side Panel */}
      {showCart && createPortal(
        <>
          <div
            className="mobile-cart-backdrop calma-cart-backdrop"
            onClick={() => setShowCart(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 150,
            }}
          />
          <div
            className="mobile-cart-panel calma-cart-panel"
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "85%",
              maxWidth: 380,
              zIndex: 200,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="calma-panel-lip" />
            <div
              style={{
                padding: "20px 20px max(20px, env(safe-area-inset-bottom))",
                flex: 1,
                overflowY: "auto",
              }}
            >
              <OrderColumn
                cart={cart}
                total={total}
                payment={payment}
                setPayment={setPayment}
                orderPlaced={orderPlaced}
                customerName={customerName}
                setCustomerName={setCustomerName}
                orderNotes={orderNotes}
                setOrderNotes={setOrderNotes}
                onChangeQty={changeQty}
                onRemoveItem={removeItem}
                onPlaceOrder={placeOrder}
                onNewOrder={newOrder}
                isMobile={true}
                onCloseCart={() => setShowCart(false)}
              />
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Mobile Floating Cart Button */}
      {itemCount > 0 && !showCart && (
        <button
          onClick={() => setShowCart(true)}
          className="mobile-cart-fab calma-cart-fab cos-btn"
          style={{
            position: "fixed",
            bottom: "max(20px, calc(12px + env(safe-area-inset-bottom)))",
            right: 20,
            zIndex: 100,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span className="calma-cart-fab-badge">{itemCount}</span>
        </button>
      )}
    </div>
  );
}