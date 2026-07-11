import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Smartphone, Copy, CheckCircle } from "lucide-react";
import { peso } from "../utils/format";

const OWNER_MAYA_NUMBER = "09493008592";
const OWNER_MAYA_NAME = "ALLAN SEPNO";

export default function PayMayaModal({ total, onClose, onConfirmPayment }) {
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(OWNER_MAYA_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      onConfirmPayment();
    }, 1500);
  };

  return createPortal(
    <div className="calma-maya-overlay">
      <style>{`
        .calma-maya-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: max(24px, env(safe-area-inset-top)) 24px max(24px, env(safe-area-inset-bottom));
        }

        .calma-maya-card {
          background: #100A06;
          border: 1px solid rgba(198,162,101,0.2);
          border-radius: 16px;
          max-width: 380px;
          width: 100%;
          max-height: calc(100dvh - 48px);
          overflow-y: auto;
          padding: 28px;
          position: relative;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }

        .calma-maya-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          color: #8A7554;
          padding: 6px;
          -webkit-tap-highlight-color: transparent;
        }
        .calma-maya-close:active { color: #C6A265; }

        .calma-maya-qr {
          width: 180px;
          height: 180px;
          object-fit: contain;
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .calma-maya-copy {
          margin-top: 10px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          -webkit-tap-highlight-color: transparent;
          min-height: 36px;
        }
        .calma-maya-copy.copied {
          background: rgba(127,174,104,0.12);
          border: 1px solid #7FAE68;
          color: #7FAE68;
        }
        .calma-maya-copy.idle {
          background: rgba(198,162,101,0.06);
          border: 1px solid rgba(198,162,101,0.3);
          color: #C9BB9E;
        }

        .calma-maya-confirm {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          border: none;
          background: #4FBF3F;
          color: #0B0805;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 48px;
          -webkit-tap-highlight-color: transparent;
        }
        .calma-maya-confirm:active { background: #45a838; }
      `}</style>

      <div className="calma-maya-card">
        {/* Close button */}
        <button onClick={onClose} className="calma-maya-close">
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
                  background: "#4FBF3F",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                }}
              >
                <Smartphone size={28} color="#0B0805" />
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#F2EAD9" }}>
                Maya payment
              </div>
              <div style={{ fontSize: 13, color: "#8A7554", marginTop: 4, fontFamily: "'Montserrat', sans-serif" }}>
                Scan QR or send to number
              </div>
            </div>

            {/* QR Code Image */}
            <div
              style={{
                background: "rgba(198,162,101,0.05)",
                border: "1.5px dashed rgba(198,162,101,0.35)",
                borderRadius: 12,
                padding: "24px",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              <img
                src="/QR.jpg"
                alt="Maya QR Code"
                className="calma-maya-qr"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
              <div style={{ fontSize: 12, color: "#8A7554", fontFamily: "'Montserrat', sans-serif", display: "none" }}>
                QR code not available
              </div>
            </div>

            {/* OR Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(198,162,101,0.2)" }}></div>
              <span style={{ fontSize: 11, color: "#8A7554", textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Montserrat', sans-serif" }}>or</span>
              <div style={{ flex: 1, height: 1, background: "rgba(198,162,101,0.2)" }}></div>
            </div>

            {/* Maya Number */}
            <div
              style={{
                background: "rgba(198,162,101,0.04)",
                border: "1px solid rgba(198,162,101,0.18)",
                borderRadius: 10,
                padding: "16px",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 11, color: "#8A7554", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Montserrat', sans-serif" }}>
                Send to Maya number
              </div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 700, color: "#F2EAD9", marginBottom: 4 }}>
                {OWNER_MAYA_NUMBER}
              </div>
              <div style={{ fontSize: 12, color: "#8A7554", fontFamily: "'Montserrat', sans-serif" }}>{OWNER_MAYA_NAME}</div>
              <button onClick={handleCopy} className={`calma-maya-copy cos-btn ${copied ? "copied" : "idle"}`}>
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy number"}
              </button>
            </div>

            {/* Amount */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#0B0805",
                border: "1px solid rgba(198,162,101,0.25)",
                color: "#F2EAD9",
                padding: "14px 18px",
                borderRadius: 10,
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 13, fontFamily: "'Montserrat', sans-serif" }}>Amount to pay</span>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 20, fontWeight: 700, color: "#C6A265" }}>
                {peso(total)}
              </span>
            </div>

            {/* Confirm Button */}
            <button onClick={handleConfirm} className="calma-maya-confirm cos-btn">
              <CheckCircle size={18} />
              I've paid via Maya
            </button>
            <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "#5C4E3C", fontFamily: "'Montserrat', sans-serif" }}>
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
                background: "rgba(127,174,104,0.12)",
                border: "1px solid rgba(127,174,104,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <CheckCircle size={32} color="#7FAE68" />
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#F2EAD9" }}>
              Payment confirmed
            </div>
            <div style={{ fontSize: 13, color: "#8A7554", marginTop: 6, fontFamily: "'Montserrat', sans-serif" }}>
              Processing your order...
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}