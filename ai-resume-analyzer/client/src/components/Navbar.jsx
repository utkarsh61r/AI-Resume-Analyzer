import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, History, LogOut, LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLink = (to, label, icon) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
        ${location.pathname === to
          ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }`}
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0a14]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/30 transition-shadow">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white hidden sm:block">
              Resume<span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLink('/dashboard', 'Analyzer', null)}
            {user && navLink('/history', 'History', <History className="w-4 h-4" />)}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <span className="text-sm text-indigo-300 font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200 shadow-lg hover:shadow-indigo-500/25"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#0a0a14]/95 px-4 py-4 space-y-2">
          {navLink('/dashboard', 'Analyzer', null)}
          {user && navLink('/history', 'History', <History className="w-4 h-4" />)}
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          ) : (
            <Link to="/auth" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-indigo-600 text-white">
              <LogIn className="w-4 h-4" /> Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
