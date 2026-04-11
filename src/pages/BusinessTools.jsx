// src/pages/BusinessTools.jsx
import React, { useState, useEffect } from 'react';

// Main component displaying all business tools
export default function BusinessTools() {
  return (
    <div
      style={{
        padding: '3rem 1rem',
        maxWidth: '1000px',
        margin: '0 auto',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        minHeight: '100vh',
        color: '#fff',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '0.5rem',
        }}
      >
        🛠️ Business Tools
      </h1>
      <p style={{ color: '#d1d5db', textAlign: 'center', marginBottom: '2rem' }}>
        Useful calculators to help manage your business finances. Use these tools to calculate loans, profits, ROI, and taxes quickly and efficiently.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <LoanCalculator />
        <ProfitCalculator />
        <ROICalculator />
        <TaxCalculator />
      </div>
    </div>
  );
}

// ── Animated Number Component
// Animates numbers counting up for a more dynamic UI experience
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const end = parseFloat(value);
    if (isNaN(end)) return;

    const duration = 800; // total animation time in ms
    const steps = 60; // number of animation steps
    const increment = end / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      setDisplay(current);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{display.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>;
}

// ── Loan Calculator
// Calculates monthly payments, interest, and principal for a loan
function LoanCalculator() {
  const [principal, setPrincipal] = useState(''); // Loan amount
  const [rate, setRate] = useState(''); // Annual interest rate (%)
  const [months, setMonths] = useState(''); // Loan duration in months
  const [result, setResult] = useState(null); // Calculated results

  useEffect(() => {
    const P = parseFloat(principal);
    const annualRate = parseFloat(rate);
    const r = annualRate / 100 / 12; // Convert annual % to monthly decimal
    const n = parseInt(months);

    if (isNaN(P) || isNaN(r) || isNaN(n) || P <= 0 || r <= 0 || n <= 0) {
      setResult(null);
      return;
    }

    // Monthly payment formula for amortized loans
    const monthlyPayment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const monthlyInterest = P * r; // Interest for the first month
    const principalPortion = monthlyPayment - monthlyInterest; // How much goes to principal
    const totalRepayment = monthlyPayment * n;

    setResult({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalRepayment: totalRepayment.toFixed(2),
      monthlyInterest: monthlyInterest.toFixed(2),
      principalPortion: principalPortion.toFixed(2),
    });
  }, [principal, rate, months]);

  return (
    <div style={{ ...cardStyle, background: '#ede9fe' }}>
      <h2>🏦 Loan Calculator</h2>
      <p>Enter your loan amount, annual interest rate, and loan duration to calculate monthly payments and total repayment.</p>
      <input
        type="number"
        placeholder="Principal (KES)"
        style={inputStyle}
        onChange={e => setPrincipal(e.target.value)}
      />
      <input
        type="number"
        placeholder="Annual Interest Rate (%)"
        style={inputStyle}
        onChange={e => setRate(e.target.value)}
      />
      <input
        type="number"
        placeholder="Duration (months)"
        style={inputStyle}
        onChange={e => setMonths(e.target.value)}
      />
      {result && (
        <div style={{ ...resultStyle, background: '#c7d2fe', opacity: 1, transition: 'opacity 0.6s ease' }}>
          <p><strong>Monthly Payment:</strong> KES <AnimatedNumber value={result.monthlyPayment} /></p>
          <p><strong>Monthly Interest:</strong> KES <AnimatedNumber value={result.monthlyInterest} /></p>
          <p><strong>Principal Portion:</strong> KES <AnimatedNumber value={result.principalPortion} /></p>
          <p><strong>Total Repayment:</strong> KES <AnimatedNumber value={result.totalRepayment} /></p>
        </div>
      )}
    </div>
  );
}

// ── Profit Calculator
// Calculates net profit and profit margin from revenue and costs
function ProfitCalculator() {
  const [revenue, setRevenue] = useState('');
  const [costs, setCosts] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const r = parseFloat(revenue);
    const c = parseFloat(costs);
    if (isNaN(r) || isNaN(c) || r < 0 || c < 0) {
      setResult(null);
      return;
    }

    const profit = r - c;
    const margin = r !== 0 ? ((profit / r) * 100).toFixed(2) : 0;

    setResult({ profit: profit.toFixed(2), margin });
  }, [revenue, costs]);

  return (
    <div style={{ ...cardStyle, background: '#d1fae5' }}>
      <h2>📊 Profit Calculator</h2>
      <p>Enter your revenue and costs to calculate net profit and profit margin.</p>
      <input
        type="number"
        placeholder="Total Revenue (KES)"
        style={inputStyle}
        onChange={e => setRevenue(e.target.value)}
      />
      <input
        type="number"
        placeholder="Total Costs (KES)"
        style={inputStyle}
        onChange={e => setCosts(e.target.value)}
      />
      {result && (
        <div style={{ ...resultStyle, background: '#6ee7b7', opacity: 1, transition: 'opacity 0.6s ease' }}>
          <p><strong>Net Profit:</strong> KES <AnimatedNumber value={result.profit} /></p>
          <p><strong>Profit Margin:</strong> {result.margin}%</p>
        </div>
      )}
    </div>
  );
}

// ── ROI Calculator
// Calculates Return on Investment as a percentage
function ROICalculator() {
  const [gain, setGain] = useState('');
  const [cost, setCost] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const g = parseFloat(gain);
    const c = parseFloat(cost);
    if (isNaN(g) || isNaN(c) || c <= 0) {
      setResult(null);
      return;
    }

    const roi = (((g - c) / c) * 100).toFixed(2);
    setResult(roi);
  }, [gain, cost]);

  return (
    <div style={{ ...cardStyle, background: '#dbeafe' }}>
      <h2>📈 ROI Calculator</h2>
      <p>Calculate ROI by entering the final gain and initial investment.</p>
      <input
        type="number"
        placeholder="Final Value / Gain (KES)"
        style={inputStyle}
        onChange={e => setGain(e.target.value)}
      />
      <input
        type="number"
        placeholder="Initial Investment (KES)"
        style={inputStyle}
        onChange={e => setCost(e.target.value)}
      />
      {result && (
        <div style={{ ...resultStyle, background: '#93c5fd', opacity: 1, transition: 'opacity 0.6s ease' }}>
          <p><strong>Return on Investment:</strong> <AnimatedNumber value={result} />%</p>
        </div>
      )}
    </div>
  );
}

// ── Tax Calculator
// Calculates PAYE tax based on monthly gross income
function TaxCalculator() {
  const [income, setIncome] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const monthlyIncome = parseFloat(income);
    if (isNaN(monthlyIncome) || monthlyIncome <= 0) {
      setResult(null);
      return;
    }

    const annual = monthlyIncome * 12;
    let tax = 0;

    // Kenyan PAYE Tax brackets (example)
    if (annual <= 288000) tax = annual * 0.10;
    else if (annual <= 388000) tax = 28800 + (annual - 288000) * 0.25;
    else if (annual <= 6000000) tax = 53800 + (annual - 388000) * 0.30;
    else if (annual <= 9600000) tax = 1737400 + (annual - 6000000) * 0.325;
    else tax = 2907400 + (annual - 9600000) * 0.35;

    const monthly = (tax / 12).toFixed(2);
    const net = (monthlyIncome - tax / 12).toFixed(2);

    setResult({ monthly, net });
  }, [income]);

  return (
    <div style={{ ...cardStyle, background: '#fee2e2' }}>
      <h2>🧾 PAYE Tax Calculator</h2>
      <p>Enter your monthly gross income to calculate PAYE and net take-home pay.</p>
      <input
        type="number"
        placeholder="Monthly Gross Income (KES)"
        style={inputStyle}
        onChange={e => setIncome(e.target.value)}
      />
      {result && (
        <div style={{ ...resultStyle, background: '#fca5a5', opacity: 1, transition: 'opacity 0.6s ease' }}>
          <p><strong>Monthly Tax (PAYE):</strong> KES <AnimatedNumber value={result.monthly} /></p>
          <p><strong>Net Take-home:</strong> KES <AnimatedNumber value={result.net} /></p>
        </div>
      )}
    </div>
  );
}

// ── Styles
const cardStyle = {
  borderRadius: '16px',
  padding: '1.5rem',
  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
  display: 'flex',
  flexDirection: 'column',
};

const inputStyle = {
  display: 'block',
  width: '100%',
  marginBottom: '0.75rem',
  padding: '0.5rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  outline: 'none',
};

const resultStyle = {
  marginTop: '1rem',
  padding: '1rem',
  borderRadius: '8px',
  color: '#111827',
};