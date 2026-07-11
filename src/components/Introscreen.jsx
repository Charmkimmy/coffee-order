import React, { useState, useEffect } from "react";
import { ArrowRight, Shield } from "lucide-react";
export default function IntroScreen({ onGetStarted, onAdminLogin }) {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState(false);
  const [stamping, setStamping] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleSteps((prev) => {
        if (prev >= 3) {
          clearInterval(timer);
          return 3;
        }
        return prev + 1;
      });
    }, 550);
    return () => clearInterval(timer);
  }, []);

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (adminCode === "admin123") {
      setError(false);
      onAdminLogin();
    } else {
      setError(true);
      setAdminCode("");
    }
  };

  const handleGetStarted = () => {
    setStamping(true);
    setTimeout(() => {
      onGetStarted();
    }, 380);
  };

  const steps = [
    { label: "Choose your drink", note: "5 flavors on tap" },
    { label: "Pick your size", note: "16oz or 22oz" },
    { label: "Pay & enjoy", note: "Cash · Maya" },
  ];

  return (
    <div className="beanito-intro">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');

        .beanito-intro * { box-sizing: border-box; }

        .beanito-intro {
          min-height: 100dvh;
          width: 100%;
          font-family: 'Playfair Display', 'Georgia', serif;
          background: #0D0D0D;
          position: relative;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: max(24px, env(safe-area-inset-top)) 20px max(24px, env(safe-area-inset-bottom));
        }

        .beanito-glow-top {
          position: absolute;
          width: clamp(260px, 70vw, 420px);
          height: clamp(260px, 70vw, 420px);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212,165,116,0.12) 0%, transparent 72%);
          top: -140px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        }

        .beanito-glow-bottom {
          position: absolute;
          width: clamp(200px, 55vw, 320px);
          height: clamp(200px, 55vw, 320px);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212,165,116,0.07) 0%, transparent 72%);
          bottom: 60px;
          right: -100px;
          pointer-events: none;
        }

        .beanito-staff-wrap {
          position: absolute;
          top: max(16px, env(safe-area-inset-top));
          right: 16px;
          z-index: 10;
        }

        .beanito-staff-btn {
          background: rgba(30,30,30,0.85);
          border: 1px solid rgba(245,230,200,0.25);
          border-radius: 8px;
          color: #F5E6C8;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 2px;
          padding: 10px 14px;
          cursor: pointer;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
          min-height: 36px;
          -webkit-tap-highlight-color: transparent;
        }
        .beanito-staff-btn:active { background: rgba(46,46,46,0.9); }
        @media (hover: hover) {
          .beanito-staff-btn:hover { border-color: rgba(245,230,200,0.45); }
        }

        .beanito-admin-card {
          width: min(220px, 62vw);
          background: rgba(13,13,13,0.97);
          border: 1px solid rgba(245,230,200,0.25);
          border-radius: 12px;
          padding: 16px;
          backdrop-filter: blur(20px);
        }

        .beanito-admin-label {
          font-size: 10px;
          color: #8B7355;
          margin-bottom: 10px;
          font-family: 'Montserrat', sans-serif;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .beanito-admin-input {
          width: 100%;
          padding: 11px 12px;
          border-radius: 6px;
          background: rgba(40,40,40,0.6);
          font-size: 16px;
          font-family: 'Montserrat', sans-serif;
          color: #F5E6C8;
          margin-bottom: 10px;
          outline: none;
          border: 1px solid rgba(245,230,200,0.25);
        }
        .beanito-admin-input.error { border: 1.5px solid #c44; }

        .beanito-admin-error {
          color: #e07070;
          font-size: 10px;
          margin-bottom: 10px;
          font-family: 'Montserrat', sans-serif;
          letter-spacing: 0.5px;
        }

        .beanito-admin-actions { display: flex; gap: 8px; }

        .beanito-btn-enter {
          flex: 1;
          padding: 10px;
          border-radius: 6px;
          border: none;
          background: #D4A574;
          color: #0D0D0D;
          font-size: 11px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 1px;
          min-height: 38px;
        }

        .beanito-btn-back {
          flex: 1;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid rgba(245,230,200,0.25);
          background: transparent;
          color: #8B7355;
          font-size: 11px;
          font-family: 'Montserrat', sans-serif;
          cursor: pointer;
          min-height: 38px;
        }

        .beanito-header { text-align: center; margin-bottom: clamp(20px, 5vw, 32px); position: relative; z-index: 2; }

        .beanito-badge {
          width: clamp(120px, 32vw, 160px);
          height: clamp(120px, 32vw, 160px);
          margin: 0 auto 18px;
          border-radius: 50%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .beanito-badge-ring-outer {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(245,230,200,0.35);
        }

        .beanito-badge-ring-inner {
          position: absolute;
          inset: 6px;
          border-radius: 50%;
          border: 2px solid #F5E6C8;
        }
          .beanito-badge {
          width: clamp(160px, 42vw, 220px);   /* bigger badge */
          height: clamp(160px, 42vw, 220px);
          margin: 0 auto 18px;
          border-radius: 50%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;       /* allow image to spill out slightly */
          }
          .beanito-badge-img {
          width: 120%;               /* larger than container */
          height: 120%;
          object-fit: contain;
          display: block;
          position: relative;
          top: 10%;                  /* shift down to center the circle part */
          }

        .beanito-wordmark {
          font-size: clamp(28px, 8vw, 38px);
          line-height: 1;
          letter-spacing: clamp(2px, 1vw, 4px);
          margin-bottom: 10px;
          font-family: 'Playfair Display', serif;
          color: #F5E6C8;
          font-weight: 700;
        }

        .beanito-tagline {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          letter-spacing: 3px;
          color: #8B7355;
          text-transform: uppercase;
        }

        .beanito-card {
          background: rgba(30,30,30,0.55);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(245,230,200,0.15);
          border-radius: 16px;
          width: 100%;
          max-width: 380px;
          padding: clamp(18px, 5vw, 24px);
          margin-bottom: clamp(20px, 5vw, 28px);
          position: relative;
          z-index: 2;
        }

        .beanito-card-title {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: #D4A574;
          margin-bottom: 18px;
          font-family: 'Montserrat', sans-serif;
        }

        .beanito-step {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 0;
          border-bottom: 1px solid rgba(245,230,200,0.1);
          transition: opacity 0.5s cubic-bezier(0.34,1.56,0.64,1), transform 0.5s cubic-bezier(0.34,1.56,0.64,1);
        }
        .beanito-step:last-child { border-bottom: none; }

        .beanito-step-num {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1.5px solid #D4A574;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #D4A574;
          flex-shrink: 0;
        }

        .beanito-step-label {
          font-size: 15px;
          font-weight: 600;
          color: #F5E6C8;
          font-family: 'Playfair Display', serif;
          margin-bottom: 2px;
        }

        .beanito-step-note {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          color: #8B7355;
        }

        .beanito-cta-wrap { width: 100%; max-width: 380px; margin-bottom: clamp(20px, 5vw, 30px); position: relative; z-index: 2; }

        .beanito-cta {
          width: 100%;
          padding: 17px;
          background: #D4A574;
          color: #0D0D0D;
          border: none;
          border-radius: 12px;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 52px;
          transition: transform 0.15s ease, background 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .beanito-cta:active { transform: scale(0.97); background: #c49664; }
        @media (hover: hover) {
          .beanito-cta:hover { background: #e4b584; transform: translateY(-1px); }
        }

        .beanito-footer {
          text-align: center;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          color: #5a5a5a;
          letter-spacing: 2px;
          text-transform: uppercase;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 360px) {
          .beanito-wordmark { letter-spacing: 2px; }
          .beanito-card { padding: 16px; }
        }
      `}</style>

      <div className="beanito-glow-top" />
      <div className="beanito-glow-bottom" />

      {/* Staff button */}
      <div className="beanito-staff-wrap">
        {!showAdminLogin ? (
          <button className="beanito-staff-btn" onClick={() => setShowAdminLogin(true)}>
            <Shield size={12} />
            Staff
          </button>
        ) : (
          <form onSubmit={handleAdminSubmit} className="beanito-admin-card">
            <div className="beanito-admin-label">Override code</div>
            <input
              type="password"
              value={adminCode}
              onChange={(e) => {
                setAdminCode(e.target.value);
                setError(false);
              }}
              placeholder="••••••"
              className={`beanito-admin-input${error ? " error" : ""}`}
              autoFocus
            />
            {error && <div className="beanito-admin-error">Denied — try again</div>}
            <div className="beanito-admin-actions">
              <button type="submit" className="beanito-btn-enter">Enter</button>
              <button
                type="button"
                className="beanito-btn-back"
                onClick={() => {
                  setShowAdminLogin(false);
                  setAdminCode("");
                  setError(false);
                }}
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Header / logo */}
      <div className="beanito-header">
        <div className="beanito-badge">
          <div className="beanito-badge-ring-outer" />
          <div className="beanito-badge-ring-inner" />
          <img src="/beanito.png" alt="Beanito Coffee Shop" className="beanito-badge-img" />
        </div>

        <div className="beanito-wordmark">Beanito</div>

        <div className="beanito-tagline">Coffee Shop</div>
      </div>

      {/* Steps */}
      <div className="beanito-card">
        <div className="beanito-card-title">How it works</div>
        {steps.map((s, i) => (
          <div
            key={s.label}
            className="beanito-step"
            style={{
              opacity: visibleSteps > i ? 1 : 0,
              transform: visibleSteps > i ? "translateX(0)" : "translateX(-16px)",
              transitionDelay: `${i * 0.12}s`,
            }}
          >
            <div className="beanito-step-num">{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div className="beanito-step-label">{s.label}</div>
              <div className="beanito-step-note">{s.note}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="beanito-cta-wrap">
        <button className="beanito-cta" onClick={handleGetStarted} style={{ transform: stamping ? "scale(0.96)" : undefined }}>
          Start order
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="beanito-footer">Est. 2026 · Specialty Coffee</div>
    </div>
  );
}