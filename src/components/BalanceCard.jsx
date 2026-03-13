const BalanceCard = ({ balance }) => {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-6 shadow-lg">
      <p className="text-blue-200 text-sm font-medium mb-1">Total Balance</p>
      <h2 className="text-4xl font-bold">${Number(balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}</h2>
      <p className="text-blue-200 text-sm mt-4">Available funds</p>
    </div>
  );
};

export default BalanceCard;