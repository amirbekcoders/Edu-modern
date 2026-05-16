import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';

// Fallback mock data in case of error
const MOCK_COURSES = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    description: 'Master modern React with hooks, context, and performance optimization techniques.',
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
    price: 49.99,
    teacher: { full_name: 'Sarah Drasner', rating: 4.9 },
    lessons_count: 24,
    duration: '12 hours',
    category: 'programming',
  }
];

export default function Courses() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamically compute unique categories from fetched courses
  const uniqueCategories = Array.from(new Set(courses.map(c => c.category).filter(Boolean)));
  const CATEGORIES = [
    { id: 'all', label: t('all') || 'All Courses' },
    ...uniqueCategories.map(cat => ({ id: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1) }))
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*, teacher:teachers(*)');

        if (error || !data || data.length === 0) {
          setCourses(MOCK_COURSES);
        } else {
          setCourses(data);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setCourses(MOCK_COURSES);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(
    course => activeCategory === 'all' || course.category === activeCategory
  );

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto mt-8">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{t('explore_courses')}</h1>
        <p className="text-textMuted text-lg">
          {t('explore_courses_desc')}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center">
        {CATEGORIES.map((category) => (
          <button 
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 capitalize ${
              activeCategory === category.id 
                ? 'bg-primary text-white shadow-neon scale-105' 
                : 'bg-surface border border-white/10 text-textMuted hover:text-white hover:border-white/30 hover:bg-white/5'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500">
          {filteredCourses.map((course) => (
            <Link to={`/courses/${course.id}`} key={course.id} className="glass-card overflow-hidden group hover:-translate-y-2 transition-all duration-300 flex flex-col animate-fade-in">
              <div className="relative h-48 overflow-hidden bg-surface">
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent z-10"></div>
                {course.thumbnail_url ? (
                  <img 
                    src={course.thumbnail_url} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-textMuted/50">
                    <BookOpen className="w-16 h-16" />
                  </div>
                )}
                <div className="absolute top-4 right-4 z-20 bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-accent border border-white/10">
                  ${course.price}
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center gap-2 text-xs text-textMuted mb-3">
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.lessons_count || 0} {t('lessons')}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration || '0 hours'}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">{course.title}</h3>
                <p className="text-textMuted text-sm mb-4 line-clamp-2 flex-grow">{course.description || 'No description available.'}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                      {course.teacher?.avatar_url ? (
                        <img src={course.teacher.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        (course.teacher?.full_name || 'U').charAt(0)
                      )}
                    </div>
                    <span className="text-sm font-medium text-textMuted">{course.teacher?.full_name || 'Unknown Teacher'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-warning text-sm font-medium">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    {course.teacher?.rating || '5.0'}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {!loading && filteredCourses.length === 0 && (
        <div className="text-center py-12 text-textMuted">
          No courses found for this category.
        </div>
      )}
    </div>
  );
}
