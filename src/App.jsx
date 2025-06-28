import React, { useState } from 'react';
import TradingJournal from './TradingJournal';
import Dashboard from './components/dashboard/Dashboard';
import PlanTrader from './components/trading/PlanTrader';
import SmartJournal from './components/journal/SmartJournal';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [moduleOptions, setModuleOptions] = useState({});

  // Real state logic for tradePlans, trades, and newPlan
  const [tradePlans, setTradePlans] = useState([]);
  const [trades, setTrades] = useState([]);
  const [newPlan, setNewPlan] = useState({
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

  const handleModuleChange = (module, options = {}) => {
    setActiveModule(module);
    setModuleOptions(options);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {activeModule === 'dashboard' && (
        <Dashboard
          handleModuleChange={handleModuleChange}
          tradePlans={tradePlans}
          trades={trades}
          notes={{}} // Placeholder for future notes system
          activities={[]} // Placeholder for future activity feed
          highlightedItem={null}
          handlePlanClick={(planId) =>
            handleModuleChange('plan-trader', { editPlanId: planId })
          }
          handleActivityClick={() => {}}
        />
      )}

      {activeModule === 'plan-trader' && (
        <PlanTrader
          tradePlans={tradePlans}
          setTradePlans={setTradePlans}
          trades={trades}
          setTrades={setTrades}
          newPlan={newPlan}
          setNewPlan={setNewPlan}
          highlightedItem={null}
          editPlanId={moduleOptions.editPlanId || null}
        />
      )}

      {activeModule === 'smart-journal' && (
        <SmartJournal
          trades={trades}
          tradePlans={tradePlans}
          highlightedItem={null}
          handleModuleChange={handleModuleChange}
        />
      )}

      {activeModule === 'journal' && (
        <TradingJournal />
      )}
    </div>
  );
}

export default App;
