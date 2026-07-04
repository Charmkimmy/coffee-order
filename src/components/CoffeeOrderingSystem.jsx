import React, { useState, useMemo } from "react";
import { useOrderHistory } from "../hooks/useOrderHistory";
import Header from "./Header";
import MenuColumn from "./MenuColumn";
import OrderColumn from "./OrderColumn";

export default function CoffeeOrderingSystem({ onBack }) {
  const [size, setSize] = useState("16oz");
  const [cart, setCart] = useState([]);
  const [payment, setPayment] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [showCart, setShowCart] = useState(false); // Mobile cart toggle

  const { addOrder } = useOrderHistory();

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

  const placeOrder = () => {
    if (cart.length === 0 || !payment) return;
    const orderNo = Math.floor(100 + Math.random() * 900);
    const orderData = {
      orderNo,
      items: [...cart],
      total,
      payment,
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
  };

  return (
    <div
      style={{
        fontFamily: "'Public Sans', sans-serif",
        background: "#F7F2E9",
        minHeight: "100vh",
        color: "#2B1B12",
        padding: "0",
      }}
    >
      <Header
        itemCount={itemCount}
        onBack={onBack}
        isCustomer={true}
        onCartToggle={() => setShowCart(!showCart)}
        showCart={showCart}
      />

      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* Menu column - full width on mobile */}
        <div style={{ padding: "16px" }}>
          {/* Size toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2, color: "#7A6650" }}>
              Size
            </span>
            <div
              style={{
                display: "flex",
                background: "#EFE6D6",
                borderRadius: 999,
                padding: 4,
                gap: 4,
              }}
            >
              {["16oz", "22oz"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className="cos-btn"
                  style={{
                    border: "none",
                    padding: "6px 18px",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: size === s ? "#2B1B12" : "transparent",
                    color: size === s ? "#F7F2E9" : "#5C4A38",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Menu items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <MenuColumn
              size={size}
              setSize={setSize}
              onAddToCart={addToCart}
            />
          </div>
        </div>

        {/* Mobile Cart Button (floating) */}
        {itemCount > 0 && !showCart && (
          <button
            onClick={() => setShowCart(true)}
            className="cos-btn"
            style={{
              position: "fixed",
              bottom: 20,
              right: 20,
              background: "#B8763E",
              color: "#FFF",
              border: "none",
              borderRadius: 50,
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(184, 118, 62, 0.4)",
              zIndex: 100,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                background: "#2B1B12",
                color: "#FFF",
                borderRadius: "50%",
                width: 22,
                height: 22,
                fontSize: 11,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {itemCount}
            </span>
          </button>
        )}

        {/* Mobile Cart Slide-up Panel */}
        {showCart && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(43, 27, 18, 0.5)",
              zIndex: 200,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
            onClick={() => setShowCart(false)}
          >
            <div
              style={{
                background: "#FFFDF9",
                borderRadius: "16px 16px 0 0",
                maxHeight: "85vh",
                overflowY: "auto",
                padding: "20px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700 }}>
                  Your Order
                </div>
                <button
                  onClick={() => setShowCart(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9A8770",
                    padding: 4,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <OrderColumn
                cart={cart}
                total={total}
                payment={payment}
                setPayment={setPayment}
                orderPlaced={orderPlaced}
                onChangeQty={changeQty}
                onRemoveItem={removeItem}
                onPlaceOrder={placeOrder}
                onNewOrder={newOrder}
                isMobile={true}
                onCloseCart={() => setShowCart(false)}
              />
            </div>
          </div>
        )}

        {/* Desktop Order Column - hidden on mobile */}
        <div className="desktop-order" style={{ display: "none" }}>
          <OrderColumn
            cart={cart}
            total={total}
            payment={payment}
            setPayment={setPayment}
            orderPlaced={orderPlaced}
            onChangeQty={changeQty}
            onRemoveItem={removeItem}
            onPlaceOrder={placeOrder}
            onNewOrder={newOrder}
            isMobile={false}
          />
        </div>
      </div>
    </div>
  );
}