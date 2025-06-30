// File: src/components/trading/PlanTrader.jsx

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getData, setData } from '@/utils/data';

const PlanTrader = () => {
  const [ticker, setTicker] = useState('');
  const [direction, setDirection] = useState('LONG');
  const [entry, setEntry] = useState('');
  const [target, setTarget] = useState('');
  const [stop, setStop] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [plans, setPlans] = useState(getData('tradePlans') || []);

  const handleAddPlan = () => {
    if (!ticker || !entry || !target || !stop || !quantity) return;

    const newPlan = {
      ticker: ticker.toUpperCase(),
      direction,
      entry: parseFloat(entry),
      target: parseFloat(target),
      stop: parseFloat(stop),
      quantity: parseInt(quantity),
      notes,
    };

    const updatedPlans = [...plans, newPlan];
    setPlans(updatedPlans);
    setData('tradePlans', updatedPlans);

    setTicker('');
    setDirection('LONG');
    setEntry('');
    setTarget('');
    setStop('');
    setQuantity('');
    setNotes('');
  };

  const calculateRR = () => {
    const e = parseFloat(entry);
    const t = parseFloat(target);
    const s = parseFloat(stop);
    if (isNaN(e) || isNaN(t) || isNaN(s)) return { risk: 0, reward: 0, ratio: '1:0' };

    const risk = Math.abs(e - s);
    const reward = Math.abs(t - e);
    const ratio = risk > 0 ? `${(reward / risk).toFixed(2)}:1` : '1:0';
    return { risk, reward, ratio };
  };

  const { risk, reward, ratio } = calculateRR();

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Create New Trade Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <input
            className="w-full border px-4 py-2 rounded"
            placeholder="Ticker Symbol"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
          />

          <div className="flex space-x-4">
            <button
              onClick={() => setDirection('LONG')}
              className={`px-4 py-2 rounded ${direction === 'LONG' ? 'bg-green-200' : 'bg-gray-100'}`}
            >
              Long
            </button>
            <button
              onClick={() => setDirection('SHORT')}
              className={`px-4 py-2 rounded ${direction === 'SHORT' ? 'bg-red-200' : 'bg-gray-100'}`}
            >
              Short
            </button>
          </div>

          <input
            type="number"
            className="w-full border px-4 py-2 rounded"
            placeholder="Entry Price"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
          />
          <input
            type="number"
            className="w-full border px-4 py-2 rounded"
            placeholder="Target Price"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
          <input
            type="number"
            className="w-full border px-4 py-2 rounded"
            placeholder="Stop Loss"
            value={stop}
            onChange={(e) => setStop(e.target.value)}
          />
          <input
            type="number"
            className="w-full border px-4 py-2 rounded"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 border p-4 rounded">
            <h3 className="font-semibold mb-2">Risk/Reward Analysis</h3>
            <p>Risk per share: <strong>${risk}</strong></p>
            <p>Reward per share: <strong>${reward}</strong></p>
            <p>Risk/Reward Ratio: <strong className="text-red-600">{ratio}</strong></p>
          </div>
          <textarea
            className="w-full border px-4 py-2 rounded"
            placeholder="Trade rationale, setup details, etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button onClick={handleAddPlan} className="w-full">
            ➕ Add Trade Plan
          </Button>
        </div>
      </div>

      <div className="mt-10 border p-4 rounded text-center text-gray-500">
        <h3 className="font-semibold mb-1">Trading Chart</h3>
        <p>Chart integration would be implemented here using TradingView’s widget API</p>
        {ticker && <p className="text-sm text-blue-600 mt-1">Currently viewing: {ticker.toUpperCase()}</p>}
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-3">Active Trade Plans</h3>
        {plans.map((plan, index) => (
          <div key={index} className="flex justify-between items-center border-b py-2">
            <div>
              <strong>{plan.ticker}</strong> &nbsp;
              <span className="text-green-600">{plan.direction}</span> &nbsp;
              <span className="text-gray-500">planned</span>
              <div className="text-sm text-gray-600">
                Entry: ${plan.entry.toFixed(2)} | Target: ${plan.target.toFixed(2)} | Stop: ${plan.stop.toFixed(2)} | R/R: {(Math.abs(plan.target - plan.entry) / Math.abs(plan.entry - plan.stop)).toFixed(2)}:1
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-green-500 text-white rounded text-sm">Execute</button>
              <button
                onClick={() => {
                  const updated = plans.filter((_, i) => i !== index);
                  setPlans(updated);
                  setData('tradePlans', updated);
                }}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanTrader;
