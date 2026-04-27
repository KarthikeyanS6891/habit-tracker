import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import habitRoutes from './routes/habits.js';
import userRoutes from './routes/users.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.get('/api/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
};

start().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
