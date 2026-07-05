import React, { useState, useMemo } from "react";
import { ArrowLeft, Calendar, DollarSign, ShoppingBag, Clock, Trash2, User, Pencil, CheckSquare, Square, X, Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { peso } from "../utils/format";
import { PAYMENTS } from "../data/payments";

export default function AdminDashboard({ dailyTotals, grandTotal, orderHistory, onDeleteOrder, onBack, onEditOrder }) {
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [editingOrder, setEditingOrder] = useState(null);
  const [editCustomerName, setEditCustomerName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Filter orders by search query
  const filteredOrderHistory = useMemo(() => {
    if (!searchQuery.trim()) return orderHistory;
    const query = searchQuery.toLowerCase();
    return orderHistory.filter((order) =>
      (order.customerName && order.customerName.toLowerCase().includes(query)) ||
      order.orderNo.toString().includes(query) ||
      order.items.some((item) => item.name.toLowerCase().includes(query))
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
    const headers = ["Date", "Time", "Order #", "Customer", "Items", "Payment", "Total"];
    const rows = filteredOrderHistory.map((order) => [
      order.date,
      order.time,
      order.orderNo,
      order.customerName || "Walk-in",
      order.items.map((i) => `${i.qty}x ${i.name} (${i.size})`).join("; "),
      PAYMENTS.find((p) => p.id === order.payment)?.label || order.payment,
      order.total,
    ]);

    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head>
        <meta charset="UTF-8">
        <style>
          table { border-collapse: collapse; font-family: Arial, sans-serif; }
          th { background: #241A12; color: #F2E9D8; font-weight: bold; padding: 10px; border: 1px solid #C9BB9E; }
          td { padding: 8px; border: 1px solid #C9BB9E; color: #241A12; }
          tr:nth-child(even) { background: #EFE6D3; }
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
        background: "#F2E9D8",
        fontFamily: "'Public Sans', sans-serif",
        color: "#241A12",
      }}
    >
      {/* Header */}
      <div>
        <div
          style={{
            background: "#241A12",
            color: "#F2E9D8",
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={onBack}
              className="cos-btn"
              style={{
                background: "none",
                border: "none",
                color: "#8A7F6C",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: 4,
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 15, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
                Admin Dashboard
              </div>
              <div style={{ fontSize: 11, color: "#8A7F6C", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'Space Mono', monospace" }}>
                Sales History
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            height: 10,
            backgroundImage:
              "linear-gradient(45deg, #241A12 50%, transparent 50%), linear-gradient(-45deg, #241A12 50%, transparent 50%)",
            backgroundSize: "16px 16px",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "top",
            backgroundColor: "#F2E9D8",
          }}
        />
      </div>

      {/* Summary Cards */}
      <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 900, margin: "0 auto" }}>
        <div style={{ background: "#FCFAF5", border: "1px solid #C9BB9E", borderRadius: 6, padding: "20px", textAlign: "center" }}>
          <DollarSign size={24} color="#B23A1E" style={{ marginBottom: 8 }} />
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700 }}>{peso(grandTotal)}</div>
          <div style={{ fontSize: 12, color: "#8A7F6C", marginTop: 4 }}>Total Sales</div>
        </div>
        <div style={{ background: "#FCFAF5", border: "1px solid #C9BB9E", borderRadius: 6, padding: "20px", textAlign: "center" }}>
          <ShoppingBag size={24} color="#B23A1E" style={{ marginBottom: 8 }} />
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700 }}>{orderHistory.length}</div>
          <div style={{ fontSize: 12, color: "#8A7F6C", marginTop: 4 }}>Total Orders</div>
        </div>
        <div style={{ background: "#FCFAF5", border: "1px solid #C9BB9E", borderRadius: 6, padding: "20px", textAlign: "center" }}>
          <Calendar size={24} color="#B23A1E" style={{ marginBottom: 8 }} />
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700 }}>{dailyTotals.length}</div>
          <div style={{ fontSize: 12, color: "#8A7F6C", marginTop: 4 }}>Days Active</div>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div style={{ padding: "0 24px 16px", maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "space-between" }}>
        {/* Search - Mobile responsive */}
        <div style={{ position: "relative", flex: 1, minWidth: 140, maxWidth: 280 }}>
          <Search size={14} color="#8A7F6C" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
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
              borderRadius: 6,
              border: "1px solid #C9BB9E",
              background: "#FCFAF5",
              fontSize: 12,
              fontFamily: "'Public Sans', sans-serif",
              color: "#241A12",
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
            border: "1px solid #B23A1E",
            color: "#B23A1E",
            padding: "7px 12px",
            borderRadius: 6,
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
              border: "1px solid #B23A1E",
              color: "#B23A1E",
              padding: "6px 14px",
              borderRadius: 6,
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
                borderRadius: 6,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              <Trash2 size={14} />
              Delete Selected ({selectedOrders.size})
            </button>
          )}
          <span style={{ fontSize: 12, color: "#8A7F6C", marginLeft: "auto" }}>
            {filteredOrderHistory.length} order{filteredOrderHistory.length !== 1 ? "s" : ""} found
          </span>
        </div>
      )}

      {/* Daily Sales */}
      <div style={{ padding: "0 24px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
          Daily Sales
        </div>

        {paginatedDailyTotals.length === 0 ? (
          <div style={{ background: "#FCFAF5", border: "1px dashed #C9BB9E", borderRadius: 6, padding: "40px", textAlign: "center", color: "#8A7F6C" }}>
            {searchQuery ? "No orders match your search." : "No sales yet. Orders will appear here once customers start ordering."}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {paginatedDailyTotals.map((day) => (
              <div key={day.date} style={{ background: "#FCFAF5", border: "1px solid #C9BB9E", borderRadius: 6, overflow: "hidden" }}>
                {/* Day Header */}
                <div
                  style={{
                    background: "#241A12",
                    color: "#F2E9D8",
                    padding: "14px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Calendar size={16} color="#8A7F6C" />
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{day.date}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13 }}>
                    <span>{day.orders.length} orders</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", color: "#8A7F6C", fontWeight: 700 }}>
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
                        borderBottom: "1px dashed #C9BB9E",
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
                            color: "#B23A1E",
                            padding: 2,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {selectedOrders.has(order.id) ? <CheckSquare size={16} /> : <Square size={16} />}
                        </button>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flex: 1, paddingRight: 20 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#5C5140" }}>
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
                                  border: "1px solid #B23A1E",
                                  fontSize: 12,
                                  fontFamily: "'Public Sans', sans-serif",
                                  color: "#241A12",
                                  outline: "none",
                                }}
                                autoFocus
                              />
                            ) : (
                              order.customerName && (
                                <span style={{ fontSize: 11, color: "#B23A1E", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
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
                        <div key={item.key} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#5C5140", marginBottom: 2, paddingLeft: 34 }}>
                          <span>{item.qty}× {item.name} ({item.size})</span>
                          <span>{peso(item.price * item.qty)}</span>
                        </div>
                      ))}
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12, color: "#8A7F6C", paddingLeft: 34 }}>
                        <span>Paid via {PAYMENTS.find((p) => p.id === order.payment)?.label}</span>
                        <span style={{ fontWeight: 700, color: "#241A12" }}>{peso(order.total)}</span>
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
                                background: "#B23A1E",
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
                                border: "1px solid #8A7F6C",
                                color: "#8A7F6C",
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
                                border: "1px solid #B23A1E",
                                color: "#B23A1E",
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
                    background: "#EFE6D3",
                    padding: "12px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid #C9BB9E",
                  }}
                >
                  <span style={{ fontSize: 12, color: "#5C5140" }}>{day.itemCount} items sold</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>
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
                border: "1px solid #C9BB9E",
                color: currentPage === 1 ? "#C9BB9E" : "#B23A1E",
                padding: "6px 12px",
                borderRadius: 6,
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: 13, color: "#5C5140" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                background: "transparent",
                border: "1px solid #C9BB9E",
                color: currentPage === totalPages ? "#C9BB9E" : "#B23A1E",
                padding: "6px 12px",
                borderRadius: 6,
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