import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── Currency data including South Sudan and regional currencies ───
const CURRENCIES = [
  { code: "KES", name: "Kenyan Shilling", flag: "🇰🇪", rate: 1 },
  { code: "SSP", name: "South Sudanese Pound", flag: "🇸🇸", rate: 0.29 },
  { code: "USD", name: "US Dollar", flag: "🇺🇸", rate: 0.0077 },
  { code: "EUR", name: "Euro", flag: "🇪🇺", rate: 0.0071 },
  { code: "GBP", name: "British Pound", flag: "🇬🇧", rate: 0.0061 },
  { code: "UGX", name: "Ugandan Shilling", flag: "🇺🇬", rate: 28.4 },
  { code: "TZS", name: "Tanzanian Shilling", flag: "🇹🇿", rate: 20.1 },
  { code: "ETB", name: "Ethiopian Birr", flag: "🇪🇹", rate: 0.86 },
  { code: "RWF", name: "Rwandan Franc", flag: "🇷🇼", rate: 10.2 },
  { code: "NGN", name: "Nigerian Naira", flag: "🇳🇬", rate: 12.4 },
  { code: "GHS", name: "Ghanaian Cedi", flag: "🇬🇭", rate: 0.096 },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦", rate: 0.14 },
  { code: "EGP", name: "Egyptian Pound", flag: "🇪🇬", rate: 0.38 },
  { code: "SDG", name: "Sudanese Pound", flag: "🇸🇩", rate: 4.6 },
  { code: "CDF", name: "Congolese Franc", flag: "🇨🇩", rate: 21.5 },
  { code: "XOF", name: "West African CFA", flag: "🌍", rate: 4.65 },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪", rate: 0.028 },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳", rate: 0.64 },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳", rate: 0.056 },
  { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦", rate: 0.029 },
];

const PAYMENT_METHODS = [
  { id: "mpesa", name: "M-Pesa", icon: "📱", color: "#00a651", desc: "Mobile money", countries: ["KE", "TZ", "RW"] },
  { id: "bank", name: "Bank Account", icon: "🏦", color: "#065f46", desc: "Direct transfer" },
  { id: "card", name: "Visa / Mastercard", icon: "💳", color: "#1a56db", desc: "Credit or debit" },
  { id: "paypal", name: "PayPal", icon: "🅿️", color: "#003087", desc: "Online wallet" },
  { id: "airtel", name: "Airtel Money", icon: "📲", color: "#e40000", desc: "Mobile money", countries: ["KE", "UG", "TZ", "RW"] },
  { id: "ecocash", name: "EcoCash", icon: "💰", color: "#f59e0b", desc: "Zimbabwe mobile" },
  { id: "mtn", name: "MTN MoMo", icon: "📡", color: "#fbbf24", desc: "MTN mobile money" },
  { id: "orange", name: "Orange Money", icon: "🟠", color: "#f97316", desc: "Orange mobile" },
  { id: "crypto", name: "Crypto Wallet", icon: "₿", color: "#f59e0b", desc: "BTC, ETH, USDT" },
  { id: "tigopesa", name: "Tigo Pesa", icon: "📳", color: "#0ea5e9", desc: "Tanzania mobile" },
];

const INVESTMENT_OPTIONS = [
  { id: "stocks", name: "Stocks", emoji: "📈", desc: "Local & global equities", minAmount: 1000, currency: "KES" },
  { id: "treasury", name: "Treasury Bills", emoji: "🏛️", desc: "Government-backed, low risk", minAmount: 3000, currency: "KES" },
  { id: "mmf", name: "Money Market Fund", emoji: "💹", desc: "~10% annual yield", minAmount: 500, currency: "KES" },
  { id: "realestate", name: "Real Estate REITs", emoji: "🏠", desc: "Property investment funds", minAmount: 5000, currency: "KES" },
  { id: "forex", name: "Forex Trading", emoji: "🌐", desc: "Currency pairs incl. SSP", minAmount: 2000, currency: "KES" },
  { id: "bonds", name: "Corporate Bonds", emoji: "📜", desc: "Fixed income, stable returns", minAmount: 10000, currency: "KES" },
];

const CONNECTED_ACCOUNTS = [
  { id: 1, type: "mpesa", name: "M-Pesa", number: "0712 *** 456", balance: 24500, currency: "KES", icon: "📱", color: "#00a651", connected: true },
  { id: 2, type: "bank", name: "Equity Bank", number: "****8823", balance: 183200, currency: "KES", icon: "🏦", color: "#8b0000", connected: true },
  { id: 3, type: "card", name: "Visa Card", number: "**** **** **** 4421", balance: null, currency: "KES", icon: "💳", color: "#1a56db", connected: true },
];

// ─── Styles ───────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .wh-root {
    min-height: 100vh;
    background: #f0fdf4;
    font-family: 'DM Sans', sans-serif;
    color: #064e3b;
  }

  /* Top Nav */
  .wh-nav {
    background: #fff;
    border-bottom: 1px solid #d1fae5;
    padding: 0 2rem;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 50;
  }
  .wh-nav-logo { font-size: 1.3rem; font-weight: 600; color: #10b981; letter-spacing: -0.5px; }
  .wh-nav-back { 
    display: flex; align-items: center; gap: 6px;
    background: #f0fdf4; border: 1px solid #a7f3d0;
    padding: 8px 14px; border-radius: 20px; cursor: pointer;
    font-size: 0.85rem; font-weight: 500; color: #065f46;
    transition: all 0.2s;
  }
  .wh-nav-back:hover { background: #d1fae5; }

  /* Hero Balance Strip */
  .wh-balance-strip {
    background: linear-gradient(135deg, #065f46 0%, #047857 50%, #10b981 100%);
    padding: 2.5rem 2rem;
    color: white;
    position: relative;
    overflow: hidden;
  }
  .wh-balance-strip::before {
    content: '';
    position: absolute; top: -60px; right: -60px;
    width: 260px; height: 260px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
  }
  .wh-balance-strip::after {
    content: '';
    position: absolute; bottom: -40px; left: -40px;
    width: 180px; height: 180px;
    background: rgba(255,255,255,0.04);
    border-radius: 50%;
  }
  .wh-balance-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }
  .wh-balance-label { font-size: 0.8rem; opacity: 0.75; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 0.4rem; }
  .wh-balance-amount { font-size: 2.8rem; font-weight: 600; letter-spacing: -1px; font-family: 'DM Mono', monospace; }
  .wh-balance-sub { font-size: 0.85rem; opacity: 0.7; margin-top: 0.3rem; }
  .wh-balance-badges { display: flex; gap: 8px; margin-top: 1rem; flex-wrap: wrap; }
  .wh-balance-badge {
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.2);
    padding: 5px 12px; border-radius: 20px;
    font-size: 0.78rem; font-weight: 500;
    backdrop-filter: blur(4px);
  }

  /* Quick Actions Row */
  .wh-quick-row {
    background: #fff;
    border-bottom: 1px solid #d1fae5;
    padding: 1.5rem 2rem;
  }
  .wh-quick-inner { max-width: 1100px; margin: 0 auto; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .wh-quick-btn {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    padding: 16px 24px; border-radius: 16px; cursor: pointer;
    border: 1.5px solid transparent; transition: all 0.2s;
    min-width: 90px; background: #f0fdf4;
    border-color: #d1fae5;
  }
  .wh-quick-btn:hover, .wh-quick-btn.active {
    background: #10b981; border-color: #10b981; color: white;
    transform: translateY(-2px); box-shadow: 0 6px 20px rgba(16,185,129,0.25);
  }
  .wh-quick-btn:hover .wh-qb-icon, .wh-quick-btn.active .wh-qb-icon { color: white; }
  .wh-qb-icon { font-size: 1.5rem; }
  .wh-qb-label { font-size: 0.78rem; font-weight: 500; color: #065f46; }
  .wh-quick-btn:hover .wh-qb-label, .wh-quick-btn.active .wh-qb-label { color: white; }

  /* Main content */
  .wh-main { max-width: 1100px; margin: 0 auto; padding: 2rem; }

  /* Panels */
  .wh-panel {
    background: #fff; border: 1px solid #d1fae5;
    border-radius: 20px; padding: 2rem; margin-bottom: 1.5rem;
    animation: panelIn 0.3s ease;
  }
  @keyframes panelIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  .wh-panel-title { font-size: 1.2rem; font-weight: 600; color: #064e3b; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 8px; }
  .wh-panel-title span { font-size: 1.3rem; }

  /* Form elements */
  .wh-field { margin-bottom: 1.2rem; }
  .wh-label { display: block; font-size: 0.82rem; font-weight: 500; color: #6b7280; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
  .wh-input {
    width: 100%; padding: 12px 16px;
    border: 1.5px solid #a7f3d0; border-radius: 12px;
    background: #f0fdf4; color: #064e3b;
    font-size: 1rem; font-family: 'DM Sans', sans-serif;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .wh-input:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.12); background: #fff; }
  .wh-select {
    width: 100%; padding: 12px 16px;
    border: 1.5px solid #a7f3d0; border-radius: 12px;
    background: #f0fdf4; color: #064e3b;
    font-size: 1rem; font-family: 'DM Sans', sans-serif;
    outline: none; cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 40px;
  }
  .wh-select:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.12); }
  .wh-textarea {
    width: 100%; padding: 12px 16px;
    border: 1.5px solid #a7f3d0; border-radius: 12px;
    background: #f0fdf4; color: #064e3b;
    font-size: 0.95rem; font-family: 'DM Sans', sans-serif;
    outline: none; resize: vertical; min-height: 80px;
  }
  .wh-textarea:focus { border-color: #10b981; }

  /* Amount input with currency prefix */
  .wh-amount-wrap { position: relative; }
  .wh-amount-prefix {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    font-size: 0.9rem; font-weight: 600; color: #10b981;
    font-family: 'DM Mono', monospace;
  }
  .wh-amount-input { padding-left: 56px !important; font-family: 'DM Mono', monospace !important; font-size: 1.1rem !important; }

  /* Conversion display */
  .wh-convert-box {
    background: #f0fdf4; border: 1px solid #a7f3d0;
    border-radius: 12px; padding: 12px 16px; margin-top: 8px;
    display: flex; align-items: center; justify-content: space-between;
    font-size: 0.85rem;
  }
  .wh-convert-rate { color: #6b7280; }
  .wh-convert-result { font-family: 'DM Mono', monospace; font-weight: 600; color: #065f46; font-size: 1rem; }

  /* Two-column grid */
  .wh-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  @media (max-width: 640px) { .wh-grid-2 { grid-template-columns: 1fr; } }

  /* Submit button */
  .wh-submit {
    width: 100%; padding: 15px;
    background: #10b981; color: #fff;
    border: none; border-radius: 14px;
    font-size: 1rem; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.2s;
    margin-top: 0.5rem;
    letter-spacing: 0.2px;
  }
  .wh-submit:hover { background: #059669; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(16,185,129,0.3); }
  .wh-submit:active { transform: translateY(0); }
  .wh-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* Payment method grid */
  .wh-method-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
  .wh-method-card {
    border: 2px solid #d1fae5; border-radius: 12px;
    padding: 14px 10px; text-align: center; cursor: pointer;
    transition: all 0.2s; background: #f9fafb;
  }
  .wh-method-card:hover { border-color: #10b981; background: #f0fdf4; transform: translateY(-2px); }
  .wh-method-card.selected { border-color: #10b981; background: #ecfdf5; box-shadow: 0 0 0 3px rgba(16,185,129,0.12); }
  .wh-method-icon { font-size: 1.6rem; margin-bottom: 6px; }
  .wh-method-name { font-size: 0.78rem; font-weight: 600; color: #064e3b; }
  .wh-method-desc { font-size: 0.7rem; color: #9ca3af; margin-top: 2px; }

  /* Investment cards */
  .wh-invest-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; margin-bottom: 1.5rem; }
  .wh-invest-card {
    border: 2px solid #d1fae5; border-radius: 14px;
    padding: 18px 14px; cursor: pointer; transition: all 0.2s;
    background: #f0fdf4;
  }
  .wh-invest-card:hover { border-color: #10b981; transform: translateY(-3px); box-shadow: 0 8px 24px rgba(16,185,129,0.15); }
  .wh-invest-card.selected { border-color: #10b981; background: #ecfdf5; box-shadow: 0 0 0 3px rgba(16,185,129,0.15); }
  .wh-invest-emoji { font-size: 1.8rem; margin-bottom: 8px; }
  .wh-invest-name { font-size: 0.9rem; font-weight: 600; color: #064e3b; margin-bottom: 4px; }
  .wh-invest-desc { font-size: 0.75rem; color: #6b7280; line-height: 1.4; }
  .wh-invest-min { font-size: 0.72rem; color: #10b981; font-weight: 600; margin-top: 6px; }

  /* Connected accounts */
  .wh-accounts-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 1.5rem; }
  .wh-account-card {
    display: flex; align-items: center; gap: 14px;
    padding: 16px; border-radius: 14px;
    border: 1.5px solid #d1fae5; background: #f9fafb;
    transition: all 0.2s;
  }
  .wh-account-card:hover { background: #f0fdf4; border-color: #a7f3d0; }
  .wh-account-icon {
    width: 46px; height: 46px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; flex-shrink: 0;
  }
  .wh-account-info { flex: 1; }
  .wh-account-name { font-weight: 600; font-size: 0.95rem; color: #064e3b; }
  .wh-account-num { font-size: 0.78rem; color: #9ca3af; font-family: 'DM Mono', monospace; margin-top: 2px; }
  .wh-account-balance { font-family: 'DM Mono', monospace; font-weight: 600; color: #10b981; font-size: 0.95rem; }
  .wh-account-badge { font-size: 0.68rem; background: #d1fae5; color: #065f46; padding: 2px 8px; border-radius: 20px; font-weight: 600; margin-top: 4px; display: inline-block; }

  /* Add account grid */
  .wh-add-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; margin-bottom: 1.5rem; }
  .wh-add-card {
    border: 2px dashed #a7f3d0; border-radius: 14px;
    padding: 18px 12px; text-align: center; cursor: pointer;
    transition: all 0.2s; background: #fff;
  }
  .wh-add-card:hover { border-color: #10b981; border-style: solid; background: #f0fdf4; transform: translateY(-2px); }
  .wh-add-icon { font-size: 1.6rem; margin-bottom: 6px; }
  .wh-add-name { font-size: 0.8rem; font-weight: 600; color: #065f46; }
  .wh-add-desc { font-size: 0.7rem; color: #9ca3af; margin-top: 2px; }

  /* Success state */
  .wh-success {
    text-align: center; padding: 2.5rem 1rem;
    animation: panelIn 0.4s ease;
  }
  .wh-success-icon { font-size: 3.5rem; margin-bottom: 1rem; }
  .wh-success-title { font-size: 1.4rem; font-weight: 600; color: #065f46; margin-bottom: 0.5rem; }
  .wh-success-sub { color: #6b7280; font-size: 0.9rem; margin-bottom: 1.5rem; line-height: 1.6; }
  .wh-success-ref { font-family: 'DM Mono', monospace; font-size: 0.8rem; background: #f0fdf4; border: 1px solid #d1fae5; padding: 8px 16px; border-radius: 8px; color: #10b981; display: inline-block; }

  /* QR-style receive code */
  .wh-receive-box {
    border: 2px dashed #10b981; border-radius: 20px;
    padding: 2rem; text-align: center; margin: 1rem 0;
    background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
  }
  .wh-qr-mock {
    width: 140px; height: 140px; margin: 0 auto 1rem;
    background: #fff; border: 1.5px solid #d1fae5; border-radius: 12px;
    display: grid; grid-template-columns: repeat(7,1fr); gap: 2px; padding: 12px;
  }
  .wh-qr-cell { border-radius: 2px; }
  .wh-receive-id { font-family: 'DM Mono', monospace; font-size: 1.1rem; font-weight: 500; color: #065f46; margin-bottom: 0.3rem; }
  .wh-receive-phone { font-size: 0.85rem; color: #6b7280; }

  /* SSP callout */
  .wh-ssp-banner {
    background: linear-gradient(135deg, #fef3c7, #fffbeb);
    border: 1px solid #fcd34d; border-radius: 12px;
    padding: 14px 16px; margin-bottom: 1.2rem;
    display: flex; align-items: center; gap: 12px;
    font-size: 0.85rem; color: #92400e;
  }
  .wh-ssp-flag { font-size: 1.3rem; }

  /* Tabs */
  .wh-tabs { display: flex; gap: 4px; background: #f0fdf4; padding: 4px; border-radius: 12px; margin-bottom: 1.5rem; }
  .wh-tab {
    flex: 1; padding: 9px; text-align: center;
    border-radius: 9px; font-size: 0.82rem; font-weight: 500;
    cursor: pointer; transition: all 0.2s; color: #6b7280;
    border: none; background: transparent; font-family: 'DM Sans', sans-serif;
  }
  .wh-tab.active { background: #10b981; color: #fff; box-shadow: 0 2px 8px rgba(16,185,129,0.25); }

  /* Divider */
  .wh-divider { height: 1px; background: #d1fae5; margin: 1.5rem 0; }

  /* Info box */
  .wh-info {
    background: #ecfdf5; border: 1px solid #6ee7b7;
    border-radius: 10px; padding: 12px 14px;
    font-size: 0.82rem; color: #065f46; margin-top: 1rem;
    line-height: 1.6;
  }
  .wh-info strong { font-weight: 600; }
`;

// ─── QR Mock Component ───────────────────────────────────────────────
function QRMock() {
  const pattern = [1,1,1,0,1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,0,0,0,0,0,1,1,0,1,1,1,0,1];
  return (
    <div className="wh-qr-mock">
      {pattern.map((c, i) => (
        <div key={i} className="wh-qr-cell" style={{ background: c ? "#064e3b" : "transparent" }} />
      ))}
    </div>
  );
}

// ─── Send Money Panel ────────────────────────────────────────────────
function SendPanel() {
  const [method, setMethod] = useState("mpesa");
  const [amount, setAmount] = useState("");
  const [toCurrency, setToCurrency] = useState("KES");
  const [fromCurrency, setFromCurrency] = useState("KES");
  const [recipient, setRecipient] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const fromCur = CURRENCIES.find(c => c.code === fromCurrency);
  const toCur = CURRENCIES.find(c => c.code === toCurrency);
  const converted = amount && fromCur && toCur
    ? ((parseFloat(amount) / fromCur.rate) * toCur.rate).toFixed(2)
    : null;

  const handleSend = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1800);
  };

  if (done) return (
    <div className="wh-success">
      <div className="wh-success-icon">✅</div>
      <div className="wh-success-title">Money Sent!</div>
      <div className="wh-success-sub">
        {fromCurrency} {parseFloat(amount).toLocaleString()} has been sent to <strong>{recipient}</strong><br />
        {toCurrency !== fromCurrency && converted && `Converted to ${toCurrency} ${parseFloat(converted).toLocaleString()}`}
      </div>
      <div className="wh-success-ref">REF: MNX-{Math.random().toString(36).slice(2,10).toUpperCase()}</div>
      <button className="wh-submit" style={{ marginTop: "1.5rem", maxWidth: "200px" }} onClick={() => { setDone(false); setAmount(""); setRecipient(""); }}>
        Send Again
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSend}>
      <div className="wh-ssp-banner">
        <span className="wh-ssp-flag">🇸🇸</span>
        <span>South Sudan (SSP), Uganda, Tanzania, Ethiopia and 16+ African currencies supported. Real-time mid-market rates.</span>
      </div>

      <div className="wh-label">Send via</div>
      <div className="wh-method-grid" style={{ marginBottom: "1.2rem" }}>
        {PAYMENT_METHODS.slice(0,8).map(m => (
          <div key={m.id} className={`wh-method-card ${method === m.id ? "selected" : ""}`} onClick={() => setMethod(m.id)}>
            <div className="wh-method-icon">{m.icon}</div>
            <div className="wh-method-name">{m.name}</div>
            <div className="wh-method-desc">{m.desc}</div>
          </div>
        ))}
      </div>

      <div className="wh-grid-2">
        <div className="wh-field">
          <label className="wh-label">From currency</label>
          <select className="wh-select" value={fromCurrency} onChange={e => setFromCurrency(e.target.value)}>
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>)}
          </select>
        </div>
        <div className="wh-field">
          <label className="wh-label">To currency</label>
          <select className="wh-select" value={toCurrency} onChange={e => setToCurrency(e.target.value)}>
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="wh-field">
        <label className="wh-label">Amount</label>
        <div className="wh-amount-wrap">
          <span className="wh-amount-prefix">{fromCurrency}</span>
          <input className="wh-input wh-amount-input" type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} required min="1" />
        </div>
        {converted && toCurrency !== fromCurrency && (
          <div className="wh-convert-box">
            <span className="wh-convert-rate">1 {fromCurrency} = {(toCur.rate / fromCur.rate).toFixed(4)} {toCurrency}</span>
            <span className="wh-convert-result">≈ {toCurrency} {parseFloat(converted).toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="wh-field">
        <label className="wh-label">Recipient {method === "mpesa" ? "phone number" : method === "bank" ? "account number" : "identifier"}</label>
        <input className="wh-input" type="text"
          placeholder={method === "mpesa" ? "e.g. 0712 345 678" : method === "bank" ? "Account number" : "Email / ID"}
          value={recipient} onChange={e => setRecipient(e.target.value)} required />
      </div>

      <div className="wh-field">
        <label className="wh-label">Note (optional)</label>
        <textarea className="wh-textarea" placeholder="What's this for?" value={note} onChange={e => setNote(e.target.value)} rows={2} />
      </div>

      <div className="wh-info">
        <strong>Transfer fee:</strong> KES 0 for M-Pesa to M-Pesa · KES 30 cross-network · International transfers from 1.2%
      </div>

      <button className="wh-submit" type="submit" disabled={loading}>
        {loading ? "Processing…" : `Send ${fromCurrency} ${amount ? parseFloat(amount).toLocaleString() : ""}` }
      </button>
    </form>
  );
}

// ─── Receive Panel ───────────────────────────────────────────────────
function ReceivePanel() {
  const [tab, setTab] = useState("qr");
  const [currency, setCurrency] = useState("KES");
  const [requestAmount, setRequestAmount] = useState("");
  const [done, setDone] = useState(false);

  return (
    <div>
      <div className="wh-tabs">
        {["qr", "link", "request"].map(t => (
          <button key={t} className={`wh-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "qr" ? "QR Code" : t === "link" ? "Payment Link" : "Request Money"}
          </button>
        ))}
      </div>

      {tab === "qr" && (
        <div className="wh-receive-box">
          <QRMock />
          <div className="wh-receive-id">MONEXIA-JD7829</div>
          <div className="wh-receive-phone">+254 712 *** 456 · M-Pesa & Bank</div>
          <div style={{ marginTop: "1rem", display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
            {["M-Pesa", "Bank", "PayPal", "Airtel"].map(m => (
              <span key={m} style={{ background: "#d1fae5", color: "#065f46", fontSize: "0.75rem", padding: "4px 10px", borderRadius: "20px", fontWeight: 600 }}>{m}</span>
            ))}
          </div>
        </div>
      )}

      {tab === "link" && (
        <div>
          <div style={{ background: "#f0fdf4", border: "1.5px solid #a7f3d0", borderRadius: "12px", padding: "14px 16px", fontFamily: "DM Mono, monospace", fontSize: "0.85rem", color: "#065f46", marginBottom: "1rem", wordBreak: "break-all" }}>
            https://pay.monexia.app/to/jd7829
          </div>
          <button className="wh-submit" style={{ width: "auto", padding: "12px 24px" }} onClick={() => alert("Link copied!")}>
            📋 Copy Link
          </button>
        </div>
      )}

      {tab === "request" && (
        done ? (
          <div className="wh-success">
            <div className="wh-success-icon">📨</div>
            <div className="wh-success-title">Request Sent!</div>
            <div className="wh-success-sub">Your payment request has been sent.</div>
            <button className="wh-submit" style={{ maxWidth: 180, marginTop: "1rem" }} onClick={() => setDone(false)}>New Request</button>
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); setDone(true); }}>
            <div className="wh-field">
              <label className="wh-label">Request from (phone / email)</label>
              <input className="wh-input" placeholder="0712 345 678 or email" required />
            </div>
            <div className="wh-grid-2">
              <div className="wh-field">
                <label className="wh-label">Amount</label>
                <div className="wh-amount-wrap">
                  <span className="wh-amount-prefix">{currency}</span>
                  <input className="wh-input wh-amount-input" type="number" placeholder="0.00" value={requestAmount} onChange={e => setRequestAmount(e.target.value)} required />
                </div>
              </div>
              <div className="wh-field">
                <label className="wh-label">Currency</label>
                <select className="wh-select" value={currency} onChange={e => setCurrency(e.target.value)}>
                  {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                </select>
              </div>
            </div>
            <div className="wh-field">
              <label className="wh-label">Message</label>
              <textarea className="wh-textarea" placeholder="What's this for?" rows={2} />
            </div>
            <button className="wh-submit" type="submit">Send Request</button>
          </form>
        )
      )}
    </div>
  );
}

// ─── Deposit Panel ───────────────────────────────────────────────────
function DepositPanel() {
  const [method, setMethod] = useState("mpesa");
  const [amount, setAmount] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeposit = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1600);
  };

  if (done) return (
    <div className="wh-success">
      <div className="wh-success-icon">💰</div>
      <div className="wh-success-title">Deposit Initiated!</div>
      <div className="wh-success-sub">KES {parseFloat(amount).toLocaleString()} is being deposited to your Monexia wallet.<br />Usually reflects within 1–5 minutes.</div>
      <div className="wh-success-ref">REF: DEP-{Math.random().toString(36).slice(2,10).toUpperCase()}</div>
      <button className="wh-submit" style={{ marginTop: "1.5rem", maxWidth: 180 }} onClick={() => { setDone(false); setAmount(""); }}>Deposit Again</button>
    </div>
  );

  return (
    <form onSubmit={handleDeposit}>
      <div className="wh-label">Deposit from</div>
      <div className="wh-method-grid" style={{ marginBottom: "1.2rem" }}>
        {PAYMENT_METHODS.map(m => (
          <div key={m.id} className={`wh-method-card ${method === m.id ? "selected" : ""}`} onClick={() => setMethod(m.id)}>
            <div className="wh-method-icon">{m.icon}</div>
            <div className="wh-method-name">{m.name}</div>
            <div className="wh-method-desc">{m.desc}</div>
          </div>
        ))}
      </div>

      <div className="wh-field">
        <label className="wh-label">Amount (KES)</label>
        <div className="wh-amount-wrap">
          <span className="wh-amount-prefix">KES</span>
          <input className="wh-input wh-amount-input" type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} required min="10" />
        </div>
      </div>

      {method === "mpesa" && (
        <div className="wh-info">
          <strong>How it works:</strong> You'll receive an M-Pesa STK push on your registered number. Enter your PIN to complete the deposit. Funds reflect instantly.
        </div>
      )}
      {method === "bank" && (
        <div className="wh-info">
          <strong>Bank details:</strong><br />
          Account Name: Monexia Ltd · Bank: Equity Bank Kenya<br />
          Account No: 1234567890 · Branch: Nairobi CBD
        </div>
      )}
      {method === "card" && (
        <div>
          <div className="wh-grid-2">
            <div className="wh-field">
              <label className="wh-label">Card number</label>
              <input className="wh-input" type="text" placeholder="**** **** **** ****" maxLength={19} />
            </div>
            <div className="wh-field">
              <label className="wh-label">Expiry</label>
              <input className="wh-input" type="text" placeholder="MM/YY" maxLength={5} />
            </div>
          </div>
          <div className="wh-grid-2">
            <div className="wh-field">
              <label className="wh-label">CVV</label>
              <input className="wh-input" type="text" placeholder="***" maxLength={4} />
            </div>
            <div className="wh-field">
              <label className="wh-label">Name on card</label>
              <input className="wh-input" type="text" placeholder="Full name" />
            </div>
          </div>
        </div>
      )}

      <button className="wh-submit" type="submit" disabled={loading}>
        {loading ? "Processing…" : `Deposit KES ${amount ? parseFloat(amount).toLocaleString() : ""}`}
      </button>
    </form>
  );
}

// ─── Invest Panel ────────────────────────────────────────────────────
function InvestPanel() {
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("3");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const inv = INVESTMENT_OPTIONS.find(i => i.id === selected);

  const yields = { stocks: 15, treasury: 9, mmf: 10, realestate: 12, forex: 18, bonds: 11 };
  const projectedReturn = inv && amount && duration
    ? (parseFloat(amount) * (1 + (yields[selected] / 100) * (parseInt(duration) / 12))).toFixed(2)
    : null;

  const handleInvest = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 2000);
  };

  if (done) return (
    <div className="wh-success">
      <div className="wh-success-icon">📈</div>
      <div className="wh-success-title">Investment Created!</div>
      <div className="wh-success-sub">
        KES {parseFloat(amount).toLocaleString()} invested in <strong>{inv?.name}</strong> for {duration} months.<br />
        Projected return: <strong>KES {projectedReturn ? parseFloat(projectedReturn).toLocaleString() : "—"}</strong>
      </div>
      <div className="wh-success-ref">INV-{Math.random().toString(36).slice(2,10).toUpperCase()}</div>
      <button className="wh-submit" style={{ maxWidth: 200, marginTop: "1.5rem" }} onClick={() => { setDone(false); setSelected(null); setAmount(""); }}>New Investment</button>
    </div>
  );

  return (
    <form onSubmit={handleInvest}>
      <div className="wh-label">Choose investment type</div>
      <div className="wh-invest-grid">
        {INVESTMENT_OPTIONS.map(inv => (
          <div key={inv.id} className={`wh-invest-card ${selected === inv.id ? "selected" : ""}`} onClick={() => setSelected(inv.id)}>
            <div className="wh-invest-emoji">{inv.emoji}</div>
            <div className="wh-invest-name">{inv.name}</div>
            <div className="wh-invest-desc">{inv.desc}</div>
            <div className="wh-invest-min">Min: KES {inv.minAmount.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {selected && (
        <>
          <div className="wh-divider" />
          <div className="wh-grid-2">
            <div className="wh-field">
              <label className="wh-label">Amount to invest (KES)</label>
              <div className="wh-amount-wrap">
                <span className="wh-amount-prefix">KES</span>
                <input className="wh-input wh-amount-input" type="number" placeholder="0.00"
                  value={amount} onChange={e => setAmount(e.target.value)}
                  required min={inv?.minAmount} />
              </div>
            </div>
            <div className="wh-field">
              <label className="wh-label">Duration (months)</label>
              <select className="wh-select" value={duration} onChange={e => setDuration(e.target.value)}>
                {["1","3","6","12","24","36"].map(d => <option key={d} value={d}>{d} month{d > 1 ? "s" : ""}</option>)}
              </select>
            </div>
          </div>

          {projectedReturn && (
            <div className="wh-convert-box" style={{ marginBottom: "1rem" }}>
              <span className="wh-convert-rate">Estimated {yields[selected]}% p.a. yield over {duration} months</span>
              <span className="wh-convert-result">≈ KES {parseFloat(projectedReturn).toLocaleString()}</span>
            </div>
          )}

          <button className="wh-submit" type="submit" disabled={loading || !amount}>
            {loading ? "Setting up…" : `Invest KES ${amount ? parseFloat(amount).toLocaleString() : ""} in ${inv?.name}`}
          </button>
        </>
      )}
    </form>
  );
}

// ─── Connect Accounts Panel ──────────────────────────────────────────
function ConnectPanel() {
  const [connecting, setConnecting] = useState(null);
  const [connected, setConnected] = useState(CONNECTED_ACCOUNTS.map(a => a.id));
  const [form, setForm] = useState({});

  const handleConnect = (id, e) => {
    e.preventDefault();
    setTimeout(() => {
      setConnected(prev => [...prev, id]);
      setConnecting(null);
    }, 1500);
  };

  return (
    <div>
      {/* Connected */}
      {CONNECTED_ACCOUNTS.length > 0 && (
        <>
          <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>Connected Accounts</div>
          <div className="wh-accounts-list">
            {CONNECTED_ACCOUNTS.map(acc => (
              <div key={acc.id} className="wh-account-card">
                <div className="wh-account-icon" style={{ background: acc.color + "20" }}>
                  {acc.icon}
                </div>
                <div className="wh-account-info">
                  <div className="wh-account-name">{acc.name}</div>
                  <div className="wh-account-num">{acc.number}</div>
                  <span className="wh-account-badge">✓ Connected</span>
                </div>
                {acc.balance !== null && (
                  <div className="wh-account-balance">KES {acc.balance.toLocaleString()}</div>
                )}
              </div>
            ))}
          </div>
          <div className="wh-divider" />
        </>
      )}

      {/* Add new */}
      <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>Connect New Account</div>
      <div className="wh-add-grid">
        {PAYMENT_METHODS.map(m => (
          <div key={m.id} className="wh-add-card" onClick={() => setConnecting(m.id)}>
            <div className="wh-add-icon">{m.icon}</div>
            <div className="wh-add-name">{m.name}</div>
            <div className="wh-add-desc">{m.desc}</div>
          </div>
        ))}
      </div>

      {/* Connect modal */}
      {connecting && (() => {
        const m = PAYMENT_METHODS.find(x => x.id === connecting);
        const isConnectedNow = connected.includes(connecting);
        return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(6,79,58,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem" }}>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "2rem", maxWidth: "420px", width: "100%", border: "1px solid #d1fae5" }}>
              {isConnectedNow ? (
                <div className="wh-success" style={{ padding: "1rem 0" }}>
                  <div className="wh-success-icon">{m.icon}</div>
                  <div className="wh-success-title">{m.name} Connected!</div>
                  <div className="wh-success-sub">Your account has been linked successfully.</div>
                  <button className="wh-submit" style={{ maxWidth: 180, marginTop: "1rem" }} onClick={() => setConnecting(null)}>Done</button>
                </div>
              ) : (
                <form onSubmit={e => handleConnect(connecting, e)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
                    <span style={{ fontSize: "2rem" }}>{m.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "1.1rem", color: "#064e3b" }}>Connect {m.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>{m.desc}</div>
                    </div>
                  </div>
                  {(m.id === "mpesa" || m.id === "airtel" || m.id === "mtn" || m.id === "tigopesa" || m.id === "ecocash" || m.id === "orange") && (
                    <div className="wh-field">
                      <label className="wh-label">Phone Number</label>
                      <input className="wh-input" type="tel" placeholder="+254 712 345 678" required />
                    </div>
                  )}
                  {m.id === "bank" && (
                    <>
                      <div className="wh-field"><label className="wh-label">Bank Name</label><input className="wh-input" placeholder="e.g. Equity Bank" required /></div>
                      <div className="wh-field"><label className="wh-label">Account Number</label><input className="wh-input" placeholder="Account number" required /></div>
                    </>
                  )}
                  {m.id === "card" && (
                    <>
                      <div className="wh-field"><label className="wh-label">Card Number</label><input className="wh-input" placeholder="**** **** **** ****" required /></div>
                      <div className="wh-grid-2">
                        <div className="wh-field"><label className="wh-label">Expiry</label><input className="wh-input" placeholder="MM/YY" required /></div>
                        <div className="wh-field"><label className="wh-label">CVV</label><input className="wh-input" placeholder="***" required /></div>
                      </div>
                    </>
                  )}
                  {(m.id === "paypal" || m.id === "crypto") && (
                    <div className="wh-field"><label className="wh-label">{m.id === "paypal" ? "PayPal Email" : "Wallet Address"}</label><input className="wh-input" type={m.id === "paypal" ? "email" : "text"} placeholder={m.id === "paypal" ? "you@email.com" : "0x..."} required /></div>
                  )}
                  <div style={{ display: "flex", gap: "10px", marginTop: "0.5rem" }}>
                    <button type="button" onClick={() => setConnecting(null)} style={{ flex: 1, padding: "13px", border: "1.5px solid #d1fae5", borderRadius: "12px", background: "#f0fdf4", color: "#065f46", fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>Cancel</button>
                    <button type="submit" className="wh-submit" style={{ flex: 2, marginTop: 0 }}>Connect {m.name}</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ─── Root Component ──────────────────────────────────────────────────
export default function WalletHub() {
  const navigate = useNavigate();
  const [active, setActive] = useState("send");

  const actions = [
    { id: "send", icon: "↗", label: "Send" },
    { id: "receive", icon: "↙", label: "Receive" },
    { id: "deposit", icon: "⬇", label: "Deposit" },
    { id: "invest", icon: "📈", label: "Invest" },
    { id: "connect", icon: "🔗", label: "Connect" },
  ];

  const panelTitles = {
    send: { icon: "↗", title: "Send Money" },
    receive: { icon: "↙", title: "Receive Money" },
    deposit: { icon: "⬇", title: "Deposit Funds" },
    invest: { icon: "📈", title: "Invest" },
    connect: { icon: "🔗", title: "Connected Accounts" },
  };

  return (
    <div className="wh-root">
      <style>{css}</style>

      <nav className="wh-nav">
        <div className="wh-nav-logo">💚 Monexia</div>
        <button className="wh-nav-back" onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </button>
      </nav>

      <div className="wh-balance-strip">
        <div className="wh-balance-inner">
          <div className="wh-balance-label">Monexia Wallet Balance</div>
          <div className="wh-balance-amount">KES 207,650.00</div>
          <div className="wh-balance-sub">≈ USD 1,598 · Updated just now</div>
          <div className="wh-balance-badges">
            <span className="wh-balance-badge">🇸🇸 SSP supported</span>
            <span className="wh-balance-badge">20 currencies</span>
            <span className="wh-balance-badge">3 accounts linked</span>
            <span className="wh-balance-badge">Live rates</span>
          </div>
        </div>
      </div>

      <div className="wh-quick-row">
        <div className="wh-quick-inner">
          {actions.map(a => (
            <div key={a.id} className={`wh-quick-btn ${active === a.id ? "active" : ""}`} onClick={() => setActive(a.id)}>
              <span className="wh-qb-icon" style={{ fontSize: a.id === "send" || a.id === "receive" ? "1.3rem" : "1.5rem" }}>{a.icon}</span>
              <span className="wh-qb-label">{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="wh-main">
        <div className="wh-panel">
          <div className="wh-panel-title">
            <span>{panelTitles[active].icon}</span>
            {panelTitles[active].title}
          </div>
          {active === "send" && <SendPanel />}
          {active === "receive" && <ReceivePanel />}
          {active === "deposit" && <DepositPanel />}
          {active === "invest" && <InvestPanel />}
          {active === "connect" && <ConnectPanel />}
        </div>
      </div>
    </div>
  );
}