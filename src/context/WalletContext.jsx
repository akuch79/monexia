import { createContext, useState, useCallback } from "react";

export const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [balance, setBalance]           = useState(0);
  const [transactions, setTransactions] = useState([]);

  const addTransaction = useCallback((type, amount, meta = {}) => {
    const entry = {
      id:        `txn_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
      type,
      amount:    Math.round(amount * 100) / 100,
      date:      new Date().toLocaleDateString("en-KE"),
      timestamp: Date.now(),
      ...meta,
    };
    setTransactions(prev => [entry, ...prev]);
    return entry;
  }, []);

  const deposit = useCallback((amount, meta = {}) => {
    if (!amount || amount <= 0) return;
    setBalance(prev => Math.round((prev + amount) * 100) / 100);
    return addTransaction("Deposit", amount, meta);
  }, [addTransaction]);

  const withdraw = useCallback((amount, meta = {}) => {
    if (!amount || amount <= 0) return;
    setBalance(prev => Math.round((prev - amount) * 100) / 100);
    return addTransaction("Withdraw", amount, meta);
  }, [addTransaction]);

  const transfer = useCallback((amount, meta = {}) => {
    if (!amount || amount <= 0) return;
    setBalance(prev => Math.round((prev - amount) * 100) / 100);
    return addTransaction("Transfer", amount, meta);
  }, [addTransaction]);

  return (
    <WalletContext.Provider value={{ balance, transactions, deposit, withdraw, transfer, addTransaction }}>
      {children}
    </WalletContext.Provider>
  );
}