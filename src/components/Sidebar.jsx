import React, { createContext, useState } from "react";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {

  const [balance, setBalance] = useState(5000);
  const [transactions, setTransactions] = useState([]);

  const deposit = (amount) => {

    setBalance(balance + amount);

    setTransactions([
      ...transactions,
      { type: "Deposit", amount }
    ]);
  };

  const withdraw = (amount) => {

    setBalance(balance - amount);

    setTransactions([
      ...transactions,
      { type: "Withdraw", amount }
    ]);
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        deposit,
        withdraw,
        transactions
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};