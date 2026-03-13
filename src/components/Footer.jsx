import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FinTechContext } from "../context/FinTechContext";

const Footer = () => {
  const { user } = useContext(FinTechContext);

  return (
    <footer style={{
      background: "#020810",
      borderTop: "1px solid rgba(0,212,170,0.08)",
      padding: "60px 48px 32px",
      fontFamily: "DM Sans, sans-serif",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "48px", marginBottom: "48px" }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ background: "linear-gradient(135deg, #00A88A, #00D4AA)", width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, color: "#050D1A", fontSize: "12px" }}>SW</span>
              </div>
              <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "16px", color: "#E2E8F0" }}>StoreWallet</span>
            </div>
            <p style={{ color: "#475569", fontSize: "14px", lineHeight: 1.75, maxWidth: "260px" }}>
              Secure digital wallet platform for modern financial management. Private, fast, and always available.
            </p>
            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ color: "#475569", fontSize: "12px" }}>📧 support@storewallet.com</span>
              <span style={{ color: "#475569", fontSize: "12px" }}>📞 +254 700 000 000</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: "#94A3B8", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "20px" }}>Quick Links</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Link to="/" style={{ color: "#475569", textDecoration: "none", fontSize: "14px", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#00D4AA"}
                onMouseLeave={e => e.target.style.color = "#475569"}>Home</Link>
              {user ? (
                <>
                  {[{ label: "Dashboard", to: "/dashboard" }, { label: "Wallet", to: "/wallet" }, { label: "Transactions", to: "/transactions" }].map(link => (
                    <Link key={link.to} to={link.to} style={{ color: "#475569", textDecoration: "none", fontSize: "14px", transition: "color 0.2s" }}
                      onMouseEnter={e => e.target.style.color = "#00D4AA"}
                      onMouseLeave={e => e.target.style.color = "#475569"}>
                      {link.label}
                    </Link>
                  ))}
                </>
              ) : (
                <Link to="/login" style={{ color: "#00D4AA", textDecoration: "none", fontSize: "14px" }}>
                  Login to access more →
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ color: "#334155", fontSize: "13px" }}>© 2026 StoreWallet. All rights reserved.</p>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00D4AA" }} />
            <span style={{ color: "#334155", fontSize: "12px" }}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;