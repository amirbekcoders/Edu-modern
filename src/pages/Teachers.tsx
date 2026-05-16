import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, BookOpen } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { supabase } from '../lib/supabase';
import type { Teacher } from '../types';

const MOCK_TEACHERS = [
  {
    id: '1',
    full_name: 'Sarah Drasner',
    avatar_url: 'https://i.pravatar.cc/150?u=sarah',
    bio: 'Senior Developer Advocate, formerly at Netlify and Microsoft. Vue Core Team member and React expert.',
    experience_years: 12,
    rating: 4.9,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    full_name: 'Gary Simon',
    avatar_url: 'https://i.pravatar.cc/150?u=gary',
    bio: 'UI/UX Designer and Frontend Developer with a passion for creating beautiful digital experiences.',
    experience_years: 15,
    rating: 4.8,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    full_name: 'Lee Robinson',
    avatar_url: 'https://i.pravatar.cc/150?u=lee',
    bio: 'VP of Developer Experience at Vercel. Creator of Next.js tutorials and full-stack architecture guides.',
    experience_years: 10,
    rating: 5.0,
    created_at: new Date().toISOString()
  }
];

export default function Teachers() {
  const { t } = useSettings();
  const navigate = useNavigate();
  
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('teachers')
          .select('*');

        if (error || !data || data.length === 0) {
          setTeachers(MOCK_TEACHERS as unknown as Teacher[]);
        } else {
          setTeachers(data as unknown as Teacher[]);
        }
      } catch (err) {
        console.error("Error fetching teachers:", err);
        setTeachers(MOCK_TEACHERS as unknown as Teacher[]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleCardClick = (id: string) => {
    navigate(`/teachers/${id}`);
  };

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto mt-8">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{t('our_teachers')}</h1>
        <p className="text-textMuted text-lg">
          {t('our_teachers_desc')}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachers.map((teacher) => (
            <div 
              key={teacher.id} 
              onClick={() => handleCardClick(teacher.id)}
              className="cursor-pointer glass-card p-6 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300 animate-fade-in"
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <img 
                  src={teacher.avatar_url || `https://ui-avatars.com/api/?name=${teacher.full_name}&background=random`} 
                  alt={teacher.full_name} 
                  className="w-32 h-32 rounded-full object-cover relative z-10 border-4 border-surface"
                />
              </div>
              
              <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">{teacher.full_name}</h3>
              
              <div className="flex items-center justify-center gap-4 text-sm font-medium mb-4">
                <span className="flex items-center gap-1 text-warning">
                  <Star className="w-4 h-4 fill-warning" /> {teacher.rating}
                </span>
                <span className="text-textMuted">•</span>
                <span className="text-textMuted">{teacher.experience_years} Yrs Exp</span>
                <span className="text-textMuted">•</span>
                <span className="flex items-center gap-1 text-textMuted">
                  <BookOpen className="w-4 h-4" /> 
                </span>
              </div>
              
              <p className="text-textMuted text-sm mb-6 flex-grow">
                {teacher.bio}
              </p>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(teacher.id);
                }}
                className="btn-outline w-full text-sm group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300"
              >
                {t('view_profile')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
