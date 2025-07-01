// components/common/MetricCard.jsx
import React from 'react';

const MetricCard = ({ title, value, icon: Icon, color, onClick }) => {
  const colorClasses = {
    blue: 'border-blue-500 hover:bg-blue-100',
    green: 'border-green-500 hover:bg-green-100',
    purple: 'border-purple-500 hover:bg-purple-100',
    orange: 'border-orange-500 hover:bg-orange-100'
  };

  const iconColors = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500'
  };

  return (
    <div 
      className={`bg-white p-6 rounded-lg shadow-md border-l-4 cursor-pointer hover:shadow-xl transition-all ${colorClasses[color]}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${iconColors[color]}`} />
      </div>
    </div>
  );
};

export default MetricCard;