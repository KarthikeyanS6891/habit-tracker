import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ListChecks, Trophy, User, LogOut, Moon, Sun, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/habits', label: 'Habits', icon: ListChecks },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-slate-200 md:dark:border-slate-800 md:bg-white md:dark:bg-slate-900">
        <div className="px-6 py-5 flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-brand-600 grid place-items-center text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="font-semibold leading-tight">Habit Tracker</div>
            <div className="text-xs text-slate-500">Lvl {user?.level} · {user?.points} pts</div>
          </div>
        </div>
        <nav className="px-3 mt-2 space-y-1 flex-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-100'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <button onClick={toggle} className="btn-ghost w-full justify-start">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <button onClick={handleLogout} className="btn-ghost w-full justify-start text-red-600">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 grid place-items-center text-white">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">Habit Tracker</div>
            <div className="text-[11px] text-slate-500">Lvl {user?.level} · {user?.points} pts</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={toggle} className="btn-ghost px-2 py-2">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={handleLogout} className="btn-ghost px-2 py-2 text-red-600">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-24 md:pb-8">
        <div className="max-w-5xl mx-auto px-4 py-5 md:py-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-4">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 text-xs ${
                  isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500'
                }`
              }
            >
              <Icon size={20} />
              <span className="mt-0.5">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
