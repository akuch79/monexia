import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../api/api.js";

const ForgotPassword = () => {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await forgotPassword(email.toLowerCase().trim());

      // ✅ If backend returns resetLink, redirect directly
      if (res.resetLink) {
        const token = res.resetLink.split("/reset-password/")[1];
        navigate(`/reset-password/${token}`);
      } else {
        setSuccess(res.message || "Reset link sent. Check your email.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "radial-gradient(circle at top right, #1a2a26, #0a0f0d)",
      padding: "2rem",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    },
    form: {
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(15px)",
      border: "1px solid rgba(16,185,129,0.2)",
      padding: "3rem 2.5rem",
      borderRadius: "24px",
      width: "100%",
      maxWidth: "420px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
      color: "#f8fafc",
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      fontSize: "0.85rem",
      color: "#94a3b8",
      fontWeight: "600",
    },
    input: {
      width: "100%",
      padding: "12px 15px",
      marginBottom: "1.2rem",
      borderRadius: "12px",
      border: "1px solid rgba(16,185,129,0.2)",
      backgroundColor: "#0a0f0d",
      color: "#fff",
      fontSize: "1rem",
      outline: "none",
    },
    button: {
      width: "100%",
      padding: "14px",
      fontSize: "1rem",
      fontWeight: "700",
      borderRadius: "12px",
      border: "none",
      cursor: "pointer",
      backgroundColor: "#10b981",
      color: "#064e3b",
      marginTop: "1rem",
      transition: "all 0.3s ease",
    },
    errorBox: {
      backgroundColor: "rgba(239,68,68,0.1)",
      border: "1px solid rgba(239,68,68,0.4)",
      color: "#f87171",
      borderRadius: "10px",
      padding: "10px 14px",
      fontSize: "0.85rem",
      marginBottom: "1rem",
      textAlign: "center",
    },
    successBox: {
      backgroundColor: "rgba(16,185,129,0.1)",
      border: "1px solid rgba(16,185,129,0.4)",
      color: "#10b981",
      borderRadius: "10px",
      padding: "10px 14px",
      fontSize: "0.85rem",
      marginBottom: "1rem",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Icon */}
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <div style={{
            width: "60px", height: "60px", borderRadius: "50%",
            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto", fontSize: "1.5rem"
          }}>
            🔑
          </div>
        </div>

        <h2 style={{ textAlign: "center", marginBottom: "0.5rem", fontSize: "1.8rem" }}>
          Forgot Password?
        </h2>
        <p style={{ textAlign: "center", color: "#94a3b8", marginBottom: "2rem", fontSize: "0.9rem" }}>
          Enter your email and we'll send you a reset link.
        </p>

        {error   && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        <label style={styles.label}>Email Address</label>
        <input
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "#94a3b8" }}>
          Remembered it?{" "}
          <Link to="/login" style={{ color: "#10b981", fontWeight: "600", textDecoration: "none" }}>
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;