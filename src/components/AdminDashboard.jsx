import React from "react";
import { ArrowLeft, Calendar, DollarSign, ShoppingBag, Clock, Trash2, X, User } from "lucide-react";
import { peso } from "../utils/format";
import { PAYMENTS } from "../data/payments";

export default function AdminDashboard({ dailyTotals, grandTotal, orderHistory, onDeleteOrder, onClearHistory, onBack }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F2E9",
        fontFamily: "'Public Sans', sans-serif",
        color: "#2B1B12",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#2B1B12",
          color: "#F7F2E9",
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
              color: "#D8A15C",
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
            <div style={{ fontSize: 11, color: "#C6B49A", letterSpacing: 1.5, textTransform: "uppercase" }}>
              Sales History
            </div>
          </div>
        </div>
        {orderHistory.length > 0 && (
          <button
            onClick={onClearHistory}
            className="cos-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "transparent",
              border: "1px solid #C08A5A",
              color: "#C08A5A",
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            <Trash2 size={14} />
            Clear All
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 900, margin: "0 auto" }}>
        <div style={{ background: "#FFFDF9", border: "1px solid #E7DCC7", borderRadius: 12, padding: "20px", textAlign: "center" }}>
          <DollarSign size={24} color="#B8763E" style={{ marginBottom: 8 }} />
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700 }}>{peso(grandTotal)}</div>
          <div style={{ fontSize: 12, color: "#9A8770", marginTop: 4 }}>Total Sales</div>
        </div>
        <div style={{ background: "#FFFDF9", border: "1px solid #E7DCC7", borderRadius: 12, padding: "20px", textAlign: "center" }}>
          <ShoppingBag size={24} color="#B8763E" style={{ marginBottom: 8 }} />
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700 }}>{orderHistory.length}</div>
          <div style={{ fontSize: 12, color: "#9A8770", marginTop: 4 }}>Total Orders</div>
        </div>
        <div style={{ background: "#FFFDF9", border: "1px solid #E7DCC7", borderRadius: 12, padding: "20px", textAlign: "center" }}>
          <Calendar size={24} color="#B8763E" style={{ marginBottom: 8 }} />
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700 }}>{dailyTotals.length}</div>
          <div style={{ fontSize: 12, color: "#9A8770", marginTop: 4 }}>Days Active</div>
        </div>
      </div>

      {/* Daily Sales */}
      <div style={{ padding: "0 24px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          Daily Sales
        </div>

        {dailyTotals.length === 0 ? (
          <div style={{ background: "#FFFDF9", border: "1px dashed #D8C9AF", borderRadius: 12, padding: "40px", textAlign: "center", color: "#9A8770" }}>
            No sales yet. Orders will appear here once customers start ordering.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {dailyTotals.map((day) => (
              <div key={day.date} style={{ background: "#FFFDF9", border: "1px solid #E7DCC7", borderRadius: 12, overflow: "hidden" }}>
                {/* Day Header */}
                <div
                  style={{
                    background: "#2B1B12",
                    color: "#F7F2E9",
                    padding: "14px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Calendar size={16} color="#D8A15C" />
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{day.date}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13 }}>
                    <span>{day.orders.length} orders</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", color: "#D8A15C", fontWeight: 700 }}>
                      {peso(day.totalSales)}
                    </span>
                  </div>
                </div>

                {/* Orders List */}
                <div style={{ padding: "16px 20px" }}>
                  {day.orders.map((order) => (
                    <div
                      key={order.timestamp}
                      style={{
                        borderBottom: "1px dashed #EEE3CF",
                        padding: "12px 0",
                        position: "relative",
                      }}
                    >
                      <button
                        onClick={() => onDeleteOrder(order.timestamp)}
                        className="cos-btn"
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 0,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#C08A5A",
                          padding: 2,
                        }}
                      >
                        <X size={14} />
                      </button>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, paddingRight: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#7A6650" }}>
                          <Clock size={12} />
                          {order.time}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {order.customerName && (
                            <span style={{ fontSize: 11, color: "#B8763E", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                              <User size={11} />
                              {order.customerName}
                            </span>
                          )}
                          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700 }}>
                            Order #{order.orderNo}
                          </span>
                        </div>
                      </div>
                      {order.items.map((item) => (
                        <div key={item.key} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#5C4A38", marginBottom: 2 }}>
                          <span>{item.qty}× {item.name} ({item.size})</span>
                          <span>{peso(item.price * item.qty)}</span>
                        </div>
                      ))}
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12, color: "#9A8770" }}>
                        <span>Paid via {PAYMENTS.find((p) => p.id === order.payment)?.label}</span>
                        <span style={{ fontWeight: 700, color: "#2B1B12" }}>{peso(order.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Day Footer */}
                <div
                  style={{
                    background: "#FBF7EE",
                    padding: "12px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid #E7DCC7",
                  }}
                >
                  <span style={{ fontSize: 12, color: "#7A6650" }}>{day.itemCount} items sold</span>
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