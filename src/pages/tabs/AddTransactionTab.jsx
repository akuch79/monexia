import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"; // ✅ FIXED: was process.env

const AddTransactionTab = ({
  newTransaction, setNewTransaction,
  phone, setPhone,
  paymentAmount, setPaymentAmount,
  handleAddTransaction, handlePayment,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("none");
  const token = localStorage.getItem("token");

  const handleFlutterwave = async () => {
    if (!newTransaction.amount || newTransaction.amount <= 0)
      return toast.error("Amount must be greater than 0");
    try {
      const res = await axios.post(
        `${API_URL}/flutterwave/initiate`,
        { amount: newTransaction.amount, currency: "KES", email: "user@mail.com", name: "User" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = res.data.checkoutUrl;
    } catch {
      toast.error("Flutterwave payment failed");
    }
  };

  const onSubmit = (e) => {
    if (paymentMethod === "mpesa") return handlePayment(e);
    if (paymentMethod === "flutterwave") { e.preventDefault(); return handleFlutterwave(); }
    return handleAddTransaction(e);
  };

  return (
    <div style={s.wrap}>
      <h2 style={s.heading}>Add Transaction</h2>
      <p style={s.sub}>Record income, expenses, or trigger a payment</p>

      <form onSubmit={onSubmit} style={s.form}>
        {/* Amount */}
        <div style={s.field}>
          <label style={s.label}>Amount (KES)</label>
          <input
            type="number" min="1" required
            placeholder="0.00"
            value={paymentMethod === "mpesa" ? paymentAmount : newTransaction.amount}
            onChange={e =>
              paymentMethod === "mpesa"
                ? setPaymentAmount(e.target.value)
                : setNewTransaction({ ...newTransaction, amount: e.target.value })
            }
            style={s.input}
          />
        </div>

        {/* Type */}
        <div style={s.field}>
          <label style={s.label}>Type</label>
          <select
            value={newTransaction.type}
            onChange={e => setNewTransaction({ ...newTransaction, type: e.target.value })}
            style={s.input}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Description */}
        <div style={s.field}>
          <label style={s.label}>Description</label>
          <input
            type="text" placeholder="What's this for?"
            value={newTransaction.description}
            onChange={e => setNewTransaction({ ...newTransaction, description: e.target.value })}
            style={s.input}
          />
        </div>

        {/* Payment Method */}
        <div style={s.field}>
          <label style={s.label}>Payment Method</label>
          <div style={s.methodRow}>
            {[
              { val: "none",         label: "Manual",       color: "#7eb8ff" },
              { val: "mpesa",        label: "M-Pesa",       color: "#00e5a0" },
              { val: "flutterwave",  label: "Card/Mobile",  color: "#f9a825" },
            ].map(m => (
              <button
                key={m.val} type="button"
                onClick={() => setPaymentMethod(m.val)}
                style={{
                  ...s.methodBtn,
                  borderColor: paymentMethod === m.val ? m.color : "rgba(126,184,255,0.15)",
                  color:       paymentMethod === m.val ? m.color : "#8899bb",
                  background:  paymentMethod === m.val ? `${m.color}18` : "transparent",
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* M-Pesa phone */}
        {paymentMethod === "mpesa" && (
          <div style={s.field}>
            <label style={s.label}>Phone Number</label>
            <input
              type="text" placeholder="2547xxxxxxxx" required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={{ ...s.input, borderColor: "rgba(0,229,160,0.35)" }}
            />
            <span style={s.hint}>Format: 2547XXXXXXXX (12 digits)</span>
          </div>
        )}

        <button
          type="submit"
          style={{
            ...s.btn,
            background: paymentMethod === "mpesa"
              ? "linear-gradient(135deg,#00c985,#00e5a0)"
              : paymentMethod === "flutterwave"
              ? "linear-gradient(135deg,#e68900,#f9a825)"
              : "linear-gradient(135deg,#3a7bd5,#7eb8ff)",
          }}
        >
          {paymentMethod === "none" ? "➕ Add Transaction"
            : paymentMethod === "mpesa" ? "📲 Send M-Pesa STK Push"
            : "💳 Pay with Card / Mobile"}
        </button>
      </form>

      <Footer />
    </div>
  );
};

const Footer = () => (
  <footer style={f.footer}>
    <span style={f.text}>© {new Date().getFullYear()} Monexia · Built for smart finance</span>
    <div style={f.links}>
      <span style={f.link}>Privacy</span>
      <span style={f.dot}>·</span>
      <span style={f.link}>Terms</span>
      <span style={f.dot}>·</span>
      <span style={f.link}>Support</span>
    </div>
  </footer>
);

const s = {
  wrap:      { display: "flex", flexDirection: "column", gap: "6px" },
  heading:   { fontFamily: "'Syne',sans-serif", fontSize: "20px", fontWeight: 800, color: "#e8f0fe", marginBottom: "2px" },
  sub:       { fontSize: "13px", color: "#4a6080", marginBottom: "20px" },
  form:      { display: "flex", flexDirection: "column", gap: "16px" },
  field:     { display: "flex", flexDirection: "column", gap: "6px" },
  label:     { fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#4a6080" },
  input: {
    padding: "11px 14px", borderRadius: "10px",
    border: "1px solid rgba(126,184,255,0.15)",
    background: "#0a1220", color: "#c5d8f5",
    fontSize: "14px", outline: "none",
    fontFamily: "'DM Sans',sans-serif",
  },
  methodRow: { display: "flex", gap: "10px", flexWrap: "wrap" },
  methodBtn: {
    flex: "1", padding: "10px 14px", borderRadius: "10px",
    border: "1px solid", cursor: "pointer", fontSize: "13px",
    fontWeight: 600, transition: "all 0.2s", fontFamily: "'DM Sans',sans-serif",
  },
  hint:      { fontSize: "11px", color: "#4a6080" },
  btn: {
    padding: "13px", border: "none", borderRadius: "10px",
    color: "#080e1a", fontSize: "15px", fontWeight: 800,
    cursor: "pointer", marginTop: "6px", fontFamily: "'Syne',sans-serif",
    letterSpacing: "0.2px",
  },
};

const f = {
  footer:  { marginTop: "40px", paddingTop: "20px", borderTop: "1px solid rgba(126,184,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" },
  text:    { fontSize: "12px", color: "#2a3a55" },
  links:   { display: "flex", gap: "8px", alignItems: "center" },
  link:    { fontSize: "12px", color: "#4a6080", cursor: "pointer" },
  dot:     { fontSize: "12px", color: "#2a3a55" },
};

export default AddTransactionTab;