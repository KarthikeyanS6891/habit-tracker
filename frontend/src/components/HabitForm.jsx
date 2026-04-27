import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const COLORS = ['#6366f1', '#22c55e', '#f97316', '#ef4444', '#eab308', '#06b6d4', '#a855f7'];

export default function HabitForm({ open, initial, onClose, onSubmit, busy }) {
  const [form, setForm] = useState({ title: '', description: '', color: COLORS[0], frequency: 'daily', targetPerWeek: 7 });

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || '',
        description: initial.description || '',
        color: initial.color || COLORS[0],
        frequency: initial.frequency || 'daily',
        targetPerWeek: initial.targetPerWeek || 7,
      });
    } else if (open) {
      setForm({ title: '', description: '', color: COLORS[0], frequency: 'daily', targetPerWeek: 7 });
    }
  }, [initial, open]);

  if (!open) return null;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
      <form
        onSubmit={submit}
        className="card w-full max-w-md p-5 relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 btn-ghost px-2 py-2"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <h2 className="text-lg font-semibold mb-4">{initial ? 'Edit habit' : 'New habit'}</h2>

        <label className="label">Title</label>
        <input
          autoFocus
          className="input mb-3"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="e.g. Drink 2L water"
          maxLength={80}
        />

        <label className="label">Description (optional)</label>
        <textarea
          className="input mb-3 resize-none"
          rows={2}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          maxLength={280}
        />

        <label className="label">Color</label>
        <div className="flex gap-2 mb-3">
          {COLORS.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => set('color', c)}
              className={`w-7 h-7 rounded-full ring-2 ${form.color === c ? 'ring-slate-900 dark:ring-white' : 'ring-transparent'}`}
              style={{ background: c }}
              aria-label={`Pick ${c}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="label">Frequency</label>
            <select className="input" value={form.frequency} onChange={(e) => set('frequency', e.target.value)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div>
            <label className="label">Target / week</label>
            <input
              type="number"
              min={1}
              max={7}
              className="input"
              value={form.targetPerWeek}
              onChange={(e) => set('targetPerWeek', Number(e.target.value))}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button type="submit" disabled={busy} className="btn-primary">
            {initial ? 'Save changes' : 'Create habit'}
          </button>
        </div>
      </form>
    </div>
  );
}
