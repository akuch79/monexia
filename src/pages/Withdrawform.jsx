// ================================================================
// WithdrawForm.jsx — Withdraw to Bank or M-Pesa
// ================================================================

import { useState } from 'react';
import { Field, InfoBox, Btn, TxnRow } from './ui.jsx';
import { mockAPI } from './mockAPI.js';
import { S } from './styles.js';

const BANKS = ['Equity Bank', 'KCB Bank', 'Co-operative Bank', 'Absa Bank', 'NCBA Bank'];

export function WithdrawForm({ balance, onSuccess, onError }) {
  const [method, setMethod] = useState('bank');
  const [f, setF] = useState({ amount: '', name: '', bank: '', acc: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const set = k => v => setF(p => ({ ...p, [k]: v }));

  const submit = async () => {
    setLoading(true);
    try {
      const r = await mockAPI.withdraw(method, f, balance);
      onSuccess(method, r.amount, r.ref, f);
      setF({ amount: '', name: '', bank: '', acc: '', phone: '' });
    } catch (e) {
      onError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.panel}>
      <div style={S.panelHead}>💸 Withdraw Funds</div>

      {/* Available Balance */}
      <div style={{ background: '#1a2233', border: '1px solid #1e2d45', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#8899bb', fontFamily: 'monospace', marginBottom: 14 }}>
        Available: <strong style={{ color: '#f0f4ff' }}>KES {balance.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</strong>
      </div>

      {/* Method Picker */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
        {[['bank', '🏦', 'Bank Account', '1–3 days'], ['mpesa', '📱', 'M-Pesa', 'Instant']].map(([id, icon, name, sub]) => (
          <div
            key={id}
            onClick={() => setMethod(id)}
            style={{
              background: method === id ? 'rgba(255,92,92,0.06)' : '#1a2233',
              border: `2px solid ${method === id ? '#ff5c5c' : '#1e2d45'}`,
              borderRadius: 12, padding: 14, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700 }}>{name}</div>
            <div style={{ fontSize: 10, color: '#4a5978', fontFamily: 'monospace' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Amount (shared) */}
      <Field label="Amount (KES)" type="number" placeholder="e.g. 2000" value={f.amount} onChange={set('amount')} />

      {/* Bank-specific fields */}
      {method === 'bank' ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Account Name" placeholder="Full name" value={f.name} onChange={set('name')} />
            <Field label="Bank">
              <select style={S.input} value={f.bank} onChange={e => set('bank')(e.target.value)}>
                <option value="">Select bank...</option>
                {BANKS.map(b => <option key={b}>{b}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Account Number" placeholder="Bank account number" value={f.acc} onChange={set('acc')} />
          <InfoBox variant="yellow" icon="⚠️">
            Bank fee of <strong>KES 50</strong> applies. Takes 1–3 business days.
          </InfoBox>
        </>
      ) : (
        <>
          <Field label="M-Pesa Phone" type="tel" placeholder="07XX XXX XXX" value={f.phone} onChange={set('phone')} />
          <InfoBox variant="green" icon="⚡">
            M-Pesa withdrawals are <strong>instant & free</strong> (24/7).
          </InfoBox>
        </>
      )}

      <Btn onClick={submit} loading={loading} disabled={loading} variant="red">
        💸 Withdraw {method === 'bank' ? 'to Bank' : 'via M-Pesa'}
      </Btn>
    </div>
  );
}

// ── Withdrawal Info Panel ─────────────────────────────────────────
export function WithdrawInfo({ withdrawTxns }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={S.panel}>
        <div style={S.panelHead}>⚠️ Withdrawal Info</div>
        {[
          ['Min withdrawal', 'KES 100'],
          ['M-Pesa fee',     'Free'],
          ['Bank fee',       'KES 50'],
          ['Daily limit',    'KES 500,000'],
          ['M-Pesa speed',   'Instant'],
          ['Bank speed',     '1–3 days'],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1e2d45', fontSize: 13 }}>
            <span style={{ color: '#8899bb' }}>{k}</span>
            <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: 12 }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={S.panel}>
        <div style={S.panelHead}>📋 Recent Withdrawals</div>
        {withdrawTxns.length === 0
          ? <div style={S.empty}>💸 No withdrawals yet</div>
          : withdrawTxns.slice(0, 3).map((t, i) => <TxnRow key={i} t={t} />)}
      </div>
    </div>
  );
}