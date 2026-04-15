import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    card: {
      background: "rgba(255, 255, 255, 0.03)",
      backdropFilter: "blur(15px)",
      border: "1px solid rgba(16, 185, 129, 0.2)",
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
      border: "1px solid rgba(16, 185, 129, 0.2)",
      backgroundColor: "#0a0f0d",
      color: "#fff",
      fontSize: "1rem",
      outline: "none",
      marginBottom: 0,
      boxSizing: "border-box",
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
      transition: "all 0.3s ease",
      marginTop: "1.5rem",
    },
    successBox: {
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      border: "1px solid rgba(16, 185, 129, 0.4)",
      color: "#6ee7b7",
      borderRadius: "10px",
      padding: "10px 14px",
      fontSize: "0.85rem",
      marginBottom: "1rem",
      textAlign: "center",
    },
    errorBox: {
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      border: "1px solid rgba(239, 68, 68, 0.4)",
      color: "#f87171",
      borderRadius: "10px",
      padding: "10px 14px",
      fontSize: "0.85rem",
      marginBottom: "1rem",
      textAlign: "center",
    },
    eyeIcon: {
      position: "absolute",
      right: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      color: "#10b981",
      fontSize: "1.1rem",
    },
    backBtn: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#10b981",
      fontWeight: "600",
      fontSize: "0.9rem",
      padding: 0,
    },
  };

  // ✅ Pending screen — backend only emails the token
  if (!token || token === "pending") {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ textAlign: "center", fontSize: "3rem", marginBottom: "1rem" }}>📧</div>
          <h2 style={{ textAlign: "center", marginBottom: "0.5rem", fontSize: "1.8rem" }}>
            Check Your Email
          </h2>
          <p style={{ textAlign: "center", color: "#94a3b8", marginBottom: "2rem", fontSize: "0.9rem", lineHeight: "1.6" }}>
            We've sent a password reset link to your email. Click the link in the email to reset your password.
          </p>
          <p style={{ textAlign: "center", color: "#64748b", fontSize: "0.8rem", marginBottom: "1.5rem" }}>
            Didn't receive it? Check your spam folder.
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{ ...styles.button, marginTop: "0.5rem" }}
          >
            Back to Login
          </button>
          <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.85rem", color: "#94a3b8" }}>
            Wrong email?{" "}
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              style={styles.backBtn}
            >
              Try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  // ✅ Real token — show reset form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://monexiabackend.onrender.com/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Reset failed. Try again.");
      }

      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={{ textAlign: "center", marginBottom: "0.5rem", fontSize: "1.8rem" }}>
          Reset Password
        </h2>
        <p style={{ textAlign: "center", color: "#94a3b8", marginBottom: "2rem", fontSize: "0.9rem" }}>
          Enter your new password below.
        </p>

        {message && <div style={styles.successBox}>{message}</div>}
        {error && <div style={styles.errorBox}>{error}</div>}

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
          <span style={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <label style={styles.label}>Confirm Password</label>
        <div style={{ position: "relative", marginBottom: "1.2rem" }}>
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={styles.input}
          />
          <span style={styles.eyeIcon} onClick={() => setShowConfirm(!showConfirm)}>
            {showConfirm ? "🙈" : "👁️"}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => !loading && (e.target.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "#94a3b8" }}>
          Remember your password?{" "}
          <button type="button" onClick={() => navigate("/login")} style={styles.backBtn}>
            Back to Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;