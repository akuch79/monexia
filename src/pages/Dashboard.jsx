import React from "react";
import { getCurrentUser } from "../api/api.js";
import { Link } from "react-router-dom";

const styles = `
  .dash-container {
    min-height: 100vh;
    background: #0a0f0d;
    color: #fff;
    padding: 2rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .dash-header {
    max-width: 1200px;
    margin: 0 auto 3rem;
  }

  .dash-header h1 {
    font-size: 2.5rem;
    font-weight: 800;
    background: linear-gradient(to right, #fff, #10b981);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
  }

  .dash-header p {
    color: #94a3b8;
    font-size: 1.1rem;
  }

  /* Summary Cards */
  .dash-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .dash-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(16, 185, 129, 0.1);
    border-radius: 24px;
    padding: 2rem;
    transition: transform 0.3s ease;
  }

  .dash-card:hover {
    transform: translateY(-5px);
    background: rgba(16, 185, 129, 0.05);
  }

  .card-label {
    color: #94a3b8;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.5rem;
  }

  .card-value {
    font-size: 1.8rem;
    font-weight: 700;
    color: #fff;
  }

  .trend-up { color: #10b981; font-size: 0.85rem; }

  /* Quick Actions Section */
  .quick-actions {
    max-width: 1200px;
    margin: 4rem auto 0;
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
  }

  .action-btn {
    background: #10b981;
    color: #064e3b;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 700;
    font-size: 0.9rem;
    transition: 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .action-btn:hover {
    opacity: 0.9;
    box-shadow: 0 8px 15px rgba(16, 185, 129, 0.2);
  }

  .action-btn.secondary {
    background: rgba(255,255,255,0.05);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.1);
  }
`;

export default function Dashboard() {
  const user = getCurrentUser();

  return (
    <div className="dash-container">
      <style>{styles}</style>
      
      <header className="dash-header">
        <h1>Welcome back{user?.name ? `, ${user.name}` : ""}! 👋</h1>
        <p>Your global wealth overview for today.</p>
      </header>

      <div className="dash-grid">
        <div className="dash-card">
          <div className="card-label">Total Balance</div>
          <div className="card-value">$12,450.00</div>
          <div className="trend-up">↑ 4.2% from last month</div>
        </div>

        <div className="dash-card">
          <div className="card-label">Monthly Expenses</div>
          <div className="card-value">$3,210.80</div>
          <p style={{color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem'}}>12 transactions today</p>
        </div>

        <div className="dash-card">
          <div className="card-label">Active Investments</div>
          <div className="card-value">$8,100.00</div>
          <div className="trend-up">↑ 12.5% yield</div>
        </div>
      </div>

      <section className="quick-actions">
        <h3 style={{fontSize: '1.2rem', color: '#10b981'}}>Quick Actions</h3>
        <div className="action-buttons">
          <Link to="/add-transaction" className="action-btn">
            <span>+</span> Add Transaction
          </Link>
          <Link to="/analytics" className="action-btn secondary">
            📊 View Reports
          </Link>
          <Link to="/investment" className="action-btn secondary">
            📈 Manage Portfolio
          </Link>
        </div>
      </section>
    </div>
  );
}