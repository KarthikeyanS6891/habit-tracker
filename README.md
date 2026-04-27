# Habit Tracker

A full-stack, mobile-first habit tracker with streaks, points, badges, charts, dark mode, and PWA support.

## Tech stack

- **Frontend:** React 18 + Vite + Tailwind CSS, React Router, Recharts, Axios, react-hot-toast, vite-plugin-pwa
- **Backend:** Node.js + Express, JWT auth, Helmet, rate limiting, Morgan
- **Database:** MongoDB (Mongoose ODM)

## Folder structure

```
HabitTracker/
├── backend/
│   ├── src/
│   │   ├── config/db.js              # Mongo connection
│   │   ├── controllers/              # Route handlers (auth, habits, users)
│   │   ├── middleware/               # auth (JWT) + error handler
│   │   ├── models/                   # User, Habit
│   │   ├── routes/                   # /auth, /habits, /users
│   │   ├── utils/                    # streaks.js, rewards.js
│   │   └── server.js                 # Express bootstrap
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/                      # axios client + endpoint wrappers
    │   ├── components/               # Layout, HabitCard, HabitForm, Chart, Stats
    │   ├── context/                  # AuthContext, ThemeContext
    │   ├── pages/                    # Login, Signup, Dashboard, Habits, Leaderboard, Profile
    │   ├── utils/date.js
    │   ├── App.jsx, main.jsx, index.css
    ├── public/favicon.svg
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js (with PWA plugin)
    └── package.json
```

## Features implemented

| Area | Details |
|---|---|
| Auth | JWT signup / login / `me` endpoint, bcrypt-hashed passwords, route protection |
| Habits | Create, edit, delete, archive, daily/weekly frequency, color, target/week |
| Tracking | One-tap toggle for any day; recomputes current + longest streak |
| Rewards | +10 points/completion + streak bonus (capped), level curve, 6 unlockable badges |
| Dashboard | Today's progress, 4 KPI cards, 30-day area chart |
| Leaderboard | Top 20 users by points |
| Theme | Light/dark toggle, syncs with system preference, persists in localStorage |
| PWA | `vite-plugin-pwa` registers a service worker; installable, offline shell |
| Notifications | Browser Notification API nudge at 8pm local; toast fallback |
| Data export | JSON export of user + habits from Profile page |
| Mobile UX | Bottom tab bar on mobile, sidebar on desktop, large tap targets |

## Setup

### 1. Prerequisites

- Node.js 18+
- A MongoDB instance — local (`brew services start mongodb-community`) or MongoDB Atlas (free tier works)

### 2. Backend

```bash
cd backend
cp .env.example .env
# edit MONGO_URI and JWT_SECRET
npm install
npm run dev
```

API will run at `http://localhost:5000` with these routes:

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/signup` | `{ name, email, password }` → `{ user, token }` |
| POST | `/api/auth/login` | `{ email, password }` → `{ user, token }` |
| GET  | `/api/auth/me` | current user (auth) |
| GET  | `/api/habits` | list (auth) |
| POST | `/api/habits` | create (auth) |
| PATCH| `/api/habits/:id` | update (auth) |
| DELETE| `/api/habits/:id` | delete (auth) |
| POST | `/api/habits/:id/toggle` | `{ date? }` toggle completion (auth) |
| GET  | `/api/habits/stats?days=30` | dashboard series (auth) |
| GET  | `/api/users/leaderboard` | top 20 (auth) |
| GET  | `/api/users/progress` | level progress (auth) |
| PATCH| `/api/users/me` | update name/theme (auth) |

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App will run at `http://localhost:5173`.

## How streaks & rewards work

- Each habit stores an array of `{ date: 'YYYY-MM-DD' }` completions.
- On every toggle, the backend recomputes `currentStreak` and `longestStreak` (`backend/src/utils/streaks.js`).
- Points awarded per completion: `10 + min(currentStreak, 30)`. Removed if you un-toggle.
- Level formula: cumulative threshold of `n*100` per level (`backend/src/utils/rewards.js`).
- Badges (auto-evaluated on every toggle):

| Badge | Rule |
|---|---|
| First Step | first completion ever |
| Week Warrior | longest streak ≥ 7 |
| Fortnight | longest streak ≥ 14 |
| Month Master | longest streak ≥ 30 |
| Century Club | 100 total completions |
| Habit Collector | 5+ habits |

## Deployment

### Backend → Render / Railway / Fly.io

1. Push the repo to GitHub.
2. Create a new Web Service pointing at `backend/`. Build command: `npm install`. Start: `npm start`.
3. Set env vars: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your frontend origin), `NODE_ENV=production`.
4. Add a free MongoDB Atlas cluster and whitelist `0.0.0.0/0` (or the host's egress IPs).

### Frontend → Vercel / Netlify

1. Connect the repo, set the project root to `frontend/`.
2. Build command: `npm run build`. Output dir: `dist`.
3. Set env var `VITE_API_URL=https://your-backend.onrender.com/api`.
4. Add a redirect for SPA routing (Vercel handles this automatically; for Netlify add `_redirects` with `/* /index.html 200`).

## Notes / next steps

- The Notification API reminder is in-tab only. For real reminders, plug Web Push (VAPID) into the existing service worker.
- OAuth is not wired up; the auth layer is JWT-only. Add Google/GitHub by mounting `passport-google-oauth20` on the backend and exchanging the OAuth profile for a JWT.
- Import functionality is stubbed — wire it to `POST /api/habits` in a loop or add a bulk endpoint when needed.
