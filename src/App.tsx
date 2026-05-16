import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { SettingsProvider } from './contexts/SettingsContext';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Courses = React.lazy(() => import('./pages/Courses'));
const CourseDetail = React.lazy(() => import('./pages/CourseDetail'));
const Teachers = React.lazy(() => import('./pages/Teachers'));
const TeacherDetail = React.lazy(() => import('./pages/TeacherDetail'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background flex-col"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div><p className="mt-4">Loading App...</p></div>}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/teachers/:id" element={<TeacherDetail />} />
                
                {/* Student/Teacher Routes */}
                <Route element={<ProtectedRoute allowedRoles={['student', 'teacher', 'admin']} />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>
                
                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>
              </Route>
            </Routes>
          </React.Suspense>
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
