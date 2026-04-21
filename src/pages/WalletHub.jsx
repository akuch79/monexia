import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WalletHub = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [recipientInfo, setRecipientInfo] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Don't redirect - let the dashboard layout handle authentication
        if (!token) {
          setError('Please log in to view your wallet');
          setLoading(false);
          return;
        }

        // Try to fetch from wallet API first, fallback to transactions API
        let response = await fetch('/api/wallet/balance', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // If wallet endpoint doesn't exist, use transactions endpoint
        if (!response.ok) {
          response = await fetch('/api/transactions', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        }

        if (response.ok) {
          const data = await response.json();
          
          // Handle different response formats
          let calculatedBalance = 0;
          let transactionsData = [];
          
          if (data.balance !== undefined) {
            // Response from /api/wallet/balance
            setBalance(data.balance);
          } else if (Array.isArray(data)) {
            // Response from /api/transactions
            transactionsData = data;
            calculatedBalance = data.reduce((sum, tx) => {
              return tx.type === 'income' ? sum + tx.amount : sum - tx.amount;
            }, 0);
            setBalance(calculatedBalance);
            setTransactions(data.slice(0, 10));
          } else if (data.transactions) {
            // Response from /api/wallet/transactions
            transactionsData = data.transactions;
            calculatedBalance = data.transactions.reduce((sum, tx) => {
              return tx.type === 'income' ? sum + tx.amount : sum - tx.amount;
            }, 0);
            setBalance(calculatedBalance);
            setTransactions(data.transactions.slice(0, 10));
          } else if (data.stats) {
            // Response from /api/wallet/stats
            setBalance(data.stats.savings);
          }
        } else if (response.status === 401) {
          // Token expired or invalid, but don't redirect immediately
          setError('Session expired. Please refresh the page.');
        } else {
          setError('Unable to fetch wallet data');
        }
      } catch (error) {
        console.error('Error fetching wallet data:', error);
        setError('Network error. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []); // Removed navigate dependency to prevent redirects

  const handlePayment = async () => {
    if (!paymentAmount || paymentAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (paymentType === 'send' && !recipientInfo) {
      alert('Please enter recipient information');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please log in to continue');
        setLoading(false);
        return;
      }

      const transactionData = {
        description: `${paymentType === 'send' ? 'Send money to' : paymentType === 'receive' ? 'Receive from' : paymentType === 'deposit' ? 'Deposit via' : 'Transfer via'} ${selectedMethod}`,
        amount: parseFloat(paymentAmount),
        type: paymentType === 'send' || paymentType === 'transfer' ? 'expense' : 'income',
        category: paymentType,
        phone: recipientInfo,
        date: new Date()
      };

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(transactionData)
      });

      if (response.ok) {
        const newTransaction = await response.json();
        setShowSuccess(true);
        
        // Update balance locally
        if (transactionData.type === 'income') {
          setBalance(prev => prev + parseFloat(paymentAmount));
        } else {
          setBalance(prev => prev - parseFloat(paymentAmount));
        }
        
        // Add to recent transactions
        setTransactions(prev => [newTransaction, ...prev].slice(0, 10));
        
        setTimeout(() => {
          setShowSuccess(false);
          setShowPaymentModal(false);
          setPaymentAmount('');
          setRecipientInfo('');
        }, 2000);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Transaction failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = {
    africa: {
      title: 'African Payment Methods',
      methods: [
        { name: 'M-Pesa (Kenya, Tanzania, DRC, South Sudan)', icon: '📱', countries: ['Kenya', 'Tanzania', 'DRC', 'South Sudan'] },
        { name: 'Airtel Money (Uganda, Tanzania, Zambia)', icon: '📱', countries: ['Uganda', 'Tanzania', 'Zambia'] },
        { name: 'MTN Mobile Money (Uganda, Rwanda)', icon: '📱', countries: ['Uganda', 'Rwanda'] },
        { name: 'Tigo Pesa (Tanzania)', icon: '📱', countries: ['Tanzania'] },
        { name: 'Equity Bank (East Africa)', icon: '🏦', countries: ['Kenya', 'Uganda', 'South Sudan'] },
        { name: 'KCB Bank (East Africa)', icon: '🏦', countries: ['Kenya', 'Uganda', 'South Sudan'] },
        { name: 'Cooperative Bank (South Sudan)', icon: '🏦', countries: ['South Sudan'] },
        { name: 'Ivory Bank (South Sudan)', icon: '🏦', countries: ['South Sudan'] },
      ]
    },
    international: {
      title: 'International Payment Methods',
      methods: [
        { name: 'PayPal', icon: '💳', fee: '2.9% + $0.30' },
        { name: 'Visa/Mastercard', icon: '💳', fee: '2.5%' },
        { name: 'American Express', icon: '💳', fee: '3.0%' },
        { name: 'Bank Transfer (SWIFT)', icon: '🏦', fee: '$15-30' },
        { name: 'Western Union', icon: '💸', fee: 'Varies by amount' },
        { name: 'MoneyGram', icon: '💸', fee: 'Varies by amount' },
        { name: 'Payoneer', icon: '💳', fee: '2%' },
        { name: 'Skrill', icon: '💳', fee: '1.9%' },
        { name: 'Neteller', icon: '💳', fee: '2.5%' },
        { name: 'Crypto (BTC, ETH, USDT)', icon: '₿', fee: 'Network fees' },
      ]
    },
    southSudan: {
      title: 'South Sudan Specific Methods',
      methods: [
        { name: 'MTN South Sudan Money', icon: '📱', provider: 'MTN South Sudan' },
        { name: 'Zain South Sudan Cash', icon: '📱', provider: 'Zain South Sudan' },
        { name: 'Bank of South Sudan Transfer', icon: '🏦', provider: 'Bank of South Sudan' },
        { name: 'Equity Bank South Sudan', icon: '🏦', provider: 'Equity Bank South Sudan' },
        { name: 'KCB South Sudan', icon: '🏦', provider: 'KCB South Sudan' },
        { name: 'Ivory Bank South Sudan', icon: '🏦', provider: 'Ivory Bank' },
        { name: 'Cooperative Bank South Sudan', icon: '🏦', provider: 'Cooperative Bank' },
      ]
    }
  };

  const actionButtons = [
    { type: 'send', label: 'Send Money', icon: '📤', color: '#3b82f6', bg: '#dbeafe' },
    { type: 'receive', label: 'Receive Money', icon: '📥', color: '#10b981', bg: '#d1fae5' },
    { type: 'transfer', label: 'Transfer', icon: '🔄', color: '#f59e0b', bg: '#fed7aa' },
    { type: 'deposit', label: 'Deposit', icon: '💰', color: '#8b5cf6', bg: '#ede9fe' },
    { type: 'save', label: 'Save', icon: '🏦', color: '#06b6d4', bg: '#cffafe' },
  ];

  const openPaymentModal = (type, method) => {
    setPaymentType(type);
    setSelectedMethod(method);
    setShowPaymentModal(true);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Loading your wallet...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <span style={styles.errorIcon}>⚠️</span>
          <h3 style={styles.errorTitle}>Unable to load wallet</h3>
          <p style={styles.errorMessage}>{error}</p>
          <button style={styles.retryButton} onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Success Notification */}
      {showSuccess && (
        <div style={styles.successNotification}>
          ✅ Transaction completed successfully!
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Wallet Hub</h1>
          <p style={styles.subtitle}>Global payments made easy - Send & Receive worldwide</p>
        </div>
        <div style={styles.currencyBadge}>
          <span>🌍</span>
          <span>Multi-Currency</span>
        </div>
      </div>

      {/* Balance Card */}
      <div style={styles.balanceCard}>
        <div style={styles.balanceHeader}>
          <span style={styles.balanceLabel}>Total Balance</span>
          <span style={styles.balanceCurrency}>USD / SSP / KES</span>
        </div>
        <div style={styles.balanceAmount}>
          ${balance.toLocaleString()} USD
        </div>
        <div style={styles.equivalentBalance}>
          ≈ {Math.round(balance * 1300)} SSP | ≈ {Math.round(balance * 128)} KES
        </div>
        <div style={styles.balanceFooter}>
          <span>💳 Available for spending</span>
          <span>🔄 Last updated just now</span>
        </div>
      </div>

      {/* Rest of your component remains the same */}
      {/* Action Buttons */}
      <div style={styles.actionSection}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
        <div style={styles.actionGrid}>
          {actionButtons.map((action) => (
            <button
              key={action.type}
              style={{ ...styles.actionButton, backgroundColor: action.bg }}
              onClick={() => {
                if (action.type === 'save') {
                  navigate('/savings');
                } else {
                  setPaymentType(action.type);
                  setShowPaymentModal(true);
                }
              }}
            >
              <span style={{ fontSize: '24px' }}>{action.icon}</span>
              <span style={{ color: action.color, fontWeight: '600' }}>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* African Payment Methods */}
      <div style={styles.methodsSection}>
        <h3 style={styles.sectionTitle}>
          🌍 African Payment Methods
          <span style={styles.methodsBadge}>Supporting South Sudan & East Africa</span>
        </h3>
        <div style={styles.methodsGrid}>
          {paymentMethods.africa.methods.map((method, idx) => (
            <div
              key={idx}
              style={styles.methodCard}
              onClick={() => openPaymentModal('send', method.name)}
            >
              <div style={styles.methodIcon}>{method.icon}</div>
              <div style={styles.methodDetails}>
                <div style={styles.methodName}>{method.name}</div>
                <div style={styles.methodCountries}>
                  {method.countries?.join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* South Sudan Specific Section */}
      <div style={styles.southSudanSection}>
        <div style={styles.southSudanHeader}>
          <span style={styles.southSudanFlag}>🇸🇸</span>
          <h3 style={styles.sectionTitle}>South Sudan Specialized Services</h3>
        </div>
        <div style={styles.methodsGrid}>
          {paymentMethods.southSudan.methods.map((method, idx) => (
            <div
              key={idx}
              style={{ ...styles.methodCard, background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}
              onClick={() => openPaymentModal('send', method.name)}
            >
              <div style={styles.methodIcon}>{method.icon}</div>
              <div style={styles.methodDetails}>
                <div style={styles.methodName}>{method.name}</div>
                <div style={styles.methodProvider}>{method.provider}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* International Methods */}
      <div style={styles.methodsSection}>
        <h3 style={styles.sectionTitle}>💳 International Payment Methods</h3>
        <div style={styles.methodsGrid}>
          {paymentMethods.international.methods.map((method, idx) => (
            <div
              key={idx}
              style={styles.methodCard}
              onClick={() => openPaymentModal('transfer', method.name)}
            >
              <div style={styles.methodIcon}>{method.icon}</div>
              <div style={styles.methodDetails}>
                <div style={styles.methodName}>{method.name}</div>
                {method.fee && <div style={styles.methodFee}>Fee: {method.fee}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div style={styles.recentSection}>
          <h3 style={styles.sectionTitle}>Recent Transactions</h3>
          <div style={styles.transactionsList}>
            {transactions.map((tx, idx) => (
              <div key={idx} style={styles.transactionItem}>
                <div style={styles.transactionIcon}>
                  {tx.type === 'income' ? '💰' : '💸'}
                </div>
                <div style={styles.transactionDetails}>
                  <div style={styles.transactionDesc}>{tx.description}</div>
                  <div style={styles.transactionDate}>
                    {new Date(tx.date).toLocaleDateString()}
                  </div>
                </div>
                <div style={{
                  ...styles.transactionAmount,
                  color: tx.type === 'income' ? '#10b981' : '#ef4444'
                }}>
                  {tx.type === 'income' ? '+' : '-'} ${tx.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div style={styles.modalOverlay} onClick={() => setShowPaymentModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {paymentType === 'send' ? 'Send Money' : 
                 paymentType === 'receive' ? 'Receive Money' :
                 paymentType === 'transfer' ? 'Transfer Money' : 'Deposit Money'}
              </h3>
              <button style={styles.modalClose} onClick={() => setShowPaymentModal(false)}>×</button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.methodDisplay}>
                Method: <strong>{selectedMethod}</strong>
              </div>
              
              {(paymentType === 'send' || paymentType === 'transfer') && (
                <input
                  type="text"
                  style={styles.modalInput}
                  placeholder="Recipient phone number / email / account number"
                  value={recipientInfo}
                  onChange={(e) => setRecipientInfo(e.target.value)}
                />
              )}
              
              <input
                type="number"
                style={styles.modalInput}
                placeholder="Amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
              
              <div style={styles.modalButtons}>
                <button style={styles.modalCancel} onClick={() => setShowPaymentModal(false)}>
                  Cancel
                </button>
                <button style={styles.modalConfirm} onClick={handlePayment} disabled={loading}>
                  {loading ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add the missing error styles
const styles = {
  // ... (keep all your existing styles)
  errorContainer: {
    textAlign: 'center',
    padding: '3rem',
    background: 'white',
    borderRadius: '16px',
    marginTop: '2rem',
  },
  errorIcon: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: '1rem',
  },
  errorTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: '0.5rem',
  },
  errorMessage: {
    color: '#64748b',
    marginBottom: '1.5rem',
  },
  retryButton: {
    padding: '0.75rem 1.5rem',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  // ... (rest of your styles)
};

// Add animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(styleSheet);

export default WalletHub;