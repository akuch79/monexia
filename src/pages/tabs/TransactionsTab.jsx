import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TransactionsTab = ({ transactions, onRefresh }) => {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");
  const [deleting, setDeleting] = useState(null);
  const token = localStorage.getItem("token");

  const filtered = transactions.filter(t => {
    const matchType = filter === "all" || t.type === filter;
    const matchSearch = !search || t.description?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    setDeleting(id);
    try {
      await axios.delete(`${API_URL}/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Transaction deleted");
      onRefresh();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div style={s.wrap}>
      <div style={s.topRow}>
        <h2 style={s.heading}>All Transactions</h2>
        <button onClick={onRefresh} style={s.refreshBtn}>↻ Refresh</button>
      </div>

      {/* Search + Filter */}
      <div style={s.controlRow}>
        <input
          type="text" placeholder="Search transactions..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={s.searchInput}
        />
        <div style={s.filterBtns}>
          {["all", "income", "expense"].map(f => (
            <button
              key={f} onClick={() => setFilter(f)}
              style={{
                ...s.filterBtn,
                background:  filter === f ? (f === "income" ? "rgba(0,229,160,0.12)" : f === "expense" ? "rgba(255,107,107,0.12)" : "rgba(126,184,255,0.12)") : "transparent",
                color:       filter === f ? (f === "income" ? "#00e5a0" : f === "expense" ? "#ff6b6b" : "#7eb8ff") : "#8899bb",
                borderColor: filter === f ? (f === "income" ? "rgba(0,229,160,0.3)" : f === "expense" ? "rgba(255,107,107,0.3)" : "rgba(126,184,255,0.3)") : "rgba(126,184,255,0.1)",
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>📭</div>
          <p style={s.emptyText}>No transactions yet</p>
          <p style={s.emptySub}>Add your first transaction to get started</p>
        </div>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {["Description", "Type", "Amount", "Date", ""].map((h, i) => (
                  <th key={i} style={{ ...s.th, textAlign: i >= 2 ? "right" : "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t._id || i} style={s.row}>
                  <td style={s.td}>
                    <span style={s.desc}>{t.description || "—"}</span>
                    {t.category && <span style={s.catBadge}>{t.category}</span>}
                  </td>
                  <td style={s.td}>
                    <span style={{
                      ...s.typeBadge,
                      background: t.type === "income" ? "rgba(0,229,160,0.1)" : "rgba(255,107,107,0.1)",
                      color:      t.type === "income" ? "#00e5a0" : "#ff6b6b",
                      borderColor: t.type === "income" ? "rgba(0,229,160,0.25)" : "rgba(255,107,107,0.25)",
                    }}>
                      {t.type === "income" ? "▲" : "▼"} {t.type}
                    </span>
                  </td>
                  <td style={{ ...s.td, textAlign: "right" }}>
                    <span style={{ color: t.type === "income" ? "#00e5a0" : "#ff6b6b", fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>
                      {t.type === "income" ? "+" : "-"}${Number(t.amount).toFixed(2)}
                    </span>
                  </td>
                  <td style={{ ...s.td, textAlign: "right", color: "#4a6080", fontSize: "12px" }}>
                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td style={{ ...s.td, textAlign: "right" }}>
                    <button
                      onClick={() => handleDelete(t._id)}
                      disabled={deleting === t._id}
                      style={s.delBtn}
                    >
                      {deleting === t._id ? "..." : "✕"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={s.count}>
        Showing {filtered.length} of {transactions.length} transactions
      </div>

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
  wrap:         { display: "flex", flexDirection: "column", gap: "16px" },
  topRow:       { display: "flex", justifyContent: "space-between", alignItems: "center" },
  heading:      { fontFamily: "'Syne',sans-serif", fontSize: "20px", fontWeight: 800, color: "#e8f0fe" },
  refreshBtn:   { background: "rgba(126,184,255,0.08)", border: "1px solid rgba(126,184,255,0.15)", borderRadius: "8px", color: "#7eb8ff", cursor: "pointer", fontSize: "12px", fontWeight: 600, padding: "7px 14px" },
  controlRow:   { display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" },
  searchInput:  { flex: "1", minWidth: "200px", padding: "9px 14px", borderRadius: "10px", border: "1px solid rgba(126,184,255,0.12)", background: "#0a1220", color: "#c5d8f5", fontSize: "13px", outline: "none", fontFamily: "'DM Sans',sans-serif" },
  filterBtns:   { display: "flex", gap: "6px" },
  filterBtn:    { padding: "8px 14px", borderRadius: "8px", border: "1px solid", cursor: "pointer", fontSize: "12px", fontWeight: 600, transition: "all 0.2s", fontFamily: "'DM Sans',sans-serif" },
  tableWrap:    { overflowX: "auto" },
  table:        { width: "100%", borderCollapse: "collapse" },
  th:           { padding: "10px 14px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#2a3a55", borderBottom: "1px solid rgba(126,184,255,0.08)" },
  row:          { borderBottom: "1px solid rgba(126,184,255,0.05)", transition: "background 0.15s" },
  td:           { padding: "12px 14px", fontSize: "13px", color: "#c5d8f5", verticalAlign: "middle" },
  desc:         { fontWeight: 500 },
  catBadge:     { marginLeft: "8px", fontSize: "11px", color: "#4a6080", background: "rgba(126,184,255,0.06)", borderRadius: "4px", padding: "2px 6px" },
  typeBadge:    { padding: "3px 10px", borderRadius: "6px", border: "1px solid", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" },
  delBtn:       { background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: "6px", color: "#ff6b6b", cursor: "pointer", fontSize: "11px", padding: "4px 8px" },
  empty:        { textAlign: "center", padding: "50px 20px" },
  emptyIcon:    { fontSize: "40px", marginBottom: "12px" },
  emptyText:    { fontFamily: "'Syne',sans-serif", fontSize: "16px", fontWeight: 700, color: "#c5d8f5", marginBottom: "4px" },
  emptySub:     { fontSize: "13px", color: "#4a6080" },
  count:        { fontSize: "12px", color: "#2a3a55", textAlign: "right" },
};

const f = {
  footer: { marginTop: "10px", paddingTop: "20px", borderTop: "1px solid rgba(126,184,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" },
  text:   { fontSize: "12px", color: "#2a3a55" },
  links:  { display: "flex", gap: "8px", alignItems: "center" },
  link:   { fontSize: "12px", color: "#4a6080", cursor: "pointer" },
  dot:    { fontSize: "12px", color: "#2a3a55" },
};

export default TransactionsTab;