// components/trading/PlanTrader.jsx
import React from 'react';
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
}) => {
  /* ------------------------------------------------------------------ */
  /* ADD / DELETE / EXECUTE FUNCTIONS                                   */
  /* ------------------------------------------------------------------ */
  const addTradePlan = () => {
    if (
      newPlan.ticker &&
      newPlan.entry &&
      newPlan.target &&
      newPlan.stopLoss
    ) {
      const plan = {
        id: Date.now(),
        ...newPlan,
        timestamp: new Date().toISOString(),
        status: 'planned',
      };
      setTradePlans([...tradePlans, plan]);
      setNewPlan({
        ticker: '',
        entry: '',
        target: '',
        stopLoss: '',
        position: 'long',
        quantity: '',
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

  /* ------------------------------------------------------------------ */
  /* RISK / REWARD PREVIEW                                              */
  /* ------------------------------------------------------------------ */
  const riskReward = calculateRiskReward(
    newPlan.entry,
    newPlan.target,
    newPlan.stopLoss,
    newPlan.position
  );

  /* ------------------------------------------------------------------ */
  /* RENDER                                                             */
  /* ------------------------------------------------------------------ */
  return (
    <div className="space-y-6">
      {/* ---------- CREATE NEW TRADE PLAN ---------- */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Create New Trade Plan</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-4">
            {/* Ticker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ticker Symbol
              </label>
              <input
                type="text"
                value={newPlan.ticker}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, ticker: e.target.value.toUpperCase() })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="AAPL"
              />
            </div>

            {/* Direction Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Direction
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    newPlan.position === 'long'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() =>
                    setNewPlan({
                      ...newPlan,
                      position: 'long',
                      quantity: Math.abs(Number(newPlan.quantity) || 0),
                    })
                  }
                >
                  Long
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    newPlan.position === 'short'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() =>
                    setNewPlan({
                      ...newPlan,
                      position: 'short',
                      quantity: -Math.abs(Number(newPlan.quantity) || 0),
                    })
                  }
                >
                  Short
                </button>
              </div>
            </div>

            {/* Entry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entry Price
              </label>
              <input
                type="number"
                value={newPlan.entry}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, entry: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="150.00"
                step="0.01"
              />
            </div>

            {/* Target */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Price
              </label>
              <input
                type="number"
                value={newPlan.target}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, target: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="155.00"
                step="0.01"
              />
            </div>

            {/* Stop */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stop Loss
              </label>
              <input
                type="number"
                value={newPlan.stopLoss}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, stopLoss: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="145.00"
                step="0.01"
              />
            </div>

            {/* Quantity (sign-aware) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={newPlan.quantity}
                onChange={(e) => {
                  const qtyRaw = e.target.value;
                  const qty =
                    qtyRaw === '' ? '' : Number(qtyRaw); // keep empty when field cleared
                  setNewPlan({
                    ...newPlan,
                    quantity: qty,
                    position: qty >= 0 ? 'long' : 'short',
                  });
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1000 or -1000"
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            {/* Risk / Reward Box */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">
                Risk/Reward Analysis
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Risk per share:</span>
                  <span className="font-medium">${riskReward.risk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Reward per share:
                  </span>
                  <span className="font-medium">${riskReward.reward}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm text-gray-600">
                    Risk/Reward Ratio:
                  </span>
                  <span
                    className={`font-bold ${
                      riskReward.ratio >= 2
                        ? 'text-green-600'
                        : riskReward.ratio >= 1
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    1:{riskReward.ratio}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={newPlan.notes}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, notes: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder="Trade rationale, setup details, etc."
              />
            </div>

            {/* Add Button */}
            <button
              onClick={addTradePlan}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Trade Plan
            </button>
          </div>
        </div>
      </div>

      {/* ---------- TRADING CHART PLACEHOLDER ---------- */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Trading Chart</h3>
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <LineChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            TradingView Advanced Charting
          </p>
          <p className="text-sm text-gray-500">
            Chart integration would be implemented here using TradingView&apos;s
            widget API
          </p>
          {newPlan.ticker && (
            <p className="text-sm font-medium text-blue-600 mt-2">
              Currently viewing: {newPlan.ticker}
            </p>
          )}
        </div>
      </div>

      {/* ---------- ACTIVE TRADE PLANS ---------- */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Active Trade Plans</h3>
        <div className="space-y-3">
          {tradePlans.map((plan) => (
            <div
              key={plan.id}
              className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                highlightedItem === plan.id
                  ? 'bg-blue-100 border border-blue-300'
                  : plan.status === 'executed'
                  ? 'bg-gray-100 opacity-75'
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-lg">{plan.ticker}</span>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      plan.position === 'long'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {plan.position.toUpperCase()}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      plan.status === 'executed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {plan.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Entry: ${plan.entry} | Target: ${plan.target} | Stop: $
                  {plan.stopLoss} | R/R: 1:
                  {
                    calculateRiskReward(
                      plan.entry,
                      plan.target,
                      plan.stopLoss,
                      plan.position
                    ).ratio
                  }
                </div>
              </div>
              <div className="flex space-x-2">
                {plan.status === 'planned' && (
                  <button
                    onClick={() => executeTradePlan(plan.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    Execute
                  </button>
                )}
                <button
                  onClick={() => deleteTradePlan(plan.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {tradePlans.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No trade plans yet. Create your first plan above!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanTrader;
