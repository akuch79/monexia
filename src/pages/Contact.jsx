import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div style={{ background: "#050D1A", minHeight: "100vh", padding: "80px 32px", fontFamily: "DM Sans, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .contact-form { animation: fadeUp 0.5s 0.2s ease both; }
        .contact-info { animation: fadeUp 0.5s 0.1s ease both; }
        .form-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(0,212,170,0.12);
          border-radius: 12px;
          padding: 14px 18px;
          color: #E2E8F0;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .form-input:focus { border-color: rgba(0,212,170,0.35); }
        .form-input::placeholder { color: #334155; }
        .submit-btn {
          width: 100%;
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
        .submit-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px;
          border-radius: 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(0,212,170,0.07);
          transition: border-color 0.2s;
        }
        .info-item:hover { border-color: rgba(0,212,170,0.18); }
      `}</style>

      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(0,212,170,0.07)", border: "1px solid rgba(0,212,170,0.15)", borderRadius: "100px", padding: "6px 16px", marginBottom: "24px" }}>
            <span style={{ color: "#00D4AA", fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em" }}>GET IN TOUCH</span>
          </div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "clamp(28px, 5vw, 50px)", color: "#F1F5F9", letterSpacing: "-0.02em", marginBottom: "16px" }}>Contact Us</h1>
          <p style={{ color: "#475569", fontSize: "16px", maxWidth: "440px", margin: "0 auto" }}>Have a question or need support? We're here to help.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "32px", alignItems: "start" }}>

          {/* Info */}
          <div className="contact-info" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { icon: "📧", label: "Email", value: "support@storewallet.com", sub: "Response within 24 hours" },
              { icon: "📞", label: "Phone", value: "+254 700 000 000", sub: "Mon–Fri, 9am–6pm EAT" },
              { icon: "📍", label: "Location", value: "Nairobi, Kenya", sub: "East Africa headquarters" },
              { icon: "💬", label: "Live Chat", value: "Available in app", sub: "Instant support for members" },
            ].map((item, i) => (
              <div key={i} className="info-item">
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ color: "#64748B", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>{item.label}</div>
                  <div style={{ color: "#E2E8F0", fontSize: "14px", fontWeight: 500, marginBottom: "2px" }}>{item.value}</div>
                  <div style={{ color: "#334155", fontSize: "12px" }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="contact-form" style={{ background: "rgba(8,18,36,0.8)", border: "1px solid rgba(0,212,170,0.08)", borderRadius: "24px", padding: "36px" }}>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "18px", color: "#E2E8F0", marginBottom: "28px" }}>Send a Message</h3>

            {sent && (
              <div style={{ background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.25)", color: "#00D4AA", padding: "12px 16px", borderRadius: "12px", marginBottom: "20px", fontSize: "14px" }}>
                ✅ Message sent! We'll be in touch soon.
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { label: "Your Name", type: "text", placeholder: "John Doe", key: "name" },
                { label: "Email Address", type: "email", placeholder: "you@example.com", key: "email" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: "block", color: "#475569", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>{f.label}</label>
                  <input type={f.type} className="form-input" placeholder={f.placeholder}
                    value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label style={{ display: "block", color: "#475569", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>Message</label>
                <textarea className="form-input" placeholder="How can we help you?" rows={5}
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  style={{ resize: "vertical" }} />
              </div>
              <button className="submit-btn" onClick={handleSubmit}>Send Message →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;