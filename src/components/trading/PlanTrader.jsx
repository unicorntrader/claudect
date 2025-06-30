import React, { useState, useEffect } from 'react';
import { calculateRiskReward } from '../../utils/calculations';

const PlanTrader = () => {
  const [ticker, setTicker] = useState('');
  const [direction, setDirection] = useState('LONG');
  const [entry, setEntry] = useState('');
  const [target, setTarget] = useState('');
  const [stop, setStop] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [rr, setRR] = useState(null);

  useEffect(() => {
    if (entry && stop && target) {
      const parsed = calculateRiskReward(parseFloat(entry), parseFloat(stop), parseFloat(target));
      setRR(parsed);
    } else {
      setRR(null);
    }
  }, [entry, stop, target]);

  const handleDirectionChange = (dir) => {
    setDirection(dir);
    if (quantity) {
      const val = Math.abs(parseInt(quantity));
      setQuantity(dir === 'LONG' ? val : -val);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const plan = {
      ticker,
      direction,
      entry: parseFloat(entry),
      stop: parseFloat(stop),
      target: parseFloat(target),
      quantity: parseInt(quantity),
      notes,
      ...rr
    };
    console.log('Plan saved:', plan);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      <form onSubmit={handleSubmit} className="flex-1 grid grid-cols-1 gap-4 max-w-lg">
        <h2 className="text-xl font-bold">Create New Trade Plan</h2>

        <input
          type="text"
          placeholder="Ticker Symbol"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="border p-2 rounded"
        />

        <div className="flex gap-2">
          <button
            type="button"
            className={`flex-1 p-2 rounded ${direction === 'LONG' ? 'bg-green-100 border-green-500 border font-semibold' : 'bg-gray-100'}`}
            onClick={() => handleDirectionChange('LONG')}
          >
            Long
          </button>
          <button
            type="button"
            className={`flex-1 p-2 rounded ${direction === 'SHORT' ? 'bg-red-100 border-red-500 border font-semibold' : 'bg-gray-100'}`}
            onClick={() => handleDirectionChange('SHORT')}
          >
            Short
          </button>
        </div>

        <input
          type="number"
          placeholder="Entry Price"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Target Price"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Stop Loss"
          value={stop}
          onChange={(e) => setStop(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Quantity (e.g. 1000 or -1000)"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Trade rationale, setup details, etc."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border p-2 rounded h-24"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
        >
          <span>➕</span> Add Trade Plan
        </button>
      </form>

      <div className="flex-1 p-4 border rounded bg-gray-50 max-w-sm">
        <h3 className="text-md font-semibold mb-2">Risk/Reward Analysis</h3>
        <p>Risk per share: ${rr?.risk ?? 0}</p>
        <p>Reward per share: ${rr?.reward ?? 0}</p>
        <p className="text-sm font-bold text-red-600 mt-2">
          Risk/Reward Ratio: {rr?.ratio ?? '0:0'}
        </p>
      </div>
    </div>
  );
};

export default PlanTrader;
