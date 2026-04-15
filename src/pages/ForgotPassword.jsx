import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://monexiabackend.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong. Try again.");
      }

      setMessage("Reset link sent! Redirecting...");

      // ✅ If backend returns token → go directly to reset form
      // ✅ If backend only emails the token → go to pending screen
      setTimeout(() => {
        if (data.token) {
          navigate(`/reset-password/${data.token}`);
        } else {
          navigate("/reset-password/pending");
        }
      }, 1500);

    } catch (err) {
      setError(err.message);
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
      marginTop: "1.2rem",
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
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ textAlign: "center", marginBottom: "0.5rem", fontSize: "1.8rem" }}>
          Forgot Password
        </h2>
        <p style={{ textAlign: "center", color: "#94a3b8", marginBottom: "2rem", fontSize: "0.9rem" }}>
          Enter your email and we'll send you a reset link.
        </p>

        {message && <div style={styles.successBox}>{message}</div>}
        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
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
            onMouseEnter={(e) => !loading && (e.target.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "#94a3b8" }}>
          Remember your password?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#10b981",
              fontWeight: "600",
              fontSize: "0.9rem",
              padding: 0,
            }}
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;