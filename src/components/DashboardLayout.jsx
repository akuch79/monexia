import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { getUserFromToken } from "../api/api.js";

const NAV = [
  { label: "Dashboard",       path: "/dashboard",       icon: "📊" },
  { label: "Transactions",    path: "/transactions",    icon: "💸" },
  { label: "Add Transaction", path: "/add-transaction", icon: "➕" },
  { label: "Analytics",       path: "/analytics",       icon: "📈" },
  { label: "Investments",     path: "/investment",      icon: "💹" },
  { label: "Education",       path: "/education",       icon: "🎓" },
  { label: "Business Tools",  path: "/business-tools",  icon: "🛠️" },
  { label: "Settings",        path: "/settings",        icon: "⚙️" },
];

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserFromToken();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const sidebarWidth = collapsed ? "68px" : "220px";

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <div style={{ ...styles.sidebar, width: sidebarWidth }}>
        <div style={styles.brand}>
          {!collapsed && <span style={styles.brandText}>💳 Monexia</span>}
          <button onClick={() => setCollapsed(!collapsed)} style={styles.toggleBtn}>
            {collapsed ? "▶" : "◀"}
          </button>
        </div>

        <nav style={styles.nav}>
          {NAV.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.navItem,
                  background: isActive ? "rgba(255,255,255,0.2)" : "transparent",
                  justifyContent: collapsed ? "center" : "flex-start",
                }}
                title={collapsed ? item.label : ""}
              >
                <span style={styles.navIcon}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div style={styles.sidebarBottom}>
          <button
            onClick={handleLogout}
            style={{
              ...styles.navItem,
              justifyContent: collapsed ? "center" : "flex-start",
              border: "none",
              cursor: "pointer",
              width: "100%",
            }}
            title={collapsed ? "Logout" : ""}
          >
            <span style={styles.navIcon}>🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <main style={{ ...styles.main, marginLeft: sidebarWidth }}>
        <div style={styles.topbar}>
          <div>
            <h1 style={styles.pageTitle}>
              {NAV.find((n) => n.path === location.pathname)?.label || "Dashboard"}
            </h1>
            <p style={styles.pageSub}>
              Welcome back{user?.name ? `, ${user.name}` : ""}! 👋
            </p>
          </div>
          <div style={styles.userBadge}>
            <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase() || "U"}</div>
            {!collapsed && <span style={styles.userName}>{user?.name || "User"}</span>}
          </div>
        </div>

        <div style={styles.content}>{children}</div>
      </main>
    </div>
  );
};

const styles = {
  layout: { display: "flex", minHeight: "100vh", background: "#f7f8fc" },
  sidebar: {
    position: "fixed",
    top: 0, left: 0,
    height: "100vh",
    background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    flexDirection: "column",
    transition: "width 0.25s ease",
    overflow: "hidden",
    boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
    zIndex: 100,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "22px 14px 18px",
    borderBottom: "1px solid rgba(255,255,255,0.15)",
  },
  brandText: { color: "#fff", fontWeight: 800, fontSize: "17px", whiteSpace: "nowrap" },
  toggleBtn: {
    background: "rgba(255,255,255,0.2)",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "11px",
    padding: "6px 8px",
    flexShrink: 0,
  },
  nav: { display: "flex", flexDirection: "column", padding: "14px 10px", gap: "4px", flex: 1 },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "11px 14px",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 500,
    textDecoration: "none",
    transition: "background 0.2s",
    whiteSpace: "nowrap",
    background: "transparent",
  },
  navIcon: { fontSize: "18px", flexShrink: 0 },
  sidebarBottom: { padding: "14px 10px", borderTop: "1px solid rgba(255,255,255,0.15)" },
  main: { flex: 1, padding: "32px 36px", transition: "margin-left 0.25s ease", minHeight: "100vh" },
  topbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" },
  pageTitle: { fontSize: "24px", fontWeight: 800, color: "#1a202c", margin: "0 0 4px" },
  pageSub: { color: "#718096", fontSize: "14px", margin: 0 },
  userBadge: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: {
    width: "38px", height: "38px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontWeight: 700, fontSize: "15px",
  },
  userName: { color: "#2d3748", fontWeight: 600, fontSize: "14px" },
  content: { background: "#fff", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" },
};

export default DashboardLayout;