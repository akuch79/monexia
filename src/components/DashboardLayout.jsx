import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { getUserFromToken } from "../api/api.js";

const NAV = [
  { label: "Dashboard",       path: "/dashboard",       icon: "📊", color: "#3b82f6" },
  { label: "Transactions",    path: "/transactions",    icon: "💸", color: "#8b5cf6" },
  { label: "Add Transaction", path: "/add-transaction", icon: "➕", color: "#10b981" },
  { label: "Analytics",       path: "/analytics",       icon: "📈", color: "#f59e0b" },
  { label: "Investments",     path: "/investment",      icon: "💹", color: "#ef4444" },
  { label: "Education",       path: "/education",       icon: "🎓", color: "#06b6d4" },
  { label: "Business Tools",  path: "/business-tools",  icon: "🛠️", color: "#6366f1" },
  { label: "Wallet Hub",      path: "/wallet-hub",      icon: "👛", color: "#14b8a6" },
  { label: "Settings",        path: "/settings",        icon: "⚙️", color: "#6b7280" },
];

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserFromToken();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const sidebarWidth = collapsed ? "80px" : "260px";

  useEffect(() => {
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }
      
      @keyframes shimmer {
        0% {
          background-position: -1000px 0;
        }
        100% {
          background-position: 1000px 0;
        }
      }
      
      .nav-item {
        position: relative;
        overflow: hidden;
      }
      
      .nav-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
      }
      
      .nav-item:hover::before {
        left: 100%;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <div style={{ ...styles.sidebar, width: sidebarWidth }}>
        {/* Brand Section */}
        <div style={styles.brand}>
          <div style={styles.logoWrapper}>
            <div style={styles.logoIcon}>💰</div>
            {!collapsed && (
              <div style={styles.brandText}>
                <span style={styles.brandName}>Monexia</span>
                <span style={styles.brandTagline}>Finance Hub</span>
              </div>
            )}
          </div>
          <button onClick={() => setCollapsed(!collapsed)} style={styles.toggleBtn}>
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* Navigation */}
        <nav style={styles.nav}>
          {NAV.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="nav-item"
                style={{
                  ...styles.navItem,
                  background: isActive 
                    ? `linear-gradient(135deg, ${item.color}20 0%, ${item.color}10 100%)`
                    : hoveredItem === item.path 
                      ? `linear-gradient(135deg, ${item.color}15 0%, ${item.color}05 100%)`
                      : "transparent",
                  borderLeft: isActive ? `3px solid ${item.color}` : "3px solid transparent",
                  justifyContent: collapsed ? "center" : "flex-start",
                  padding: collapsed ? "12px" : "12px 16px",
                }}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
                title={collapsed ? item.label : ""}
              >
                <span style={{ 
                  ...styles.navIcon,
                  filter: isActive ? `drop-shadow(0 2px 4px ${item.color}40)` : "none",
                  transform: hoveredItem === item.path ? "scale(1.1)" : "scale(1)",
                  transition: "transform 0.2s ease",
                }}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span style={{ 
                    ...styles.navLabel,
                    color: isActive ? item.color : "#e2e8f0",
                    fontWeight: isActive ? "600" : "500",
                  }}>
                    {item.label}
                  </span>
                )}
                {!collapsed && isActive && (
                  <span style={{ 
                    ...styles.activeIndicator,
                    background: item.color,
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section & Logout */}
        <div style={styles.sidebarBottom}>
          {!collapsed && (
            <div style={styles.userInfo}>
              <div style={styles.userAvatar}>
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div style={styles.userDetails}>
                <div style={styles.userName}>{user?.name || "User"}</div>
                <div style={styles.userEmail}>{user?.email || "user@example.com"}</div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            style={{
              ...styles.logoutBtn,
              justifyContent: collapsed ? "center" : "flex-start",
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
          <div style={styles.pageHeader}>
            <h1 style={styles.pageTitle}>
              {NAV.find((n) => n.path === location.pathname)?.label || "Dashboard"}
            </h1>
            <p style={styles.pageSub}>
              Welcome back{user?.name ? `, ${user.name}` : ""}! 👋
            </p>
          </div>
          <div style={styles.headerActions}>
            <div style={styles.notificationBell}>
              🔔
              <span style={styles.notificationBadge}>3</span>
            </div>
            <div style={styles.userBadge}>
              <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase() || "U"}</div>
            </div>
          </div>
        </div>

        <div style={styles.content}>{children}</div>
      </main>
    </div>
  );
};

const styles = {
  layout: { 
    display: "flex", 
    minHeight: "100vh", 
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    position: "relative",
  },
  sidebar: {
    position: "fixed",
    top: 0, 
    left: 0,
    height: "100vh",
    background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
    backdropFilter: "blur(10px)",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
    boxShadow: "4px 0 20px rgba(0,0,0,0.2)",
    zIndex: 100,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    marginBottom: "20px",
  },
  logoWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    overflow: "hidden",
  },
  logoIcon: {
    fontSize: "28px",
    animation: "pulse 2s infinite",
  },
  brandText: {
    display: "flex",
    flexDirection: "column",
  },
  brandName: {
    color: "#fff",
    fontWeight: 800,
    fontSize: "18px",
    letterSpacing: "0.5px",
  },
  brandTagline: {
    color: "rgba(255,255,255,0.6)",
    fontSize: "10px",
    marginTop: "2px",
  },
  toggleBtn: {
    background: "rgba(255,255,255,0.1)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "12px",
    padding: "6px 10px",
    flexShrink: 0,
    transition: "all 0.2s ease",
  },
  nav: { 
    display: "flex", 
    flexDirection: "column", 
    padding: "0 12px", 
    gap: "6px", 
    flex: 1,
    overflowY: "auto",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "500",
    textDecoration: "none",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    position: "relative",
    cursor: "pointer",
  },
  navIcon: { 
    fontSize: "20px", 
    flexShrink: 0,
    transition: "transform 0.2s ease",
  },
  navLabel: {
    transition: "color 0.2s ease",
  },
  activeIndicator: {
    position: "absolute",
    right: "12px",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
  },
  sidebarBottom: { 
    padding: "20px 12px", 
    borderTop: "1px solid rgba(255,255,255,0.1)",
    marginTop: "auto",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "12px",
    marginBottom: "12px",
  },
  userAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: "16px",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: "#fff",
    fontWeight: "600",
    fontSize: "13px",
  },
  userEmail: {
    color: "rgba(255,255,255,0.6)",
    fontSize: "11px",
    marginTop: "2px",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(239, 68, 68, 0.1)",
    border: "none",
    color: "#f87171",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    width: "100%",
  },
  main: { 
    flex: 1, 
    padding: "28px 32px", 
    transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
    minHeight: "100vh",
  },
  topbar: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: "32px",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
    padding: "20px 28px",
    borderRadius: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  pageHeader: {
    flex: 1,
  },
  pageTitle: { 
    fontSize: "28px", 
    fontWeight: 800, 
    background: "linear-gradient(135deg, #1e293b, #334155)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 4px",
  },
  pageSub: { 
    color: "#64748b", 
    fontSize: "14px", 
    margin: 0,
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  notificationBell: {
    position: "relative",
    fontSize: "22px",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },
  notificationBadge: {
    position: "absolute",
    top: "-5px",
    right: "-8px",
    background: "#ef4444",
    color: "white",
    fontSize: "10px",
    borderRadius: "50%",
    padding: "2px 5px",
    fontWeight: "bold",
  },
  userBadge: { 
    display: "flex", 
    alignItems: "center", 
    gap: "10px",
    cursor: "pointer",
  },
  avatar: {
    width: "42px", 
    height: "42px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center",
    color: "#fff", 
    fontWeight: 700, 
    fontSize: "16px",
    transition: "transform 0.2s ease",
  },
  content: { 
    background: "#fff", 
    borderRadius: "20px", 
    padding: "32px", 
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    animation: "slideIn 0.3s ease",
  },
};

export default DashboardLayout;