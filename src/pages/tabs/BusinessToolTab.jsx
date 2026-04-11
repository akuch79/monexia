import React, { useState } from "react";

export default function BusinessToolsTab() {
  return (
    <div style={s.wrap}>
      <h2 style={s.heading}>🛠️ Business Tools</h2>
      <p style={s.sub}>Financial calculators to help manage your business.</p>

      <div style={s.grid}>
        <LoanCalculator />
        <ProfitCalculator />
        <ROICalculator />
        <TaxCalculator />
      </div>

      <Footer />
    </div>
  );
}

function LoanCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate]           = useState("");
  const [months, setMonths]       = useState("");
  const [result, setResult]       = useState(null);

  const calculate = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseInt(months);
    if (!P || !r || !n) return;
    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setResult({ monthly: monthly.toFixed(2), total: (monthly * n).toFixed(2) });
  };

  return (
    <CalcCard title="🏦 Loan Calculator" accent="#7eb8ff">
      <Input placeholder="Principal (KES)"           onChange={e => setPrincipal(e.target.value)} />
      <Input placeholder="Annual Interest Rate (%)"  onChange={e => setRate(e.target.value)} />
      <Input placeholder="Duration (months)"         onChange={e => setMonths(e.target.value)} />
      <CalcBtn onClick={calculate}>Calculate</CalcBtn>
      {result && (
        <Result accent="#7eb8ff">
          <Row label="Monthly Payment" value={`KES ${result.monthly}`} />
          <Row label="Total Repayment" value={`KES ${result.total}`} />
        </Result>
      )}
    </CalcCard>
  );
}

function ProfitCalculator() {
  const [revenue, setRevenue] = useState("");
  const [costs, setCosts]     = useState("");
  const [result, setResult]   = useState(null);

  const calculate = () => {
    const r = parseFloat(revenue), c = parseFloat(costs);
    if (!r || !c) return;
    const profit = r - c;
    setResult({ profit: profit.toFixed(2), margin: ((profit / r) * 100).toFixed(2) });
  };

  return (
    <CalcCard title="📊 Profit Calculator" accent="#00e5a0">
      <Input placeholder="Total Revenue (KES)" onChange={e => setRevenue(e.target.value)} />
      <Input placeholder="Total Costs (KES)"   onChange={e => setCosts(e.target.value)} />
      <CalcBtn onClick={calculate} accent="#00e5a0">Calculate</CalcBtn>
      {result && (
        <Result accent="#00e5a0">
          <Row label="Net Profit"     value={`KES ${result.profit}`} />
          <Row label="Profit Margin"  value={`${result.margin}%`} />
        </Result>
      )}
    </CalcCard>
  );
}

function ROICalculator() {
  const [gain, setGain] = useState("");
  const [cost, setCost] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const g = parseFloat(gain), c = parseFloat(cost);
    if (!g || !c) return;
    setResult((((g - c) / c) * 100).toFixed(2));
  };

  return (
    <CalcCard title="📈 ROI Calculator" accent="#f9a825">
      <Input placeholder="Final Value / Gain (KES)"   onChange={e => setGain(e.target.value)} />
      <Input placeholder="Initial Investment (KES)"   onChange={e => setCost(e.target.value)} />
      <CalcBtn onClick={calculate} accent="#f9a825">Calculate</CalcBtn>
      {result && (
        <Result accent="#f9a825">
          <Row label="Return on Investment" value={`${result}%`} />
        </Result>
      )}
    </CalcCard>
  );
}

function TaxCalculator() {
  const [income, setIncome] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const monthly = parseFloat(income);
    const annual  = monthly * 12;
    if (!annual) return;
    let tax = 0;
    if      (annual <= 288000)  tax = annual * 0.10;
    else if (annual <= 388000)  tax = 28800  + (annual - 288000) * 0.25;
    else if (annual <= 6000000) tax = 53800  + (annual - 388000) * 0.30;
    else if (annual <= 9600000) tax = 1737400 + (annual - 6000000) * 0.325;
    else                        tax = 2907400 + (annual - 9600000) * 0.35;
    setResult({ tax: (tax / 12).toFixed(2), net: (monthly - tax / 12).toFixed(2) });
  };

  return (
    <CalcCard title="🧾 PAYE Tax Calculator" accent="#ff6b6b">
      <Input placeholder="Monthly Gross Income (KES)" onChange={e => setIncome(e.target.value)} />
      <CalcBtn onClick={calculate} accent="#ff6b6b">Calculate</CalcBtn>
      {result && (
        <Result accent="#ff6b6b">
          <Row label="Monthly Tax (PAYE)" value={`KES ${result.tax}`} />
          <Row label="Net Take-home"      value={`KES ${result.net}`} />
        </Result>
      )}
    </CalcCard>
  );
}

// ── Shared sub-components ──
const CalcCard = ({ title, accent = "#7eb8ff", children }) => (
  <div style={{ ...s.card, borderTopColor: accent }}>
    <h3 style={{ ...s.cardTitle, color: accent }}>{title}</h3>
    {children}
  </div>
);

const Input = (props) => (
  <input
    type="number" {...props}
    style={s.input}
  />
);

const CalcBtn = ({ onClick, accent = "#7eb8ff", children }) => (
  <button onClick={onClick} style={{ ...s.btn, background: `${accent}18`, color: accent, borderColor: `${accent}40` }}>
    {children}
  </button>
);

const Result = ({ accent = "#7eb8ff", children }) => (
  <div style={{ ...s.result, borderColor: `${accent}30`, background: `${accent}08` }}>
    {children}
  </div>
);

const Row = ({ label, value }) => (
  <div style={s.resultRow}>
    <span style={s.resultLabel}>{label}</span>
    <span style={s.resultValue}>{value}</span>
  </div>
);

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
  wrap:        { display: "flex", flexDirection: "column", gap: "6px" },
  heading:     { fontFamily: "'Syne',sans-serif", fontSize: "20px", fontWeight: 800, color: "#e8f0fe" },
  sub:         { fontSize: "13px", color: "#4a6080", marginBottom: "16px" },
  grid:        { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" },
  card:        { background: "rgba(126,184,255,0.03)", borderRadius: "14px", padding: "20px", border: "1px solid rgba(126,184,255,0.08)", borderTop: "3px solid", display: "flex", flexDirection: "column", gap: "10px" },
  cardTitle:   { fontFamily: "'Syne',sans-serif", fontSize: "14px", fontWeight: 800, marginBottom: "4px" },
  input:       { padding: "10px 13px", borderRadius: "8px", border: "1px solid rgba(126,184,255,0.12)", background: "#0a1220", color: "#c5d8f5", fontSize: "13px", outline: "none", width: "100%", fontFamily: "'DM Sans',sans-serif" },
  btn:         { padding: "10px", border: "1px solid", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 700, transition: "opacity 0.2s", fontFamily: "'DM Sans',sans-serif" },
  result:      { borderRadius: "8px", padding: "12px 14px", border: "1px solid", display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" },
  resultRow:   { display: "flex", justifyContent: "space-between", alignItems: "center" },
  resultLabel: { fontSize: "12px", color: "#4a6080" },
  resultValue: { fontSize: "14px", fontWeight: 700, color: "#c5d8f5", fontFamily: "'Syne',sans-serif" },
};

const f = {
  footer: { marginTop: "30px", paddingTop: "20px", borderTop: "1px solid rgba(126,184,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" },
  text:   { fontSize: "12px", color: "#2a3a55" },
  links:  { display: "flex", gap: "8px", alignItems: "center" },
  link:   { fontSize: "12px", color: "#4a6080", cursor: "pointer" },
  dot:    { fontSize: "12px", color: "#2a3a55" },
};