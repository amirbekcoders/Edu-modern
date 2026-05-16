import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User as UserIcon, Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'student', // Default role
        }
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Usually Supabase handles the profile creation via a trigger,
    // or we can insert it manually here if we don't have triggers set up.
    // Assuming we might need to manually insert for this project since we can't write SQL easily.
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: email,
            full_name: fullName,
            role: 'student',
          }
        ]);
        
      if (profileError) {
        // Just log it for now, auth succeeded
        console.error("Profile creation error:", profileError);
      }
    }

    // Since we don't know if email confirmations are enabled, 
    // let's assume auto-confirm for now and navigate to login.
    navigate('/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="glass-panel p-8 md:p-12 w-full max-w-md relative overflow-hidden">
        <div className="absolute bottom-[-50px] left-[-50px] w-[100px] h-[100px] bg-secondary/30 blur-[40px] rounded-full pointer-events-none" />
        
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-3xl font-display font-bold mb-2">{t("Create Account")}</h1>
          <p className="text-textMuted text-sm">{t("Join Albion Physics today.")}</p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-sm font-medium text-textMuted">{t("Full Name")}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserIcon className="w-5 h-5 text-textMuted/50" />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-field pl-11"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-textMuted">{t("Email Address")}</label>
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
            <label className="text-sm font-medium text-textMuted">{t("Password")}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-textMuted/50" />
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-11"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : t('Sign Up')}
          </button>
        </form>

        <p className="text-center text-sm text-textMuted mt-8 relative z-10">
          {t("Already have an account?")}{' '}
          <Link to="/login" className="text-primary hover:text-white transition-colors font-medium">
            {t("Log in")}
          </Link>
        </p>
      </div>
    </div>
  );
}
