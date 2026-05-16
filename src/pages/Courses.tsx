import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, BookOpen } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

// Mock data for display purposes
const MOCK_COURSES = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    description: 'Master modern React with hooks, context, and performance optimization techniques.',
    thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
    price: 49.99,
    teacher: { name: 'Sarah Drasner', rating: 4.9 },
    lessons_count: 24,
    duration: '12 hours',
    category: 'programming',
  },
  {
    id: '2',
    title: 'UI/UX Design Masterclass',
    description: 'Learn the principles of beautiful, functional design and create stunning interfaces.',
    thumbnail_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
    price: 39.99,
    teacher: { name: 'Gary Simon', rating: 4.8 },
    lessons_count: 18,
    duration: '8 hours',
    category: 'design',
  },
  {
    id: '3',
    title: 'Fullstack Next.js',
    description: 'Build production-ready applications with Next.js, Prisma, and PostgreSQL.',
    thumbnail_url: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=800&auto=format&fit=crop',
    price: 59.99,
    teacher: { name: 'Lee Robinson', rating: 5.0 },
    lessons_count: 32,
    duration: '16 hours',
    category: 'programming',
  },
  {
    id: '4',
    title: 'Digital Marketing Fundamentals',
    description: 'Grow your business with SEO, SEM, and social media marketing strategies.',
    thumbnail_url: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=800&auto=format&fit=crop',
    price: 29.99,
    teacher: { name: 'Neil Patel', rating: 4.7 },
    lessons_count: 15,
    duration: '6 hours',
    category: 'marketing',
  },
  {
    id: '5',
    title: 'Business Negotiation Secrets',
    description: 'Learn how to close deals and negotiate effectively in any situation.',
    thumbnail_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=800&auto=format&fit=crop',
    price: 34.99,
    teacher: { name: 'Chris Voss', rating: 4.9 },
    lessons_count: 10,
    duration: '5 hours',
    category: 'business',
  }
];

const CATEGORIES = [
  { id: 'all', labelKey: 'all' },
  { id: 'programming', labelKey: 'programming' },
  { id: 'design', labelKey: 'design' },
  { id: 'marketing', labelKey: 'marketing' },
  { id: 'business', labelKey: 'business' },
];

export default function Courses() {
  const { t } = useSettings();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredCourses = MOCK_COURSES.filter(
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
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === category.id 
                ? 'bg-primary text-white shadow-neon scale-105' 
                : 'bg-surface border border-white/10 text-textMuted hover:text-white hover:border-white/30 hover:bg-white/5'
            }`}
          >
            {t(category.labelKey)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500">
        {filteredCourses.map((course) => (
          <Link to={`/courses/${course.id}`} key={course.id} className="glass-card overflow-hidden group hover:-translate-y-2 transition-all duration-300 flex flex-col animate-fade-in">
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent z-10"></div>
              <img 
                src={course.thumbnail_url} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 z-20 bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-accent border border-white/10">
                ${course.price}
              </div>
            </div>
            
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex items-center gap-2 text-xs text-textMuted mb-3">
                <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.lessons_count} {t('lessons')}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
              </div>
              
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">{course.title}</h3>
              <p className="text-textMuted text-sm mb-4 line-clamp-2 flex-grow">{course.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold">
                    {course.teacher.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-textMuted">{course.teacher.name}</span>
                </div>
                <div className="flex items-center gap-1 text-warning text-sm font-medium">
                  <Star className="w-4 h-4 fill-warning text-warning" />
                  {course.teacher.rating}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {filteredCourses.length === 0 && (
        <div className="text-center py-12 text-textMuted">
          No courses found for this category.
        </div>
      )}
    </div>
  );
}
