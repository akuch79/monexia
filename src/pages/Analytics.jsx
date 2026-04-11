// src/pages/Analytics.jsx
import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { FaWallet, FaArrowDown, FaArrowUp, FaChartPie } from 'react-icons/fa';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function Analytics() {
    const [transactions, setTransactions] = useState([]);
    const [incomeTotal, setIncomeTotal] = useState(0);
    const [expensesTotal, setExpensesTotal] = useState(0);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const data = await getTransactions(); // ✅ Ensure this is implemented
                setTransactions(data);

                const income = data
                    .filter(t => t.type === 'income')
                    .reduce((s, t) => s + t.amount, 0);

                const expenses = data
                    .filter(t => t.type === 'expense')
                    .reduce((s, t) => s + t.amount, 0);

                setIncomeTotal(income);
                setExpensesTotal(expenses);
                setBalance(income - expenses);
            } catch (err) {
                console.error(err);
            }
        };

        fetchTransactions();
    }, []);

    const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt)
    );

    const labels = sortedTransactions.map(t =>
        new Date(t.date || t.createdAt).toLocaleDateString()
    );

    const incomeData = sortedTransactions
        .filter(t => t.type === 'income')
        .map(t => t.amount);

    const expensesData = sortedTransactions
        .filter(t => t.type === 'expense')
        .map(t => t.amount);

    const lineChartData = {
        labels,
        datasets: [
            {
                label: 'Income',
                data: incomeData,
                borderColor: '#10b981',
                backgroundColor: '#10b98133',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Expenses',
                data: expensesData,
                borderColor: '#ef4444',
                backgroundColor: '#ef444433',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const categories = {};
    transactions.forEach(t => {
        const key = t.category || 'Others';
        categories[key] = (categories[key] || 0) + t.amount;
    });

    const pieChartData = {
        labels: Object.keys(categories),
        datasets: [
            {
                data: Object.values(categories),
                backgroundColor: [
                    '#4f46e5',
                    '#10b981',
                    '#ef4444',
                    '#f59e0b',
                    '#3b82f6',
                    '#8b5cf6'
                ],
            }
        ]
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                padding: "40px 20px",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                color: "#fff"
            }}
        >
            <h2 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "30px", textAlign: "center" }}>
                Analytics Dashboard
            </h2>

            {/* Summary Cards */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center", marginBottom: "40px" }}>
                <StatCard label="Balance" value={`KES ${balance.toLocaleString()}`} color="#4f46e5" icon={<FaWallet size={28} />} />
                <StatCard label="Income" value={`KES ${incomeTotal.toLocaleString()}`} color="#10b981" icon={<FaArrowDown size={28} />} />
                <StatCard label="Expenses" value={`KES ${expensesTotal.toLocaleString()}`} color="#ef4444" icon={<FaArrowUp size={28} />} />
                <StatCard label="Categories" value={Object.keys(categories).length} color="#f59e0b" icon={<FaChartPie size={28} />} />
            </div>

            {/* Line Chart */}
            <div style={{ marginBottom: "40px", background: "#ffffff", borderRadius: "20px", padding: "25px", color: "#000", boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "20px" }}>Income vs Expenses Over Time</h3>
                <Line data={lineChartData} />
            </div>

            {/* Pie Chart */}
            <div style={{ marginBottom: "40px", background: "#ffffff", borderRadius: "20px", padding: "25px", color: "#000", boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "20px" }}>Category Breakdown</h3>
                <Pie data={pieChartData} />
            </div>
        </div>
    );
}

// ── Stat Card
function StatCard({ label, value, color, icon }) {
    return (
        <div
            style={{
                flex: "1 1 200px",
                minWidth: "200px",
                padding: "20px",
                borderRadius: "20px",
                background: color,
                display: "flex",
                alignItems: "center",
                gap: "15px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                transition: "transform 0.2s",
                cursor: "pointer"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
            <div>{icon}</div>
            <div>
                <p style={{ fontSize: "0.9rem", opacity: 0.85 }}>{label}</p>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "600" }}>{value}</h3>
            </div>
        </div>
    );
}