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
    form: {
      background: "#ffffff",
      borderRadius: "24px",
      border: "1px solid rgba(16,185,129,0.2)",
      boxShadow: "0 20px 60px rgba(16,185,129,0.12), 0 1px 3px rgba(0,0,0,0.05)",
      padding: "2.5rem",
      maxWidth: "450px",
      width: "100%",
      position: "relative",
      zIndex: 1,
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
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
    },
    inputFocus: {
      borderColor: "#10b981",
      boxShadow: "0 0 0 3px rgba(16,185,129,0.1)",
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      fontWeight: "600",
      fontSize: "0.875rem",
      color: "#0f172a",
      letterSpacing: "0.025em",
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
    forgotBtn: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#10b981",
      fontSize: "0.875rem",
      fontWeight: "500",
      textDecoration: "none",
      padding: 0,
      transition: "color 0.2s ease",
    },
    inputWrapper: {
      position: "relative",
      marginBottom: "1.5rem",
    },
    iconWrapper: {
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
  };

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.decorativeBlob} />
      <div style={styles.decorativeBlob2} />
      
      <form onSubmit={handleLogin} style={styles.form}>
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
            Welcome back! Please sign in to continue
          </p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Email Field */}
        <div style={styles.inputWrapper}>
          <label style={styles.label}>
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setIsEmailFocused(true)}
            onBlur={() => setIsEmailFocused(false)}
            required
            style={{
              ...styles.input,
              borderColor: isEmailFocused ? "#10b981" : "#e2e8f0",
              boxShadow: isEmailFocused ? "0 0 0 3px rgba(16,185,129,0.1)" : "none",
            }}
          />
        </div>

        {/* Password Field */}
        <div style={styles.inputWrapper}>
          <label style={styles.label}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              required
              style={{
                ...styles.input,
                borderColor: isPasswordFocused ? "#10b981" : "#e2e8f0",
                boxShadow: isPasswordFocused ? "0 0 0 3px rgba(16,185,129,0.1)" : "none",
                paddingRight: "45px",
              }}
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              style={styles.iconWrapper}
              onMouseEnter={(e) => e.currentTarget.style.color = "#10b981"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
            >
              {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
            </div>
          </div>
        </div>

        {/* Forgot Password */}
        <div style={{ textAlign: "right", marginBottom: "1.75rem" }}>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            style={styles.forgotBtn}
            onMouseEnter={(e) => e.target.style.color = "#059669"}
            onMouseLeave={(e) => e.target.style.color = "#10b981"}
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
            transform: isHoveringButton && !loading ? "translateY(-2px)" : "translateY(0)",
            boxShadow: isHoveringButton && !loading ? "0 10px 25px rgba(16,185,129,0.3)" : "0 4px 6px rgba(16,185,129,0.2)",
          }}
          onMouseEnter={() => setIsHoveringButton(true)}
          onMouseLeave={() => setIsHoveringButton(false)}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <span style={{
                display: "inline-block",
                width: "16px",
                height: "16px",
                border: "2px solid white",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 0.6s linear infinite"
              }} />
              Verifying...
            </span>
          ) : "Sign In"}
        </button>

        {/* Sign Up Link */}
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
            New to Monexia?{" "}
            <Link 
              to="/signup" 
              style={{ 
                color: "#10b981", 
                fontWeight: "600", 
                textDecoration: "none",
                transition: "color 0.2s ease"
              }}
              onMouseEnter={(e) => e.target.style.color = "#059669"}
              onMouseLeave={(e) => e.target.style.color = "#10b981"}
            >
              Create free account
            </Link>
          </p>
        </div>
      </form>

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
};

export default Login;