import React, { useContext, useState } from "react";
import { WalletContext } from "../context/WalletContext";

const Transactions = () => {
  const { transactions } = useContext(WalletContext);
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? transactions : transactions.filter(t => t.type === filter);

  return (
    <div style={{ background: "#050D1A", minHeight: "100vh", padding: "40px 32px", fontFamily: "DM Sans, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .tx-row { animation: fadeUp 0.35s ease both; transition: background 0.2s; }
        .tx-row:hover { background: rgba(255,255,255,0.03) !important; }
        .filter-btn {
          padding: 8px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "32px", color: "#F1F5F9", letterSpacing: "-0.02em", marginBottom: "6px" }}>Transactions</h1>
            <p style={{ color: "#475569", fontSize: "14px" }}>{transactions.length} total transactions</p>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: "8px" }}>
            {["All", "Deposit", "Withdraw"].map(f => (
              <button key={f} className="filter-btn" onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? "rgba(0,212,170,0.12)" : "transparent",
                  border: `1px solid ${filter === f ? "rgba(0,212,170,0.3)" : "rgba(255,255,255,0.06)"}`,
                  color: filter === f ? "#00D4AA" : "#475569",
                }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: "rgba(8,18,36,0.8)", border: "1px solid rgba(0,212,170,0.08)", borderRadius: "20px", overflow: "hidden" }}>
          {/* Table Header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            {["Transaction", "Type", "Amount", "Date"].map(h => (
              <span key={h} style={{ color: "#334155", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div style={{ padding: "60px 24px", textAlign: "center", color: "#334155", fontSize: "14px" }}>
              No transactions found
            </div>
          ) : (
            filtered.map((t, i) => (
              <div key={i} className="tx-row" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.03)", animationDelay: `${i * 0.04}s` }}>
                {/* Icon + label */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "11px", background: t.type === "Deposit" ? "rgba(0,212,170,0.1)" : "rgba(248,113,113,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>
                    {t.type === "Deposit" ? "⬇️" : "⬆️"}
                  </div>
                  <span style={{ color: "#CBD5E1", fontSize: "14px", fontWeight: 400 }}>{t.type}</span>
                </div>

                {/* Badge */}
                <div>
                  <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, background: t.type === "Deposit" ? "rgba(0,212,170,0.1)" : "rgba(248,113,113,0.1)", color: t.type === "Deposit" ? "#00D4AA" : "#F87171", border: `1px solid ${t.type === "Deposit" ? "rgba(0,212,170,0.2)" : "rgba(248,113,113,0.2)"}` }}>
                    {t.type}
                  </span>
                </div>

                {/* Amount */}
                <span style={{ color: t.type === "Deposit" ? "#00D4AA" : "#F87171", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "15px" }}>
                  {t.type === "Deposit" ? "+" : "-"}${t.amount.toLocaleString()}
                </span>

                {/* Date */}
                <span style={{ color: "#475569", fontSize: "13px" }}>{t.date || "—"}</span>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {transactions.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "20px" }}>
            {[
              { label: "Total In", value: `+$${transactions.filter(t => t.type === "Deposit").reduce((a, b) => a + b.amount, 0).toLocaleString()}`, color: "#00D4AA" },
              { label: "Total Out", value: `-$${transactions.filter(t => t.type === "Withdraw").reduce((a, b) => a + b.amount, 0).toLocaleString()}`, color: "#F87171" },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(8,18,36,0.8)", border: "1px solid rgba(0,212,170,0.06)", borderRadius: "14px", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#475569", fontSize: "13px" }}>{s.label}</span>
                <span style={{ color: s.color, fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "18px" }}>{s.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;