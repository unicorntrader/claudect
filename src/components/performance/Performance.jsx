// components/performance/Performance.jsx
import React from 'react';
import { DollarSign, Target, TrendingUp, Activity, CheckCircle, AlertCircle, Clock } from 'lucide-react';

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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total P&L</p>
              <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
              </p>
            </div>
            <DollarSign className={`h-8 w-8 ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Win Rate</p>
              <p className="text-2xl font-bold text-gray-900">{winRate}%</p>
              <p className="text-xs text-gray-500">{winningTrades}W/{losingTrades}L</p>
            </div>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profit Factor</p>
              <p className="text-2xl font-bold text-gray-900">{profitFactor}</p>
              <p className="text-xs text-gray-500">Avg Win/Avg Loss</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trades</p>
              <p className="text-2xl font-bold text-gray-900">{totalTrades}</p>
              <p className="text-xs text-gray-500">This period</p>
            </div>
            <Activity className="h-8 w-8 text-orange-500" />
          </div>
        </div>
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
);
};

export default Performance;
              
