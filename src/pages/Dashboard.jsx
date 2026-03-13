import React, { useContext, useState, useCallback } from "react";
import { WalletContext } from "../context/WalletContext";
import { FinTechContext } from "../context/FinTechContext";
import {
  ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Cell, AreaChart, Area,
  XAxis, YAxis, Tooltip, PieChart, Pie, Legend
} from "recharts";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — set VITE_FLW_PUBLIC_KEY in your .env file
// ─────────────────────────────────────────────────────────────────────────────
const FLW_PUBLIC_KEY = import.meta.env.VITE_FLW_PUBLIC_KEY || "";
const APP_NAME       = "StoreWallet";
const APP_LOGO       = "https://i.imgur.com/storewallet-logo.png";
const KEY_MISSING    = !FLW_PUBLIC_KEY || FLW_PUBLIC_KEY === "PASTE_YOUR_KEY_HERE";

// ─────────────────────────────────────────────────────────────────────────────
// SECURITY
// ─────────────────────────────────────────────────────────────────────────────
const sanitizeAmount = (val) => {
  const num = parseFloat(String(val).replace(/[^0-9.]/g, ""));
  if (isNaN(num) || num <= 0 || num > 1_000_000) return null;
  return Math.round(num * 100) / 100;
};
const sanitizeText = (v, max = 120) => String(v).replace(/[<>"'`\\]/g, "").slice(0, max);
const generateTxRef = () => `SW-${Date.now()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;

// ─────────────────────────────────────────────────────────────────────────────
// FLUTTERWAVE LOADER — injects the SDK script once
// ─────────────────────────────────────────────────────────────────────────────
const loadFlutterwave = () =>
  new Promise((resolve) => {
    if (window.FlutterwaveCheckout) return resolve();
    const s = document.createElement("script");
    s.src = "https://checkout.flutterwave.com/v3.js";
    s.onload = resolve;
    document.head.appendChild(s);
  });

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENT METHODS shown in the fund form
// ─────────────────────────────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  {
    id: "mpesa",
    name: "M-Pesa",
    subtext: "Lipa na M-Pesa · Instant",
    icon: "📱",
    color: "#00D4AA",
    bg: "rgba(0,212,170,.08)",
    border: "rgba(0,212,170,.25)",
    fee: "Free",
    time: "Instant",
    flw: "mobilemoney",          // Flutterwave payment type
    fields: ["phone"],
    hint: "Enter your Safaricom number. You'll get an M-Pesa push prompt to enter your PIN.",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    subtext: "All Kenyan banks · Online",
    icon: "🏦",
    color: "#3B82F6",
    bg: "rgba(59,130,246,.08)",
    border: "rgba(59,130,246,.25)",
    fee: "Free",
    time: "Instant via Flutterwave",
    flw: "banktransfer",
    fields: [],
    hint: "You'll be shown your bank's account details. Transfer from your mobile banking app — no branch visit needed.",
  },
  {
    id: "card",
    name: "Debit / Credit Card",
    subtext: "Visa · Mastercard · Amex",
    icon: "💳",
    color: "#A78BFA",
    bg: "rgba(167,139,250,.08)",
    border: "rgba(167,139,250,.25)",
    fee: "1.5%",
    time: "Instant",
    flw: "card",
    fields: [],
    hint: "Enter your card details securely in Flutterwave's PCI-DSS certified checkout.",
  },
  {
    id: "paypal",
    name: "PayPal",
    subtext: "Personal · Business",
    icon: "🅿️",
    color: "#38BDF8",
    bg: "rgba(56,189,248,.08)",
    border: "rgba(56,189,248,.25)",
    fee: "2.9% + $0.30",
    time: "Instant",
    flw: "paypal",
    fields: [],
    hint: "You'll be redirected to PayPal to authenticate. No PayPal credentials are stored by StoreWallet.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TYPE HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const TYPE_COLOR = {
  Deposit:  { text:"#00D4AA", bg:"rgba(0,212,170,.1)",   border:"rgba(0,212,170,.22)"   },
  Withdraw: { text:"#F87171", bg:"rgba(248,113,113,.1)", border:"rgba(248,113,113,.22)" },
  Transfer: { text:"#3B82F6", bg:"rgba(59,130,246,.1)",  border:"rgba(59,130,246,.22)"  },
};
const TYPE_ICON = { Deposit:"⬇️", Withdraw:"⬆️", Transfer:"↔️" };
const TYPE_SIGN = { Deposit:"+", Withdraw:"-", Transfer:"→" };

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM CHART TOOLTIP
// ─────────────────────────────────────────────────────────────────────────────
const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#0D1B2E", border:"1px solid rgba(0,212,170,.2)", borderRadius:12, padding:"10px 16px", fontSize:13, color:"#E2E8F0" }}>
      <p style={{ color:"#475569", marginBottom:4, fontSize:11 }}>{label}</p>
      <p style={{ color:payload[0].value >= 0 ? "#00D4AA" : "#F87171", fontWeight:700 }}>
        KES {Math.abs(payload[0].value).toLocaleString()}
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FUND WALLET MODAL
// ─────────────────────────────────────────────────────────────────────────────
const FundModal = ({ onClose, onSuccess, userEmail, userName }) => {
  const [method,   setMethod]   = useState(PAYMENT_METHODS[0]);
  const [amount,   setAmount]   = useState("");
  const [phone,    setPhone]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handlePay = async () => {
    const val = sanitizeAmount(amount);
    if (!val) return setError("Enter a valid amount (min KES 1).");
    if (method.id === "mpesa" && !phone.trim()) return setError("Enter your M-Pesa phone number.");
    setError("");
    setLoading(true);

    try {
      await loadFlutterwave();
      const txRef = generateTxRef();

      window.FlutterwaveCheckout({
        public_key: FLW_PUBLIC_KEY,
        tx_ref:     txRef,
        amount:     val,
        currency:   "KES",
        payment_options: method.flw,
        customer: {
          email:        sanitizeText(userEmail || "customer@storewallet.app"),
          phone_number: sanitizeText(phone),
          name:         sanitizeText(userName  || "StoreWallet User"),
        },
        customizations: {
          title:       APP_NAME,
          description: `Wallet Top-Up · ${method.name}`,
          logo:        APP_LOGO,
        },
        meta: { source: method.name, wallet: "storewallet" },
        callback: (response) => {
          // response.status === "successful" means payment went through
          if (response.status === "successful" || response.status === "completed") {
            onSuccess({ amount: val, method: method.name, txRef: response.transaction_id || txRef });
          } else {
            setError(`Payment ${response.status}. Please try again.`);
          }
          setLoading(false);
        },
        onclose: () => {
          setLoading(false);
        },
      });
    } catch (e) {
      setError("Could not load payment gateway. Check your internet connection.");
      setLoading(false);
    }
  };

  const handleAmountKey = (e) => {
    if (e.key === "Enter") handlePay();
    if (!/[0-9.]/.test(e.key) && !["Backspace","Delete","Tab","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", backdropFilter:"blur(8px)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:"#0C1830", border:"1px solid rgba(255,255,255,.08)", borderRadius:28, width:"100%", maxWidth:560, maxHeight:"90vh", overflowY:"auto", padding:36, position:"relative" }}>

        {/* Close */}
        <button onClick={onClose} style={{ position:"absolute", top:20, right:20, background:"rgba(255,255,255,.06)", border:"none", borderRadius:8, width:32, height:32, cursor:"pointer", color:"#475569", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>

        <h2 style={{ fontFamily:"'Clash Display'", fontWeight:700, fontSize:22, color:"#F1F5F9", marginBottom:6 }}>Fund Your Wallet</h2>
        <p style={{ color:"#1E3048", fontSize:13, marginBottom:24 }}>Choose a payment method and enter amount in KES</p>

        {/* Method selector */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24 }}>
          {PAYMENT_METHODS.map(m => (
            <button key={m.id} onClick={()=>{ setMethod(m); setError(""); }}
              style={{ padding:"14px 16px", borderRadius:16, border:`1px solid ${method.id===m.id?m.color:"rgba(255,255,255,.07)"}`, background:method.id===m.id?m.bg:"rgba(255,255,255,.02)", cursor:"pointer", textAlign:"left", transition:"all .2s" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:22 }}>{m.icon}</span>
                <div>
                  <p style={{ fontFamily:"'Clash Display'", fontWeight:600, fontSize:13, color: method.id===m.id?m.color:"#CBD5E1" }}>{m.name}</p>
                  <p style={{ color:"#334155", fontSize:11, marginTop:1 }}>Fee: {m.fee} · {m.time}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Hint */}
        <div style={{ background:"rgba(0,212,170,.04)", border:"1px solid rgba(0,212,170,.1)", borderRadius:12, padding:"12px 16px", marginBottom:20 }}>
          <p style={{ color:"#334155", fontSize:12, lineHeight:1.6 }}>
            <span style={{ color:"#00D4AA", fontWeight:600 }}>How it works: </span>{method.hint}
          </p>
        </div>

        {/* M-Pesa phone field */}
        {method.id === "mpesa" && (
          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", color:"#1E3048", fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8 }}>M-Pesa Phone Number</label>
            <input type="tel" placeholder="e.g. 0712 345 678" value={phone}
              onChange={e=>setPhone(e.target.value.replace(/[^\d\s+]/g,"").slice(0,15))}
              style={{ width:"100%", background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.08)", borderRadius:12, padding:"13px 18px", color:"#E2E8F0", fontSize:14, fontFamily:"'Plus Jakarta Sans'", outline:"none" }}
              autoComplete="tel" />
          </div>
        )}

        {/* Amount */}
        <label style={{ display:"block", color:"#1E3048", fontSize:11, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:10 }}>Amount (KES)</label>
        <input type="text" inputMode="decimal" placeholder="0.00" value={amount}
          onChange={e=>setAmount(e.target.value.replace(/[^0-9.]/g,""))}
          onKeyDown={handleAmountKey} maxLength={10} autoComplete="off"
          style={{ width:"100%", background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, padding:"18px 22px", color:"#F1F5F9", fontFamily:"'Clash Display'", fontSize:32, fontWeight:700, outline:"none", marginBottom:14 }} />

        {/* Quick amounts */}
        <div style={{ display:"flex", gap:8, marginBottom:22, flexWrap:"wrap" }}>
          {[500, 1000, 2500, 5000, 10000].map(v=>(
            <button key={v} onClick={()=>setAmount(String(v))}
              style={{ padding:"8px 16px", borderRadius:50, background:"rgba(0,212,170,.06)", border:"1px solid rgba(0,212,170,.14)", color:"#00D4AA", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'Plus Jakarta Sans'" }}>
              KES {v.toLocaleString()}
            </button>
          ))}
        </div>

        {KEY_MISSING && (
          <div style={{ background:"rgba(245,158,11,.07)", border:"1px solid rgba(245,158,11,.3)", borderRadius:14, padding:"14px 18px", marginBottom:16 }}>
            <p style={{ color:"#F59E0B", fontSize:13, fontWeight:700, marginBottom:6 }}>⚙️ Flutterwave Key Not Set</p>
            <p style={{ color:"#92400E", fontSize:12, lineHeight:1.7 }}>
              To accept real payments:<br/>
              1. Copy <code style={{ background:"rgba(245,158,11,.1)", padding:"1px 6px", borderRadius:4 }}>.env.example</code> → rename to <code style={{ background:"rgba(245,158,11,.1)", padding:"1px 6px", borderRadius:4 }}>.env</code><br/>
              2. Sign up at <strong>dashboard.flutterwave.com</strong><br/>
              3. Go to <strong>Settings → API Keys</strong> and copy your Public Key<br/>
              4. Paste it as <code style={{ background:"rgba(245,158,11,.1)", padding:"1px 6px", borderRadius:4 }}>VITE_FLW_PUBLIC_KEY=your_key</code><br/>
              5. Restart your dev server with <code style={{ background:"rgba(245,158,11,.1)", padding:"1px 6px", borderRadius:4 }}>npm run dev</code>
            </p>
          </div>
        )}

        {error && (
          <div style={{ background:"rgba(248,113,113,.07)", border:"1px solid rgba(248,113,113,.25)", color:"#F87171", padding:"12px 16px", borderRadius:12, marginBottom:16, fontSize:13 }}>
            ⚠ {error}
          </div>
        )}

        <button onClick={handlePay} disabled={loading || KEY_MISSING}
          style={{ width:"100%", padding:16, borderRadius:14, background: (loading || KEY_MISSING)?"rgba(0,212,170,.3)":"linear-gradient(135deg,#00B890,#00E0B0)", color:"#061018", fontFamily:"'Plus Jakarta Sans'", fontWeight:700, fontSize:15, border:"none", cursor: (loading||KEY_MISSING)?"not-allowed":"pointer", boxShadow:"0 6px 24px rgba(0,184,144,.28)", transition:"all .2s" }}>
          {loading ? "Opening Payment Gateway…" : `Pay KES ${amount||"0"} via ${method.name}`}
        </button>

        <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:16, padding:"12px 16px", borderRadius:10, background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.04)" }}>
          <span style={{ fontSize:14 }}>🔒</span>
          <span style={{ color:"#1E3048", fontSize:12 }}>Powered by Flutterwave · PCI-DSS compliant · Bank-level encryption · No card data stored by StoreWallet</span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUCCESS SCREEN
// ─────────────────────────────────────────────────────────────────────────────
const SuccessScreen = ({ amount, method, txRef, onDone }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.8)", backdropFilter:"blur(8px)", zIndex:1001, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
    <div style={{ background:"#0C1830", border:"1px solid rgba(0,212,170,.25)", borderRadius:28, width:"100%", maxWidth:420, padding:40, textAlign:"center" }}>
      <div style={{ width:72, height:72, borderRadius:"50%", background:"rgba(0,212,170,.12)", border:"2px solid rgba(0,212,170,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 20px" }}>✓</div>
      <h2 style={{ fontFamily:"'Clash Display'", fontWeight:700, fontSize:24, color:"#F1F5F9", marginBottom:8 }}>Payment Successful!</h2>
      <p style={{ color:"#334155", fontSize:14, marginBottom:24 }}>Your wallet has been funded</p>

      <div style={{ background:"rgba(0,212,170,.06)", border:"1px solid rgba(0,212,170,.15)", borderRadius:18, padding:24, marginBottom:24 }}>
        <div style={{ fontFamily:"'Clash Display'", fontWeight:700, fontSize:38, color:"#00D4AA", marginBottom:6 }}>
          KES {Number(amount).toLocaleString()}
        </div>
        <p style={{ color:"#334155", fontSize:13 }}>Added via {method}</p>
        <p style={{ color:"#1E3048", fontSize:11, marginTop:8, fontFamily:"monospace" }}>Ref: {txRef}</p>
      </div>

      <button onClick={onDone} style={{ width:"100%", padding:14, borderRadius:13, background:"linear-gradient(135deg,#00B890,#00E0B0)", color:"#061018", fontFamily:"'Plus Jakarta Sans'", fontWeight:700, fontSize:14, border:"none", cursor:"pointer" }}>
        Back to Wallet
      </button>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { balance, transactions, deposit, withdraw, transfer } = useContext(WalletContext);

  const [activeTab,     setActiveTab]     = useState("overview");
  const [showFundModal, setShowFundModal] = useState(false);
  const [successData,   setSuccessData]   = useState(null);   // {amount, method, txRef}
  const [actionType,    setActionType]    = useState("withdraw"); // withdraw | transfer
  const [selSource,     setSelSource]     = useState(PAYMENT_METHODS[0]);
  const [amount,        setAmount]        = useState("");
  const [recipient,     setRecipient]     = useState("");
  const [note,          setNote]          = useState("");
  const [feedback,      setFeedback]      = useState(null);
  const [txFilter,      setTxFilter]      = useState("All");
  const [showBal,       setShowBal]       = useState(true);
  const [walletSection, setWalletSection] = useState("home"); // home | send

  // Real user from auth context
  const { user } = useContext(FinTechContext);
  const userEmail = user?.email || "user@storewallet.app";
  const userName  = user?.name  || user?.fullName || "StoreWallet User";

  // ── Derived ─────────────────────────────────────────────────────────────
  const income    = transactions.filter(t=>t.type==="Deposit").reduce((a,b)=>a+b.amount,0);
  const expense   = transactions.filter(t=>t.type==="Withdraw").reduce((a,b)=>a+b.amount,0);
  const xfers     = transactions.filter(t=>t.type==="Transfer").reduce((a,b)=>a+b.amount,0);
  const savingsRate = income > 0 ? Math.max(0, Math.round(((income-expense-xfers)/income)*100)) : 0;
  const avgTx     = transactions.length > 0 ? Math.round((income+expense+xfers)/transactions.length) : 0;
  const filteredTx = txFilter==="All" ? transactions : transactions.filter(t=>t.type===txFilter);

  const areaData = [...transactions].reverse().slice(-12).reduce((acc,t,i)=>{
    const prev = acc[i-1]?.balance ?? 0;
    const delta = t.type==="Deposit" ? t.amount : -t.amount;
    acc.push({ name: t.date ? t.date.slice(5) : `T${i+1}`, balance: Math.max(0,prev+delta) });
    return acc;
  },[]);

  const barData = [
    { name:"Funded",    value:income,  color:"#00D4AA" },
    { name:"Withdrawn", value:expense, color:"#F87171" },
    { name:"Transfers", value:xfers,   color:"#3B82F6" },
    { name:"Balance",   value:balance, color:"#A78BFA" },
  ];

  const pieData = [
    { name:"Deposits",   value:transactions.filter(t=>t.type==="Deposit").length,  fill:"#00D4AA" },
    { name:"Withdrawals",value:transactions.filter(t=>t.type==="Withdraw").length, fill:"#F87171" },
    { name:"Transfers",  value:transactions.filter(t=>t.type==="Transfer").length, fill:"#3B82F6" },
  ].filter(d=>d.value>0);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const showFb = (type, msg) => { setFeedback({type,msg}); setTimeout(()=>setFeedback(null),4000); };

  const handleFundSuccess = useCallback(({amount:amt, method:mth, txRef}) => {
    deposit(amt, { source: mth, txRef });
    setShowFundModal(false);
    setSuccessData({ amount:amt, method:mth, txRef });
  }, [deposit]);

  const handleSend = useCallback(() => {
    const val = sanitizeAmount(amount);
    if (!val) return showFb("error","Enter a valid amount.");
    if (val > balance) return showFb("error",`Insufficient funds. Available: KES ${balance.toLocaleString()}`);
    const rec = sanitizeText(recipient);
    const nt  = sanitizeText(note);

    if (actionType === "withdraw") {
      withdraw(val, { source: selSource.name, recipient: rec||undefined, note: nt||undefined });
      showFb("success",`KES ${val.toLocaleString()} withdrawn to ${selSource.name}!`);
    } else {
      if (!rec.trim()) return showFb("error","Enter a recipient (email, phone or account).");
      transfer(val, { recipient: rec, note: nt||undefined });
      showFb("success",`KES ${val.toLocaleString()} transferred to ${rec}!`);
    }
    setAmount(""); setRecipient(""); setNote("");
  }, [amount, actionType, balance, withdraw, transfer, selSource, recipient, note]);

  const handleKey = (e) => {
    if (e.key==="Enter") handleSend();
    if (!/[0-9.]/.test(e.key) && !["Backspace","Delete","Tab","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();
  };

  const tabs = [
    { id:"overview",     label:"Overview",     icon:"⬡" },
    { id:"wallet",       label:"Wallet",       icon:"◈" },
    { id:"transactions", label:"Transactions", icon:"≡" },
    { id:"analytics",   label:"Analytics",   icon:"◎" },
  ];

  return (
    <div style={{ background:"#080F1E", minHeight:"100vh", fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#E2E8F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .tab-pill{display:flex;align-items:center;gap:7px;padding:9px 18px;border-radius:50px;border:1px solid transparent;cursor:pointer;font-size:13px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;transition:all .22s;white-space:nowrap}
        .tab-pill.active{background:rgba(0,212,170,.12);border-color:rgba(0,212,170,.3);color:#00D4AA}
        .tab-pill.inactive{background:transparent;color:#334155}
        .tab-pill.inactive:hover{background:rgba(255,255,255,.04);color:#64748B}
        .glass-card{background:linear-gradient(135deg,rgba(12,24,48,.9) 0%,rgba(8,16,36,.95) 100%);border:1px solid rgba(255,255,255,.06);border-radius:22px;position:relative;overflow:hidden}
        .glass-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(0,212,170,.18),transparent)}
        .stat-card{border-radius:20px;padding:24px;transition:transform .22s,box-shadow .22s}
        .stat-card:hover{transform:translateY(-4px);box-shadow:0 20px 50px rgba(0,0,0,.4)}
        .dep-btn{padding:14px 22px;border-radius:13px;background:linear-gradient(135deg,#00B890,#00E0B0);color:#061018;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:14px;border:none;cursor:pointer;box-shadow:0 6px 24px rgba(0,184,144,.28);transition:transform .2s,box-shadow .2s}
        .dep-btn:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(0,184,144,.4)}
        .wdr-btn{padding:14px 22px;border-radius:13px;background:rgba(248,113,113,.06);color:#F87171;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:14px;border:1px solid rgba(248,113,113,.25);cursor:pointer;transition:all .2s}
        .wdr-btn:hover{background:rgba(248,113,113,.12);transform:translateY(-2px)}
        .trf-btn{padding:14px 22px;border-radius:13px;background:rgba(59,130,246,.08);color:#3B82F6;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:14px;border:1px solid rgba(59,130,246,.25);cursor:pointer;transition:all .2s}
        .trf-btn:hover{background:rgba(59,130,246,.14);transform:translateY(-2px)}
        .quick-amt{padding:9px 18px;border-radius:50px;background:rgba(0,212,170,.06);border:1px solid rgba(0,212,170,.14);color:#00D4AA;font-size:13px;font-weight:600;cursor:pointer;transition:all .18s;font-family:'Plus Jakarta Sans',sans-serif}
        .quick-amt:hover{background:rgba(0,212,170,.14);transform:scale(1.04)}
        .filter-pill{padding:7px 16px;border-radius:50px;font-size:12px;font-weight:600;cursor:pointer;transition:all .18s;font-family:'Plus Jakarta Sans',sans-serif}
        .tx-row{transition:background .18s}
        .tx-row:hover{background:rgba(0,212,170,.025) !important}
        .text-input{width:100%;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:13px 18px;color:#E2E8F0;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;outline:none;transition:border-color .2s}
        .text-input:focus{border-color:rgba(0,212,170,.4)}
        .text-input::placeholder{color:#1A2840}
        .glow-dot{border-radius:50%;display:inline-block}
        .atab{padding:10px 20px;border-radius:12px;border:1px solid rgba(255,255,255,.06);cursor:pointer;font-size:13px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;transition:all .2s}
        @keyframes fillBar{from{width:0}}.savings-fill{animation:fillBar .8s ease both}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.fade-in{animation:fadeIn .3s ease both}
        .method-pill{padding:10px 16px;border-radius:14px;cursor:pointer;transition:all .2s;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.02);display:flex;align-items:center;gap:10px}
        .method-pill:hover{background:rgba(255,255,255,.04)}
      `}</style>

      {/* ── TOP NAV ─────────────────────────────────────────────────────── */}
      <div style={{ background:"rgba(5,10,20,.85)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(255,255,255,.05)", padding:"0 40px", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:68, gap:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#00A88A,#00D4AA)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontFamily:"'Clash Display'", fontWeight:700, color:"#061018", fontSize:13 }}>SW</span>
            </div>
            <div>
              <p style={{ fontFamily:"'Clash Display'", fontWeight:700, fontSize:16, color:"#F1F5F9", lineHeight:1 }}>Dashboard</p>
              <p style={{ color:"#1E3048", fontSize:11, marginTop:2 }}>Powered by Flutterwave · KES</p>
            </div>
          </div>

          <div style={{ display:"flex", gap:4, background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.05)", borderRadius:60, padding:4 }}>
            {tabs.map(tab=>(
              <button key={tab.id} className={`tab-pill ${activeTab===tab.id?"active":"inactive"}`}
                onClick={()=>{ setActiveTab(tab.id); setWalletSection("home"); }}>
                <span style={{ fontSize:14 }}>{tab.icon}</span>{tab.label}
              </button>
            ))}
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
            {/* Fund button always visible */}
            <button className="dep-btn" style={{ padding:"10px 18px", fontSize:13 }} onClick={()=>setShowFundModal(true)}>
              + Fund Wallet
            </button>
            <div style={{ background:"rgba(0,212,170,.07)", border:"1px solid rgba(0,212,170,.15)", borderRadius:50, padding:"8px 18px", display:"flex", alignItems:"center", gap:8 }}>
              <span className="glow-dot" style={{ width:7, height:7, background:"#00D4AA", boxShadow:"0 0 6px #00D4AA" }}/>
              <span style={{ fontFamily:"'Clash Display'", fontWeight:700, fontSize:14, color:"#00D4AA" }}>
                {showBal ? `KES ${balance.toLocaleString()}` : "••••••"}
              </span>
              <button onClick={()=>setShowBal(v=>!v)} style={{ background:"none", border:"none", cursor:"pointer", color:"#334155", fontSize:13, padding:"0 2px" }}>
                {showBal?"👁️":"🙈"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── SETUP BANNER (shows until key is set) ──────────────────────── */}
      {KEY_MISSING && (
        <div style={{ background:"rgba(245,158,11,.07)", borderBottom:"1px solid rgba(245,158,11,.2)", padding:"12px 40px" }}>
          <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
            <span style={{ fontSize:16 }}>⚙️</span>
            <p style={{ color:"#F59E0B", fontSize:13, fontWeight:600 }}>
              Flutterwave not connected — payments disabled.
              <span style={{ color:"#92400E", fontWeight:400, marginLeft:6 }}>
                Copy <code style={{ background:"rgba(245,158,11,.15)", padding:"1px 6px", borderRadius:4, fontSize:12 }}>.env.example</code> → rename to <code style={{ background:"rgba(245,158,11,.15)", padding:"1px 6px", borderRadius:4, fontSize:12 }}>.env</code> → paste your key → restart server.
              </span>
            </p>
            <a href="https://dashboard.flutterwave.com/signup" target="_blank" rel="noopener noreferrer"
              style={{ marginLeft:"auto", background:"rgba(245,158,11,.15)", border:"1px solid rgba(245,158,11,.3)", color:"#F59E0B", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, textDecoration:"none", whiteSpace:"nowrap" }}>
              Get API Key →
            </a>
          </div>
        </div>
      )}

      {/* ── MODALS ──────────────────────────────────────────────────────── */}
      {showFundModal && (
        <FundModal onClose={()=>setShowFundModal(false)} onSuccess={handleFundSuccess} userEmail={userEmail} userName={userName} />
      )}
      {successData && (
        <SuccessScreen {...successData} onDone={()=>{ setSuccessData(null); setActiveTab("wallet"); }} />
      )}

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"36px 40px 60px" }}>

        {/* ════════════════ OVERVIEW ══════════════════════════════════════ */}
        {activeTab==="overview" && (
          <div style={{ display:"flex", flexDirection:"column", gap:22 }} className="fade-in">
            <div>
              <h2 style={{ fontFamily:"'Clash Display'", fontWeight:700, fontSize:26, color:"#F1F5F9", letterSpacing:"-0.02em", marginBottom:4 }}>Good day 👋</h2>
              <p style={{ color:"#334155", fontSize:14 }}>Your real-time financial overview</p>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
              {[
                { label:"Balance",   value:showBal?`KES ${balance.toLocaleString()}`:"••••", icon:"💰", color:"#00D4AA", bg:"rgba(0,212,170,.07)",  border:"rgba(0,212,170,.16)"  },
                { label:"Funded",    value:`KES ${income.toLocaleString()}`,                  icon:"📈", color:"#3B82F6", bg:"rgba(59,130,246,.07)",  border:"rgba(59,130,246,.16)"  },
                { label:"Withdrawn", value:`KES ${expense.toLocaleString()}`,                 icon:"📉", color:"#F87171", bg:"rgba(248,113,113,.07)", border:"rgba(248,113,113,.16)" },
                { label:"Transfers", value:`KES ${xfers.toLocaleString()}`,                   icon:"↔️", color:"#A78BFA", bg:"rgba(167,139,250,.07)", border:"rgba(167,139,250,.16)" },
              ].map((s,i)=>(
                <div key={i} className="stat-card" style={{ background:s.bg, border:`1px solid ${s.border}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                    <div style={{ width:40, height:40, borderRadius:12, background:`${s.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{s.icon}</div>
                    <span className="glow-dot" style={{ width:7, height:7, background:s.color, boxShadow:`0 0 6px ${s.color}` }}/>
                  </div>
                  <div style={{ fontFamily:"'Clash Display'", fontWeight:700, fontSize:22, color:s.color, marginBottom:4 }}>{s.value}</div>
                  <div style={{ color:"#334155", fontSize:12 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:16 }}>
              <div className="glass-card" style={{ padding:28 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
                  <div>
                    <p style={{ fontFamily:"'Clash Display'", fontWeight:600, fontSize:15, color:"#E2E8F0" }}>Balance Over Time</p>
                    <p style={{ color:"#1E3048", fontSize:12, marginTop:3 }}>Running KES balance</p>
                  </div>
                  <span style={{ background:"rgba(0,212,170,.07)", border:"1px solid rgba(0,212,170,.14)", borderRadius:8, padding:"5px 12px", color:"#00D4AA", fontSize:11, fontWeight:600 }}>LIVE</span>
                </div>
                {areaData.length>0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={areaData}>
                      <defs>
                        <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#00D4AA" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#00D4AA" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.03)"/>
                      <XAxis dataKey="name" stroke="#0F1E36" tick={{ fill:"#1E3048", fontSize:11 }}/>
                      <YAxis stroke="#0F1E36" tick={{ fill:"#1E3048", fontSize:11 }}/>
                      <Tooltip content={<ChartTip/>}/>
                      <Area type="monotone" dataKey="balance" stroke="#00D4AA" strokeWidth={2.5} fill="url(#balGrad)" dot={{ fill:"#00D4AA", r:3, strokeWidth:0 }}/>
                    </AreaChart>
                  </ResponsiveContainer>
                ):(
                  <div style={{ height:200, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"#1A2840", gap:8 }}>
                    <span style={{ fontSize:32 }}>📊</span>
                    <span style={{ fontSize:13 }}>Fund your wallet to see your chart!</span>
                  </div>
                )}
              </div>

              <div className="glass-card" style={{ padding:28 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <p style={{ fontFamily:"'Clash Display'", fontWeight:600, fontSize:15, color:"#E2E8F0" }}>Recent Activity</p>
                  <button onClick={()=>setActiveTab("transactions")} style={{ background:"none", border:"none", color:"#00D4AA", fontSize:12, fontWeight:600, cursor:"pointer" }}>View all →</button>
                </div>
                {transactions.length===0 ? (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:180, color:"#1A2840", gap:10 }}>
                    <span style={{ fontSize:36 }}>💳</span>
                    <span style={{ fontSize:14, fontWeight:500, color:"#334155" }}>No transactions yet</span>
                    <button className="dep-btn" style={{ marginTop:8, padding:"10px 20px", fontSize:13 }} onClick={()=>setShowFundModal(true)}>Fund Wallet Now</button>
                  </div>
                ):(
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {transactions.slice(0,5).map((t,i)=>{
                      const tc = TYPE_COLOR[t.type]||TYPE_COLOR.Deposit;
                      return (
                        <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", background:"rgba(255,255,255,.02)", borderRadius:12, border:"1px solid rgba(255,255,255,.03)" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <div style={{ width:32, height:32, borderRadius:9, background:tc.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>{TYPE_ICON[t.type]||"💸"}</div>
                            <div>
                              <p style={{ color:"#CBD5E1", fontSize:13, fontWeight:500 }}>{t.type}</p>
                              <p style={{ color:"#1E3048", fontSize:11, marginTop:1 }}>{t.source||t.recipient||t.date||"—"}</p>
                            </div>
                          </div>
                          <span style={{ color:tc.text, fontFamily:"'Clash Display'", fontWeight:700, fontSize:14 }}>
                            {TYPE_SIGN[t.type]||""}KES {t.amount.toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display:"flex", gap:12 }}>
              <button className="dep-btn" onClick={()=>setShowFundModal(true)}>⬇ Fund Wallet</button>
              <button className="wdr-btn" onClick={()=>{ setActiveTab("wallet"); setWalletSection("send"); setActionType("withdraw"); }}>⬆ Withdraw</button>
              <button className="trf-btn" onClick={()=>{ setActiveTab("wallet"); setWalletSection("send"); setActionType("transfer"); }}>↔ Transfer</button>
            </div>
          </div>
        )}

        {/* ════════════════ WALLET ════════════════════════════════════════ */}
        {activeTab==="wallet" && (
          <div className="fade-in">

            {/* HOME */}
            {walletSection==="home" && (
              <div style={{ display:"flex", flexDirection:"column", gap:22 }}>
                {/* Hero */}
                <div style={{ background:"linear-gradient(135deg,rgba(0,168,138,.18) 0%,rgba(0,80,60,.06) 100%)", border:"1px solid rgba(0,212,170,.22)", borderRadius:28, padding:"44px 40px", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220, borderRadius:"50%", background:"radial-gradient(circle,rgba(0,212,170,.12) 0%,transparent 70%)" }}/>
                  <div style={{ position:"absolute", bottom:-50, left:-50, width:160, height:160, borderRadius:"50%", background:"radial-gradient(circle,rgba(59,130,246,.08) 0%,transparent 70%)" }}/>
                  <div style={{ position:"relative", display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:24 }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                        <span className="glow-dot" style={{ width:7, height:7, background:"#00D4AA", boxShadow:"0 0 8px #00D4AA" }}/>
                        <span style={{ color:"#00D4AA", fontSize:11, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase" }}>Available Balance</span>
                      </div>
                      <div style={{ fontFamily:"'Clash Display'", fontWeight:700, fontSize:52, color:"#F1F5F9", letterSpacing:"-0.03em", lineHeight:1, marginBottom:8 }}>
                        {showBal ? `KES ${balance.toLocaleString()}` : "••••••"}
                      </div>
                      <p style={{ color:"#1E3048", fontSize:13 }}>StoreWallet · Powered by Flutterwave</p>
                    </div>
                    <div style={{ display:"flex", gap:10, alignSelf:"center", flexWrap:"wrap" }}>
                      <button className="dep-btn" onClick={()=>setShowFundModal(true)}>⬇ Fund Wallet</button>
                      <button className="wdr-btn" onClick={()=>{ setWalletSection("send"); setActionType("withdraw"); }}>⬆ Withdraw</button>
                      <button className="trf-btn" onClick={()=>{ setWalletSection("send"); setActionType("transfer"); }}>↔ Transfer</button>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                  {[
                    { label:"Total Funded",    value:`KES ${income.toLocaleString()}`,   color:"#00D4AA", icon:"⬇️" },
                    { label:"Total Withdrawn", value:`KES ${expense.toLocaleString()}`,  color:"#F87171", icon:"⬆️" },
                    { label:"Total Transfers", value:`KES ${xfers.toLocaleString()}`,    color:"#3B82F6", icon:"↔️" },
                  ].map((s,i)=>(
                    <div key={i} className="glass-card" style={{ padding:"20px 24px", display:"flex", alignItems:"center", gap:14 }}>
                      <div style={{ width:42, height:42, borderRadius:12, background:`${s.color}14`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{s.icon}</div>
                      <div>
                        <div style={{ fontFamily:"'Clash Display'", fontWeight:700, fontSize:20, color:s.color }}>{s.value}</div>
                        <div style={{ color:"#334155", fontSize:12, marginTop:2 }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* How to fund explainer */}
                <div className="glass-card" style={{ padding:28 }}>
                  <p style={{ fontFamily:"'Clash Display'", fontWeight:700, fontSize:16, color:"#E2E8F0", marginBottom:6 }}>How to Fund Your Wallet</p>
                  <p style={{ color:"#1E3048", fontSize:13, marginBottom:20 }}>Real money — no branch visit, no cash handling</p>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
                    {PAYMENT_METHODS.map(m=>(
                      <div key={m.id} className="method-pill"
                        style={{ background:m.bg, border:`1px solid ${m.border}`, borderRadius:16, padding:"18px 16px", flexDirection:"column", alignItems:"flex-start", gap:0, cursor:"pointer" }}
                        onClick={()=>setShowFundModal(true)}>
                        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                          <div style={{ width:40, height:40, borderRadius:12, background:`${m.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{m.icon}</div>
                          <p style={{ fontFamily:"'Clash Display'", fontWeight:600, fontSize:13, color:"#E2E8F0" }}>{m.name}</p>
                        </div>
                        <p style={{ color:"#334155", fontSize:11, marginBottom:8 }}>{m.hint.slice(0,60)}…</p>
                        <div style={{ display:"flex", justifyContent:"space-between", width:"100%" }}>
                          <span style={{ color:m.color, fontSize:11, fontWeight:600 }}>Fee: {m.fee}</span>
                          <span style={{ color:"#1E3048", fontSize:11 }}>{m.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="dep-btn" style={{ marginTop:20, width:"100%" }} onClick={()=>setShowFundModal(true)}>
                    + Fund My Wallet Now
                  </button>
                </div>
              </div>
            )}

            {/* SEND / WITHDRAW */}
            {walletSection==="send" && (
              <div className="fade-in" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, alignItems:"start" }}>
                {/* Left info */}
                <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                  <button onClick={()=>setWalletSection("home")} style={{ background:"none", border:"none", color:"#334155", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'Plus Jakarta Sans'", display:"flex", alignItems:"center", gap:6, alignSelf:"flex-start" }}>← Back</button>

                  <div className="glass-card" style={{ padding:28 }}>
                    <p style={{ color:"#1E3048", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:8 }}>Available Balance</p>
                    <div style={{ fontFamily:"'Clash Display'", fontWeight:700, fontSize:38, color:"#00D4AA", marginBottom:4 }}>
                      {showBal?`KES ${balance.toLocaleString()}`:"••••••"}
                    </div>
                    <p style={{ color:"#1E3048", fontSize:12 }}>Real-time wallet balance</p>
                  </div>

                  {/* Method picker for withdraw */}
                  {actionType==="withdraw" && (
                    <div className="glass-card" style={{ padding:22 }}>
                      <p style={{ color:"#1E3048", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>Withdraw Destination</p>
                      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        {PAYMENT_METHODS.map(m=>(
                          <div key={m.id} className="method-pill"
                            style={{ background:selSource.id===m.id?m.bg:"rgba(255,255,255,.02)", border:`1px solid ${selSource.id===m.id?m.color:"rgba(255,255,255,.06)"}` }}
                            onClick={()=>setSelSource(m)}>
                            <span style={{ fontSize:20 }}>{m.icon}</span>
                            <div style={{ flex:1 }}>
                              <p style={{ color:selSource.id===m.id?m.color:"#CBD5E1", fontSize:13, fontWeight:600 }}>{m.name}</p>
                              <p style={{ color:"#334155", fontSize:11 }}>{m.time} · {m.fee}</p>
                            </div>
                            {selSource.id===m.id&&<span style={{ color:m.color, fontSize:14 }}>✓</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right form */}
                <div className="glass-card" style={{ padding:32 }}>
                  <div style={{ display:"flex", gap:6, marginBottom:24, background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.05)", borderRadius:12, padding:5 }}>
                    {[
                      { t:"withdraw", l:"⬆ Withdraw", ac:"rgba(248,113,113,.12)", ab:"rgba(248,113,113,.3)", at:"#F87171" },
                      { t:"transfer", l:"↔ Transfer", ac:"rgba(59,130,246,.12)",  ab:"rgba(59,130,246,.3)",  at:"#3B82F6" },
                    ].map(a=>(
                      <button key={a.t} className="atab" style={{ flex:1, background:actionType===a.t?a.ac:"transparent", borderColor:actionType===a.t?a.ab:"transparent", color:actionType===a.t?a.at:"#334155", textAlign:"center" }}
                        onClick={()=>{ setActionType(a.t); setFeedback(null); setAmount(""); }}>
                        {a.l}
                      </button>
                    ))}
                  </div>

                  <h3 style={{ fontFamily:"'Clash Display'", fontWeight:700, fontSize:18, color:"#F1F5F9", marginBottom:4 }}>
                    {actionType==="withdraw"?"Withdraw Funds":"Transfer Funds"}
                  </h3>
                  <p style={{ color:"#1E3048", fontSize:13, marginBottom:24 }}>
                    {actionType==="withdraw"?`Send to your ${selSource.name}`:"Send to another StoreWallet account"}
                  </p>

                  {feedback && (
                    <div style={{ background:feedback.type==="success"?"rgba(0,212,170,.07)":"rgba(248,113,113,.07)", border:`1px solid ${feedback.type==="success"?"rgba(0,212,170,.25)":"rgba(248,113,113,.25)"}`, color:feedback.type==="success"?"#00D4AA":"#F87171", padding:"12px 16px", borderRadius:12, marginBottom:20, fontSize:13, fontWeight:500 }}>
                      {feedback.type==="success"?"✓":"⚠"} {feedback.msg}
                    </div>
                  )}

                  <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:20 }}>
                    <div>
                      <label style={{ display:"block", color:"#1E3048", fontSize:11, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:8 }}>
                        {actionType==="withdraw"?"Account / Phone Number":"Recipient Email or Phone"}
                      </label>
                      <input type="text" className="text-input"
                        placeholder={actionType==="withdraw"?`Your ${selSource.name} number / account`:"e.g. 0712345678 or user@email.com"}
                        value={recipient} onChange={e=>setRecipient(sanitizeText(e.target.value))} autoComplete="off"/>
                    </div>
                    <div>
                      <label style={{ display:"block", color:"#1E3048", fontSize:11, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:8 }}>Note (optional)</label>
                      <input type="text" className="text-input" placeholder="e.g. Rent, Salary…"
                        value={note} onChange={e=>setNote(sanitizeText(e.target.value))} autoComplete="off"/>
                    </div>
                  </div>

                  <label style={{ display:"block", color:"#1E3048", fontSize:11, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:10 }}>Amount (KES)</label>
                  <input type="text" inputMode="decimal"
                    style={{ width:"100%", background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, padding:"18px 22px", color:"#F1F5F9", fontFamily:"'Clash Display'", fontSize:32, fontWeight:700, outline:"none", marginBottom:14 }}
                    placeholder="0.00" value={amount} onChange={e=>setAmount(e.target.value.replace(/[^0-9.]/g,""))}
                    onKeyDown={handleKey} maxLength={10} autoComplete="off"/>

                  <div style={{ display:"flex", gap:8, marginBottom:22, flexWrap:"wrap" }}>
                    {[500,1000,2500,5000,10000].map(v=>(
                      <button key={v} className="quick-amt" onClick={()=>setAmount(String(v))}>KES {v.toLocaleString()}</button>
                    ))}
                  </div>

                  <button className={actionType==="withdraw"?"wdr-btn":"trf-btn"} style={{ width:"100%", fontSize:15, padding:16 }} onClick={handleSend}>
                    {actionType==="withdraw"?`⬆ Withdraw to ${selSource.name}`:"↔ Send Transfer"}
                  </button>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:16, padding:"11px 14px", borderRadius:10, background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.04)" }}>
                    <span style={{ fontSize:13 }}>🔒</span>
                    <span style={{ color:"#1E3048", fontSize:12 }}>Balance validated · Inputs sanitised · No data sent to third parties</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════ TRANSACTIONS ══════════════════════════════════ */}
        {activeTab==="transactions" && (
          <div style={{ display:"flex", flexDirection:"column", gap:18 }} className="fade-in">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:12 }}>
              <div>
                <h2 style={{ fontFamily:"'Clash Display'", fontWeight:700, fontSize:22, color:"#F1F5F9", letterSpacing:"-0.01em", marginBottom:4 }}>Transaction History</h2>
                <p style={{ color:"#1E3048", fontSize:13 }}>{filteredTx.length} of {transactions.length} records · Fundings, Withdrawals & Transfers</p>
              </div>
              <div style={{ display:"flex", gap:6, background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.05)", borderRadius:50, padding:4 }}>
                {["All","Deposit","Withdraw","Transfer"].map(f=>(
                  <button key={f} className="filter-pill" onClick={()=>setTxFilter(f)}
                    style={{ background:txFilter===f?"rgba(0,212,170,.12)":"transparent", border:`1px solid ${txFilter===f?"rgba(0,212,170,.3)":"transparent"}`, color:txFilter===f?"#00D4AA":"#334155" }}>
                    {f==="Deposit"?"Funded":f}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
              {[
                { label:"Funded",      value:`KES ${income.toLocaleString()}`,   color:"#00D4AA", count:transactions.filter(t=>t.type==="Deposit").length },
                { label:"Withdrawn",   value:`KES ${expense.toLocaleString()}`,  color:"#F87171", count:transactions.filter(t=>t.type==="Withdraw").length },
                { label:"Transferred", value:`KES ${xfers.toLocaleString()}`,    color:"#3B82F6", count:transactions.filter(t=>t.type==="Transfer").length },
                { label:"Net Balance", value:`KES ${balance.toLocaleString()}`,  color:"#A78BFA", count:transactions.length },
              ].map((s,i)=>(
                <div key={i} className="glass-card" style={{ padding:"16px 20px" }}>
                  <div style={{ fontFamily:"'Clash Display'", fontWeight:700, fontSize:17, color:s.color, marginBottom:4 }}>{s.value}</div>
                  <div style={{ color:"#334155", fontSize:12 }}>{s.label}</div>
                  <div style={{ color:"#1E3048", fontSize:11, marginTop:2 }}>{s.count} txns</div>
                </div>
              ))}
            </div>

            <div className="glass-card" style={{ overflow:"hidden" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1.8fr 1fr 1.2fr 1fr 1fr 1.4fr", padding:"14px 24px", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                {["Transaction","Type","Amount","Date","Ref","Details"].map(h=>(
                  <span key={h} style={{ color:"#1A2840", fontSize:11, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>{h}</span>
                ))}
              </div>
              {filteredTx.length===0 ? (
                <div style={{ padding:"60px 24px", textAlign:"center", color:"#1A2840", display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:36 }}>📋</span>
                  <p style={{ fontSize:14 }}>No transactions found</p>
                  <button className="dep-btn" style={{ marginTop:4 }} onClick={()=>setShowFundModal(true)}>Fund Wallet to Get Started</button>
                </div>
              ):(
                filteredTx.map((t,i)=>{
                  const tc = TYPE_COLOR[t.type]||TYPE_COLOR.Deposit;
                  return (
                    <div key={i} className="tx-row" style={{ display:"grid", gridTemplateColumns:"1.8fr 1fr 1.2fr 1fr 1fr 1.4fr", padding:"14px 24px", borderBottom:i<filteredTx.length-1?"1px solid rgba(255,255,255,.03)":"none" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <div style={{ width:36, height:36, borderRadius:10, background:tc.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{TYPE_ICON[t.type]||"💸"}</div>
                        <div>
                          <p style={{ color:"#CBD5E1", fontSize:13, fontWeight:500 }}>{t.type==="Deposit"?"Wallet Funded":t.type}</p>
                          {t.source && <p style={{ color:"#1E3048", fontSize:11 }}>via {t.source}</p>}
                        </div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center" }}>
                        <span style={{ display:"inline-block", padding:"4px 10px", borderRadius:50, fontSize:11, fontWeight:700, background:tc.bg, color:tc.text, border:`1px solid ${tc.border}` }}>
                          {t.type==="Deposit"?"FUNDED":t.type.toUpperCase()}
                        </span>
                      </div>
                      <span style={{ color:tc.text, fontFamily:"'Clash Display'", fontWeight:700, fontSize:14, display:"flex", alignItems:"center" }}>
                        {TYPE_SIGN[t.type]||""}KES {t.amount.toLocaleString()}
                      </span>
                      <span style={{ color:"#334155", fontSize:12, display:"flex", alignItems:"center" }}>{t.date||"—"}</span>
                      <span style={{ color:"#1E3048", fontSize:11, display:"flex", alignItems:"center", fontFamily:"monospace" }}>
                        {t.txRef ? t.txRef.slice(-8) : "—"}
                      </span>
                      <span style={{ color:"#1E3048", fontSize:12, display:"flex", alignItems:"center" }}>
                        {t.recipient ? `→ ${t.recipient}` : t.source ? `From ${t.source}` : "—"}
                        {t.note && <span style={{ marginLeft:6, color:"#0F1E36" }}>· {t.note}</span>}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ════════════════ ANALYTICS ═════════════════════════════════════ */}
        {activeTab==="analytics" && (
          <div style={{ display:"flex", flexDirection:"column", gap:20 }} className="fade-in">
            <div>
              <h2 style={{ fontFamily:"'Clash Display'", fontWeight:700, fontSize:22, color:"#F1F5F9", letterSpacing:"-0.01em", marginBottom:4 }}>Analytics</h2>
              <p style={{ color:"#1E3048", fontSize:13 }}>Full breakdown of your fundings, withdrawals and transfers</p>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
              {[
                { label:"Net Balance",    value:`KES ${balance.toLocaleString()}`, sub:"Total funded minus outflows", color:"#00D4AA", icon:"💰" },
                { label:"Savings Rate",   value:`${savingsRate}%`,                 sub:"% of funded amount saved",   color:"#3B82F6", icon:"📊" },
                { label:"Transfers Out",  value:`KES ${xfers.toLocaleString()}`,   sub:"Total sent to others",       color:"#A78BFA", icon:"↔️" },
                { label:"Avg Txn",        value:`KES ${avgTx.toLocaleString()}`,   sub:"Per transaction average",    color:"#F59E0B", icon:"🔄" },
              ].map((s,i)=>(
                <div key={i} className="glass-card" style={{ padding:"22px 24px" }}>
                  <div style={{ fontSize:26, marginBottom:12 }}>{s.icon}</div>
                  <div style={{ fontFamily:"'Clash Display'", fontWeight:700, fontSize:22, color:s.color, marginBottom:4 }}>{s.value}</div>
                  <div style={{ color:"#CBD5E1", fontSize:12, fontWeight:600, marginBottom:3 }}>{s.label}</div>
                  <div style={{ color:"#1E3048", fontSize:11 }}>{s.sub}</div>
                  {s.label==="Savings Rate" && (
                    <div style={{ marginTop:12, height:4, borderRadius:4, background:"rgba(255,255,255,.06)", overflow:"hidden" }}>
                      <div className="savings-fill" style={{ height:"100%", borderRadius:4, background:"#3B82F6", width:`${Math.min(savingsRate,100)}%` }}/>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:16 }}>
              <div className="glass-card" style={{ padding:28 }}>
                <p style={{ fontFamily:"'Clash Display'", fontWeight:600, fontSize:15, color:"#E2E8F0", marginBottom:4 }}>Balance Trend (KES)</p>
                <p style={{ color:"#1A2840", fontSize:12, marginBottom:22 }}>Running balance over last 12 transactions</p>
                {areaData.length>0 ? (
                  <ResponsiveContainer width="100%" height={230}>
                    <AreaChart data={areaData}>
                      <defs>
                        <linearGradient id="aGrad2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#00D4AA" stopOpacity={0.18}/>
                          <stop offset="95%" stopColor="#00D4AA" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.03)"/>
                      <XAxis dataKey="name" stroke="#0F1E36" tick={{ fill:"#1E3048", fontSize:11 }}/>
                      <YAxis stroke="#0F1E36" tick={{ fill:"#1E3048", fontSize:11 }}/>
                      <Tooltip content={<ChartTip/>}/>
                      <Area type="monotone" dataKey="balance" stroke="#00D4AA" strokeWidth={2.5} fill="url(#aGrad2)" dot={{ fill:"#00D4AA", r:3, strokeWidth:0 }}/>
                    </AreaChart>
                  </ResponsiveContainer>
                ):(
                  <div style={{ height:230, display:"flex", alignItems:"center", justifyContent:"center", color:"#1A2840", fontSize:14 }}>No data yet</div>
                )}
              </div>

              <div className="glass-card" style={{ padding:28 }}>
                <p style={{ fontFamily:"'Clash Display'", fontWeight:600, fontSize:15, color:"#E2E8F0", marginBottom:4 }}>Money Flows</p>
                <p style={{ color:"#1A2840", fontSize:12, marginBottom:22 }}>Funded · Withdrawn · Transferred · Balance</p>
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={barData} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.03)"/>
                    <XAxis dataKey="name" stroke="#0F1E36" tick={{ fill:"#1E3048", fontSize:12 }}/>
                    <YAxis stroke="#0F1E36" tick={{ fill:"#1E3048", fontSize:11 }}/>
                    <Tooltip contentStyle={{ background:"#0D1B2E", border:"1px solid rgba(0,212,170,.2)", borderRadius:12, color:"#E2E8F0", fontSize:12 }}/>
                    <Bar dataKey="value" radius={[8,8,0,0]}>
                      {barData.map((e,i)=><Cell key={i} fill={e.color} fillOpacity={0.85}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {/* Transfer details */}
              <div className="glass-card" style={{ padding:28 }}>
                <p style={{ fontFamily:"'Clash Display'", fontWeight:600, fontSize:15, color:"#E2E8F0", marginBottom:6 }}>Transfer Details</p>
                <p style={{ color:"#1A2840", fontSize:12, marginBottom:20 }}>Outbound transfers from your wallet</p>
                {transactions.filter(t=>t.type==="Transfer").length===0 ? (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:120, color:"#1A2840", gap:8 }}>
                    <span style={{ fontSize:28 }}>↔️</span><span style={{ fontSize:13 }}>No transfers yet</span>
                  </div>
                ):(
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {transactions.filter(t=>t.type==="Transfer").slice(0,6).map((t,i)=>(
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", background:"rgba(59,130,246,.05)", borderRadius:12, border:"1px solid rgba(59,130,246,.1)" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:32, height:32, borderRadius:9, background:"rgba(59,130,246,.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>↔️</div>
                          <div>
                            <p style={{ color:"#CBD5E1", fontSize:13, fontWeight:500 }}>{t.recipient||"Transfer"}</p>
                            <p style={{ color:"#1E3048", fontSize:11 }}>{t.date||"—"}{t.note?` · ${t.note}`:""}</p>
                          </div>
                        </div>
                        <span style={{ color:"#3B82F6", fontFamily:"'Clash Display'", fontWeight:700, fontSize:14 }}>KES {t.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 14px", background:"rgba(59,130,246,.08)", borderRadius:12, border:"1px solid rgba(59,130,246,.18)", marginTop:4 }}>
                      <span style={{ color:"#3B82F6", fontSize:13, fontWeight:600 }}>Total Transferred</span>
                      <span style={{ color:"#3B82F6", fontFamily:"'Clash Display'", fontWeight:700, fontSize:16 }}>KES {xfers.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Pie */}
              <div className="glass-card" style={{ padding:28 }}>
                <p style={{ fontFamily:"'Clash Display'", fontWeight:600, fontSize:15, color:"#E2E8F0", marginBottom:6 }}>Transaction Mix</p>
                <p style={{ color:"#1A2840", fontSize:12, marginBottom:10 }}>Proportion of fundings, withdrawals and transfers</p>
                {pieData.length>0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="45%" outerRadius={80} dataKey="value" paddingAngle={3}>
                        {pieData.map((e,i)=><Cell key={i} fill={e.fill}/>)}
                      </Pie>
                      <Tooltip contentStyle={{ background:"#0D1B2E", border:"1px solid rgba(0,212,170,.2)", borderRadius:12, color:"#E2E8F0", fontSize:12 }}/>
                      <Legend formatter={v=><span style={{ color:"#94A3B8", fontSize:12 }}>{v}</span>}/>
                    </PieChart>
                  </ResponsiveContainer>
                ):(
                  <div style={{ height:220, display:"flex", alignItems:"center", justifyContent:"center", color:"#1A2840", fontSize:14 }}>Make transactions first</div>
                )}
              </div>
            </div>

            <div className="glass-card" style={{ padding:28 }}>
              <p style={{ fontFamily:"'Clash Display'", fontWeight:600, fontSize:15, color:"#E2E8F0", marginBottom:20 }}>Full Breakdown</p>
              <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
                {[
                  { label:"Fundings",    count:transactions.filter(t=>t.type==="Deposit").length,  total:income,  color:"#00D4AA" },
                  { label:"Withdrawals", count:transactions.filter(t=>t.type==="Withdraw").length, total:expense, color:"#F87171" },
                  { label:"Transfers",   count:transactions.filter(t=>t.type==="Transfer").length, total:xfers,   color:"#3B82F6" },
                ].map((b,i)=>(
                  <div key={i} style={{ flex:1, minWidth:180 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                      <span style={{ color:"#334155", fontSize:13, fontWeight:500 }}>{b.label}</span>
                      <span style={{ color:b.color, fontFamily:"'Clash Display'", fontWeight:700, fontSize:13 }}>{b.count} · KES {b.total.toLocaleString()}</span>
                    </div>
                    <div style={{ height:6, borderRadius:6, background:"rgba(255,255,255,.05)", overflow:"hidden" }}>
                      <div style={{ height:"100%", borderRadius:6, background:b.color, width:`${transactions.length>0?(b.count/transactions.length)*100:0}%`, opacity:0.85 }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;