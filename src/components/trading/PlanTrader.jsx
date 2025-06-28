// src/components/trading/PlanTrader.jsx
import React, { useEffect } from 'react';
import { calculateRiskReward } from '../../utils/calculations';

const PlanTrader = ({
  tradePlans,
  setTradePlans,
  trades,
  setTrades,
  newPlan,
  setNewPlan,
  highlightedItem,
  editPlanId
}) => {
  useEffect(() => {
    if (editPlanId) {
      const planToEdit = tradePlans.find(p => p.id === editPlanId);
      if (planToEdit) setNewPlan(planToEdit);
    }
  }, [editPlanId, tradePlans]);

  const addTradePlan = () => {
    if (newPlan.ticker && newPlan.entry && newPlan.target && newPlan.stopLoss) {
      const existingIndex = tradePlans.findIndex(p => p.id === newPlan.id);
      const updatedPlan = {
        ...newPlan,
        timestamp: newPlan.timestamp || new Date().toISOString(),
        status: newPlan.status || 'planned'
      };

      let updatedPlans;
      if (existingIndex !== -1) {
        updatedPlans = [...tradePlans];
        updatedPlans[existingIndex] = updatedPlan;
      } else {
        updatedPlan.id = Date.now();
        updatedPlans = [...tradePlans, updatedPlan];
      }

      setTradePlans(updatedPlans);
      setNewPlan({
        ticker: '',
        entry: '',
        target: '',
        stopLoss: '',
        position: 'long',
        quantity: '',
        strategy: '',
        autoWatch: false,
        notes: ''
      });
    }
  };

  const riskReward = calculateRiskReward(
    newPlan.entry,
    newPlan.target,
    newPlan.stopLoss,
    newPlan.position
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Create New Trade Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Ticker Symbol"
          value={newPlan.ticker}
          onChange={(e) => setNewPlan({ ...newPlan, ticker: e.target.value })}
          className="border p-2 rounded"
        />

        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded ${newPlan.position === 'long' ? 'bg-green-200' : 'bg-gray-200'}`}
            onClick={() => setNewPlan({ ...newPlan, position: 'long' })}
          >
            Long
          </button>
          <button
            className={`px-4 py-2 rounded ${newPlan.position === 'short' ? 'bg-red-200' : 'bg-gray-200'}`}
            onClick={() => setNewPlan({ ...newPlan, position: 'short' })}
          >
            Short
          </button>
        </div>

        <input
          type="number"
          placeholder="Entry Price"
          value={newPlan.entry}
          onChange={(e) => setNewPlan({ ...newPlan, entry: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Target Price"
          value={newPlan.target}
          onChange={(e) => setNewPlan({ ...newPlan, target: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Stop Loss"
          value={newPlan.stopLoss}
          onChange={(e) => setNewPlan({ ...newPlan, stopLoss: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Quantity (e.g. 1000 or -1000)"
          value={newPlan.quantity}
          onChange={(e) => setNewPlan({ ...newPlan, quantity: e.target.value })}
          className="border p-2 rounded"
        />

        <select
          value={newPlan.strategy}
          onChange={(e) => setNewPlan({ ...newPlan, strategy: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Select Strategy</option>
          <option value="Breakout">Breakout</option>
          <option value="Reversal">Reversal</option>
          <option value="Momentum">Momentum</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={newPlan.autoWatch}
            onChange={(e) => setNewPlan({ ...newPlan, autoWatch: e.target.checked })}
          />
          Enable Smart Watch
        </label>
      </div>

      <div className="mt-4">
        <textarea
          placeholder="Notes"
          value={newPlan.notes}
          onChange={(e) => setNewPlan({ ...newPlan, notes: e.target.value })}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Risk/Reward Ratio: <strong>{riskReward}</strong>
        </div>
        <button
          onClick={addTradePlan}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          + Add Trade Plan
        </button>
      </div>
    </div>
  );
};

export default PlanTrader;
