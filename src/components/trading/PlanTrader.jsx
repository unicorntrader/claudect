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
      const existingIndex = tradePlans.findIndex((p) => p.id === newPlan.id);
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

  const deleteTradePlan = (id) => {
    setTradePlans(tradePlans.filter((p) => p.id !== id));
  };

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
        <input
          placeholder="Ticker"
          value={newPlan.ticker}
          onChange={(e) => setNewPlan({ ...newPlan, ticker: e.target.value })}
        />
        <input
          placeholder="Entry"
          type="number"
          value={newPlan.entry}
          onChange={(e) => setNewPlan({ ...newPlan, entry: parseFloat(e.target.value) })}
        />
        <input
          placeholder="Target"
          type="number"
          value={newPlan.target}
          onChange={(e) => setNewPlan({ ...newPlan, target: parseFloat(e.target.value) })}
        />
        <input
          placeholder="Stop Loss"
          type="number"
          value={newPlan.stopLoss}
          onChange={(e) => setNewPlan({ ...newPlan, stopLoss: parseFloat(e.target.value) })}
        />
        <input
          placeholder="Quantity"
          type="number"
          value={newPlan.quantity}
          onChange={(e) => setNewPlan({ ...newPlan, quantity: parseInt(e.target.value) })}
        />
        <select
          value={newPlan.position}
          onChange={(e) => setNewPlan({ ...newPlan, position: e.target.value })}
        >
          <option value="long">Long</option>
          <option value="short">Short</option>
        </select>
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
            onChange={(e) => setNewPlan({ ...newPlan, autoWatch: e.target.checked })}
          />
          Smart Watch
        </label>
        <textarea
          placeholder="Notes"
          value={newPlan.notes}
          onChange={(e) => setNewPlan({ ...newPlan, notes: e.target.value })}
        />
        <button onClick={addTradePlan}>Save Plan</button>
        {riskReward && (
          <p>Risk/Reward: {riskReward.toFixed(2)}</p>
        )}
      </div>

      <h3>Planned Trades</h3>
      <ul>
        {tradePlans.map((plan) => (
          <li key={plan.id} style={{ marginBottom: '10px' }}>
            {plan.ticker} ({plan.position}) — Entry: {plan.entry} / Target: {plan.target} / SL: {plan.stopLoss} <br />
            Strategy: {plan.strategy || 'N/A'} | Smart Watch: {plan.autoWatch ? 'ON' : 'OFF'}
            <div>
              <button onClick={() => setNewPlan(plan)}>Edit</button>
              <button onClick={() => deleteTradePlan(plan.id)}>Delete</button>
              <button onClick={() => executeTradePlan(plan.id)}>Execute</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlanTrader;
