import React, { useState } from "react";
import IntroScreen from "./components/Introscreen";
import CoffeeOrderingSystem from "./components/CoffeeOrderingSystem";
import AdminDashboard from "./components/AdminDashboard";
import { useFirebaseOrders } from "./hooks/useFirebaseOrders";
import "./styles/global.css";

function App() {
  const [screen, setScreen] = useState("intro");
  const {
    orderHistory,
    loading,
    addOrder,
    deleteOrder,
    clearHistory,
    dailyTotals,
    grandTotal,
  } = useFirebaseOrders();

  const handleGetStarted = () => setScreen("order");
  const handleAdminLogin = () => setScreen("admin");
  const handleBack = () => setScreen("intro");

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#F7F2E9",
          fontFamily: "'Public Sans', sans-serif",
          color: "#2B1B12",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid #E7DCC7",
              borderTopColor: "#B8763E",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Loading...
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
          onDeleteOrder={deleteOrder}
          onClearHistory={clearHistory}
          onBack={handleBack}
        />
      )}
    </>
  );
}

export default App;