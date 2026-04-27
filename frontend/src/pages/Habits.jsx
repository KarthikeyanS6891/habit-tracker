import { useEffect, useState } from 'react';
import HabitCard from '../components/HabitCard.jsx';
import HabitForm from '../components/HabitForm.jsx';
import * as habitsApi from '../api/habits.js';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

export default function Habits() {
  const { setUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    habitsApi.listHabits().then(setHabits).catch(() => toast.error('Failed to load'));
  }, []);

  const submit = async (data) => {
    try {
      if (editing) {
        const u = await habitsApi.updateHabit(editing._id, data);
        setHabits((prev) => prev.map((h) => (h._id === u._id ? u : h)));
      } else {
        const c = await habitsApi.createHabit(data);
        setHabits((prev) => [...prev, c]);
      }
      setShowForm(false);
      setEditing(null);
    } catch {
      toast.error('Save failed');
    }
  };

  const toggle = async (habit) => {
    setBusyId(habit._id);
    try {
      const { habit: u, user: usr } = await habitsApi.toggleHabit(habit._id);
      setHabits((prev) => prev.map((h) => (h._id === u._id ? u : h)));
      if (usr) setUser((cur) => ({ ...cur, ...usr }));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (habit) => {
    if (!confirm(`Delete "${habit.title}"?`)) return;
    await habitsApi.deleteHabit(habit._id);
    setHabits((prev) => prev.filter((h) => h._id !== habit._id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All habits</h1>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary">+ New habit</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {habits.map((h) => (
          <HabitCard
            key={h._id}
            habit={h}
            onToggle={toggle}
            onEdit={(habit) => { setEditing(habit); setShowForm(true); }}
            onDelete={remove}
            busy={busyId === h._id}
          />
        ))}
      </div>

      <HabitForm
        open={showForm}
        initial={editing}
        onClose={() => { setShowForm(false); setEditing(null); }}
        onSubmit={submit}
      />
    </div>
  );
}
