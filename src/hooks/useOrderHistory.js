import { useState, useEffect, useMemo } from "react";

const STORAGE_KEY = "coffeeOrderHistory";

function loadHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.error("Failed to save history:", e);
  }
}

export function useOrderHistory() {
  const [orderHistory, setOrderHistory] = useState(loadHistory);

  useEffect(() => {
    saveHistory(orderHistory);
  }, [orderHistory]);

  const addOrder = (order) => {
    const newOrder = {
      ...order,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setOrderHistory((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const deleteOrder = (timestamp) => {
    setOrderHistory((prev) => prev.filter((o) => o.timestamp !== timestamp));
  };

  const clearHistory = () => {
    if (window.confirm("Clear all order history? This cannot be undone.")) {
      setOrderHistory([]);
    }
  };

  // Group orders by date with daily totals
  const dailyTotals = useMemo(() => {
    const grouped = {};
    orderHistory.forEach((order) => {
      if (!grouped[order.date]) {
        grouped[order.date] = {
          date: order.date,
          orders: [],
          totalSales: 0,
          itemCount: 0,
        };
      }
      grouped[order.date].orders.push(order);
      grouped[order.date].totalSales += order.total;
      grouped[order.date].itemCount += order.items.reduce((sum, item) => sum + item.qty, 0);
    });
    // Convert to array sorted by date (newest first)
    return Object.values(grouped).sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
  }, [orderHistory]);

  // Grand total of all sales
  const grandTotal = useMemo(() => {
    return orderHistory.reduce((sum, order) => sum + order.total, 0);
  }, [orderHistory]);

  return { orderHistory, addOrder, deleteOrder, clearHistory, dailyTotals, grandTotal };
}