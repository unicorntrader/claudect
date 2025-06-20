import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronRight,
  X,
  Filter,
  Zap,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
} from 'lucide-react';

/* --------------------------------------------------------------------------
   MOCK DATA
   -------------------------------------------------------------------------- */

const mockTrades = [
  {
    id: 'T001',
    date: '2025-06-15',
    symbol: 'AAPL',
    strategy: 'Breakout',
    tags: ['Gap Up', 'Volume Spike', 'Trend'],
    outcome: 'Win',
    rr: 2.5,
    adherence: 88.5,
    plan: { entry: 175, stop: 170, target: 185, size: 10 },
    exec: { entry: 176, exit: 184, size: 10 },
    pnl: 80,
    holdTime: 4.2,
    notes:
      'Strong momentum play, slight slippage on entry but good execution overall',
    timeBucket: 'NY-Open',
  },
  {
    id: 'T002',
    date: '2025-06-14',
    symbol: 'TSLA',
    strategy: 'Mean Reversion',
    tags: ['Oversold', 'Counter-trend'],
    outcome: 'Loss',
    rr: -1.2,
    adherence: 61,
    plan: { entry: 210, stop: 200, target: 230, size: 8 },
    exec: { entry: 211, exit: 201, size: 8 },
    pnl: -72,
    holdTime: 2.1,
    notes: 'Early exit due to continued weakness',
    timeBucket: 'NY-Open',
  },
  {
    id: 'T003',
    date: '2025-06-13',
    symbol: 'NVDA',
    strategy: 'Momentum',
    tags: ['Earnings Play', 'Trend'],
    outcome: 'Win',
    rr: 3.1,
    adherence: 95,
    plan: { entry: 450, stop: 440, target: 480, size: 5 },
    exec: { entry: 450, exit: 479, size: 5 },
    pnl: 145,
    holdTime: 6.8,
    notes: 'Perfect execution, held for full target',
    timeBucket: 'London-NY',
  },
  {
    id: 'T004',
    date: '2025-06-12',
    symbol: 'SPY',
    strategy: 'Breakout',
    tags: ['Gap Up', 'Trend'],
    outcome: 'Win',
    rr: 1.8,
    adherence: 75,
    plan: { entry: 545, stop: 540, target: 555, size: 12 },
    exec: { entry: 547, exit: 553, size: 12 },
    pnl: 72,
    holdTime: 3.5,
    notes: 'Decent execution but entry slippage',
    timeBucket: 'NY-Open',
  },
  {
    id: 'T005',
    date: '2025-06-11',
    symbol: 'QQQ',
    strategy: 'Mean Reversion',
    tags: ['Oversold', 'Counter-trend'],
    outcome: 'Loss',
    rr: -0.8,
    adherence: 45,
    plan: { entry: 485, stop: 480, target: 495, size: 6 },
    exec: { entry: 487, exit: 481, size: 8 },
    pnl: -48,
    holdTime: 1.2,
    notes: 'Poor size discipline, early stop',
    timeBucket: 'Asia-Close',
  },
];

/* --------------------------------------------------------------------------
   HELPER FUNCTIONS
   -------------------------------------------------------------------------- */

/* Equal-weight adherence (Entry, Stop, Target, Size = 25 % each) */
const calcAdherenceBreakdown = (trade) => {
  const breakdown = {};
  let earned = 0;
  let max = 0;

  // R size = |entry − stop|
  const r = Math.abs(trade.plan.entry - trade.plan.stop) || 0;

  /* Entry (within ±0.25 × R) */
  if (trade.plan.entry && trade.exec.entry) {
    const ok = Math.abs(trade.exec.entry - trade.plan.entry) <= r * 0.25;
    breakdown.entry = ok;
    earned += ok ? 25 : 0;
    max += 25;
  }

  /* Stop (loss case) */
  if (trade.plan.stop && trade.exec.exit) {
    // If outcome = Loss we require exit ≈ stop (±2 %)
    const ok =
      trade.outcome === 'Loss'
        ? Math.abs(trade.exec.exit - trade.plan.stop) <= trade.plan.stop * 0.02
        : true;
    breakdown.stop = ok;
    earned += ok ? 25 : 0;
    max += 25;
  }

  /* Target (win case) */
  if (trade.plan.target && trade.exec.exit) {
    // If outcome = Win we require exit ≥ 95 % of target
    const ok =
      trade.outcome === 'Win'
        ? trade.exec.exit >= trade.plan.target * 0.95
        : true;
    breakdown.target = ok;
    earned += ok ? 25 : 0;
    max += 25;
  }

  /* Size (±10 %) */
  if (trade.plan.size && trade.exec.size) {
    const ok =
      Math.abs(trade.exec.size - trade.plan.size) <= trade.plan.size * 0.1;
    breakdown.size = ok;
    earned += ok ? 25 : 0;
    max += 25;
  }

  breakdown.score = max ? ((earned / max) * 100).toFixed(0) : 0;
  return breakdown;
};

/* Deviation helper for Plan vs Reality rows */
const deviationColor = (planned, actual, tolerance) => {
  if (planned == null || actual == null) return 'text-gray-500';
  const diff = Math.abs(planned - actual);
  return diff <= tolerance ? 'text-green-600' : 'text-red-600';
};

/* --------------------------------------------------------------------------
   COMPONENT
   -------------------------------------------------------------------------- */

const SmartJournal = () => {
  /* UI state */
  const [expanded, setExpanded] = useState(null);
  const [tagFilters, setTagFilters] = useState([]);
  const [strategyFilter, setStrategyFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  /* Filtered trades */
  const trades = useMemo(() => {
    return mockTrades.filter((t) => {
      const tagOK =
        tagFilters.length === 0 || tagFilters.every((tag) => t.tags?.includes(tag));
      const stratOK = !strategyFilter || t.strategy === strategyFilter;
      return tagOK && stratOK;
    });
  }, [tagFilters, strategyFilter]);

  /* Quick insights (same logic you had) */
  const insights = useMemo(() => {
    const out = [];
    const last50 = mockTrades.slice(0, 50);

    /** Strategy stats */
    const stats = {};
    last50.forEach((t) => {
      if (!stats[t.strategy])
        stats[t.strategy] = { wins: 0, total: 0, adh: [], rrs: [] };
      stats[t.strategy].total += 1;
      if (t.outcome === 'Win') stats[t.strategy].wins += 1;
      stats[t.strategy].adh.push(t.adherence);
      stats[t.strategy].rrs.push(t.rr);
    });

    Object.entries(stats).forEach(([strat, s]) => {
      if (s.total < 3) return;
      const win = (s.wins / s.total) * 100;
      const avgAdh =
        s.adh.reduce((a, b) => a + b, 0) / s.adh.length;
      const avgRR =
        s.rrs.reduce((a, b) => a + b, 0) / s.rrs.length;

      out.push({
        msg: `${strat} trades: ${avgAdh.toFixed(
          0
        )}% adherence, ${win.toFixed(0)}% win-rate, ${avgRR.toFixed(1)}R avg`,
        type: win >= 60 ? 'positive' : win <= 40 ? 'negative' : 'neutral',
      });
    });

    /* Entry misses */
    const misses = last50.filter((t) => {
      if (!t.plan?.entry || !t.exec?.entry) return false;
      const r = Math.abs(t.plan.entry - t.plan.stop);
      return Math.abs(t.exec.entry - t.plan.entry) > r * 0.25;
    });
    if (misses.length)
      out.push({
        msg: `Missed entries in ${(misses.length / last50.length) * 100
          ).toFixed(0)}% of trades — refine timing`,
        type: 'negative',
      });

    /* Best time bucket */
    const buckets = {};
    last50.forEach((t) => {
      if (!buckets[t.timeBucket]) buckets[t.timeBucket] = { wins: 0, tot: 0 };
      buckets[t.timeBucket].tot += 1;
      if (t.outcome === 'Win') buckets[t.timeBucket].wins += 1;
    });
    const best = Object.entries(buckets)
      .filter(([, b]) => b.tot >= 2)
      .sort((a, b) => b[1].wins / b[1].tot - a[1].wins / a[1].tot)[0];
    if (best)
      out.push({
        msg: `Best performance: ${best[0]} (${(
          (best[1].wins / best[1].tot) *
          100
        ).toFixed(0)}% win-rate)`,
        type: 'positive',
      });

    return out;
  }, []);

  /* Tag & strategy sets */
  const allTags = [...new Set(mockTrades.flatMap((t) => t.tags || []))];
  const allStrats = [...new Set(mockTrades.map((t) => t.strategy))];

  /* Helpers for table */
  const outcomeBadge = (o) => (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium ${
        o === 'Win'
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      {o}
    </span>
  );
  const adhText = (s) => (
    <span
      className={`font-semibold ${
        s >= 75 ? 'text-green-600' : s >= 50 ? 'text-yellow-600' : 'text-red-600'
      }`}
    >
      {s}%
    </span>
  );

  /* Toggle filter tag */
  const toggleTag = (tag) =>
    setTagFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  /* ---------------------------------------------------------------------- */

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Smart Journal</h1>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </header>

      {/* Insights */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
        <h2 className="flex items-center gap-2 font-semibold mb-3">
          <Zap className="h-5 w-5 text-blue-600" />
          Live Insights (last 50)
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          {insights.map((i, idx) => {
            const cls =
              i.type === 'positive'
                ? 'bg-green-100 text-green-800'
                : i.type === 'negative'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800';
            return (
              <div key={idx} className={`p-3 rounded-lg flex gap-2 ${cls}`}>
                {i.type === 'positive' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : i.type === 'negative' ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <BarChart3 className="h-4 w-4" />
                )}
                <span className="text-sm">{i.msg}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Filters */}
      {showFilters && (
        <section className="bg-white shadow rounded-lg p-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Tags */}
            <div>
              <h3 className="font-medium mb-2">Filter by Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-sm px-2 py-1 rounded ${
                      tagFilters.includes(tag)
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            {/* Strategy */}
            <div>
              <h3 className="font-medium mb-2">Filter by Strategy</h3>
              <select
                value={strategyFilter}
                onChange={(e) => setStrategyFilter(e.target.value)}
                className="w-full p-2 border rounded text-sm"
              >
                <option value="">All Strategies</option>
                {allStrats.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          {(tagFilters.length || strategyFilter) && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Showing {trades.length} / {mockTrades.length}
              </span>
              <button
                onClick={() => {
                  setTagFilters([]);
                  setStrategyFilter('');
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                Clear all
              </button>
            </div>
          )}
        </section>
      )}

      {/* Trades table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Symbol</th>
              <th className="px-4 py-3 text-left">Strategy / Tags</th>
              <th className="px-4 py-3 text-left">R</th>
              <th className="px-4 py-3 text-left">P&L</th>
              <th className="px-4 py-3 text-left">Hold</th>
              <th className="px-4 py-3 text-left">Outcome</th>
              <th className="px-4 py-3 text-left">Adh.</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {trades.map((t) => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">{t.date}</td>
                <td className="px-4 py-3 font-medium">{t.symbol}</td>
                <td className="px-4 py-3">
                  <span className="font-semibold">{t.strategy}</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {t.tags.slice(0, 2).map((tg) => (
                      <span
                        key={tg}
                        className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded"
                      >
                        {tg}
                      </span>
                    ))}
                    {t.tags.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{t.tags.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">{t.rr}R</td>
                <td className="px-4 py-3">
                  <span
                    className={`font-medium ${
                      t.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {t.pnl >= 0 ? '+' : ''}
                    ${t.pnl}
                  </span>
                </td>
                <td className="px-4 py-3">{t.holdTime}h</td>
                <td className="px-4 py-3">{outcomeBadge(t.outcome)}</td>
                <td className="px-4 py-3">{adhText(t.adherence)}</td>
                <td className="px-2 py-3 text-right">
                  <button
                    onClick={() => setExpanded(expanded?.id === t.id ? null : t)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {expanded?.id === t.id ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drill-down */}
      {expanded && (
        <section className="bg-white shadow rounded-lg p-6 relative">
          <button
            onClick={() => setExpanded(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <header className="pr-8">
            <h2 className="text-lg font-semibold mb-1">
              Trade {expanded.id} — {expanded.symbol}
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              {expanded.strategy} • {expanded.date} • {expanded.timeBucket}
            </p>
          </header>

          {/* Adherence breakdown */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Adherence Breakdown</h3>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              {(() => {
                const bd = calcAdherenceBreakdown(expanded);
                const Item = ({ ok, label }) => (
                  <div className="flex items-center gap-1.5">
                    {ok ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                    <span>{label}</span>
                  </div>
                );
                return (
                  <>
                    <Item ok={bd.entry} label="Entry" />
                    <Item ok={bd.stop} label="Stop" />
                    <Item ok={bd.target} label="Target" />
                    <Item ok={bd.size} label="Size" />
                  </>
                );
              })()}
            </div>
            <p className="mt-2 text-sm">
              Adherence:{' '}
              {adhText(calcAdherenceBreakdown(expanded).score)}
            </p>
          </div>

          {/* Trade stats */}
          <div className="mb-6 grid md:grid-cols-4 gap-4 text-sm">
            <Stat
              label="Hold Time"
              value={`${expanded.holdTime}h`}
            />
            <Stat label="Time Bucket" value={expanded.timeBucket} />
            <Stat
              label="Position $"
              value={`$${(
                expanded.exec.size * expanded.exec.entry
              ).toLocaleString()}`}
            />
            <Stat
              label="R Multiple"
              value={`${expanded.rr > 0 ? '+' : ''}${expanded.rr}R`}
              color={expanded.rr >= 0 ? 'green' : 'red'}
            />
          </div>

          {/* Plan vs Reality */}
          <h3 className="font-medium mb-2">Plan vs Reality</h3>
          <div className="border rounded-lg overflow-hidden divide-y text-sm mb-6">
            {[
              ['Entry', expanded.plan.entry, expanded.exec.entry, 0.25],
              ['Stop / Exit', expanded.plan.stop, expanded.exec.exit, 0.02],
              ['Target', expanded.plan.target, expanded.exec.exit, 0.05],
              ['Size', expanded.plan.size, expanded.exec.size, 0.1],
            ].map(([lbl, planned, actual, tol]) => (
              <Row
                key={lbl}
                label={lbl}
                planned={planned}
                actual={actual}
                tolerance={
                  lbl === 'Size' ? planned * tol : Math.abs(planned - expanded.plan.stop) * tol
                }
              />
            ))}
          </div>

          {/* Tags */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {expanded.tags.map((tg) => (
                <span
                  key={tg}
                  className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded"
                >
                  {tg}
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          {expanded.notes && (
            <div>
              <h3 className="font-medium mb-2">Notes</h3>
              <p className="bg-gray-50 p-3 rounded text-sm text-gray-700">
                {expanded.notes}
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

/* --------------------------------------------------------------------------
   SMALL REUSABLE SUB-COMPONENTS
   -------------------------------------------------------------------------- */

const Stat = ({ label, value, color }) => (
  <div className="space-y-0.5">
    <p className="text-gray-500">{label}</p>
    <p
      className={`font-medium ${
        color === 'green'
          ? 'text-green-600'
          : color === 'red'
          ? 'text-red-600'
          : ''
      }`}
    >
      {value}
    </p>
  </div>
);

const Row = ({ label, planned, actual, tolerance }) => {
  const cls = deviationColor(planned, actual, tolerance);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4">
      <Cell lbl={label} />
      <Cell lbl="Planned" val={planned} />
      <Cell lbl="Actual" val={actual} valCls={cls} />
    </div>
  );
};

const Cell = ({ lbl, val, valCls }) => (
  <div className="px-3 py-2 border-r last:border-r-0">
    {val == null ? (
      <span className="text-gray-500">{lbl}</span>
    ) : (
      <>
        <p className="text-xs text-gray-500">{lbl}</p>
        <p className={`font-medium ${valCls || ''}`}>${val}</p>
      </>
    )}
  </div>
);

export default SmartJournal;
