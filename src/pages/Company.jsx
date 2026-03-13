import React from "react";
import { Link } from "react-router-dom";

const Company = () => {
  const team = [
    { name: "Margaret Akuch", role: "Founder & CEO", icon: "👩‍💼", desc: "Visionary leader with a passion for financial inclusion across Africa." },
    { name: "Alex Omondi", role: "CTO", icon: "👨‍💻", desc: "Full-stack engineer building secure, scalable infrastructure." },
    { name: "Grace Wanjiku", role: "Head of Design", icon: "👩‍🎨", desc: "Crafting intuitive experiences that make finance feel effortless." },
    { name: "Brian Mwangi", role: "Head of Security", icon: "🛡️", desc: "Ensuring every transaction is protected with enterprise-grade security." },
  ];

  const values = [
    { icon: "🔒", title: "Privacy First", desc: "Your data belongs to you. We never sell, share, or store it on external servers." },
    { icon: "🌍", title: "Financial Inclusion", desc: "Bringing institutional-grade tools to everyone, regardless of wealth or background." },
    { icon: "⚡", title: "Speed & Reliability", desc: "Real-time balance updates and zero downtime — because money never sleeps." },
    { icon: "🤝", title: "Trust & Transparency", desc: "Open about how we work, honest about our fees, clear about our mission." },
    { icon: "🚀", title: "Innovation", desc: "Continuously evolving to bring you the smartest financial tools available." },
    { icon: "💚", title: "Community", desc: "Built for the people of East Africa and the world, by a team that cares." },
  ];

  return (
    <div style={{ background: "#050D1A", minHeight: "100vh", fontFamily: "DM Sans, sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .fade-up { animation: fadeUp 0.6s ease both; }
        .team-card {
          background: rgba(8,18,36,0.8);
          border: 1px solid rgba(0,212,170,0.08);
          border-radius: 20px;
          padding: 28px;
          text-align: center;
          transition: border-color 0.3s, transform 0.3s;
        }
        .team-card:hover { border-color: rgba(0,212,170,0.25); transform: translateY(-4px); }
        .value-card {
          background: rgba(8,18,36,0.6);
          border: 1px solid rgba(0,212,170,0.07);
          border-radius: 18px;
          padding: 28px;
          transition: border-color 0.3s, background 0.3s;
        }
        .value-card:hover { border-color: rgba(0,212,170,0.2); background: rgba(8,18,36,0.9); }
      `}</style>

      {/* Hero */}
      <section style={{ position: "relative", padding: "100px 32px 80px", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,212,170,0.06) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(0,212,170,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,170,0.5) 1px, transparent 1px)`, backgroundSize: "60px 60px", opacity: 0.022 }} />

        <div className="fade-up" style={{ position: "relative", zIndex: 2, maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(0,212,170,0.07)", border: "1px solid rgba(0,212,170,0.15)", borderRadius: "100px", padding: "6px 16px", marginBottom: "28px" }}>
            <span style={{ color: "#00D4AA", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em" }}>OUR COMPANY</span>
          </div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "clamp(32px, 6vw, 60px)", color: "#F1F5F9", letterSpacing: "-0.03em", marginBottom: "20px", lineHeight: 1.05 }}>
            Built to Democratize<br />
            <span style={{ background: "linear-gradient(135deg, #00D4AA, #00A88A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Finance</span>
          </h1>
          <p style={{ color: "#64748B", fontSize: "clamp(15px, 2vw, 18px)", lineHeight: 1.8, marginBottom: "40px" }}>
            StoreWallet was founded with a single belief: everyone deserves access to powerful financial tools — not just the wealthy few.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" }}>
            {[{ value: "2024", label: "Founded" }, { value: "10K+", label: "Users" }, { value: "Kenya", label: "HQ" }].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "28px", color: "#00D4AA", marginBottom: "4px" }}>{s.value}</div>
                <div style={{ color: "#475569", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "60px 32px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "clamp(24px, 4vw, 38px)", color: "#F1F5F9", letterSpacing: "-0.02em", marginBottom: "12px" }}>Our Values</h2>
          <p style={{ color: "#475569", fontSize: "15px" }}>The principles that guide everything we build</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {values.map((v, i) => (
            <div key={i} className="value-card">
              <div style={{ fontSize: "28px", marginBottom: "14px" }}>{v.icon}</div>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "15px", color: "#E2E8F0", marginBottom: "8px" }}>{v.title}</h3>
              <p style={{ color: "#475569", fontSize: "13px", lineHeight: 1.75 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: "60px 32px 100px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "clamp(24px, 4vw, 38px)", color: "#F1F5F9", letterSpacing: "-0.02em", marginBottom: "12px" }}>The Team</h2>
          <p style={{ color: "#475569", fontSize: "15px" }}>Passionate people building the future of finance</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px" }}>
          {team.map((m, i) => (
            <div key={i} className="team-card">
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(0,212,170,0.1)", border: "1px solid rgba(0,212,170,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 16px" }}>{m.icon}</div>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "15px", color: "#E2E8F0", marginBottom: "4px" }}>{m.name}</h3>
              <div style={{ color: "#00D4AA", fontSize: "12px", fontWeight: 500, marginBottom: "12px" }}>{m.role}</div>
              <p style={{ color: "#475569", fontSize: "13px", lineHeight: 1.7 }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 32px 100px", textAlign: "center" }}>
        <div style={{ background: "rgba(0,212,170,0.04)", border: "1px solid rgba(0,212,170,0.1)", borderRadius: "24px", padding: "60px 32px", maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "28px", color: "#F1F5F9", marginBottom: "14px" }}>Join Our Mission</h2>
          <p style={{ color: "#475569", fontSize: "15px", marginBottom: "28px" }}>Be part of the financial revolution happening across East Africa and beyond.</p>
          <Link to="/register" style={{ background: "linear-gradient(135deg, #00A88A, #00D4AA)", color: "#050D1A", padding: "14px 32px", borderRadius: "12px", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "15px", textDecoration: "none" }}>
            Get Started Free →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Company;