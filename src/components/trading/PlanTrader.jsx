// src/components/trading/PlanTrader.jsx
import React, { useEffect } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
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
    setTradePlans(tradePlans.filter((plan) => plan.id !== id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <h2>New Trade Plan</h2>
        <input
          placeholder="Ticker"
          value={newPlan.ticker}
          onChange={(e) => setNewPlan({ ...newPlan, ticker: e.target.value })}
        />
        <input
          placeholder="Entry"
          value={newPlan.entry}
          onChange={(e) => setNewPlan({ ...newPlan, entry: e.target.value })}
        />
        <input
          placeholder="Target"
          value={newPlan.target}
          onChange={(e) => setNewPlan({ ...newPlan, target: e.target.value })}
        />
        <input
          placeholder="Stop Loss"
          value={newPlan.stopLoss}
          onChange={(e) => setNewPlan({ ...newPlan, stopLoss: e.target.value })}
        />
        <input
          placeholder="Quantity"
          value={newPlan.quantity}
          onChange={(e) => setNewPlan({ ...newPlan, quantity: e.target.value })}
        />
        <input
          placeholder="Strategy"
          value={newPlan.strategy}
          onChange={(e) => setNewPlan({ ...newPlan, strategy: e.target.value })}
        />
        <label>
          <input
            type="checkbox"
            checked={newPlan.autoWatch}
            onChange={(e) => setNewPlan({ ...newPlan, autoWatch: e.target.checked })}
          />
          Smart Watch
        </label>
        <textarea
          placeholder="Notes"
          value={newPlan.notes}
          onChange={(e) => setNewPlan({ ...newPlan, notes: e.target.value })}
        />
        <button onClick={addTradePlan}>
          <PlusCircle size={16} /> Save Plan
        </button>
      </div>

      <div>
        <h3>Saved Trade Plans</h3>
        {tradePlans.map((plan) => (
          <div
            key={plan.id}
            style={{
              border: '1px solid #ccc',
              padding: '0.5rem',
              marginBottom: '0.5rem',
              backgroundColor: highlightedItem === plan.id ? '#eef' : '#fff',
            }}
          >
            <div>
              <strong>{plan.ticker}</strong> ({plan.position}) – RR: {calculateRiskReward(plan)}
            </div>
            <div>Strategy: {plan.strategy}</div>
            <div>Watch: {plan.autoWatch ? 'Yes' : 'No'}</div>
            <button onClick={() => deleteTradePlan(plan.id)}>
              <Trash2 size={14} /> Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanTrader;
