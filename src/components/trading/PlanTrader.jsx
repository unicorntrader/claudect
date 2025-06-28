// components/trading/PlanTrader.jsx
import React, { useEffect } from 'react';
import { PlusCircle, LineChart, Trash2 } from 'lucide-react';
import { calculateRiskReward } from '../../utils/calculations';

const PlanTrader = ({
  tradePlans,
  setTradePlans,
  trades,
  setTrades,
  newPlan,
  setNewPlan,
  highlightedItem,
  editPlanId,
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
        status: newPlan.status || 'planned',
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
        notes: '',
      });
    }
  };

  const deleteTradePlan = (id) =>
    setTradePlans(tradePlans.filter((p) => p.id !== id));

  const executeTradePlan = (planId) => {
    const plan = tradePlans.find((p) => p.id === planId);
    if (plan) {
      const trade = {
        id: Date.now(),
        ...plan,
        executeTime: new Date().toISOString(),
        status: 'executed',
      };
      setTrades([...trades, trade]);
      setTradePlans(
        tradePlans.map((p) =>
          p.id === planId ? { ...p, status: 'executed' } : p
        )
      );
    }
  };

  const riskReward = calculateRiskReward(
    newPlan.entry,
    newPlan.target,
    newPlan.stopLoss,
    newPlan.position
  );

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="p-2 border rounded"
          placeholder="Ticker"
          value={newPlan.ticker}
          onChange={(e) => setNewPlan({ ...newPlan, ticker: e.target.value })}
        />
        <input
          className="p-2 border rounded"
          placeholder="Entry"
          value={newPlan.entry}
          onChange={(e) => setNewPlan({ ...newPlan, entry: e.target.value })}
        />
        <input
          className="p-2 border rounded"
          placeholder="Target"
          value={newPlan.target}
          onChange={(e) => setNewPlan({ ...newPlan, target: e.target.value })}
        />
        <input
          className="p-2 border rounded"
          placeholder="Stop Loss"
          value={newPlan.stopLoss}
          onChange={(e) => setNewPlan({ ...newPlan, stopLoss: e.target.value })}
        />
        <input
          className="p-2 border rounded"
          placeholder="Quantity"
          value={newPlan.quantity}
          onChange={(e) => setNewPlan({ ...newPlan, quantity: e.target.value })}
        />
        <select
          className="p-2 border rounded"
          value={newPlan.position}
          onChange={(e) => setNewPlan({ ...newPlan, position: e.target.value })}
        >
          <option value="long">Long</option>
          <option value="short">Short</option>
        </select>
        <select
          className="p-2 border rounded"
          value={newPlan.strategy}
          onChange={(e) => setNewPlan({ ...newPlan, strategy: e.target.value })}
        >
          <option value="">Select Strategy</option>
          <option value="Breakout">Breakout</option>
          <option value="Mean Reversion">Mean Reversion</option>
          <option value="Opening Range">Opening Range</option>
          <option value="Double Top/Bottom">Double Top/Bottom</option>
        </select>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={newPlan.autoWatch}
            onChange={(e) => setNewPlan({ ...newPlan, autoWatch: e.target.checked })}
          />
          <span>Enable Smart Watch</span>
        </label>
        <textarea
          className="p-2 border rounded col-span-2"
          placeholder="Notes"
          value={newPlan.notes}
          onChange={(e) => setNewPlan({ ...newPlan, notes: e.target.value })}
        />
      </div>

      <div className="flex items-center space-x-4">
        <button
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={addTradePlan}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          {editPlanId ? 'Update Plan' : 'Add Plan'}
        </button>
        <div className="text-sm text-gray-600">
          Risk/Reward Ratio: <strong>{riskReward.ratio}</strong>
        </div>
      </div>

      <div className="border-t pt-4 space-y-2">
        {tradePlans.length === 0 ? (
          <div className="text-sm text-gray-500">No trade plans yet.</div>
        ) : (
          tradePlans.map(plan => (
            <div
              key={plan.id}
              className={`p-3 border rounded flex justify-between items-center ${
                plan.status === 'executed' ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              <div>
                <div className="font-semibold">{plan.ticker} ({plan.position})</div>
                <div className="text-sm text-gray-600">
                  Entry: {plan.entry}, Target: {plan.target}, Stop: {plan.stopLoss}, Qty: {plan.quantity}
                </div>
                <div className="text-sm text-gray-500">
                  Strategy: {plan.strategy || '—'} | R/R: {calculateRiskReward(plan.entry, plan.target, plan.stopLoss, plan.position).ratio}
                </div>
                {plan.autoWatch && (
                  <div className="text-xs text-yellow-700 mt-1">📡 Smart Watch Active</div>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => executeTradePlan(plan.id)}
                  className="p-1 rounded bg-green-100 hover:bg-green-200"
                  title="Mark as Executed"
                >
                  <LineChart className="w-4 h-4 text-green-700" />
                </button>
                <button
                  onClick={() => deleteTradePlan(plan.id)}
                  className="p-1 rounded bg-red-100 hover:bg-red-200"
                  title="Delete Plan"
                >
                  <Trash2 className="w-4 h-4 text-red-700" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlanTrader;
