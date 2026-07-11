import React, { useState, useEffect } from "react";
import IntroScreen from "./components/Introscreen";
import CoffeeOrderingSystem from "./components/CoffeeOrderingSystem";
import AdminDashboard from "./components/AdminDashboard";
import { useFirebaseOrders } from "./hooks/useFirebaseOrders";
import "./styles/global.css";

function App() {
  const [screen, setScreen] = useState("intro");
  const [unmatchedPayments, setUnmatchedPayments] = useState([]);
  const {
    orderHistory,
    loading,
    addOrder,
    deleteOrder,
    editOrder,
    dailyTotals,
    grandTotal,
  } = useFirebaseOrders();

  // Fetch unmatched payments from Firebase
  useEffect(() => {
    // TODO: Replace with actual Firebase listener
    // firebase.database().ref('unmatchedPayments').on('value', (snap) => {
    //   const data = [];
    //   snap.forEach((child) => data.push({ id: child.key, ...child.val() }));
    //   setUnmatchedPayments(data);
    // });
  }, []);

  const handleGetStarted = () => setScreen("order");
  const handleAdminLogin = () => setScreen("admin");
  const handleBack = () => setScreen("intro");
  const handleLogout = () => setScreen("intro");

  // Verify a payment and match it to an order
  const handleVerifyPayment = (paymentId, orderId) => {
    const payment = unmatchedPayments.find((p) => p.id === paymentId);
    if (!payment) return;

    editOrder(orderId, {
      verified: true,
      verifiedAt: Date.now(),
      verifiedBy: "admin-manual",
      referenceNo: payment.refNo || payment.referenceNo,
      smsSender: payment.senderName,
    });

    setUnmatchedPayments((prev) => prev.filter((p) => p.id !== paymentId));
  };

  // Remove an unmatched payment (if invalid/spam)
  const handleRemoveUnmatchedPayment = (paymentId) => {
    setUnmatchedPayments((prev) => prev.filter((p) => p.id !== paymentId));
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#0B0805",
          fontFamily: "'Montserrat', sans-serif",
          color: "#F2EAD9",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid rgba(198,162,101,0.2)",
              borderTopColor: "#C6A265",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ fontSize: 14, color: "#8A7554" }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {screen === "intro" && (
        <IntroScreen
          onGetStarted={handleGetStarted}
          onAdminLogin={handleAdminLogin}
        />
      )}
      {screen === "order" && (
        <CoffeeOrderingSystem onBack={handleBack} addOrder={addOrder} />
      )}
      {screen === "admin" && (
        <AdminDashboard
          dailyTotals={dailyTotals}
          grandTotal={grandTotal}
          orderHistory={orderHistory}
          unmatchedPayments={unmatchedPayments}
          onDeleteOrder={deleteOrder}
          onEditOrder={editOrder}
          onVerifyPayment={handleVerifyPayment}
          onRemoveUnmatchedPayment={handleRemoveUnmatchedPayment}
          onBack={handleBack}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

export default App;