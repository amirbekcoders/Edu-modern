
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, LogOut, LayoutDashboard, Globe, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };


  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 rounded-none rounded-b-2xl px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-neon group-hover:scale-110 transition-transform duration-300">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            Albion Physics
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/courses" className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/courses' ? 'text-primary' : 'text-textMuted'}`}>
            {t("Courses")}
          </Link>
          <Link to="/teachers" className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/teachers' ? 'text-primary' : 'text-textMuted'}`}>
            {t("Teachers")}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group/lang flex items-center">
            <button className="flex items-center gap-1 text-textMuted hover:text-primary transition-colors text-sm font-medium">
              <Globe className="w-4 h-4" />
              {i18n.language?.toUpperCase() || 'RU'}
            </button>
            <div className="absolute top-full right-0 mt-2 w-32 bg-surface border border-white/10 rounded-xl shadow-lg opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all z-50 overflow-hidden">
              <button onClick={() => changeLanguage('uz')} className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors">O'zbek</button>
              <button onClick={() => changeLanguage('ru')} className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors">Русский</button>
              <button onClick={() => changeLanguage('en')} className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors">English</button>
            </div>
          </div>
          {user ? (
            <div className="flex items-center gap-4">
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-outline !py-2 !px-4 text-sm">
                {user.role === 'admin' ? (
                  <>
                    <LayoutDashboard className="w-4 h-4" />
                    {t("Admin Panel")}
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    {t("Profile")}
                  </>
                )}
              </Link>
              <button onClick={signOut} className="text-textMuted hover:text-danger transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-textMuted hover:text-white transition-colors">
                {t("Login")}
              </Link>
              <Link to="/register" className="btn-primary !py-2 !px-4 text-sm">
                {t("Sign Up")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
