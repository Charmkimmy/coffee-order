import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Smartphone, Copy, CheckCircle, ExternalLink } from "lucide-react";
import { peso } from "../utils/format";

const OWNER_MAYA_NUMBER = "09493008592";
const OWNER_MAYA_NAME = "ALLAN SEPNO";

export default function PayMayaModal({ total, orderNo, onClose, onConfirmPayment }) {
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [openedApp, setOpenedApp] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(OWNER_MAYA_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Try to open Maya app directly
  const handleOpenMaya = () => {
    // Copy number first so they have it
    navigator.clipboard.writeText(OWNER_MAYA_NUMBER);
    
    // Try Maya app deep link (works on mobile if app installed)
    const mayaUrl = `mayabank://sendmoney?recipient=${OWNER_MAYA_NUMBER}&amount=${total}`;
    window.location.href = mayaUrl;
    
    // Fallback: open Maya web after 2 seconds if app not installed
    setTimeout(() => {
      window.open(`https://maya.ph`, '_blank');
    }, 2000);
    
    setOpenedApp(true);
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
          top: 0; left: 0; right: 0; bottom: 0;
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
          top: 16px; right: 16px;
          background: none; border: none;
          cursor: pointer;
          color: #8A7554;
          padding: 6px;
          -webkit-tap-highlight-color: transparent;
        }
        .calma-maya-close:active { color: #C6A265; }
        .calma-maya-open-app {
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
          margin-bottom: 12px;
          -webkit-tap-highlight-color: transparent;
        }
        .calma-maya-open-app:active { background: #45a838; }
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
          background: #C6A265;
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
        .calma-maya-confirm:active { background: #d6b578; }
        .calma-maya-confirm:disabled {
          background: rgba(198,162,101,0.2);
          color: #5C4E3C;
          cursor: not-allowed;
        }
        .calma-maya-step {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(198,162,101,0.12);
        }
        .calma-maya-step-num {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(198,162,101,0.15);
          color: #C6A265;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
        }
      `}</style>

      <div className="calma-maya-card">
        <button onClick={onClose} className="calma-maya-close">
          <X size={20} />
        </button>

        {!confirmed ? (
          <>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "#4FBF3F",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 12px",
              }}>
                <Smartphone size={28} color="#0B0805" />
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#F2EAD9" }}>
                Maya payment
              </div>
              <div style={{ fontSize: 13, color: "#8A7554", marginTop: 4, fontFamily: "'Montserrat', sans-serif" }}>
                {openedApp ? "Complete payment in the Maya app" : "Open Maya and send payment"}
              </div>
            </div>

            {/* Steps */}
            <div style={{ marginBottom: 20 }}>
              <div className="calma-maya-step">
                <div className="calma-maya-step-num">1</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#F2EAD9" }}>Tap button to open Maya</div>
                  <div style={{ fontSize: 12, color: "#8A7554", marginTop: 2 }}>Number will be copied automatically</div>
                </div>
              </div>
              <div className="calma-maya-step">
                <div className="calma-maya-step-num">2</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#F2EAD9" }}>Send {peso(total)} to {OWNER_MAYA_NUMBER}</div>
                  <div style={{ fontSize: 12, color: "#8A7554", marginTop: 2 }}>Name: {OWNER_MAYA_NAME}</div>
                </div>
              </div>
              <div className="calma-maya-step" style={{ borderBottom: "none" }}>
                <div className="calma-maya-step-num">3</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#F2EAD9" }}>Return here and confirm</div>
                  <div style={{ fontSize: 12, color: "#8A7554", marginTop: 2 }}>We'll process your order</div>
                </div>
              </div>
            </div>

            {/* Open Maya App Button */}
            <button onClick={handleOpenMaya} className="calma-maya-open-app cos-btn">
              <ExternalLink size={18} />
              {openedApp ? "Reopen Maya App" : "Open Maya App"}
            </button>

            {/* OR Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(198,162,101,0.2)" }}></div>
              <span style={{ fontSize: 11, color: "#8A7554", textTransform: "uppercase", letterSpacing: 1 }}>or copy number</span>
              <div style={{ flex: 1, height: 1, background: "rgba(198,162,101,0.2)" }}></div>
            </div>

            {/* Number + Copy */}
            <div style={{
              background: "rgba(198,162,101,0.04)",
              border: "1px solid rgba(198,162,101,0.18)",
              borderRadius: 10,
              padding: "16px",
              textAlign: "center",
              marginBottom: 20,
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#F2EAD9", fontFamily: "'Montserrat', sans-serif" }}>
                {OWNER_MAYA_NUMBER}
              </div>
              <div style={{ fontSize: 12, color: "#8A7554", marginTop: 4 }}>{OWNER_MAYA_NAME}</div>
              <button onClick={handleCopy} className={`calma-maya-copy cos-btn ${copied ? "copied" : "idle"}`}>
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy number"}
              </button>
            </div>

            {/* Amount */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "#0B0805", border: "1px solid rgba(198,162,101,0.25)",
              color: "#F2EAD9", padding: "14px 18px", borderRadius: 10, marginBottom: 16,
            }}>
              <span style={{ fontSize: 13 }}>Amount to pay</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#C6A265" }}>{peso(total)}</span>
            </div>

            {/* Confirm Button */}
            <button 
              onClick={handleConfirm} 
              className="calma-maya-confirm cos-btn"
            >
              <CheckCircle size={18} />
              I've paid via Maya
            </button>
            <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "#5C4E3C" }}>
              {openedApp ? "Tap after completing payment in Maya" : "Open Maya first, then confirm here"}
            </div>
          </>
        ) : (
          /* Success State */
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "rgba(127,174,104,0.12)",
              border: "1px solid rgba(127,174,104,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <CheckCircle size={32} color="#7FAE68" />
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#F2EAD9" }}>
              Payment confirmed
            </div>
            <div style={{ fontSize: 13, color: "#8A7554", marginTop: 6 }}>
              Processing your order...
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}