// ================================================================
// DepositForms.jsx — Bank, M-Pesa, and PayPal deposit forms
// ================================================================

import { useState } from 'react';
import { Field, InfoBox, Btn } from './ui.jsx';
import { mockAPI, USD_KES } from './mockAPI.js';
import { S } from './styles.js';

const BANKS = [
  'Equity Bank', 'KCB Bank', 'Co-operative Bank', 'Absa Bank',
  'NCBA Bank', 'Family Bank', 'Diamond Trust Bank', 'Standard Chartered',
];

// ── Bank Deposit Form ─────────────────────────────────────────────
export function BankForm({ onSuccess, onError }) {
  const [f, setF] = useState({ amount: '', name: '', bank: '', acc: '' });
  const [loading, setLoading] = useState(false);
  const set = k => v => setF(p => ({ ...p, [k]: v }));

  const submit = async () => {
    setLoading(true);
    try {
      const r = await mockAPI.bank(f);
      onSuccess('bank', r.amount, r.ref, {
        Bank: r.bank, Account: r.account, Reference: r.ref, Fee: 'Free',
      });
    } catch (e) {
      onError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <InfoBox variant="blue" icon="ℹ️">
        <strong>Test Mode:</strong> Simulates a bank transfer deposit.
      </InfoBox>

      <Field label="Amount (KES)" type="number" placeholder="e.g. 5000" value={f.amount} onChange={set('amount')} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Account Name" placeholder="Your full name" value={f.name} onChange={set('name')} />
        <Field label="Bank">
          <select style={S.input} value={f.bank} onChange={e => set('bank')(e.target.value)}>
            <option value="">Select bank...</option>
            {BANKS.map(b => <option key={b}>{b}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Account Number" placeholder="Your bank account number" value={f.acc} onChange={set('acc')} />

      <InfoBox variant="yellow" icon="🏦">
        <strong>Pay to:</strong> StoreWallet Ltd · Equity Bank · 0123456789 · Nairobi CBD
      </InfoBox>

      <Btn onClick={submit} loading={loading} disabled={loading}>Submit Bank Transfer</Btn>
    </>
  );
}

// ── M-Pesa STK Push Form ─────────────────────────────────────────
export function MpesaForm({ onSuccess, onError }) {
  const [f, setF] = useState({ phone: '', amount: '' });
  const [step, setStep] = useState('form'); // 'form' | 'stk'
  const [pinFilled, setPinFilled] = useState(0);
  const [prog, setProg] = useState(0);
  const [loading, setLoading] = useState(false);
  const set = k => v => setF(p => ({ ...p, [k]: v }));

  const submit = async () => {
    setLoading(true);
    try {
      await mockAPI.mpesaPush(f.phone, f.amount);
      setStep('stk');
      setLoading(false);

      // Animate PIN dots
      [1, 2, 3, 4].forEach((n, i) => setTimeout(() => setPinFilled(n), (i + 1) * 1000));

      // Progress bar
      const iv = setInterval(() => setProg(p => {
        if (p >= 100) { clearInterval(iv); return 100; }
        return p + 2;
      }), 100);

      // Wait for confirmation
      const r = await mockAPI.mpesaConfirm();
      clearInterval(iv);
      onSuccess('mpesa', +f.amount, r.receipt, {
        Phone: f.phone, Receipt: r.receipt, Paybill: '247247', Fee: 'Free',
      });
    } catch (e) {
      onError(e);
      setLoading(false);
    }
  };

  // STK Push waiting screen
  if (step === 'stk') return (
    <div style={{ textAlign: 'center', padding: '16px 0' }}>
      <div style={{ fontSize: 50, display: 'inline-block', animation: 'vibrate 0.4s infinite alternate' }}>📳</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: '#00d68f', margin: '10px 0 6px' }}>Check Your Phone!</div>
      <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 16 }}>
        STK Push sent to <strong style={{ color: '#f0f4ff' }}>{f.phone}</strong><br/>
        Enter your M-Pesa PIN · KES {(+f.amount).toLocaleString()}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, margin: '16px 0' }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            width: 14, height: 14, borderRadius: '50%',
            background: i < pinFilled ? '#00d68f' : '#1e2d45',
            transition: 'all 0.3s',
            boxShadow: i < pinFilled ? '0 0 10px #00d68f' : 'none',
          }} />
        ))}
      </div>
      <div style={{ fontSize: 11, color: '#4a5978', fontFamily: 'monospace' }}>Simulating PIN entry...</div>
      <div style={{ height: 3, background: '#1e2d45', borderRadius: 2, overflow: 'hidden', marginTop: 16 }}>
        <div style={{ height: '100%', background: '#00d68f', width: prog + '%', transition: 'width 0.12s' }} />
      </div>
    </div>
  );

  return (
    <>
      <InfoBox variant="green" icon="📲">
        <strong>Test Mode:</strong> Simulates M-Pesa STK Push with PIN animation!
      </InfoBox>
      <Field label="Phone Number" type="tel" placeholder="07XX XXX XXX" value={f.phone} onChange={set('phone')} />
      <Field label="Amount (KES)" type="number" placeholder="e.g. 1000" value={f.amount} onChange={set('amount')} />
      <p style={{ fontSize: 12, color: '#4a5978', fontFamily: 'monospace', marginBottom: 14 }}>
        Paybill: <strong style={{ color: '#f0f4ff' }}>247247</strong> · Account: <strong style={{ color: '#f0f4ff' }}>StoreWallet</strong>
      </p>
      <Btn onClick={submit} loading={loading} disabled={loading} variant="green">Send STK Push</Btn>
    </>
  );
}

// ── PayPal Checkout Form ─────────────────────────────────────────
export function PayPalForm({ onSuccess, onError }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const { orderId } = await mockAPI.paypalCreate(amount);
      setLoading(false);
      setRedirecting(true);
      setTimeout(async () => {
        const r = await mockAPI.paypalCapture(orderId, amount);
        onSuccess('paypal', r.kes, r.captureId, {
          USD: `$${amount}`,
          KES: `KES ${r.kes.toLocaleString()}`,
          'Capture ID': r.captureId,
          Rate: `1 USD = KES ${USD_KES}`,
        });
      }, 2500);
    } catch (e) {
      onError(e);
      setLoading(false);
    }
  };

  // PayPal redirect screen
  if (redirecting) return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ fontSize: 50, marginBottom: 12 }}>🅿️</div>
      <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>Redirecting to PayPal...</div>
      <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 16 }}>Completing ${amount} payment securely</div>
      <div style={{ height: 4, background: '#1e2d45', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg,#1e3a8a,#56aeff)', animation: 'ppFill 2.5s ease forwards' }} />
      </div>
    </div>
  );

  return (
    <>
      <InfoBox variant="blue" icon="🌍">
        <strong>Test Mode:</strong> Simulates PayPal redirect & capture. International payments supported.
      </InfoBox>
      <Field label="Amount (USD)" type="number" placeholder="e.g. 20" value={amount} onChange={setAmount} />
      {amount && +amount > 0 && (
        <div style={{ background: '#1a2233', border: '1px solid #1e2d45', borderRadius: 10, padding: '12px 14px', marginBottom: 14, fontSize: 13, color: '#8899bb' }}>
          ≈ KES <strong style={{ color: '#f0f4ff' }}>{(+amount * USD_KES).toLocaleString()}</strong> · 1 USD = KES {USD_KES}
        </div>
      )}
      <Btn onClick={submit} loading={loading} disabled={loading} variant="paypal">
        <span style={{ fontWeight: 900, color: '#56aeff' }}>Pay</span>
        <span style={{ fontWeight: 900 }}>Pal</span> — Checkout
      </Btn>
    </>
  );
}