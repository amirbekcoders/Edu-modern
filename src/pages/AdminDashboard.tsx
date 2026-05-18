import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';
import {
  Users, BookOpen,
  BarChart3, Plus,
  Trash2, Edit, X, Save
} from 'lucide-react';
import type { Course, User, Teacher } from '../types';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const TABS = [
    { id: 'overview', label: t('Overview'), icon: BarChart3 },
    { id: 'users', label: t('Users'), icon: Users },
    { id: 'courses', label: t('Courses'), icon: BookOpen },
    { id: 'teachers', label: t('Teachers'), icon: Users },
  ];

  const [activeTab, setActiveTab] = useState('overview');

  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [stats, setStats] = useState({ users: 0, courses: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course>>({});

  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Partial<Teacher & { user_id_input?: string, full_name_input?: string }>>({});

  const [modalError, setModalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Clear success message automatically
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'overview') {
        const [usersRes, coursesRes] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('courses').select('*', { count: 'exact', head: true })
        ]);
        setStats({
          users: usersRes.count || 0,
          courses: coursesRes.count || 0
        });
      } else if (activeTab === 'users') {
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(1000);
        if (error) throw error;
        setUsers(data as User[] || []);
      } else if (activeTab === 'courses') {
        const [coursesRes, teachersRes] = await Promise.all([
          supabase.from('courses').select('*, teacher:teachers(*)').order('created_at', { ascending: false }).limit(1000),
          supabase.from('teachers').select('*').order('created_at', { ascending: false })
        ]);
        if (coursesRes.error && coursesRes.error.code !== '42P01') throw coursesRes.error;
        if (teachersRes.error && teachersRes.error.code !== '42P01') throw teachersRes.error;
        setCourses(coursesRes.data as Course[] || []);
        setTeachers(teachersRes.data as Teacher[] || []);
      } else if (activeTab === 'teachers') {
        const { data, error } = await supabase.from('teachers').select('*').order('created_at', { ascending: false }).limit(1000);
        if (error && error.code !== '42P01') throw error;
        setTeachers((data as Teacher[]) || []);
      }
    } catch (err: any) {
      console.error("Fetch data error:", err);
      setError(err.message || err.error_description || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const handleUpdateUserRole = async (id: string, newRole: string) => {
    try {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', id);
      if (error) throw error;
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole as User['role'] } : u));
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
      setCourses(courses.filter(c => c.id !== id));
      setSuccessMessage('Курс удален!');
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    if (!confirm('Are you sure you want to delete this teacher? Note: You cannot delete a teacher if they have courses attached.')) return;
    try {
      const { error } = await supabase.from('teachers').delete().eq('id', id);
      if (error) throw error;
      setTeachers(teachers.filter(t => t.id !== id));
      setSuccessMessage('Учитель удален!');
    } catch (err: unknown) {
      if (err instanceof Error) alert("Failed to delete: " + err.message);
    }
  };

  const handleSaveCourse = async () => {
    try {
      if (editingCourse.id) {
        // Update explicitly specifying fields to avoid extra property errors
        const updateData = {
          title: editingCourse.title,
          description: editingCourse.description,
          price: editingCourse.price,
          thumbnail_url: editingCourse.thumbnail_url,
          video_url: editingCourse.video_url,
          lessons: editingCourse.lessons || [],
          category: editingCourse.category,
          subject_id: editingCourse.subject_id,
          teacher_id: editingCourse.teacher_id
        };
        const { error } = await supabase.from('courses').update(updateData).eq('id', editingCourse.id);
        if (error) throw error;
        setCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...updateData } as Course : c));
      } else {
        // Insert
        const { data, error } = await supabase.from('courses').insert([{
          title: editingCourse.title || 'New Course',
          description: editingCourse.description || '',
          price: editingCourse.price || 0,
          thumbnail_url: editingCourse.thumbnail_url || '',
          video_url: editingCourse.video_url || '',
          lessons: editingCourse.lessons || [],
          category: editingCourse.category || '',
          subject_id: editingCourse.subject_id || null,
          teacher_id: editingCourse.teacher_id || null,
        }]).select();
        if (error) throw error;
        if (data && data.length > 0) {
          setCourses([data[0] as Course, ...courses]);
        } else {
          // If RLS blocked reading it back, just refresh all data
          fetchData();
        }
      }
      setIsCourseModalOpen(false);
      setEditingCourse({});
      setModalError(null);
      setSuccessMessage('Курс успешно сохранен!');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setModalError(err.message);
        console.error("Save course error:", err);
      }
    }
  };

  const handleSaveTeacher = async () => {
    try {
      setModalError(null);
      // For a new teacher, we need to create or link a user profile first, 
      // but for simplicity here we just ask for their name and create a fake user ID or expect they exist.
      // In a real app, you'd select an existing user to make them a teacher.
      // Let's just insert into teachers table.
      if (editingTeacher.id) {
        // Update
        const { error } = await supabase.from('teachers').update({
          full_name: editingTeacher.full_name,
          avatar_url: editingTeacher.avatar_url,
          bio: editingTeacher.bio,
          experience_years: editingTeacher.experience_years,
          rating: editingTeacher.rating
        }).eq('id', editingTeacher.id);
        if (error) throw error;
        fetchData(); // Refresh to get relations
      } else {
        // Insert
        if (!editingTeacher.full_name) throw new Error("Teacher name is required.");

        const { error } = await supabase.from('teachers').insert([{
          full_name: editingTeacher.full_name,
          avatar_url: editingTeacher.avatar_url || '',
          bio: editingTeacher.bio || 'Experienced teacher',
          experience_years: editingTeacher.experience_years || 1,
          rating: editingTeacher.rating || 5.0
        }]);
        if (error) throw error;
        fetchData();
      }
      setIsTeacherModalOpen(false);
      setEditingTeacher({});
      setSuccessMessage('Учитель успешно сохранен!');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setModalError(err.message);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 relative">
      {/* Toast Notification */}
      {successMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-green-500/20 border border-green-500/50 text-green-400 px-6 py-3 rounded-full shadow-lg shadow-green-500/10 flex items-center gap-2 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          {successMessage}
        </div>
      )}

      {/* Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="glass-panel p-6 sticky top-24">
          <div className="mb-8">
            <h2 className="text-xl font-bold font-display">{t('Admin Panel')}</h2>
            <p className="text-sm text-textMuted">{t('Welcome Back')}, {user?.full_name}</p>
          </div>

          <nav className="space-y-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                    ? 'bg-primary text-white shadow-neon'
                    : 'text-textMuted hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        <div className="glass-panel p-8 min-h-[500px]">
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4">Loading Admin Data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold font-display">{t('Platform Overview')}</h3>
                    <button onClick={fetchData} className="btn-outline !py-2 !px-4 text-sm">
                      {t('Refresh Data')}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="glass-card p-6 border-white/5">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-lg bg-surface text-primary`}>
                          <Users className="w-5 h-5" />
                        </div>
                      </div>
                      <p className="text-sm text-textMuted">{t("Total Users")}</p>
                      <p className="text-2xl font-bold">{stats.users}</p>
                    </div>
                    <div className="glass-card p-6 border-white/5">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-lg bg-surface text-secondary`}>
                          <BookOpen className="w-5 h-5" />
                        </div>
                      </div>
                      <p className="text-sm text-textMuted">{t("Total Courses")}</p>
                      <p className="text-2xl font-bold">{stats.courses}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold font-display">{t("Manage Users")}</h3>
                  </div>

                  <div className="glass-card overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[600px]">
                      <thead className="bg-surface/50 text-textMuted border-b border-white/10">
                        <tr>
                          <th className="p-4 font-medium">Name</th>
                          <th className="p-4 font-medium">Email</th>
                          <th className="p-4 font-medium">Role</th>
                          <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-medium">{u.full_name}</td>
                            <td className="p-4 text-textMuted">{u.email}</td>
                            <td className="p-4">
                              <select
                                value={u.role}
                                onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                                className="bg-surface border border-white/10 rounded px-2 py-1 text-xs outline-none"
                              >
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="p-4 flex justify-end gap-2">
                              {/* Future user actions */}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'courses' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold font-display">{t("Manage Courses")}</h3>
                    <button
                      onClick={() => { setEditingCourse({}); setIsCourseModalOpen(true); }}
                      className="btn-primary !py-2 !px-4 text-sm"
                    >
                      <Plus className="w-4 h-4" /> {t("New Course")}
                    </button>
                  </div>

                  <div className="glass-card overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[600px]">
                      <thead className="bg-surface/50 text-textMuted border-b border-white/10">
                        <tr>
                          <th className="p-4 font-medium">Title</th>
                          <th className="p-4 font-medium">Category</th>
                          <th className="p-4 font-medium">Teacher</th>
                          <th className="p-4 font-medium">Price</th>
                          <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {courses.length === 0 && (
                          <tr><td colSpan={3} className="p-4 text-center text-textMuted">No courses found</td></tr>
                        )}
                        {courses.map((c) => (
                          <tr key={c.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-medium">{c.title}</td>
                            <td className="p-4 capitalize">{c.category || 'None'}</td>
                            <td className="p-4 text-textMuted">{c.teacher?.full_name || 'No Teacher'}</td>
                            <td className="p-4">${c.price}</td>
                            <td className="p-4 flex justify-end gap-2">
                              <button
                                onClick={() => { setEditingCourse(c); setIsCourseModalOpen(true); }}
                                className="p-2 text-textMuted hover:text-white transition-colors rounded-lg hover:bg-surface"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCourse(c.id)}
                                className="p-2 text-textMuted hover:text-danger transition-colors rounded-lg hover:bg-surface"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {activeTab === 'teachers' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold font-display">{t('Manage Teachers')}</h3>
                    <button
                      onClick={() => { setEditingTeacher({}); setIsTeacherModalOpen(true); }}
                      className="btn-primary !py-2 !px-4 text-sm"
                    >
                      <Plus className="w-4 h-4" /> Add Teacher
                    </button>
                  </div>

                  <div className="glass-card overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[600px]">
                      <thead className="bg-surface/50 text-textMuted border-b border-white/10">
                        <tr>
                          <th className="p-4 font-medium">Name</th>
                          <th className="p-4 font-medium">Rating</th>
                          <th className="p-4 font-medium">Experience (Yrs)</th>
                          <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {teachers.length === 0 && (
                          <tr><td colSpan={4} className="p-4 text-center text-textMuted">No teachers found</td></tr>
                        )}
                        {teachers.map((t) => (
                          <tr key={t.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-medium flex items-center gap-3">
                              {t.avatar_url && <img src={t.avatar_url} alt={t.full_name} className="w-8 h-8 rounded-full object-cover" />}
                              {t.full_name || 'Unknown'}
                            </td>
                            <td className="p-4">{t.rating}</td>
                            <td className="p-4">{t.experience_years}</td>
                            <td className="p-4 flex justify-end gap-2">
                              {/* Future teacher actions */}
                              <button
                                onClick={() => { setEditingTeacher(t); setIsTeacherModalOpen(true); }}
                                className="p-2 text-textMuted hover:text-white transition-colors rounded-lg hover:bg-surface"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteTeacher(t.id)}
                                className="p-2 text-textMuted hover:text-danger transition-colors rounded-lg hover:bg-surface"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Course Modal */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background/90 backdrop-blur-sm z-10 pb-4 mb-2 -mx-6 px-6 -mt-6 pt-6 border-b border-white/5">
              <button
                onClick={() => { setIsCourseModalOpen(false); setModalError(null); }}
                className="absolute top-6 right-6 text-textMuted hover:text-white bg-surface p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold pr-8">{editingCourse.id ? 'Edit Course' : 'New Course'}</h3>
            </div>

            {modalError && (
              <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-xl mb-6 text-sm">
                {modalError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Title</label>
                <input
                  type="text"
                  value={editingCourse.title || ''}
                  onChange={e => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="input-field"
                  placeholder="Course Title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Description</label>
                <textarea
                  value={editingCourse.description || ''}
                  onChange={e => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  className="input-field min-h-[100px]"
                  placeholder="Course Description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Price ($)</label>
                <input
                  type="number"
                  value={editingCourse.price || ''}
                  onChange={e => setEditingCourse({ ...editingCourse, price: parseFloat(e.target.value) })}
                  className="input-field"
                  placeholder="49.99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Intro Video URL (Optional)</label>
                <input
                  type="text"
                  value={editingCourse.video_url || ''}
                  onChange={e => setEditingCourse({ ...editingCourse, video_url: e.target.value })}
                  className="input-field"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              {/* Dynamic Lessons Section */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-textMuted">Course Lessons/Videos</label>
                  <button
                    onClick={() => {
                      const newLesson = { id: Date.now().toString(), title: '', video_url: '' };
                      setEditingCourse({ ...editingCourse, lessons: [...(editingCourse.lessons || []), newLesson] });
                    }}
                    className="btn-outline !py-1 !px-2 text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Video
                  </button>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {(editingCourse.lessons || []).map((lesson, idx) => (
                    <div key={lesson.id} className="flex gap-2 items-start bg-surface/50 p-3 rounded-xl border border-white/5">
                      <div className="flex-grow space-y-2">
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={e => {
                            const newLessons = [...(editingCourse.lessons || [])];
                            newLessons[idx].title = e.target.value;
                            setEditingCourse({ ...editingCourse, lessons: newLessons });
                          }}
                          className="input-field !py-1 !px-2 !text-sm"
                          placeholder="Lesson Title (e.g., Module 1: Basics)"
                        />
                        <input
                          type="text"
                          value={lesson.video_url}
                          onChange={e => {
                            const newLessons = [...(editingCourse.lessons || [])];
                            newLessons[idx].video_url = e.target.value;
                            setEditingCourse({ ...editingCourse, lessons: newLessons });
                          }}
                          className="input-field !py-1 !px-2 !text-sm"
                          placeholder="Video URL (YouTube link or MP4)"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const newLessons = [...(editingCourse.lessons || [])];
                          newLessons.splice(idx, 1);
                          setEditingCourse({ ...editingCourse, lessons: newLessons });
                        }}
                        className="p-2 text-textMuted hover:text-danger rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {(!editingCourse.lessons || editingCourse.lessons.length === 0) && (
                    <p className="text-xs text-textMuted text-center py-2">No lesson videos added yet.</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Category</label>
                <input
                  type="text"
                  value={editingCourse.category || ''}
                  onChange={e => setEditingCourse({ ...editingCourse, category: e.target.value.toLowerCase() })}
                  className="input-field"
                  placeholder="e.g. programming, languages, math"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Teacher</label>
                <select
                  value={editingCourse.teacher_id || ''}
                  onChange={e => setEditingCourse({ ...editingCourse, teacher_id: e.target.value })}
                  className="input-field bg-background"
                >
                  <option value="">No teacher</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.full_name}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleSaveCourse} className="btn-primary w-full flex justify-center gap-2">
                <Save className="w-5 h-5" /> Save Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Modal */}
      {isTeacherModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background/90 backdrop-blur-sm z-10 pb-4 mb-2 -mx-6 px-6 -mt-6 pt-6 border-b border-white/5">
              <button
                onClick={() => { setIsTeacherModalOpen(false); setModalError(null); }}
                className="absolute top-6 right-6 text-textMuted hover:text-white bg-surface p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold pr-8">{editingTeacher.id ? 'Edit Teacher' : 'New Teacher'}</h3>
            </div>

            {modalError && (
              <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-xl mb-6 text-sm">
                {modalError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Teacher Full Name</label>
                <input
                  type="text"
                  value={editingTeacher.full_name || ''}
                  onChange={e => setEditingTeacher({ ...editingTeacher, full_name: e.target.value })}
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Photo URL (Avatar)</label>
                <input
                  type="text"
                  value={editingTeacher.avatar_url || ''}
                  onChange={e => setEditingTeacher({ ...editingTeacher, avatar_url: e.target.value })}
                  className="input-field"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">About (Bio)</label>
                <textarea
                  value={editingTeacher.bio || ''}
                  onChange={e => setEditingTeacher({ ...editingTeacher, bio: e.target.value })}
                  className="input-field min-h-[100px]"
                  placeholder="Information about the teacher..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-textMuted mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={editingTeacher.experience_years || ''}
                    onChange={e => setEditingTeacher({ ...editingTeacher, experience_years: parseInt(e.target.value) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textMuted mb-1">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingTeacher.rating || ''}
                    onChange={e => setEditingTeacher({ ...editingTeacher, rating: parseFloat(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>
              <button onClick={handleSaveTeacher} className="btn-primary w-full flex justify-center gap-2">
                <Save className="w-5 h-5" /> Save Teacher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
