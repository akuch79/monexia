import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PlatformContext } from "../context/PlatformContext";
import { FinTechContext }  from "../context/FinTechContext";

const sanitize       = (v,max=100) => String(v).replace(/[<>"'`\\]/g,"").slice(0,max);
const sanitizeAmount = (v) => {
  const n = parseFloat(String(v).replace(/[^0-9.]/g,""));
  if (isNaN(n)||n<=0||n>1_000_000) return null;
  return Math.round(n*100)/100;
};

// ── Payment Link Page (pay/[slug]) ────────────────────────────────────────────\\\

export default function MerchantPayPage() {
  const { slug }             = useParams();
  const { findUser, platformTransfer, getUserById, users } = useContext(PlatformContext);
  const { user: authUser }   = useContext(FinTechContext);

  const currentUserId = authUser?.platformId || "u1";
  const currentUser   = getUserById(currentUserId) || users[0];

  const merchant = findUser(slug) || users.find(u=>u.merchantSlug===slug);

  const [amount,  setAmount]  = useState("");
  const [note,    setNote]    = useState("");
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [copied,  setCopied]  = useState(false);

  const fee     = Math.round((sanitizeAmount(amount)||0) * 0.01 * 100) / 100;
  const receive = Math.max(0, Math.round(((sanitizeAmount(amount)||0)-fee)*100)/100);
  const payLink = `${window.location.origin}/pay/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(payLink).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); });
  };

  const handlePay = () => {
    const val = sanitizeAmount(amount);
    if (!val) return setError("Enter a valid amount.");
    if (val > currentUser?.balance) return setError(`Insufficient balance. You have KES ${currentUser?.balance.toLocaleString()}.`);
    setLoading(true);
    setError("");
    setTimeout(() => {
      const res = platformTransfer({ fromId:currentUserId, toQuery:merchant.email, amount:val, note:sanitize(note) });
      if (res.success) setResult(res);
      else setError(res.error);
      setLoading(false);
    }, 900);
  };

  const S = {
    page:  { background:"#080F1E", minHeight:"100vh", fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#E2E8F0" },
    card:  { background:"linear-gradient(135deg,rgba(12,24,48,.9),rgba(8,16,36,.95))", border:"1px solid rgba(255,255,255,.06)", borderRadius:22, padding:28 },
    label: { display:"block", color:"#1E3048", fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8 },
    input: { width:"100%", background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, padding:"13px 18px", color:"#E2E8F0", fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:14, outline:"none" },
    btn:   { width:"100%", padding:16, borderRadius:13, background:"linear-gradient(135deg,#00B890,#00E0B0)", color:"#061018", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:15, border:"none", cursor:"pointer" },
  };

  // ── MERCHANT SETUP PAGE (when user is viewing their own merchant page) ─────
  const isMerchant = currentUser?.merchant && currentUser?.merchantSlug === slug;

  // ── NOT FOUND ─────────────────────────────────────────────────────────────
  if (!merchant || !merchant.merchant) return (
    <div style={{ ...S.page, display:"flex", alignItems:"center", justifyContent:"center", padding:40 }}>
      <div style={{ ...S.card, maxWidth:420, textAlign:"center", padding:48 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
        <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:22, color:"#F1F5F9", marginBottom:8 }}>Page Not Found</h2>
        <p style={{ color:"#334155", fontSize:14 }}>No merchant found at <code style={{ color:"#00D4AA" }}>/pay/{slug}</code></p>
        <p style={{ color:"#1E3048", fontSize:13, marginTop:12 }}>Are you a business? Register as a merchant to get your payment link.</p>
      </div>
    </div>
  );

  // ── SUCCESS ───────────────────────────────────────────────────────────────
  if (result) return (
    <div style={{ ...S.page, display:"flex", alignItems:"center", justifyContent:"center", padding:40 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={{ ...S.card, maxWidth:420, width:"100%", textAlign:"center", padding:44 }}>
        <div style={{ width:72, height:72, borderRadius:"50%", background:"rgba(0,212,170,.12)", border:"2px solid rgba(0,212,170,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 20px" }}>✓</div>
        <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:24, color:"#F1F5F9", marginBottom:8 }}>Payment Sent!</h2>
        <p style={{ color:"#334155", fontSize:14, marginBottom:28 }}>Your payment to {merchant.name} was successful</p>
        <div style={{ background:"rgba(0,212,170,.06)", border:"1px solid rgba(0,212,170,.15)", borderRadius:18, padding:24, marginBottom:24 }}>
          <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:38, color:"#00D4AA", marginBottom:4 }}>KES {result.txn.amount.toLocaleString()}</div>
          <p style={{ color:"#334155", fontSize:13 }}>Paid to {merchant.name}</p>
          <p style={{ color:"#1E3048", fontSize:11, marginTop:8, fontFamily:"monospace" }}>Ref: {result.txn.id}</p>
        </div>
        <button style={S.btn} onClick={()=>setResult(null)}>Make Another Payment</button>
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        input:focus{border-color:rgba(0,212,170,.4)!important}
        .quick-amt{padding:9px 18px;border-radius:50px;background:rgba(0,212,170,.06);border:1px solid rgba(0,212,170,.14);color:#00D4AA;font-size:13px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .18s}
        .quick-amt:hover{background:rgba(0,212,170,.14)}
      `}</style>

      <div style={{ maxWidth:560, margin:"0 auto", padding:"60px 20px" }}>

        {/* Merchant header */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:80, height:80, borderRadius:24, background:"linear-gradient(135deg,rgba(0,168,138,.2),rgba(0,80,60,.1))", border:"1px solid rgba(0,212,170,.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, fontWeight:700, color:"#00D4AA", fontFamily:"'Clash Display',sans-serif", margin:"0 auto 16px" }}>
            {merchant.name.charAt(0)}
          </div>
          <h1 style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:26, color:"#F1F5F9", marginBottom:6 }}>{merchant.name}</h1>
          {merchant.merchantDesc && <p style={{ color:"#334155", fontSize:14, marginBottom:12 }}>{merchant.merchantDesc}</p>}
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(0,212,170,.07)", border:"1px solid rgba(0,212,170,.15)", borderRadius:50, padding:"6px 14px" }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#00D4AA", display:"inline-block" }}/>
            <span style={{ color:"#00D4AA", fontSize:12, fontWeight:600 }}>Verified Merchant</span>
          </div>
        </div>

        {/* Payment form */}
        <div style={S.card}>
          <p style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:18, color:"#F1F5F9", marginBottom:4 }}>Send Payment</p>
          <p style={{ color:"#1E3048", fontSize:13, marginBottom:24 }}>to {merchant.name} · 1% platform fee</p>

          {/* Payer balance */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", background:"rgba(0,212,170,.04)", border:"1px solid rgba(0,212,170,.1)", borderRadius:12, marginBottom:20 }}>
            <span style={{ color:"#334155", fontSize:13 }}>Your wallet balance</span>
            <span style={{ color:"#00D4AA", fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:15 }}>KES {currentUser?.balance.toLocaleString()||"0"}</span>
          </div>

          <label style={S.label}>Amount (KES)</label>
          <input type="text" inputMode="decimal" placeholder="0.00"
            style={{ ...S.input, fontFamily:"'Clash Display',sans-serif", fontSize:32, fontWeight:700, padding:"18px 22px", marginBottom:12 }}
            value={amount} onChange={e=>setAmount(e.target.value.replace(/[^0-9.]/g,""))}
            onKeyDown={e=>{ if(e.key==="Enter") handlePay(); if(!/[0-9.]/.test(e.key)&&!["Backspace","Delete","Tab","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault(); }}
            maxLength={10} />
          <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap" }}>
            {[100,500,1000,2500,5000].map(v=>(
              <button key={v} className="quick-amt" onClick={()=>setAmount(String(v))}>KES {v.toLocaleString()}</button>
            ))}
          </div>

          <div style={{ marginBottom:20 }}>
            <label style={S.label}>What's this for? (optional)</label>
            <input style={S.input} placeholder="e.g. Order #123, Invoice…"
              value={note} onChange={e=>setNote(sanitize(e.target.value))} />
          </div>

          {/* Fee breakdown */}
          {sanitizeAmount(amount) > 0 && (
            <div style={{ background:"rgba(0,212,170,.04)", border:"1px solid rgba(0,212,170,.08)", borderRadius:12, padding:"12px 16px", marginBottom:18 }}>
              {[
                { l:"You pay",           v:`KES ${(sanitizeAmount(amount)||0).toLocaleString()}` },
                { l:"Platform fee (1%)", v:`KES ${fee}` },
                { l:"Merchant receives", v:`KES ${receive.toLocaleString()}`, bold:true, color:"#00D4AA" },
              ].map(r=>(
                <div key={r.l} style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ color:"#1E3048", fontSize:12 }}>{r.l}</span>
                  <span style={{ color:r.color||"#CBD5E1", fontSize:13, fontWeight:r.bold?700:400 }}>{r.v}</span>
                </div>
              ))}
            </div>
          )}

          {error && <p style={{ color:"#F87171", fontSize:13, marginBottom:14 }}>⚠ {error}</p>}

          <button style={{ ...S.btn, opacity:loading?0.6:1 }} onClick={handlePay} disabled={loading}>
            {loading ? "Processing…" : `Pay KES ${(sanitizeAmount(amount)||0).toLocaleString()} → ${merchant.name}`}
          </button>
        </div>

        {/* Share link section — only show to the merchant themselves */}
        {isMerchant && (
          <div style={{ ...S.card, marginTop:20 }}>
            <p style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:600, fontSize:15, color:"#E2E8F0", marginBottom:6 }}>Your Payment Link</p>
            <p style={{ color:"#1E3048", fontSize:13, marginBottom:16 }}>Share this link with your customers to receive payments</p>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <div style={{ flex:1, padding:"12px 16px", background:"rgba(0,212,170,.05)", border:"1px solid rgba(0,212,170,.15)", borderRadius:12, fontFamily:"monospace", fontSize:13, color:"#00D4AA", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {payLink}
              </div>
              <button onClick={handleCopy} style={{ padding:"12px 20px", borderRadius:12, background: copied?"rgba(0,212,170,.15)":"rgba(0,212,170,.08)", border:"1px solid rgba(0,212,170,.25)", color:"#00D4AA", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", whiteSpace:"nowrap" }}>
                {copied ? "✓ Copied!" : "Copy Link"}
              </button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginTop:16 }}>
              {[
                { l:"Share on WhatsApp", icon:"💬", href:`https://wa.me/?text=Pay me via StoreWallet: ${payLink}` },
                { l:"Share on Telegram", icon:"✈️", href:`https://t.me/share/url?url=${payLink}&text=Pay ${merchant.name}` },
                { l:"Share via Email",   icon:"📧", href:`mailto:?subject=Payment Link&body=Pay ${merchant.name} via StoreWallet: ${payLink}` },
              ].map(s=>(
                <a key={s.l} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"10px", background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", borderRadius:12, color:"#334155", fontSize:12, fontWeight:600, textDecoration:"none", transition:"all .2s" }}>
                  {s.icon} {s.l}
                </a>
              ))}
            </div>
          </div>
        )}

        <p style={{ textAlign:"center", color:"#0F1E36", fontSize:12, marginTop:20 }}>
          🔒 Secured by StoreWallet · Payments are instant and non-reversible
        </p>
      </div>
    </div>
  );
}