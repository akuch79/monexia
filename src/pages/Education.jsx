import React, { useState } from 'react';

const tips = [
    {
        category: '💰 Budgeting',
        title: 'The 50/30/20 Rule',
        content: 'Spend 50% of your income on needs, 30% on wants, and save 20%. This simple rule helps you stay balanced without feeling restricted.'
    },
    {
        category: '💰 Budgeting',
        title: 'Track Every Expense',
        content: 'Write down every purchase, no matter how small. Most people are surprised to find where their money actually goes each month.'
    },
    {
        category: '📈 Investing',
        title: 'Start Early, Start Small',
        content: 'Thanks to compound interest, even KES 500/month invested at 25 grows far more than KES 2000/month started at 40. Time is your biggest asset.'
    },
    {
        category: '📈 Investing',
        title: 'Diversify Your Portfolio',
        content: 'Never put all your money in one place. Spread across stocks, bonds, real estate, and savings to reduce risk.'
    },
    {
        category: '🛡️ Emergency Fund',
        title: 'Build a 6-Month Safety Net',
        content: 'Before investing, save 3–6 months of expenses in an accessible account. This protects you from unexpected job loss or medical bills.'
    },
    {
        category: '🛡️ Emergency Fund',
        title: 'Keep It Separate',
        content: 'Store your emergency fund in a different account from your daily spending to avoid accidentally using it.'
    },
    {
        category: '💳 Debt',
        title: 'Avalanche vs Snowball Method',
        content: 'Avalanche: pay highest-interest debt first (saves more money). Snowball: pay smallest debt first (builds motivation). Pick what works for you.'
    },
    {
        category: '💳 Debt',
        title: 'Avoid Lifestyle Inflation',
        content: 'When your income increases, resist the urge to spend more. Use raises to pay off debt or increase savings instead.'
    },
];

const categories = ['All', '💰 Budgeting', '📈 Investing', '🛡️ Emergency Fund', '💳 Debt'];

export default function Education() {
    const [active, setActive] = useState('All');
    const [expanded, setExpanded] = useState(null);

    const filtered = active === 'All' ? tips : tips.filter(t => t.category === active);

    return (
        <div style={{
            padding: '3rem 1rem',
            maxWidth: '900px',
            margin: '0 auto',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: '#f3f4f6',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>📚 Financial Education</h1>
            <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.1rem', color: '#e0e7ff' }}>
                Learn the fundamentals of managing your money wisely.
            </p>

            {/* Category Filter */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActive(cat)}
                        style={{
                            padding: '0.5rem 1.2rem',
                            borderRadius: '25px',
                            border: 'none',
                            cursor: 'pointer',
                            background: active === cat ? '#facc15' : '#d1d5db',
                            color: active === cat ? '#1f2937' : '#374151',
                            fontWeight: active === cat ? 'bold' : '500',
                            boxShadow: active === cat ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
                            transition: 'all 0.3s'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Tips */}
            <div style={{ display: 'grid', gap: '1rem' }}>
                {filtered.map((tip, i) => (
                    <div
                        key={i}
                        onClick={() => setExpanded(expanded === i ? null : i)}
                        style={{
                            padding: '1.5rem 2rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '15px',
                            cursor: 'pointer',
                            borderLeft: '6px solid #facc15',
                            transition: 'all 0.3s',
                            boxShadow: expanded === i ? '0 10px 20px rgba(0,0,0,0.3)' : '0 4px 10px rgba(0,0,0,0.1)',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <small style={{ color: '#e0e7ff' }}>{tip.category}</small>
                                <h3 style={{ margin: '0.3rem 0 0', fontSize: '1.3rem', color: '#ffffff' }}>{tip.title}</h3>
                            </div>
                            <span style={{ fontSize: '1.2rem', color: '#facc15' }}>{expanded === i ? '▲' : '▼'}</span>
                        </div>
                        {expanded === i && (
                            <p style={{ marginTop: '0.75rem', color: '#e0e7ff', lineHeight: '1.7' }}>
                                {tip.content}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}