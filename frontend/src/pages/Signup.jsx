import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await signup(form.name, form.email, form.password);
      toast.success('Account created. Let\'s build a habit!');
      nav('/');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Sign up failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md card p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-600 grid place-items-center text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Create an account</h1>
            <p className="text-xs text-slate-500">Track habits, earn rewards, and level up</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="label">Name</label>
            <input
              required
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              required
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button disabled={busy} className="btn-primary w-full">{busy ? 'Creating…' : 'Sign up'}</button>
        </form>
        <p className="text-sm text-center mt-4 text-slate-500">
          Already have one?{' '}
          <Link to="/login" className="text-brand-600 font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}
