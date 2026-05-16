import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'ru' | 'uz';
type Theme = 'default' | 'theme-red' | 'theme-white';

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    home: 'Home',
    courses: 'Courses',
    teachers: 'Teachers',
    dashboard: 'Dashboard',
    login: 'Login',
    register: 'Register',
    admin_panel: 'Admin Panel',
    explore_courses: 'Explore Courses',
    explore_courses_desc: 'Level up your skills with our premium courses taught by industry experts.',
    all: 'All',
    programming: 'Programming',
    design: 'Design',
    marketing: 'Marketing',
    business: 'Business',
    lessons: 'lessons',
    our_teachers: 'Our Teachers',
    our_teachers_desc: 'Learn from the best. Our instructors are industry experts with years of real-world experience.',
    view_profile: 'View Profile',
    book_session: 'Book Session'
  },
  ru: {
    home: 'Главная',
    courses: 'Курсы',
    teachers: 'Учителя',
    dashboard: 'Панель',
    login: 'Войти',
    register: 'Регистрация',
    admin_panel: 'Панель админа',
    explore_courses: 'Изучите курсы',
    explore_courses_desc: 'Повысьте свои навыки с помощью наших премиальных курсов от экспертов отрасли.',
    all: 'Все',
    programming: 'Программирование',
    design: 'Дизайн',
    marketing: 'Маркетинг',
    business: 'Бизнес',
    lessons: 'уроков',
    our_teachers: 'Наши Учителя',
    our_teachers_desc: 'Учитесь у лучших. Наши преподаватели - эксперты отрасли с многолетним реальным опытом.',
    view_profile: 'Профиль',
    book_session: 'Записаться'
  },
  uz: {
    home: 'Asosiy',
    courses: 'Kurslar',
    teachers: "O'qituvchilar",
    dashboard: 'Panel',
    login: 'Kirish',
    register: "Ro'yxatdan o'tish",
    admin_panel: 'Admin Panel',
    explore_courses: 'Kurslarni organish',
    explore_courses_desc: 'Soha mutaxassislaridan dars oling va malakangizni oshiring.',
    all: 'Barchasi',
    programming: 'Dasturlash',
    design: 'Dizayn',
    marketing: 'Marketing',
    business: 'Biznes',
    lessons: 'dars',
    our_teachers: "Bizning O'qituvchilar",
    our_teachers_desc: "Eng yaxshilardan o'rganing. O'qituvchilarimiz ko'p yillik tajribaga ega mutaxassislardir.",
    view_profile: 'Profilni korish',
    book_session: 'Dars bron qilish'
  }
};

const SettingsContext = createContext<SettingsContextType>({
  language: 'en',
  setLanguage: () => {},
  theme: 'default',
  setTheme: () => {},
  t: (key: string) => key,
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [theme, setThemeState] = useState<Theme>('default');

  useEffect(() => {
    const savedLang = localStorage.getItem('app_language') as Language;
    if (savedLang && ['en', 'ru', 'uz'].includes(savedLang)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguageState(savedLang);
    }
    const savedTheme = localStorage.getItem('app_theme') as Theme;
    if (savedTheme && ['default', 'theme-red', 'theme-white'].includes(savedTheme)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeState(savedTheme);
      if (savedTheme !== 'default') {
        document.documentElement.classList.add(savedTheme);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const setTheme = (newTheme: Theme) => {
    document.documentElement.classList.remove('theme-red', 'theme-white');
    if (newTheme !== 'default') {
      document.documentElement.classList.add(newTheme);
    }
    setThemeState(newTheme);
    localStorage.setItem('app_theme', newTheme);
  };

  const t = (key: string): string => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const keys = translations[language] as any;
    return keys[key] || key;
  };

  return (
    <SettingsContext.Provider value={{ language, setLanguage, theme, setTheme, t }}>
      {children}
    </SettingsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => useContext(SettingsContext);
