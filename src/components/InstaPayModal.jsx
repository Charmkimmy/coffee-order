import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Smartphone, Copy, CheckCircle, Camera, ShieldCheck, AlertCircle, Download, Upload, Ban } from "lucide-react";
import { peso } from "../utils/format";

const OWNER_PHONE = "09493008592";
const OWNER_NAME = "ALLAN SEPNO";

export default function PayMayaModal({ 
  total, 
  onClose, 
  onConfirmPayment,
  onCancelOrder,
  orderStatus,
  existingReferenceNo,
}) {
  const [copied, setCopied] = useState(false);
  const [referenceNo, setReferenceNo] = useState(existingReferenceNo || "");
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [step, setStep] = useState(orderStatus === "rejected" ? "verify" : "pay");
  const fileInputRef = useRef(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Max 5MB");
      return;
    }

    setScreenshot(file);
    
    const reader = new FileReader();
    reader.onload = (e) => setScreenshotPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePaidClick = () => {
    setStep("verify");
  };

  const handleVerify = () => {
    if (!referenceNo.trim() || !screenshot) return;
    setStep("confirmed");
    setTimeout(() => {
      onConfirmPayment({ 
        referenceNo: referenceNo.trim(),
        screenshot: screenshot,
        screenshotPreview: screenshotPreview,
        isResubmit: orderStatus === "rejected",
      });
    }, 1500);
  };

  const handleBackToPay = () => {
    setStep("pay");
    setReferenceNo("");
    handleRemoveScreenshot();
  };

  const handleCancelOrder = () => {
    if (!window.confirm("Cancel this order? This cannot be undone.")) return;
    onCancelOrder?.();
  };

  return createPortal(
    <div className="beanito-modal-overlay">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');

        .beanito-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: max(24px, env(safe-area-inset-top)) 24px max(24px, env(safe-area-inset-bottom));
        }
        .beanito-modal-card {
          background: #141414;
          border: 1px solid rgba(245,230,200,0.15);
          border-radius: 16px;
          max-width: 380px;
          width: 100%;
          max-height: calc(100dvh - 48px);
          overflow-y: auto;
          padding: 28px;
          position: relative;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .beanito-modal-close {
          position: absolute;
          top: 16px; right: 16px;
          background: none; border: none;
          cursor: pointer;
          color: #8B7355;
          padding: 6px;
          -webkit-tap-highlight-color: transparent;
        }
        .beanito-modal-close:active { color: #D4A574; }
        .beanito-qr-wrap {
          background: #ffffff;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        .beanito-qr {
          width: 220px;
          height: 220px;
          object-fit: contain;
        }
        .beanito-qr-hint {
          font-size: 11px;
          color: #5C4E3C;
          font-family: 'Montserrat', sans-serif;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .beanito-save-qr-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 6px;
          border: 1px solid rgba(212,165,116,0.3);
          background: rgba(212,165,116,0.06);
          color: #D4A574;
          font-size: 11px;
          font-family: 'Montserrat', sans-serif;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .beanito-save-qr-btn:active { background: rgba(212,165,116,0.12); }
        .beanito-ref-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 8px;
          border: 1px solid rgba(245,230,200,0.2);
          background: rgba(245,230,200,0.06);
          color: #F5E6C8;
          font-size: 16px;
          font-family: 'Montserrat', sans-serif;
          outline: none;
          text-align: center;
          letter-spacing: 2px;
        }
        .beanito-ref-input::placeholder { color: #5C4E3C; letter-spacing: normal; }
        .beanito-ref-input:focus { border-color: #D4A574; }
        .beanito-upload-area {
          width: 100%;
          padding: 20px;
          border-radius: 10px;
          border: 2px dashed rgba(245,230,200,0.2);
          background: rgba(245,230,200,0.04);
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .beanito-upload-area:hover {
          border-color: #D4A574;
          background: rgba(212,165,116,0.08);
        }
        .beanito-upload-area.has-file {
          border-color: #4FBF3F;
          background: rgba(79,191,63,0.08);
        }
        .beanito-upload-preview {
          width: 100%;
          max-height: 200px;
          object-fit: contain;
          border-radius: 8px;
          margin-bottom: 10px;
        }
        .beanito-copy-btn {
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
        .beanito-copy-btn.copied {
          background: rgba(127,174,104,0.12);
          border: 1px solid #7FAE68;
          color: #7FAE68;
        }
        .beanito-copy-btn.idle {
          background: rgba(212,165,116,0.06);
          border: 1px solid rgba(212,165,116,0.3);
          color: #C9BB9E;
        }
        .beanito-modal-btn {
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
        .beanito-modal-btn.primary {
          background: #4FBF3F;
          color: #0D0D0D;
        }
        .beanito-modal-btn.primary:active { background: #45a838; }
        .beanito-modal-btn.primary:disabled {
          background: rgba(79,191,63,0.2);
          color: #5C4E3C;
          cursor: not-allowed;
        }
        .beanito-modal-btn.secondary {
          background: transparent;
          border: 1px solid rgba(245,230,200,0.2);
          color: #D4A574;
        }
        .beanito-modal-btn.secondary:active { background: rgba(212,165,116,0.1); }
        .beanito-modal-btn.danger {
          background: transparent;
          border: 1px solid rgba(220, 80, 80, 0.4);
          color: #DC5050;
          margin-top: 10px;
        }
        .beanito-modal-btn.danger:active { background: rgba(220, 80, 80, 0.1); }
        .beanito-verify-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 8px;
          background: rgba(212,165,116,0.08);
          border: 1px solid rgba(212,165,116,0.2);
          margin-bottom: 16px;
        }
        .beanito-rejection-banner {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 8px;
          background: rgba(220, 80, 80, 0.08);
          border: 1px solid rgba(220, 80, 80, 0.25);
          margin-bottom: 20px;
          font-size: 12px;
          color: #E8A0A0;
          line-height: 1.5;
        }
        .beanito-requirement-list {
          margin-bottom: 16px;
        }
        .beanito-requirement-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          font-size: 13px;
          color: #C9BB9E;
        }
        .beanito-requirement-item.met {
          color: #4FBF3F;
        }
        .beanito-mini-btn {
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
        .beanito-mini-btn.danger {
          border: 1px solid rgba(194,69,58,0.5);
          color: #d4776c;
        }
      `}</style>

      <div className="beanito-modal-card">
        <button onClick={onClose} className="beanito-modal-close">
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
                <Smartphone size={28} color="#0D0D0D" />
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#F5E6C8" }}>
                Scan to pay
              </div>
              <div style={{ fontSize: 13, color: "#8B7355", marginTop: 4, fontFamily: "'Montserrat', sans-serif" }}>
                Works with Maya, GCash, BPI, and any bank app
              </div>
            </div>

            <div className="beanito-qr-wrap">
              <img
                src="/QR.jpg"
                alt="InstaPay QR Code"
                className="beanito-qr"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div className="beanito-qr-hint">
                <Camera size={12} />
                Open your camera or bank app to scan
              </div>
              <button onClick={handleSaveQR} className="beanito-save-qr-btn cos-btn">
                <Download size={12} />
                Save QR to gallery
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(245,230,200,0.15)" }}></div>
              <span style={{ fontSize: 11, color: "#8B7355", textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Montserrat', sans-serif" }}>or send to</span>
              <div style={{ flex: 1, height: 1, background: "rgba(245,230,200,0.15)" }}></div>
            </div>

            <div style={{
              background: "rgba(245,230,200,0.04)",
              border: "1px solid rgba(245,230,200,0.15)",
              borderRadius: 10,
              padding: "16px",
              textAlign: "center",
              marginBottom: 20,
            }}>
              <div style={{ fontSize: 11, color: "#8B7355", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Montserrat', sans-serif" }}>
                Send to number
              </div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 700, color: "#F5E6C8", marginBottom: 4 }}>
                {OWNER_PHONE}
              </div>
              <div style={{ fontSize: 12, color: "#8B7355", fontFamily: "'Montserrat', sans-serif" }}>{OWNER_NAME}</div>
              <button onClick={handleCopy} className={`beanito-copy-btn cos-btn ${copied ? "copied" : "idle"}`}>
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy number"}
              </button>
            </div>

            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "#0D0D0D", border: "1px solid rgba(245,230,200,0.15)",
              color: "#F5E6C8", padding: "14px 18px", borderRadius: 10, marginBottom: 16,
            }}>
              <span style={{ fontSize: 13, fontFamily: "'Montserrat', sans-serif" }}>Amount to pay</span>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 20, fontWeight: 700, color: "#D4A574" }}>
                {peso(total)}
              </span>
            </div>

            <button onClick={handlePaidClick} className="beanito-modal-btn primary cos-btn">
              <CheckCircle size={18} />
              I've already paid
            </button>
          </>
        )}

        {step === "verify" && (
          <>
            {/* Rejection banner */}
            {orderStatus === "rejected" && (
              <div className="beanito-rejection-banner">
                <AlertCircle size={16} color="#DC5050" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong style={{ color: "#F5E6C8" }}>Payment proof rejected</strong>
                  <div>Your screenshot was invalid or unclear. Please upload a valid payment confirmation.</div>
                </div>
              </div>
            )}

            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "rgba(212,165,116,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 12px",
              }}>
                <ShieldCheck size={28} color="#D4A574" />
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#F5E6C8" }}>
                {orderStatus === "rejected" ? "Re-submit proof" : "Verify payment"}
              </div>
              <div style={{ fontSize: 13, color: "#8B7355", marginTop: 4, fontFamily: "'Montserrat', sans-serif" }}>
                {orderStatus === "rejected" 
                  ? "Upload a valid payment confirmation for re-verification" 
                  : "Upload proof of payment for verification"}
              </div>
            </div>

            <div className="beanito-verify-badge">
              <AlertCircle size={16} color="#D4A574" />
              <div style={{ fontSize: 12, color: "#C9BB9E", lineHeight: 1.5 }}>
                Amount: <strong style={{ color: "#F5E6C8" }}>{peso(total)}</strong> to <strong style={{ color: "#F5E6C8" }}>{OWNER_NAME}</strong>
              </div>
            </div>

            <div className="beanito-requirement-list">
              <div className={`beanito-requirement-item ${referenceNo.length >= 6 ? "met" : ""}`}>
                <CheckCircle size={14} />
                Reference number (6+ digits)
              </div>
              <div className={`beanito-requirement-item ${screenshot ? "met" : ""}`}>
                <CheckCircle size={14} />
                Screenshot of payment confirmation
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#8B7355", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Montserrat', sans-serif" }}>
                InstaPay reference number *
              </div>
              <input
                type="text"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value.replace(/\D/g, "").slice(0, 12))}
                placeholder="e.g. 123456789012"
                className="beanito-ref-input"
                autoFocus
              />
              <div style={{ fontSize: 11, color: "#5C4E3C", marginTop: 6, fontFamily: "'Montserrat', sans-serif" }}>
                Find this in your bank app after sending
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#8B7355", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Montserrat', sans-serif" }}>
                Payment screenshot *
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
              {!screenshotPreview ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="beanito-upload-area"
                >
                  <Upload size={24} color="#8B7355" style={{ marginBottom: 8 }} />
                  <div style={{ fontSize: 13, color: "#C9BB9E", marginBottom: 4 }}>
                    Tap to upload screenshot
                  </div>
                  <div style={{ fontSize: 11, color: "#5C4E3C" }}>
                    JPG, PNG · Max 5MB
                  </div>
                </div>
              ) : (
                <div className="beanito-upload-area has-file">
                  <img src={screenshotPreview} alt="Payment proof" className="beanito-upload-preview" />
                  <button 
                    onClick={handleRemoveScreenshot}
                    className="beanito-mini-btn danger"
                    style={{ margin: "0 auto" }}
                  >
                    <X size={12} />
                    Remove & re-upload
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={handleVerify} 
              disabled={referenceNo.length < 6 || !screenshot}
              className="beanito-modal-btn primary cos-btn"
              style={{ marginBottom: 10 }}
            >
              <ShieldCheck size={18} />
              {referenceNo.length < 6 || !screenshot 
                ? "Complete all requirements above" 
                : orderStatus === "rejected" 
                  ? "Re-submit for verification" 
                  : "Submit for verification"}
            </button>

            <button onClick={handleBackToPay} className="beanito-modal-btn secondary cos-btn">
              Back to QR
            </button>

            {onCancelOrder && (
              <button onClick={handleCancelOrder} className="beanito-modal-btn danger cos-btn">
                <Ban size={16} />
                Cancel Order
              </button>
            )}
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
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#F5E6C8" }}>
              {orderStatus === "rejected" ? "Proof re-submitted" : "Payment submitted"}
            </div>
            <div style={{ fontSize: 13, color: "#8B7355", marginTop: 6, fontFamily: "'Montserrat', sans-serif" }}>
              Ref: {referenceNo}
            </div>
            <div style={{ fontSize: 13, color: "#D4A574", marginTop: 8, fontFamily: "'Montserrat', sans-serif" }}>
              Waiting for admin verification...
            </div>
            <div style={{ fontSize: 12, color: "#5C4E3C", marginTop: 4, fontFamily: "'Montserrat', sans-serif" }}>
              Your order will be processed once confirmed
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}