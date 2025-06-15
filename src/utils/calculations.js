// utils/calculations.js - Trading calculations
export const calculateRiskReward = (entry, target, stopLoss, position) => {
  const entryPrice = parseFloat(entry);
  const targetPrice = parseFloat(target);
  const stopPrice = parseFloat(stopLoss);
  
  if (!entryPrice || !targetPrice || !stopPrice) return { ratio: 0, risk: 0, reward: 0 };
  
  let risk, reward;
  if (position === 'long') {
    risk = entryPrice - stopPrice;
    reward = targetPrice - entryPrice;
  } else {
    risk = stopPrice - entryPrice;
    reward = entryPrice - targetPrice;
  }
  
  const ratio = risk !== 0 ? (reward / risk).toFixed(2) : 0;
  return { ratio, risk: Math.abs(risk).toFixed(2), reward: Math.abs(reward).toFixed(2) };
};

export const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};