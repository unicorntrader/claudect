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
    };
    setPlans([...plans, newPlan]);

    // Clear fields
    setTicker('');
    setDirection('LONG');
    setEntry('');
    setTarget('');
    setStop('');
    setQuantity('');
    setNotes('');
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Plan Trader</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="LONG">LONG</option>
          <option value="SHORT">SHORT</option>
        </select>
        <input
          type="number"
          placeholder="Entry"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Target"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Stop"
          value={stop}
          onChange={(e) => setStop(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="col-span-2 border p-2 rounded"
        />
      </div>

      <button
        onClick={handleAddPlan}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Plan
      </button>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Active Trade Plans</h3>
        {plans.map((plan, index) => (
          <div key={index} className="border p-4 mb-2 rounded shadow-sm">
            <strong>{plan.ticker}</strong> ({plan.direction}) — Entry: {plan.entry}, Target: {plan.target}, Stop: {plan.stop}, Qty: {plan.quantity}
            <div className="text-sm text-gray-600 mt-1">{plan.notes}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanTrader;
