import User from '../models/User.js';
import { computeLevel } from '../utils/rewards.js';

const sanitize = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  points: u.points,
  level: u.level,
  badges: u.badges,
  theme: u.theme,
  notificationsEnabled: u.notificationsEnabled,
  reminderHours: u.reminderHours,
});

export const updateMe = async (req, res) => {
  const { name, theme, notificationsEnabled, reminderHours } = req.body;
  const user = await User.findById(req.user._id);

  if (typeof name === 'string' && name.trim()) user.name = name.trim();
  if (theme && ['light', 'dark'].includes(theme)) user.theme = theme;
  if (typeof notificationsEnabled === 'boolean') user.notificationsEnabled = notificationsEnabled;
  if (Array.isArray(reminderHours)) {
    const cleaned = [...new Set(reminderHours.map(Number))]
      .filter((h) => Number.isInteger(h) && h >= 0 && h <= 23)
      .sort((a, b) => a - b);
    if (cleaned.length) user.reminderHours = cleaned;
  }

  await user.save();
  res.json({ user: sanitize(user) });
};

export const getProgress = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ progress: { ...computeLevel(user.points), points: user.points, badges: user.badges } });
};

export const leaderboard = async (req, res) => {
  const top = await User.find({}, 'name points level badges')
    .sort({ points: -1 })
    .limit(20);
  res.json({ leaderboard: top });
};
