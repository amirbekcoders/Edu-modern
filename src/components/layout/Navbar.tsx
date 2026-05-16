
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, LogOut, LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();


  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 rounded-none rounded-b-2xl px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-neon group-hover:scale-110 transition-transform duration-300">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            Anti Gravity
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/courses" className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/courses' ? 'text-primary' : 'text-textMuted'}`}>
            Courses
          </Link>
          <Link to="/teachers" className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/teachers' ? 'text-primary' : 'text-textMuted'}`}>
            Teachers
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-outline !py-2 !px-4 text-sm">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <button onClick={signOut} className="text-textMuted hover:text-danger transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-textMuted hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/register" className="btn-primary !py-2 !px-4 text-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
