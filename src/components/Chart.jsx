import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import API from '../api/api';

export default function Analytics() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await API.get('/transactions');
                setTransactions(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTransactions();
    }, []);

    // Income vs Expenses Over Time
    const chartData = {
        labels: transactions.map(t => new Date(t.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Income',
                data: transactions.filter(t => t.type === 'income').map(t => t.amount),
                borderColor: 'green',
                fill: false,
            },
            {
                label: 'Expenses',
                data: transactions.filter(t => t.type === 'expense').map(t => t.amount),
                borderColor: 'red',
                fill: false,
            }
        ]
    };

    // Category Breakdown Pie
    const categories = {};
    transactions.forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
    });

    const pieData = {
        labels: Object.keys(categories),
        datasets: [{
            data: Object.values(categories),
            backgroundColor: ['#4f46e5', '#10b981', '#ef4444', '#f59e0b', '#3b82f6'],
        }]
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Analytics Overview</h2>
            <div className="mb-12">
                <h3 className="text-xl font-semibold mb-4">Income vs Expenses</h3>
                <Line data={chartData} />
            </div>
            <div>
                <h3 className="text-xl font-semibold mb-4">Category Breakdown</h3>
                <Pie data={pieData} />
            </div>
        </div>
    );
}