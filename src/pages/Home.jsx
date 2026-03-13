import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .primary-btn {
          background: linear-gradient(135deg, #00C896, #00E8B5);
          color: #071020;
          padding: 15px 36px;
          border-radius: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          font-size: 15px;
          text-decoration: none;
          display: inline-block;
          letter-spacing: 0.01em;
          box-shadow: 0 8px 32px rgba(0,200,150,0.25);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,200,150,0.35); }

        .outline-btn {
          background: rgba(255,255,255,0.04);
          color: #94A3B8;
          padding: 15px 36px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.1);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 500;
          font-size: 15px;
          text-decoration: none;
          display: inline-block;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .outline-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); color: #E2E8F0; }

        .stat-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50px;
          padding: 10px 20px;
          backdrop-filter: blur(10px);
        }

        .feature-card {
          background: linear-gradient(135deg, rgba(14,28,54,0.9) 0%, rgba(10,22,40,0.95) 100%);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 24px;
          padding: 36px 32px;
          transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,212,170,0.3), transparent);
        }
        .feature-card:hover {
          border-color: rgba(0,212,170,0.2);
          transform: translateY(-6px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.3);
        }

        .metric-card {
          background: linear-gradient(135deg, rgba(14,28,54,0.9), rgba(10,22,40,0.95));
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 28px 24px;
          flex: 1;
          min-width: 160px;
          text-align: center;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,212,170,0.15), transparent);
          margin: 0 48px;
        }

        .cta-section {
          background: linear-gradient(135deg, rgba(0,200,150,0.08) 0%, rgba(0,100,180,0.08) 100%);
          border: 1px solid rgba(0,212,170,0.12);
          border-radius: 32px;
          padding: 72px 48px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .cta-section::before {
          content: '';
          position: absolute;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,212,170,0.1) 0%, transparent 70%);
          top: -100px; right: -80px;
        }
        .cta-section::after {
          content: '';
          position: absolute;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,100,180,0.12) 0%, transparent 70%);
          bottom: -60px; left: -60px;
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ position: "relative", padding: "120px 48px 100px", overflow: "hidden" }}>
        {/* Bg glows */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,212,170,0.09) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 40% 50% at 90% 60%, rgba(56,100,200,0.12) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(rgba(0,212,170,0.15) 1px, transparent 1px)`, backgroundSize: "32px 32px", opacity: 0.3 }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>

          {/* Left */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.18)", borderRadius: "100px", padding: "7px 18px", marginBottom: "28px" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#00D4AA" }} />
              <span style={{ color: "#00D4AA", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Trusted by 10,000+ users</span>
            </div>

            <h1 style={{ fontFamily: "'Clash Display', 'Syne', sans-serif", fontWeight: 700, fontSize: "clamp(40px, 5vw, 64px)", color: "#F1F5F9", lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: "24px" }}>
              Your Money,<br />
              <span style={{ background: "linear-gradient(135deg, #00E8B5, #00A88A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Your Control.</span>
            </h1>

            <p style={{ color: "#7A8FA6", fontSize: "17px", lineHeight: 1.85, marginBottom: "40px", maxWidth: "460px", fontWeight: 400 }}>
              StoreWallet is a secure digital wallet platform that puts you in command of every dollar — track, manage, and grow your finances with confidence.
            </p>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "48px" }}>
              <Link to="/register" className="primary-btn">Start for Free →</Link>
              <Link to="/about" className="outline-btn">How it Works</Link>
            </div>

            {/* Trust pills */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {["🔒 No data sharing", "⚡ Real-time sync", "🛡️ 100% private"].map((t, i) => (
                <div key={i} className="stat-pill">
                  <span style={{ color: "#94A3B8", fontSize: "13px", fontWeight: 500 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — visual card */}
          <div style={{ position: "relative" }}>
            <div style={{ background: "linear-gradient(135deg, rgba(14,28,54,0.95), rgba(8,18,38,0.98))", border: "1px solid rgba(0,212,170,0.12)", borderRadius: "28px", padding: "36px", boxShadow: "0 40px 100px rgba(0,0,0,0.5)" }}>
              {/* Card header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                <div>
                  <p style={{ color: "#475569", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>Total Balance</p>
                  <p style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: "36px", color: "#F1F5F9", letterSpacing: "-0.02em" }}>$12,480.00</p>
                </div>
                <div style={{ background: "rgba(0,212,170,0.1)", border: "1px solid rgba(0,212,170,0.2)", borderRadius: "12px", padding: "10px 14px" }}>
                  <span style={{ color: "#00D4AA", fontSize: "13px", fontWeight: 600 }}>↑ +8.2%</span>
                </div>
              </div>

              {/* Mini stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "28px" }}>
                {[{ label: "Income", value: "$8,200", color: "#00D4AA" }, { label: "Expenses", value: "$3,720", color: "#F87171" }].map((s, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "14px", padding: "16px" }}>
                    <p style={{ color: "#475569", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>{s.label}</p>
                    <p style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: "20px", color: s.color }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Recent transactions */}
              <p style={{ color: "#334155", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "14px" }}>Recent</p>
              {[
                { name: "Deposit", amount: "+$500", color: "#00D4AA", icon: "⬇️" },
                { name: "Withdraw", amount: "-$120", color: "#F87171", icon: "⬆️" },
                { name: "Deposit", amount: "+$1,200", color: "#00D4AA", icon: "⬇️" },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "14px" }}>{t.icon}</span>
                    <span style={{ color: "#94A3B8", fontSize: "13px" }}>{t.name}</span>
                  </div>
                  <span style={{ color: t.color, fontWeight: 700, fontSize: "14px" }}>{t.amount}</span>
                </div>
              ))}
            </div>

            {/* Floating badge */}
            <div style={{ position: "absolute", top: "-16px", right: "24px", background: "linear-gradient(135deg, #00A88A, #00D4AA)", borderRadius: "12px", padding: "8px 16px", boxShadow: "0 8px 24px rgba(0,212,170,0.3)" }}>
              <span style={{ color: "#071020", fontWeight: 700, fontSize: "12px" }}>✓ Secure & Private</span>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── METRICS ── */}
      <section style={{ padding: "72px 48px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {[
            { value: "10K+", label: "Active Users", icon: "👥" },
            { value: "100%", label: "Privacy Guaranteed", icon: "🔒" },
            { value: "$0", label: "Hidden Fees", icon: "💸" },
            { value: "24/7", label: "Always Available", icon: "⚡" },
          ].map((m, i) => (
            <div key={i} className="metric-card">
              <div style={{ fontSize: "28px", marginBottom: "12px" }}>{m.icon}</div>
              <div style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: "30px", color: "#00D4AA", marginBottom: "6px" }}>{m.value}</div>
              <div style={{ color: "#475569", fontSize: "13px", fontWeight: 500 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ── FEATURES ── */}
      <section style={{ padding: "80px 48px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ marginBottom: "56px" }}>
          <p style={{ color: "#00D4AA", fontSize: "12px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "14px" }}>WHAT WE OFFER</p>
          <h2 style={{ fontFamily: "'Clash Display', 'Syne', sans-serif", fontWeight: 700, fontSize: "clamp(28px, 4vw, 44px)", color: "#F1F5F9", letterSpacing: "-0.025em", lineHeight: 1.15, maxWidth: "500px" }}>
            Everything your finances need, nothing they don't.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
          {[
            { icon: "💳", title: "Smart Wallet", desc: "Deposit and withdraw instantly. Real-time balance updates keep you always informed.", color: "#00D4AA", num: "01" },
            { icon: "📊", title: "Live Dashboard", desc: "Your complete financial snapshot — income, expenses, and net worth in one view.", color: "#3B82F6", num: "02" },
            { icon: "📋", title: "Transaction Log", desc: "Every move tracked and filterable. Search by type, date, or amount instantly.", color: "#A78BFA", num: "03" },
            { icon: "🛡️", title: "Zero Cloud", desc: "No external servers. Your data lives only on your device. Always and forever.", color: "#F59E0B", num: "04" },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: `${f.color}14`, border: `1px solid ${f.color}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>{f.icon}</div>
                <span style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: "13px", color: "rgba(255,255,255,0.08)", letterSpacing: "0.05em" }}>{f.num}</span>
              </div>
              <h3 style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 600, fontSize: "18px", color: "#E2E8F0", marginBottom: "12px" }}>{f.title}</h3>
              <p style={{ color: "#4A5E78", fontSize: "14px", lineHeight: 1.8, fontWeight: 400 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "0 48px 100px", maxWidth: "1100px", margin: "0 auto" }}>
        <div className="cta-section">
          <p style={{ color: "#00D4AA", fontSize: "12px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "18px", position: "relative", zIndex: 1 }}>GET STARTED TODAY</p>
          <h2 style={{ fontFamily: "'Clash Display', 'Syne', sans-serif", fontWeight: 700, fontSize: "clamp(28px, 4vw, 48px)", color: "#F1F5F9", letterSpacing: "-0.025em", marginBottom: "18px", position: "relative", zIndex: 1 }}>
            Take control of your<br />financial future.
          </h2>
          <p style={{ color: "#4A5E78", fontSize: "16px", marginBottom: "36px", position: "relative", zIndex: 1 }}>
            Free to use. No credit card. No hidden fees.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
            <Link to="/register" className="primary-btn">Create Free Account →</Link>
            <Link to="/login" className="outline-btn">Sign In</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;