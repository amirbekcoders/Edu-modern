import { useState, useEffect, Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayCircle, Lock, CheckCircle, FileText, Star, Clock, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Course } from '../types';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [hasPurchased] = useState(false); // Mock state
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<{ id: string; title: string; video_url: string } | null>(null);

  // Test Modal States
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [cheatWarning, setCheatWarning] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  // Anti-cheat: Detect tab switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isTestOpen && !testCompleted) {
        setCheatWarning(true);
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isTestOpen, testCompleted]);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*, teacher:teachers(*)')
          .eq('id', id)
          .single();
          
        if (!error && data) {
          setCourse(data as unknown as Course);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return <div className="text-center py-20 text-xl font-bold">Course not found.</div>;
  }

  const videoToPlay = activeLesson ? activeLesson.video_url : course.video_url;

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Course Header / Video */}
      <div className="glass-panel relative overflow-hidden">
        {videoToPlay ? (
          <div className="w-full aspect-video bg-black rounded-t-2xl overflow-hidden relative z-20">
            {videoToPlay.includes('youtube.com') || videoToPlay.includes('youtu.be') ? (
              <iframe 
                src={videoToPlay.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video 
                src={videoToPlay} 
                controls 
                className="w-full h-full object-contain"
                poster={course.thumbnail_url}
              ></video>
            )}
          </div>
        ) : (
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
            {course.thumbnail_url ? (
              <img src={course.thumbnail_url} alt="Course BG" className="w-full h-full object-cover mask-image-gradient" style={{ maskImage: 'linear-gradient(to right, transparent, black)' }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface">
                <BookOpen className="w-32 h-32 opacity-20" />
              </div>
            )}
          </div>
        )}
        
        <div className={`relative z-10 max-w-2xl ${course.video_url ? 'p-8 md:p-12' : 'p-8 md:p-12'}`}>
          <div className="inline-block px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold mb-6 capitalize">
            {course.category || 'Course'}
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{course.title}</h1>
          <p className="text-lg text-textMuted mb-8">{course.description || 'No description provided.'}</p>
          
          <div className="flex flex-wrap items-center gap-6 mb-8">
            <div className="flex items-center gap-3">
              <img 
                src={course.teacher?.avatar_url || `https://ui-avatars.com/api/?name=${course.teacher?.full_name || 'U'}&background=random`} 
                alt={course.teacher?.full_name || 'Unknown'} 
                className="w-12 h-12 rounded-full border-2 border-primary/50 object-cover" 
              />
              <div>
                <p className="text-sm text-textMuted">Instructor</p>
                <p className="font-medium">{course.teacher?.full_name || 'Unknown Teacher'}</p>
              </div>
            </div>
            <div className="h-10 w-px bg-white/10"></div>
            <div>
              <p className="text-sm text-textMuted">Rating</p>
              <p className="font-medium flex items-center gap-1"><Star className="w-4 h-4 text-warning fill-warning" /> {course.teacher?.rating || '5.0'}</p>
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
                Buy for ${course.price}
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
          {!course.lessons || course.lessons.length === 0 ? (
            <div className="p-6 text-center text-textMuted">
              Lessons are coming soon to this course!
            </div>
          ) : (
            course.lessons.map((lesson, idx) => (
              <div 
                key={lesson.id} 
                onClick={() => setActiveLesson(lesson)}
                className={`p-4 sm:p-6 flex items-center justify-between transition-colors cursor-pointer hover:bg-white/5 ${activeLesson?.id === lesson.id ? 'bg-white/5 border-l-4 border-primary' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeLesson?.id === lesson.id ? 'bg-primary text-white' : 'bg-primary/20 text-primary'}`}>
                    <PlayCircle className="w-5 h-5 ml-0.5" />
                  </div>
                  <div>
                    <h4 className={`font-medium ${activeLesson?.id === lesson.id ? 'text-primary' : ''}`}>{idx + 1}. {lesson.title}</h4>
                    <p className="text-xs text-textMuted mt-1">Video Lesson</p>
                  </div>
                </div>
              </div>
            ))
          )}
          
          <div className="p-6 bg-secondary/10 flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/20 rounded-full text-secondary">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-secondary">Final Course Test</h4>
                <p className="text-sm text-textMuted">Pass this final exam to get your certificate. Anti-cheat is enabled.</p>
              </div>
            </div>
            <button 
              onClick={() => setIsTestOpen(true)}
              className="btn-secondary whitespace-nowrap"
            >
              Start Final Test
            </button>
          </div>
        </div>
      </div>

      {/* Final Test Modal with Anti-Cheat */}
      {isTestOpen && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div 
            className="glass-panel w-full max-w-3xl p-8 relative max-h-[90vh] overflow-y-auto"
            onCopy={(e) => {
              e.preventDefault();
              alert("Copying text is disabled during the test to prevent cheating with Gemini/AI.");
            }}
            onPaste={(e) => e.preventDefault()}
          >
            {cheatWarning ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-20 h-20 bg-danger/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-10 h-10 text-danger" />
                </div>
                <h2 className="text-3xl font-bold text-danger">Cheating Detected!</h2>
                <p className="text-xl text-textMuted">You switched tabs during the test. Using Gemini, ChatGPT, or Google is strictly prohibited.</p>
                <div className="pt-8">
                  <button onClick={() => { setIsTestOpen(false); setCheatWarning(false); }} className="btn-primary">
                    Close & Failed
                  </button>
                </div>
              </div>
            ) : testCompleted ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-3xl font-bold text-success">Test Completed!</h2>
                <p className="text-xl text-textMuted">Your score is being processed.</p>
                <div className="pt-8">
                  <button onClick={() => setIsTestOpen(false)} className="btn-primary">
                    Return to Course
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                  <h2 className="text-2xl font-bold text-secondary">Final Course Test</h2>
                  <div className="px-3 py-1 bg-danger/20 text-danger rounded-full text-xs font-bold animate-pulse">
                    ANTI-CHEAT ACTIVE
                  </div>
                </div>
                
                <p className="mb-8 text-textMuted text-sm">
                  <strong className="text-white">Rules:</strong> Do not switch tabs. Do not copy text. The use of AI (like Gemini) is forbidden. If you leave this page, the test will automatically fail.
                </p>

                <div className="space-y-8 select-none">
                  {/* Mock Question 1 */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-lg">1. What is the primary purpose of this course?</h4>
                    <div className="space-y-2">
                      {['To learn the basics', 'To master advanced techniques', 'To get a certificate', 'All of the above'].map((opt, i) => (
                        <label key={i} className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-surface/50 hover:bg-white/5 cursor-pointer transition-colors">
                          <input type="radio" name="q1" className="w-4 h-4 text-primary" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Mock Question 2 */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-lg">2. Which of the following is NOT allowed during this test?</h4>
                    <div className="space-y-2">
                      {['Thinking', 'Using Gemini / ChatGPT', 'Breathing', 'Reading the questions'].map((opt, i) => (
                        <label key={i} className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-surface/50 hover:bg-white/5 cursor-pointer transition-colors">
                          <input type="radio" name="q2" className="w-4 h-4 text-primary" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/10 flex justify-end gap-4">
                  <button onClick={() => setIsTestOpen(false)} className="btn-outline text-textMuted hover:text-white">
                    Cancel
                  </button>
                  <button onClick={() => setTestCompleted(true)} className="btn-secondary">
                    Submit Test
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
