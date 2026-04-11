import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getCurrentUser, getProfile, updateProfile } from "../../api/api.js";

export default function SettingsTab({ user }) {
  const currentUser = user || getCurrentUser();
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  const [section, setSection] = useState("profile");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) { setLoading(false); return; }
      try {
        const data = await getProfile(currentUser._id);
        setForm({ name: data.user?.name || "", email: data.user?.email || "" });
      } catch {
        // fallback to user from props/localStorage
        setForm({ name: currentUser.name || "", email: currentUser.email || "" });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email format";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (!currentUser) { toast.error("No user logged in"); return; }

    setUpdating(true);
    try {
      const data = await updateProfile(currentUser._id, form);
      toast.success("Profile updated! 🎉");
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const tabs = [
    { key: "profile",   label: "Profile",    icon: "👤" },
    { key: "security",  label: "Security",   icon: "🔒" },
    { key: "notifs",    label: "Notifications", icon: "🔔" },
  ];

  if (loading) return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <div style={{ color: "#4a6080", fontSize: "14px" }}>Loading profile...</div>
    </div>
  );

  return (
    <div style={s.wrap}>
      <h2 style={s.heading}>Settings</h2>
      <p style={s.sub}>Manage your account preferences</p>

      {/* Section tabs */}
      <div style={s.tabRow}>
        {tabs.map(t => (
          <button
            key={t.key} onClick={() => setSection(t.key)}
            style={{
              ...s.tabBtn,
              borderBottom: section === t.key ? "2px solid #00e5a0" : "2px solid transparent",
              color: section === t.key ? "#00e5a0" : "#8899bb",
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Profile Section */}
      {section === "profile" && (
        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.avatarRow}>
            <div style={s.avatarCircle}>
              {form.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p style={s.avatarName}>{form.name || "Your Name"}</p>
              <p style={s.avatarEmail}>{form.email || "your@email.com"}</p>
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>Full Name</label>
            <input
              type="text" name="name" value={form.name}
              onChange={handleChange} placeholder="Your full name"
              style={{ ...s.input, borderColor: errors.name ? "#ff6b6b" : "rgba(126,184,255,0.15)" }}
            />
            {errors.name && <span style={s.err}>{errors.name}</span>}
          </div>

          <div style={s.field}>
            <label style={s.label}>Email Address</label>
            <input
              type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="your@email.com"
              style={{ ...s.input, borderColor: errors.email ? "#ff6b6b" : "rgba(126,184,255,0.15)" }}
            />
            {errors.email && <span style={s.err}>{errors.email}</span>}
          </div>

          <button type="submit" disabled={updating} style={s.btn}>
            {updating ? "Updating..." : "Save Changes"}
          </button>
        </form>
      )}

      {/* Security Section */}
      {section === "security" && (
        <div style={s.placeholderSection}>
          <div style={s.placeholderIcon}>🔒</div>
          <h3 style={s.placeholderTitle}>Security Settings</h3>
          <p style={s.placeholderSub}>Password change and 2FA coming soon.</p>
        </div>
      )}

      {/* Notifications Section */}
      {section === "notifs" && (
        <div style={s.placeholderSection}>
          <div style={s.placeholderIcon}>🔔</div>
          <h3 style={s.placeholderTitle}>Notification Preferences</h3>
          <p style={s.placeholderSub}>Configure alerts and reminders coming soon.</p>
        </div>
      )}

      <Footer />
    </div>
  );
}

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
  wrap:             { display: "flex", flexDirection: "column", gap: "6px" },
  heading:          { fontFamily: "'Syne',sans-serif", fontSize: "20px", fontWeight: 800, color: "#e8f0fe" },
  sub:              { fontSize: "13px", color: "#4a6080", marginBottom: "16px" },
  tabRow:           { display: "flex", gap: "0", borderBottom: "1px solid rgba(126,184,255,0.08)", marginBottom: "24px" },
  tabBtn:           { background: "none", border: "none", padding: "10px 18px", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Sans',sans-serif", transition: "color 0.2s" },
  form:             { display: "flex", flexDirection: "column", gap: "18px", maxWidth: "460px" },
  avatarRow:        { display: "flex", alignItems: "center", gap: "16px", padding: "16px", background: "rgba(126,184,255,0.04)", borderRadius: "12px", border: "1px solid rgba(126,184,255,0.08)", marginBottom: "4px" },
  avatarCircle:     { width: "52px", height: "52px", borderRadius: "50%", background: "linear-gradient(135deg,#00e5a0,#7eb8ff)", display: "flex", alignItems: "center", justifyContent: "center", color: "#080e1a", fontWeight: 800, fontSize: "20px", fontFamily: "'Syne',sans-serif", flexShrink: 0 },
  avatarName:       { fontWeight: 700, color: "#e8f0fe", fontSize: "15px" },
  avatarEmail:      { color: "#4a6080", fontSize: "13px", marginTop: "2px" },
  field:            { display: "flex", flexDirection: "column", gap: "6px" },
  label:            { fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#4a6080" },
  input:            { padding: "11px 14px", borderRadius: "10px", border: "1px solid", background: "#0a1220", color: "#c5d8f5", fontSize: "14px", outline: "none", fontFamily: "'DM Sans',sans-serif" },
  err:              { fontSize: "12px", color: "#ff6b6b" },
  btn:              { padding: "12px 24px", background: "linear-gradient(135deg,#00c985,#00e5a0)", border: "none", borderRadius: "10px", color: "#080e1a", fontSize: "14px", fontWeight: 800, cursor: "pointer", alignSelf: "flex-start", fontFamily: "'Syne',sans-serif" },
  placeholderSection: { display: "flex", flexDirection: "column", alignItems: "center", padding: "50px 20px", textAlign: "center" },
  placeholderIcon:  { fontSize: "44px", marginBottom: "14px" },
  placeholderTitle: { fontFamily: "'Syne',sans-serif", fontSize: "18px", fontWeight: 800, color: "#c5d8f5", marginBottom: "8px" },
  placeholderSub:   { color: "#4a6080", fontSize: "14px" },
};

const f = {
  footer: { marginTop: "40px", paddingTop: "20px", borderTop: "1px solid rgba(126,184,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" },
  text:   { fontSize: "12px", color: "#2a3a55" },
  links:  { display: "flex", gap: "8px", alignItems: "center" },
  link:   { fontSize: "12px", color: "#4a6080", cursor: "pointer" },
  dot:    { fontSize: "12px", color: "#2a3a55" },
};