import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Loader } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Handle redirect if user is already logged in or after successful login
  useEffect(() => {
    if (user) {
      // Determine where to send the user based on role
      const destination = user.role === 'admin' ? '/admin' : '/dashboard';
      // Use the 'from' location if it exists (e.g. they were redirected here)
      const from = location.state?.from?.pathname || destination;
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // No navigate here because AuthContext onAuthStateChange will trigger, update user, and useEffect will navigate
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="glass-panel p-8 md:p-12 w-full max-w-md relative overflow-hidden">
        <div className="absolute top-[-50px] right-[-50px] w-[100px] h-[100px] bg-primary/30 blur-[40px] rounded-full pointer-events-none" />
        
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-3xl font-display font-bold mb-2">Welcome Back</h1>
          <p className="text-textMuted text-sm">Log in to continue your learning journey.</p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-sm font-medium text-textMuted">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-textMuted/50" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-11"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-textMuted">Password</label>
              <Link to="/forgot-password" className="text-xs text-primary hover:text-primaryHover transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-textMuted/50" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-11"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-textMuted mt-8 relative z-10">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:text-white transition-colors font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
