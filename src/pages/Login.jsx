import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/api.js";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const normalizedEmail = email.toLowerCase().trim();
      await login(normalizedEmail, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
       background: "#f0fdf4",
    },
    form: {
      background: "#ffffff",
      border: "1px solid #a7f3d0",
      color: "#064e3b",
      boxShadow: "0 20px 40px rgba(16,185,129,0.08)",
    },
    input: {
       border: "1px solid #a7f3d0",
       backgroundColor: "#f0fdf4",
       color: "#064e3b",
    },
    label: {
      backgroundColor: "#10b981",
      color: "#ffffff",
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
      marginTop: "1rem",
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
    forgotBtn: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#10b981",
      fontSize: "0.85rem",
      textDecoration: "none",
      padding: 0,
    },
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={{ textAlign: "center", marginBottom: "0.5rem", fontSize: "1.8rem" }}>
          Welcome Back
        </h2>
        <p style={{ textAlign: "center", color: "#94a3b8", marginBottom: "2rem", fontSize: "0.9rem" }}>
          Enter your credentials to access your vault.
        </p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <label style={styles.label}>Email Address</label>
        <input
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <label style={styles.label}>Password</label>
        <div style={{ position: "relative", marginBottom: "1rem" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ ...styles.input, marginBottom: 0 }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#10b981",
            }}
          >
            {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
          </span>
        </div>

        {/* ✅ Forgot Password — navigates directly to reset-password */}
        <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            style={styles.forgotBtn}
          >
            Forgot Password?
          </button>
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
          {loading ? "Verifying..." : "Sign In"}
        </button>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "#94a3b8" }}>
          New to Monexia?{" "}
          <Link to="/signup" style={{ color: "#10b981", fontWeight: "600", textDecoration: "none" }}>
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;