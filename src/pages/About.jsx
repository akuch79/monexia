import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; }

        .info-card {
          background: linear-gradient(135deg, rgba(14,28,54,0.9), rgba(10,22,40,0.95));
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 24px;
          padding: 40px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s, transform 0.3s;
        }
        .info-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,212,170,0.25), transparent);
        }
        .info-card:hover { border-color: rgba(0,212,170,0.18); transform: translateY(-3px); }

        .feature-row {
          display: flex;
          gap: 18px;
          align-items: flex-start;
          padding: 20px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.04);
          background: rgba(255,255,255,0.02);
          margin-bottom: 12px;
          transition: background 0.2s, border-color 0.2s;
        }
        .feature-row:last-child { margin-bottom: 0; }
        .feature-row:hover { background: rgba(0,212,170,0.04); border-color: rgba(0,212,170,0.12); }

        .stat-box {
          background: linear-gradient(135deg, rgba(14,28,54,0.9), rgba(10,22,40,0.95));
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 28px 20px;
          text-align: center;
          flex: 1;
          min-width: 130px;
        }

        .primary-btn {
          background: linear-gradient(135deg, #00C896, #00E8B5);
          color: #071020;
          padding: 14px 32px;
          border-radius: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          font-size: 15px;
          text-decoration: none;
          display: inline-block;
          box-shadow: 0 8px 28px rgba(0,200,150,0.22);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(0,200,150,0.32); }

        .section-label {
          color: #00D4AA;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,212,170,0.12), transparent);
          margin: 0 48px 72px;
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ position: "relative", padding: "120px 48px 90px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,212,170,0.08) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(rgba(0,212,170,0.12) 1px, transparent 1px)`, backgroundSize: "32px 32px", opacity: 0.3 }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>

            {/* Left text */}
            <div>
              <p className="section-label">About StoreWallet</p>
              <h1 style={{ fontFamily: "'Clash Display', 'Syne', sans-serif", fontWeight: 700, fontSize: "clamp(38px, 5vw, 62px)", color: "#F1F5F9", lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: "24px" }}>
                Finance tools<br />
                <span style={{ background: "linear-gradient(135deg, #00E8B5, #00A88A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>built for you.</span>
              </h1>
              <p style={{ color: "#5A7090", fontSize: "17px", lineHeight: 1.85, marginBottom: "36px", fontWeight: 400 }}>
                StoreWallet is your institutional-grade financial command center — built for people who demand full control over their money, without surrendering privacy to third-party platforms.
              </p>
              <Link to="/register" className="primary-btn">Get Started Free →</Link>
            </div>

            {/* Right stats */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
              {[
                { icon: "💳", value: "100%", label: "Private & Secure" },
                { icon: "📈", value: "Live", label: "Balance Tracking" },
                { icon: "🛡️", value: "Local", label: "Data Storage" },
                { icon: "🚀", value: "Always", label: "Available" },
              ].map((s, i) => (
                <div key={i} className="stat-box">
                  <div style={{ fontSize: "26px", marginBottom: "12px" }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: "20px", color: "#00D4AA", marginBottom: "6px" }}>{s.value}</div>
                  <div style={{ color: "#3D5170", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 48px 100px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>

          {/* What is StoreWallet */}
          <div className="info-card">
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
              <div style={{ width: "46px", height: "46px", borderRadius: "14px", background: "rgba(0,212,170,0.1)", border: "1px solid rgba(0,212,170,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🏛️</div>
              <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 600, fontSize: "20px", color: "#F1F5F9", letterSpacing: "-0.01em" }}>What is StoreWallet?</h2>
            </div>
            <p style={{ color: "#5A7090", fontSize: "15px", lineHeight: 1.85, marginBottom: "14px" }}>
              A powerful personal finance dashboard engineered for people who demand full control over their money — without surrendering their privacy.
            </p>
            <p style={{ color: "#5A7090", fontSize: "15px", lineHeight: 1.85 }}>
              Everything runs entirely on your device. No external servers. No cloud uploads. No compromise. Your data stays exactly where it belongs — with you.
            </p>
          </div>

          {/* Mission */}
          <div className="info-card">
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
              <div style={{ width: "46px", height: "46px", borderRadius: "14px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🎯</div>
              <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 600, fontSize: "20px", color: "#F1F5F9", letterSpacing: "-0.01em" }}>Our Mission</h2>
            </div>
            <p style={{ color: "#5A7090", fontSize: "15px", lineHeight: 1.85, marginBottom: "20px" }}>
              We believe everyone deserves access to institutional-grade financial tools that are simple, private, and free. StoreWallet bridges the gap between Wall Street and Main Street.
            </p>
            <div style={{ padding: "16px 20px", borderRadius: "14px", background: "rgba(0,212,170,0.05)", borderLeft: "3px solid #00D4AA" }}>
              <p style={{ fontFamily: "'Clash Display', sans-serif", color: "#00D4AA", fontSize: "14px", fontWeight: 600, letterSpacing: "0.02em" }}>
                "Financial freedom isn't a privilege — it's a right."
              </p>
            </div>
          </div>
        </div>

        {/* Features — full width */}
        <div className="info-card">
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
            <div style={{ width: "46px", height: "46px", borderRadius: "14px", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>⚡</div>
            <div>
              <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 600, fontSize: "20px", color: "#F1F5F9", letterSpacing: "-0.01em" }}>What We Offer</h2>
              <p style={{ color: "#3D5170", fontSize: "13px", marginTop: "3px" }}>Four pillars of your financial freedom</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              { icon: "💰", title: "Track Every Penny", desc: "Monitor all deposits and withdrawals in real-time with full transaction history.", color: "#00D4AA" },
              { icon: "📊", title: "Analytics Dashboard", desc: "Visualize your financial health with charts and income vs. expense overview.", color: "#3B82F6" },
              { icon: "🔒", title: "100% Private", desc: "All data stored locally — zero servers, zero data sharing, zero compromise.", color: "#A78BFA" },
              { icon: "🧠", title: "Smart Wallet", desc: "Instant deposits and withdrawals with quick-amount shortcuts and live sync.", color: "#F59E0B" },
            ].map((f, i) => (
              <div key={i} className="feature-row">
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `${f.color}12`, border: `1px solid ${f.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <h3 style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 600, fontSize: "14px", color: "#D1D9E6", marginBottom: "5px" }}>{f.title}</h3>
                  <p style={{ color: "#3D5170", fontSize: "13px", lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: "20px", background: "linear-gradient(135deg, rgba(0,200,150,0.07), rgba(0,100,200,0.07))", border: "1px solid rgba(0,212,170,0.1)", borderRadius: "24px", padding: "52px 40px", textAlign: "center" }}>
          <p className="section-label">READY TO BEGIN?</p>
          <h3 style={{ fontFamily: "'Clash Display', 'Syne', sans-serif", fontWeight: 700, fontSize: "clamp(22px, 3vw, 34px)", color: "#F1F5F9", letterSpacing: "-0.02em", marginBottom: "14px" }}>
            Join thousands managing smarter.
          </h3>
          <p style={{ color: "#3D5170", fontSize: "15px", marginBottom: "28px" }}>Free forever. No credit card required.</p>
          <Link to="/register" className="primary-btn">Create Your Account →</Link>
        </div>
      </div>
    </div>
  );
};

export default About;