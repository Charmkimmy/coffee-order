import React, { useState, useMemo, useEffect, useRef } from "react";
import { Calendar, DollarSign, ShoppingBag, Clock, Trash2, User, Pencil, CheckSquare, Square, X, Search, Download, ChevronLeft, ChevronRight, LogOut, FileText } from "lucide-react";
import { peso } from "../utils/format";
import { PAYMENTS } from "../data/payments";

export default function AdminDashboard({ dailyTotals, grandTotal, orderHistory, onDeleteOrder, onBack, onEditOrder, onLogout }) {
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [editingOrder, setEditingOrder] = useState(null);
  const [editCustomerName, setEditCustomerName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const prevOrderCountRef = useRef(orderHistory.length);
  const ordersPerPage = 5;

  // Sound notification for new orders
  useEffect(() => {
    const currentCount = orderHistory.length;
    const prevCount = prevOrderCountRef.current;

    if (currentCount > prevCount && soundEnabled && prevCount > 0) {
      // New order arrived - play sound
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch((err) => {
        // Auto-play blocked or file missing - silent fail
        console.log('Sound notification blocked or missing:', err);
      });
    }

    prevOrderCountRef.current = currentCount;
  }, [orderHistory.length, soundEnabled]);

  // Filter orders by search query
  const filteredOrderHistory = useMemo(() => {
    if (!searchQuery.trim()) return orderHistory;
    const query = searchQuery.toLowerCase();
    return orderHistory.filter((order) =>
      (order.customerName && order.customerName.toLowerCase().includes(query)) ||
      order.orderNo.toString().includes(query) ||
      order.items.some((item) => item.name.toLowerCase().includes(query)) ||
      (order.notes && order.notes.toLowerCase().includes(query))
    );
  }, [orderHistory, searchQuery]);

  // Rebuild dailyTotals from filtered orders
  const filteredDailyTotals = useMemo(() => {
    const grouped = {};
    filteredOrderHistory.forEach((order) => {
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
  }, [filteredOrderHistory]);

  // Flatten orders for pagination
  const allFilteredOrders = useMemo(() => {
    const orders = [];
    filteredDailyTotals.forEach((day) => {
      day.orders.forEach((order) => {
        orders.push({ ...order, dayDate: day.date });
      });
    });
    return orders;
  }, [filteredDailyTotals]);

  const totalPages = Math.ceil(allFilteredOrders.length / ordersPerPage);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ordersPerPage;
    return allFilteredOrders.slice(start, start + ordersPerPage);
  }, [allFilteredOrders, currentPage]);

  // Group paginated orders back by day for display
  const paginatedDailyTotals = useMemo(() => {
    const grouped = {};
    paginatedOrders.forEach((order) => {
      if (!grouped[order.dayDate]) {
        grouped[order.dayDate] = {
          date: order.dayDate,
          orders: [],
          totalSales: 0,
          itemCount: 0,
        };
      }
      grouped[order.dayDate].orders.push(order);
      grouped[order.dayDate].totalSales += order.total;
      grouped[order.dayDate].itemCount += order.items.reduce(
        (sum, item) => sum + item.qty,
        0
      );
    });
    return Object.values(grouped).sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
  }, [paginatedOrders]);

  const toggleSelect = (orderId) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const selectAll = () => {
    const allIds = new Set(filteredOrderHistory.map((o) => o.id));
    setSelectedOrders(allIds);
  };

  const deselectAll = () => {
    setSelectedOrders(new Set());
  };

  const deleteSelected = () => {
    if (selectedOrders.size === 0) return;
    if (!window.confirm(`Delete ${selectedOrders.size} selected order(s)? This cannot be undone.`)) return;
    selectedOrders.forEach((id) => onDeleteOrder(id));
    setSelectedOrders(new Set());
  };

  const startEdit = (order) => {
    setEditingOrder(order.id);
    setEditCustomerName(order.customerName || "");
  };

  const saveEdit = (orderId) => {
    if (onEditOrder) {
      onEditOrder(orderId, { customerName: editCustomerName });
    }
    setEditingOrder(null);
    setEditCustomerName("");
  };

  const cancelEdit = () => {
    setEditingOrder(null);
    setEditCustomerName("");
  };

  const allSelected = selectedOrders.size === filteredOrderHistory.length && filteredOrderHistory.length > 0;

  // Export to Excel (HTML table format that Excel can open)
  const exportToExcel = () => {
    const headers = ["Date", "Time", "Order #", "Customer", "Items", "Notes", "Payment", "Total"];
    const rows = filteredOrderHistory.map((order) => [
      order.date,
      order.time,
      order.orderNo,
      order.customerName || "Walk-in",
      order.items.map((i) => `${i.qty}x ${i.name} (${i.size})`).join("; "),
      order.notes || "",
      PAYMENTS.find((p) => p.id === order.payment)?.label || order.payment,
      order.total,
    ]);

    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head>
        <meta charset="UTF-8">
        <style>
          table { border-collapse: collapse; font-family: Arial, sans-serif; }
          th { background: #3E2723; color: #EFEBE9; font-weight: bold; padding: 10px; border: 1px solid #D7CCC8; }
          td { padding: 8px; border: 1px solid #D7CCC8; color: #3E2723; }
          tr:nth-child(even) { background: #F5F0EB; }
        </style>
      </head>
      <body>
        <table>
          <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
          <tbody>
            ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `sales-history-${new Date().toISOString().split("T")[0]}.xls`;
    link.click();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#EFEBE9",
        fontFamily: "'Public Sans', sans-serif",
        color: "#3E2723",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#3E2723",
          color: "#EFEBE9",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 600 }}>
              Admin Dashboard
            </div>
            <div style={{ fontSize: 11, color: "#A1887F", letterSpacing: 1.5, textTransform: "uppercase" }}>
              Sales History
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          style={{
            background: "none",
            border: "1px solid #A1887F",
            color: "#A1887F",
            padding: "6px 12px",
            borderRadius: 8,
            fontSize: 12,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(161, 136, 127, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
          }}
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 900, margin: "0 auto" }}>
        <div style={{ background: "#FFFDF9", border: "1px solid #D7CCC8", borderRadius: 12, padding: "20px", textAlign: "center" }}>
          <DollarSign size={24} color="#8D6E63" style={{ marginBottom: 8 }} />
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700 }}>{peso(grandTotal)}</div>
          <div style={{ fontSize: 12, color: "#A1887F", marginTop: 4 }}>Total Sales</div>
        </div>
        <div style={{ background: "#FFFDF9", border: "1px solid #D7CCC8", borderRadius: 12, padding: "20px", textAlign: "center" }}>
          <ShoppingBag size={24} color="#8D6E63" style={{ marginBottom: 8 }} />
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700 }}>{orderHistory.length}</div>
          <div style={{ fontSize: 12, color: "#A1887F", marginTop: 4 }}>Total Orders</div>
        </div>
        <div style={{ background: "#FFFDF9", border: "1px solid #D7CCC8", borderRadius: 12, padding: "20px", textAlign: "center" }}>
          <Calendar size={24} color="#8D6E63" style={{ marginBottom: 8 }} />
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700 }}>{dailyTotals.length}</div>
          <div style={{ fontSize: 12, color: "#A1887F", marginTop: 4 }}>Days Active</div>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div style={{ padding: "0 24px 16px", maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "space-between" }}>
        {/* Search - Mobile responsive */}
        <div style={{ position: "relative", flex: 1, minWidth: 140, maxWidth: 280 }}>
          <Search size={14} color="#A1887F" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              width: "100%",
              padding: "8px 12px 8px 32px",
              borderRadius: 8,
              border: "1px solid #D7CCC8",
              background: "#FFFDF9",
              fontSize: 12,
              fontFamily: "'Public Sans', sans-serif",
              color: "#3E2723",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Export Excel - Mobile responsive */}
        <button
          onClick={exportToExcel}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: "transparent",
            border: "1px solid #8D6E63",
            color: "#8D6E63",
            padding: "7px 12px",
            borderRadius: 8,
            fontSize: 12,
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          <Download size={14} />
          <span style={{ display: "inline" }}>Export Excel</span>
        </button>
      </div>

      {/* Sound Toggle */}
      <div style={{ padding: "0 24px 8px", maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "transparent",
            border: "1px solid " + (soundEnabled ? "#8D6E63" : "#A1887F"),
            color: soundEnabled ? "#8D6E63" : "#A1887F",
            padding: "4px 10px",
            borderRadius: 6,
            fontSize: 11,
            cursor: "pointer",
          }}
          title={soundEnabled ? "Sound notifications on" : "Sound notifications off"}
        >
          {soundEnabled ? "🔔" : "🔕"}
          {soundEnabled ? "Sound On" : "Sound Off"}
        </button>
      </div>

      {/* Select All / Delete Selected Bar */}
      {filteredOrderHistory.length > 0 && (
        <div style={{ padding: "0 24px 16px", maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={allSelected ? deselectAll : selectAll}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "transparent",
              border: "1px solid #8D6E63",
              color: "#8D6E63",
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {allSelected ? <CheckSquare size={14} /> : <Square size={14} />}
            {allSelected ? "Deselect All" : "Select All"}
          </button>
          {selectedOrders.size > 0 && (
            <button
              onClick={deleteSelected}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "transparent",
                border: "1px solid #C62828",
                color: "#C62828",
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              <Trash2 size={14} />
              Delete Selected ({selectedOrders.size})
            </button>
          )}
          <span style={{ fontSize: 12, color: "#A1887F", marginLeft: "auto" }}>
            {filteredOrderHistory.length} order{filteredOrderHistory.length !== 1 ? "s" : ""} found
          </span>
        </div>
      )}

      {/* Daily Sales */}
      <div style={{ padding: "0 24px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          Daily Sales
        </div>

        {paginatedDailyTotals.length === 0 ? (
          <div style={{ background: "#FFFDF9", border: "1px dashed #D7CCC8", borderRadius: 12, padding: "40px", textAlign: "center", color: "#A1887F" }}>
            {searchQuery ? "No orders match your search." : "No sales yet. Orders will appear here once customers start ordering."}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {paginatedDailyTotals.map((day) => (
              <div key={day.date} style={{ background: "#FFFDF9", border: "1px solid #D7CCC8", borderRadius: 12, overflow: "hidden" }}>
                {/* Day Header */}
                <div
                  style={{
                    background: "#3E2723",
                    color: "#EFEBE9",
                    padding: "14px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Calendar size={16} color="#A1887F" />
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{day.date}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13 }}>
                    <span>{day.orders.length} orders</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", color: "#A1887F", fontWeight: 700 }}>
                      {peso(day.totalSales)}
                    </span>
                  </div>
                </div>

                {/* Orders List */}
                <div style={{ padding: "16px 20px" }}>
                  {day.orders.map((order) => (
                    <div
                      key={order.id}
                      style={{
                        borderBottom: "1px dashed #D7CCC8",
                        padding: "12px 0",
                        position: "relative",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <button
                          onClick={() => toggleSelect(order.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#8D6E63",
                            padding: 2,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {selectedOrders.has(order.id) ? <CheckSquare size={16} /> : <Square size={16} />}
                        </button>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flex: 1, paddingRight: 20 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6D4C41" }}>
                            <Clock size={12} />
                            {order.time}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {editingOrder === order.id ? (
                              <input
                                type="text"
                                value={editCustomerName}
                                onChange={(e) => setEditCustomerName(e.target.value)}
                                placeholder="Customer name..."
                                style={{
                                  padding: "4px 8px",
                                  borderRadius: 6,
                                  border: "1px solid #8D6E63",
                                  fontSize: 12,
                                  fontFamily: "'Public Sans', sans-serif",
                                  color: "#3E2723",
                                  outline: "none",
                                }}
                                autoFocus
                              />
                            ) : (
                              order.customerName && (
                                <span style={{ fontSize: 11, color: "#8D6E63", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                                  <User size={11} />
                                  {order.customerName}
                                </span>
                              )
                            )}
                            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700 }}>
                              Order #{order.orderNo}
                            </span>
                          </div>
                        </div>
                      </div>
                      {order.items.map((item) => (
                        <div key={item.key} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#5D4037", marginBottom: 2, paddingLeft: 34 }}>
                          <span>{item.qty}× {item.name} ({item.size})</span>
                          <span>{peso(item.price * item.qty)}</span>
                        </div>
                      ))}
                      {/* Order Notes */}
                      {order.notes && (
                        <div style={{ marginTop: 8, marginBottom: 4, padding: "8px 10px", background: "#F2E9D8", borderRadius: 6, borderLeft: "3px solid #B23A1E", paddingLeft: 34 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                            <FileText size={11} color="#B23A1E" />
                            <span style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", textTransform: "uppercase", letterSpacing: 1, color: "#8A7F6C" }}>Notes</span>
                          </div>
                          <div style={{ fontSize: 13, color: "#241A12", fontStyle: "italic" }}>{order.notes}</div>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12, color: "#A1887F", paddingLeft: 34 }}>
                        <span>Paid via {PAYMENTS.find((p) => p.id === order.payment)?.label}</span>
                        <span style={{ fontWeight: 700, color: "#3E2723" }}>{peso(order.total)}</span>
                      </div>
                      {/* Edit & Delete Buttons */}
                      <div style={{ display: "flex", gap: 8, marginTop: 8, paddingLeft: 34 }}>
                        {editingOrder === order.id ? (
                          <>
                            <button
                              onClick={() => saveEdit(order.id)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                background: "#8D6E63",
                                border: "none",
                                color: "#FFF",
                                padding: "4px 10px",
                                borderRadius: 6,
                                fontSize: 11,
                                cursor: "pointer",
                              }}
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                background: "transparent",
                                border: "1px solid #A1887F",
                                color: "#A1887F",
                                padding: "4px 10px",
                                borderRadius: 6,
                                fontSize: 11,
                                cursor: "pointer",
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(order)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                background: "transparent",
                                border: "1px solid #8D6E63",
                                color: "#8D6E63",
                                padding: "4px 10px",
                                borderRadius: 6,
                                fontSize: 11,
                                cursor: "pointer",
                              }}
                            >
                              <Pencil size={12} />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm("Delete this order? This cannot be undone.")) {
                                  onDeleteOrder(order.id);
                                }
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                background: "transparent",
                                border: "1px solid #C62828",
                                color: "#C62828",
                                padding: "4px 10px",
                                borderRadius: 6,
                                fontSize: 11,
                                cursor: "pointer",
                              }}
                            >
                              <X size={12} />
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Day Footer */}
                <div
                  style={{
                    background: "#F5F0EB",
                    padding: "12px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid #D7CCC8",
                  }}
                >
                  <span style={{ fontSize: 12, color: "#6D4C41" }}>{day.itemCount} items sold</span>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 700 }}>
                    Day Total: {peso(day.totalSales)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 24 }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                background: "transparent",
                border: "1px solid #D7CCC8",
                color: currentPage === 1 ? "#D7CCC8" : "#8D6E63",
                padding: "6px 12px",
                borderRadius: 8,
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: 13, color: "#6D4C41" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                background: "transparent",
                border: "1px solid #D7CCC8",
                color: currentPage === totalPages ? "#D7CCC8" : "#8D6E63",
                padding: "6px 12px",
                borderRadius: 8,
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}