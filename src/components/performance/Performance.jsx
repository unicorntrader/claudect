// components/performance/Performance.jsx
import React from 'react';
import { DollarSign, Target, TrendingUp, Activity } from 'lucide-react';

const Performance = ({ trades }) => {
  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.outcome === 'win').length;
  const losingTrades = trades.filter(t => t.outcome === 'loss').length;
  const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : 0;

  const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const avgWin = winningTrades > 0 ? trades.filter(t => t.outcome === 'win').reduce((sum, t) => sum + t.pnl, 0) / winningTrades : 0;
  const avgLoss = losingTrades > 0 ? Math.abs(trades.filter(t => t.outcome === 'loss').reduce((sum, t) => sum + t.pnl, 0) / losingTrades) : 0;
  const profitFactor = avgLoss > 0 ? (avgWin / avgLoss).toFixed(2) : '0.00';

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total P&L" value={`${totalPnL >= 0 ? '+' : ''}$${totalPnL.toFixed(2)}`} icon={<DollarSign />} highlight={totalPnL >= 0 ? 'green' : 'red'} />
        <MetricCard title="Win Rate" value={`${winRate}%`} sub={`${winningTrades}W/${losingTrades}L`} icon={<Target />} highlight="blue" />
        <MetricCard title="Profit Factor" value={profitFactor} sub="Avg Win/Avg Loss" icon={<TrendingUp />} highlight="purple" />
        <MetricCard title="Total Trades" value={totalTrades} sub="This period" icon={<Activity />} highlight="orange" />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Trade Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Win:</span>
              <span className="font-medium text-green-600">+${avgWin.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Loss:</span>
              <span className="font-medium text-red-600">-${avgLoss.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, sub, icon, highlight }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`text-2xl font-bold text-${highlight}-600`}>{value}</p>
        {sub && <p className="text-xs text-gray-500">{sub}</p>}
      </div>
      <div className={`text-${highlight}-500 h-8 w-8`}>{icon}</div>
    </div>
  </div>
);

export default Performance;
