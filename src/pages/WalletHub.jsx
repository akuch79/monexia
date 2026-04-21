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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

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
          setTransactions(transactions.slice(0, 10));
        }
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [navigate]);

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
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setShowPaymentModal(false);
          setPaymentAmount('');
          setRecipientInfo('');
          window.location.reload();
        }, 2000);
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

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem',
    background: '#f0fdf4',
    minHeight: '100vh',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '3px solid #e2e8f0',
    borderTopColor: '#10b981',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '1rem',
    color: '#64748b',
  },
  successNotification: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: '#10b981',
    color: 'white',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    zIndex: 2000,
    animation: 'slideIn 0.3s ease',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#064e3b',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '0.875rem',
  },
  currencyBadge: {
    background: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  balanceCard: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    borderRadius: '24px',
    padding: '2rem',
    color: 'white',
    marginBottom: '2rem',
    boxShadow: '0 20px 40px rgba(16,185,129,0.2)',
  },
  balanceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    opacity: 0.9,
  },
  balanceLabel: {
    fontSize: '0.875rem',
  },
  balanceCurrency: {
    fontSize: '0.75rem',
  },
  balanceAmount: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  equivalentBalance: {
    fontSize: '0.875rem',
    opacity: 0.9,
    marginBottom: '1rem',
  },
  balanceFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    opacity: 0.8,
  },
  actionSection: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#064e3b',
    marginBottom: '1rem',
  },
  methodsBadge: {
    fontSize: '0.75rem',
    fontWeight: 'normal',
    color: '#64748b',
    marginLeft: '0.5rem',
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '1rem',
  },
  actionButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  methodsSection: {
    marginBottom: '2rem',
  },
  methodsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem',
  },
  methodCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid #e2e8f0',
  },
  methodIcon: {
    fontSize: '2rem',
  },
  methodDetails: {
    flex: 1,
  },
  methodName: {
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.25rem',
  },
  methodCountries: {
    fontSize: '0.75rem',
    color: '#64748b',
  },
  methodFee: {
    fontSize: '0.7rem',
    color: '#f59e0b',
  },
  methodProvider: {
    fontSize: '0.7rem',
    color: '#8b5cf6',
  },
  southSudanSection: {
    marginBottom: '2rem',
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    borderRadius: '20px',
    padding: '1.5rem',
  },
  southSudanHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  southSudanFlag: {
    fontSize: '2rem',
  },
  recentSection: {
    marginTop: '2rem',
  },
  transactionsList: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  transactionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    borderBottom: '1px solid #f1f5f9',
  },
  transactionIcon: {
    fontSize: '1.5rem',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDesc: {
    fontWeight: '500',
    color: '#1e293b',
  },
  transactionDate: {
    fontSize: '0.75rem',
    color: '#94a3b8',
  },
  transactionAmount: {
    fontWeight: '600',
    fontSize: '1rem',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    borderRadius: '20px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #e2e8f0',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#064e3b',
    margin: 0,
  },
  modalClose: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#64748b',
  },
  modalBody: {
    padding: '1.5rem',
  },
  methodDisplay: {
    padding: '0.75rem',
    background: '#f0fdf4',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  modalInput: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '1rem',
  },
  modalButtons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  modalCancel: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    background: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  modalConfirm: {
    flex: 1,
    padding: '0.75rem',
    border: 'none',
    background: '#10b981',
    color: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
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