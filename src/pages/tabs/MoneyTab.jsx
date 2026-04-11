import React, { useState } from "react";
import { toast } from "react-toastify";

const CURRENCIES = [
  { code: "KES", flag: "🇰🇪", name: "Kenyan Shilling" },
  { code: "SSP", flag: "🇸🇸", name: "South Sudanese Pound" },
  { code: "UGX", flag: "🇺🇬", name: "Ugandan Shilling" },
  { code: "TZS", flag: "🇹🇿", name: "Tanzanian Shilling" },
  { code: "ETB", flag: "🇪🇹", name: "Ethiopian Birr" },
  { code: "RWF", flag: "🇷🇼", name: "Rwandan Franc" },
  { code: "USD", flag: "🇺🇸", name: "US Dollar" },
  { code: "EUR", flag: "🇪🇺", name: "Euro" },
  { code: "GBP", flag: "🇬🇧", name: "British Pound" },
  { code: "NGN", flag: "🇳🇬", name: "Nigerian Naira" },
  { code: "ZAR", flag: "🇿🇦", name: "South African Rand" },
  { code: "GHS", flag: "🇬🇭", name: "Ghanaian Cedi" },
  { code: "AED", flag: "🇦🇪", name: "UAE Dirham" },
  { code: "INR", flag: "🇮🇳", name: "Indian Rupee" },
  { code: "CNY", flag: "🇨🇳", name: "Chinese Yuan" },
];

// Approximate rates relative to KES
const RATES = {
  KES: 1, SSP: 0.13, UGX: 0.029, TZS: 0.038, ETB: 0.67,
  RWF: 0.075, USD: 130, EUR: 142, GBP: 165, NGN: 0.089,
  ZAR: 7.1, GHS: 11.2, AED: 35.4, INR: 1.56, CNY: 18.1,
};

const LOAN_PLANS = [
  { id: "micro", label: "Micro Loan", amount: "KES 1K – 10K", rate: "5%", duration: "1 Month", icon: "🌱", color: "#4ade80" },
  { id: "personal", label: "Personal Loan", amount: "KES 10K – 100K", rate: "8%", duration: "6 Months", icon: "👤", color: "#60a5fa" },
  { id: "business", label: "Business Loan", amount: "KES 100K – 1M", rate: "12%", duration: "12 Months", icon: "🏢", color: "#fbbf24" },
  { id: "cross", label: "Cross-Border Loan", amount: "USD 500 – 10K", rate: "10%", duration: "6–24 Months", icon: "🌍", color: "#c084fc" },
];

export default function MoneyTab() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sendForm, setSendForm] = useState({ recipient: "", amount: "", currency: "KES", note: "" });
  const [receiveForm, setReceiveForm] = useState({ currency: "KES", amount: "" });
  const [loanForm, setLoanForm] = useState({ plan: "", amount: "", duration: "", purpose: "" });
  const [converted, setConverted] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const handleSend = (e) => {
    e.preventDefault();
    toast.success(`💸 Sent ${sendForm.amount} ${sendForm.currency} to ${sendForm.recipient}!`);
    setSendForm({ recipient: "", amount: "", currency: "KES", note: "" });
  };

  const handleLoanApply = (e) => {
    e.preventDefault();
    toast.success("🏦 Loan application submitted! We'll review within 24 hours.");
    setLoanForm({ plan: "", amount: "", duration: "", purpose: "" });
    setSelectedLoan(null);
  };

  const handleConvert = () => {
    if (!receiveForm.amount || !receiveForm.currency) return;
    const inKES = parseFloat(receiveForm.amount) * RATES[receiveForm.currency];
    setConverted(inKES.toFixed(2));
  };

  const sections = [
    { key: "overview", label: "Overview", icon: "🏦" },
    { key: "send", label: "Send Money", icon: "💸" },
    { key: "receive", label: "Receive", icon: "📥" },
    { key: "loan", label: "Apply Loan", icon: "🌱" },
  ];

  return (
    <div style={s.wrap}>
      {/* Section Tabs */}
      <div style={s.tabs}>
        {sections.map(sec => (
          <button key={sec.key} onClick={() => setActiveSection(sec.key)}
            style={{ ...s.tab, ...(activeSection === sec.key ? s.tabActive : {}) }}>
            <span>{sec.icon}</span> {sec.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeSection === "overview" && (
        <div>
          <h3 style={s.sectionTitle}>Global Money Services</h3>
          <p style={s.subtitle}>Send, receive, and borrow across 30+ countries — including South Sudan, Uganda, Ethiopia and more.</p>
          <div style={s.overviewGrid}>
            {[
              { icon: "💸", title: "Send Money", desc: "Instant transfers to 30+ countries in local currencies", color: "#fbbf24", key: "send" },
              { icon: "📥", title: "Receive Money", desc: "Accept payments from anywhere — auto currency conversion", color: "#4ade80", key: "receive" },
              { icon: "🏦", title: "Apply for a Loan", desc: "Micro to business loans with competitive cross-border rates", color: "#60a5fa", key: "loan" },
              { icon: "🌍", title: "15 Currencies", desc: "KES, SSP, UGX, USD, EUR, GBP, NGN, ZAR & more", color: "#c084fc", key: "overview" },
            ].map(card => (
              <div key={card.title} style={s.overviewCard}
                onClick={() => card.key !== "overview" && setActiveSection(card.key)}>
                <div style={{ ...s.overviewIcon, background: card.color + "22", color: card.color }}>{card.icon}</div>
                <h4 style={s.overviewCardTitle}>{card.title}</h4>
                <p style={s.overviewCardDesc}>{card.desc}</p>
                {card.key !== "overview" && (
                  <span style={{ ...s.overviewAction, color: card.color }}>Get started →</span>
                )}
              </div>
            ))}
          </div>

          {/* Supported Countries */}
          <div style={s.currencyGrid}>
            <h4 style={{ ...s.sectionTitle, fontSize: "1rem", marginBottom: "1rem" }}>Supported Currencies</h4>
            <div style={s.currencyList}>
              {CURRENCIES.map(c => (
                <div key={c.code} style={s.currencyChip}>
                  <span>{c.flag}</span>
                  <span style={{ fontWeight: 700, color: "#f1f5f9", fontSize: "0.8rem" }}>{c.code}</span>
                  <span style={{ color: "#475569", fontSize: "0.72rem" }}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SEND MONEY */}
      {activeSection === "send" && (
        <div style={s.formWrap}>
          <h3 style={s.sectionTitle}>💸 Send Money</h3>
          <p style={s.subtitle}>Transfer funds instantly to anyone, anywhere in the world.</p>
          <form onSubmit={handleSend} style={s.form}>
            <div style={s.row}>
              <div style={s.field}>
                <label style={s.label}>Recipient Name or Phone</label>
                <input style={s.input} placeholder="e.g. +211 912 345 678"
                  value={sendForm.recipient} required
                  onChange={e => setSendForm({ ...sendForm, recipient: e.target.value })} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Currency</label>
                <select style={s.input} value={sendForm.currency}
                  onChange={e => setSendForm({ ...sendForm, currency: e.target.value })}>
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={s.field}>
              <label style={s.label}>Amount</label>
              <input style={s.input} type="number" min="1" placeholder="0.00"
                value={sendForm.amount} required
                onChange={e => setSendForm({ ...sendForm, amount: e.target.value })} />
              {sendForm.amount && sendForm.currency && (
                <span style={s.hint}>
                  ≈ KES {(parseFloat(sendForm.amount || 0) * RATES[sendForm.currency]).toFixed(2)}
                </span>
              )}
            </div>
            <div style={s.field}>
              <label style={s.label}>Note (optional)</label>
              <input style={s.input} placeholder="e.g. Rent payment, School fees..."
                value={sendForm.note}
                onChange={e => setSendForm({ ...sendForm, note: e.target.value })} />
            </div>
            <button type="submit" style={s.btn}>💸 Send Money</button>
          </form>
        </div>
      )}

      {/* RECEIVE MONEY */}
      {activeSection === "receive" && (
        <div style={s.formWrap}>
          <h3 style={s.sectionTitle}>📥 Receive Money</h3>
          <p style={s.subtitle}>Share your details and convert incoming funds to your preferred currency.</p>

          <div style={s.receiveCard}>
            <div style={s.receiveRow}>
              <div style={s.field}>
                <label style={s.label}>Amount You'll Receive</label>
                <input style={s.input} type="number" min="1" placeholder="0.00"
                  value={receiveForm.amount}
                  onChange={e => setReceiveForm({ ...receiveForm, amount: e.target.value })} />
              </div>
              <div style={s.field}>
                <label style={s.label}>In Currency</label>
                <select style={s.input} value={receiveForm.currency}
                  onChange={e => { setReceiveForm({ ...receiveForm, currency: e.target.value }); setConverted(null); }}>
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button onClick={handleConvert} style={{ ...s.btn, background: "linear-gradient(135deg,#4ade80,#22c55e)", color: "#0a1a0a" }}>
              🔄 Convert to KES
            </button>
            {converted && (
              <div style={s.convertResult}>
                <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                  {receiveForm.amount} {receiveForm.currency} =
                </span>
                <span style={{ color: "#4ade80", fontSize: "1.6rem", fontWeight: 800 }}>
                  KES {parseFloat(converted).toLocaleString()}
                </span>
                <span style={{ color: "#475569", fontSize: "0.75rem" }}>*Indicative rate. Final rate applied at transfer time.</span>
              </div>
            )}
          </div>

          <div style={s.shareCard}>
            <h4 style={{ color: "#f1f5f9", marginBottom: "0.8rem", fontSize: "0.95rem" }}>📤 Share Your Receive Details</h4>
            <div style={s.detailRow}><span style={s.detailLabel}>Phone</span><span style={s.detailValue}>+254 *** *** ***</span></div>
            <div style={s.detailRow}><span style={s.detailLabel}>Account ID</span><span style={s.detailValue}>MNXA-00124</span></div>
            <div style={s.detailRow}><span style={s.detailLabel}>Supported</span><span style={s.detailValue}>M-Pesa · Bank · Monexia Wallet</span></div>
          </div>
        </div>
      )}

      {/* LOAN */}
      {activeSection === "loan" && (
        <div style={s.formWrap}>
          <h3 style={s.sectionTitle}>🏦 Apply for a Loan</h3>
          <p style={s.subtitle}>Choose a plan that fits your needs. Funds disbursed within 24 hours.</p>

          {/* Loan Plans */}
          <div style={s.loanGrid}>
            {LOAN_PLANS.map(plan => (
              <div key={plan.id}
                onClick={() => { setSelectedLoan(plan.id); setLoanForm(f => ({ ...f, plan: plan.label })); }}
                style={{ ...s.loanCard, borderColor: selectedLoan === plan.id ? plan.color : "rgba(255,255,255,0.08)", background: selectedLoan === plan.id ? plan.color + "12" : "rgba(255,255,255,0.03)" }}>
                <div style={{ fontSize: "1.8rem", marginBottom: "0.4rem" }}>{plan.icon}</div>
                <h4 style={{ color: "#f1f5f9", fontSize: "0.95rem", fontWeight: 700 }}>{plan.label}</h4>
                <p style={{ color: plan.color, fontSize: "0.8rem", fontWeight: 600, margin: "0.3rem 0" }}>{plan.amount}</p>
                <p style={{ color: "#64748b", fontSize: "0.75rem" }}>Rate: {plan.rate} · {plan.duration}</p>
                {selectedLoan === plan.id && <div style={{ ...s.selectedBadge, background: plan.color }}>✓ Selected</div>}
              </div>
            ))}
          </div>

          {/* Loan Form */}
          <form onSubmit={handleLoanApply} style={{ ...s.form, marginTop: "1.5rem" }}>
            <div style={s.row}>
              <div style={s.field}>
                <label style={s.label}>Loan Amount (KES)</label>
                <input style={s.input} type="number" min="1000" placeholder="e.g. 50000"
                  value={loanForm.amount} required
                  onChange={e => setLoanForm({ ...loanForm, amount: e.target.value })} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Repayment Duration</label>
                <select style={s.input} value={loanForm.duration} required
                  onChange={e => setLoanForm({ ...loanForm, duration: e.target.value })}>
                  <option value="">Select duration...</option>
                  <option>1 Month</option>
                  <option>3 Months</option>
                  <option>6 Months</option>
                  <option>12 Months</option>
                  <option>24 Months</option>
                </select>
              </div>
            </div>
            <div style={s.field}>
              <label style={s.label}>Purpose of Loan</label>
              <select style={s.input} value={loanForm.purpose} required
                onChange={e => setLoanForm({ ...loanForm, purpose: e.target.value })}>
                <option value="">Select purpose...</option>
                <option>Business Capital</option>
                <option>Education</option>
                <option>Medical Emergency</option>
                <option>Home Improvement</option>
                <option>Cross-Border Trade</option>
                <option>Agriculture</option>
                <option>Other</option>
              </select>
            </div>
            <button type="submit" style={s.btn} disabled={!selectedLoan}>
              🚀 Submit Loan Application
            </button>
            {!selectedLoan && <p style={{ color: "#64748b", fontSize: "0.78rem", marginTop: "0.5rem", textAlign: "center" }}>Please select a loan plan above first.</p>}
          </form>
        </div>
      )}
    </div>
  );
}

const s = {
  wrap: { fontFamily: "'DM Sans', sans-serif" },
  tabs: { display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" },
  tab: {
    display: "flex", alignItems: "center", gap: "0.4rem",
    padding: "0.55rem 1.1rem", borderRadius: "10px",
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    color: "#64748b", fontSize: "0.88rem", fontWeight: 600, cursor: "pointer",
    transition: "all 0.2s",
  },
  tabActive: {
    background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
    color: "#0f1b2d", border: "1px solid transparent",
  },
  sectionTitle: { color: "#f1f5f9", fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.4rem" },
  subtitle: { color: "#64748b", fontSize: "0.88rem", marginBottom: "1.5rem", lineHeight: 1.6 },
  overviewGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" },
  overviewCard: {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px", padding: "1.4rem", cursor: "pointer",
    transition: "transform 0.2s, border-color 0.2s",
  },
  overviewIcon: { width: "44px", height: "44px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", marginBottom: "0.8rem" },
  overviewCardTitle: { color: "#f1f5f9", fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.4rem" },
  overviewCardDesc: { color: "#64748b", fontSize: "0.8rem", lineHeight: 1.55 },
  overviewAction: { fontSize: "0.8rem", fontWeight: 600, display: "block", marginTop: "0.7rem" },
  currencyGrid: { marginTop: "1rem" },
  currencyList: { display: "flex", flexWrap: "wrap", gap: "0.6rem" },
  currencyChip: {
    display: "flex", alignItems: "center", gap: "0.4rem",
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "10px", padding: "0.4rem 0.8rem",
  },
  formWrap: { maxWidth: "640px" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  row: { display: "flex", gap: "1rem", flexWrap: "wrap" },
  field: { display: "flex", flexDirection: "column", gap: "0.4rem", flex: 1, minWidth: "180px" },
  label: { color: "#94a3b8", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" },
  input: {
    background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: "10px", padding: "0.8rem 1rem", color: "#f1f5f9",
    fontSize: "0.92rem", fontFamily: "'DM Sans', sans-serif", outline: "none",
    width: "100%", boxSizing: "border-box",
  },
  hint: { color: "#64748b", fontSize: "0.75rem", marginTop: "0.2rem" },
  btn: {
    padding: "0.9rem", background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
    color: "#0f1b2d", fontWeight: 700, fontSize: "0.95rem",
    border: "none", borderRadius: "10px", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", transition: "opacity 0.2s",
  },
  receiveCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "1.5rem", marginBottom: "1rem" },
  receiveRow: { display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" },
  convertResult: { display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem", padding: "1rem", marginTop: "1rem", background: "rgba(74,222,128,0.07)", borderRadius: "12px", border: "1px solid rgba(74,222,128,0.15)" },
  shareCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "1.5rem" },
  detailRow: { display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  detailLabel: { color: "#64748b", fontSize: "0.83rem" },
  detailValue: { color: "#f1f5f9", fontSize: "0.83rem", fontWeight: 600 },
  loanGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.8rem" },
  loanCard: { border: "1.5px solid", borderRadius: "14px", padding: "1.2rem", cursor: "pointer", textAlign: "center", transition: "border-color 0.2s, background 0.2s", position: "relative" },
  selectedBadge: { display: "inline-block", marginTop: "0.6rem", padding: "0.2rem 0.7rem", borderRadius: "999px", color: "#0f1b2d", fontSize: "0.72rem", fontWeight: 700 },
};