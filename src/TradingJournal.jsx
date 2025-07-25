// TradingJournal.jsx - Updated with Supabase integration
import React, { useState, useEffect } from 'react';
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
import { tradingAPI } from './utils/supabase';
import { modules } from './utils/constants';

function TradingJournal() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [expandedDays, setExpandedDays] = useState({});
  const [highlightedItem, setHighlightedItem] = useState(null);
  const [notePopup, setNotePopup] = useState({ isOpen: false, date: '', note: '' });
  const [showNotePreviews, setShowNotePreviews] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // State management - now using real data
  const [tradePlans, setTradePlans] = useState([]);
  const [trades, setTrades] = useState([]);
  const [notes, setNotes] = useState({});
  const [activities, setActivities] = useState([]);
  const [newPlan, setNewPlan] = useState({
    ticker: '',
    entry: '',
    target: '',
    stopLoss: '',
    position: 'long',
    quantity: '',
    notes: ''
  });

  // Load real data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load trades from Supabase (your real IBKR data)
      const realTrades = await tradingAPI.getTrades();
      setTrades(realTrades);
      
      // Load trade plans from localStorage for now
      const plans = await tradingAPI.getTradePlans();
      setTradePlans(plans);
      
      // Load notes from localStorage
      const savedNotes = JSON.parse(localStorage.getItem('dailyNotes') || '{}');
      setNotes(savedNotes);
      
      // Generate activities based on real data
      const recentActivities = realTrades.slice(0, 5).map((trade, index) => ({
        id: index + 1,
        message: `Trade executed: ${trade.ticker} ${trade.position} position`,
        timestamp: trade.executeTime,
        type: 'trade',
        targetModule: 'daily-view',
        targetDate: trade.executeTime.split('T')[0],
        targetId: trade.id
      }));
      setActivities(recentActivities);
      
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to empty arrays if error
      setTrades([]);
      setTradePlans([]);
    } finally {
      setLoading(false);
    }
  };

  // Shared functions (same as before)
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
    const updatedNotes = { ...notes, [notePopup.date]: notePopup.note };
    setNotes(updatedNotes);
    localStorage.setItem('dailyNotes', JSON.stringify(updatedNotes));
    closeNotePopup();
  };

  const updateDailyNote = (date, note) => {
    const updatedNotes = { ...notes, [date]: note };
    setNotes(updatedNotes);
    localStorage.setItem('dailyNotes', JSON.stringify(updatedNotes));
  };

  // Add new trade plan
  const addTradePlan = async (planData) => {
    try {
      const newPlan = await tradingAPI.addTradePlan(planData);
      setTradePlans(prev => [newPlan, ...prev]);
      
      // Add activity
      const newActivity = {
        id: Date.now(),
        message: `Trade plan created: ${newPlan.ticker} ${newPlan.position} position`,
        timestamp: new Date().toISOString(),
        type: 'plan',
        targetModule: 'plan-trader',
        targetId: newPlan.id
      };
      setActivities(prev => [newActivity, ...prev]);
      
    } catch (error) {
      console.error('Error adding trade plan:', error);
    }
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
    updateDailyNote,
    addTradePlan,
    loadData,
    loading
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <BarChart3 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading your trading data...</p>
          </div>
        </div>
      );
    }

    switch (activeModule) {
      case 'dashboard':
        return <Dashboard {...sharedProps} />;
      case 'plan-trader':
        return <PlanTrader {...sharedProps} />;
      case 'smart-journal':
        return <SmartJournal {...sharedProps} />;
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
