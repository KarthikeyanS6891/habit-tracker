// Points awarded per habit completion + streak bonus.
// Level curve: level n requires n*100 cumulative points.

export const POINTS_PER_COMPLETION = 10;
export const STREAK_BONUS = (streak) => Math.min(streak, 30); // cap bonus

export const computeLevel = (points) => {
  // Inverse of cumulative requirement L*(L+1)/2 * 100 ≈ points
  let level = 1;
  let needed = 100;
  let total = 0;
  while (points >= total + needed) {
    total += needed;
    level += 1;
    needed = level * 100;
  }
  return { level, pointsIntoLevel: points - total, pointsForNext: needed };
};

export const BADGE_RULES = [
  { id: 'first-step', label: 'First Step', test: ({ totalCompletions }) => totalCompletions >= 1 },
  { id: 'week-warrior', label: 'Week Warrior', test: ({ longestStreak }) => longestStreak >= 7 },
  { id: 'fortnight', label: 'Fortnight', test: ({ longestStreak }) => longestStreak >= 14 },
  { id: 'month-master', label: 'Month Master', test: ({ longestStreak }) => longestStreak >= 30 },
  { id: 'century', label: 'Century Club', test: ({ totalCompletions }) => totalCompletions >= 100 },
  { id: 'collector', label: 'Habit Collector', test: ({ habitCount }) => habitCount >= 5 },
];

export const evaluateBadges = (stats) =>
  BADGE_RULES.filter((b) => b.test(stats)).map((b) => b.id);
