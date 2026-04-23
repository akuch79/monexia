import React, { useState } from "react";
import { signup } from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Check password match
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await signup(form.name, form.email, form.password);

      alert("Signup successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.decorativeBlob} />
      <div style={styles.decorativeBlob2} />
      
      <div style={styles.card}>
        {/* Logo/Brand Section */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "60px",
            height: "60px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            borderRadius: "16px",
            margin: "0 auto 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            boxShadow: "0 10px 20px rgba(16,185,129,0.2)"
          }}>
            💰
          </div>
          <h2 style={{ 
            margin: 0, 
            fontSize: "1.875rem", 
            fontWeight: "700",
            background: "linear-gradient(135deg, #065f46 0%, #047857 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Monexia
          </h2>
          <p style={{ 
            color: "#64748b", 
            marginTop: "0.5rem", 
            fontSize: "0.875rem",
            fontWeight: "500"
          }}>
            Create your account to get started
          </p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputWrapper}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputWrapper}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@company.com"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          {/* Password */}
          <div style={styles.inputWrapper}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                style={{...styles.input, paddingRight: "45px"}}
                required
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eye}
                onMouseEnter={(e) => e.currentTarget.style.color = "#10b981"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
              >
                {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={styles.inputWrapper}>
            <label style={styles.label}>Confirm Password</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                style={{...styles.input, paddingRight: "45px"}}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              transform: isHoveringButton ? "translateY(-2px)" : "translateY(0)",
              boxShadow: isHoveringButton ? "0 10px 25px rgba(16,185,129,0.3)" : "0 4px 6px rgba(16,185,129,0.2)",
            }}
            onMouseEnter={() => setIsHoveringButton(true)}
            onMouseLeave={() => setIsHoveringButton(false)}
          >
            Create Account
          </button>
        </form>

        {/* Login link */}
        <div style={{ 
          textAlign: "center", 
          marginTop: "2rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid #f1f5f9"
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: "0.875rem", 
            color: "#64748b"
          }}>
            Already have an account?{" "}
            <span 
              onClick={() => navigate("/login")} 
              style={styles.loginLink}
              onMouseEnter={(e) => e.target.style.color = "#059669"}
              onMouseLeave={(e) => e.target.style.color = "#10b981"}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>

      {/* Add keyframes animation for spinner */}
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}

// 🎨 Styles
const styles = {
  container: {
    background: "#f0fdf4",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    position: "relative",
    overflow: "hidden",
  },
  decorativeBlob: {
    position: "absolute",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.05) 100%)",
    top: "-150px",
    right: "-100px",
    zIndex: 0,
  },
  decorativeBlob2: {
    position: "absolute",
    width: "250px",
    height: "250px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.03) 100%)",
    bottom: "-100px",
    left: "-80px",
    zIndex: 0,
  },
  card: {
    background: "#ffffff",
    borderRadius: "24px",
    border: "1px solid rgba(16,185,129,0.2)",
    boxShadow: "0 20px 60px rgba(16,185,129,0.12), 0 1px 3px rgba(0,0,0,0.05)",
    padding: "2.5rem",
    width: "100%",
    maxWidth: "450px",
    position: "relative",
    zIndex: 1,
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  title: {
    textAlign: "center",
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  inputWrapper: {
    position: "relative",
    marginBottom: "0.5rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "600",
    fontSize: "0.875rem",
    color: "#0f172a",
    letterSpacing: "0.025em",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "0.95rem",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    color: "#1e293b",
    transition: "all 0.3s ease",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  passwordWrapper: {
    position: "relative",
  },
  eye: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#94a3b8",
    transition: "color 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px",
  },
  button: {
    width: "100%",
    padding: "14px",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#ffffff",
    transition: "all 0.3s ease",
    marginTop: "0.5rem",
    position: "relative",
    overflow: "hidden",
  },
  errorBox: {
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#dc2626",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "0.875rem",
    marginBottom: "1.5rem",
    textAlign: "center",
    backdropFilter: "blur(4px)",
  },
  loginLink: {
    color: "#10b981",
    cursor: "pointer",
    fontWeight: "600",
    textDecoration: "none",
    transition: "color 0.2s ease",
  },
};