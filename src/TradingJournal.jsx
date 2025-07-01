// TradingJournal.jsx - Main orchestrator file
import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import Header from './components/common/Header';
import Navigation from './components/common/Navigation';
import Dashboard from './components/dashboard/Dashboard';
import PlanTrader from './components/trading/PlanTrader';
import SmartJournal from './components/journal/SmartJournal';
import DailyView from './components/daily/DailyView';
import Notebook from './components/notebook/Notebook';
import Performance from './components/performance/Performance';
import NotePopup from './components/common/NotePopup';
import { sampleData } from './data/sampleData';
import { modules } from './utils/constants';

function TradingJournal() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [expandedDays, setExpandedDays] = useState({});
  const [highlightedItem, setHighlightedItem] = useState(null);
  const [notePopup, setNotePopup] = useState({ isOpen: false, date: '', note: '' });
  const [showNotePreviews, setShowNotePreviews] = useState(false);
  
  // State management
  const [tradePlans, setTradePlans] = useState(sampleData.tradePlans);
  const [trades, setTrades] = useState(sampleData.trades);
  const [notes, setNotes] = useState(sampleData.notes);
  const [activities, setActivities] = useState(sampleData.activities);
  const [newPlan, setNewPlan] = useState({
    ticker: '',
    entry: '',
    target: '',
    stopLoss: '',
    position: 'long',
    quantity: '',
    notes: ''
  });

  // Shared functions
  const handleModuleChange = (moduleId) => {
    setActiveModule(moduleId);
  };

  const handleActivityClick = (activity) => {
    setActiveModule(activity.targetModule);
    
    if (activity.targetId) {
      setHighlightedItem(activity.targetId);
    }
    
    if (activity.type === 'trade' && activity.targetDate) {
      setTimeout(() => {
        setExpandedDays(prev => ({
          ...prev,
          [activity.targetDate]: true
        }));
      }, 100);
    }
    
    setTimeout(() => {
      setHighlightedItem(null);
    }, 2000);
  };

  const handlePlanClick = (planId) => {
    setActiveModule('plan-trader');
    setHighlightedItem(planId);
    setTimeout(() => {
      setHighlightedItem(null);
    }, 2000);
  };

  const openNotePopup = (date) => {
    setNotePopup({
      isOpen: true,
      date: date,
      note: notes[date] || ''
    });
  };

  const closeNotePopup = () => {
    setNotePopup({ isOpen: false, date: '', note: '' });
  };

  const saveNoteFromPopup = () => {
    setNotes({ ...notes, [notePopup.date]: notePopup.note });
    closeNotePopup();
  };

  const updateDailyNote = (date, note) => {
    setNotes({ ...notes, [date]: note });
  };

  // Shared props object
  const sharedProps = {
    tradePlans,
    setTradePlans,
    trades,
    setTrades,
    notes,
    setNotes,
    activities,
    newPlan,
    setNewPlan,
    expandedDays,
    setExpandedDays,
    highlightedItem,
    showNotePreviews,
    setShowNotePreviews,
    handleActivityClick,
    handlePlanClick,
    handleModuleChange,
    openNotePopup,
    updateDailyNote
  };

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard {...sharedProps} />;
      case 'plan-trader':
        return <PlanTrader {...sharedProps} />;
      case 'smart-journal':
        return <SmartJournal />;
      case 'daily-view':
        return <DailyView {...sharedProps} />;
      case 'notebook':
        return <Notebook {...sharedProps} />;
      case 'performance':
        return <Performance trades={trades} />;
      default:
        return <Dashboard {...sharedProps} />;
    }
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
        {renderContent()}
      </main>
      <NotePopup
        notePopup={notePopup}
        trades={trades}
        onClose={closeNotePopup}
        onSave={saveNoteFromPopup}
        onNoteChange={(note) => setNotePopup({ ...notePopup, note })}
      />
    </div>
  );
}

export default TradingJournal;