import { createContext, useState, useCallback, useContext } from "react";

export const PlatformContext = createContext();

export const FEE_RATE        = 0.005;
export const MERCHANT_RATE   = 0.010;
export const ADMIN_WALLET_ID = "admin";

const SEED_USERS = [
  { id:"u1", name:"Alice Wanjiku",   email:"alice@gmail.com",   phone:"+254711000001", role:"user",     balance:12400, verified:true,  joined:"2025-01-10", merchant:false, suspended:false },
  { id:"u2", name:"Brian Otieno",    email:"brian@gmail.com",   phone:"+254722000002", role:"user",     balance:8750,  verified:true,  joined:"2025-02-14", merchant:false, suspended:false },
  { id:"u3", name:"Mama Mboga Shop", email:"mamboga@gmail.com", phone:"+254733000003", role:"merchant", balance:34200, verified:true,  joined:"2025-01-05", merchant:true,  suspended:false, merchantSlug:"mamboga",      merchantDesc:"Fresh vegetables & groceries" },
  { id:"u4", name:"David Kipchoge",  email:"david@gmail.com",   phone:"+254744000004", role:"user",     balance:2100,  verified:false, joined:"2025-03-01", merchant:false, suspended:false },
  { id:"u5", name:"Tech Solutions",  email:"tech@company.com",  phone:"+254755000005", role:"merchant", balance:89000, verified:true,  joined:"2024-12-20", merchant:true,  suspended:false, merchantSlug:"techsolutions", merchantDesc:"Software & IT services" },
];

const SEED_TRANSACTIONS = [
  { id:"t1", from:"u1", to:"u2",    amount:500,  fee:2.5,  type:"transfer", date:"2025-03-01", note:"Lunch",          status:"success" },
  { id:"t2", from:"u2", to:"u3",    amount:1200, fee:12,   type:"merchant", date:"2025-03-02", note:"Groceries",      status:"success" },
  { id:"t3", from:"u1", to:"admin", amount:2.5,  fee:0,    type:"fee",      date:"2025-03-01", note:"Platform fee",   status:"success" },
  { id:"t4", from:"u4", to:"u1",    amount:3000, fee:15,   type:"transfer", date:"2025-03-03", note:"Rent share",     status:"success" },
  { id:"t5", from:"u2", to:"u5",    amount:5000, fee:50,   type:"merchant", date:"2025-03-04", note:"Website design", status:"success" },
  { id:"t6", from:"u3", to:"u1",    amount:800,  fee:4,    type:"transfer", date:"2025-03-05", note:"Refund",         status:"success" },
  { id:"t7", from:"u2", to:"admin", amount:4,    fee:0,    type:"fee",      date:"2025-03-03", note:"Platform fee",   status:"success" },
  { id:"t8", from:"u4", to:"admin", amount:15,   fee:0,    type:"fee",      date:"2025-03-03", note:"Platform fee",   status:"success" },
  { id:"t9", from:"u2", to:"admin", amount:50,   fee:0,    type:"fee",      date:"2025-03-04", note:"Platform fee",   status:"success" },
];

// ── Default site settings ─────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  siteName:        "StoreWallet",
  supportEmail:    "support@storewallet.app",
  withdrawalEmail: "payments@storewallet.app",
  mpesaNumber:     "+254700000000",
  feeRate:         0.5,
  merchantRate:    1.0,
  minTransfer:     10,
  maxTransfer:     500000,
  maintenanceMode: false,
  allowRegistration: true,
  requireVerification: false,
  announcementText: "",
  announcementActive: false,
};

export function PlatformProvider({ children }) {
  const [users,        setUsers]        = useState(SEED_USERS);
  const [platformTxns, setPlatformTxns] = useState(SEED_TRANSACTIONS);
  const [adminBalance, setAdminBalance] = useState(
    SEED_TRANSACTIONS.filter(t=>t.type==="fee").reduce((a,b)=>a+b.amount,0)
  );
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SETTINGS);
  const [withdrawals,  setWithdrawals]  = useState([]);

  const totalVolume    = platformTxns.filter(t=>t.type!=="fee").reduce((a,b)=>a+b.amount,0);
  const totalFees      = platformTxns.filter(t=>t.type==="fee").reduce((a,b)=>a+b.amount,0);
  const totalUsers     = users.filter(u=>u.role==="user").length;
  const totalMerchants = users.filter(u=>u.role==="merchant").length;
  const verifiedUsers  = users.filter(u=>u.verified).length;

  const findUser    = useCallback((query) => {
    const q = String(query).toLowerCase().trim();
    return users.find(u =>
      u.email.toLowerCase()===q ||
      u.phone.replace(/\s/g,"")===q.replace(/\s/g,"") ||
      u.merchantSlug===q
    ) || null;
  }, [users]);

  const getUserById = useCallback((id) => users.find(u=>u.id===id)||null, [users]);

  const registerUser = useCallback(({ name, email, phone, password, role="user", merchantSlug="", merchantDesc="" }) => {
    const exists = users.find(u => u.email===email || u.phone===phone);
    if (exists) return { success:false, error:"Email or phone already registered." };
    const newUser = {
      id:`u${Date.now()}`, name:name.trim(), email:email.trim().toLowerCase(),
      phone:phone.trim(), role, balance:0, verified:false,
      joined:new Date().toISOString().slice(0,10),
      merchant:role==="merchant", suspended:false,
      merchantSlug:merchantSlug||email.split("@")[0], merchantDesc:merchantDesc||"",
    };
    setUsers(prev=>[...prev, newUser]);
    return { success:true, user:newUser };
  }, [users]);

  const platformTransfer = useCallback(({ fromId, toQuery, amount, note="" }) => {
    const val = Math.round(amount*100)/100;
    if (!val||val<=0) return { success:false, error:"Invalid amount." };
    const sender = users.find(u=>u.id===fromId);
    if (!sender) return { success:false, error:"Sender not found." };
    if (sender.balance<val) return { success:false, error:`Insufficient balance. You have KES ${sender.balance.toLocaleString()}.` };
    const recipient = findUser(toQuery);
    if (!recipient) return { success:false, error:"Recipient not found." };
    if (recipient.id===fromId) return { success:false, error:"Cannot send to yourself." };
    const rate    = recipient.merchant ? MERCHANT_RATE : FEE_RATE;
    const fee     = Math.round(val*rate*100)/100;
    const receive = Math.round((val-fee)*100)/100;
    const txId    = `TX${Date.now()}`;
    const date    = new Date().toISOString().slice(0,10);
    setUsers(prev=>prev.map(u=>{
      if (u.id===fromId)       return {...u, balance:Math.round((u.balance-val)*100)/100};
      if (u.id===recipient.id) return {...u, balance:Math.round((u.balance+receive)*100)/100};
      return u;
    }));
    setAdminBalance(prev=>Math.round((prev+fee)*100)/100);
    const txn    = { id:txId, from:fromId, to:recipient.id, amount:val, fee, receive, type:recipient.merchant?"merchant":"transfer", date, note, status:"success" };
    const feeTxn = { id:`${txId}-fee`, from:fromId, to:"admin", amount:fee, fee:0, type:"fee", date, note:"Platform fee", status:"success" };
    setPlatformTxns(prev=>[txn, feeTxn, ...prev]);
    return { success:true, txn, recipient, fee, receive };
  }, [users, findUser]);

  const platformDeposit = useCallback(({ userId, amount, source, txRef }) => {
    const val = Math.round(amount*100)/100;
    setUsers(prev=>prev.map(u=>u.id===userId?{...u, balance:Math.round((u.balance+val)*100)/100}:u));
    const txn = { id:`DEP${Date.now()}`, from:"external", to:userId, amount:val, fee:0, type:"deposit", date:new Date().toISOString().slice(0,10), note:`Funded via ${source}`, source, txRef, status:"success" };
    setPlatformTxns(prev=>[txn, ...prev]);
    return txn;
  }, []);

  const getUserTxns = useCallback((userId) =>
    platformTxns.filter(t=>t.from===userId||t.to===userId)
  , [platformTxns]);

  // ── Admin: verify user ────────────────────────────────────────────────────
  const verifyUser  = useCallback((id) => setUsers(prev=>prev.map(u=>u.id===id?{...u,verified:true}:u)),[]);

  // ── Admin: suspend / unsuspend user ──────────────────────────────────────
  const suspendUser = useCallback((id) => setUsers(prev=>prev.map(u=>u.id===id?{...u,suspended:true}:u)),[]);
  const unsuspendUser = useCallback((id) => setUsers(prev=>prev.map(u=>u.id===id?{...u,suspended:false}:u)),[]);

  // ── Admin: delete user ────────────────────────────────────────────────────
  const deleteUser  = useCallback((id) => setUsers(prev=>prev.filter(u=>u.id!==id)),[]);

  // ── Admin: edit user ──────────────────────────────────────────────────────
  const editUser = useCallback((id, updates) => {
    setUsers(prev=>prev.map(u=>u.id===id?{...u,...updates}:u));
  },[]);

  // ── Admin: delete transaction ─────────────────────────────────────────────
  const deleteTransaction = useCallback((id) => {
    setPlatformTxns(prev=>prev.filter(t=>t.id!==id));
  },[]);

  // ── Admin: update site settings ───────────────────────────────────────────
  const updateSettings = useCallback((updates) => {
    setSiteSettings(prev=>({...prev,...updates}));
  },[]);

  // ── Admin: withdraw profit (move from adminBalance to external) ───────────
  const adminWithdraw = useCallback(({ amount, method, destination, note="" }) => {
    const val = Math.round(amount*100)/100;
    if (val<=0||val>adminBalance) return { success:false, error:"Invalid amount or insufficient balance." };
    setAdminBalance(prev=>Math.round((prev-val)*100)/100);
    const w = { id:`WD${Date.now()}`, amount:val, method, destination, note, date:new Date().toISOString().slice(0,10), status:"completed" };
    setWithdrawals(prev=>[w,...prev]);
    const txn = { id:`WD${Date.now()}`, from:"admin", to:"external", amount:val, fee:0, type:"withdrawal", date:new Date().toISOString().slice(0,10), note:`Admin withdrawal via ${method}`, status:"success" };
    setPlatformTxns(prev=>[txn,...prev]);
    return { success:true, withdrawal:w };
  },[adminBalance]);

  return (
    <PlatformContext.Provider value={{
      users, platformTxns, adminBalance, siteSettings, withdrawals,
      totalVolume, totalFees, totalUsers, totalMerchants, verifiedUsers,
      findUser, getUserById, registerUser,
      platformTransfer, platformDeposit, getUserTxns,
      verifyUser, suspendUser, unsuspendUser, deleteUser, editUser,
      deleteTransaction, updateSettings, adminWithdraw,
      FEE_RATE, MERCHANT_RATE,
    }}>
      {children}
    </PlatformContext.Provider>
  );
}

export const usePlatform = () => useContext(PlatformContext);