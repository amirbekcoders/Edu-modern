import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Users, BookOpen, 
  BarChart3, Plus,
  Trash2, Edit, X, Save
} from 'lucide-react';
import type { Course, User, Teacher } from '../types';

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'teachers', label: 'Teachers', icon: Users },
];

export default function AdminDashboard() {
  const { user } = useAuth();
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
        const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false }).limit(1000);
        if (error && error.code !== '42P01') throw error;
        setCourses(data as Course[] || []);
      } else if (activeTab === 'teachers') {
        const { data, error } = await supabase.from('teachers').select('*, user:profiles(*)').order('created_at', { ascending: false }).limit(1000);
        if (error && error.code !== '42P01') throw error;
        setTeachers((data as Teacher[]) || []);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to fetch data. Make sure tables exist.');
      } else {
        setError('Failed to fetch data.');
      }
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
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
    }
  };

  const handleSaveCourse = async () => {
    try {
      if (editingCourse.id) {
        // Update
        const { error } = await supabase.from('courses').update(editingCourse).eq('id', editingCourse.id);
        if (error) throw error;
        setCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...editingCourse } as Course : c));
      } else {
        // Insert
        const { data, error } = await supabase.from('courses').insert([{
          title: editingCourse.title || 'New Course',
          description: editingCourse.description || '',
          price: editingCourse.price || 0,
          thumbnail_url: editingCourse.thumbnail_url || '',
          subject_id: editingCourse.subject_id || null,
          teacher_id: editingCourse.teacher_id || null,
        }]).select();
        if (error) throw error;
        if (data) setCourses([data[0] as Course, ...courses]);
      }
      setIsCourseModalOpen(false);
      setEditingCourse({});
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="glass-panel p-6 sticky top-24">
          <div className="mb-8">
            <h2 className="text-xl font-bold font-display">Admin Panel</h2>
            <p className="text-sm text-textMuted">Welcome, {user?.full_name}</p>
          </div>
          
          <nav className="space-y-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
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
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold font-display">Platform Overview</h3>
                    <button onClick={fetchData} className="btn-outline !py-2 !px-4 text-sm">
                      Refresh Data
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="glass-card p-6 border-white/5">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-lg bg-surface text-primary`}>
                          <Users className="w-5 h-5" />
                        </div>
                      </div>
                      <p className="text-sm text-textMuted">Total Users</p>
                      <p className="text-2xl font-bold">{stats.users}</p>
                    </div>
                    <div className="glass-card p-6 border-white/5">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-lg bg-surface text-secondary`}>
                          <BookOpen className="w-5 h-5" />
                        </div>
                      </div>
                      <p className="text-sm text-textMuted">Total Courses</p>
                      <p className="text-2xl font-bold">{stats.courses}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold font-display">Manage Users</h3>
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
                    <h3 className="text-2xl font-bold font-display">Manage Courses</h3>
                    <button 
                      onClick={() => { setEditingCourse({}); setIsCourseModalOpen(true); }}
                      className="btn-primary !py-2 !px-4 text-sm"
                    >
                      <Plus className="w-4 h-4" /> New Course
                    </button>
                  </div>

                  <div className="glass-card overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[600px]">
                      <thead className="bg-surface/50 text-textMuted border-b border-white/10">
                        <tr>
                          <th className="p-4 font-medium">Title</th>
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
                    <h3 className="text-2xl font-bold font-display">Manage Teachers</h3>
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
                            <td className="p-4 font-medium">{t.user?.full_name || 'Unknown'}</td>
                            <td className="p-4">{t.rating}</td>
                            <td className="p-4">{t.experience_years}</td>
                            <td className="p-4 flex justify-end gap-2">
                              {/* Future teacher actions */}
                              <button 
                                className="p-2 text-textMuted hover:text-white transition-colors rounded-lg hover:bg-surface"
                              >
                                <Edit className="w-4 h-4" />
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
          <div className="glass-panel w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsCourseModalOpen(false)}
              className="absolute top-4 right-4 text-textMuted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-6">{editingCourse.id ? 'Edit Course' : 'New Course'}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Title</label>
                <input 
                  type="text" 
                  value={editingCourse.title || ''}
                  onChange={e => setEditingCourse({...editingCourse, title: e.target.value})}
                  className="input-field"
                  placeholder="Course Title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Description</label>
                <textarea 
                  value={editingCourse.description || ''}
                  onChange={e => setEditingCourse({...editingCourse, description: e.target.value})}
                  className="input-field min-h-[100px]"
                  placeholder="Course Description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Price ($)</label>
                <input 
                  type="number" 
                  value={editingCourse.price || ''}
                  onChange={e => setEditingCourse({...editingCourse, price: parseFloat(e.target.value)})}
                  className="input-field"
                  placeholder="49.99"
                />
              </div>
              <button onClick={handleSaveCourse} className="btn-primary w-full flex justify-center gap-2">
                <Save className="w-5 h-5" /> Save Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
