import React, { useState } from 'react';
import { setData, getData } from '../../utils/sharedState';

const PlanTrader = () => {
  const [form, setForm] = useState({
    ticker: '',
    direction: 'LONG',
    entry: '',
    target: '',
    stop: '',
    quantity: '',
    notes: ''
  });

  const [plans, setPlans] = useState(getData('plans') || []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const calculateRR = () => {
    const entry = parseFloat(form.entry);
    const stop = parseFloat(form.stop);
    const target = parseFloat(form.target);

    const risk = Math.abs(entry - stop) || 0;
    const reward = Math.abs(target - entry) || 0;
    const ratio = risk === 0 ? '1:0' : `${(reward / risk).toFixed(2)}:1`;

    return { risk, reward, ratio };
  };

  const { risk, reward, ratio } = calculateRR();

  const addPlan = () => {
    const newPlan = { ...form };
    const updated = [...plans, newPlan];
    setPlans(updated);
    setData('plans', updated);
    setForm({ ticker: '', direction: 'LONG', entry: '', target: '', stop: '', quantity: '', notes: '' });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Create New Trade Plan</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <input name="ticker" placeholder="Ticker Symbol" className="w-full mb-2 border p-2" value={form.ticker} onChange={handleChange} />
          <div className="flex gap-2 mb-2">
            <button onClick={() => setForm({ ...form, direction: 'LONG' })} className={`px-4 py-2 rounded ${form.direction === 'LONG' ? 'bg-green-200' : 'bg-gray-200'}`}>Long</button>
            <button onClick={() => setForm({ ...form, direction: 'SHORT' })} className={`px-4 py-2 rounded ${form.direction === 'SHORT' ? 'bg-red-200' : 'bg-gray-200'}`}>Short</button>
          </div>
          <input name="entry" placeholder="Entry Price" className="w-full mb-2 border p-2" value={form.entry} onChange={handleChange} />
          <input name="target" placeholder="Target Price" className="w-full mb-2 border p-2" value={form.target} onChange={handleChange} />
          <input name="stop" placeholder="Stop Loss" className="w-full mb-2 border p-2" value={form.stop} onChange={handleChange} />
          <input name="quantity" placeholder="Quantity (1000 or -1000)" className="w-full mb-2 border p-2" value={form.quantity} onChange={handleChange} />
        </div>

        <div className="bg-gray-50 p-4 rounded border">
          <h4 className="font-semibold mb-2">Risk/Reward Analysis</h4>
          <p>Risk per share: ${risk}</p>
          <p>Reward per share: ${reward}</p>
          <p className="font-bold text-red-500">Risk/Reward Ratio: {ratio}</p>
          <textarea
            name="notes"
            placeholder="Trade rationale, setup details, etc."
            className="w-full mt-4 border p-2"
            rows={4}
            value={form.notes}
            onChange={handleChange}
          />
          <button onClick={addPlan} className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            ➕ Add Trade Plan
          </button>
        </div>
      </div>

      <div className="my-10">
        <h3 className="text-lg font-semibold mb-2">Trading Chart</h3>
        <div className="bg-white border p-10 text-center text-gray-500">
          <p>TradingView Advanced Charting</p>
          <p className="text-blue-500">Currently viewing: {form.ticker || 'N/A'}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Active Trade Plans</h3>
        {plans.map((p, i) => (
          <div key={i} className="mb-4 border p-4 bg-white rounded shadow-sm">
            <p className="font-bold">
              {p.ticker} <span className="uppercase text-green-600">{p.direction}</span> <span className="text-gray-500">planned</span>
            </p>
            <p>Entry: ${p.entry} | Target: ${p.target} | Stop: ${p.stop} | R/R: {calculateRR().ratio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanTrader;
