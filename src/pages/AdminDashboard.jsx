import React, { useState, useContext } from "react";
import { PlatformContext } from "../context/PlatformContext";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell } from "recharts";

const ADMIN_EMAIL    = "admin@storewallet.app";
const ADMIN_PASSWORD = "admin1234";

const C = {
  bg:"#0C0A07", bgCard:"#131108", bgHover:"#1A1710",
  border:"rgba(255,200,50,.07)", borderHi:"rgba(255,200,50,.2)",
  amber:"#F5A623", amberDim:"#B87A10",
  red:"#EF4444", blue:"#60A5FA", purple:"#A78BFA", green:"#34D399",
  text:"#E8E0CC", textDim:"#6B6248", textMid:"#A89878",
};

const Badge = ({ color, children }) => (
  <span style={{ display:"inline-block", padding:"2px 9px", borderRadius:4, fontSize:10, fontWeight:800, letterSpacing:"0.08em", color, background:`${color}18`, border:`1px solid ${color}30`, textTransform:"uppercase" }}>{children}</span>
);

const Stat = ({ label, value, sub, icon, color, delta }) => (
  <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:12, padding:"20px 22px", position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${color},transparent)` }}/>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
      <span style={{ fontSize:22 }}>{icon}</span>
      {delta !== undefined && <span style={{ fontSize:11, fontWeight:700, color:delta>=0?C.green:C.red }}>{delta>=0?"▲":"▼"} {Math.abs(delta)}%</span>}
    </div>
    <div style={{ fontFamily:"'DM Mono',monospace", fontWeight:700, fontSize:22, color, marginBottom:3 }}>{value}</div>
    <div style={{ color:C.textMid, fontSize:12, fontWeight:500 }}>{label}</div>
    {sub && <div style={{ color:C.textDim, fontSize:11, marginTop:3 }}>{sub}</div>}
  </div>
);

// ── Modal wrapper ─────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", backdropFilter:"blur(6px)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
    <div style={{ background:C.bgCard, border:`1px solid ${C.borderHi}`, borderRadius:16, width:"100%", maxWidth:500, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${C.amber},${C.amberDim},transparent)` }}/>
      <div style={{ padding:"20px 24px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <p style={{ fontFamily:"'DM Mono',monospace", fontSize:14, color:C.text }}>{title}</p>
        <button onClick={onClose} style={{ background:"none", border:"none", color:C.textDim, cursor:"pointer", fontSize:18, lineHeight:1 }}>✕</button>
      </div>
      <div style={{ padding:24 }}>{children}</div>
    </div>
  </div>
);

// ── Admin Login ───────────────────────────────────────────────────────────────
const AdminLogin = ({ onLogin }) => {
  const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const [err,setErr]=useState(""); const [show,setShow]=useState(false);
  const handle = () => { if(email===ADMIN_EMAIL&&pass===ADMIN_PASSWORD) onLogin(); else setErr("Access denied. Invalid credentials."); };
  return (
    <div style={{ background:C.bg, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Plus Jakarta Sans',sans-serif", padding:20 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}.a-input{width:100%;background:rgba(255,255,255,.03);border:1px solid rgba(255,200,50,.1);border-radius:8px;padding:13px 16px;color:${C.text};font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;outline:none;transition:border-color .2s}.a-input:focus{border-color:rgba(245,166,35,.4);background:rgba(245,166,35,.03)}.a-input::placeholder{color:${C.textDim}}`}</style>
      <div style={{ position:"fixed", inset:0, backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.15) 2px,rgba(0,0,0,.15) 4px)", pointerEvents:"none" }}/>
      <div style={{ position:"fixed", top:0, right:0, width:600, height:600, background:`radial-gradient(circle at top right,${C.amber}12 0%,transparent 60%)`, pointerEvents:"none" }}/>
      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:400 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:`linear-gradient(135deg,${C.amberDim},${C.amber})`, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:18 }}>⚙</span></div>
          <div>
            <p style={{ fontFamily:"'DM Mono',monospace", fontWeight:500, fontSize:14, color:C.amber, lineHeight:1 }}>STOREWALLET</p>
            <p style={{ color:C.textDim, fontSize:11, marginTop:2, letterSpacing:"0.1em", textTransform:"uppercase" }}>Admin Console</p>
          </div>
        </div>
        <div style={{ background:C.bgCard, border:`1px solid ${C.borderHi}`, borderRadius:16, padding:36, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${C.amber},${C.amberDim},transparent)` }}/>
          <h2 style={{ fontFamily:"'DM Mono',monospace", fontWeight:500, fontSize:22, color:C.text, marginBottom:6 }}>Restricted Access</h2>
          <p style={{ color:C.textDim, fontSize:13, marginBottom:28 }}>Authorised personnel only</p>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div>
              <label style={{ display:"block", color:C.textDim, fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:7 }}>Admin Email</label>
              <input className="a-input" type="email" placeholder="admin@storewallet.app" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} />
            </div>
            <div>
              <label style={{ display:"block", color:C.textDim, fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:7 }}>Password</label>
              <div style={{ position:"relative" }}>
                <input className="a-input" type={show?"text":"password"} placeholder="••••••••" style={{ paddingRight:40 }} value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} />
                <button onClick={()=>setShow(!show)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:C.textDim, cursor:"pointer", fontSize:14 }}>{show?"🙈":"👁"}</button>
              </div>
            </div>
            {err && <div style={{ background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.2)", borderRadius:8, padding:"10px 14px", color:"#FCA5A5", fontSize:13 }}>🚫 {err}</div>}
            <button onClick={handle} style={{ marginTop:4, padding:"13px", borderRadius:8, background:`linear-gradient(135deg,${C.amberDim},${C.amber})`, color:"#0C0A07", fontFamily:"'DM Mono',monospace", fontWeight:500, fontSize:14, border:"none", cursor:"pointer" }}>AUTHENTICATE →</button>
            <p style={{ color:C.textDim, fontSize:11, textAlign:"center", fontFamily:"'DM Mono',monospace" }}>admin@storewallet.app / admin1234</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const [authed,       setAuthed]       = useState(false);
  const [tab,          setTab]          = useState("overview");
  const [collapsed,    setCollapsed]    = useState(false);
  const [toast,        setToast]        = useState("");
  // modals
  const [editUserModal,    setEditUserModal]    = useState(null);
  const [withdrawModal,    setWithdrawModal]    = useState(false);
  const [deleteUserModal,  setDeleteUserModal]  = useState(null);
  const [deleteTxModal,    setDeleteTxModal]    = useState(null);
  // filters
  const [userSearch,  setUserSearch]  = useState("");
  const [txSearch,    setTxSearch]    = useState("");
  const [txFilter,    setTxFilter]    = useState("All");
  // withdraw form
  const [wdAmount,    setWdAmount]    = useState("");
  const [wdMethod,    setWdMethod]    = useState("M-Pesa");
  const [wdDest,      setWdDest]      = useState("");
  const [wdNote,      setWdNote]      = useState("");
  const [wdError,     setWdError]     = useState("");
  // edit user form
  const [editForm,    setEditForm]    = useState({});
  // settings form
  const [settingsForm, setSettingsForm] = useState(null);

  const {
    users, platformTxns, adminBalance, siteSettings, withdrawals,
    totalVolume, totalFees, totalUsers, totalMerchants, verifiedUsers,
    verifyUser, suspendUser, unsuspendUser, deleteUser, editUser,
    deleteTransaction, updateSettings, adminWithdraw,
  } = useContext(PlatformContext);

  if (!authed) return <AdminLogin onLogin={()=>{ setAuthed(true); setSettingsForm({...siteSettings}); }} />;

  const msg = (m) => { setToast(m); setTimeout(()=>setToast(""),3500); };

  const filteredUsers = users.filter(u =>
    !userSearch ||
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.phone.includes(userSearch)
  );

  const filteredTxns = platformTxns.filter(t =>
    (txFilter==="All"||t.type===txFilter) &&
    (!txSearch||t.id.includes(txSearch)||(t.note||"").toLowerCase().includes(txSearch.toLowerCase()))
  );

  const volumeByDate = platformTxns.filter(t=>t.type!=="fee"&&t.type!=="withdrawal").reduce((acc,t)=>{
    const ex=acc.find(a=>a.date===t.date); if(ex) ex.volume+=t.amount; else acc.push({date:t.date,volume:t.amount}); return acc;
  },[]).sort((a,b)=>a.date.localeCompare(b.date));

  const feeByDate = platformTxns.filter(t=>t.type==="fee").reduce((acc,t)=>{
    const ex=acc.find(a=>a.date===t.date); if(ex) ex.fees+=t.amount; else acc.push({date:t.date,fees:t.amount}); return acc;
  },[]).sort((a,b)=>a.date.localeCompare(b.date));

  const txCounts = [
    {name:"Transfer",value:platformTxns.filter(t=>t.type==="transfer").length,color:C.blue},
    {name:"Merchant",value:platformTxns.filter(t=>t.type==="merchant").length,color:C.purple},
    {name:"Deposit", value:platformTxns.filter(t=>t.type==="deposit").length, color:C.green},
    {name:"Fee",     value:platformTxns.filter(t=>t.type==="fee").length,     color:C.amber},
  ];

  const getName = (id) => { if(id==="admin") return "Platform"; if(id==="external") return "External"; return users.find(u=>u.id===id)?.name||id; };
  const typeColor = t => ({fee:C.amber,deposit:C.green,transfer:C.blue,merchant:C.purple,withdrawal:C.red}[t]||C.textMid);

  const navItems = [
    {id:"overview",     label:"Overview",     icon:"◈"},
    {id:"users",        label:"Users",        icon:"◉"},
    {id:"transactions", label:"Transactions", icon:"≣"},
    {id:"revenue",      label:"Revenue",      icon:"◎"},
    {id:"withdrawals",  label:"Withdrawals",  icon:"⬇"},
    {id:"settings",     label:"Settings",     icon:"⚙"},
  ];

  // ── Withdraw handler ──────────────────────────────────────────────────────
  const handleWithdraw = () => {
    setWdError("");
    const val = parseFloat(wdAmount);
    if (!val||val<=0) return setWdError("Enter a valid amount.");
    if (!wdDest.trim()) return setWdError("Enter destination (phone or account).");
    const res = adminWithdraw({ amount:val, method:wdMethod, destination:wdDest.trim(), note:wdNote.trim() });
    if (res.success) {
      msg(`✓ Withdrew KES ${val.toLocaleString()} via ${wdMethod}`);
      setWithdrawModal(false); setWdAmount(""); setWdDest(""); setWdNote("");
    } else {
      setWdError(res.error);
    }
  };

  // ── Edit user handler ─────────────────────────────────────────────────────
  const handleEditSave = () => {
    if (!editForm.name?.trim()) return;
    editUser(editUserModal.id, { name:editForm.name, email:editForm.email, phone:editForm.phone, role:editForm.role });
    msg(`✓ ${editForm.name} updated.`);
    setEditUserModal(null);
  };

  // ── Save settings ─────────────────────────────────────────────────────────
  const handleSaveSettings = () => {
    updateSettings(settingsForm);
    msg("✓ Settings saved successfully.");
  };

  const INP = { width:"100%", background:"rgba(255,255,255,.03)", border:`1px solid ${C.border}`, borderRadius:8, padding:"11px 14px", color:C.text, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, outline:"none" };
  const LBL = { display:"block", color:C.textDim, fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:6 };

  return (
    <div style={{ background:C.bg, minHeight:"100vh", display:"flex", fontFamily:"'Plus Jakarta Sans',sans-serif", color:C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${C.bg}}::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
        .a-input{width:100%;background:rgba(255,255,255,.02);border:1px solid ${C.border};border-radius:7px;padding:10px 14px;color:${C.text};font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;outline:none;transition:border-color .2s}
        .a-input:focus{border-color:rgba(245,166,35,.35)}.a-input::placeholder{color:${C.textDim}}
        .nav-i{display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:500;color:${C.textMid};transition:all .18s;border:1px solid transparent}
        .nav-i:hover{background:${C.bgHover};color:${C.text}}
        .nav-i.on{background:rgba(245,166,35,.1);border-color:rgba(245,166,35,.2);color:${C.amber}}
        .row:hover{background:${C.bgHover}!important}
        .ab{padding:5px 12px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;border:1px solid;transition:all .18s;letter-spacing:0.03em;text-transform:uppercase}
        .fp{padding:5px 13px;border-radius:50px;font-size:12px;font-weight:600;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;border:1px solid transparent;transition:all .18s}
        @keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fu .25s ease both}
        @keyframes toast{0%{opacity:0;transform:translateY(20px)}10%{opacity:1;transform:translateY(0)}85%{opacity:1}100%{opacity:0}}.toast{animation:toast 3.5s ease forwards}
        select.a-input{appearance:none;cursor:pointer}
      `}</style>

      {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
      <div style={{ width:collapsed?64:220, flexShrink:0, background:C.bgCard, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", transition:"width .25s", overflow:"hidden", position:"sticky", top:0, height:"100vh" }}>
        <div style={{ padding:"18px 14px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:8, background:`linear-gradient(135deg,${C.amberDim},${C.amber})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <span style={{ fontSize:16 }}>⚙</span>
          </div>
          {!collapsed && <div><p style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:C.amber }}>ADMIN</p><p style={{ color:C.textDim, fontSize:10, letterSpacing:"0.1em" }}>Control Panel</p></div>}
        </div>
        <nav style={{ flex:1, padding:"12px 10px", display:"flex", flexDirection:"column", gap:3 }}>
          {navItems.map(n=>(
            <div key={n.id} className={`nav-i${tab===n.id?" on":""}`} onClick={()=>setTab(n.id)}>
              <span style={{ fontSize:15, flexShrink:0 }}>{n.icon}</span>
              {!collapsed && <span>{n.label}</span>}
            </div>
          ))}
        </nav>
        <div style={{ padding:"12px 10px", borderTop:`1px solid ${C.border}`, display:"flex", flexDirection:"column", gap:4 }}>
          {!collapsed && (
            <div style={{ background:C.bgHover, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 12px", marginBottom:4 }}>
              <p style={{ color:C.textDim, fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:3 }}>Profit Balance</p>
              <p style={{ fontFamily:"'DM Mono',monospace", fontSize:16, color:C.amber, fontWeight:700 }}>KES {adminBalance.toLocaleString()}</p>
              <button onClick={()=>setWithdrawModal(true)} style={{ marginTop:8, width:"100%", padding:"7px", borderRadius:6, background:`${C.amber}18`, border:`1px solid ${C.amber}40`, color:C.amber, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                Withdraw Profit
              </button>
            </div>
          )}
          <div className="nav-i" onClick={()=>setCollapsed(!collapsed)} style={{ justifyContent:collapsed?"center":"flex-start" }}>
            <span style={{ fontSize:14 }}>{collapsed?"→":"←"}</span>
            {!collapsed && <span style={{ fontSize:12 }}>Collapse</span>}
          </div>
          <div className="nav-i" onClick={()=>setAuthed(false)} style={{ color:C.red }}>
            <span style={{ fontSize:14 }}>⏻</span>
            {!collapsed && <span style={{ fontSize:12 }}>Sign Out</span>}
          </div>
        </div>
      </div>

      {/* ── MAIN ─────────────────────────────────────────────────────────── */}
      <div style={{ flex:1, overflow:"auto", display:"flex", flexDirection:"column" }}>

        {/* Top bar */}
        <div style={{ background:C.bgCard, borderBottom:`1px solid ${C.border}`, padding:"14px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:20 }}>
          <div>
            <h1 style={{ fontFamily:"'DM Mono',monospace", fontSize:16, color:C.text }}>{navItems.find(n=>n.id===tab)?.label}</h1>
            <p style={{ color:C.textDim, fontSize:11, marginTop:2, fontFamily:"'DM Mono',monospace" }}>storewallet.app/admin · {new Date().toLocaleDateString("en-KE",{weekday:"short",day:"numeric",month:"short"})}</p>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            {siteSettings.maintenanceMode && <Badge color={C.red}>MAINTENANCE MODE ON</Badge>}
            {siteSettings.announcementActive && <Badge color={C.amber}>ANNOUNCEMENT ACTIVE</Badge>}
            <div style={{ display:"flex", alignItems:"center", gap:6, background:C.bgHover, border:`1px solid ${C.border}`, borderRadius:8, padding:"7px 14px" }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:C.green, boxShadow:`0 0 5px ${C.green}` }}/>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:C.textMid }}>{users.length} users · {platformTxns.length} txns</span>
            </div>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="toast" style={{ position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)", background:C.bgCard, border:`1px solid ${C.borderHi}`, borderRadius:10, padding:"12px 22px", color:C.amber, fontFamily:"'DM Mono',monospace", fontSize:13, zIndex:200, whiteSpace:"nowrap", boxShadow:`0 8px 32px rgba(0,0,0,.5)` }}>
            {toast}
          </div>
        )}

        <div style={{ padding:"28px", flex:1 }}>

          {/* ════ OVERVIEW ═══════════════════════════════════════════ */}
          {tab==="overview" && (
            <div style={{ display:"flex", flexDirection:"column", gap:22 }} className="fu">
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12 }}>
                <Stat label="Total Users"  value={totalUsers}                            icon="◉" color={C.blue}   sub="Registered"  delta={12}/>
                <Stat label="Merchants"    value={totalMerchants}                        icon="🏪" color={C.purple} sub="Active"       delta={5} />
                <Stat label="Verified"     value={verifiedUsers}                         icon="✓" color={C.green}  sub="KYC approved" delta={8} />
                <Stat label="Total Volume" value={`KES ${totalVolume.toLocaleString()}`} icon="◈" color={C.amber}  sub="All time"     delta={22}/>
                <Stat label="Profit"       value={`KES ${adminBalance.toLocaleString()}`}icon="◎" color={C.amber}  sub="Platform fees" delta={18}/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:16 }}>
                <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:14, padding:22 }}>
                  <p style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:C.text, marginBottom:4 }}>Transaction Volume</p>
                  <p style={{ color:C.textDim, fontSize:11, marginBottom:18 }}>Daily KES flow</p>
                  {volumeByDate.length>0?(
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={volumeByDate}>
                        <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.amber} stopOpacity={0.2}/><stop offset="95%" stopColor={C.amber} stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.03)"/>
                        <XAxis dataKey="date" stroke="transparent" tick={{fill:C.textDim,fontSize:10}}/>
                        <YAxis stroke="transparent" tick={{fill:C.textDim,fontSize:10}}/>
                        <Tooltip contentStyle={{background:"#1A1710",border:`1px solid ${C.borderHi}`,borderRadius:10,fontSize:12,color:C.text}}/>
                        <Area type="monotone" dataKey="volume" stroke={C.amber} strokeWidth={2} fill="url(#ag)" dot={{fill:C.amber,r:3,strokeWidth:0}}/>
                      </AreaChart>
                    </ResponsiveContainer>
                  ):<div style={{height:200,display:"flex",alignItems:"center",justifyContent:"center",color:C.textDim,fontFamily:"'DM Mono',monospace",fontSize:12}}>No data yet</div>}
                </div>
                <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:14, padding:22 }}>
                  <p style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:C.text, marginBottom:4 }}>Transaction Mix</p>
                  <p style={{ color:C.textDim, fontSize:11, marginBottom:18 }}>By type</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={txCounts} barSize={22}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.03)"/>
                      <XAxis dataKey="name" stroke="transparent" tick={{fill:C.textDim,fontSize:10}}/>
                      <YAxis stroke="transparent" tick={{fill:C.textDim,fontSize:10}}/>
                      <Tooltip contentStyle={{background:"#1A1710",border:`1px solid ${C.borderHi}`,borderRadius:10,fontSize:12,color:C.text}}/>
                      <Bar dataKey="value" radius={[4,4,0,0]}>{txCounts.map((e,i)=><Cell key={i} fill={e.color} fillOpacity={0.8}/>)}</Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
                <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}` }}><p style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:C.text }}>Latest Activity</p></div>
                <div style={{ display:"grid", gridTemplateColumns:"100px 1fr 1fr 120px 80px", padding:"9px 20px", borderBottom:`1px solid ${C.border}` }}>
                  {["REF","FROM","TO","AMOUNT","TYPE"].map(h=><span key={h} style={{color:C.textDim,fontSize:10,fontWeight:700,letterSpacing:"0.12em",fontFamily:"'DM Mono',monospace"}}>{h}</span>)}
                </div>
                {platformTxns.slice(0,8).map((t,i)=>(
                  <div key={i} className="row" style={{display:"grid",gridTemplateColumns:"100px 1fr 1fr 120px 80px",padding:"11px 20px",borderBottom:i<7?`1px solid ${C.border}`:"none",alignItems:"center"}}>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:C.textDim}}>{t.id.slice(-8)}</span>
                    <span style={{fontSize:12,color:C.textMid}}>{getName(t.from)}</span>
                    <span style={{fontSize:12,color:C.textMid}}>{getName(t.to)}</span>
                    <span style={{fontFamily:"'DM Mono',monospace",fontWeight:500,fontSize:13,color:typeColor(t.type)}}>KES {t.amount.toLocaleString()}</span>
                    <Badge color={typeColor(t.type)}>{t.type}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════ USERS ══════════════════════════════════════════════ */}
          {tab==="users" && (
            <div style={{display:"flex",flexDirection:"column",gap:18}} className="fu">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
                <div><h2 style={{fontFamily:"'DM Mono',monospace",fontSize:18,color:C.text,marginBottom:3}}>User Registry</h2><p style={{color:C.textDim,fontSize:12}}>{filteredUsers.length} of {users.length} accounts</p></div>
                <input className="a-input" style={{width:260}} placeholder="Search name, email, phone…" value={userSearch} onChange={e=>setUserSearch(e.target.value)}/>
              </div>
              <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
                <div style={{display:"grid",gridTemplateColumns:"1.6fr 1.4fr 1fr 80px 80px 90px 180px",padding:"9px 20px",borderBottom:`1px solid ${C.border}`}}>
                  {["NAME","CONTACT","BALANCE","ROLE","STATUS","JOINED","ACTIONS"].map(h=><span key={h} style={{color:C.textDim,fontSize:10,fontWeight:700,letterSpacing:"0.12em",fontFamily:"'DM Mono',monospace"}}>{h}</span>)}
                </div>
                {filteredUsers.length===0&&<div style={{padding:40,textAlign:"center",color:C.textDim,fontFamily:"'DM Mono',monospace",fontSize:12}}>No users found</div>}
                {filteredUsers.map((u,i)=>(
                  <div key={u.id} className="row" style={{display:"grid",gridTemplateColumns:"1.6fr 1.4fr 1fr 80px 80px 90px 180px",padding:"12px 20px",borderBottom:i<filteredUsers.length-1?`1px solid ${C.border}`:"none",alignItems:"center"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:32,height:32,borderRadius:8,background:`${C.amber}18`,border:`1px solid ${C.amber}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:C.amber,fontFamily:"'DM Mono',monospace",flexShrink:0}}>{u.name.charAt(0)}</div>
                      <div><p style={{color:C.text,fontSize:13,fontWeight:500}}>{u.name}</p><p style={{color:C.textDim,fontSize:11}}>#{u.id}</p></div>
                    </div>
                    <div><p style={{color:C.textMid,fontSize:12}}>{u.email}</p><p style={{color:C.textDim,fontSize:11,fontFamily:"'DM Mono',monospace"}}>{u.phone}</p></div>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:C.amber}}>KES {u.balance.toLocaleString()}</span>
                    <Badge color={u.role==="merchant"?C.purple:C.blue}>{u.role}</Badge>
                    <Badge color={u.suspended?C.red:u.verified?C.green:C.amber}>{u.suspended?"Off":u.verified?"✓":"Pending"}</Badge>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:C.textDim}}>{u.joined}</span>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                      {!u.verified&&!u.suspended&&(
                        <button className="ab" style={{color:C.green,borderColor:`${C.green}40`,background:`${C.green}10`}} onClick={()=>{verifyUser(u.id);msg(`✓ ${u.name} verified.`);}}>Verify</button>
                      )}
                      {!u.suspended?(
                        <button className="ab" style={{color:C.red,borderColor:`${C.red}40`,background:`${C.red}10`}} onClick={()=>{suspendUser(u.id);msg(`${u.name} suspended.`);}}>Suspend</button>
                      ):(
                        <button className="ab" style={{color:C.green,borderColor:`${C.green}40`,background:`${C.green}10`}} onClick={()=>{unsuspendUser(u.id);msg(`${u.name} unsuspended.`);}}>Restore</button>
                      )}
                      <button className="ab" style={{color:C.blue,borderColor:`${C.blue}40`,background:`${C.blue}10`}} onClick={()=>{setEditForm({...u});setEditUserModal(u);}}>Edit</button>
                      <button className="ab" style={{color:C.red,borderColor:`${C.red}40`,background:`${C.red}10`}} onClick={()=>setDeleteUserModal(u)}>Del</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════ TRANSACTIONS ═══════════════════════════════════════ */}
          {tab==="transactions" && (
            <div style={{display:"flex",flexDirection:"column",gap:18}} className="fu">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
                <div><h2 style={{fontFamily:"'DM Mono',monospace",fontSize:18,color:C.text,marginBottom:3}}>Transaction Ledger</h2><p style={{color:C.textDim,fontSize:12}}>{filteredTxns.length} records</p></div>
                <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                  <input className="a-input" style={{width:200}} placeholder="Search ref, note…" value={txSearch} onChange={e=>setTxSearch(e.target.value)}/>
                  <div style={{display:"flex",gap:3,background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:50,padding:4}}>
                    {["All","transfer","merchant","deposit","fee","withdrawal"].map(f=>(
                      <button key={f} className="fp" style={{background:txFilter===f?`${C.amber}15`:"transparent",borderColor:txFilter===f?`${C.amber}40`:"transparent",color:txFilter===f?C.amber:C.textDim}} onClick={()=>setTxFilter(f)}>
                        {f.charAt(0).toUpperCase()+f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
                <div style={{display:"grid",gridTemplateColumns:"110px 1fr 1fr 120px 80px 80px 1fr 60px",padding:"9px 20px",borderBottom:`1px solid ${C.border}`}}>
                  {["REF","FROM","TO","AMOUNT","FEE","TYPE","DATE / NOTE",""].map(h=><span key={h} style={{color:C.textDim,fontSize:10,fontWeight:700,letterSpacing:"0.12em",fontFamily:"'DM Mono',monospace"}}>{h}</span>)}
                </div>
                {filteredTxns.length===0&&<div style={{padding:40,textAlign:"center",color:C.textDim,fontFamily:"'DM Mono',monospace",fontSize:12}}>No records found</div>}
                {filteredTxns.map((t,i)=>(
                  <div key={t.id} className="row" style={{display:"grid",gridTemplateColumns:"110px 1fr 1fr 120px 80px 80px 1fr 60px",padding:"11px 20px",borderBottom:i<filteredTxns.length-1?`1px solid ${C.border}`:"none",alignItems:"center"}}>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:C.textDim}}>{t.id.slice(-10)}</span>
                    <span style={{fontSize:12,color:C.textMid}}>{getName(t.from)}</span>
                    <span style={{fontSize:12,color:C.textMid}}>{getName(t.to)}</span>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:13,fontWeight:500,color:typeColor(t.type)}}>KES {t.amount.toLocaleString()}</span>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:C.textDim}}>KES {t.fee||0}</span>
                    <Badge color={typeColor(t.type)}>{t.type}</Badge>
                    <div><p style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:C.textDim}}>{t.date}</p>{t.note&&<p style={{fontSize:11,color:C.textDim}}>{t.note}</p>}</div>
                    <button className="ab" style={{color:C.red,borderColor:`${C.red}40`,background:`${C.red}10`}} onClick={()=>setDeleteTxModal(t)}>Del</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════ REVENUE ════════════════════════════════════════════ */}
          {tab==="revenue" && (
            <div style={{display:"flex",flexDirection:"column",gap:20}} className="fu">
              <div><h2 style={{fontFamily:"'DM Mono',monospace",fontSize:18,color:C.text,marginBottom:3}}>Revenue Dashboard</h2><p style={{color:C.textDim,fontSize:12}}>Your platform profit from all transactions</p></div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
                <Stat label="Available Profit" value={`KES ${adminBalance.toLocaleString()}`}   icon="◎" color={C.amber} sub="Ready to withdraw" delta={18}/>
                <Stat label="Total Volume"      value={`KES ${totalVolume.toLocaleString()}`}   icon="◈" color={C.blue}  sub="Processed"        delta={22}/>
                <Stat label="Take Rate"         value={totalVolume>0?`${((totalFees/totalVolume)*100).toFixed(2)}%`:"0%"} icon="%" color={C.green} sub="Avg fee rate"/>
              </div>
              <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,padding:22}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                  <div><p style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:C.text}}>Daily Fee Income</p><p style={{color:C.textDim,fontSize:11,marginTop:2}}>KES earned per day</p></div>
                  <button onClick={()=>setWithdrawModal(true)} style={{padding:"9px 18px",borderRadius:8,background:`linear-gradient(135deg,${C.amberDim},${C.amber})`,color:"#0C0A07",fontFamily:"'DM Mono',monospace",fontWeight:500,fontSize:13,border:"none",cursor:"pointer"}}>⬇ Withdraw Profit</button>
                </div>
                {feeByDate.length>0?(
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={feeByDate}>
                      <defs><linearGradient id="fg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.amber} stopOpacity={0.2}/><stop offset="95%" stopColor={C.amber} stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.03)"/>
                      <XAxis dataKey="date" stroke="transparent" tick={{fill:C.textDim,fontSize:10}}/>
                      <YAxis stroke="transparent" tick={{fill:C.textDim,fontSize:10}}/>
                      <Tooltip contentStyle={{background:"#1A1710",border:`1px solid ${C.borderHi}`,borderRadius:10,fontSize:12,color:C.text,fontFamily:"'DM Mono',monospace"}}/>
                      <Area type="monotone" dataKey="fees" stroke={C.amber} strokeWidth={2} fill="url(#fg)" dot={{fill:C.amber,r:3,strokeWidth:0}}/>
                    </AreaChart>
                  </ResponsiveContainer>
                ):<div style={{height:200,display:"flex",alignItems:"center",justifyContent:"center",color:C.textDim,fontFamily:"'DM Mono',monospace",fontSize:12}}>No fee data yet</div>}
              </div>
              <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
                <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`}}><p style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:C.text}}>Fee Income Log</p></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1.5fr 1fr 1fr",padding:"9px 20px",borderBottom:`1px solid ${C.border}`}}>
                  {["REF","FROM USER","FEE EARNED","DATE"].map(h=><span key={h} style={{color:C.textDim,fontSize:10,fontWeight:700,letterSpacing:"0.12em",fontFamily:"'DM Mono',monospace"}}>{h}</span>)}
                </div>
                {platformTxns.filter(t=>t.type==="fee").map((t,i,arr)=>(
                  <div key={t.id} className="row" style={{display:"grid",gridTemplateColumns:"1fr 1.5fr 1fr 1fr",padding:"11px 20px",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none",alignItems:"center"}}>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:C.textDim}}>{t.id.slice(-12)}</span>
                    <span style={{fontSize:12,color:C.textMid}}>{getName(t.from)}</span>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:13,fontWeight:500,color:C.amber}}>+ KES {t.amount}</span>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:C.textDim}}>{t.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════ WITHDRAWALS ════════════════════════════════════════ */}
          {tab==="withdrawals" && (
            <div style={{display:"flex",flexDirection:"column",gap:20}} className="fu">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><h2 style={{fontFamily:"'DM Mono',monospace",fontSize:18,color:C.text,marginBottom:3}}>Profit Withdrawals</h2><p style={{color:C.textDim,fontSize:12}}>History of all admin profit withdrawals</p></div>
                <button onClick={()=>setWithdrawModal(true)} style={{padding:"10px 20px",borderRadius:8,background:`linear-gradient(135deg,${C.amberDim},${C.amber})`,color:"#0C0A07",fontFamily:"'DM Mono',monospace",fontWeight:500,fontSize:13,border:"none",cursor:"pointer"}}>⬇ New Withdrawal</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
                <Stat label="Available Balance" value={`KES ${adminBalance.toLocaleString()}`} icon="◎" color={C.amber} sub="Ready to withdraw"/>
                <Stat label="Total Withdrawn"   value={`KES ${withdrawals.reduce((a,b)=>a+b.amount,0).toLocaleString()}`} icon="⬇" color={C.blue} sub="All time"/>
                <Stat label="Withdrawals Made"  value={withdrawals.length} icon="#" color={C.green} sub="Total transactions"/>
              </div>
              {withdrawals.length===0?(
                <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,padding:60,textAlign:"center"}}>
                  <p style={{fontFamily:"'DM Mono',monospace",fontSize:14,color:C.textDim,marginBottom:8}}>No withdrawals yet</p>
                  <p style={{color:C.textDim,fontSize:12}}>Withdraw your platform profits via M-Pesa, Bank Transfer, or PayPal</p>
                </div>
              ):(
                <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 120px 1fr 1fr 80px",padding:"9px 20px",borderBottom:`1px solid ${C.border}`}}>
                    {["REF","DATE","AMOUNT","METHOD","DESTINATION","STATUS"].map(h=><span key={h} style={{color:C.textDim,fontSize:10,fontWeight:700,letterSpacing:"0.12em",fontFamily:"'DM Mono',monospace"}}>{h}</span>)}
                  </div>
                  {withdrawals.map((w,i)=>(
                    <div key={w.id} className="row" style={{display:"grid",gridTemplateColumns:"1fr 1fr 120px 1fr 1fr 80px",padding:"12px 20px",borderBottom:i<withdrawals.length-1?`1px solid ${C.border}`:"none",alignItems:"center"}}>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:C.textDim}}>{w.id.slice(-10)}</span>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:C.textMid}}>{w.date}</span>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:14,fontWeight:700,color:C.amber}}>KES {w.amount.toLocaleString()}</span>
                      <span style={{fontSize:12,color:C.textMid}}>{w.method}</span>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:C.textMid}}>{w.destination}</span>
                      <Badge color={C.green}>{w.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ════ SETTINGS ═══════════════════════════════════════════ */}
          {tab==="settings" && settingsForm && (
            <div style={{display:"flex",flexDirection:"column",gap:20}} className="fu">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><h2 style={{fontFamily:"'DM Mono',monospace",fontSize:18,color:C.text,marginBottom:3}}>Platform Settings</h2><p style={{color:C.textDim,fontSize:12}}>Manage your StoreWallet configuration</p></div>
                <button onClick={handleSaveSettings} style={{padding:"10px 24px",borderRadius:8,background:`linear-gradient(135deg,${C.amberDim},${C.amber})`,color:"#0C0A07",fontFamily:"'DM Mono',monospace",fontWeight:500,fontSize:13,border:"none",cursor:"pointer"}}>Save All Settings</button>
              </div>

              {/* General */}
              <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
                <div style={{padding:"14px 22px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}><span style={{color:C.amber}}>◈</span><p style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:C.text}}>General</p></div>
                <div style={{padding:22,display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                  {[
                    {label:"Site Name",         key:"siteName",        type:"text"},
                    {label:"Support Email",      key:"supportEmail",    type:"email"},
                    {label:"Withdrawal Email",   key:"withdrawalEmail", type:"email"},
                    {label:"M-Pesa Number",      key:"mpesaNumber",     type:"text"},
                  ].map(f=>(
                    <div key={f.key}>
                      <label style={LBL}>{f.label}</label>
                      <input style={INP} type={f.type} value={settingsForm[f.key]||""} onChange={e=>setSettingsForm(p=>({...p,[f.key]:e.target.value}))}/>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fees */}
              <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
                <div style={{padding:"14px 22px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}><span style={{color:C.amber}}>◎</span><p style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:C.text}}>Fee Configuration</p></div>
                <div style={{padding:22,display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:16}}>
                  {[
                    {label:"Transfer Fee (%)",  key:"feeRate",      min:0,max:10, step:0.1},
                    {label:"Merchant Fee (%)",  key:"merchantRate", min:0,max:10, step:0.1},
                    {label:"Min Transfer (KES)",key:"minTransfer",  min:1,max:1000,step:1},
                    {label:"Max Transfer (KES)",key:"maxTransfer",  min:1000,max:2000000,step:1000},
                  ].map(f=>(
                    <div key={f.key}>
                      <label style={LBL}>{f.label}</label>
                      <input style={INP} type="number" min={f.min} max={f.max} step={f.step} value={settingsForm[f.key]||0} onChange={e=>setSettingsForm(p=>({...p,[f.key]:parseFloat(e.target.value)||0}))}/>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform controls */}
              <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
                <div style={{padding:"14px 22px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}><span style={{color:C.amber}}>⚙</span><p style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:C.text}}>Platform Controls</p></div>
                <div style={{padding:22,display:"flex",flexDirection:"column",gap:14}}>
                  {[
                    {label:"Maintenance Mode",     key:"maintenanceMode",      desc:"Disable user access — only admins can log in"},
                    {label:"Allow New Registrations",key:"allowRegistration",  desc:"Let new users sign up"},
                    {label:"Require Verification",  key:"requireVerification", desc:"Users must verify before transacting"},
                  ].map(s=>(
                    <div key={s.key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",background:C.bgHover,borderRadius:10,border:`1px solid ${C.border}`}}>
                      <div>
                        <p style={{color:C.text,fontSize:13,fontWeight:500}}>{s.label}</p>
                        <p style={{color:C.textDim,fontSize:11,marginTop:2}}>{s.desc}</p>
                      </div>
                      <div onClick={()=>setSettingsForm(p=>({...p,[s.key]:!p[s.key]}))}
                        style={{width:48,height:26,borderRadius:50,background:settingsForm[s.key]?C.amber:"rgba(255,255,255,.08)",border:`1px solid ${settingsForm[s.key]?C.amberDim:C.border}`,cursor:"pointer",position:"relative",transition:"all .2s",flexShrink:0}}>
                        <div style={{position:"absolute",top:3,left:settingsForm[s.key]?24:3,width:18,height:18,borderRadius:"50%",background:settingsForm[s.key]?"#0C0A07":"rgba(255,255,255,.3)",transition:"all .2s"}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Announcement */}
              <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
                <div style={{padding:"14px 22px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}><span style={{color:C.amber}}>📢</span><p style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:C.text}}>Site Announcement</p></div>
                <div style={{padding:22,display:"flex",flexDirection:"column",gap:14}}>
                  <div>
                    <label style={LBL}>Announcement Message</label>
                    <textarea style={{...INP,height:80,resize:"vertical",lineHeight:1.5}} placeholder="e.g. System maintenance on Saturday 10pm–2am" value={settingsForm.announcementText||""} onChange={e=>setSettingsForm(p=>({...p,announcementText:e.target.value}))}/>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:C.bgHover,borderRadius:10,border:`1px solid ${C.border}`}}>
                    <div>
                      <p style={{color:C.text,fontSize:13,fontWeight:500}}>Show Announcement Banner</p>
                      <p style={{color:C.textDim,fontSize:11,marginTop:2}}>Display to all users on the site</p>
                    </div>
                    <div onClick={()=>setSettingsForm(p=>({...p,announcementActive:!p.announcementActive}))}
                      style={{width:48,height:26,borderRadius:50,background:settingsForm.announcementActive?C.amber:"rgba(255,255,255,.08)",border:`1px solid ${settingsForm.announcementActive?C.amberDim:C.border}`,cursor:"pointer",position:"relative",transition:"all .2s",flexShrink:0}}>
                      <div style={{position:"absolute",top:3,left:settingsForm.announcementActive?24:3,width:18,height:18,borderRadius:"50%",background:settingsForm.announcementActive?"#0C0A07":"rgba(255,255,255,.3)",transition:"all .2s"}}/>
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={handleSaveSettings} style={{padding:"14px",borderRadius:10,background:`linear-gradient(135deg,${C.amberDim},${C.amber})`,color:"#0C0A07",fontFamily:"'DM Mono',monospace",fontWeight:500,fontSize:15,border:"none",cursor:"pointer",letterSpacing:"0.05em"}}>
                SAVE ALL SETTINGS
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ════ MODAL: Withdraw Profit ══════════════════════════════════════════ */}
      {withdrawModal && (
        <Modal title="⬇ Withdraw Platform Profit" onClose={()=>{setWithdrawModal(false);setWdError("");}}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{background:`${C.amber}10`,border:`1px solid ${C.amber}30`,borderRadius:10,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{color:C.textMid,fontSize:13}}>Available Balance</span>
              <span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,fontSize:18,color:C.amber}}>KES {adminBalance.toLocaleString()}</span>
            </div>
            <div>
              <label style={LBL}>Amount (KES)</label>
              <input style={INP} type="number" placeholder="Enter amount" value={wdAmount} onChange={e=>setWdAmount(e.target.value)}/>
              <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
                {[1000,5000,10000,50000].map(v=>(
                  <button key={v} onClick={()=>setWdAmount(String(Math.min(v,adminBalance)))} style={{padding:"6px 14px",borderRadius:50,background:`${C.amber}10`,border:`1px solid ${C.amber}30`,color:C.amber,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                    KES {v.toLocaleString()}
                  </button>
                ))}
                <button onClick={()=>setWdAmount(String(adminBalance))} style={{padding:"6px 14px",borderRadius:50,background:`${C.green}10`,border:`1px solid ${C.green}30`,color:C.green,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                  All
                </button>
              </div>
            </div>
            <div>
              <label style={LBL}>Withdrawal Method</label>
              <select className="a-input" style={INP} value={wdMethod} onChange={e=>setWdMethod(e.target.value)}>
                <option>M-Pesa</option>
                <option>Bank Transfer</option>
                <option>PayPal</option>
                <option>Airtel Money</option>
              </select>
            </div>
            <div>
              <label style={LBL}>{wdMethod==="M-Pesa"?"Phone Number":wdMethod==="Bank Transfer"?"Account Number":"Email / Account"}</label>
              <input style={INP} placeholder={wdMethod==="M-Pesa"?"0712345678":wdMethod==="Bank Transfer"?"1234567890":"you@example.com"} value={wdDest} onChange={e=>setWdDest(e.target.value)}/>
            </div>
            <div>
              <label style={LBL}>Note (optional)</label>
              <input style={INP} placeholder="e.g. Monthly profit withdrawal" value={wdNote} onChange={e=>setWdNote(e.target.value)}/>
            </div>
            {wdError && <div style={{background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.2)",borderRadius:8,padding:"10px 14px",color:"#FCA5A5",fontSize:13}}>⚠ {wdError}</div>}
            <button onClick={handleWithdraw} style={{padding:"13px",borderRadius:8,background:`linear-gradient(135deg,${C.amberDim},${C.amber})`,color:"#0C0A07",fontFamily:"'DM Mono',monospace",fontWeight:500,fontSize:14,border:"none",cursor:"pointer",marginTop:4}}>
              CONFIRM WITHDRAWAL
            </button>
          </div>
        </Modal>
      )}

      {/* ════ MODAL: Edit User ════════════════════════════════════════════════ */}
      {editUserModal && (
        <Modal title={`Edit User — ${editUserModal.name}`} onClose={()=>setEditUserModal(null)}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {[
              {label:"Full Name",  key:"name",  type:"text"},
              {label:"Email",      key:"email", type:"email"},
              {label:"Phone",      key:"phone", type:"text"},
            ].map(f=>(
              <div key={f.key}>
                <label style={LBL}>{f.label}</label>
                <input style={INP} type={f.type} value={editForm[f.key]||""} onChange={e=>setEditForm(p=>({...p,[f.key]:e.target.value}))}/>
              </div>
            ))}
            <div>
              <label style={LBL}>Role</label>
              <select style={INP} value={editForm.role||"user"} onChange={e=>setEditForm(p=>({...p,role:e.target.value}))}>
                <option value="user">User</option>
                <option value="merchant">Merchant</option>
              </select>
            </div>
            <button onClick={handleEditSave} style={{padding:"12px",borderRadius:8,background:`linear-gradient(135deg,${C.amberDim},${C.amber})`,color:"#0C0A07",fontFamily:"'DM Mono',monospace",fontWeight:500,fontSize:14,border:"none",cursor:"pointer",marginTop:4}}>
              SAVE CHANGES
            </button>
          </div>
        </Modal>
      )}

      {/* ════ MODAL: Delete User ═════════════════════════════════════════════ */}
      {deleteUserModal && (
        <Modal title="Delete User" onClose={()=>setDeleteUserModal(null)}>
          <div style={{textAlign:"center",padding:"10px 0"}}>
            <p style={{fontSize:40,marginBottom:16}}>⚠️</p>
            <p style={{color:C.text,fontSize:15,fontWeight:600,marginBottom:8}}>Delete {deleteUserModal.name}?</p>
            <p style={{color:C.textDim,fontSize:13,marginBottom:28}}>This action cannot be undone. Their balance of KES {deleteUserModal.balance.toLocaleString()} will be lost.</p>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setDeleteUserModal(null)} style={{flex:1,padding:"12px",borderRadius:8,background:"rgba(255,255,255,.04)",border:`1px solid ${C.border}`,color:C.textMid,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:14,cursor:"pointer"}}>Cancel</button>
              <button onClick={()=>{deleteUser(deleteUserModal.id);msg(`${deleteUserModal.name} deleted.`);setDeleteUserModal(null);}} style={{flex:1,padding:"12px",borderRadius:8,background:"rgba(239,68,68,.15)",border:"1px solid rgba(239,68,68,.3)",color:C.red,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14,cursor:"pointer"}}>
                Yes, Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ════ MODAL: Delete Transaction ══════════════════════════════════════ */}
      {deleteTxModal && (
        <Modal title="Delete Transaction" onClose={()=>setDeleteTxModal(null)}>
          <div style={{textAlign:"center",padding:"10px 0"}}>
            <p style={{fontSize:40,marginBottom:16}}>🗑</p>
            <p style={{color:C.text,fontSize:15,fontWeight:600,marginBottom:8}}>Delete transaction {deleteTxModal.id.slice(-10)}?</p>
            <p style={{color:C.textDim,fontSize:13,marginBottom:28}}>KES {deleteTxModal.amount} · {deleteTxModal.type} · {deleteTxModal.date}</p>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setDeleteTxModal(null)} style={{flex:1,padding:"12px",borderRadius:8,background:"rgba(255,255,255,.04)",border:`1px solid ${C.border}`,color:C.textMid,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:14,cursor:"pointer"}}>Cancel</button>
              <button onClick={()=>{deleteTransaction(deleteTxModal.id);msg("Transaction deleted.");setDeleteTxModal(null);}} style={{flex:1,padding:"12px",borderRadius:8,background:"rgba(239,68,68,.15)",border:"1px solid rgba(239,68,68,.3)",color:C.red,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14,cursor:"pointer"}}>
                Yes, Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}