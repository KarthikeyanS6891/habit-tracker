import User from '../models/User.js';
import { signToken } from '../middleware/auth.js';

const sanitize = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  points: u.points,
  level: u.level,
  badges: u.badges,
  theme: u.theme,
  createdAt: u.createdAt,
});

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 chars' });

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ message: 'Email already registered' });

  const user = await User.create({ name, email, password });
  const token = signToken(user._id);
  res.status(201).json({ user: sanitize(user), token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signToken(user._id);
  res.json({ user: sanitize(user), token });
};

export const me = async (req, res) => {
  res.json({ user: sanitize(req.user) });
};
