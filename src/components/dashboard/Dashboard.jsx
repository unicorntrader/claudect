import React from 'react';
import { Target, CheckCircle, BookOpen, Activity, Calendar, TrendingUp, Edit3, ChevronRight, UploadCloud } from 'lucide-react';
import MetricCard from '../common/MetricCard';
import { getCurrentDate, calculateRiskReward } from '../../utils/calculations';

const Dashboard = ({ 
  tradePlans, 
  trades, 
  notes, 
  activities, 
  highlightedItem, 
  handleActivityClick, 
  handlePlanClick, 
  handleModuleChange 
}) => {
  const handleMetricClick = (metric) => {
    switch (metric) {
      case 'active-plans':
        handleModuleChange('plan-trader');
        break;
      case 'executed-trades':
        handleModuleChange('daily-view');
        break;
      case 'journal-entries':
        handleModuleChange('notebook');
        break;
      case 'today-activity':
        handleModuleChange('daily-view');
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Plans"
          value={tradePlans.filter(p => p.status === 'planned').length}
          icon={Target}
          color="blue"
          onClick={() => handleMetricClick('active-plans')}
        />
        <MetricCard
          title="Executed Trades"
          value={trades.length}
          icon={CheckCircle}
          color="green"
          onClick={() => handleMetricClick('executed-trades')}
        />
        <MetricCard
          title="Journal Entries"
          value={Object.keys(notes).length}
          icon={BookOpen}
          color="purple"
          onClick={() => handleMetricClick('journal-entries')}
        />
        <MetricCard
          title="Today's Activity"
          value={tradePlans.filter(p => p.timestamp.startsWith(getCurrentDate())).length}
          icon={Activity}
          color="orange"
          onClick={() => handleMetricClick('today-activity')}
        />
      </div>

      {/* Recent Plans and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 
            className="text-lg font-semibold mb-4 cursor-pointer hover:text-blue-600 transition-colors flex items-center justify-between group"
            onClick={() => handleModuleChange('plan-trader')}
          >
            Recent Trade Plans
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </h3>
          <div className="space-y-3">
            {tradePlans.slice(-5).map(plan => (
              <div 
                key={plan.id} 
                className={`flex items-center justify-between p-3 rounded cursor-pointer hover:bg-blue-50 transition-colors ${
                  highlightedItem === plan.id ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50'
                }`}
                onClick={() => handlePlanClick(plan.id)}
              >
                <div>
                  <span className="font-medium">{plan.ticker}</span>
                  <span className={`ml-2 px-2 py-1 text-xs rounded ${
                    plan.status === 'executed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {plan.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  R/R: {calculateRiskReward(plan.entry, plan.target, plan.stopLoss, plan.position).ratio}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Activity Feed</h3>
          <div className="space-y-3">
            {activities.slice(0, 6).map(activity => (
              <div 
                key={activity.id} 
                className="flex items-start space-x-3 p-2 rounded cursor-pointer hover:bg-gray-50 transition-colors group"
                onClick={() => handleActivityClick(activity)}
              >
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  activity.type === 'plan' ? 'bg-blue-500' :
                  activity.type === 'trade' ? 'bg-green-500' :
                  activity.type === 'note' ? 'bg-purple-500' :
                  activity.type === 'system' ? 'bg-orange-500' :
                  'bg-gray-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleModuleChange('plan-trader')}
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-800">New Plan</p>
          </button>
          <button
            onClick={() => handleModuleChange('notebook')}
            className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Edit3 className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-purple-800">Add Note</p>
          </button>
          <button
            onClick={() => handleModuleChange('daily-view')}
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-800">Daily View</p>
          </button>
          <button
            onClick={() => handleModuleChange('performance')}
            className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-orange-800">Performance</p>
          </button>
        </div>
      </div>

      {/* Import Trades Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <UploadCloud className="h-5 w-5 text-gray-500 mr-2" /> Import Trades
        </h3>
        <p className="text-sm text-gray-600">Upload your trade history or connect to your broker account (coming soon).</p>
      </div>
    </div>
  );
};

export default Dashboard;
