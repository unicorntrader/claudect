// src/App.jsx
import React, { useState } from 'react';
import Header from './components/common/Header';
import Navigation from './components/common/Navigation';
import Dashboard from './components/dashboard/Dashboard';
import PlanTrader from './components/trading/PlanTrader';
import SmartJournal from './components/journal/SmartJournal';
import DailyView from './components/daily/DailyView';
import Notebook from './components/notebook/Notebook';
import Performance from './components/performance/Performance';
import { modules } from './utils/constants';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [moduleOptions, setModuleOptions] = useState({});
  const [tradePlans, setTradePlans] = useState([]);
  const [trades, setTrades] = useState([]);
  const [notes, setNotes] = useState({});
  const [activities, setActivities] = useState([]);
  const [highlightedItem, setHighlightedItem] = useState(null);
  const [expandedDays, setExpandedDays] = useState({});
  const [showNotePreviews, setShowNotePreviews] = useState(false);

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
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Navigation
        modules={modules}
        activeModule={activeModule}
        onModuleChange={handleModuleChange}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeModule === 'dashboard' && (
          <Dashboard
            handleModuleChange={handleModuleChange}
            tradePlans={tradePlans}
            trades={trades}
            notes={notes}
            activities={activities}
            highlightedItem={highlightedItem}
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
            highlightedItem={highlightedItem}
            editPlanId={moduleOptions.editPlanId || null}
          />
        )}

        {activeModule === 'smart-journal' && (
          <SmartJournal
            trades={trades}
            tradePlans={tradePlans}
            highlightedItem={highlightedItem}
            handleModuleChange={handleModuleChange}
          />
        )}

        {activeModule === 'daily-view' && (
          <DailyView
            tradePlans={tradePlans}
            trades={trades}
            notes={notes}
            setNotes={setNotes}
            expandedDays={expandedDays}
            setExpandedDays={setExpandedDays}
            highlightedItem={highlightedItem}
            showNotePreviews={showNotePreviews}
            setShowNotePreviews={setShowNotePreviews}
            handleModuleChange={handleModuleChange}
          />
        )}

        {activeModule === 'notebook' && (
          <Notebook
            notes={notes}
            setNotes={setNotes}
            handleModuleChange={handleModuleChange}
          />
        )}

        {activeModule === 'performance' && (
          <Performance trades={trades} />
        )}
      </main>
    </div>
  );
}

export default App;
