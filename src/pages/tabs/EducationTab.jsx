import React, { useState } from "react";

const tips = [
  { category: "💰 Budgeting",      title: "The 50/30/20 Rule",           content: "Spend 50% of your income on needs, 30% on wants, and save 20%. This simple rule helps you stay balanced without feeling restricted." },
  { category: "💰 Budgeting",      title: "Track Every Expense",         content: "Write down every purchase, no matter how small. Most people are surprised to find where their money actually goes each month." },
  { category: "📈 Investing",       title: "Start Early, Start Small",    content: "Thanks to compound interest, even KES 500/month invested at 25 grows far more than KES 2000/month started at 40. Time is your biggest asset." },
  { category: "📈 Investing",       title: "Diversify Your Portfolio",    content: "Never put all your money in one place. Spread across stocks, bonds, real estate, and savings to reduce risk." },
  { category: "🛡️ Emergency Fund", title: "Build a 6-Month Safety Net",  content: "Before investing, save 3–6 months of expenses in an accessible account. This protects you from unexpected job loss or medical bills." },
  { category: "🛡️ Emergency Fund", title: "Keep It Separate",            content: "Store your emergency fund in a different account from your daily spending to avoid accidentally using it." },
  { category: "💳 Debt",            title: "Avalanche vs Snowball",       content: "Avalanche: pay highest-interest debt first (saves more money). Snowball: pay smallest debt first (builds motivation). Pick what works for you." },
  { category: "💳 Debt",            title: "Avoid Lifestyle Inflation",   content: "When your income increases, resist the urge to spend more. Use raises to pay off debt or increase savings instead." },
];

const CATS = ["All", "💰 Budgeting", "📈 Investing", "🛡️ Emergency Fund", "💳 Debt"];

const catAccent = {
  "💰 Budgeting":      "#f9a825",
  "📈 Investing":       "#00e5a0",
  "🛡️ Emergency Fund": "#7eb8ff",
  "💳 Debt":            "#ff6b6b",
};

export default function EducationTab() {
  const [active, setActive]     = useState("All");
  const [expanded, setExpanded] = useState(null);

  const filtered = active === "All" ? tips : tips.filter(t => t.category === active);

  return (
    <div style={s.wrap}>
      <h2 style={s.heading}>📚 Financial Education</h2>
      <p style={s.sub}>Learn the fundamentals of managing your money wisely.</p>

      {/* Category filter */}
      <div style={s.filterRow}>
        {CATS.map(cat => (
          <button
            key={cat}
            onClick={() => { setActive(cat); setExpanded(null); }}
            style={{
              ...s.filterBtn,
              background: active === cat ? "rgba(0,229,160,0.12)" : "rgba(126,184,255,0.05)",
              color:       active === cat ? "#00e5a0" : "#8899bb",
              borderColor: active === cat ? "rgba(0,229,160,0.3)" : "rgba(126,184,255,0.1)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tips accordion */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.map((tip, i) => {
          const accent = catAccent[tip.category] || "#7eb8ff";
          const open = expanded === i;
          return (
            <div
              key={i}
              onClick={() => setExpanded(open ? null : i)}
              style={{
                ...s.tipCard,
                borderLeftColor: accent,
                background: open ? "rgba(126,184,255,0.05)" : "rgba(126,184,255,0.02)",
              }}
            >
              <div style={s.tipHeader}>
                <div>
                  <span style={{ ...s.catTag, color: accent }}>{tip.category}</span>
                  <h3 style={s.tipTitle}>{tip.title}</h3>
                </div>
                <span style={{ color: "#4a6080", fontSize: "13px", flexShrink: 0 }}>
                  {open ? "▲" : "▼"}
                </span>
              </div>
              {open && (
                <p style={s.tipContent}>{tip.content}</p>
              )}
            </div>
          );
        })}
      </div>

      <Footer />
    </div>
  );
}

const Footer = () => (
  <footer style={f.footer}>
    <span style={f.text}>© {new Date().getFullYear()} Monexia · Built for smart finance</span>
    <div style={f.links}>
      <span style={f.link}>Privacy</span><span style={f.dot}>·</span>
      <span style={f.link}>Terms</span><span style={f.dot}>·</span>
      <span style={f.link}>Support</span>
    </div>
  </footer>
);

const s = {
  wrap:      { display: "flex", flexDirection: "column", gap: "6px" },
  heading:   { fontFamily: "'Syne',sans-serif", fontSize: "20px", fontWeight: 800, color: "#e8f0fe" },
  sub:       { fontSize: "13px", color: "#4a6080", marginBottom: "16px" },
  filterRow: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" },
  filterBtn: {
    padding: "7px 16px", borderRadius: "20px", border: "1px solid",
    cursor: "pointer", fontSize: "12px", fontWeight: 600,
    transition: "all 0.2s", fontFamily: "'DM Sans',sans-serif",
  },
  tipCard: {
    borderLeft: "3px solid", borderRadius: "10px",
    padding: "14px 18px", cursor: "pointer",
    border: "1px solid rgba(126,184,255,0.08)",
    borderLeft: "3px solid",
    transition: "background 0.2s",
  },
  tipHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" },
  catTag:    { fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px", display: "block", marginBottom: "3px" },
  tipTitle:  { fontFamily: "'Syne',sans-serif", fontSize: "14px", fontWeight: 700, color: "#c5d8f5", margin: 0 },
  tipContent:{ marginTop: "12px", color: "#8899bb", fontSize: "13px", lineHeight: "1.7" },
};

const f = {
  footer: { marginTop: "30px", paddingTop: "20px", borderTop: "1px solid rgba(126,184,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" },
  text:   { fontSize: "12px", color: "#2a3a55" },
  links:  { display: "flex", gap: "8px", alignItems: "center" },
  link:   { fontSize: "12px", color: "#4a6080", cursor: "pointer" },
  dot:    { fontSize: "12px", color: "#2a3a55" },
};