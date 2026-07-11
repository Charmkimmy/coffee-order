import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Smartphone, Copy, CheckCircle, Camera, ShieldCheck, AlertCircle, Download } from "lucide-react";
import { peso } from "../utils/format";

const OWNER_PHONE = "09493008592";
const OWNER_NAME = "ALLAN SEPNO";

export default function PayMayaModal({ total, onClose, onConfirmPayment }) {
  const [copied, setCopied] = useState(false);
  const [referenceNo, setReferenceNo] = useState("");
  const [step, setStep] = useState("pay");

  const handleCopy = () => {
    navigator.clipboard.writeText(OWNER_PHONE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveQR = () => {
    const link = document.createElement("a");
    link.href = "/QR.jpg";
    link.download = "instapay-qr-allan-sepno.jpg";
    link.click();
  };

  const handlePaidClick = () => {
    setStep("verify");
  };

  const handleVerify = () => {
    if (!referenceNo.trim()) return;
    setStep("confirmed");
    setTimeout(() => {
      onConfirmPayment({ referenceNo: referenceNo.trim() });
    }, 1500);
  };

  const handleBackToPay = () => {
    setStep("pay");
    setReferenceNo("");
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
        .calma-maya-qr-wrap {
          background: #ffffff;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        .calma-maya-qr {
          width: 220px;
          height: 220px;
          object-fit: contain;
        }
        .calma-maya-qr-hint {
          font-size: 11px;
          color: #5C4E3C;
          font-family: 'Montserrat', sans-serif;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .calma-save-qr-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 6px;
          border: 1px solid rgba(198,162,101,0.3);
          background: rgba(198,162,101,0.06);
          color: #C6A265;
          font-size: 11px;
          font-family: 'Montserrat', sans-serif;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .calma-save-qr-btn:active { background: rgba(198,162,101,0.12); }
        .calma-ref-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 8px;
          border: 1px solid rgba(198,162,101,0.25);
          background: rgba(198,162,101,0.06);
          color: #F2EAD9;
          font-size: 16px;
          font-family: 'Montserrat', sans-serif;
          outline: none;
          text-align: center;
          letter-spacing: 2px;
        }
        .calma-ref-input::placeholder { color: #5C4E3C; letter-spacing: normal; }
        .calma-ref-input:focus { border-color: #C6A265; }
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
        .calma-maya-btn {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          border: none;
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
        .calma-maya-btn.primary {
          background: #4FBF3F;
          color: #0B0805;
        }
        .calma-maya-btn.primary:active { background: #45a838; }
        .calma-maya-btn.primary:disabled {
          background: rgba(79,191,63,0.2);
          color: #5C4E3C;
          cursor: not-allowed;
        }
        .calma-maya-btn.secondary {
          background: transparent;
          border: 1px solid rgba(198,162,101,0.3);
          color: #C6A265;
        }
        .calma-maya-btn.secondary:active { background: rgba(198,162,101,0.1); }
        .calma-verify-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 8px;
          background: rgba(198,162,101,0.08);
          border: 1px solid rgba(198,162,101,0.2);
          margin-bottom: 16px;
        }
      `}</style>

      <div className="calma-maya-card">
        <button onClick={onClose} className="calma-maya-close">
          <X size={20} />
        </button>

        {step === "pay" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "#4FBF3F",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 12px",
              }}>
                <Smartphone size={28} color="#0B0805" />
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#F2EAD9" }}>
                Scan to pay
              </div>
              <div style={{ fontSize: 13, color: "#8A7554", marginTop: 4, fontFamily: "'Montserrat', sans-serif" }}>
                Works with Maya, GCash, BPI, and any bank app
              </div>
            </div>

            <div className="calma-maya-qr-wrap">
              <img
                src="/QR.jpg"
                alt="InstaPay QR Code"
                className="calma-maya-qr"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div className="calma-maya-qr-hint">
                <Camera size={12} />
                Open your camera or bank app to scan
              </div>
              <button onClick={handleSaveQR} className="calma-save-qr-btn cos-btn">
                <Download size={12} />
                Save QR to gallery
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(198,162,101,0.2)" }}></div>
              <span style={{ fontSize: 11, color: "#8A7554", textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Montserrat', sans-serif" }}>or send to</span>
              <div style={{ flex: 1, height: 1, background: "rgba(198,162,101,0.2)" }}></div>
            </div>

            <div style={{
              background: "rgba(198,162,101,0.04)",
              border: "1px solid rgba(198,162,101,0.18)",
              borderRadius: 10,
              padding: "16px",
              textAlign: "center",
              marginBottom: 20,
            }}>
              <div style={{ fontSize: 11, color: "#8A7554", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Montserrat', sans-serif" }}>
                Send to number
              </div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 700, color: "#F2EAD9", marginBottom: 4 }}>
                {OWNER_PHONE}
              </div>
              <div style={{ fontSize: 12, color: "#8A7554", fontFamily: "'Montserrat', sans-serif" }}>{OWNER_NAME}</div>
              <button onClick={handleCopy} className={`calma-maya-copy cos-btn ${copied ? "copied" : "idle"}`}>
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy number"}
              </button>
            </div>

            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "#0B0805", border: "1px solid rgba(198,162,101,0.25)",
              color: "#F2EAD9", padding: "14px 18px", borderRadius: 10, marginBottom: 16,
            }}>
              <span style={{ fontSize: 13, fontFamily: "'Montserrat', sans-serif" }}>Amount to pay</span>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 20, fontWeight: 700, color: "#C6A265" }}>
                {peso(total)}
              </span>
            </div>

            <button onClick={handlePaidClick} className="calma-maya-btn primary cos-btn">
              <CheckCircle size={18} />
              I've already paid
            </button>
          </>
        )}

        {step === "verify" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "rgba(198,162,101,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 12px",
              }}>
                <ShieldCheck size={28} color="#C6A265" />
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#F2EAD9" }}>
                Verify payment
              </div>
              <div style={{ fontSize: 13, color: "#8A7554", marginTop: 4, fontFamily: "'Montserrat', sans-serif" }}>
                Enter reference number from your bank app
              </div>
            </div>

            <div className="calma-verify-badge">
              <AlertCircle size={16} color="#C6A265" />
              <div style={{ fontSize: 12, color: "#C9BB9E", lineHeight: 1.5 }}>
                Amount: <strong style={{ color: "#F2EAD9" }}>{peso(total)}</strong> to <strong style={{ color: "#F2EAD9" }}>{OWNER_NAME}</strong>
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: "#8A7554", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Montserrat', sans-serif" }}>
                InstaPay reference number
              </div>
              <input
                type="text"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value.replace(/\D/g, "").slice(0, 12))}
                placeholder="e.g. 123456789012"
                className="calma-ref-input"
                autoFocus
              />
              <div style={{ fontSize: 11, color: "#5C4E3C", marginTop: 6, fontFamily: "'Montserrat', sans-serif" }}>
                Find this in your bank app after sending. Usually 10–12 digits.
              </div>
            </div>

            <button 
              onClick={handleVerify} 
              disabled={referenceNo.length < 6}
              className="calma-maya-btn primary cos-btn"
              style={{ marginBottom: 10 }}
            >
              <ShieldCheck size={18} />
              Verify & confirm
            </button>

            <button onClick={handleBackToPay} className="calma-maya-btn secondary cos-btn">
              Back to QR
            </button>
          </>
        )}

        {step === "confirmed" && (
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
              Payment verified
            </div>
            <div style={{ fontSize: 13, color: "#8A7554", marginTop: 6, fontFamily: "'Montserrat', sans-serif" }}>
              Ref: {referenceNo}
            </div>
            <div style={{ fontSize: 13, color: "#8A7554", marginTop: 4, fontFamily: "'Montserrat', sans-serif" }}>
              Processing your order...
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}