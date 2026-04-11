import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../api/api.js";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const ResetPassword = () => {
  const { token }                       = useParams();  // ✅ get token from URL
  const navigate                        = useNavigate();
  const [password, setPassword]         = useState("");
  const [confirm, setConfirm]           = useState("");
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [success, setSuccess]           = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);

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

      // ✅ Auto-login — save token and redirect
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify({ name: res.name, email: res.email }));
      }

      setSuccess("Password reset! Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard"), 2000);   // ✅ redirect after 2s
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
            🔒
          </div>
        </div>

        <h2 style={{ textAlign: "center", marginBottom: "0.5rem", fontSize: "1.8rem" }}>
          Reset Password
        </h2>
        <p style={{ textAlign: "center", color: "#94a3b8", marginBottom: "2rem", fontSize: "0.9rem" }}>
          Enter your new password below.
        </p>

        {error   && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        {/* New Password */}
        <label style={styles.label}>New Password</label>
        <div style={{ position: "relative", marginBottom: "1.2rem" }}>
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

        {/* Confirm Password */}
        <label style={styles.label}>Confirm Password</label>
        <div style={{ position: "relative", marginBottom: "1.2rem" }}>
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            style={styles.input}
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#10b981" }}
          >
            {showConfirm ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
          </span>
        </div>

        {/* Password strength indicator */}
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", gap: "4px" }}>
            {[1,2,3,4].map((level) => (
              <div key={level} style={{
                height: "4px", flex: 1, borderRadius: "2px",
                backgroundColor: password.length >= level * 3
                  ? level <= 1 ? "#ef4444"
                  : level <= 2 ? "#f59e0b"
                  : level <= 3 ? "#3b82f6"
                  : "#10b981"
                  : "rgba(255,255,255,0.1)",
                transition: "background-color 0.3s"
              }} />
            ))}
          </div>
          <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>
            {password.length === 0 ? "Enter a password" :
             password.length < 6  ? "Too short" :
             password.length < 8  ? "Fair" :
             password.length < 10 ? "Good" : "Strong ✓"}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
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