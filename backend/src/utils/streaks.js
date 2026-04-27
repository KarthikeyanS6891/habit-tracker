// Helpers for date math and streak calculations.
// All "date" values are ISO YYYY-MM-DD strings in the user's local timezone.

export const toDateStr = (d = new Date()) => {
  const tz = d.getTimezoneOffset();
  const local = new Date(d.getTime() - tz * 60000);
  return local.toISOString().slice(0, 10);
};

export const addDays = (dateStr, days) => {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return toDateStr(d);
};

export const diffInDays = (a, b) => {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  return Math.round((da - db) / (1000 * 60 * 60 * 24));
};

/**
 * Recompute current and longest streaks from a list of completion dates.
 * A streak counts consecutive days up to "today" (or yesterday if today not done).
 */
export const computeStreaks = (completions, today = toDateStr()) => {
  if (!completions?.length) return { currentStreak: 0, longestStreak: 0, lastCompletedAt: null };
  const set = new Set(completions.map((c) => c.date));
  const sorted = [...set].sort();
  const lastCompletedAt = sorted[sorted.length - 1];

  // longest
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (diffInDays(sorted[i], sorted[i - 1]) === 1) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }

  // current — walk back from today
  let cursor = set.has(today) ? today : set.has(addDays(today, -1)) ? addDays(today, -1) : null;
  let current = 0;
  while (cursor && set.has(cursor)) {
    current += 1;
    cursor = addDays(cursor, -1);
  }

  return { currentStreak: current, longestStreak: longest, lastCompletedAt };
};
