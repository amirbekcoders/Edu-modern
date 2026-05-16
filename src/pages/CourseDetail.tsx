import { useState, Fragment } from 'react';
// import { useParams, Link } from 'react-router-dom';
import { PlayCircle, Lock, CheckCircle, FileText, Star, Clock } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';

// Mock data
const MOCK_COURSE = {
  id: '1',
  title: 'Advanced React Patterns',
  description: 'Master modern React with hooks, context, and performance optimization techniques. This comprehensive course takes you from intermediate to advanced, covering everything you need to build scalable applications.',
  price: 49.99,
  thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop',
  teacher: {
    name: 'Sarah Drasner',
    bio: 'Senior Developer Advocate and Vue/React expert.',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    rating: 4.9
  },
  lessons: [
    { id: 'l1', title: 'Introduction to Advanced Patterns', duration: '10:25', is_free: true },
    { id: 'l2', title: 'Understanding React Context API', duration: '15:30', is_free: true },
    { id: 'l3', title: 'Custom Hooks Deep Dive', duration: '22:15', is_free: false },
    { id: 'l4', title: 'Render Props Pattern', duration: '18:45', is_free: false },
    { id: 'l5', title: 'Compound Components', duration: '25:10', is_free: false },
  ]
};

export default function CourseDetail() {
  // const { id } = useParams();
  // const { user } = useAuth();
  const [hasPurchased] = useState(false); // Mock state

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Course Header */}
      <div className="glass-panel p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <img src={MOCK_COURSE.thumbnail_url} alt="Course BG" className="w-full h-full object-cover mask-image-gradient" style={{ maskImage: 'linear-gradient(to right, transparent, black)' }} />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-block px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold mb-6">
            PROGRAMMING
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{MOCK_COURSE.title}</h1>
          <p className="text-lg text-textMuted mb-8">{MOCK_COURSE.description}</p>
          
          <div className="flex flex-wrap items-center gap-6 mb-8">
            <div className="flex items-center gap-3">
              <img src={MOCK_COURSE.teacher.avatar} alt={MOCK_COURSE.teacher.name} className="w-12 h-12 rounded-full border-2 border-primary/50" />
              <div>
                <p className="text-sm text-textMuted">Instructor</p>
                <p className="font-medium">{MOCK_COURSE.teacher.name}</p>
              </div>
            </div>
            <div className="h-10 w-px bg-white/10"></div>
            <div>
              <p className="text-sm text-textMuted">Rating</p>
              <p className="font-medium flex items-center gap-1"><Star className="w-4 h-4 text-warning fill-warning" /> {MOCK_COURSE.teacher.rating}</p>
            </div>
            <div className="h-10 w-px bg-white/10"></div>
            <div>
              <p className="text-sm text-textMuted">Duration</p>
              <p className="font-medium flex items-center gap-1"><Clock className="w-4 h-4" /> 12 Hours</p>
            </div>
          </div>

          {!hasPurchased ? (
            <div className="flex items-center gap-4">
              <button className="btn-primary text-lg px-8">
                Buy for ${MOCK_COURSE.price}
              </button>
              <p className="text-sm text-textMuted">Includes full lifetime access</p>
            </div>
          ) : (
            <button className="btn-secondary text-lg px-8">
              Continue Learning
            </button>
          )}
        </div>
      </div>

      {/* Course Curriculum */}
      <div>
        <h2 className="text-2xl font-display font-bold mb-6">Course Curriculum</h2>
        
        <div className="glass-card divide-y divide-white/5">
          {MOCK_COURSE.lessons.map((lesson, idx) => {
            const isLocked = !lesson.is_free && !hasPurchased;
            const isTestUnlock = (idx + 1) % 5 === 0;

            return (
              <Fragment key={lesson.id}>
                <div className={`p-4 sm:p-6 flex items-center justify-between transition-colors ${isLocked ? 'opacity-60 bg-surface/30' : 'hover:bg-white/5'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isLocked ? 'bg-surface border border-white/10 text-textMuted' : 'bg-primary/20 text-primary'}`}>
                      {isLocked ? <Lock className="w-4 h-4" /> : <PlayCircle className="w-5 h-5 ml-0.5" />}
                    </div>
                    <div>
                      <h4 className="font-medium">{idx + 1}. {lesson.title}</h4>
                      <p className="text-xs text-textMuted mt-1">{lesson.duration}</p>
                    </div>
                  </div>
                  
                  <div>
                    {lesson.is_free && !hasPurchased && (
                      <span className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded">FREE</span>
                    )}
                    {!isLocked && hasPurchased && (
                      <CheckCircle className="w-5 h-5 text-success opacity-50" />
                    )}
                  </div>
                </div>

                {/* Test unlock indicator after every 5th lesson */}
                {isTestUnlock && (
                  <div className="p-4 bg-secondary/10 border-l-4 border-secondary flex items-center gap-4">
                    <div className="p-2 bg-secondary/20 rounded-lg text-secondary">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-secondary">Module Quiz</h4>
                      <p className="text-sm text-textMuted">Pass this test to unlock the next module.</p>
                    </div>
                    <button className={`ml-auto ${isLocked ? 'btn-outline opacity-50 cursor-not-allowed' : 'btn-secondary'} !py-2 !px-4 text-sm`} disabled={isLocked}>
                      Take Test
                    </button>
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
