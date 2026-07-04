import React, { useState } from "react";
import IntroScreen from "./components/Introscreen";
import CoffeeOrderingSystem from "./components/CoffeeOrderingSystem";
import AdminDashboard from "./components/AdminDashboard";
import { useOrderHistory } from "./hooks/useOrderHistory";
import "./styles/global.css";

function App() {
  const [screen, setScreen] = useState("intro");
  const { orderHistory, deleteOrder, clearHistory, dailyTotals, grandTotal } = useOrderHistory();

  const handleGetStarted = () => {
    setScreen("order");
  };

  const handleAdminLogin = () => {
    setScreen("admin");
  };

  const handleBack = () => {
    setScreen("intro");
  };

  return (
    <>
      {screen === "intro" && (
        <IntroScreen
          onGetStarted={handleGetStarted}
          onAdminLogin={handleAdminLogin}
        />
      )}
      {screen === "order" && (
        <CoffeeOrderingSystem
          onBack={handleBack}
        />
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