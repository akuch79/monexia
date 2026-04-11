import React, { useState } from "react";
import { getUserFromToken } from "../api/api.js";
import { useNavigate } from "react-router-dom";

const initialInvestments = [
  { name: "Stocks", emoji: "📈", description: "Equity investments that can grow over time but carry market risk.", amount: 0, color: "#4f46e5" },
  { name: "Bonds", emoji: "🏦", description: "Fixed income investments with regular interest payments.", amount: 0, color: "#16a34a" },
  { name: "Real Estate", emoji: "🏠", description: "Property investments that can appreciate and generate rental income.", amount: 0, color: "#f59e0b" },
  { name: "Mutual Funds", emoji: "💼", description: "Diversified portfolio managed by professionals.", amount: 0, color: "#10b981" },
  { name: "Savings Accounts", emoji: "💰", description: "Low-risk investments with modest returns and high liquidity.", amount: 0, color: "#f43f5e" },
];

export default function Investment() {
  const navigate = useNavigate();
  const user = getUserFromToken();
  const [investments, setInvestments] = useState(initialInvestments);

  const addAmount = (index, value) => {
    if (!value || isNaN(value) || value <= 0) return;
    const updated = [...investments];
    updated[index].amount += parseFloat(value);
    setInvestments(updated);
  };

  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div
      style={{
        padding: "3rem 1rem",
        maxWidth: "900px",
        margin: "0 auto",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        color: "#ffffff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2.8rem", textAlign: "center", marginBottom: "0.5rem", color: "#facc15", textShadow: "2px 2px 10px #000" }}>
        💹 Investments Portfolio
      </h1>
      <p style={{ textAlign: "center", marginBottom: "2rem", fontSize: "1.1rem", color: "#cbd5e1" }}>
        Hello {user?.name || "Investor"}! Track your investments independently.
      </p>

      <div style={{
        textAlign: "center",
        marginBottom: "2rem",
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: "#facc15",
        textShadow: "0 0 15px #facc15"
      }}>
        Total Invested: KES {totalInvestment.toLocaleString()}
      </div>

      <div style={{ display: "grid", gap: "1.5rem" }}>
        {investments.map((inv, idx) => (
          <div
            key={idx}
            style={{
              padding: "1.5rem 2rem",
              borderRadius: "15px",
              background: `linear-gradient(135deg, ${inv.color}, rgba(255,255,255,0.2))`,
              boxShadow: `0 4px 15px rgba(0,0,0,0.3), 0 0 10px ${inv.color}`,
              transition: "all 0.4s ease",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-7px) scale(1.02)";
              e.currentTarget.style.boxShadow = `0 10px 25px rgba(0,0,0,0.5), 0 0 20px ${inv.color}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = `0 4px 15px rgba(0,0,0,0.3), 0 0 10px ${inv.color}`;
            }}
          >
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#fffacd", fontSize: "1.4rem" }}>
              {inv.emoji} {inv.name} – KES {inv.amount.toLocaleString()}
            </h3>
            <p style={{ margin: "0 0 1rem 0", lineHeight: 1.6 }}>{inv.description}</p>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <input
                type="number"
                placeholder="Add amount"
                style={{
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "none",
                  flex: "1",
                  fontSize: "1rem",
                  outline: "none",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addAmount(idx, e.target.value);
                    e.target.value = "";
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = e.target.previousSibling;
                  addAmount(idx, input.value);
                  input.value = "";
                }}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "#facc15",
                  color: "#1f2937",
                  fontWeight: "bold",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#eab308")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#facc15")}
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "12px 25px",
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#ff6b6b",
            color: "#ffffff",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#ff4757")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff6b6b")}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}