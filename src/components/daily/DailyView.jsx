// components/daily/DailyView.jsx
import React from 'react';
import { Calendar, Edit3, ChevronRight } from 'lucide-react';
import { calculateRiskReward } from '../../utils/calculations';

const DailyView = ({ 
  trades, 
  notes, 
  expandedDays, 
  setExpandedDays, 
  highlightedItem, 
  showNotePreviews, 
  setShowNotePreviews, 
  openNotePopup 
}) => {
  const toggleDay = (date) => {
    setExpandedDays(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  const expandAllDays = () => {
    const tradesByDate = trades.reduce((acc, trade) => {
      const date = trade.timestamp.split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(trade);
      return acc;
    }, {});
    
    const allDates = Object.keys(tradesByDate);
    const expandedState = {};
    allDates.forEach(date => {
      expandedState[date] = true;
    });
    setExpandedDays(expandedState);
  };

  const collapseAllDays = () => {
    setExpandedDays({});
  };

  const tradesByDate = trades.reduce((acc, trade) => {
    const date = trade.timestamp.split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(trade);
    return acc;
  }, {});

  const sortedDates = Object.keys(tradesByDate).sort((a, b) => new Date(b) - new Date(a));
  const hasAnyExpanded = Object.values(expandedDays).some(expanded => expanded);

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Daily Trading Activity</h3>
          <div className="flex items-center space-x-4">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={showNotePreviews}
                onChange={(e) => setShowNotePreviews(e.target.checked)}
                className="mr-2"
              />
              Show note previews
            </label>
            <button
              onClick={hasAnyExpanded ? collapseAllDays : expandAllDays}
              className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
            >
              {hasAnyExpanded ? 'Collapse All' : 'Expand All'}
            </button>
          </div>
        </div>
        
        {sortedDates.map(date => {
          const dayTrades = tradesByDate[date];
          const dayPnL = dayTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
          const dayNote = notes[date];
          const isExpanded = expandedDays[date];
          const hasNote = dayNote && dayNote.length > 0;
          
          return (
            <div key={date} className="border border-gray-200 rounded-lg mb-4">
              <div 
                className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleDay(date)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-lg">
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="text-sm text-gray-600">
                      {dayTrades.length} trade{dayTrades.length !== 1 ? 's' : ''}
                    </span>
                    {hasNote && (
                      <div className="flex items-center text-blue-600">
                        <Edit3 className="h-4 w-4 mr-1" />
                        <span className="text-xs">Has note</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`font-bold ${dayPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {dayPnL >= 0 ? '+' : ''}${dayPnL.toFixed(2)}
                    </span>
                    <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </div>
                  </div>
                </div>
              </div>
              
              {isExpanded && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-700">Trade Details</h4>
                    <button
                      onClick={() => openNotePopup(date)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit Note
                    </button>
                  </div>

                  {showNotePreviews && hasNote && (
                    <div 
                      className="mb-4 p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => openNotePopup(date)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-medium text-blue-800 mb-1">Daily Note</h5>
                          <p className="text-sm text-blue-700">
                            {dayNote.substring(0, 120)}
                            {dayNote.length > 120 && '...'}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-blue-600 mt-1" />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {dayTrades.map(trade => (
                      <div 
                        key={trade.id} 
                        className={`p-3 border rounded-lg shadow-sm transition-colors ${
                          highlightedItem === trade.id 
                            ? 'bg-blue-50 border-blue-300' 
                            : 'bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="font-bold text-lg">{trade.ticker}</span>
                              <span className={`px-2 py-1 text-xs rounded ${
                                trade.position === 'long' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {trade.position.toUpperCase()}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded ${
                                trade.outcome === 'win' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {trade.outcome?.toUpperCase()}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                              <div>Entry: ${trade.entry}</div>
                              <div>Exit: ${trade.exitPrice}</div>
                              <div>Qty: {trade.quantity}</div>
                              <div>Time: {new Date(trade.executeTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                            </div>
                            {trade.notes && (
                              <p className="text-sm text-gray-700 mt-2 italic">{trade.notes}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className={`font-bold text-lg ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {trade.pnl >= 0 ? '+' : ''}${trade.pnl?.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">
                              R/R: 1:{calculateRiskReward(trade.entry, trade.target, trade.stopLoss, trade.position).ratio}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {sortedDates.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No trading activity yet</p>
            <p className="text-sm text-gray-500 mt-2">Execute some trades to see daily activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyView;