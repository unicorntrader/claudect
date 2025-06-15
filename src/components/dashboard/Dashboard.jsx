// /components/dashboard/Dashboard.jsx
import React from 'react';
import { Target, CheckCircle, BookOpen, Activity, Calendar, TrendingUp, Edit3, User } from 'lucide-react';
import MetricCard from '../common/MetricCard';

const getCurrentDate = () => new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

const Dashboard = ({ 
  tradePlans = [], 
  trades = [], 
  notes = [], 
  activities = [], 
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
      {/* Header with Date and Profile Icon */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">{getCurrentDate()}</div>
        <User className="w-6 h-6 text-gray-600 cursor-pointer" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Plans"
          value={tradePlans.length}
          icon={<Target className="w-5 h-5" />}
          onClick={() => handleMetricClick('active-plans')}
        />
        <MetricCard
          title="Executed Trades"
          value={trades.length}
          icon={<CheckCircle className="w-5 h-5" />}
          onClick={() => handleMetricClick('executed-trades')}
        />
        <MetricCard
          title="Journal Entries"
          value={notes.length}
          icon={<BookOpen className="w-5 h-5" />}
          onClick={() => handleMetricClick('journal-entries')}
        />
        <MetricCard
          title="Today's Activity"
          value={activities.length}
          icon={<Activity className="w-5 h-5" />}
          onClick={() => handleMetricClick('today-activity')}
        />
      </div>

      {/* Recent Trade Plans and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-semibold mb-2">Recent Trade Plans</h2>
          <ul className="divide-y divide-gray-200">
            {tradePlans.map((plan, index) => (
              <li key={index} className="py-2 flex justify-between items-center">
                <div>
                  <span className="font-medium cursor-pointer text-blue-600" onClick={() => handlePlanClick(plan)}>
                    {plan.symbol}
                  </span>
                  <span className="ml-2 text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded">planned</span>
                </div>
                <div className="text-sm text-gray-600">R/R: {plan.riskReward || '-'}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-semibold mb-2">Activity Feed</h2>
          <ul className="space-y-2 text-sm">
            {activities.map((activity, index) => (
              <li key={index} className="flex items-start space-x-2 cursor-pointer" onClick={() => handleActivityClick(activity)}>
                <span className="w-2 h-2 mt-1 rounded-full bg-blue-500"></span>
                <div>{activity.text}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center cursor-pointer hover:bg-blue-100" onClick={() => handleModuleChange('plan-trader')}>
          <Target className="mx-auto mb-2" />
          New Plan
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center cursor-pointer hover:bg-green-100" onClick={() => handleModuleChange('daily-view')}>
          <Calendar className="mx-auto mb-2" />
          Daily View
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center cursor-pointer hover:bg-purple-100" onClick={() => handleModuleChange('notebook')}>
          <Edit3 className="mx-auto mb-2" />
          Add Note
        </div>
        <div className="bg-orange-50 p-4 rounded-lg text-center cursor-pointer hover:bg-orange-100" onClick={() => handleModuleChange('performance-review')}>
          <TrendingUp className="mx-auto mb-2" />
          Performance
        </div>
      </div>

      {/* Import Section */}
      <div className="mt-8 p-4 bg-gray-50 border border-dashed border-gray-300 rounded text-center text-sm text-gray-600">
        <p>Upload your trade history or connect to your broker account (coming soon).</p>
      </div>
    </div>
  );
};

export default Dashboard;
