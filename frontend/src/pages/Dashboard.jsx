import { useEffect, useState } from 'react';
import { Flame, CheckCircle2, ListChecks, Trophy } from 'lucide-react';
import StatsCard from '../components/StatsCard.jsx';
import ProgressChart from '../components/ProgressChart.jsx';
import HabitCard from '../components/HabitCard.jsx';
import HabitForm from '../components/HabitForm.jsx';
import MotivationBanner from '../components/MotivationBanner.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import * as habitsApi from '../api/habits.js';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, setUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const refresh = async () => {
    const [hs, st] = await Promise.all([habitsApi.listHabits(), habitsApi.getStats(30)]);
    setHabits(hs);
    setStats(st);
  };

  useEffect(() => {
    refresh().catch((e) => toast.error(e?.response?.data?.message || 'Failed to load'));
  }, []);

  const handleToggle = async (habit) => {
    setBusyId(habit._id);
    try {
      const { habit: updated, user: u } = await habitsApi.toggleHabit(habit._id);
      setHabits((prev) => prev.map((h) => (h._id === updated._id ? updated : h)));
      if (u) setUser((cur) => ({ ...cur, ...u }));
      // Refresh stats for chart in background
      habitsApi.getStats(30).then(setStats).catch(() => {});
    } catch (e) {
      toast.error('Could not update');
    } finally {
      setBusyId(null);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editing) {
        const updated = await habitsApi.updateHabit(editing._id, data);
        setHabits((prev) => prev.map((h) => (h._id === updated._id ? updated : h)));
        toast.success('Habit updated');
      } else {
        const created = await habitsApi.createHabit(data);
        setHabits((prev) => [...prev, created]);
        toast.success('Habit created');
      }
      setShowForm(false);
      setEditing(null);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (habit) => {
    if (!confirm(`Delete "${habit.title}"?`)) return;
    try {
      await habitsApi.deleteHabit(habit._id);
      setHabits((prev) => prev.filter((h) => h._id !== habit._id));
      toast.success('Habit deleted');
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  const totals = stats?.totals || { habits: 0, completedToday: 0, longestStreak: 0, totalCompletions: 0 };
  const completionPct = totals.habits ? Math.round((totals.completedToday / totals.habits) * 100) : 0;

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Hi {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-sm text-slate-500">
            {totals.completedToday}/{totals.habits} habits done today · {completionPct}%
          </p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary">
          + New habit
        </button>
      </header>

      <MotivationBanner pending={totals.habits - totals.completedToday} total={totals.habits} />

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatsCard label="Today" value={`${totals.completedToday}/${totals.habits}`} icon={CheckCircle2} />
        <StatsCard label="Active habits" value={totals.habits} icon={ListChecks} />
        <StatsCard label="Longest streak" value={totals.longestStreak} icon={Flame} accent="text-orange-500" />
        <StatsCard label="Points" value={user?.points || 0} icon={Trophy} accent="text-yellow-500" />
      </section>

      {stats && <ProgressChart series={stats.series} />}

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Today's habits</h2>
        </div>

        {habits.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-slate-500">No habits yet — create your first one to start a streak.</p>
            <button onClick={() => setShowForm(true)} className="btn-primary mt-3">Add a habit</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {habits.map((h) => (
              <HabitCard
                key={h._id}
                habit={h}
                onToggle={handleToggle}
                onEdit={(habit) => { setEditing(habit); setShowForm(true); }}
                onDelete={handleDelete}
                busy={busyId === h._id}
              />
            ))}
          </div>
        )}
      </section>

      <HabitForm
        open={showForm}
        initial={editing}
        onClose={() => { setShowForm(false); setEditing(null); }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
