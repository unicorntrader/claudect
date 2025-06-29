// components/trading/PlanTrader.jsx
import React, { useEffect } from 'react';

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
      const planToEdit = tradePlans.find((p) => p.id === editPlanId);
      if (planToEdit) setNewPlan(planToEdit);
    }
  }, [editPlanId, tradePlans]);

  const addTradePlan = () => {
    if (newPlan.ticker && newPlan.entry && newPlan.target && newPlan.stopLoss) {
      const updatedPlan = {
        ...newPlan,
        id: newPlan.id || Date.now(),
        timestamp: newPlan.timestamp || new Date().toISOString(),
        status: newPlan.status || 'planned',
      };

      const exists = tradePlans.some((p) => p.id === updatedPlan.id);
      const updatedPlans = exists
        ? tradePlans.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
        : [...tradePlans, updatedPlan];

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

  const deleteTradePlan = (id) => {
    setTradePlans(tradePlans.filter((p) => p.id !== id));
  };

  const executeTradePlan = (planId) => {
    const plan = tradePlans.find((p) => p.id === planId);
    if (plan) {
      const trade = {
        ...plan,
        id: Date.now(),
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

  return (
    <div style={{ padding: '30px' }}>
      <h2>Plan Trader</h2>
      <div style={{ marginBottom: '20px' }}>
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
          placeholder="Stop"
          value={newPlan.stopLoss}
          onChange={(e) => setNewPlan({ ...newPlan, stopLoss: e.target.value })}
        />
        <input
          placeholder="Qty"
          value={newPlan.quantity}
          onChange={(e) => setNewPlan({ ...newPlan, quantity: e.target.value })}
        />
        <select
          value={newPlan.strategy}
          onChange={(e) => setNewPlan({ ...newPlan, strategy: e.target.value })}
        >
          <option value="">Select Strategy</option>
          <option value="Breakout">Breakout</option>
          <option value="Mean Reversion">Mean Reversion</option>
          <option value="Momentum">Momentum</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={newPlan.autoWatch}
            onChange={(e) =>
              setNewPlan({ ...newPlan, autoWatch: e.target.checked })
            }
          />
          Smart Watch
        </label>
        <button onClick={addTradePlan}>Save Plan</button>
      </div>

      <div>
        {tradePlans.map((plan) => (
          <div key={plan.id} style={{ marginBottom: '10px' }}>
            <strong>{plan.ticker}</strong> | {plan.entry} → {plan.target} | SL: {plan.stopLoss}
            <span> | Strategy: {plan.strategy} | Smart Watch: {plan.autoWatch ? '✅' : '❌'}</span>
            <div>
              <button onClick={() => setNewPlan(plan)}>Edit</button>
              <button onClick={() => deleteTradePlan(plan.id)}>Delete</button>
              <button onClick={() => executeTradePlan(plan.id)}>Execute</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanTrader;
