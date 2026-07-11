import React, { useState, useMemo, useEffect, useRef } from "react";
import { Calendar, DollarSign, ShoppingBag, Clock, Trash2, User, Pencil, CheckSquare, Square, X, Search, Download, ChevronLeft, ChevronRight, LogOut, FileText, BellRing, BellOff } from "lucide-react";
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
    <div className="calma-admin-dash">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Montserrat:wght@400;500;600;700&display=swap');

        .calma-admin-dash * { box-sizing: border-box; }

        .calma-admin-dash {
          min-height: 100dvh;
          background: #0B0805;
          background-image: radial-gradient(rgba(198,162,101,0.08) 1px, transparent 1px);
          background-size: 22px 22px;
          font-family: 'Montserrat', sans-serif;
          color: #F2EAD9;
        }

        .calma-ad-topbar {
          background: #100A06;
          border-bottom: 1px solid rgba(198,162,101,0.18);
          padding: max(18px, env(safe-area-inset-top)) 24px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .calma-ad-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 700; color: #F2EAD9; }
        .calma-ad-subtitle { font-size: 11px; color: #8A7554; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px; }

        .calma-ad-btn {
          background: transparent;
          border: 1px solid rgba(198,162,101,0.35);
          color: #C6A265;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-family: 'Montserrat', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          min-height: 36px;
          -webkit-tap-highlight-color: transparent;
        }
        .calma-ad-btn:active { background: rgba(198,162,101,0.12); }
        @media (hover: hover) {
          .calma-ad-btn:hover { background: rgba(198,162,101,0.1); }
        }
        .calma-ad-btn.danger { border-color: rgba(194,69,58,0.5); color: #d4776c; }
        @media (hover: hover) {
          .calma-ad-btn.danger:hover { background: rgba(194,69,58,0.12); }
        }
        .calma-ad-btn.muted { border-color: rgba(198,162,101,0.2); color: #8A7554; }

        .calma-summary-grid {
          padding: 24px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          max-width: 900px;
          margin: 0 auto;
        }

        .calma-summary-card {
          background: #100A06;
          border: 1px solid rgba(198,162,101,0.18);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }
        .calma-summary-value { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 700; color: #F2EAD9; }
        .calma-summary-label { font-size: 12px; color: #8A7554; margin-top: 4px; }

        .calma-search-wrap { position: relative; flex: 1; min-width: 140px; max-width: 280px; }
        .calma-search-input {
          width: 100%;
          padding: 9px 12px 9px 32px;
          border-radius: 8px;
          border: 1px solid rgba(198,162,101,0.25);
          background: rgba(198,162,101,0.04);
          font-size: 16px;
          font-family: 'Montserrat', sans-serif;
          color: #F2EAD9;
          outline: none;
        }
        .calma-search-input::placeholder { color: #5C4E3C; }
        .calma-search-input:focus { border-color: #C6A265; }

        .calma-day-card { background: #100A06; border: 1px solid rgba(198,162,101,0.18); border-radius: 12px; overflow: hidden; }
        .calma-day-header { background: #0B0805; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(198,162,101,0.12); }
        .calma-day-footer { background: rgba(198,162,101,0.05); padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(198,162,101,0.12); }

        .calma-order-row { border-bottom: 1px dashed rgba(198,162,101,0.2); padding: 12px 0; position: relative; }
        .calma-order-row:last-child { border-bottom: none; }

        .calma-check-btn { background: none; border: none; cursor: pointer; color: #C6A265; padding: 4px; display: flex; align-items: center; min-width: 32px; min-height: 32px; justify-content: center; }

        .calma-edit-input {
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid #C6A265;
          background: rgba(198,162,101,0.06);
          font-size: 13px;
          font-family: 'Montserrat', sans-serif;
          color: #F2EAD9;
          outline: none;
        }

        .calma-mini-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 11px;
          cursor: pointer;
          min-height: 30px;
          -webkit-tap-highlight-color: transparent;
        }
        .calma-mini-btn.gold { border: 1px solid rgba(198,162,101,0.4); color: #C6A265; }
        .calma-mini-btn.gold-fill { border: none; background: #C6A265; color: #0B0805; font-weight: 700; }
        .calma-mini-btn.danger { border: 1px solid rgba(194,69,58,0.5); color: #d4776c; }
        .calma-mini-btn.neutral { border: 1px solid rgba(198,162,101,0.25); color: #8A7554; }

        .calma-page-btn {
          background: transparent;
          border: 1px solid rgba(198,162,101,0.25);
          padding: 6px 12px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          min-height: 36px;
          -webkit-tap-highlight-color: transparent;
        }
        .calma-page-btn:not(:disabled) { color: #C6A265; cursor: pointer; }
        .calma-page-btn:disabled { color: #4a3f30; cursor: not-allowed; }

        @media (max-width: 640px) {
          .calma-summary-grid { grid-template-columns: 1fr 1fr 1fr; gap: 10px; padding: 16px; }
          .calma-summary-card { padding: 14px 10px; }
          .calma-summary-value { font-size: 20px; }
        }
      `}</style>

      {/* Header */}
      <div className="calma-ad-topbar">
        <div>
          <div className="calma-ad-title">Admin dashboard</div>
          <div className="calma-ad-subtitle">Sales history</div>
        </div>
        <button onClick={onLogout} className="calma-ad-btn muted">
          <LogOut size={14} />
          Logout
        </button>
      </div>

      {/* Summary Cards */}
      <div className="calma-summary-grid">
        <div className="calma-summary-card">
          <DollarSign size={22} color="#C6A265" style={{ marginBottom: 8 }} />
          <div className="calma-summary-value">{peso(grandTotal)}</div>
          <div className="calma-summary-label">Total sales</div>
        </div>
        <div className="calma-summary-card">
          <ShoppingBag size={22} color="#C6A265" style={{ marginBottom: 8 }} />
          <div className="calma-summary-value">{orderHistory.length}</div>
          <div className="calma-summary-label">Total orders</div>
        </div>
        <div className="calma-summary-card">
          <Calendar size={22} color="#C6A265" style={{ marginBottom: 8 }} />
          <div className="calma-summary-value">{dailyTotals.length}</div>
          <div className="calma-summary-label">Days active</div>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div style={{ padding: "0 24px 16px", maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "space-between" }}>
        <div className="calma-search-wrap">
          <Search size={14} color="#8A7554" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="calma-search-input"
          />
        </div>

        <button onClick={exportToExcel} className="calma-ad-btn">
          <Download size={14} />
          <span>Export Excel</span>
        </button>
      </div>

      {/* Sound Toggle */}
      <div style={{ padding: "0 24px 8px", maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`calma-ad-btn ${soundEnabled ? "" : "muted"}`}
          style={{ fontSize: 11, padding: "6px 12px", minHeight: 32 }}
          title={soundEnabled ? "Sound notifications on" : "Sound notifications off"}
        >
          {soundEnabled ? <BellRing size={13} /> : <BellOff size={13} />}
          {soundEnabled ? "Sound on" : "Sound off"}
        </button>
      </div>

      {/* Select All / Delete Selected Bar */}
      {filteredOrderHistory.length > 0 && (
        <div style={{ padding: "0 24px 16px", maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <button onClick={allSelected ? deselectAll : selectAll} className="calma-ad-btn">
            {allSelected ? <CheckSquare size={14} /> : <Square size={14} />}
            {allSelected ? "Deselect all" : "Select all"}
          </button>
          {selectedOrders.size > 0 && (
            <button onClick={deleteSelected} className="calma-ad-btn danger">
              <Trash2 size={14} />
              Delete selected ({selectedOrders.size})
            </button>
          )}
          <span style={{ fontSize: 12, color: "#8A7554", marginLeft: "auto" }}>
            {filteredOrderHistory.length} order{filteredOrderHistory.length !== 1 ? "s" : ""} found
          </span>
        </div>
      )}

      {/* Daily Sales */}
      <div style={{ padding: "0 24px 32px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, marginBottom: 16, color: "#F2EAD9" }}>
          Daily sales
        </div>

        {paginatedDailyTotals.length === 0 ? (
          <div style={{ background: "#100A06", border: "1px dashed rgba(198,162,101,0.3)", borderRadius: 12, padding: "40px", textAlign: "center", color: "#8A7554" }}>
            {searchQuery ? "No orders match your search." : "No sales yet. Orders will appear here once customers start ordering."}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {paginatedDailyTotals.map((day) => (
              <div key={day.date} className="calma-day-card">
                {/* Day Header */}
                <div className="calma-day-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Calendar size={16} color="#C6A265" />
                    <span style={{ fontWeight: 600, fontSize: 15, color: "#F2EAD9" }}>{day.date}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13 }}>
                    <span style={{ color: "#8A7554" }}>{day.orders.length} orders</span>
                    <span style={{ fontFamily: "'Montserrat', sans-serif", color: "#C6A265", fontWeight: 700 }}>
                      {peso(day.totalSales)}
                    </span>
                  </div>
                </div>

                {/* Orders List */}
                <div style={{ padding: "16px 20px" }}>
                  {day.orders.map((order) => (
                    <div key={order.id} className="calma-order-row">
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <button onClick={() => toggleSelect(order.id)} className="calma-check-btn">
                          {selectedOrders.has(order.id) ? <CheckSquare size={16} /> : <Square size={16} color="#8A7554" />}
                        </button>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flex: 1, paddingRight: 20, flexWrap: "wrap", gap: 6 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#8A7554" }}>
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
                                className="calma-edit-input"
                                autoFocus
                              />
                            ) : (
                              order.customerName && (
                                <span style={{ fontSize: 11, color: "#C6A265", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                                  <User size={11} />
                                  {order.customerName}
                                </span>
                              )
                            )}
                            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 700, color: "#F2EAD9" }}>
                              Order #{order.orderNo}
                            </span>
                          </div>
                        </div>
                      </div>
                      {order.items.map((item) => (
                        <div key={item.key} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#C9BB9E", marginBottom: 2, paddingLeft: 34 }}>
                          <span>{item.qty}× {item.name} ({item.size})</span>
                          <span>{peso(item.price * item.qty)}</span>
                        </div>
                      ))}
                      {/* Order Notes */}
                      {order.notes && (
                        <div style={{ marginTop: 8, marginBottom: 4, marginLeft: 34, padding: "8px 10px", background: "rgba(198,162,101,0.06)", borderRadius: 6, borderLeft: "3px solid #C6A265" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                            <FileText size={11} color="#C6A265" />
                            <span style={{ fontSize: 10, fontFamily: "'Montserrat', sans-serif", textTransform: "uppercase", letterSpacing: 1, color: "#8A7554" }}>Notes</span>
                          </div>
                          <div style={{ fontSize: 13, color: "#F2EAD9", fontStyle: "italic" }}>{order.notes}</div>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12, color: "#8A7554", paddingLeft: 34 }}>
                        <span>Paid via {PAYMENTS.find((p) => p.id === order.payment)?.label}</span>
                        <span style={{ fontWeight: 700, color: "#F2EAD9" }}>{peso(order.total)}</span>
                      </div>
                      {/* Edit & Delete Buttons */}
                      <div style={{ display: "flex", gap: 8, marginTop: 8, paddingLeft: 34 }}>
                        {editingOrder === order.id ? (
                          <>
                            <button onClick={() => saveEdit(order.id)} className="calma-mini-btn gold-fill">
                              Save
                            </button>
                            <button onClick={cancelEdit} className="calma-mini-btn neutral">
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(order)} className="calma-mini-btn gold">
                              <Pencil size={12} />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm("Delete this order? This cannot be undone.")) {
                                  onDeleteOrder(order.id);
                                }
                              }}
                              className="calma-mini-btn danger"
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
                <div className="calma-day-footer">
                  <span style={{ fontSize: 12, color: "#8A7554" }}>{day.itemCount} items sold</span>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, color: "#F2EAD9" }}>
                    Day total: {peso(day.totalSales)}
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
              className="calma-page-btn"
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: 13, color: "#8A7554" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="calma-page-btn"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}