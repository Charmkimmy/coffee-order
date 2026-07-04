import React, { useState } from "react";
import { X, Smartphone, Copy, CheckCircle, QrCode } from "lucide-react";
import { peso } from "../utils/format";

const OWNER_GCASH_NUMBER = "0968-304-5499"; 
const OWNER_GCASH_NAME = "REALYN RILE"; 
export default function GCashModal({ total, onClose, onConfirmPayment }) {
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(OWNER_GCASH_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      onConfirmPayment();
    }, 1500);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(43, 27, 18, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "#FFFDF9",
          borderRadius: 16,
          maxWidth: 380,
          width: "100%",
          padding: "28px",
          position: "relative",
          boxShadow: "0 20px 60px rgba(43, 27, 18, 0.3)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#9A8770",
            padding: 4,
          }}
        >
          <X size={20} />
        </button>

        {!confirmed ? (
          <>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "#0070E0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                }}
              >
                <Smartphone size={28} color="#FFF" />
              </div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: "#2B1B12" }}>
                GCash Payment
              </div>
              <div style={{ fontSize: 13, color: "#9A8770", marginTop: 4 }}>
                Scan QR or send to number
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div
              style={{
                background: "#F7F2E9",
                border: "2px dashed #D8C9AF",
                borderRadius: 12,
                padding: "32px",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              <QrCode size={80} color="#B8763E" style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 12, color: "#9A8770", fontFamily: "'Space Mono', monospace" }}>
                [Owner's GCash QR]
              </div>
              <div style={{ fontSize: 11, color: "#B0A088", marginTop: 8 }}>
               
              </div>
            </div>

            {/* OR Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: "#E7DCC7" }}></div>
              <span style={{ fontSize: 11, color: "#9A8770", textTransform: "uppercase", letterSpacing: 1 }}>or</span>
              <div style={{ flex: 1, height: 1, background: "#E7DCC7" }}></div>
            </div>

            {/* GCash Number */}
            <div
              style={{
                background: "#FBF7EE",
                border: "1px solid #E7DCC7",
                borderRadius: 10,
                padding: "16px",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 11, color: "#9A8770", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>
                Send to GCash Number
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700, color: "#2B1B12", marginBottom: 4 }}>
                {OWNER_GCASH_NUMBER}
              </div>
              <div style={{ fontSize: 12, color: "#7A6650" }}>{OWNER_GCASH_NAME}</div>
              <button
                onClick={handleCopy}
                style={{
                  marginTop: 10,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: copied ? "#EAF3E6" : "#FFF",
                  border: copied ? "1px solid #4C7A3D" : "1px solid #D8C9AF",
                  color: copied ? "#4C7A3D" : "#7A6650",
                  padding: "6px 14px",
                  borderRadius: 6,
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "'Public Sans', sans-serif",
                }}
              >
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy Number"}
              </button>
            </div>

            {/* Amount */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#2B1B12",
                color: "#F7F2E9",
                padding: "14px 18px",
                borderRadius: 10,
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 13 }}>Amount to Pay</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, fontWeight: 700, color: "#D8A15C" }}>
                {peso(total)}
              </span>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              className="cos-btn"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 10,
                border: "none",
                background: "#0070E0",
                color: "#FFF",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <CheckCircle size={18} />
              I've Paid via GCash
            </button>
            <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "#B0A088" }}>
              Tap confirm after sending payment
            </div>
          </>
        ) : (
          /* Success State */
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#EAF3E6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <CheckCircle size={32} color="#4C7A3D" />
            </div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: "#2B1B12" }}>
              Payment Confirmed
            </div>
            <div style={{ fontSize: 13, color: "#9A8770", marginTop: 6 }}>
              Processing your order...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}