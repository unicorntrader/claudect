// data/sampleData.js - All sample data in one place
export const sampleData = {
  tradePlans: [
    {
      id: 1671234567890,
      ticker: 'AAPL',
      entry: '185.50',
      target: '192.00',
      stopLoss: '180.00',
      position: 'long',
      quantity: '100',
      notes: 'Bullish breakout above resistance, strong volume',
      timestamp: '2025-06-14T08:30:00.000Z',
      status: 'planned'
    },
    {
      id: 1671234567891,
      ticker: 'TSLA',
      entry: '245.00',
      target: '255.00',
      stopLoss: '238.00',
      position: 'long',
      quantity: '50',
      notes: 'Earnings play, expecting positive guidance',
      timestamp: '2025-06-14T09:15:00.000Z',
      status: 'planned'
    }
  ],

  trades: [
    {
      id: 1671234567893,
      ticker: 'MSFT',
      entry: '415.00',
      target: '425.00',
      stopLoss: '408.00',
      position: 'long',
      quantity: '75',
      notes: 'Cloud earnings beat expected',
      timestamp: '2025-06-12T10:30:00.000Z',
      executeTime: '2025-06-12T10:30:00.000Z',
      status: 'executed',
      exitPrice: '423.50',
      exitTime: '2025-06-12T15:45:00.000Z',
      pnl: 637.50,
      outcome: 'win'
    },
    {
      id: 1671234567894,
      ticker: 'GOOGL',
      entry: '2750.00',
      target: '2820.00',
      stopLoss: '2700.00',
      position: 'long',
      quantity: '10',
      notes: 'AI momentum trade',
      timestamp: '2025-06-11T11:15:00.000Z',
      executeTime: '2025-06-11T11:15:00.000Z',
      status: 'executed',
      exitPrice: '2700.00',
      exitTime: '2025-06-11T14:20:00.000Z',
      pnl: -500.00,
      outcome: 'loss'
    },
    {
      id: 1671234567895,
      ticker: 'SPY',
      entry: '525.50',
      target: '530.00',
      stopLoss: '522.00',
      position: 'long',
      quantity: '200',
      notes: 'Market bounce play',
      timestamp: '2025-06-10T09:45:00.000Z',
      executeTime: '2025-06-10T09:45:00.000Z',
      status: 'executed',
      exitPrice: '529.25',
      exitTime: '2025-06-10T16:00:00.000Z',
      pnl: 750.00,
      outcome: 'win'
    },
    {
      id: 1671234567896,
      ticker: 'QQQ',
      entry: '445.00',
      target: '435.00',
      stopLoss: '450.00',
      position: 'short',
      quantity: '100',
      notes: 'Tech weakness anticipated',
      timestamp: '2025-06-09T13:30:00.000Z',
      executeTime: '2025-06-09T13:30:00.000Z',
      status: 'executed',
      exitPrice: '438.50',
      exitTime: '2025-06-09T15:30:00.000Z',
      pnl: 650.00,
      outcome: 'win'
    },
    {
      id: 1671234567897,
      ticker: 'AMZN',
      entry: '3100.00',
      target: '3180.00',
      stopLoss: '3050.00',
      position: 'long',
      quantity: '15',
      notes: 'Prime Day catalyst expected',
      timestamp: '2025-06-08T10:00:00.000Z',
      executeTime: '2025-06-08T10:00:00.000Z',
      status: 'executed',
      exitPrice: '3050.00',
      exitTime: '2025-06-08T12:30:00.000Z',
      pnl: -750.00,
      outcome: 'loss'
    }
  ],

  notes: {
    '2025-06-14': 'Market opened strong with tech leading. AAPL showing bullish momentum above 185 resistance. Planning to enter TSLA before earnings. Risk management is key today.',
    '2025-06-13': 'Volatile session with mixed signals. Took profit on NVDA short as planned. Market seems indecisive ahead of Fed minutes. Staying patient for clear setups.',
    '2025-06-12': 'Excellent day! MSFT trade worked perfectly, hit target near close. Cloud earnings driving the momentum. Need to be careful of overconfidence.',
    '2025-06-11': 'Tough day with GOOGL stop loss hit. Market rotation away from AI stocks hurt the position. Learning: better entry timing needed on momentum plays.',
    '2025-06-10': 'Great bounce play on SPY. Market found support at key level as expected. Discipline on entries paying off. Week ending positive.',
    '2025-06-09': 'QQQ short worked well. Tech showing weakness as anticipated. Risk/reward ratios are improving my consistency.',
    '2025-06-08': 'AMZN trade failed - stopped out on gap down. Earnings plays require wider stops. Lesson learned about overnight risk.'
  },

  activities: [
    {
      id: 1,
      message: 'Trade plan created: AAPL long position',
      timestamp: '2025-06-14T08:30:00.000Z',
      type: 'plan',
      targetModule: 'plan-trader',
      targetId: 1671234567890
    },
    {
      id: 2,
      message: 'Trade plan created: TSLA earnings play',
      timestamp: '2025-06-14T09:15:00.000Z',
      type: 'plan',
      targetModule: 'plan-trader',
      targetId: 1671234567891
    },
    {
      id: 3,
      message: 'Daily note saved for June 14th',
      timestamp: '2025-06-14T10:45:00.000Z',
      type: 'note',
      targetModule: 'notebook',
      targetDate: '2025-06-14'
    },
    {
      id: 4,
      message: 'Trade executed: NVDA short position',
      timestamp: '2025-06-13T14:20:00.000Z',
      type: 'trade',
      targetModule: 'daily-view',
      targetDate: '2025-06-13',
      targetId: 1671234567892
    },
    {
      id: 5,
      message: 'Performance review completed for this week',
      timestamp: '2025-06-13T18:00:00.000Z',
      type: 'system',
      targetModule: 'performance'
    },
    {
      id: 6,
      message: 'Weekly adherence score: 85% (improved)',
      timestamp: '2025-06-13T18:01:00.000Z',
      type: 'insight',
      targetModule: 'smart-journal'
    }
  ]
};