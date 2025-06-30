// File: src/components/trading/PlanTrader.jsx

import React, { useState } from 'react';

const PlanTrader = () => {
  const [ticker, setTicker] = useState('');
  const [direction, setDirection] = useState('LONG');
  const [entry, setEntry] = useState('');
  const [target, setTarget] = useState('');
  const [stop, setStop] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [strategy, setStrategy] = useState('');
  const [smartWatch, setSmartWatch] = useState(false);
  const [plans, setPlans] = useState([]);

  const handleAddPlan = () => {
    const newPlan = {
      ticker,
      direction,
      entry,
      target,
      stop,
      quantity,
      notes,
      strategy,
      smartWatch,
    };
    setPlans([...plans, newPlan]);

    // Reset
    setTicker('');
    setDirection('LONG');
    setEntry('');
    setTarget('');
    setStop('');
    setQuantity('');
    setNotes('');
    setStrategy('');
    setSmartWatch(false);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Plan Your Trade</h2>

      {/* Top input section */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="border rounded px-4 py-2 w-full text-sm"
        />
        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          className="border rounded px-4 py-2 w-full text-sm"
        >
          <option value="LONG">Long</option>
          <option value="SHORT">Short</option>
        </select>
        <input
          type="number"
          placeholder="Entry"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          className="border rounded px-4 py-2 w-full text-sm"
        />
        <input
          type="number"
          placeholder="Target"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="border rounded px-4 py-2 w-full text-sm"
        />
        <input
          type="number"
          placeholder="Stop"
          value={stop}
          onChange={(e) => setStop(e.target.value)}
          className="border rounded px-4 py-2 w-full text-sm"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border rounded px-4 py-2 w-full text-sm"
        />
        <input
          type="text"
          placeholder="Strategy (e.g., Breakout)"
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
          className="border rounded px-4 py-2 w-full text-sm"
        />
        <label className="flex items-center gap-2 text-sm col-span-2 md:col-span-1">
          <input
            type="checkbox"
            checked={smartWatch}
            onChange={(e) => setSmartWatch(e.target.checked)}
          />
          Enable Smart Watch
        </label>
        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="col-span-2 border rounded px-4 py-2 w-full text-sm"
          rows={3}
        />
      </div>

      {/* Add button */}
      <div>
        <button
          onClick={handleAddPlan}
          className="bg-black text-white px-5 py-2 rounded shadow hover:bg-gray-800 transition"
        >
          Add Trade Plan
        </button>
      </div>

      {/* Placeholder for chart */}
      <div className="bg-gray-100 border rounded p-4 text-center text-gray-500">
        TradingView Chart Placeholder
      </div>

      {/* Active plans */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Active Plans</h3>
        <div className="space-y-3">
          {plans.map((plan, idx) => (
            <div key={idx} className="border rounded p-4 bg-white shadow-sm">
              <div className="flex justify-between font-medium">
                <span>{plan.ticker} ({plan.direction})</span>
                <span>Qty: {plan.quantity}</span>
              </div>
              <div className="text-sm text-gray-700 mt-1">
                Entry: {plan.entry} | Target: {plan.target} | Stop: {plan.stop}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Strategy: {plan.strategy} | Smart Watch: {plan.smartWatch ? 'ON' : 'OFF'}
              </div>
              {plan.notes && (
                <div className="mt-2 text-sm italic text-gray-500">{plan.notes}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanTrader;
