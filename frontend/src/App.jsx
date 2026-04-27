import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Habits from './pages/Habits.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Profile from './pages/Profile.jsx';
import { useAuth } from './context/AuthContext.jsx';
import toast from 'react-hot-toast';

function ReminderNudge() {
  const { user } = useAuth();
  useEffect(() => {
    if (!user) return;
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'default') Notification.requestPermission();

    // Simple in-tab reminder check at 8pm local time
    const now = new Date();
    const reminderHour = 20;
    const next = new Date(now);
    next.setHours(reminderHour, 0, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    const ms = next - now;

    const id = setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification('Habit Tracker', { body: "Don't forget your habits today!" });
      } else {
        toast("Don't forget to check off your habits today!", { icon: '⏰' });
      }
    }, Math.min(ms, 2147483647));
    return () => clearTimeout(id);
  }, [user]);
  return null;
}

export default function App() {
  return (
    <>
      <ReminderNudge />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="habits" element={<Habits />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
