import { useEffect, useState } from 'react';
import { Trophy, Medal } from 'lucide-react';
import * as habitsApi from '../api/habits.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Leaderboard() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    habitsApi.getLeaderboard().then(setRows).catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="text-yellow-500" />
        <h1 className="text-2xl font-bold">Leaderboard</h1>
      </div>

      <div className="card divide-y divide-slate-200 dark:divide-slate-800">
        {rows.length === 0 && <div className="p-6 text-slate-500">No data yet.</div>}
        {rows.map((u, i) => {
          const isMe = u._id === user?.id;
          return (
            <div
              key={u._id}
              className={`flex items-center gap-3 px-4 py-3 ${isMe ? 'bg-brand-50 dark:bg-brand-500/10' : ''}`}
            >
              <div className="w-8 text-center font-semibold">
                {i < 3 ? <Medal className={['text-yellow-500', 'text-slate-400', 'text-orange-400'][i]} /> : `#${i + 1}`}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{u.name}{isMe && ' (you)'}</div>
                <div className="text-xs text-slate-500">Lvl {u.level} · {u.badges?.length || 0} badges</div>
              </div>
              <div className="font-semibold">{u.points} pts</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
