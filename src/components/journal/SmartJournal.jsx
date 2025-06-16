import React, { useState } from 'react';
import { ChevronDown, ChevronRight, X } from 'lucide-react';

const mockTrades = [
  {
    id: "T001",
    date: "2025-06-15",
    symbol: "AAPL",
    strategy: "Breakout",
    tags: ["Gap Up", "Volume Spike"],
    outcome: "Win",
    rr: 2.5,
    adherence: 88.5,
    plan: { entry: 175, stop: 170, target: 185, size: 10 },
    exec: { entry: 176, exit: 184, size: 10 },
  },
  {
    id: "T002",
    date: "2025-06-14",
    symbol: "TSLA",
    strategy: "Mean Reversion",
    tags: ["Oversold"],
    outcome: "Loss",
    rr: 1.2,
    adherence: 61,
    plan: { entry: 210, stop: 200, target: 230, size: 8 },
    exec: { entry: 211, exit: 201, size: 8 },
  },
];

const SmartJournal = () => {
  const [selectedTrade, setSelectedTrade] = useState(null);

  const renderOutcome = (outcome) => (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${outcome === 'Win' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{outcome}</span>
  );

  const renderAdherence = (score) => (
    <span className={`text-sm font-semibold ${score >= 75 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{score}%</span>
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Smart Journal</h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Symbol</th>
              <th className="px-4 py-2 text-left">Strategy / Tags</th>
              <th className="px-4 py-2 text-left">R/R</th>
              <th className="px-4 py-2 text-left">Outcome</th>
              <th className="px-4 py-2 text-left">Adh.</th>
              <th className="px-4 py-2 text-left">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {mockTrades.map((t) => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap">{t.date}</td>
                <td className="px-4 py-2 font-medium">{t.symbol}</td>
                <td className="px-4 py-2">
                  <span className="font-semibold mr-1">{t.strategy}</span>
                  <span className="text-xs text-gray-500">{t.tags?.join(', ')}</span>
                </td>
                <td className="px-4 py-2">{t.rr}</td>
                <td className="px-4 py-2">{renderOutcome(t.outcome)}</td>
                <td className="px-4 py-2">{renderAdherence(t.adherence)}</td>
                <td className="px-2 py-2 text-right">
                  <button onClick={() => setSelectedTrade(t)} className="text-blue-600 hover:text-blue-800 flex items-center">
                    {selectedTrade?.id === t.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTrade && (
        <div className="bg-white rounded-lg shadow p-6 relative">
          <button className="absolute top-3 right-3" onClick={() => setSelectedTrade(null)}>
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>

          <h2 className="text-lg font-semibold mb-4">Plan vs Reality &mdash; {selectedTrade.symbol}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><p className="text-gray-500">Planned Entry</p><p>{selectedTrade.plan?.entry ?? '-'}</p></div>
            <div><p className="text-gray-500">Actual Entry</p><p>{selectedTrade.exec?.entry ?? '-'}</p></div>
            <div><p className="text-gray-500">Planned Stop</p><p>{selectedTrade.plan?.stop ?? '-'}</p></div>
            <div><p className="text-gray-500">Actual Stop</p><p>{selectedTrade.exec?.stop ?? '-'}</p></div>
            <div><p className="text-gray-500">Planned Target</p><p>{selectedTrade.plan?.target ?? '-'}</p></div>
            <div><p className="text-gray-500">Actual Exit</p><p>{selectedTrade.exec?.exit ?? '-'}</p></div>
            <div><p className="text-gray-500">Planned Size</p><p>{selectedTrade.plan?.size ?? '-'}</p></div>
            <div><p className="text-gray-500">Filled Size</p><p>{selectedTrade.exec?.size ?? '-'}</p></div>
          </div>

          <div className="mt-6 text-right">
            <button onClick={() => setSelectedTrade(null)} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartJournal;
