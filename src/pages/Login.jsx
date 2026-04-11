import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/api.js";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message || "Login failed");
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
      background: "radial-gradient(circle at top right, #1a2a26, #0a0f0d)", // Fintech Emerald
      padding: "2rem",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    },
    form: {
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
    input: {
      width: "100%",
      padding: "12px 15px",
      marginBottom: "1.2rem",
      borderRadius: "12px",
      border: "1px solid rgba(16, 185, 129, 0.2)",
      backgroundColor: "#0a0f0d",
      color: "#fff",
      fontSize: "1rem",
      outline: "none",
      transition: "border-color 0.3s",
    },
    label: { display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", color: "#94a3b8", fontWeight: "600" },
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
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={{ textAlign: "center", marginBottom: "0.5rem", fontSize: "1.8rem" }}>Welcome Back</h2>
        <p style={{ textAlign: "center", color: "#94a3b8", marginBottom: "2rem", fontSize: "0.9rem" }}>Enter your credentials to access your vault.</p>

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
            style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#10b981" }}
          >
            {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
          </span>
        </div>

        <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
          <Link to="/forgot-password" style={{ color: "#10b981", fontSize: "0.85rem", textDecoration: "none" }}>
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={styles.button}
          onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
        >
          {loading ? "Verifying..." : "Sign In"}
        </button>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "#94a3b8" }}>
          New to Monexia? <Link to="/signup" style={{ color: "#10b981", fontWeight: "600", textDecoration: "none" }}>Create account</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;