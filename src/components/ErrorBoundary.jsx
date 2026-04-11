// src/components/ErrorBoundary.jsx
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h2>Oops! Something went wrong.</h2>
          <p>{this.state.error?.message || "Please try refreshing the page."}</p>
          <button onClick={() => window.location.reload()} style={{
            padding: "10px 20px",
            borderRadius: "6px",
            background: "#667eea",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            marginTop: "20px"
          }}>
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;