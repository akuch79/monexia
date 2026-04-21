import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WalletHub = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch wallet data from your API
    const fetchWalletData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch transactions to calculate balance
        const response = await fetch('/api/transactions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const transactions = await response.json();
          const calculatedBalance = transactions.reduce((sum, tx) => {
            return tx.type === 'income' ? sum + tx.amount : sum - tx.amount;
          }, 0);
          setBalance(calculatedBalance);
        }
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [navigate]);

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      background: '#f0fdf4',
      minHeight: '100vh'
    },
    header: {
      marginBottom: '2rem'
    },
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#064e3b',
      marginBottom: '0.5rem'
    },
    balanceCard: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      borderRadius: '20px',
      padding: '2rem',
      color: 'white',
      marginBottom: '2rem',
      boxShadow: '0 10px 30px rgba(16,185,129,0.2)'
    },
    balanceLabel: {
      fontSize: '0.875rem',
      opacity: 0.9,
      marginBottom: '0.5rem'
    },
    balanceAmount: {
      fontSize: '3rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    features: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginTop: '2rem'
    },
    featureCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #a7f3d0',
      cursor: 'pointer',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    },
    featureIcon: {
      fontSize: '2rem',
      marginBottom: '1rem'
    },
    featureTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#064e3b',
      marginBottom: '0.5rem'
    },
    featureDesc: {
      fontSize: '0.875rem',
      color: '#64748b'
    }
  };

  const features = [
    {
      icon: '💳',
      title: 'Send Money',
      description: 'Transfer funds to other users instantly',
      path: '/send-money'
    },
    {
      icon: '📊',
      title: 'Transaction History',
      description: 'View all your past transactions',
      path: '/transactions'
    },
    {
      icon: '🔒',
      title: 'Security Settings',
      description: 'Manage your security preferences',
      path: '/security'
    },
    {
      icon: '📱',
      title: 'Mobile Recharge',
      description: 'Recharge your mobile number',
      path: '/recharge'
    }
  ];

  const handleFeatureClick = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '3px solid #e2e8f0',
            borderTopColor: '#10b981',
            borderRadius: '50%',
            margin: '0 auto',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Wallet Hub</h1>
        <p style={{ color: '#64748b' }}>Manage your finances in one place</p>
      </div>

      <div style={styles.balanceCard}>
        <div style={styles.balanceLabel}>Total Balance</div>
        <div style={styles.balanceAmount}>KES {balance.toLocaleString()}</div>
        <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Last updated just now</div>
      </div>

      <div style={styles.features}>
        {features.map((feature, index) => (
          <div
            key={index}
            style={styles.featureCard}
            onClick={() => handleFeatureClick(feature.path)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
            }}
          >
            <div style={styles.featureIcon}>{feature.icon}</div>
            <div style={styles.featureTitle}>{feature.title}</div>
            <div style={styles.featureDesc}>{feature.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletHub;