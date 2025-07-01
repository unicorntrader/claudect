// components/notebook/Notebook.jsx
import React from 'react';
import { getCurrentDate } from '../../utils/calculations';

const Notebook = ({ notes, updateDailyNote }) => {
  const today = getCurrentDate();
  const currentNote = notes[today] || '';

  return (
    <div className="space-y-6">
      {/* Today's Note Editor */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Daily Trading Notes - {today}</h3>
        <textarea
          value={currentNote}
          onChange={(e) => updateDailyNote(today, e.target.value)}
          className="w-full h-64 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Record your thoughts, market observations, trade analysis, lessons learned, etc."
        />
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {currentNote.length} characters
          </div>
          <button
            onClick={() => updateDailyNote(today, currentNote)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Note
          </button>
        </div>
      </div>
      
      {/* Previous Notes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Previous Notes</h3>
        <div className="space-y-3">
          {Object.entries(notes)
            .sort(([a], [b]) => new Date(b) - new Date(a))
            .slice(0, 5)
            .map(([date, note]) => (
              <div key={date} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{date}</span>
                  <span className="text-sm text-gray-500">{note.length} chars</span>
                </div>
                <p className="text-sm text-gray-700">{note.substring(0, 150)}...</p>
              </div>
            ))}
          {Object.keys(notes).length === 0 && (
            <p className="text-gray-500 text-center py-8">No notes yet. Start writing your first note above!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notebook;