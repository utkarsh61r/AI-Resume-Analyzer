import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        toast.success('Welcome back!');
      } else {
        await register(form.name, form.email, form.password);
        toast.success('Account created!');
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.07] transition-all duration-200 text-sm";

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">
              Resume<span className="gradient-text">AI</span>
            </span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-white mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-slate-400 text-sm">
            {mode === 'login' ? 'Sign in to access your analysis history' : 'Save your analyses and track progress'}
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 border border-white/10">
          {/* Tabs */}
          <div className="flex bg-white/[0.04] rounded-xl p-1 mb-6 border border-white/[0.06]">
            {['login', 'register'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 capitalize
                  ${mode === m ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold hover:shadow-xl hover:shadow-indigo-500/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Or{' '}
            <Link to="/dashboard" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              continue without an account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
