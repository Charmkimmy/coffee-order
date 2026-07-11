import { useState, useEffect, useCallback } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  updateDoc, // ← ADD THIS
} from "firebase/firestore";
import { db } from "../firebase/config";

const ORDERS_COLLECTION = "orders";

export function useFirebaseOrders() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toMillis?.() || Date.now(),
      }));
      setOrderHistory(orders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addOrder = useCallback(async (orderData) => {
    const newOrder = {
      ...orderData,
      createdAt: serverTimestamp(),
      timestamp: Date.now(),
      date: new Date().toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), newOrder);
    return { id: docRef.id, ...newOrder };
  }, []);

  // ← ADD THIS FUNCTION
  const editOrder = useCallback(async (orderId, updates) => {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }, []);

  const deleteOrder = useCallback(async (orderId) => {
    await deleteDoc(doc(db, ORDERS_COLLECTION, orderId));
  }, []);

  const clearHistory = useCallback(async () => {
    if (!window.confirm("Clear all order history? This cannot be undone."))
      return;
    const deletePromises = orderHistory.map((order) =>
      deleteDoc(doc(db, ORDERS_COLLECTION, order.id))
    );
    await Promise.all(deletePromises);
  }, [orderHistory]);

  const dailyTotals = (() => {
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
      grouped[order.date].itemCount += order.items.reduce(
        (sum, item) => sum + item.qty,
        0
      );
    });
    return Object.values(grouped).sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
  })();

  const grandTotal = orderHistory.reduce(
    (sum, order) => sum + order.total,
    0
  );

  return {
    orderHistory,
    loading,
    addOrder,
    editOrder,      // ← ADD THIS
    deleteOrder,
    clearHistory,
    dailyTotals,
    grandTotal,
  };
}