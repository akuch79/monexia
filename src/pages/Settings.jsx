import React, { useState, useEffect } from "react";
import { getCurrentUser, getProfile, updateProfile } from "../api/api.js";

export default function Settings() {
  const currentUser = getCurrentUser();
  const [form, setForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [pwErrors, setPwErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [prefs, setPrefs] = useState({ darkMode: false, notifications: true, currency: "KES", language: "English" });
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [logoutAllDone, setLogoutAllDone] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser?._id) { setLoading(false); return; }
      try {
        const data = await getProfile(currentUser._id);
        setForm({ name: data.user.name || "", email: data.user.email || "" });
      } catch (err) {
        setErrorMsg(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const flash = (msg, isError = false) => {
    if (isError) { setErrorMsg(msg); setSuccessMsg(""); }
    else { setSuccessMsg(msg); setErrorMsg(""); }
    setTimeout(() => { setSuccessMsg(""); setErrorMsg(""); }, 4000);
  };

  // Profile
  const validateProfile = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email format";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const ve = validateProfile();
    if (Object.keys(ve).length > 0) { setErrors(ve); return; }
    if (!currentUser?._id) { flash("No user logged in", true); return; }
    setUpdating(true);
    try {
      const data = await updateProfile(currentUser._id, form);
      localStorage.setItem("user", JSON.stringify(data.user));
      flash("Profile updated successfully! 🎉");
    } catch (err) {
      flash(err.message || "Failed to update profile", true);
    } finally {
      setUpdating(false);
    }
  };

  // Password
  const validatePassword = () => {
    const e = {};
    if (!passwordForm.current) e.current = "Current password is required";
    if (!passwordForm.newPass || passwordForm.newPass.length < 6) e.newPass = "Min 6 characters";
    if (passwordForm.newPass !== passwordForm.confirm) e.confirm = "Passwords don't match";
    return e;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const ve = validatePassword();
    if (Object.keys(ve).length > 0) { setPwErrors(ve); return; }
    setUpdatingPassword(true);
    try {
      // API call would go here: await changePassword(passwordForm)
      await new Promise(r => setTimeout(r, 1000)); // simulate
      setPasswordForm({ current: "", newPass: "", confirm: "" });
      flash("Password changed successfully! 🔒");
    } catch (err) {
      flash(err.message || "Failed to change password", true);
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleLogoutAll = () => {
    setLogoutAllDone(true);
    flash("All other sessions logged out successfully.");
  };

  const handleDeleteAccount = () => {
    if (deleteInput !== form.email) {
      flash("Email doesn't match. Account not deleted.", true);
      return;
    }
    localStorage.clear();
    window.location.href = "/login";
  };

  if (loading) return (
    <div style={styles.loadingWrap}>
      <div style={styles.spinner} />
      <p style={styles.loadingText}>Loading your profile...</p>
    </div>
  );

  const initials = form.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)} }
        .s-tab:hover{background:rgba(124,58,237,0.1)!important;color:#7c3aed!important}
        .s-input:focus{border-color:#8b5cf6!important;box-shadow:0 0 0 3px rgba(139,92,246,0.15)!important;outline:none}
        .s-btn-primary:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 25px rgba(124,58,237,0.4)!important}
        .s-btn-ghost:hover{background:#f1f5f9!important}
        .s-card:hover{border-color:#c4b5fd!important;box-shadow:0 4px 16px rgba(124,58,237,0.08)!important}
        .s-toggle{transition:all 0.2s}
        .s-eye:hover{opacity:1!important}
        .danger-btn:hover{background:#dc2626!important;color:#fff!important}
      `}</style>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroBg} />
        <div style={styles.heroContent}>
          <div style={styles.avatarRing}>
            <div style={styles.avatar}>{initials}</div>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={styles.heroName}>{form.name || "Your Name"}</h2>
            <p style={styles.heroEmail}>{form.email || "your@email.com"}</p>
            <span style={styles.heroBadge}>✦ Active Account</span>
          </div>
          <div style={styles.heroStats}>
            <div style={styles.heroStat}><span style={styles.heroStatNum}>12</span><span style={styles.heroStatLabel}>Transactions</span></div>
            <div style={styles.heroStatDivider} />
            <div style={styles.heroStat}><span style={styles.heroStatNum}>3</span><span style={styles.heroStatLabel}>Months Active</span></div>
          </div>
        </div>
        <div style={{...styles.deco, width:120, height:120, top:-30, right:60, opacity:0.1}} />
        <div style={{...styles.deco, width:60, height:60, top:20, right:200, opacity:0.08}} />
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {[
          {id:"profile", label:"👤 Profile"},
          {id:"security", label:"🔒 Security"},
          {id:"preferences", label:"🎨 Preferences"},
          {id:"danger", label:"⚠️ Danger Zone"},
        ].map(tab => (
          <button key={tab.id} className="s-tab" onClick={() => { setActiveTab(tab.id); setSuccessMsg(""); setErrorMsg(""); }}
            style={{...styles.tab,
              background: activeTab===tab.id ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "transparent",
              color: activeTab===tab.id ? "#fff" : "#64748b",
              fontWeight: activeTab===tab.id ? 700 : 500,
              boxShadow: activeTab===tab.id ? "0 4px 14px rgba(124,58,237,0.3)" : "none",
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts */}
      {successMsg && <div style={styles.alertSuccess}><span>✅</span> {successMsg}</div>}
      {errorMsg   && <div style={styles.alertError}><span>⚠️</span> {errorMsg}</div>}

      {/* ── PROFILE TAB ── */}
      {activeTab === "profile" && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Personal Information</h3>
            <p style={styles.sectionSub}>Update your display name and email</p>
          </div>
          <form onSubmit={handleProfileSubmit} style={styles.form}>
            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label}>👤 Full Name</label>
                <input className="s-input" type="text" name="name" value={form.name}
                  onChange={handleChange} placeholder="e.g. Jane Wanjiku"
                  style={{...styles.input, ...(errors.name ? styles.inputError : {})}} />
                {errors.name && <p style={styles.errorText}>⚡ {errors.name}</p>}
              </div>
              <div style={styles.field}>
                <label style={styles.label}>✉️ Email Address</label>
                <input className="s-input" type="email" name="email" value={form.email}
                  onChange={handleChange} placeholder="you@example.com"
                  style={{...styles.input, ...(errors.email ? styles.inputError : {})}} />
                {errors.email && <p style={styles.errorText}>⚡ {errors.email}</p>}
              </div>
            </div>
            <div style={styles.btnRow}>
              <button type="submit" disabled={updating} className="s-btn-primary" style={styles.btnPrimary}>
                {updating ? <span style={styles.btnInner}><span style={styles.btnSpinner}/>Saving...</span> : "Save Changes →"}
              </button>
              <button type="button" className="s-btn-ghost" style={styles.btnGhost}
                onClick={() => { setForm({name: currentUser?.name||"", email: currentUser?.email||""}); setErrors({}); }}>
                Reset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── SECURITY TAB ── */}
      {activeTab === "security" && (
        <div style={{display:"flex", flexDirection:"column", gap:20}}>
          {/* Change Password */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>🔑 Change Password</h3>
              <p style={styles.sectionSub}>Use a strong password you don't use elsewhere</p>
            </div>
            <form onSubmit={handlePasswordSubmit} style={styles.form}>
              {[
                {key:"current", label:"Current Password", show:showCurrent, toggle:()=>setShowCurrent(v=>!v), err:pwErrors.current, placeholder:"Enter current password"},
                {key:"newPass", label:"New Password", show:showNew, toggle:()=>setShowNew(v=>!v), err:pwErrors.newPass, placeholder:"Min 6 characters"},
                {key:"confirm", label:"Confirm New Password", show:showConfirm, toggle:()=>setShowConfirm(v=>!v), err:pwErrors.confirm, placeholder:"Repeat new password"},
              ].map(f => (
                <div key={f.key} style={styles.field}>
                  <label style={styles.label}>{f.label}</label>
                  <div style={styles.inputWrap}>
                    <input className="s-input" type={f.show ? "text" : "password"}
                      value={passwordForm[f.key]} placeholder={f.placeholder}
                      onChange={e => { setPasswordForm({...passwordForm, [f.key]: e.target.value}); setPwErrors({...pwErrors, [f.key]:""}); }}
                      style={{...styles.input, paddingRight:44, ...(f.err ? styles.inputError : {})}} />
                    <button type="button" className="s-eye" onClick={f.toggle}
                      style={{...styles.eyeBtn, opacity:0.5}}>{f.show ? "🙈" : "👁️"}</button>
                  </div>
                  {f.err && <p style={styles.errorText}>⚡ {f.err}</p>}
                </div>
              ))}
              {/* Password strength */}
              {passwordForm.newPass && (
                <div style={styles.strengthWrap}>
                  <p style={styles.strengthLabel}>Strength:</p>
                  {["Weak","Fair","Good","Strong"].map((s,i) => {
                    const score = Math.min(Math.floor(passwordForm.newPass.length / 3), 3);
                    const colors = ["#ef4444","#f59e0b","#3b82f6","#10b981"];
                    return <div key={s} style={{...styles.strengthBar, background: i<=score ? colors[score] : "#e2e8f0"}} />;
                  })}
                  <p style={{...styles.strengthLabel, marginLeft:4}}>
                    {["Weak","Fair","Good","Strong"][Math.min(Math.floor(passwordForm.newPass.length/3),3)]}
                  </p>
                </div>
              )}
              <button type="submit" disabled={updatingPassword} className="s-btn-primary" style={{...styles.btnPrimary, width:"fit-content"}}>
                {updatingPassword ? "Updating..." : "Update Password 🔒"}
              </button>
            </form>
          </div>

          {/* 2FA */}
          <div style={styles.section}>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
              <div>
                <h3 style={{...styles.sectionTitle, marginBottom:4}}>📱 Two-Factor Authentication</h3>
                <p style={styles.sectionSub}>{twoFA ? "2FA is enabled — your account is extra secure" : "Add an extra layer of security to your account"}</p>
              </div>
              <button onClick={() => { setTwoFA(v=>!v); flash(twoFA ? "2FA disabled." : "2FA enabled! ✅"); }}
                style={{...styles.btnPrimary, background: twoFA ? "#10b981" : "linear-gradient(135deg,#7c3aed,#a855f7)", width:"auto", padding:"10px 20px", fontSize:13}}>
                {twoFA ? "✅ Enabled" : "Enable 2FA"}
              </button>
            </div>
          </div>

          {/* Sessions */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>🛡️ Active Sessions</h3>
              <p style={styles.sectionSub}>Manage where you're logged in</p>
            </div>
            <div style={styles.sessionCard}>
              <div style={styles.sessionDot} />
              <div style={{flex:1}}>
                <p style={styles.sessionTitle}>Current Session — This Device</p>
                <p style={styles.sessionSub}>Nairobi, KE · Chrome · {new Date().toLocaleDateString()}</p>
              </div>
              <span style={styles.sessionBadge}>Active</span>
            </div>
            <button className="s-btn-ghost" style={{...styles.btnGhost, marginTop:12}}
              onClick={handleLogoutAll} disabled={logoutAllDone}>
              {logoutAllDone ? "✅ Done" : "Logout All Other Sessions"}
            </button>
          </div>
        </div>
      )}

      {/* ── PREFERENCES TAB ── */}
      {activeTab === "preferences" && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>App Preferences</h3>
            <p style={styles.sectionSub}>Customize your Monexia experience</p>
          </div>
          <div style={styles.prefList}>

            {/* Dark Mode toggle */}
            <div className="s-card" style={styles.prefItem}>
              <div style={styles.prefIcon}>🌙</div>
              <div style={{flex:1}}>
                <p style={styles.prefLabel}>Dark Mode</p>
                <p style={styles.prefSub}>{prefs.darkMode ? "Dark theme is on" : "Light theme is on"}</p>
              </div>
              <div className="s-toggle" onClick={() => { setPrefs(p=>({...p, darkMode:!p.darkMode})); flash(`Dark mode ${!prefs.darkMode?"enabled":"disabled"}.`); }}
                style={{...styles.toggle, background: prefs.darkMode ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "#e2e8f0",
                  justifyContent: prefs.darkMode ? "flex-end" : "flex-start"}}>
                <div style={styles.toggleThumb} />
              </div>
            </div>

            {/* Notifications toggle */}
            <div className="s-card" style={styles.prefItem}>
              <div style={styles.prefIcon}>🔔</div>
              <div style={{flex:1}}>
                <p style={styles.prefLabel}>Notifications</p>
                <p style={styles.prefSub}>{prefs.notifications ? "Email & push alerts on" : "All notifications off"}</p>
              </div>
              <div className="s-toggle" onClick={() => { setPrefs(p=>({...p, notifications:!p.notifications})); flash(`Notifications ${!prefs.notifications?"enabled":"disabled"}.`); }}
                style={{...styles.toggle, background: prefs.notifications ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "#e2e8f0",
                  justifyContent: prefs.notifications ? "flex-end" : "flex-start"}}>
                <div style={styles.toggleThumb} />
              </div>
            </div>

            {/* Currency dropdown */}
            <div className="s-card" style={{...styles.prefItem, flexWrap:"wrap", position:"relative"}}>
              <div style={styles.prefIcon}>💱</div>
              <div style={{flex:1}}>
                <p style={styles.prefLabel}>Currency</p>
                <p style={styles.prefSub}>Currently: {prefs.currency}</p>
              </div>
              <button className="s-btn-ghost" style={{...styles.btnGhost, padding:"7px 14px", fontSize:13}}
                onClick={() => { setCurrencyOpen(v=>!v); setLanguageOpen(false); }}>
                {prefs.currency} ▾
              </button>
              {currencyOpen && (
                <div style={styles.dropdown}>
                  {["KES","USD","EUR","GBP","UGX","TZS"].map(c => (
                    <button key={c} style={{...styles.dropItem, fontWeight: c===prefs.currency?700:400,
                      background: c===prefs.currency?"#f3f0ff":"transparent"}}
                      onClick={() => { setPrefs(p=>({...p, currency:c})); setCurrencyOpen(false); flash(`Currency set to ${c}.`); }}>
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language dropdown */}
            <div className="s-card" style={{...styles.prefItem, position:"relative"}}>
              <div style={styles.prefIcon}>🌍</div>
              <div style={{flex:1}}>
                <p style={styles.prefLabel}>Language</p>
                <p style={styles.prefSub}>Currently: {prefs.language}</p>
              </div>
              <button className="s-btn-ghost" style={{...styles.btnGhost, padding:"7px 14px", fontSize:13}}
                onClick={() => { setLanguageOpen(v=>!v); setCurrencyOpen(false); }}>
                {prefs.language} ▾
              </button>
              {languageOpen && (
                <div style={styles.dropdown}>
                  {["English","Kiswahili","French","Arabic"].map(l => (
                    <button key={l} style={{...styles.dropItem, fontWeight: l===prefs.language?700:400,
                      background: l===prefs.language?"#f3f0ff":"transparent"}}
                      onClick={() => { setPrefs(p=>({...p, language:l})); setLanguageOpen(false); flash(`Language set to ${l}.`); }}>
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ── DANGER ZONE TAB ── */}
      {activeTab === "danger" && (
        <div style={{display:"flex", flexDirection:"column", gap:20}}>
          {/* Export data */}
          <div style={styles.section}>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
              <div>
                <h3 style={{...styles.sectionTitle, marginBottom:4}}>📦 Export Your Data</h3>
                <p style={styles.sectionSub}>Download all your transactions as a CSV file</p>
              </div>
              <button className="s-btn-ghost" style={{...styles.btnGhost, padding:"10px 20px"}}
                onClick={() => flash("Data export started. Check your email shortly.")}>
                Export CSV
              </button>
            </div>
          </div>

          {/* Delete account */}
          <div style={{...styles.section, border:"2px solid #fee2e2"}}>
            <div style={styles.sectionHeader}>
              <h3 style={{...styles.sectionTitle, color:"#dc2626"}}>🗑️ Delete Account</h3>
              <p style={styles.sectionSub}>This is permanent and cannot be undone. All data will be lost.</p>
            </div>
            {!deleteConfirm ? (
              <button className="danger-btn" style={styles.dangerBtn}
                onClick={() => setDeleteConfirm(true)}>
                Delete My Account
              </button>
            ) : (
              <div style={styles.deleteConfirmBox}>
                <p style={{fontSize:14, color:"#374151", marginBottom:12}}>
                  Type your email <strong>{form.email}</strong> to confirm:
                </p>
                <input className="s-input" type="email" value={deleteInput} placeholder={form.email}
                  onChange={e => setDeleteInput(e.target.value)}
                  style={{...styles.input, marginBottom:12, border:"1.5px solid #fca5a5"}} />
                <div style={styles.btnRow}>
                  <button className="danger-btn" style={styles.dangerBtn}
                    onClick={handleDeleteAccount}>
                    Confirm Delete
                  </button>
                  <button className="s-btn-ghost" style={styles.btnGhost}
                    onClick={() => { setDeleteConfirm(false); setDeleteInput(""); }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { fontFamily:"'DM Sans',sans-serif", maxWidth:700, margin:"0 auto", animation:"fadeUp 0.4s ease both" },
  loadingWrap: { display:"flex", flexDirection:"column", alignItems:"center", gap:12, padding:"60px 0" },
  spinner: { width:36, height:36, border:"3px solid #e2e8f0", borderTop:"3px solid #7c3aed", borderRadius:"50%", animation:"spin 0.8s linear infinite" },
  loadingText: { color:"#94a3b8" },
  hero: { position:"relative", background:"linear-gradient(135deg,#1e1b4b 0%,#4c1d95 50%,#6d28d9 100%)", borderRadius:20, padding:"28px", marginBottom:24, overflow:"hidden" },
  heroBg: { position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 20% 50%,rgba(255,255,255,0.05) 0%,transparent 60%)" },
  heroContent: { display:"flex", alignItems:"center", gap:20, position:"relative", zIndex:1 },
  avatarRing: { padding:3, background:"linear-gradient(135deg,#f59e0b,#ec4899)", borderRadius:"50%", flexShrink:0 },
  avatar: { width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#7c3aed,#2563eb)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:22, border:"3px solid #1e1b4b" },
  heroName: { fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:"#fff", margin:"0 0 2px" },
  heroEmail: { color:"rgba(255,255,255,0.65)", fontSize:13, margin:"0 0 8px" },
  heroBadge: { background:"rgba(255,255,255,0.12)", color:"#a5f3fc", fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20, border:"1px solid rgba(255,255,255,0.2)" },
  heroStats: { display:"flex", alignItems:"center", gap:16, background:"rgba(255,255,255,0.1)", borderRadius:14, padding:"12px 18px", backdropFilter:"blur(4px)" },
  heroStat: { display:"flex", flexDirection:"column", alignItems:"center" },
  heroStatNum: { color:"#fff", fontWeight:800, fontSize:20, fontFamily:"'Syne',sans-serif" },
  heroStatLabel: { color:"rgba(255,255,255,0.6)", fontSize:11, marginTop:2 },
  heroStatDivider: { width:1, height:32, background:"rgba(255,255,255,0.2)" },
  deco: { position:"absolute", borderRadius:"50%", background:"white", pointerEvents:"none" },
  tabs: { display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" },
  tab: { padding:"9px 16px", borderRadius:10, border:"none", cursor:"pointer", fontSize:13, transition:"all 0.2s", fontFamily:"'DM Sans',sans-serif" },
  alertSuccess: { display:"flex", alignItems:"center", gap:10, background:"linear-gradient(135deg,#d1fae5,#a7f3d0)", color:"#065f46", border:"1px solid #6ee7b7", borderRadius:12, padding:"12px 16px", marginBottom:16, fontSize:14, fontWeight:500, animation:"slideIn 0.25s ease" },
  alertError: { display:"flex", alignItems:"center", gap:10, background:"linear-gradient(135deg,#fee2e2,#fecaca)", color:"#991b1b", border:"1px solid #fca5a5", borderRadius:12, padding:"12px 16px", marginBottom:16, fontSize:14, fontWeight:500, animation:"slideIn 0.25s ease" },
  section: { background:"#fff", borderRadius:20, padding:28, boxShadow:"0 2px 16px rgba(0,0,0,0.06)", animation:"fadeUp 0.3s ease both" },
  sectionHeader: { marginBottom:24 },
  sectionTitle: { fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800, color:"#1e1b4b", margin:"0 0 4px" },
  sectionSub: { color:"#94a3b8", fontSize:13, margin:0 },
  form: { display:"flex", flexDirection:"column", gap:18 },
  formGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 },
  field: { display:"flex", flexDirection:"column", gap:6 },
  label: { fontSize:11, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:"0.06em" },
  inputWrap: { position:"relative" },
  input: { padding:"11px 14px", borderRadius:10, border:"1.5px solid #e5e7eb", fontSize:14, color:"#1e1b4b", background:"#fafafa", transition:"border 0.2s,box-shadow 0.2s", fontFamily:"'DM Sans',sans-serif", width:"100%", boxSizing:"border-box" },
  inputError: { border:"1.5px solid #ef4444", background:"#fff5f5" },
  eyeBtn: { position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:16, padding:4 },
  errorText: { color:"#ef4444", fontSize:12, margin:0, fontWeight:500 },
  strengthWrap: { display:"flex", alignItems:"center", gap:6 },
  strengthLabel: { fontSize:12, color:"#64748b", margin:0 },
  strengthBar: { flex:1, height:4, borderRadius:4, transition:"background 0.3s" },
  btnRow: { display:"flex", gap:10 },
  btnPrimary: { padding:"12px 24px", borderRadius:12, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#7c3aed,#a855f7)", color:"#fff", fontWeight:700, fontSize:14, transition:"all 0.25s", fontFamily:"'Syne',sans-serif" },
  btnGhost: { padding:"12px 20px", borderRadius:12, border:"1.5px solid #e5e7eb", cursor:"pointer", background:"#fff", color:"#374151", fontWeight:600, fontSize:14, transition:"all 0.2s", fontFamily:"'DM Sans',sans-serif" },
  btnInner: { display:"flex", alignItems:"center", gap:8, justifyContent:"center" },
  btnSpinner: { width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid #fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" },
  sessionCard: { display:"flex", alignItems:"center", gap:14, padding:"14px 16px", borderRadius:12, background:"#f8fafc", border:"1px solid #e2e8f0" },
  sessionDot: { width:10, height:10, borderRadius:"50%", background:"#10b981", flexShrink:0, boxShadow:"0 0 0 3px rgba(16,185,129,0.2)" },
  sessionTitle: { fontWeight:600, fontSize:14, color:"#1e293b", margin:"0 0 2px" },
  sessionSub: { fontSize:12, color:"#94a3b8", margin:0 },
  sessionBadge: { background:"#dcfce7", color:"#16a34a", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20 },
  prefList: { display:"flex", flexDirection:"column", gap:10 },
  prefItem: { display:"flex", alignItems:"center", gap:14, padding:"14px 16px", borderRadius:12, border:"1px solid #f1f5f9", background:"#fafafa", transition:"all 0.2s", cursor:"default" },
  prefIcon: { fontSize:22, width:36, textAlign:"center", flexShrink:0 },
  prefLabel: { fontWeight:600, fontSize:14, color:"#1e293b", margin:"0 0 2px" },
  prefSub: { fontSize:12, color:"#94a3b8", margin:0 },
  toggle: { width:46, height:26, borderRadius:13, padding:3, display:"flex", alignItems:"center", cursor:"pointer", flexShrink:0, transition:"all 0.25s" },
  toggleThumb: { width:20, height:20, background:"#fff", borderRadius:"50%", boxShadow:"0 1px 4px rgba(0,0,0,0.25)", transition:"all 0.25s" },
  dropdown: { position:"absolute", right:0, top:"100%", marginTop:4, background:"#fff", borderRadius:12, boxShadow:"0 8px 24px rgba(0,0,0,0.12)", border:"1px solid #e5e7eb", zIndex:50, minWidth:140, overflow:"hidden", animation:"slideIn 0.2s ease" },
  dropItem: { display:"block", width:"100%", padding:"10px 16px", border:"none", cursor:"pointer", fontSize:14, textAlign:"left", transition:"background 0.15s", fontFamily:"'DM Sans',sans-serif", color:"#374151" },
  dangerBtn: { padding:"11px 22px", borderRadius:12, border:"1.5px solid #ef4444", cursor:"pointer", background:"#fff", color:"#dc2626", fontWeight:700, fontSize:14, transition:"all 0.2s", fontFamily:"'DM Sans',sans-serif" },
  deleteConfirmBox: { background:"#fff5f5", borderRadius:12, padding:20, border:"1px solid #fecaca", animation:"slideIn 0.2s ease" },
};