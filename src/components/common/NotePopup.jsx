// components/common/NotePopup.jsx
import React from 'react';

const NotePopup = ({ notePopup, trades, onClose, onSave, onNoteChange }) => {
  if (!notePopup.isOpen) return null;

  const dayTrades = trades.filter(t => t.timestamp.split('T')[0] === notePopup.date);
  const dayPnL = dayTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const winners = dayTrades.filter(t => t.outcome === 'win').length;
  const losers = dayTrades.filter(t => t.outcome === 'loss').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {new Date(notePopup.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {dayTrades.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Net P&L:</span>
                <span className={`ml-1 font-medium ${dayPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {dayPnL >= 0 ? '+' : ''}${dayPnL.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Total Trades:</span>
                <span className="ml-1 font-medium">{dayTrades.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Winners:</span>
                <span className="ml-1 font-medium text-green-600">{winners}</span>
              </div>
              <div>
                <span className="text-gray-600">Losers:</span>
                <span className="ml-1 font-medium text-red-600">{losers}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Trading Notes
            </label>
            <textarea
              value={notePopup.note}
              onChange={(e) => onNoteChange(e.target.value)}
              className="w-full h-48 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What happened today? Mistakes, lessons learned, what went well..."
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotePopup;