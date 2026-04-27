import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Habits from './pages/Habits.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Profile from './pages/Profile.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { useReminders } from './hooks/useReminders.js';
import { DEFAULT_REMINDER_HOURS } from './utils/motivation.js';

function ReminderHost() {
  const { user } = useAuth();
  useReminders({
    enabled: !!user && user.notificationsEnabled !== false,
    hours: user?.reminderHours?.length ? user.reminderHours : DEFAULT_REMINDER_HOURS,
  });
  return null;
}

export default function App() {
  return (
    <>
      <ReminderHost />
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
