import React, { useState, useContext, useCallback } from "react";
import { PlatformContext } from "../context/PlatformContext";
import { FinTechContext }  from "../context/FinTechContext";

const sanitize = (v, max=100) => String(v).replace(/[<>"'`\\]/g,"").slice(0,max);
const sanitizeAmount = (v) => {
  const n = parseFloat(String(v).replace(/[^0-9.]/g,""));
  if (isNaN(n) || n <= 0 || n > 1_000_000) return null;
  return Math.round(n * 100) / 100;
};

// ── Shared styles ─────────────────────────────────────────────────────────────
const S = {
  page:  { background:"#080F1E", minHeight:"100vh", fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#E2E8F0", padding:"40px" },
  card:  { background:"linear-gradient(135deg,rgba(12,24,48,.9),rgba(8,16,36,.95))", border:"1px solid rgba(255,255,255,.06)", borderRadius:22, padding:28, position:"relative", overflow:"hidden" },
  label: { display:"block", color:"#1E3048", fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8 },
  input: { width:"100%", background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, padding:"13px 18px", color:"#E2E8F0", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:14, outline:"none" },
  btn:   { width:"100%", padding:16, borderRadius:13, background:"linear-gradient(135deg,#00B890,#00E0B0)", color:"#061018", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:15, border:"none", cursor:"pointer" },
  ghost: { width:"100%", padding:14, borderRadius:13, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.08)", color:"#334155", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:600, fontSize:14, cursor:"pointer" },
};

// ── Step indicator ────────────────────────────────────────────────────────────
const Steps = ({ current }) => (
  <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:32 }}>
    {["Find Recipient","Enter Amount","Confirm"].map((label,i)=>{
      const active = i === current;
      const done   = i < current;
      return (
        <React.Fragment key={i}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background: done?"#00D4AA": active?"rgba(0,212,170,.15)":"rgba(255,255,255,.04)", border:`2px solid ${done||active?"#00D4AA":"rgba(255,255,255,.08)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color: done?"#061018":active?"#00D4AA":"#334155" }}>
              {done ? "✓" : i+1}
            </div>
            <span style={{ fontSize:11, color: active?"#00D4AA":"#1E3048", fontWeight:active?600:400, whiteSpace:"nowrap" }}>{label}</span>
          </div>
          {i < 2 && <div style={{ flex:1, height:2, background: done?"#00D4AA":"rgba(255,255,255,.05)", margin:"0 8px", marginBottom:20 }}/>}
        </React.Fragment>
      );
    })}
  </div>
);

// ── User card ─────────────────────────────────────────────────────────────────
const UserCard = ({ user, onSelect }) => (
  <div onClick={onSelect} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", background:"rgba(0,212,170,.05)", border:"1px solid rgba(0,212,170,.2)", borderRadius:16, cursor:"pointer", transition:"all .2s" }}
    onMouseEnter={e=>e.currentTarget.style.background="rgba(0,212,170,.1)"}
    onMouseLeave={e=>e.currentTarget.style.background="rgba(0,212,170,.05)"}>
    <div style={{ width:46, height:46, borderRadius:14, background:"rgba(0,212,170,.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:700, color:"#00D4AA", fontFamily:"'Clash Display',sans-serif", flexShrink:0 }}>
      {user.name.charAt(0).toUpperCase()}
    </div>
    <div style={{ flex:1 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <p style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:600, fontSize:15, color:"#F1F5F9" }}>{user.name}</p>
        {user.verified && <span style={{ background:"rgba(0,212,170,.1)", border:"1px solid rgba(0,212,170,.2)", color:"#00D4AA", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:50 }}>✓ VERIFIED</span>}
        {user.merchant && <span style={{ background:"rgba(167,139,250,.1)", border:"1px solid rgba(167,139,250,.2)", color:"#A78BFA", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:50 }}>MERCHANT</span>}
      </div>
      <p style={{ color:"#334155", fontSize:12, marginTop:2 }}>{user.phone} · {user.email}</p>
    </div>
    <span style={{ color:"#00D4AA", fontSize:13, fontWeight:600 }}>Select →</span>
  </div>
);

// ── Main Transfer Page ────────────────────────────────────────────────────────
export default function TransferPage() {
  const { user: authUser }   = useContext(FinTechContext);
  const { findUser, getUserById, platformTransfer, getUserTxns, FEE_RATE, MERCHANT_RATE, users } = useContext(PlatformContext);

  // For demo, use first seed user as "logged in" if no real auth
  const currentUserId = authUser?.platformId || "u1";
  const currentUser   = getUserById(currentUserId) || users[0];

  const [step,       setStep]       = useState(0);   // 0 find | 1 amount | 2 confirm
  const [query,      setQuery]      = useState("");
  const [recipient,  setRecipient]  = useState(null);
  const [amount,     setAmount]     = useState("");
  const [note,       setNote]       = useState("");
  const [result,     setResult]     = useState(null);
  const [error,      setError]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [devOtp,     setDevOtp]     = useState(null); // show in dev mode

  const fee     = recipient ? Math.round((sanitizeAmount(amount)||0) * (recipient.merchant?MERCHANT_RATE:FEE_RATE) * 100)/100 : 0;
  const receive = Math.max(0, Math.round(((sanitizeAmount(amount)||0) - fee)*100)/100);
  const recentTxns = getUserTxns(currentUserId).slice(0,5);

  // ── Step 0: search ─────────────────────────────────────────────────────
  const handleSearch = useCallback(() => {
    setError("");
    const found = findUser(query);
    if (!found) return setError("No user found with that phone or email. Ask them to sign up first.");
    if (found.id === currentUserId) return setError("You cannot send money to yourself.");
    if (found.suspended) return setError("This account is currently unavailable.");
    setRecipient(found);
    setStep(1);
  }, [query, findUser, currentUserId]);

  // ── Step 1: validate amount ─────────────────────────────────────────────
  const handleAmountNext = () => {
    const val = sanitizeAmount(amount);
    if (!val) return setError("Enter a valid amount.");
    if (val > currentUser.balance) return setError(`Insufficient balance. You have KES ${currentUser.balance.toLocaleString()}.`);
    if (val < 1) return setError("Minimum transfer is KES 1.");
    setError("");
    setStep(2);
  };

  // ── Step 2: confirm & execute ──────────────────────────────────────────
  const handleConfirm = useCallback(() => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const res = platformTransfer({
        fromId:  currentUserId,
        toQuery: recipient.email,
        amount:  sanitizeAmount(amount),
        note:    sanitize(note),
      });
      if (res.success) {
        setResult(res);
      } else {
        setError(res.error);
      }
      setLoading(false);
    }, 900); // simulate network
  }, [platformTransfer, currentUserId, recipient, amount, note]);

  const reset = () => { setStep(0); setQuery(""); setRecipient(null); setAmount(""); setNote(""); setResult(null); setError(""); };

  // ── SUCCESS SCREEN ────────────────────────────────────────────────────────
  if (result) return (
    <div style={{ ...S.page, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ ...S.card, maxWidth:440, width:"100%", textAlign:"center", padding:44 }}>
        <div style={{ width:72, height:72, borderRadius:"50%", background:"rgba(0,212,170,.12)", border:"2px solid rgba(0,212,170,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 20px" }}>✓</div>
        <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:24, color:"#F1F5F9", marginBottom:8 }}>Transfer Sent!</h2>
        <p style={{ color:"#334155", fontSize:14, marginBottom:28 }}>Money delivered to {result.recipient.name}</p>
        <div style={{ background:"rgba(0,212,170,.06)", border:"1px solid rgba(0,212,170,.15)", borderRadius:18, padding:24, marginBottom:24 }}>
          <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:38, color:"#00D4AA", marginBottom:4 }}>KES {result.txn.amount.toLocaleString()}</div>
          <p style={{ color:"#334155", fontSize:13 }}>→ {result.recipient.name}</p>
          <p style={{ color:"#1E3048", fontSize:12, marginTop:8 }}>Platform fee: KES {result.fee} · Recipient received: KES {result.receive}</p>
          <p style={{ color:"#0F1E36", fontSize:11, marginTop:6, fontFamily:"monospace" }}>Ref: {result.txn.id}</p>
        </div>
        <button style={S.btn} onClick={reset}>Send Another Transfer</button>
      </div>
    </div>
  );

  return (
    <div style={{ ...S.page }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        input:focus{border-color:rgba(0,212,170,.4) !important}
        .quick-amt{padding:9px 18px;border-radius:50px;background:rgba(0,212,170,.06);border:1px solid rgba(0,212,170,.14);color:#00D4AA;font-size:13px;font-weight:600;cursor:pointer;transition:all .18s;font-family:'Plus Jakarta Sans',sans-serif}
        .quick-amt:hover{background:rgba(0,212,170,.14);transform:scale(1.04)}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.fade-in{animation:fadeIn .3s ease both}
      `}</style>

      <div style={{ maxWidth:900, margin:"0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:28, color:"#F1F5F9", marginBottom:6 }}>Send Money</h1>
          <p style={{ color:"#334155", fontSize:14 }}>Transfer to any StoreWallet user by phone or email · 0.5% platform fee</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:24, alignItems:"start" }}>
          {/* Left — stepper */}
          <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
            <div style={{ ...S.card }}>
              <Steps current={step} />

              {/* ── STEP 0: Find ── */}
              {step === 0 && (
                <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:16 }}>
                  <div>
                    <label style={S.label}>Recipient Phone or Email</label>
                    <input style={S.input} placeholder="e.g. 0712345678 or alice@gmail.com"
                      value={query} onChange={e=>setQuery(sanitize(e.target.value))}
                      onKeyDown={e=>e.key==="Enter"&&handleSearch()} autoComplete="off" autoFocus />
                  </div>
                  {error && <p style={{ color:"#F87171", fontSize:13 }}>⚠ {error}</p>}
                  <button style={S.btn} onClick={handleSearch}>Search Recipient →</button>

                  {/* Quick: recent recipients */}
                  {recentTxns.filter(t=>t.from===currentUserId&&t.to!=="admin").length > 0 && (
                    <div style={{ marginTop:8 }}>
                      <p style={{ ...S.label, marginBottom:12 }}>Recent Recipients</p>
                      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        {[...new Set(recentTxns.filter(t=>t.from===currentUserId&&t.to!=="admin").map(t=>t.to))].slice(0,3).map(id=>{
                          const u = getUserById(id);
                          return u ? <UserCard key={id} user={u} onSelect={()=>{ setRecipient(u); setQuery(u.email); setStep(1); }} /> : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── STEP 1: Amount ── */}
              {step === 1 && (
                <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:18 }}>
                  {/* Selected recipient */}
                  <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 18px", background:"rgba(0,212,170,.05)", border:"1px solid rgba(0,212,170,.15)", borderRadius:14 }}>
                    <div style={{ width:40, height:40, borderRadius:12, background:"rgba(0,212,170,.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, color:"#00D4AA", fontFamily:"'Clash Display',sans-serif" }}>
                      {recipient?.name.charAt(0)}
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ color:"#F1F5F9", fontWeight:600, fontSize:14 }}>{recipient?.name}</p>
                      <p style={{ color:"#334155", fontSize:12 }}>{recipient?.phone}</p>
                    </div>
                    <button onClick={()=>{ setStep(0); setRecipient(null); }} style={{ background:"none", border:"none", color:"#334155", cursor:"pointer", fontSize:12 }}>Change</button>
                  </div>

                  <div>
                    <label style={S.label}>Amount (KES)</label>
                    <input type="text" inputMode="decimal" placeholder="0.00"
                      style={{ ...S.input, fontFamily:"'Clash Display',sans-serif", fontSize:32, fontWeight:700, padding:"18px 22px" }}
                      value={amount} onChange={e=>setAmount(e.target.value.replace(/[^0-9.]/g,""))}
                      onKeyDown={e=>{ if(e.key==="Enter") handleAmountNext(); if(!/[0-9.]/.test(e.key)&&!["Backspace","Delete","Tab","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault(); }}
                      maxLength={10} autoFocus />
                    <div style={{ display:"flex", gap:8, marginTop:12, flexWrap:"wrap" }}>
                      {[100,500,1000,2500,5000].map(v=>(
                        <button key={v} className="quick-amt" onClick={()=>setAmount(String(v))}>KES {v.toLocaleString()}</button>
                      ))}
                    </div>
                  </div>

                  {/* Fee preview */}
                  {sanitizeAmount(amount) > 0 && (
                    <div style={{ background:"rgba(0,212,170,.04)", border:"1px solid rgba(0,212,170,.1)", borderRadius:12, padding:"12px 16px", display:"flex", flexDirection:"column", gap:6 }}>
                      {[
                        { l:"You send",             v:`KES ${(sanitizeAmount(amount)||0).toLocaleString()}` },
                        { l:`Platform fee (${recipient?.merchant?"1%":"0.5%"})`, v:`KES ${fee.toLocaleString()}`, dim:true },
                        { l:"Recipient receives",   v:`KES ${receive.toLocaleString()}`, bold:true, color:"#00D4AA" },
                      ].map(r=>(
                        <div key={r.l} style={{ display:"flex", justifyContent:"space-between" }}>
                          <span style={{ color:"#1E3048", fontSize:12 }}>{r.l}</span>
                          <span style={{ color:r.color||"#CBD5E1", fontSize:13, fontWeight:r.bold?700:400, fontFamily:r.bold?"'Clash Display',sans-serif":"inherit" }}>{r.v}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label style={S.label}>Note (optional)</label>
                    <input style={S.input} placeholder="e.g. Rent, Loan repayment…"
                      value={note} onChange={e=>setNote(sanitize(e.target.value))} />
                  </div>

                  {error && <p style={{ color:"#F87171", fontSize:13 }}>⚠ {error}</p>}
                  <button style={S.btn} onClick={handleAmountNext}>Review Transfer →</button>
                  <button style={S.ghost} onClick={()=>setStep(0)}>← Back</button>
                </div>
              )}

              {/* ── STEP 2: Confirm ── */}
              {step === 2 && (
                <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:18 }}>
                  <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", borderRadius:16, padding:22 }}>
                    <p style={{ ...S.label, marginBottom:16 }}>Transfer Summary</p>
                    {[
                      { l:"From",              v:currentUser?.name||"You" },
                      { l:"To",                v:`${recipient?.name} (${recipient?.phone})` },
                      { l:"Amount",            v:`KES ${(sanitizeAmount(amount)||0).toLocaleString()}` },
                      { l:"Platform Fee",      v:`KES ${fee.toLocaleString()}` },
                      { l:"Recipient Gets",    v:`KES ${receive.toLocaleString()}`, color:"#00D4AA", bold:true },
                      { l:"Note",              v:note||"—" },
                    ].map(r=>(
                      <div key={r.l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,.03)" }}>
                        <span style={{ color:"#1E3048", fontSize:13 }}>{r.l}</span>
                        <span style={{ color:r.color||"#CBD5E1", fontSize:13, fontWeight:r.bold?700:400, fontFamily:r.bold?"'Clash Display',sans-serif":"inherit", textAlign:"right", maxWidth:"55%" }}>{r.v}</span>
                      </div>
                    ))}
                  </div>

                  {error && <p style={{ color:"#F87171", fontSize:13 }}>⚠ {error}</p>}

                  <button style={{ ...S.btn, opacity: loading?0.6:1, cursor: loading?"wait":"pointer" }} onClick={handleConfirm} disabled={loading}>
                    {loading ? "Processing…" : `Confirm — Send KES ${(sanitizeAmount(amount)||0).toLocaleString()}`}
                  </button>
                  <button style={S.ghost} onClick={()=>setStep(1)}>← Edit Amount</button>

                  <div style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 14px", borderRadius:10, background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.04)" }}>
                    <span style={{ fontSize:13 }}>🔒</span>
                    <span style={{ color:"#1E3048", fontSize:12 }}>All transfers are logged and encrypted. Fees go to StoreWallet operations.</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right — sidebar info */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {/* Your balance */}
            <div style={{ ...S.card, background:"linear-gradient(135deg,rgba(0,168,138,.15),rgba(0,80,60,.05))", border:"1px solid rgba(0,212,170,.2)" }}>
              <p style={{ ...S.label }}>Your Balance</p>
              <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:32, color:"#00D4AA", marginBottom:4 }}>
                KES {currentUser?.balance.toLocaleString() || "0"}
              </div>
              <p style={{ color:"#1E3048", fontSize:12 }}>{currentUser?.name}</p>
            </div>

            {/* Fee info */}
            <div style={S.card}>
              <p style={{ ...S.label, marginBottom:14 }}>Platform Fees</p>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {[
                  { l:"User → User",     v:"0.5%", color:"#00D4AA" },
                  { l:"User → Merchant", v:"1.0%", color:"#A78BFA" },
                  { l:"Minimum fee",     v:"KES 1" },
                  { l:"Deposits",        v:"Free",  color:"#3B82F6" },
                ].map(f=>(
                  <div key={f.l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 12px", background:"rgba(255,255,255,.02)", borderRadius:8 }}>
                    <span style={{ color:"#334155", fontSize:13 }}>{f.l}</span>
                    <span style={{ color:f.color||"#CBD5E1", fontSize:13, fontWeight:600 }}>{f.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent transfers */}
            <div style={S.card}>
              <p style={{ ...S.label, marginBottom:14 }}>Recent Transfers</p>
              {recentTxns.filter(t=>t.type!=="fee").length === 0 ? (
                <p style={{ color:"#1E3048", fontSize:13, textAlign:"center", padding:"20px 0" }}>No transfers yet</p>
              ):(
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {recentTxns.filter(t=>t.type!=="fee").map((t,i)=>{
                    const other = getUserById(t.from===currentUserId?t.to:t.from);
                    const sent  = t.from === currentUserId;
                    return (
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 12px", background:"rgba(255,255,255,.02)", borderRadius:10 }}>
                        <div>
                          <p style={{ color:"#CBD5E1", fontSize:13, fontWeight:500 }}>{sent?"→":"←"} {other?.name||"Unknown"}</p>
                          <p style={{ color:"#1E3048", fontSize:11 }}>{t.date}</p>
                        </div>
                        <span style={{ color:sent?"#F87171":"#00D4AA", fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:13 }}>
                          {sent?"-":"+"}KES {t.amount.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}