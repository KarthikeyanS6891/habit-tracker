import { Check, Flame, Pencil, Trash2 } from 'lucide-react';
import { todayStr, lastNDays } from '../utils/date.js';

export default function HabitCard({ habit, onToggle, onEdit, onDelete, busy }) {
  const today = todayStr();
  const completedSet = new Set((habit.completions || []).map((c) => c.date));
  const last7 = lastNDays(7);
  const completedToday = completedSet.has(today);

  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(habit)}
          disabled={busy}
          aria-label={completedToday ? 'Mark incomplete' : 'Mark complete'}
          className={`w-11 h-11 rounded-full grid place-items-center transition ${
            completedToday
              ? 'bg-brand-600 text-white'
              : 'border-2 border-slate-300 dark:border-slate-700 text-slate-400 hover:border-brand-500'
          } disabled:opacity-50`}
        >
          {completedToday ? <Check size={20} /> : <span className="block w-2 h-2 rounded-full bg-current" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold truncate">{habit.title}</h3>
            <span className="inline-flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
              <Flame size={14} /> {habit.currentStreak}
            </span>
          </div>
          {habit.description && (
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{habit.description}</p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => onEdit(habit)} className="btn-ghost px-2 py-2" aria-label="Edit habit">
            <Pencil size={16} />
          </button>
          <button onClick={() => onDelete(habit)} className="btn-ghost px-2 py-2 text-red-600" aria-label="Delete habit">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* 7-day strip */}
      <div className="flex items-center justify-between gap-1">
        {last7.map((d) => {
          const done = completedSet.has(d);
          const isToday = d === today;
          return (
            <div key={d} className="flex flex-col items-center gap-1 flex-1">
              <div
                className={`w-7 h-7 rounded-lg grid place-items-center text-[11px] font-semibold ${
                  done
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                } ${isToday ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900' : ''}`}
              >
                {done ? <Check size={14} /> : ''}
              </div>
              <span className="text-[10px] text-slate-400">
                {new Date(d + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'narrow' })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
