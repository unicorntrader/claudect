// src/utils/calculations.js

export const calculateRiskReward = (entry, target, stop, position) => {
  const risk = Math.abs(entry - stop);
  const reward = Math.abs(target - entry);
  return { 
    ratio: risk > 0 ? (reward / risk).toFixed(2) : '0.00'
  };
};

export const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
};

// Add any other utility functions you might need
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const calculatePnL = (entry, exit, quantity, position) => {
  const difference = position === 'long' ? exit - entry : entry - exit;
  return difference * quantity;
};

export const formatPercentage = (value) => {
  return `${(value * 100).toFixed(2)}%`;
};
