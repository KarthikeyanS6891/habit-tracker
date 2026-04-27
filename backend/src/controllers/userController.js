import User from '../models/User.js';
import { computeLevel } from '../utils/rewards.js';

export const updateMe = async (req, res) => {
  const { name, theme } = req.body;
  const user = await User.findById(req.user._id);
  if (name) user.name = name;
  if (theme && ['light', 'dark'].includes(theme)) user.theme = theme;
  await user.save();
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      points: user.points,
      level: user.level,
      badges: user.badges,
      theme: user.theme,
    },
  });
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
