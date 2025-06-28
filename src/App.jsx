import React, { useState } from 'react';
import TradingJournal from './TradingJournal';
import Dashboard from './components/dashboard/Dashboard';
import PlanTrader from './components/trading/PlanTrader';
import SmartJournal from './components/journal/SmartJournal';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [moduleOptions, setModuleOptions] = useState({});

  const handleModuleChange = (module, options = {}) => {
    setActiveModule(module);
    setModuleOptions(options);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {activeModule === 'dashboard' && (
        <Dashboard
          handleModuleChange={handleModuleChange}
          tradePlans={[]}
          trades={[]}
          notes={{}}
          activities={[]}
          highlightedItem={null}
          handlePlanClick={(planId) =>
            handleModuleChange('plan-trader', { editPlanId: planId })
          }
          handleActivityClick={() => {}}
        />
      )}

      {activeModule === 'plan-trader' && (
        <PlanTrader
          tradePlans={[]}
          setTradePlans={() => {}}
          trades={[]}
          setTrades={() => {}}
          newPlan={{}}
          setNewPlan={() => {}}
          highlightedItem={null}
          editPlanId={moduleOptions.editPlanId || null}
        />
      )}

      {activeModule === 'smart-journal' && (
        <SmartJournal
          trades={[]}
          tradePlans={[]}
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
