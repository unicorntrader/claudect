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
    <div style={{ padding: '20px', background: '#f4f4f4' }}>
      <h2>Plan Trader</h2>
      <div style={{ marginBottom: '20px' }}>
        <label>Ticker:</label>
        <input
          type="text"
          value={newPlan.ticker}
          onChange={(e) => setNewPlan({ ...newPlan, ticker: e.target.value })}
        /><br/>
        <label>Entry:</label>
        <input
          type="number"
          value={newPlan.entry}
          onChange={(e) => setNewPlan({ ...newPlan, entry: e.target.value })}
        /><br/>
        <label>Target:</label>
        <input
          type="number"
          value={newPlan.target}
          onChange={(e) => setNewPlan({ ...newPlan, target: e.target.value })}
        /><br/>
        <label>Stop Loss:</label>
        <input
          type="number"
          value={newPlan.stopLoss}
          onChange={(e) => setNewPlan({ ...newPlan, stopLoss: e.target.value })}
        /><br/>
        <button onClick={addTradePlan}>Add Plan</button>
      </div>

      <h3>Planned Trades</h3>
      <ul>
        {tradePlans.map((plan) => (
          <li key={plan.id}>
            <strong>{plan.ticker}</strong> — Entry: {plan.entry} | Target: {plan.target} | SL: {plan.stopLoss}
            <button onClick={() => executeTradePlan(plan.id)}>Execute</button>
            <button onClick={() => deleteTradePlan(plan.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlanTrader;
