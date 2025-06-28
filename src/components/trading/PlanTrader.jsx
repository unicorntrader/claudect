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

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={newPlan.quantity}
                onChange={(e) => {
                  const qtyRaw = e.target.value;
                  const qty = qtyRaw === '' ? '' : Number(qtyRaw);
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

            {/* Strategy */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Strategy
              </label>
              <select
                value={newPlan.strategy || ''}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, strategy: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a strategy</option>
                <option value="Breakout">Breakout</option>
                <option value="Reversal">Reversal</option>
                <option value="Momentum">Momentum</option>
                <option value="Gap Fill">Gap Fill</option>
                <option value="Mean Reversion">Mean Reversion</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Auto-Watch Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newPlan.autoWatch || false}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, autoWatch: e.target.checked })
                }
              />
              <label className="text-sm text-gray-700">
                🔔 Watch this stock for a similar trigger
              </label>
            </div>
          </div>

          {/* RIGHT COLUMN remains unchanged */}

        </div>
      </div>
    </div>
  );
};

export default PlanTrader;
