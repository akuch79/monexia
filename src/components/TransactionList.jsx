import React, { useContext } from "react";
import { FinTechContext } from "../context/FinTechContext";

const TransactionList = () => {
  const { transactions } = useContext(FinTechContext);
  return (
    <div className="card">
      <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
      <ul className="divide-y divide-gray-200">
        {transactions.map(tx => (
          <li key={tx.id} className="py-2 flex justify-between">
            <span>{tx.type}</span>
            <span className={tx.type === "Deposit" ? "text-green-500" : "text-red-500"}>
              ${tx.amount}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;