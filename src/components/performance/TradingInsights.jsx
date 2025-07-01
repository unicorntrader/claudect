import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const TradingInsights = ({ insights }) => {
  const { strengths = [], improvements = [] } = insights;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Trading Insights</h3>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-green-600 mb-2">Strengths</h4>
        <ul className="space-y-1">
          {strengths.map((item, idx) => (
            <li key={idx} className="flex items-center text-green-600 text-sm">
              <CheckCircle className="w-4 h-4 mr-2" /> {item}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-medium text-red-600 mb-2">Areas for Improvement</h4>
        <ul className="space-y-1">
          {improvements.map((item, idx) => (
            <li key={idx} className="flex items-center text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-2" /> {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TradingInsights;
