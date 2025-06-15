// components/journal/SmartJournal.jsx
import React from 'react';
import { BookOpen } from 'lucide-react';

const SmartJournal = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Smart Journal</h3>
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Smart Journal module coming soon...</p>
        <p className="text-sm text-gray-500 mt-2">This will include AI-powered trade analysis and pattern recognition</p>
      </div>
    </div>
  );
};

export default SmartJournal;