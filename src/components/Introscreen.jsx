import React, { useState, useEffect } from "react";
import { ArrowRight, Shield } from "lucide-react";

/**
 * CALMA CAFE — Intro Screen
 * Palette pulled directly from the badge logo:
 *   - True near-black ground   #0B0805
 *   - Warm gold ring / accent  #C6A265
 *   - Soft highlight gold      #E8D5A3
 *   - Bronze / muted text      #8A7554
 *   - Cream headline text      #F2EAD9
 */
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
    <div className="calma-intro">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');

        .calma-intro * { box-sizing: border-box; }

        .calma-intro {
          min-height: 100dvh;
          width: 100%;
          font-family: 'Cormorant Garamond', 'Georgia', serif;
          background: #0B0805;
          position: relative;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: max(24px, env(safe-area-inset-top)) 20px max(24px, env(safe-area-inset-bottom));
        }

        .calma-glow-top {
          position: absolute;
          width: clamp(260px, 70vw, 420px);
          height: clamp(260px, 70vw, 420px);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(198,162,101,0.10) 0%, transparent 72%);
          top: -140px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        }

        .calma-glow-bottom {
          position: absolute;
          width: clamp(200px, 55vw, 320px);
          height: clamp(200px, 55vw, 320px);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(198,162,101,0.06) 0%, transparent 72%);
          bottom: 60px;
          right: -100px;
          pointer-events: none;
        }

        .calma-staff-wrap {
          position: absolute;
          top: max(16px, env(safe-area-inset-top));
          right: 16px;
          z-index: 10;
        }

        .calma-staff-btn {
          background: rgba(30,20,12,0.85);
          border: 1px solid rgba(198,162,101,0.35);
          border-radius: 8px;
          color: #C6A265;
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
        .calma-staff-btn:active { background: rgba(46,30,18,0.9); }
        @media (hover: hover) {
          .calma-staff-btn:hover { border-color: rgba(198,162,101,0.6); }
        }

        .calma-admin-card {
          width: min(220px, 62vw);
          background: rgba(11,8,5,0.97);
          border: 1px solid rgba(198,162,101,0.35);
          border-radius: 12px;
          padding: 16px;
          backdrop-filter: blur(20px);
        }

        .calma-admin-label {
          font-size: 10px;
          color: #8A7554;
          margin-bottom: 10px;
          font-family: 'Montserrat', sans-serif;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .calma-admin-input {
          width: 100%;
          padding: 11px 12px;
          border-radius: 6px;
          background: rgba(38,26,16,0.6);
          font-size: 16px;
          font-family: 'Montserrat', sans-serif;
          color: #F2EAD9;
          margin-bottom: 10px;
          outline: none;
          border: 1px solid rgba(198,162,101,0.35);
        }
        .calma-admin-input.error { border: 1.5px solid #b23b32; }

        .calma-admin-error {
          color: #d17c72;
          font-size: 10px;
          margin-bottom: 10px;
          font-family: 'Montserrat', sans-serif;
          letter-spacing: 0.5px;
        }

        .calma-admin-actions { display: flex; gap: 8px; }

        .calma-btn-enter {
          flex: 1;
          padding: 10px;
          border-radius: 6px;
          border: none;
          background: #C6A265;
          color: #0B0805;
          font-size: 11px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 1px;
          min-height: 38px;
        }

        .calma-btn-back {
          flex: 1;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid rgba(198,162,101,0.35);
          background: transparent;
          color: #8A7554;
          font-size: 11px;
          font-family: 'Montserrat', sans-serif;
          cursor: pointer;
          min-height: 38px;
        }

        .calma-header { text-align: center; margin-bottom: clamp(20px, 5vw, 32px); position: relative; z-index: 2; }

        .calma-badge {
          width: clamp(88px, 26vw, 116px);
          height: clamp(88px, 26vw, 116px);
          margin: 0 auto 18px;
          border-radius: 50%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .calma-badge-ring-outer {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(198,162,101,0.45);
        }

        .calma-badge-ring-inner {
          position: absolute;
          inset: 6px;
          border-radius: 50%;
          border: 2px solid #C6A265;
        }

        .calma-badge-img {
          width: calc(100% - 20px);
          height: calc(100% - 20px);
          border-radius: 50%;
          object-fit: cover;
          display: block;
        }

        .calma-wordmark {
          font-size: clamp(26px, 7.5vw, 34px);
          line-height: 1;
          letter-spacing: clamp(3px, 1.2vw, 6px);
          margin-bottom: 10px;
          font-family: 'Cormorant Garamond', serif;
        }
        .calma-wordmark .w-strong { color: #F2EAD9; font-weight: 700; }
        .calma-wordmark .w-light { color: #C6A265; font-weight: 500; }

        .calma-tagline {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          letter-spacing: 3px;
          color: #8A7554;
          text-transform: uppercase;
        }

        .calma-card {
          background: rgba(28,19,11,0.55);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(198,162,101,0.18);
          border-radius: 16px;
          width: 100%;
          max-width: 380px;
          padding: clamp(18px, 5vw, 24px);
          margin-bottom: clamp(20px, 5vw, 28px);
          position: relative;
          z-index: 2;
        }

        .calma-card-title {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: #C6A265;
          margin-bottom: 18px;
          font-family: 'Montserrat', sans-serif;
        }

        .calma-step {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 0;
          border-bottom: 1px solid rgba(198,162,101,0.1);
          transition: opacity 0.5s cubic-bezier(0.34,1.56,0.64,1), transform 0.5s cubic-bezier(0.34,1.56,0.64,1);
        }
        .calma-step:last-child { border-bottom: none; }

        .calma-step-num {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1.5px solid #C6A265;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #C6A265;
          flex-shrink: 0;
        }

        .calma-step-label {
          font-size: 15px;
          font-weight: 600;
          color: #F2EAD9;
          font-family: 'Cormorant Garamond', serif;
          margin-bottom: 2px;
        }

        .calma-step-note {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          color: #8A7554;
        }

        .calma-cta-wrap { width: 100%; max-width: 380px; margin-bottom: clamp(20px, 5vw, 30px); position: relative; z-index: 2; }

        .calma-cta {
          width: 100%;
          padding: 17px;
          background: #C6A265;
          color: #0B0805;
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
        .calma-cta:active { transform: scale(0.97); background: #b8944f; }
        @media (hover: hover) {
          .calma-cta:hover { background: #d6b578; transform: translateY(-1px); }
        }

        .calma-footer {
          text-align: center;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          color: #5a4a3a;
          letter-spacing: 2px;
          text-transform: uppercase;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 360px) {
          .calma-wordmark { letter-spacing: 3px; }
          .calma-card { padding: 16px; }
        }
      `}</style>

      <div className="calma-glow-top" />
      <div className="calma-glow-bottom" />

      {/* Staff button */}
      <div className="calma-staff-wrap">
        {!showAdminLogin ? (
          <button className="calma-staff-btn" onClick={() => setShowAdminLogin(true)}>
            <Shield size={12} />
            Staff
          </button>
        ) : (
          <form onSubmit={handleAdminSubmit} className="calma-admin-card">
            <div className="calma-admin-label">Override code</div>
            <input
              type="password"
              value={adminCode}
              onChange={(e) => {
                setAdminCode(e.target.value);
                setError(false);
              }}
              placeholder="••••••"
              className={`calma-admin-input${error ? " error" : ""}`}
              autoFocus
            />
            {error && <div className="calma-admin-error">Denied — try again</div>}
            <div className="calma-admin-actions">
              <button type="submit" className="calma-btn-enter">Enter</button>
              <button
                type="button"
                className="calma-btn-back"
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
      <div className="calma-header">
        <div className="calma-badge">
          <div className="calma-badge-ring-outer" />
          <div className="calma-badge-ring-inner" />
          <img src="/logo512.png" alt="Calma Cafe" className="calma-badge-img" />
        </div>

        <div className="calma-wordmark">
          <span className="w-strong">CALMA</span>
          <span className="w-light">CAFE</span>
        </div>

        <div className="calma-tagline">Coffee · Comfort · Calma</div>
      </div>

      {/* Steps */}
      <div className="calma-card">
        <div className="calma-card-title">How it works</div>
        {steps.map((s, i) => (
          <div
            key={s.label}
            className="calma-step"
            style={{
              opacity: visibleSteps > i ? 1 : 0,
              transform: visibleSteps > i ? "translateX(0)" : "translateX(-16px)",
              transitionDelay: `${i * 0.12}s`,
            }}
          >
            <div className="calma-step-num">{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div className="calma-step-label">{s.label}</div>
              <div className="calma-step-note">{s.note}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="calma-cta-wrap">
        <button className="calma-cta" onClick={handleGetStarted} style={{ transform: stamping ? "scale(0.96)" : undefined }}>
          Start order
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="calma-footer">Est. 2026 · Specialty Coffee</div>
    </div>
  );
}