import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { Star, BookOpen, ArrowLeft, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Course, Teacher } from '../types';

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

const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Advanced React Patterns',
    description: 'Master modern React with hooks, context, and performance optimization techniques.',
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
    subject_id: 's1',
    teacher_id: '1',
    price: 49.99,
    created_at: new Date().toISOString()
  },
  {
    id: 'c2',
    title: 'Vue 3 Masterclass',
    description: 'Learn the new Composition API and build enterprise-ready applications.',
    thumbnail_url: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=800&auto=format&fit=crop',
    subject_id: 's1',
    teacher_id: '1',
    price: 39.99,
    created_at: new Date().toISOString()
  }
];

export default function TeacherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();

  const handleAuthRequiredAction = (action: () => void) => {
    if (!user) {
      navigate('/register', { state: { from: location } });
      return;
    }
    action();
  };
  
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherAndCourses = async () => {
      setLoading(true);
      try {
        // 1. Fetch teacher profile
        const { data: teacherData, error: teacherError } = await supabase
          .from('teachers')
          .select('*')
          .eq('id', id)
          .single();

        let activeTeacher: Teacher | null = null;
        if (teacherError || !teacherData) {
          // Fallback to MOCK
          activeTeacher = MOCK_TEACHERS.find(t => t.id === id) as unknown as Teacher || null;
        } else {
          activeTeacher = teacherData as unknown as Teacher;
        }

        setTeacher(activeTeacher);

        if (activeTeacher) {
          // 2. Fetch courses linked to this teacher
          const { data: coursesData, error: coursesError } = await supabase
            .from('courses')
            .select('*')
            .eq('teacher_id', activeTeacher.id);

          if (coursesError || !coursesData || coursesData.length === 0) {
            // Fallback to mock courses
            setCourses(MOCK_COURSES.filter(c => c.teacher_id === activeTeacher!.id));
          } else {
            setCourses(coursesData as Course[]);
          }
        }
      } catch (err) {
        console.error("Error fetching teacher details:", err);
        setTeacher(MOCK_TEACHERS.find(t => t.id === id) as unknown as Teacher || null);
        setCourses(MOCK_COURSES.filter(c => c.teacher_id === id));
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherAndCourses();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-4">Teacher Not Found</h2>
        <button onClick={() => navigate('/teachers')} className="btn-primary">
          Back to Teachers
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 animate-fade-in space-y-12 pb-20">
      {/* Teacher Profile Section */}
      <section>
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-textMuted hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="glass-panel p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left relative z-10">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full blur-xl opacity-50"></div>
              <img 
                src={teacher.avatar_url || `https://ui-avatars.com/api/?name=${teacher.full_name}&background=random`} 
                alt={teacher.full_name} 
                className="w-40 h-40 rounded-full object-cover relative z-10 border-4 border-surface"
              />
            </div>

            <div className="flex-grow space-y-4">
              <h1 className="text-4xl font-display font-bold">{teacher.full_name}</h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium">
                <span className="flex items-center gap-1 text-warning bg-warning/10 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-warning" /> {teacher.rating} Rating
                </span>
                <span className="flex items-center gap-1 text-primary bg-primary/10 px-3 py-1 rounded-full">
                  <Calendar className="w-4 h-4" /> {teacher.experience_years} Yrs Exp
                </span>
              </div>

              <p className="text-textMuted text-lg leading-relaxed mt-4">
                {teacher.bio}
              </p>

              <div className="pt-6 mt-6 border-t border-white/10 flex gap-4 justify-center md:justify-start">
                <button onClick={() => handleAuthRequiredAction(() => alert("Booking functionality coming soon"))} className="btn-primary">
                  {t('book_session')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Taught by Teacher Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-display font-bold">Courses Taught by This Teacher</h2>
          <span className="text-primary bg-primary/10 px-3 py-1 rounded-full text-sm font-bold">
            {courses.length} {courses.length === 1 ? 'Course' : 'Courses'}
          </span>
        </div>

        {courses.length === 0 ? (
          <div className="glass-card p-12 text-center text-textMuted flex flex-col items-center justify-center">
            <BookOpen className="w-12 h-12 mb-4 opacity-50" />
            <p>This teacher hasn't published any courses yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
              <Link 
                to={`/courses/${course.id}`} 
                key={course.id} 
                className="glass-card overflow-hidden group hover:-translate-y-2 transition-all duration-300 flex flex-col animate-fade-in"
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent z-10"></div>
                  <img 
                    src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 z-20 bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-accent border border-white/10">
                    ${course.price}
                  </div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-textMuted mb-3">
                    <span className="flex items-center gap-1 bg-surface py-1 px-2 rounded"><BookOpen className="w-3 h-3" /> Course</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">{course.title}</h3>
                  <p className="text-textMuted text-sm mb-4 line-clamp-2 flex-grow">{course.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
