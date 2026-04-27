import Habit from '../models/Habit.js';
import User from '../models/User.js';
import { computeStreaks, toDateStr } from '../utils/streaks.js';
import {
  POINTS_PER_COMPLETION,
  STREAK_BONUS,
  computeLevel,
  evaluateBadges,
} from '../utils/rewards.js';

export const listHabits = async (req, res) => {
  const habits = await Habit.find({ user: req.user._id, archived: false }).sort({ createdAt: 1 });
  res.json({ habits });
};

export const createHabit = async (req, res) => {
  const { title, description, icon, color, frequency, targetPerWeek } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const habit = await Habit.create({
    user: req.user._id,
    title,
    description,
    icon,
    color,
    frequency,
    targetPerWeek,
  });
  res.status(201).json({ habit });
};

export const updateHabit = async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
  if (!habit) return res.status(404).json({ message: 'Habit not found' });

  const fields = ['title', 'description', 'icon', 'color', 'frequency', 'targetPerWeek', 'archived'];
  for (const f of fields) if (f in req.body) habit[f] = req.body[f];
  await habit.save();
  res.json({ habit });
};

export const deleteHabit = async (req, res) => {
  const result = await Habit.deleteOne({ _id: req.params.id, user: req.user._id });
  if (!result.deletedCount) return res.status(404).json({ message: 'Habit not found' });
  res.json({ ok: true });
};

/**
 * Toggle a completion for a given date (defaults to today).
 * Awards/removes points and recomputes streaks + badges atomically per request.
 */
export const toggleCompletion = async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
  if (!habit) return res.status(404).json({ message: 'Habit not found' });

  const date = req.body.date || toDateStr();
  const idx = habit.completions.findIndex((c) => c.date === date);
  const wasCompleted = idx !== -1;

  if (wasCompleted) habit.completions.splice(idx, 1);
  else habit.completions.push({ date });

  const { currentStreak, longestStreak, lastCompletedAt } = computeStreaks(habit.completions);
  habit.currentStreak = currentStreak;
  habit.longestStreak = longestStreak;
  habit.lastCompletedAt = lastCompletedAt;
  await habit.save();

  // Update user points & badges
  const user = await User.findById(req.user._id);
  const delta = wasCompleted
    ? -(POINTS_PER_COMPLETION + STREAK_BONUS(currentStreak))
    : POINTS_PER_COMPLETION + STREAK_BONUS(currentStreak);
  user.points = Math.max(0, user.points + delta);
  user.level = computeLevel(user.points).level;

  const allHabits = await Habit.find({ user: user._id });
  const totalCompletions = allHabits.reduce((acc, h) => acc + h.completions.length, 0);
  const longest = allHabits.reduce((acc, h) => Math.max(acc, h.longestStreak), 0);
  user.badges = evaluateBadges({
    totalCompletions,
    longestStreak: longest,
    habitCount: allHabits.length,
  });
  await user.save();

  res.json({ habit, user: { points: user.points, level: user.level, badges: user.badges } });
};

/**
 * Aggregated stats for the dashboard (last N days).
 */
export const getStats = async (req, res) => {
  const days = Math.min(parseInt(req.query.days, 10) || 30, 365);
  const habits = await Habit.find({ user: req.user._id, archived: false });

  // Build a daily map: date -> { completed, total }
  const today = toDateStr();
  const series = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = toDateStr(d);
    const completed = habits.reduce(
      (acc, h) => acc + (h.completions.some((c) => c.date === date) ? 1 : 0),
      0
    );
    series.push({ date, completed, total: habits.length });
  }

  const totalCompletions = habits.reduce((acc, h) => acc + h.completions.length, 0);
  const longestStreak = habits.reduce((acc, h) => Math.max(acc, h.longestStreak), 0);
  const completedToday = habits.reduce(
    (acc, h) => acc + (h.completions.some((c) => c.date === today) ? 1 : 0),
    0
  );

  res.json({
    series,
    totals: {
      habits: habits.length,
      completedToday,
      totalCompletions,
      longestStreak,
    },
  });
};
