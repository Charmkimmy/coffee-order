import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config"; // adjust path if needed
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

  // REAL-TIME LISTENER for current order status
  useEffect(() => {
    if (!orderPlaced?.id) return;

    const unsubscribe = onSnapshot(
      doc(db, "orders", orderPlaced.id),
      (snapshot) => {
        if (snapshot.exists()) {
          setOrderPlaced((prev) => ({ ...prev, ...snapshot.data() }));
        }
      }
    );

    return () => unsubscribe();
  }, [orderPlaced?.id]);

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

  const placeOrder = async (paymentData = {}) => {
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
      status: payment === "instapay" ? "pending_verification" : "confirmed",
      verified: false,
    };

    // addOrder now returns { id, ...orderData }
    const savedOrder = await addOrder(orderData);

    setOrderPlaced({
      ...savedOrder,
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
    setShowCart(false);
  };

  return (
    <div className="beanito-cos">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kaushan+Script&family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Montserrat:wght@400;500;600;700&display=swap');

        .beanito-cos {
          font-family: 'Montserrat', sans-serif;
          background: #0B0805;
          background-image: radial-gradient(rgba(198,162,101,0.09) 1px, transparent 1px);
          background-size: 22px 22px;
          min-height: 100dvh;
          color: #F2EAD9;
          overflow-x: hidden;
        }

        .beanito-size-label {
          font-size: 11px;
          font-family: 'Montserrat', sans-serif;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #8A7554;
        }

        .beanito-size-toggle {
          display: flex;
          background: rgba(198,162,101,0.07);
          border: 1px solid rgba(198,162,101,0.18);
          border-radius: 999px;
          padding: 4px;
          gap: 4px;
        }

        .beanito-size-btn {
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

        .beanito-divider {
          border-top: 1px solid rgba(198,162,101,0.15);
          margin-bottom: 18px;
        }

        .beanito-panel {
          background: #120D07;
          border-left: 1px solid rgba(198,162,101,0.15);
        }

        .beanito-cart-panel {
          background: #0B0805;
          box-shadow: -4px 0 24px rgba(0,0,0,0.5);
        }

        .beanito-cart-backdrop {
          background: rgba(0,0,0,0.65);
        }

        .beanito-cart-fab {
          background: linear-gradient(180deg, #DDB076 0%, #C6A265 100%);
          color: #0B0805;
          border: none;
          border-radius: 50%;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(198,162,101,0.4);
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.15s ease;
        }
        .beanito-cart-fab:active { transform: scale(0.94); }
        @media (hover: hover) {
          .beanito-cart-fab:hover { box-shadow: 0 6px 26px rgba(198,162,101,0.55); }
        }

        .beanito-cart-fab-badge {
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

        .beanito-panel-lip {
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
            <span className="beanito-size-label">Size</span>
            <div className="beanito-size-toggle">
              {["16oz", "22oz"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className="beanito-size-btn cos-btn"
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
          <div className="beanito-divider" />
          <MenuColumn size={size} setSize={setSize} onAddToCart={addToCart} />
        </div>

        <div className="beanito-panel" style={{ position: "sticky", top: 0, minHeight: "600px", padding: "24px 20px" }}>
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
          <span className="beanito-size-label">Size</span>
          <div className="beanito-size-toggle">
            {["16oz", "22oz"].map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className="beanito-size-btn cos-btn"
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
        <div className="beanito-divider" />
        <MenuColumn size={size} setSize={setSize} onAddToCart={addToCart} />
      </div>

      {/* Mobile Cart Side Panel */}
      {showCart && createPortal(
        <>
          <div
            className="mobile-cart-backdrop beanito-cart-backdrop"
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
            className="mobile-cart-panel beanito-cart-panel"
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
            <div className="beanito-panel-lip" />
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
          className="mobile-cart-fab beanito-cart-fab cos-btn"
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
          <span className="beanito-cart-fab-badge">{itemCount}</span>
        </button>
      )}
    </div>
  );
}