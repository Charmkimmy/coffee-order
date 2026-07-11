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
    { label: "Pay & enjoy", note: "Cash · InstaPay" },
  ];

  return (
    <div className="beanito-intro">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kaushan+Script&family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Montserrat:wght@400;500;600;700&display=swap');

        .beanito-intro * { box-sizing: border-box; }

        .beanito-intro {
          min-height: 100dvh;
          width: 100%;
          font-family: 'Fraunces', 'Georgia', serif;
          background: #0B0805;
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
          width: clamp(280px, 75vw, 460px);
          height: clamp(280px, 75vw, 460px);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(230,166,84,0.16) 0%, rgba(180,100,40,0.05) 45%, transparent 72%);
          top: -160px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
          animation: emberBreathe 5s ease-in-out infinite;
        }

        .beanito-glow-bottom {
          position: absolute;
          width: clamp(200px, 55vw, 320px);
          height: clamp(200px, 55vw, 320px);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200,120,50,0.10) 0%, transparent 72%);
          bottom: 60px;
          right: -100px;
          pointer-events: none;
        }

        @keyframes emberBreathe {
          0%, 100% { opacity: 0.75; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.05); }
        }

        .beanito-staff-wrap {
          position: absolute;
          top: max(16px, env(safe-area-inset-top));
          right: 16px;
          z-index: 10;
        }

        .beanito-staff-btn {
          background: rgba(26,20,13,0.85);
          border: 1px solid rgba(198,162,101,0.3);
          border-radius: 8px;
          color: #E7CDA0;
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
        .beanito-staff-btn:active { background: rgba(40,30,18,0.9); }
        @media (hover: hover) {
          .beanito-staff-btn:hover { border-color: rgba(198,162,101,0.55); }
        }

        .beanito-admin-card {
          width: min(220px, 62vw);
          background: rgba(11,8,5,0.97);
          border: 1px solid rgba(198,162,101,0.3);
          border-radius: 12px;
          padding: 16px;
          backdrop-filter: blur(20px);
        }

        .beanito-admin-label {
          font-size: 10px;
          color: #8A7554;
          margin-bottom: 10px;
          font-family: 'Montserrat', sans-serif;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .beanito-admin-input {
          width: 100%;
          padding: 11px 12px;
          border-radius: 6px;
          background: rgba(50,38,22,0.5);
          font-size: 16px;
          font-family: 'Montserrat', sans-serif;
          color: #F2EAD9;
          margin-bottom: 10px;
          outline: none;
          border: 1px solid rgba(198,162,101,0.3);
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
          background: linear-gradient(180deg, #DDB076 0%, #C6A265 100%);
          color: #0B0805;
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
          border: 1px solid rgba(198,162,101,0.3);
          background: transparent;
          color: #8A7554;
          font-size: 11px;
          font-family: 'Montserrat', sans-serif;
          cursor: pointer;
          min-height: 38px;
        }

        .beanito-header { text-align: center; margin-bottom: clamp(20px, 5vw, 32px); position: relative; z-index: 2; }

        /* LOGO: No circular clipping — show full image, let it sit in the dark like the sign */
        .beanito-badge {
          width: clamp(170px, 48vw, 250px);
          height: auto;
          margin: 0 auto 6px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .beanito-badge-img {
          width: 100%;
          height: auto;
          object-fit: contain;
          display: block;
          border-radius: 18px;
          filter: drop-shadow(0 0 26px rgba(230,166,84,0.22));
        }

        /* Faint warm ring, like the glow bleeding past the sign's edge */
        .beanito-badge-ring-outer {
          position: absolute;
          inset: -10px;
          border-radius: 26px;
          border: 1px solid rgba(198,162,101,0.16);
          pointer-events: none;
        }

        .beanito-wordmark {
          font-size: clamp(40px, 12vw, 58px);
          line-height: 1.15;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
          font-family: 'Kaushan Script', cursive;
          font-weight: 400;
          color: #F0CE97;
          text-shadow: 0 0 14px rgba(230,166,84,0.55), 0 0 34px rgba(200,130,50,0.28);
          animation: signFlicker 4.5s ease-in-out infinite;
        }

        @keyframes signFlicker {
          0%, 100% { text-shadow: 0 0 14px rgba(230,166,84,0.55), 0 0 34px rgba(200,130,50,0.28); }
          50% { text-shadow: 0 0 18px rgba(230,166,84,0.7), 0 0 42px rgba(200,130,50,0.36); }
        }

        .beanito-tagline {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          letter-spacing: 4px;
          color: #8A7554;
          text-transform: uppercase;
        }

        .beanito-card {
          background: rgba(30,22,12,0.5);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(198,162,101,0.16);
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
          color: #C6A265;
          margin-bottom: 18px;
          font-family: 'Montserrat', sans-serif;
        }

        .beanito-step {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 0;
          border-bottom: 1px solid rgba(198,162,101,0.12);
          transition: opacity 0.5s cubic-bezier(0.34,1.56,0.64,1), transform 0.5s cubic-bezier(0.34,1.56,0.64,1);
        }
        .beanito-step:last-child { border-bottom: none; }

        .beanito-step-num {
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

        .beanito-step-label {
          font-size: 15px;
          font-weight: 600;
          color: #F2EAD9;
          font-family: 'Fraunces', serif;
          margin-bottom: 2px;
        }

        .beanito-step-note {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          color: #8A7554;
        }

        .beanito-cta-wrap { width: 100%; max-width: 380px; margin-bottom: clamp(20px, 5vw, 30px); position: relative; z-index: 2; }

        .beanito-cta {
          width: 100%;
          padding: 17px;
          background: linear-gradient(180deg, #DDB076 0%, #C6A265 100%);
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
          box-shadow: 0 6px 24px rgba(198,162,101,0.25);
          transition: transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .beanito-cta:active { transform: scale(0.97); background: #b9925a; }
        @media (hover: hover) {
          .beanito-cta:hover { box-shadow: 0 8px 30px rgba(198,162,101,0.4); transform: translateY(-1px); }
        }

        .beanito-footer {
          text-align: center;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          color: #5a4d38;
          letter-spacing: 2px;
          text-transform: uppercase;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 360px) {
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

      {/* Header / logo — full glowing sign, no circular crop */}
      <div className="beanito-header">
        <div className="beanito-badge">
          <div className="beanito-badge-ring-outer" />
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