import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  // Helper to check if a link is active for styling
  const isActive = (path) => location.pathname === path;

  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 5%",
    backgroundColor: "#0a0f0d", // Dark Charcoal matching the new theme
    color: "#fff",
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    borderBottom: "1px solid rgba(16, 185, 129, 0.1)"
  };

  const linkStyle = (path, isSpecial = false) => ({
    color: isActive(path) ? "#10b981" : isSpecial ? "#10b981" : "#94a3b8",
    textDecoration: "none",
    fontWeight: isSpecial || isActive(path) ? "700" : "500",
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
    padding: isSpecial ? "0.6rem 1.2rem" : "0.5rem",
    borderRadius: isSpecial ? "10px" : "0",
    background: isSpecial ? "rgba(16, 185, 129, 0.1)" : "transparent",
    border: isSpecial ? "1px solid rgba(16, 185, 129, 0.2)" : "none"
  });

  return (
    <nav style={navStyle}>
      {/* Brand Logo */}
      <Link to="/" style={{ textDecoration: "none" }}>
        <div style={{ 
          fontWeight: "800", 
          fontSize: "1.5rem", 
          color: "#fff", 
          letterSpacing: "-0.5px" 
        }}>
          Monexia<span style={{ color: "#10b981" }}>.</span>
        </div>
      </Link>

      {/* Simplified Public Navigation */}
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <Link to="/" style={linkStyle("/")}>Home</Link>
        <Link to="/about" style={linkStyle("/about")}>About</Link>
        <Link to="/contact" style={linkStyle("/contact")}>Contact</Link>
        
        {/* Visual Divider */}
        <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.1)", margin: "0 5px" }} />
        
        <Link to="/login" style={linkStyle("/login")}>Login</Link>
        
        {/* Highlighted Signup Button */}
        <Link to="/signup" style={{
          ...linkStyle("/signup", true),
          backgroundColor: "#10b981",
          color: "#064e3b"
        }}>
          Signup
        </Link>
      </div>
    </nav>
  );
}