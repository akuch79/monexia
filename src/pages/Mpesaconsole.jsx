import { useState, useCallback } from "react";

// ── Points to your real Monexia backend ──────────────────────
const API = import.meta.env.VITE_API_URL || "http://localhost:5003";

// ── Theme ────────────────────────────────────────────────────
const C = {
  green:  "#00A86B",
  dark:   "#0a0f0d",
  card:   "#111a15",
  border: "#1e2e24",
  muted:  "#4a6b55",
  text:   "#d4edd9",
  accent: "#00ff8c",
};

// ── Styles ───────────────────────────────────────────────────
const s = {
  page: {
    minHeight: "100vh",
    background: C.dark,
    color: C.text,
    fontFamily: "'DM Mono', 'Courier New', monospace",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 32px",
    borderBottom: `1px solid ${C.border}`,
    background: C.card,
  },
  topBarLeft: { display: "flex", alignItems: "center", gap: "14px" },
  logo: {
    width: 38, height: 38,
    background: `linear-gradient(135deg, ${C.green}, ${C.accent})`,
    borderRadius: "9px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "17px", fontWeight: "bold", color: C.dark,
  },
  title:    { fontSize: "17px", fontWeight: "600", letterSpacing: "0.4px" },
  subtitle: { fontSize: "10px", color: C.muted, marginTop: "2px", letterSpacing: "2px", textTransform: "uppercase" },
  envBadge: (env) => ({
    padding: "4px 12px", borderRadius: "20px", fontSize: "10px",
    letterSpacing: "1px", textTransform: "uppercase", fontFamily: "inherit",
    background: env === "production" ? "#2a0505" : "#0a2010",
    color:      env === "production" ? "#ff6b6b" : C.accent,
    border: `1px solid ${env === "production" ? "#4a1010" : "#1a4a20"}`,
  }),
  tabs: {
    display: "flex", gap: "4px",
    padding: "20px 32px 0",
    borderBottom: `1px solid ${C.border}`,
  },
  tab: (active) => ({
    padding: "9px 18px",
    borderRadius: "8px 8px 0 0",
    border: `1px solid ${active ? C.border : "transparent"}`,
    borderBottom: active ? `1px solid ${C.card}` : "none",
    background: active ? C.card : "transparent",
    color: active ? C.accent : C.muted,
    cursor: "pointer", fontSize: "11px", letterSpacing: "1px",
    textTransform: "uppercase", fontFamily: "inherit",
    marginBottom: active ? "-1px" : "0",
    transition: "all 0.15s",
  }),
  content: { padding: "28px 32px", maxWidth: "720px", margin: "0 auto" },
  card: {
    background: C.card, border: `1px solid ${C.border}`,
    borderRadius: "12px", padding: "26px", marginBottom: "18px",
  },
  sTitle: { fontSize: "15px", fontWeight: "600", color: C.text, marginBottom: "5px" },
  sDesc:  { fontSize: "12px", color: C.muted, marginBottom: "22px", lineHeight: "1.6" },
  label:  { display: "block", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: C.muted, marginBottom: "7px" },
  input: {
    width: "100%", background: C.dark, border: `1px solid ${C.border}`,
    borderRadius: "8px", padding: "11px 13px", color: C.text,
    fontFamily: "inherit", fontSize: "13px", marginBottom: "14px",
    boxSizing: "border-box", outline: "none", transition: "border-color 0.15s",
  },
  row: { display: "flex", gap: "12px" },
  col: { flex: 1 },
  btn: (v = "primary", disabled) => ({
    width: "100%", padding: "13px", borderRadius: "8px", border: "none",
    cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit",
    fontSize: "12px", fontWeight: "600", letterSpacing: "1.5px",
    textTransform: "uppercase", transition: "opacity 0.15s", marginTop: "4px",
    opacity: disabled ? 0.5 : 1,
    background: v === "primary" ? `linear-gradient(135deg, ${C.green}, ${C.accent})` : C.border,
    color: v === "primary" ? C.dark : C.text,
  }),
  result: (ok) => ({
    marginTop: "18px", padding: "14px", borderRadius: "8px",
    background: ok ? "#0a1f10" : "#1f0a0a",
    border: `1px solid ${ok ? "#1a4a25" : "#4a1a1a"}`,
    fontSize: "11px", lineHeight: "1.6", whiteSpace: "pre-wrap",
    wordBreak: "break-all", color: ok ? "#6be89a" : "#e86b6b",
    maxHeight: "280px", overflowY: "auto",
  }),
  badge: (color) => ({
    display: "inline-block", padding: "2px 9px", borderRadius: "20px",
    fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase",
    background: color === "green" ? "#0a2010" : "#201000",
    color: color === "green" ? C.accent : "#ffaa44",
    border: `1px solid ${color === "green" ? "#1a4a20" : "#4a2a00"}`,
    marginLeft: "10px", verticalAlign: "middle",
  }),
  spinner: {
    display: "inline-block", width: "12px", height: "12px",
    border: `2px solid ${C.dark}`, borderTop: `2px solid transparent`,
    borderRadius: "50%", animation: "spin 0.7s linear infinite",
    marginRight: "7px", verticalAlign: "middle",
  },
  txRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 0", borderBottom: `1px solid ${C.border}`, fontSize: "12px",
  },
  txStatus: (s) => ({
    padding: "2px 8px", borderRadius: "10px", fontSize: "10px", letterSpacing: "0.5px",
    background: s === "completed" ? "#0a2010" : s === "failed" ? "#200a0a" : "#1a1500",
    color:      s === "completed" ? C.accent   : s === "failed" ? "#e86b6b"  : "#ffcc44",
    border: `1px solid ${s === "completed" ? "#1a4a20" : s === "failed" ? "#4a1010" : "#3a2a00"}`,
  }),
};

// ── Helpers ──────────────────────────────────────────────────
function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token") || "";
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label style={s.label}>{label}</label>
      <input
        style={s.input} value={value} type={type} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => (e.target.style.borderColor = C.accent)}
        onBlur={(e)  => (e.target.style.borderColor = C.border)}
      />
    </div>
  );
}

function Result({ data }) {
  if (!data) return null;
  return (
    <div style={s.result(data.success)}>
      {data.success ? "✓ SUCCESS\n\n" : "✗ ERROR\n\n"}
      {JSON.stringify(data, null, 2)}
    </div>
  );
}

function useApi() {
  const call = useCallback(async (method, endpoint, body = null) => {
    const opts = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${API}/api/mpesa${endpoint}`, opts);
    return res.json();
  }, []);
  return call;
}

// ── STK Push ─────────────────────────────────────────────────
function STKPush() {
  const call = useApi();
  const [f, setF] = useState({ phone: "", amount: "", ref: "", desc: "" });
  const [q, setQ] = useState({ id: "" });
  const [loading, setLoading] = useState(false);
  const [qLoading, setQLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [qResult, setQResult] = useState(null);

  const upd = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  const send = async () => {
    setLoading(true); setResult(null);
    try { setResult(await call("POST", "/stk-push", { phone: f.phone, amount: +f.amount, accountRef: f.ref, description: f.desc })); }
    catch (e) { setResult({ success: false, error: e.message }); }
    setLoading(false);
  };

  const query = async () => {
    setQLoading(true); setQResult(null);
    try { setQResult(await call("POST", "/stk-query", { checkoutRequestId: q.id })); }
    catch (e) { setQResult({ success: false, error: e.message }); }
    setQLoading(false);
  };

  // Auto-populate query ID from successful push
  const onResult = (r) => {
    setResult(r);
    if (r?.data?.CheckoutRequestID) setQ({ id: r.data.CheckoutRequestID });
  };

  return (
    <>
      <div style={s.card}>
        <div style={s.sTitle}>STK Push <span style={s.badge("green")}>Sandbox</span></div>
        <div style={s.sDesc}>Sends a payment prompt to the customer's phone. They confirm with their M-Pesa PIN.</div>
        <Field label="Phone Number" value={f.phone} onChange={upd("phone")} placeholder="2547XXXXXXXX" />
        <Field label="Amount (KES)" value={f.amount} onChange={upd("amount")} placeholder="100" type="number" />
        <div style={s.row}>
          <div style={s.col}><Field label="Account Reference" value={f.ref} onChange={upd("ref")} placeholder="Order-001" /></div>
          <div style={s.col}><Field label="Description" value={f.desc} onChange={upd("desc")} placeholder="Payment for..." /></div>
        </div>
        <button style={s.btn("primary", loading)} disabled={loading} onClick={async () => { setLoading(true); setResult(null); try { onResult(await call("POST", "/stk-push", { phone: f.phone, amount: +f.amount, accountRef: f.ref, description: f.desc })); } catch(e) { setResult({ success: false, error: e.message }); } setLoading(false); }}>
          {loading && <span style={s.spinner} />}{loading ? "Sending..." : "Send STK Push"}
        </button>
        <Result data={result} />
      </div>

      <div style={s.card}>
        <div style={s.sTitle}>Query STK Status</div>
        <div style={s.sDesc}>Check payment status using CheckoutRequestID. Auto-filled after a successful push above.</div>
        <Field label="Checkout Request ID" value={q.id} onChange={(v) => setQ({ id: v })} placeholder="ws_CO_..." />
        <button style={s.btn("secondary", qLoading)} disabled={qLoading} onClick={query}>
          {qLoading ? "Querying..." : "Check Status"}
        </button>
        <Result data={qResult} />
      </div>
    </>
  );
}

// ── C2B ──────────────────────────────────────────────────────
function C2B() {
  const call = useApi();
  const [f, setF] = useState({ phone: "", amount: "", billRef: "" });
  const [loading, setLoading] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [regResult, setRegResult] = useState(null);
  const upd = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  return (
    <>
      <div style={s.card}>
        <div style={s.sTitle}>Register C2B URLs</div>
        <div style={s.sDesc}>Register your confirmation and validation callback URLs once before accepting C2B payments.</div>
        <button style={s.btn("secondary", regLoading)} disabled={regLoading} onClick={async () => { setRegLoading(true); setRegResult(null); try { setRegResult(await call("POST", "/c2b/register")); } catch(e) { setRegResult({ success: false, error: e.message }); } setRegLoading(false); }}>
          {regLoading ? "Registering..." : "Register URLs"}
        </button>
        <Result data={regResult} />
      </div>

      <div style={s.card}>
        <div style={s.sTitle}>Simulate C2B Payment <span style={s.badge("orange")}>Sandbox Only</span></div>
        <div style={s.sDesc}>Simulate a customer paying your paybill or buy goods number.</div>
        <Field label="Phone Number" value={f.phone} onChange={upd("phone")} placeholder="2547XXXXXXXX" />
        <Field label="Amount (KES)" value={f.amount} onChange={upd("amount")} placeholder="500" type="number" />
        <Field label="Bill Reference" value={f.billRef} onChange={upd("billRef")} placeholder="INV-001" />
        <button style={s.btn("primary", loading)} disabled={loading} onClick={async () => { setLoading(true); setResult(null); try { setResult(await call("POST", "/c2b/simulate", { phone: f.phone, amount: +f.amount, billRefNumber: f.billRef })); } catch(e) { setResult({ success: false, error: e.message }); } setLoading(false); }}>
          {loading ? "Simulating..." : "Simulate Payment"}
        </button>
        <Result data={result} />
      </div>
    </>
  );
}

// ── B2C ──────────────────────────────────────────────────────
function B2C() {
  const call = useApi();
  const [f, setF] = useState({ phone: "", amount: "", remarks: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const upd = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  return (
    <div style={s.card}>
      <div style={s.sTitle}>Business to Customer (B2C)</div>
      <div style={s.sDesc}>Send money from your business short code to a customer's M-Pesa wallet. Used for refunds, salaries, or promotions.</div>
      <Field label="Recipient Phone" value={f.phone} onChange={upd("phone")} placeholder="2547XXXXXXXX" />
      <Field label="Amount (KES)" value={f.amount} onChange={upd("amount")} placeholder="250" type="number" />
      <Field label="Remarks" value={f.remarks} onChange={upd("remarks")} placeholder="Salary / Refund / Promotion" />
      <button style={s.btn("primary", loading)} disabled={loading} onClick={async () => { setLoading(true); setResult(null); try { setResult(await call("POST", "/b2c", { phone: f.phone, amount: +f.amount, remarks: f.remarks })); } catch(e) { setResult({ success: false, error: e.message }); } setLoading(false); }}>
        {loading ? "Sending..." : "Send to Customer"}
      </button>
      <Result data={result} />
    </div>
  );
}

// ── Transaction Status ───────────────────────────────────────
function TxStatus() {
  const call = useApi();
  const [txId, setTxId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  return (
    <div style={s.card}>
      <div style={s.sTitle}>Transaction Status</div>
      <div style={s.sDesc}>Query the status of any M-Pesa transaction using its Transaction ID (e.g. OEI2AK4Q16).</div>
      <Field label="Transaction ID" value={txId} onChange={setTxId} placeholder="OEI2AK4Q16" />
      <button style={s.btn("primary", loading)} disabled={loading} onClick={async () => { setLoading(true); setResult(null); try { setResult(await call("POST", "/transaction-status", { transactionId: txId })); } catch(e) { setResult({ success: false, error: e.message }); } setLoading(false); }}>
        {loading ? "Querying..." : "Check Transaction"}
      </button>
      <Result data={result} />
    </div>
  );
}

// ── History ──────────────────────────────────────────────────
function History() {
  const call = useApi();
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ type: "", status: "" });
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 15 });
      if (filter.type)   params.append("type",   filter.type);
      if (filter.status) params.append("status", filter.status);
      const data = await call("GET", `/transactions?${params}`);
      if (data.success) { setTxs(data.data); setMeta({ total: data.total, pages: data.pages }); setPage(p); }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div style={s.card}>
      <div style={s.sTitle}>Transaction History</div>
      <div style={s.sDesc}>Your M-Pesa transactions saved by the Monexia backend.</div>

      <div style={{ ...s.row, marginBottom: "16px" }}>
        <div style={s.col}>
          <label style={s.label}>Type</label>
          <select style={{ ...s.input, marginBottom: 0 }} value={filter.type} onChange={(e) => setFilter((p) => ({ ...p, type: e.target.value }))}>
            <option value="">All</option>
            <option value="stk_push">STK Push</option>
            <option value="c2b">C2B</option>
            <option value="b2c">B2C</option>
          </select>
        </div>
        <div style={s.col}>
          <label style={s.label}>Status</label>
          <select style={{ ...s.input, marginBottom: 0 }} value={filter.status} onChange={(e) => setFilter((p) => ({ ...p, status: e.target.value }))}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: "0" }}>
          <button style={{ ...s.btn("secondary"), width: "auto", padding: "11px 20px", marginTop: 0 }} onClick={() => load(1)}>
            {loading ? "..." : "Load"}
          </button>
        </div>
      </div>

      {txs.length === 0 && !loading && (
        <div style={{ textAlign: "center", color: C.muted, padding: "30px 0", fontSize: "12px" }}>
          No transactions yet. Click Load to fetch.
        </div>
      )}

      {txs.map((tx) => (
        <div key={tx._id} style={s.txRow}>
          <div>
            <div style={{ color: C.text, marginBottom: "3px" }}>{tx.phone}</div>
            <div style={{ color: C.muted, fontSize: "10px" }}>
              {tx.type.toUpperCase()} · {new Date(tx.createdAt).toLocaleString()}
              {tx.mpesaRef && <> · <span style={{ color: C.accent }}>{tx.mpesaRef}</span></>}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: C.text, marginBottom: "4px" }}>KES {tx.amount.toLocaleString()}</div>
            <span style={s.txStatus(tx.status)}>{tx.status}</span>
          </div>
        </div>
      ))}

      {meta.pages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
          <button style={{ ...s.btn("secondary"), width: "auto", padding: "8px 16px" }} disabled={page <= 1} onClick={() => load(page - 1)}>← Prev</button>
          <span style={{ lineHeight: "36px", fontSize: "11px", color: C.muted }}>{page} / {meta.pages}</span>
          <button style={{ ...s.btn("secondary"), width: "auto", padding: "8px 16px" }} disabled={page >= meta.pages} onClick={() => load(page + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────
const TABS = [
  { id: "stk",     label: "STK Push",  component: STKPush  },
  { id: "c2b",     label: "C2B",       component: C2B      },
  { id: "b2c",     label: "B2C",       component: B2C      },
  { id: "status",  label: "Tx Status", component: TxStatus },
  { id: "history", label: "History",   component: History  },
];

export default function MpesaConsole() {
  const [tab, setTab] = useState("stk");
  const env = import.meta.env.VITE_MPESA_ENV || "sandbox";
  const Active = TABS.find((t) => t.id === tab).component;

  return (
    <div style={s.page}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, select option { color: #2e4a38; }
        select { appearance: none; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
      `}</style>

      <div style={s.topBar}>
        <div style={s.topBarLeft}>
          <div style={s.logo}>M</div>
          <div>
            <div style={s.title}>M-Pesa Console</div>
            <div style={s.subtitle}>Daraja API Dashboard</div>
          </div>
        </div>
        <span style={s.envBadge(env)}>{env}</span>
      </div>

      <div style={s.tabs}>
        {TABS.map((t) => (
          <button key={t.id} style={s.tab(tab === t.id)} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={s.content}>
        <Active />
      </div>
    </div>
  );
}