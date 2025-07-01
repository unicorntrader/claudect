import React from 'react';

const SymbolPerformance = ({ trades }) => {
  const grouped = trades.reduce((acc, trade) => {
    acc[trade.symbol] = acc[trade.symbol] || [];
    acc[trade.symbol].push(trade);
    return acc;
  }, {});

  const entries = Object.entries(grouped);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Symbol Performance</h3>
      <ul className="divide-y divide-gray-200">
        {entries.map(([symbol, symbolTrades]) => {
          const totalPnl = symbolTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
          return (
            <li key={symbol} className="flex justify-between py-2">
              <span className="font-semibold text-gray-800">{symbol}</span>
              <span className={totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SymbolPerformance;
