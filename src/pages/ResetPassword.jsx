import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../api/api.js";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const ResetPassword = () => {
  const { token }                       = useParams();
  const navigate                        = useNavigate();
  const [password, setPassword]         = useState("");
  const [confirm, setConfirm]           = useState("");
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [success, setSuccess]           = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);

  const strength = () => {
    if (password.length === 0) return { label: "Enter a password", color: "transparent", width: "0%" };
    if (password.length < 6)  return { label: "Too short",         color: "#ef4444",     width: "25%" };
    if (password.length < 8)  return { label: "Fair",              color: "#f59e0b",     width: "50%" };
    if (password.length < 10) return { label: "Good",              color: "#3b82f6",     width: "75%" };
    return                           { label: "Strong ✓",          color: "#10b981",     width: "100%" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6)
      return setError("Password must be at least 6 characters.");
    if (password !== confirm)
      return setError("Passwords do not match.");

    setLoading(true);
    try {
      const res = await resetPassword(token, password);

      // ✅ Token already saved in api.js — just redirect
      setSuccess("Password reset! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.message || "Reset failed. Link may have expired.");
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

  const s = strength();

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <div style={{
            width: "60px", height: "60px", borderRadius: "50%",
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.3)",
            display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto", fontSize: "1.5rem",
          }}>
            🔒
          </div>
        </div>

        <h2 style={{ textAlign: "center", marginBottom: "0.5rem", fontSize: "1.8rem" }}>
          Reset Password
        </h2>
        <p style={{ textAlign: "center", color: "#94a3b8", marginBottom: "2rem", fontSize: "0.9rem" }}>
          Choose a strong new password for your account.
        </p>

        {error   && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        {/* New Password */}
        <label style={styles.label}>New Password</label>
        <div style={{ position: "relative", marginBottom: "0.5rem" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#10b981" }}
          >
            {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
          </span>
        </div>

        {/* Strength bar */}
        <div style={{ marginBottom: "1.2rem" }}>
          <div style={{ height: "4px", borderRadius: "2px", backgroundColor: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: s.width, backgroundColor: s.color, transition: "all 0.3s ease", borderRadius: "2px" }} />
          </div>
          <p style={{ fontSize: "0.75rem", color: s.color, marginTop: "4px" }}>{s.label}</p>
        </div>

        {/* Confirm Password */}
        <label style={styles.label}>Confirm Password</label>
        <div style={{ position: "relative", marginBottom: "1.5rem" }}>
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            style={{
              ...styles.input,
              borderColor: confirm && confirm !== password
                ? "rgba(239,68,68,0.5)"
                : confirm && confirm === password
                ? "rgba(16,185,129,0.5)"
                : "rgba(16,185,129,0.2)",
            }}
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#10b981" }}
          >
            {showConfirm ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
          </span>
          {/* ✅ Live match indicator */}
          {confirm && (
            <p style={{ fontSize: "0.75rem", marginTop: "4px",
              color: confirm === password ? "#10b981" : "#ef4444" }}>
              {confirm === password ? "✓ Passwords match" : "✗ Passwords do not match"}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || (confirm && confirm !== password)}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "#94a3b8" }}>
          <Link to="/login" style={{ color: "#10b981", fontWeight: "600", textDecoration: "none" }}>
            ← Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;