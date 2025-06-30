import React, { useState } from 'react';

const PlanTrader = () => {
  const [ticker, setTicker] = useState('');
  const [entry, setEntry] = useState('');
  const [stop, setStop] = useState('');
  const [target, setTarget] = useState('');
  const [size, setSize] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const plan = {
      ticker,
      entry,
      stop,
      target,
      size
    };
    console.log('Trade Plan Submitted:', plan);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Plan Trader</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-md">
        <input
          type="text"
          placeholder="Ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Entry Price"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
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
          placeholder="Target Price"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Position Size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Submit Plan
        </button>
      </form>
    </div>
  );
};

export default PlanTrader;
