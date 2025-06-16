import React, { useState } from 'react';

const SmartJournal = () => {
  const [trades, setTrades] = useState([]);
  const [selectedTrade, setSelectedTrade] = useState(null);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Smart Journal</h1>
      <p className="text-gray-600 max-w-xl">
        This module allows you to tag, view, and analyze your trades with full plan-vs-reality breakdowns, adherence scoring, and performance insights.
      </p>

      {/* Table View */}
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b text-gray-700">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Ticker</th>
              <th className="px-4 py-2">Tags</th>
              <th className="px-4 py-2">R/R</th>
              <th className="px-4 py-2">Win/Loss</th>
              <th className="px-4 py-2">Adherence</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-6">
                  No trades logged yet. Import history or start planning trades.
                </td>
              </tr>
            ) : (
              trades.map((trade, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{trade.date}</td>
                  <td className="px-4 py-2 font-medium">{trade.ticker}</td>
                  <td className="px-4 py-2">{trade.tags?.join(', ')}</td>
                  <td className="px-4 py-2">{trade.rr}</td>
                  <td className="px-4 py-2">{trade.outcome}</td>
                  <td className="px-4 py-2">{trade.adherence}%</td>
                  <td className="px-4 py-2">
                    <button 
                      className="text-blue-600 hover:underline"
                      onClick={() => setSelectedTrade(trade)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Plan vs Reality Panel */}
      {selectedTrade && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Plan vs Reality</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Planned Entry</p>
              <p className="text-base">{selectedTrade.planEntry}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Actual Entry</p>
              <p className="text-base">{selectedTrade.actualEntry}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Planned Stop</p>
              <p className="text-base">{selectedTrade.planStop}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Actual Stop</p>
              <p className="text-base">{selectedTrade.actualStop}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Planned Target</p>
              <p className="text-base">{selectedTrade.planTarget}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Actual Target</p>
              <p className="text-base">{selectedTrade.actualTarget}</p>
            </div>
          </div>
          <div className="mt-6 text-right">
            <button 
              className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
              onClick={() => setSelectedTrade(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartJournal;
