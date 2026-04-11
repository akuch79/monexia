import React, { useEffect, useState } from "react";
import { getTransactions, deleteTransaction } from "../api/api.js";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [filter, setFilter] = useState("all"); // all | income | expense

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getTransactions();
        setTransactions(res);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    setDeletingId(id);
    try {
      await deleteTransaction(id); // ✅ calls backend
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert("Failed to delete. Please try again.");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = transactions.filter((t) =>
    filter === "all" ? true : t.type === filter
  );

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Transactions</h1>

      {/* Summary Cards */}
      <div style={styles.cards}>
        <div style={{ ...styles.card, borderLeft: "4px solid #10b981" }}>
          <p style={styles.cardLabel}>Total Income</p>
          <p style={{ ...styles.cardAmount, color: "#10b981" }}>
            KES {totalIncome.toLocaleString()}
          </p>
        </div>
        <div style={{ ...styles.card, borderLeft: "4px solid #ef4444" }}>
          <p style={styles.cardLabel}>Total Expenses</p>
          <p style={{ ...styles.cardAmount, color: "#ef4444" }}>
            KES {totalExpense.toLocaleString()}
          </p>
        </div>
        <div style={{ ...styles.card, borderLeft: "4px solid #667eea" }}>
          <p style={styles.cardLabel}>Balance</p>
          <p style={{ ...styles.cardAmount, color: balance >= 0 ? "#667eea" : "#ef4444" }}>
            KES {balance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={styles.tabs}>
        {["all", "income", "expense"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...styles.tab,
              background: filter === f ? "#667eea" : "#f1f5f9",
              color: filter === f ? "#fff" : "#64748b",
              fontWeight: filter === f ? 700 : 400,
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <p style={styles.empty}>Loading transactions...</p>
      ) : filtered.length === 0 ? (
        <p style={styles.empty}>No {filter === "all" ? "" : filter} transactions found.</p>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Type</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Amount</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t._id} style={styles.row}>
                  <td style={styles.td}>
                    {new Date(t.date || t.createdAt).toLocaleDateString("en-KE", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  <td style={styles.td}>{t.description}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      background: t.type === "income" ? "#dcfce7" : "#fee2e2",
                      color: t.type === "income" ? "#16a34a" : "#dc2626",
                    }}>
                      {t.type === "income" ? "▲" : "▼"} {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    </span>
                  </td>
                  <td style={{ ...styles.td, textAlign: "right", fontWeight: 600,
                    color: t.type === "income" ? "#16a34a" : "#dc2626" }}>
                    {t.type === "income" ? "+" : "-"} KES {t.amount.toLocaleString()}
                  </td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <button
                      onClick={() => handleDelete(t._id)}
                      disabled={deletingId === t._id}
                      style={styles.deleteBtn}
                      title="Delete"
                    >
                      {deletingId === t._id ? "..." : "🗑"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: "0" },
  heading: { fontSize: "22px", fontWeight: 800, color: "#1a202c", marginBottom: "20px" },
  cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" },
  card: { background: "#fff", borderRadius: "12px", padding: "16px 20px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" },
  cardLabel: { fontSize: "12px", color: "#94a3b8", marginBottom: "6px", fontWeight: 600, textTransform: "uppercase" },
  cardAmount: { fontSize: "20px", fontWeight: 800, margin: 0 },
  tabs: { display: "flex", gap: "8px", marginBottom: "20px" },
  tab: { padding: "7px 18px", borderRadius: "20px", border: "none", cursor: "pointer", fontSize: "13px", transition: "all 0.2s" },
  tableWrap: { overflowX: "auto", borderRadius: "12px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff" },
  thead: { background: "#f8fafc" },
  th: { padding: "12px 16px", fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", textAlign: "left", borderBottom: "1px solid #e2e8f0" },
  row: { borderBottom: "1px solid #f1f5f9", transition: "background 0.15s" },
  td: { padding: "13px 16px", fontSize: "14px", color: "#374151" },
  badge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 },
  deleteBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "16px", opacity: 0.7, padding: "4px 8px" },
  empty: { textAlign: "center", color: "#94a3b8", padding: "40px 0", fontSize: "15px" },
};