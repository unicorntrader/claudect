// components/trading/PlanTrader.jsx
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
    <div style={{ padding: '20px' }}>
      <h2>Plan Your Trade</h2>
      <div style={{ marginBottom: '20px' }}>
        <input placeholder="Ticker" value={newPlan.ticker} onChange={(e) => setNewPlan({ ...newPlan, ticker: e.target.value })} />
        <input placeholder="Entry" value={newPlan.entry} onChange={(e) => setNewPlan({ ...newPlan, entry: e.target.value })} />
        <input placeholder="Target" value={newPlan.target} onChange={(e) => setNewPlan({ ...newPlan, target: e.target.value })} />
        <input placeholder="Stop Loss" value={newPlan.stopLoss} onChange={(e) => setNewPlan({ ...newPlan, stopLoss: e.target.value })} />
        <input placeholder="Quantity" value={newPlan.quantity} onChange={(e) => setNewPlan({ ...newPlan, quantity: e.target.value })} />
        <input placeholder="Strategy" value={newPlan.strategy} onChange={(e) => setNewPlan({ ...newPlan, strategy: e.target.value })} />
        <label>
          Auto Watch:
          <input type="checkbox" checked={newPlan.autoWatch} onChange={(e) => setNewPlan({ ...newPlan, autoWatch: e.target.checked })} />
        </label>
        <textarea placeholder="Notes" value={newPlan.notes} onChange={(e) => setNewPlan({ ...newPlan, notes: e.target.value })}></textarea>
        <button onClick={addTradePlan}>Add / Save Plan</button>
      </div>

      <h3>Trade Plans</h3>
      <ul>
        {tradePlans.map((plan) => (
          <li key={plan.id}>
            <strong>{plan.ticker}</strong> - Entry: {plan.entry}, Target: {plan.target}, Stop: {plan.stopLoss}
            <button onClick={() => executeTradePlan(plan.id)}>Execute</button>
            <button onClick={() => deleteTradePlan(plan.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <p>Risk/Reward: {riskReward}</p>
    </div>
  );
};

export default PlanTrader;
