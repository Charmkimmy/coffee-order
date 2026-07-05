import React, { useState, useMemo } from "react";
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

  const placeOrder = () => {
    if (cart.length === 0 || !payment || !customerName.trim()) return;

    const orderNo = Math.floor(100 + Math.random() * 900);
    const orderData = {
      orderNo,
      items: [...cart],
      total,
      payment,
      customerName: customerName.trim(),
      notes: orderNotes.trim(),
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
    <div
      style={{
        fontFamily: "'Public Sans', sans-serif",
        background: "#F2E9D8",
        backgroundImage:
          "radial-gradient(#E4D7BC 1px, transparent 1px), radial-gradient(#E4D7BC 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        backgroundPosition: "0 0, 12px 12px",
        minHeight: "100vh",
        color: "#241A12",
        padding: "0",
        overflow: "hidden",
      }}
    >
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
            <span style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", textTransform: "uppercase", letterSpacing: 1.5, color: "#8A7F6C" }}>
              Size
            </span>
            <div style={{ display: "flex", background: "#EFE6D3", borderRadius: 999, padding: 4, gap: 4 }}>
              {["16oz", "22oz"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className="cos-btn"
                  style={{
                    border: "none",
                    padding: "6px 18px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 700,
                    cursor: "pointer",
                    background: size === s ? "#241A12" : "transparent",
                    color: size === s ? "#FCFAF5" : "#5C5140",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1.5px dashed #C9BB9E", marginBottom: 18 }} />
          <MenuColumn size={size} setSize={setSize} onAddToCart={addToCart} />
        </div>

        <div style={{ position: "sticky", top: 0, background: "#FCFAF5", borderLeft: "1px solid #C9BB9E", minHeight: "600px", padding: "24px 20px" }}>
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
      <div className="mobile-layout" style={{ position: "relative", padding: "16px", paddingBottom: "80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <span style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", textTransform: "uppercase", letterSpacing: 1.5, color: "#8A7F6C" }}>
            Size
          </span>
          <div style={{ display: "flex", background: "#EFE6D3", borderRadius: 999, padding: 4, gap: 4 }}>
            {["16oz", "22oz"].map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className="cos-btn"
                style={{
                  border: "none",
                  padding: "6px 18px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: size === s ? "#241A12" : "transparent",
                  color: size === s ? "#FCFAF5" : "#5C5140",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1.5px dashed #C9BB9E", marginBottom: 18 }} />
        <MenuColumn size={size} setSize={setSize} onAddToCart={addToCart} />
      </div>

      {/* Mobile Cart Side Panel */}
      {showCart && (
        <>
          <div
            className="mobile-cart-backdrop"
            onClick={() => setShowCart(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(43, 27, 18, 0.5)",
              zIndex: 150,
            }}
          />
          <div
            className="mobile-cart-panel"
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "85%",
              maxWidth: 380,
              background: "#FCFAF5",
              zIndex: 200,
              boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                height: 10,
                flexShrink: 0,
                backgroundImage:
                  "linear-gradient(135deg, #FCFAF5 50%, transparent 50%), linear-gradient(-135deg, #FCFAF5 50%, transparent 50%)",
                backgroundSize: "16px 16px",
                backgroundRepeat: "repeat-x",
                backgroundPosition: "bottom",
                backgroundColor: "#F2E9D8",
              }}
            />
            <div style={{ padding: "20px", flex: 1, overflowY: "auto" }}>
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
        </>
      )}

      {/* Mobile Floating Cart Button */}
      {itemCount > 0 && !showCart && (
        <button
          onClick={() => setShowCart(true)}
          className="mobile-cart-fab cos-btn"
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: "#B23A1E",
            color: "#FFF",
            border: "none",
            borderRadius: 50,
            width: 56,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(178, 58, 30, 0.35)",
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
              background: "#241A12",
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
    </div>
  );
}