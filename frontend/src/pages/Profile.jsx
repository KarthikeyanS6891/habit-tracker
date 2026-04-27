import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Award, Download, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import * as habitsApi from '../api/habits.js';

const BADGE_LABELS = {
  'first-step': 'First Step',
  'week-warrior': 'Week Warrior',
  fortnight: 'Fortnight',
  'month-master': 'Month Master',
  century: 'Century Club',
  collector: 'Habit Collector',
};

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    habitsApi.getProgress().then(setProgress).catch(() => {});
  }, [user?.points]);

  const save = async () => {
    try {
      const updated = await habitsApi.updateProfile({ name });
      setUser((cur) => ({ ...cur, ...updated }));
      toast.success('Profile saved');
    } catch {
      toast.error('Save failed');
    }
  };

  const exportData = async () => {
    const habits = await habitsApi.listHabits();
    const blob = new Blob([JSON.stringify({ user, habits }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-tracker-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const pct = progress
    ? Math.round((progress.pointsIntoLevel / progress.pointsForNext) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <section className="card p-5 space-y-3">
        <div>
          <div className="label">Name</div>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <div className="label">Email</div>
          <input className="input" value={user?.email || ''} disabled />
        </div>
        <button onClick={save} className="btn-primary">Save changes</button>
      </section>

      <section className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Level {user?.level}</h2>
          <span className="text-sm text-slate-500">{user?.points} pts</span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div className="h-full bg-brand-600 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {progress ? `${progress.pointsIntoLevel} / ${progress.pointsForNext} pts to next level` : ''}
        </p>
      </section>

      <section className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Award className="text-brand-600" />
          <h2 className="font-semibold">Badges</h2>
        </div>
        {user?.badges?.length ? (
          <div className="flex flex-wrap gap-2">
            {user.badges.map((b) => (
              <span key={b} className="px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-200 text-xs font-medium">
                {BADGE_LABELS[b] || b}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Complete habits to earn badges.</p>
        )}
      </section>

      <section className="card p-5 space-y-2">
        <h2 className="font-semibold mb-2">Data</h2>
        <button onClick={exportData} className="btn-ghost w-full justify-start">
          <Download size={16} /> Export my data (JSON)
        </button>
        <label className="btn-ghost w-full justify-start cursor-pointer">
          <Upload size={16} /> Import (coming soon)
          <input type="file" className="hidden" disabled />
        </label>
      </section>
    </div>
  );
}
