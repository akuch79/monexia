// ================================================================
// Pages.jsx — Dashboard, History, DepositSummary page components
// ================================================================

import { Btn, TxnRow } from './ui.jsx';
import { S } from './styles.js';

// ── Dashboard Page ────────────────────────────────────────────────
export function Dashboard({ balance, totalDep, totalWith, txns, onDeposit, onWithdraw }) {
  const depCount  = txns.filter(t => t.type === 'deposit').length;
  const withCount = txns.filter(t => t.type === 'withdraw').length;

  return (
    <div>
      {/* Stat Cards */}
      <div style={S.statsRow}>
        <div style={{ ...S.card, background: 'linear-gradient(135deg,#0f2040,#071428)', border: '1px solid rgba(79,142,247,0.3)' }}>
          <div style={S.cardLabel}>Wallet Balance</div>
          <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: -1, color: '#fff' }}>
            KES {balance.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', marginTop: 4 }}>SW-DEMO-001</div>
        </div>

        <div style={S.card}>
          <div style={S.cardLabel}>Total Deposited</div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -1, color: '#00d68f' }}>
            KES {totalDep.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: '#4a5978', marginTop: 4 }}>{depCount} deposit{depCount !== 1 ? 's' : ''}</div>
        </div>

        <div style={S.card}>
          <div style={S.cardLabel}>Total Withdrawn</div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -1, color: '#ff5c5c' }}>
            KES {totalWith.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: '#4a5978', marginTop: 4 }}>{withCount} withdrawal{withCount !== 1 ? 's' : ''}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <Btn onClick={onDeposit}>💳 Deposit</Btn>
        <Btn onClick={onWithdraw} variant="red">💸 Withdraw</Btn>
      </div>

      {/* Recent Transactions */}
      <div style={S.panel}>
        <div style={S.panelHead}>🕒 Recent Transactions</div>
        {txns.length === 0
          ? <div style={S.empty}>📭 No transactions yet — make a deposit to start!</div>
          : txns.slice(0, 5).map((t, i) => <TxnRow key={i} t={t} />)}
      </div>
    </div>
  );
}

// ── History Page ──────────────────────────────────────────────────
export function History({ txns, filter, onFilter }) {
  const filtered = txns.filter(t => {
    if (filter === 'all')      return true;
    if (filter === 'deposit')  return t.type === 'deposit';
    if (filter === 'withdraw') return t.type === 'withdraw';
    return t.method === filter;
  });

  return (
    <div style={S.panel}>
      <div style={S.panelHead}>📋 Transaction History</div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', 'deposit', 'withdraw', 'bank', 'mpesa', 'paypal'].map(f => (
          <button
            key={f}
            style={{ ...S.filterBtn, ...(filter === f ? S.filterActive : {}) }}
            onClick={() => onFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0
        ? <div style={S.empty}>📭 No transactions found</div>
        : filtered.map((t, i) => <TxnRow key={i} t={t} />)}
    </div>
  );
}

// ── Deposit Summary Side Panel ────────────────────────────────────
export function DepositSummary({ balance, totalDep, depCount }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={S.panel}>
        <div style={S.panelHead}>💰 Wallet Summary</div>
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, marginBottom: 4 }}>
          KES {balance.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
        </div>
        <div style={{ fontSize: 12, color: '#4a5978', marginBottom: 14 }}>Available balance</div>
        <hr style={{ border: 'none', borderTop: '1px solid #1e2d45', marginBottom: 14 }} />
        {[
          ['Total Deposits', `KES ${totalDep.toLocaleString()}`, '#00d68f'],
          ['Transactions',   depCount,                           '#f0f4ff'],
        ].map(([k, v, c]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
            <span style={{ color: '#8899bb' }}>{k}</span>
            <span style={{ fontWeight: 700, color: c }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={S.panel}>
        <div style={S.panelHead}>📋 Deposit Limits</div>
        {[
          ['Min',         'KES 10'],
          ['M-Pesa max',  'KES 150,000'],
          ['Bank max',    'KES 1,000,000'],
          ['PayPal max',  '$10,000'],
          ['Settlement',  'Instant'],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1e2d45', fontSize: 13 }}>
            <span style={{ color: '#8899bb' }}>{k}</span>
            <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: 12 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Success Receipt Screen ────────────────────────────────────────
export function SuccessScreen({ data, onReset }) {
  return (
    <div style={S.panel}>
      <div style={{ textAlign: 'center', padding: '12px 0' }}>
        <div style={{ fontSize: 54, display: 'inline-block', animation: 'popIn 0.5s ease', marginBottom: 10 }}>✅</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#00d68f', marginBottom: 4 }}>Payment Successful!</div>
        <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: -1, margin: '8px 0' }}>
          KES {data.amount.toLocaleString()}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#4a5978', marginBottom: 18 }}>
          Ref: {data.ref}
        </div>
        <div style={{ border: '1px solid #1e2d45', borderRadius: 12, padding: '14px 16px', textAlign: 'left', marginBottom: 16 }}>
          {Object.entries(data.details).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #1e2d45' }}>
              <span style={{ fontSize: 12, color: '#8899bb' }}>{k}</span>
              <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'monospace' }}>{v}</span>
            </div>
          ))}
        </div>
        <Btn variant="outline" onClick={onReset}>← Make Another Payment</Btn>
      </div>
    </div>
  );
}