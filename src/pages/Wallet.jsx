import React, { useState, useContext } from "react";
import { WalletContext } from "../context/WalletContext";

const Wallet = () => {
  const { balance, deposit, withdraw } = useContext(WalletContext);
  const [amount, setAmount] = useState("");
  const [feedback, setFeedback] = useState(null);

  const handleDeposit = () => {
    const val = Number(amount);
    if (!val || val <= 0) return setFeedback({ type: "error", msg: "Enter a valid amount." });
    deposit(val);
    setFeedback({ type: "success", msg: `$${val} deposited successfully!` });
    setAmount("");
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleWithdraw = () => {
    const val = Number(amount);
    if (!val || val <= 0) return setFeedback({ type: "error", msg: "Enter a valid amount." });
    if (val > balance) return setFeedback({ type: "error", msg: "Insufficient funds." });
    withdraw(val);
    setFeedback({ type: "success", msg: `$${val} withdrawn successfully!` });
    setAmount("");
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div style={{ background: "#050D1A", minHeight: "100vh", padding: "40px 32px", fontFamily: "DM Sans, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        .wallet-card { animation: fadeUp 0.5s 0.1s ease both; }
        .action-card { animation: fadeUp 0.5s 0.25s ease both; }
        .amount-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(0,212,170,0.15);
          border-radius: 14px;
          padding: 16px 20px;
          color: #E2E8F0;
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          font-weight: 700;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .amount-input:focus { border-color: rgba(0,212,170,0.4); }
        .amount-input::placeholder { color: #334155; }
        .deposit-btn {
          flex: 1;
          padding: 16px;
          border-radius: 12px;
          background: linear-gradient(135deg, #00A88A, #00D4AA);
          color: #050D1A;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 15px;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
        }
        .deposit-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .withdraw-btn {
          flex: 1;
          padding: 16px;
          border-radius: 12px;
          background: transparent;
          color: #F87171;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 15px;
          border: 1px solid rgba(248,113,113,0.3);
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }
        .withdraw-btn:hover { background: rgba(248,113,113,0.08); transform: translateY(-1px); }
        .quick-btn {
          padding: 8px 16px;
          border-radius: 8px;
          background: rgba(0,212,170,0.07);
          border: 1px solid rgba(0,212,170,0.15);
          color: #00D4AA;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .quick-btn:hover { background: rgba(0,212,170,0.14); }
      `}</style>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "32px", color: "#F1F5F9", letterSpacing: "-0.02em", marginBottom: "6px" }}>My Wallet</h1>
          <p style={{ color: "#475569", fontSize: "14px" }}>Manage your deposits and withdrawals</p>
        </div>

        {/* Balance Card */}
        <div className="wallet-card" style={{ background: "linear-gradient(135deg, rgba(0,168,138,0.15) 0%, rgba(0,212,170,0.05) 100%)", border: "1px solid rgba(0,212,170,0.2)", borderRadius: "24px", padding: "40px", marginBottom: "24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,170,0.12) 0%, transparent 70%)" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00D4AA", animation: "pulse 2s infinite" }} />
            <span style={{ color: "#00D4AA", fontSize: "11px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}>Available Balance</span>
          </div>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "52px", color: "#F1F5F9", letterSpacing: "-0.03em", lineHeight: 1 }}>
            ${balance.toLocaleString()}
          </div>
          <div style={{ color: "#475569", fontSize: "13px", marginTop: "12px" }}>StoreWallet Account</div>
        </div>

        {/* Action Card */}
        <div className="action-card" style={{ background: "rgba(8,18,36,0.8)", border: "1px solid rgba(0,212,170,0.08)", borderRadius: "24px", padding: "32px" }}>
          <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "16px", color: "#E2E8F0", marginBottom: "24px" }}>Make a Transaction</h3>

          {feedback && (
            <div style={{ background: feedback.type === "success" ? "rgba(0,212,170,0.08)" : "rgba(248,113,113,0.08)", border: `1px solid ${feedback.type === "success" ? "rgba(0,212,170,0.25)" : "rgba(248,113,113,0.25)"}`, color: feedback.type === "success" ? "#00D4AA" : "#F87171", padding: "12px 16px", borderRadius: "12px", marginBottom: "20px", fontSize: "14px" }}>
              {feedback.msg}
            </div>
          )}

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "#475569", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px" }}>Amount (USD)</label>
            <input
              type="number"
              className="amount-input"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>

          {/* Quick amounts */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
            {[50, 100, 250, 500].map(v => (
              <button key={v} className="quick-btn" onClick={() => setAmount(v)}>${v}</button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button className="deposit-btn" onClick={handleDeposit}>⬇ Deposit</button>
            <button className="withdraw-btn" onClick={handleWithdraw}>⬆ Withdraw</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;