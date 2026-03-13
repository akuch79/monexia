import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FinTechContext } from "../context/FinTechContext";

const Navbar = () => {
  const { user, logout } = useContext(FinTechContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .nav-link {
          color: #94A3B8;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.02em;
          transition: color 0.2s;
          position: relative;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px; left: 0; right: 0;
          height: 1px;
          background: #00D4AA;
          transform: scaleX(0);
          transition: transform 0.2s;
        }
        .nav-link:hover { color: #E2E8F0; }
        .nav-link:hover::after { transform: scaleX(1); }
        .nav-logout-btn {
          background: rgba(0,212,170,0.1);
          border: 1px solid rgba(0,212,170,0.25);
          color: #00D4AA;
          padding: 8px 20px;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-logout-btn:hover {
          background: rgba(0,212,170,0.2);
          border-color: rgba(0,212,170,0.5);
        }
        .nav-login-btn {
          background: linear-gradient(135deg, #00A88A, #00D4AA);
          color: #050D1A;
          padding: 9px 22px;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .nav-login-btn:hover { opacity: 0.88; }
      `}</style>
      <nav style={{
        background: "rgba(5,13,26,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,212,170,0.08)",
        padding: "0 32px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{ background: "linear-gradient(135deg, #00A88A, #00D4AA)", width: "34px", height: "34px", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, color: "#050D1A", fontSize: "13px" }}>SW</span>
          </div>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "18px", color: "#E2E8F0", letterSpacing: "-0.01em" }}>StoreWallet</span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          {user && (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              
              
            </>
          )}
        </div>

        {/* Auth */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {user ? (
            <>
              <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "13px", color: "#64748B" }}>
                👤 {user.name || user.email}
              </span>
              <button onClick={handleLogout} className="nav-logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Sign In</Link>
              <Link to="/register" className="nav-login-btn">Get Started</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;