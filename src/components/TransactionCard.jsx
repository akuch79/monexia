import React from 'react';

const TransactionCard = ({ transaction }) => {
    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <h4>{transaction.category}</h4>
            <p>Type: {transaction.type}</p>
            <p>Amount: ${transaction.amount}</p>
            <p>{transaction.description}</p>
            <p>Date: {new Date(transaction.date).toLocaleDateString()}</p>
        </div>
    );
};

export default TransactionCard;