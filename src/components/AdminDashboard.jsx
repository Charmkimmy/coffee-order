import React, { useState } from "react";
import { ArrowLeft, Calendar, DollarSign, ShoppingBag, Clock, Trash2, User, Pencil, CheckSquare, Square, X } from "lucide-react";
import { peso } from "../utils/format";
import { PAYMENTS } from "../data/payments";

export default function AdminDashboard({ dailyTotals, grandTotal, orderHistory, onDeleteOrder, onBack, onEditOrder }) {
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [editingOrder, setEditingOrder] = useState(null);
  const [editCustomerName, setEditCustomerName] = useState("");

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
    const allIds = new Set(orderHistory.map((o) => o.id));
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

  const allSelected = selectedOrders.size === orderHistory.length && orderHistory.length > 0;

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
          <button
            onClick={onBack}
            className="cos-btn"
            style={{
              background: "none",
              border: "none",
              color: "#A1887F",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: 4,
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 600 }}>
              Admin Dashboard
            </div>
            <div style={{ fontSize: 11, color: "#A1887F", letterSpacing: 1.5, textTransform: "uppercase" }}>
              Sales History
            </div>
          </div>
        </div>
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

      {/* Select All / Delete Selected Bar */}
      {orderHistory.length > 0 && (
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
        </div>
      )}

      {/* Daily Sales */}
      <div style={{ padding: "0 24px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          Daily Sales
        </div>

        {dailyTotals.length === 0 ? (
          <div style={{ background: "#FFFDF9", border: "1px dashed #D7CCC8", borderRadius: 12, padding: "40px", textAlign: "center", color: "#A1887F" }}>
            No sales yet. Orders will appear here once customers start ordering.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {dailyTotals.map((day) => (
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
      </div>
    </div>
  );
}