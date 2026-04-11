import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

const COLORS = ["#00e5a0", "#ff6b6b"];

const AnalyticsTab = ({ totalIncome, totalExpense, transactions }) => {
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0
    ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100)
    : 0;

  // Monthly breakdown
  const monthly = transactions.reduce((acc, t) => {
    const month = t.createdAt
      ? new Date(t.createdAt).toLocaleString("default", { month: "short" })
      : "N/A";
    if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };
    if (t.type === "income") acc[month].income += t.amount;
    else acc[month].expense += t.amount;
    return acc;
  }, {});
  const monthlyData = Object.values(monthly);

  // Pie data
  const pieData = [
    { name: "Income",   value: totalIncome },
    { name: "Expenses", value: totalExpense },
  ];

  // Running balance
  let running = 0;
  const lineData = transactions.map((t, i) => {
    running += t.type === "income" ? t.amount : -t.amount;
    return { name: `#${i + 1}`, balance: parseFloat(running.toFixed(2)) };
  });

  // Category breakdown
  const catMap = transactions.reduce((acc, t) => {
    const k = t.category || "Other";
    acc[k] = (acc[k] || 0) + t.amount;
    return acc;
  }, {});
  const catColors = ["#7eb8ff","#00e5a0","#ff6b6b","#f9a825","#c084fc","#fb923c"];

  const tooltipStyle = {
    contentStyle: { background: "#0d1525", border: "1px solid rgba(126,184,255,0.15)", borderRadius: "10px", color: "#c5d8f5" },
    labelStyle: { color: "#8899bb" },
    cursor: { fill: "rgba(126,184,255,0.05)" },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

      {/* Summary row */}
      <div style={s.cardRow}>
        {[
          { label: "Net Balance",   value: `$${balance.toFixed(2)}`,       color: balance >= 0 ? "#00e5a0" : "#ff6b6b", icon: "⚖️" },
          { label: "Total Income",  value: `$${totalIncome.toFixed(2)}`,   color: "#00e5a0", icon: "📥" },
          { label: "Total Expenses",value: `$${totalExpense.toFixed(2)}`,  color: "#ff6b6b", icon: "📤" },
          { label: "Savings Rate",  value: `${savingsRate}%`,              color: "#7eb8ff", icon: "💹" },
        ].map((c, i) => (
          <div key={i} style={s.card}>
            <span style={s.cardIcon}>{c.icon}</span>
            <p style={s.cardLabel}>{c.label}</p>
            <h2 style={{ ...s.cardValue, color: c.color }}>{c.value}</h2>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div style={s.chartBox}>
        <h3 style={s.chartTitle}>Monthly Income vs Expenses</h3>
        {monthlyData.length ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(126,184,255,0.07)" />
              <XAxis dataKey="month" tick={{ fill: "#4a6080", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#4a6080", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} formatter={v => `$${v.toFixed(2)}`} />
              <Legend wrapperStyle={{ color: "#8899bb", fontSize: "13px" }} />
              <Bar dataKey="income"  fill="#00e5a0" radius={[6,6,0,0]} name="Income" />
              <Bar dataKey="expense" fill="#ff6b6b" radius={[6,6,0,0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        ) : <p style={s.empty}>No transactions yet</p>}
      </div>

      {/* Pie + Line side by side */}
      <div style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}>
        <div style={{ ...s.chartBox, flex: "1 1 260px" }}>
          <h3 style={s.chartTitle}>Income vs Expenses</h3>
          {totalIncome + totalExpense > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData} cx="50%" cy="50%" outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: "#4a6080" }}
                >
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip {...tooltipStyle} formatter={v => `$${v.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={s.empty}>No data yet</p>}
        </div>

        <div style={{ ...s.chartBox, flex: "1 1 260px" }}>
          <h3 style={s.chartTitle}>Running Balance</h3>
          {lineData.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(126,184,255,0.07)" />
                <XAxis dataKey="name" tick={{ fill: "#4a6080", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#4a6080", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} formatter={v => `$${v}`} />
                <Line type="monotone" dataKey="balance" stroke="#7eb8ff" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p style={s.empty}>No data yet</p>}
        </div>
      </div>

      {/* Category breakdown */}
      {Object.keys(catMap).length > 0 && (
        <div style={s.chartBox}>
          <h3 style={s.chartTitle}>Spending by Category</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "6px" }}>
            {Object.entries(catMap).map(([k, v], i) => (
              <div key={k} style={{ ...s.catPill, borderColor: catColors[i % catColors.length], color: catColors[i % catColors.length] }}>
                <span style={{ fontWeight: 700 }}>{k}</span>
                <span style={{ opacity: 0.7, fontSize: "12px", marginLeft: "6px" }}>${v.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

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
  cardRow:   { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" },
  card:      { background: "rgba(126,184,255,0.04)", border: "1px solid rgba(126,184,255,0.1)", borderRadius: "14px", padding: "16px 18px" },
  cardIcon:  { fontSize: "18px", display: "block", marginBottom: "8px" },
  cardLabel: { fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#4a6080", marginBottom: "5px" },
  cardValue: { fontFamily: "'Syne',sans-serif", fontSize: "20px", fontWeight: 800, margin: 0 },
  chartBox:  { background: "rgba(126,184,255,0.03)", border: "1px solid rgba(126,184,255,0.08)", borderRadius: "14px", padding: "20px 22px" },
  chartTitle:{ fontFamily: "'Syne',sans-serif", fontSize: "14px", fontWeight: 700, color: "#c5d8f5", marginBottom: "16px" },
  empty:     { color: "#2a3a55", fontSize: "14px", textAlign: "center", padding: "30px 0" },
  catPill:   { padding: "6px 14px", borderRadius: "20px", border: "1px solid", fontSize: "13px", background: "transparent" },
};

const f = {
  footer: { marginTop: "20px", paddingTop: "20px", borderTop: "1px solid rgba(126,184,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" },
  text:   { fontSize: "12px", color: "#2a3a55" },
  links:  { display: "flex", gap: "8px", alignItems: "center" },
  link:   { fontSize: "12px", color: "#4a6080", cursor: "pointer" },
  dot:    { fontSize: "12px", color: "#2a3a55" },
};

export default AnalyticsTab;