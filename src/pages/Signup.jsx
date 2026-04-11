import React, { useState } from "react";
import { signup } from "../api/api.js";
import { useNavigate } from "react-router-dom";

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
      <div style={styles.card}>
        <h2 style={styles.title}>✨ Create Account</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
          />

          {/* Password */}
          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eye}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Confirm Password */}
          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            Signup
          </button>
        </form>

        {/* Login link */}
        <p style={styles.loginText}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} style={styles.loginLink}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

// 🎨 Styles
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #4facfe, #00f2fe)",
  },
  card: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "15px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
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
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "100%",
  },
  passwordWrapper: {
    position: "relative",
  },
  eye: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
  },
  button: {
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#4facfe",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "10px",
  },
  loginText: {
    textAlign: "center",
    marginTop: "1rem",
  },
  loginLink: {
    color: "#4facfe",
    cursor: "pointer",
    fontWeight: "bold",
  },
};