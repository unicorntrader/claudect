import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, X, Tag, Plus, Filter, TrendingUp, TrendingDown, Target, Zap, BarChart3, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const mockTrades = [
  {
    id: "T001",
    date: "2025-06-15",
    symbol: "AAPL",
    strategy: "Breakout",
    tags: ["Gap Up", "Volume Spike", "Trend"],
    outcome: "Win",
    rr: 2.5,
    adherence: 88.5,
    plan: { entry: 175, stop: 170, target: 185, size: 10 },
    exec: { entry: 176, exit: 184, size: 10 },
    pnl: 80,
    holdTime: 4.2, // hours
    notes: "Strong momentum play, slight slippage on entry but good execution overall",
    timeBucket: "NY-Open"
  },
  {
    id: "T002",
    date: "2025-06-14",
    symbol: "TSLA",
    strategy: "Mean Reversion",
    tags: ["Oversold", "Counter-trend"],
    outcome: "Loss",
    rr: 1.2,
    adherence: 61,
    plan: { entry: 210, stop: 200, target: 230, size: 8 },
    exec: { entry: 211, exit: 201, size: 8 },
    pnl: -72,
    holdTime: 2.1,
    notes: "Early exit due to continued weakness",
    timeBucket: "NY-Open"
  },
  {
    id: "T003",
    date: "2025-06-13",
    symbol: "NVDA",
    strategy: "Momentum",
    tags: ["Earnings Play", "Trend"],
    outcome: "Win",
    rr: 3.1,
    adherence: 95,
    plan: { entry: 450, stop: 440, target: 480, size: 5 },
    exec: { entry: 450, exit: 479, size: 5 },
    pnl: 145,
    holdTime: 6.8,
    notes: "Perfect execution, held for full target",
    timeBucket: "London-NY"
  },
  {
    id: "T004",
    date: "2025-06-12",
    symbol: "SPY",
    strategy: "Breakout",
    tags: ["Gap Up", "Trend"],
    outcome: "Win",
    rr: 1.8,
    adherence: 75,
    plan: { entry: 545, stop: 540, target: 555, size: 12 },
    exec: { entry: 547, exit: 553, size: 12 },
    pnl: 72,
    holdTime: 3.5,
    notes: "Decent execution but entry slippage",
    timeBucket: "NY-Open"
  },
  {
    id: "T005",
    date: "2025-06-11",
    symbol: "QQQ",
    strategy: "Mean Reversion",
    tags: ["Oversold", "Counter-trend"],
    outcome: "Loss",
    rr: 0.8,
    adherence: 45,
    plan: { entry: 485, stop: 480, target: 495, size: 6 },
    exec: { entry: 487, exit: 481, size: 8 },
    pnl: -48,
    holdTime: 1.2,
    notes: "Poor size discipline, early stop",
    timeBucket: "Asia-Close"
  }
];

const SmartJournal = () => {
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [filterTags, setFilterTags] = useState([]);
  const [filterStrategy, setFilterStrategy] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Calculate adherence score breakdown
  const calculateAdherenceBreakdown = (trade) => {
    const breakdown = {};
    let totalScore = 0;
    let criteriaCount = 0;

    // Entry match (within ±0.25×R)
    if (trade.plan?.entry && trade.exec?.entry) {
      const rSize = Math.abs(trade.plan.entry - trade.plan.stop);
      const entryTolerance = 0.25 * rSize;
      const entryMatch = Math.abs(trade.exec.entry - trade.plan.entry) <= entryTolerance;
      breakdown.entryMatch = entryMatch;
      totalScore += entryMatch ? 25 : 0;
      criteriaCount++;
    }

    // Stop match
    if (trade.plan?.stop && trade.exec?.exit && trade.outcome === 'Loss') {
      const stopMatch = Math.abs(trade.exec.exit - trade.plan.stop) <= Math.abs(trade.plan.stop * 0.02);
      breakdown.stopMatch = stopMatch;
      totalScore += stopMatch ? 25 : 0;
      criteriaCount++;
    }

    // Target hit
    if (trade.plan?.target && trade.exec?.exit && trade.outcome === 'Win') {
      const targetHit = trade.outcome === 'Win' && trade.exec.exit >= (trade.plan.target * 0.95);
      breakdown.targetHit = targetHit;
      totalScore += targetHit ? 25 : 0;
      criteriaCount++;
    }

    // Size match (±10%)
    if (trade.plan?.size && trade.exec?.size) {
      const sizeMatch = Math.abs(trade.exec.size - trade.plan.size) <= (trade.plan.size * 0.1);
      breakdown.sizeMatch = sizeMatch;
      totalScore += sizeMatch ? 25 : 0;
      criteriaCount++;
    }

    breakdown.totalScore = criteriaCount > 0 ? totalScore / criteriaCount * 4 : 0;
    return breakdown;
  };

  // Generate insights based on last trades
  const generateInsights = useMemo(() => {
    const insights = [];
    const recentTrades = mockTrades.slice(0, 50); // Last 50 trades
    
    // Strategy performance analysis
    const strategyStats = {};
    recentTrades.forEach(trade => {
      if (!strategyStats[trade.strategy]) {
        strategyStats[trade.strategy] = { wins: 0, total: 0, adherence: [], rr: [] };
      }
      strategyStats[trade.strategy].total++;
      if (trade.outcome === 'Win') strategyStats[trade.strategy].wins++;
      strategyStats[trade.strategy].adherence.push(trade.adherence);
      strategyStats[trade.strategy].rr.push(trade.rr);
    });

    Object.entries(strategyStats).forEach(([strategy, stats]) => {
      const winRate = (stats.wins / stats.total * 100).toFixed(0);
      const avgAdherence = (stats.adherence.reduce((a, b) => a + b, 0) / stats.adherence.length).toFixed(0);
      const avgRR = (stats.rr.reduce((a, b) => a + b, 0) / stats.rr.length).toFixed(1);
      
      if (stats.total >= 3) {
        insights.push({
          type: winRate >= 60 ? 'positive' : winRate <= 40 ? 'negative' : 'neutral',
          message: `${strategy} trades: ${avgAdherence}% adherence, ${winRate}% win-rate, ${avgRR}R avg`,
          icon: winRate >= 60 ? CheckCircle : winRate <= 40 ? AlertTriangle : BarChart3
        });
      }
    });

    // Entry execution analysis
    const entryMisses = recentTrades.filter(trade => {
      if (!trade.plan?.entry || !trade.exec?.entry) return false;
      const rSize = Math.abs(trade.plan.entry - trade.plan.stop);
      const entryTolerance = 0.25 * rSize;
      return Math.abs(trade.exec.entry - trade.plan.entry) > entryTolerance;
    });

    if (entryMisses.length > 0) {
      const missPercentage = (entryMisses.length / recentTrades.length * 100).toFixed(0);
      insights.push({
        type: 'negative',
        message: `You missed entries in ${missPercentage}% of trades - refine timing`,
        icon: Target
      });
    }

    // Time bucket analysis
    const timeBucketStats = {};
    recentTrades.forEach(trade => {
      if (!timeBucketStats[trade.timeBucket]) {
        timeBucketStats[trade.timeBucket] = { wins: 0, total: 0 };
      }
      timeBucketStats[trade.timeBucket].total++;
      if (trade.outcome === 'Win') timeBucketStats[trade.timeBucket].wins++;
    });

    const bestTimeBucket = Object.entries(timeBucketStats)
      .filter(([_, stats]) => stats.total >= 2)
      .sort((a, b) => (b[1].wins / b[1].total) - (a[1].wins / a[1].total))[0];

    if (bestTimeBucket) {
      const winRate = (bestTimeBucket[1].wins / bestTimeBucket[1].total * 100).toFixed(0);
      insights.push({
        type: 'positive',
        message: `Best performance during ${bestTimeBucket[0]} (${winRate}% win-rate)`,
        icon: Clock
      });
    }

    return insights;
  }, []);



  // Filter trades
  const filteredTrades = useMemo(() => {
    return mockTrades.filter(trade => {
      const tagMatch = filterTags.length === 0 || filterTags.every(tag => trade.tags?.includes(tag));
      const strategyMatch = !filterStrategy || trade.strategy === filterStrategy;
      return tagMatch && strategyMatch;
    });
  }, [filterTags, filterStrategy]);

  // Get all unique tags and strategies
  const allTags = [...new Set(mockTrades.flatMap(t => t.tags || []))];
  const allStrategies = [...new Set(mockTrades.map(t => t.strategy))];

  const renderOutcome = (outcome) => (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${outcome === 'Win' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{outcome}</span>
  );

  const renderAdherence = (score) => (
    <span className={`text-sm font-semibold ${score >= 75 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{score}%</span>
  );

  const toggleFilterTag = (tag) => {
    setFilterTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Smart Journal</h1>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Insights Engine */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          Live Insights (Last 50 Trades)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {generateInsights.map((insight, idx) => (
            <div key={idx} className={`flex items-center gap-2 p-3 rounded-lg ${
              insight.type === 'positive' ? 'bg-green-100 text-green-800' :
              insight.type === 'negative' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              <insight.icon className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{insight.message}</span>
            </div>
          ))}
        </div>
      </div>



      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Filter by Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleFilterTag(tag)}
                    className={`px-2 py-1 rounded text-sm ${
                      filterTags.includes(tag)
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Filter by Strategy</h3>
              <select 
                value={filterStrategy} 
                onChange={(e) => setFilterStrategy(e.target.value)}
                className="w-full p-2 border rounded text-sm"
              >
                <option value="">All Strategies</option>
                {allStrategies.map(strategy => (
                  <option key={strategy} value={strategy}>{strategy}</option>
                ))}
              </select>
            </div>
          </div>
          {(filterTags.length > 0 || filterStrategy) && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Showing {filteredTrades.length} of {mockTrades.length} trades
              </span>
              <button 
                onClick={() => { setFilterTags([]); setFilterStrategy(''); }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}

      {/* Trades Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Symbol</th>
              <th className="px-4 py-3 text-left">Strategy / Tags</th>
              <th className="px-4 py-3 text-left">R/R</th>
              <th className="px-4 py-3 text-left">P&L</th>
              <th className="px-4 py-3 text-left">Hold</th>
              <th className="px-4 py-3 text-left">Outcome</th>
              <th className="px-4 py-3 text-left">Adh.</th>
              <th className="px-4 py-3 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {filteredTrades.map((trade) => (
              <tr key={trade.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">{trade.date}</td>
                <td className="px-4 py-3 font-medium">{trade.symbol}</td>
                <td className="px-4 py-3">
                  <div>
                    <span className="font-semibold">{trade.strategy}</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {trade.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                      {trade.tags?.length > 2 && (
                        <span className="text-xs text-gray-500">+{trade.tags.length - 2}</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{trade.rr}</td>
                <td className="px-4 py-3">
                  <span className={`font-medium ${trade.pnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${trade.pnl > 0 ? '+' : ''}{trade.pnl}
                  </span>
                </td>
                <td className="px-4 py-3">{trade.holdTime}h</td>
                <td className="px-4 py-3">{renderOutcome(trade.outcome)}</td>
                <td className="px-4 py-3">{renderAdherence(trade.adherence)}</td>
                <td className="px-2 py-3 text-right">
                  <button 
                    onClick={() => setSelectedTrade(selectedTrade?.id === trade.id ? null : trade)} 
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    {selectedTrade?.id === trade.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Trade Drill-Down Panel */}
      {selectedTrade && (
        <div className="bg-white rounded-lg shadow p-6 relative">
          <button className="absolute top-4 right-4" onClick={() => setSelectedTrade(null)}>
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>

          <div className="pr-8">
            <h2 className="text-lg font-semibold mb-2">Trade Analysis — {selectedTrade.symbol}</h2>
            <p className="text-gray-600 text-sm mb-4">{selectedTrade.strategy} • {selectedTrade.date} • {selectedTrade.timeBucket}</p>

            {/* Adherence Score Breakdown */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Adherence Score Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {(() => {
                  const breakdown = calculateAdherenceBreakdown(selectedTrade);
                  return (
                    <>
                      <div className="flex items-center gap-2">
                        {breakdown.entryMatch !== undefined && (
                          <>
                            {breakdown.entryMatch ? 
                              <CheckCircle className="h-4 w-4 text-green-600" /> : 
                              <X className="h-4 w-4 text-red-600" />
                            }
                            <span>Entry Match</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {breakdown.stopMatch !== undefined && (
                          <>
                            {breakdown.stopMatch ? 
                              <CheckCircle className="h-4 w-4 text-green-600" /> : 
                              <X className="h-4 w-4 text-red-600" />
                            }
                            <span>Stop Match</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {breakdown.targetHit !== undefined && (
                          <>
                            {breakdown.targetHit ? 
                              <CheckCircle className="h-4 w-4 text-green-600" /> : 
                              <X className="h-4 w-4 text-red-600" />
                            }
                            <span>Target Hit</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {breakdown.sizeMatch !== undefined && (
                          <>
                            {breakdown.sizeMatch ? 
                              <CheckCircle className="h-4 w-4 text-green-600" /> : 
                              <X className="h-4 w-4 text-red-600" />
                            }
                            <span>Size Match</span>
                          </>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Plan vs Reality */}
            <h3 className="font-medium mb-3">Plan vs Reality</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
              <div className="space-y-1">
                <p className="text-gray-500">Planned Entry</p>
                <p className="font-medium">${selectedTrade.plan?.entry}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Actual Entry</p>
                <p className="font-medium">${selectedTrade.exec?.entry}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Planned Stop</p>
                <p className="font-medium">${selectedTrade.plan?.stop}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Actual Exit</p>
                <p className="font-medium">${selectedTrade.exec?.exit}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Planned Target</p>
                <p className="font-medium">${selectedTrade.plan?.target}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">P&L</p>
                <p className={`font-medium ${selectedTrade.pnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${selectedTrade.pnl > 0 ? '+' : ''}{selectedTrade.pnl}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Planned Size</p>
                <p className="font-medium">{selectedTrade.plan?.size}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Filled Size</p>
                <p className="font-medium">{selectedTrade.exec?.size}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-4">
              <h3 className="font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedTrade.tags?.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Notes */}
            {selectedTrade.notes && (
              <div>
                <h3 className="font-medium mb-2">Notes</h3>
                <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">{selectedTrade.notes}</p>
              </div>
            )}

            <div className="mt-6 text-right">
              <button 
                onClick={() => setSelectedTrade(null)} 
                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartJournal;
