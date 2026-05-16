export type UserRole = 'student' | 'admin' | 'teacher';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  created_at: string;
}

export interface Teacher {
  id: string;
  user_id: string;
  bio: string;
  experience_years: number;
  rating: number;
  created_at: string;
  user?: User;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  subject_id: string;
  teacher_id: string;
  price: number;
  language?: 'uz' | 'ru' | 'en'; // Language of the course
  created_at: string;
  teacher?: Teacher;
  subject?: Subject;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  video_url: string;
  order_index: number;
  is_free: boolean;
  created_at: string;
}

export interface Test {
  id: string;
  course_id: string;
  title: string;
  required_lesson_index: number;
  created_at: string;
}

export interface Question {
  id: string;
  test_id: string;
  text: string;
  options: string[];
  correct_option_index: number;
}
