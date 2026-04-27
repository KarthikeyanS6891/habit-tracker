import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatShort } from '../utils/date.js';

export default function ProgressChart({ series }) {
  const data = (series || []).map((p) => ({
    date: formatShort(p.date),
    completed: p.completed,
    total: p.total,
  }));

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Last 30 days</h3>
        <span className="text-xs text-slate-500">Habits completed per day</span>
      </div>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: 'rgba(15,23,42,0.92)',
                border: 'none',
                borderRadius: 12,
                color: '#fff',
                fontSize: 12,
              }}
            />
            <Area type="monotone" dataKey="completed" stroke="#6366f1" fill="url(#g1)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
