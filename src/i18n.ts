import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translations
const resources = {
  en: {
    translation: {
      "Welcome Back": "Welcome Back",
      "Log in to continue your learning journey.": "Log in to continue your learning journey.",
      "Email Address": "Email Address",
      "Password": "Password",
      "Forgot password?": "Forgot password?",
      "Sign In": "Sign In",
      "Don't have an account?": "Don't have an account?",
      "Register here": "Register here",
      "Admin Panel": "Admin Panel",
      "Overview": "Overview",
      "Users": "Users",
      "Courses": "Courses",
      "Teachers": "Teachers",
      "Platform Overview": "Platform Overview",
      "Total Users": "Total Users",
      "Total Courses": "Total Courses",
      "Manage Courses": "Manage Courses",
      "Manage Users": "Manage Users",
      "Manage Teachers": "Manage Teachers",
      "New Course": "New Course",
      "Title": "Title",
      "Language": "Language",
      "Price": "Price",
      "Actions": "Actions",
      "Refresh Data": "Refresh Data"
    }
  },
  ru: {
    translation: {
      "Welcome Back": "С возвращением",
      "Log in to continue your learning journey.": "Войдите, чтобы продолжить обучение.",
      "Email Address": "Адрес электронной почты",
      "Password": "Пароль",
      "Forgot password?": "Забыли пароль?",
      "Sign In": "Войти",
      "Don't have an account?": "Нет аккаунта?",
      "Register here": "Зарегистрируйтесь здесь",
      "Admin Panel": "Панель администратора",
      "Overview": "Обзор",
      "Users": "Пользователи",
      "Courses": "Курсы",
      "Teachers": "Преподаватели",
      "Platform Overview": "Обзор платформы",
      "Total Users": "Всего пользователей",
      "Total Courses": "Всего курсов",
      "Manage Courses": "Управление курсами",
      "Manage Users": "Управление пользователями",
      "Manage Teachers": "Управление преподавателями",
      "New Course": "Новый курс",
      "Title": "Название",
      "Language": "Язык",
      "Price": "Цена",
      "Actions": "Действия",
      "Refresh Data": "Обновить данные"
    }
  },
  uz: {
    translation: {
      "Welcome Back": "Xush kelibsiz",
      "Log in to continue your learning journey.": "O'qishni davom ettirish uchun kiring.",
      "Email Address": "Elektron pochta manzili",
      "Password": "Parol",
      "Forgot password?": "Parolni unutdingizmi?",
      "Sign In": "Kirish",
      "Don't have an account?": "Hisobingiz yo'qmi?",
      "Register here": "Bu yerda ro'yxatdan o'ting",
      "Admin Panel": "Admin Paneli",
      "Overview": "Umumiy ko'rinish",
      "Users": "Foydalanuvchilar",
      "Courses": "Kurslar",
      "Teachers": "O'qituvchilar",
      "Platform Overview": "Platforma sharhi",
      "Total Users": "Jami foydalanuvchilar",
      "Total Courses": "Jami kurslar",
      "Manage Courses": "Kurslarni boshqarish",
      "Manage Users": "Foydalanuvchilarni boshqarish",
      "Manage Teachers": "O'qituvchilarni boshqarish",
      "New Course": "Yangi kurs",
      "Title": "Sarlavha",
      "Language": "Til",
      "Price": "Narx",
      "Actions": "Harakatlar",
      "Refresh Data": "Ma'lumotlarni yangilash"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
