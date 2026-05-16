
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { BookOpen, Award, Clock, PlayCircle } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">{t("Welcome back")}, {user?.full_name}</h1>
          <p className="text-textMuted">{t("Track your progress and pick up where you left off.")}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: t('Enrolled Courses'), value: '3', icon: BookOpen, color: 'text-primary' },
          { label: t('Completed Lessons'), value: '12', icon: PlayCircle, color: 'text-secondary' },
          { label: t('Hours Learned'), value: '8.5', icon: Clock, color: 'text-accent' },
          { label: t('Certificates'), value: '1', icon: Award, color: 'text-success' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-card p-6 flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-surface ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-textMuted">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Courses */}
      <div>
        <h2 className="text-2xl font-display font-bold mb-6">{t("Recent Courses")}</h2>
        <div className="glass-card p-12 text-center border-dashed border-2 border-white/10">
          <BookOpen className="w-12 h-12 text-textMuted mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">{t("No active courses yet")}</h3>
          <p className="text-textMuted mb-6">{t("Explore our catalog and start learning today.")}</p>
          <button className="btn-primary mx-auto">{t("Browse Courses")}</button>
        </div>
      </div>
    </div>
  );
}
