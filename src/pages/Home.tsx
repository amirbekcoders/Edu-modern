
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Rocket, BookOpen, Brain, Shield, PenTool, Monitor, Award, Briefcase, Trophy, CheckCircle2 } from 'lucide-react';

const subjects = [
  { name: 'Programming', icon: Monitor, color: 'from-blue-500 to-cyan-500' },
  { name: 'English', icon: BookOpen, color: 'from-purple-500 to-pink-500' },
  { name: 'Mathematics', icon: Brain, color: 'from-green-500 to-emerald-500' },
  { name: 'AI', icon: Rocket, color: 'from-orange-500 to-red-500' },
  { name: 'Graphic Design', icon: PenTool, color: 'from-fuchsia-500 to-purple-500' },
  { name: 'Cyber Security', icon: Shield, color: 'from-teal-500 to-cyan-500' },
];

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 flex flex-col items-center text-center relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight">
          {t("Master the Future with")}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent mt-2">
            Albion Physics
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-textMuted max-w-2xl mb-10">
          {t("A premium educational platform offering cutting-edge courses in tech, design, and beyond. Step into the next generation of learning.")}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/courses" className="btn-primary text-lg">
            {t("Explore Courses")}
          </Link>
          <Link to="/register" className="btn-outline text-lg">
            {t("Join for Free")}
          </Link>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="w-full py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            {t("Popular")} <span className="text-primary">{t("Subjects")}</span>
          </h2>
          <Link to="/subjects" className="text-accent hover:text-white transition-colors">
            {t("View all")} &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {subjects.map((subject, idx) => {
            const Icon = subject.icon;
            return (
              <div key={idx} className="glass-card p-6 group cursor-pointer hover:-translate-y-2 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${subject.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{t(subject.name)}</h3>
                <p className="text-textMuted text-sm">
                  {t("Master")} {t(subject.name.toLowerCase())} {t("with industry experts and practical lessons.")}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* What Our Students Have Achieved Section */}
      <section className="w-full py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {t("Чего достигли наши ученики")}
            </h2>
            <p className="text-textMuted max-w-2xl mx-auto">
              {t("Мы гордимся результатами наших студентов. Вот лишь некоторые из их достижений после прохождения курсов.")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 text-center hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-4xl font-bold font-display mb-2 text-white">85%</h3>
              <p className="text-textMuted">{t("Поступили в топовые ВУЗы на грант")}</p>
            </div>
            
            <div className="glass-card p-8 text-center hover:border-secondary/50 transition-colors">
              <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-full flex items-center justify-center mb-6">
                <Briefcase className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-4xl font-bold font-display mb-2 text-white">300+</h3>
              <p className="text-textMuted">{t("Нашли высокооплачиваемую работу в IT")}</p>
            </div>

            <div className="glass-card p-8 text-center hover:border-accent/50 transition-colors">
              <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center mb-6">
                <Trophy className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-4xl font-bold font-display mb-2 text-white">50+</h3>
              <p className="text-textMuted">{t("Победителей международных олимпиад")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* What Our Students Can Do Section */}
      <section className="w-full py-20 mb-10">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              {t("Что умеют наши ученики?")}
            </h2>
            <p className="text-lg text-textMuted mb-8">
              {t("Наше обучение построено на практике. К концу курса студенты обладают реальными навыками, которые востребованы на рынке.")}
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="mt-1 bg-green-500/20 p-1 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white">{t("Создавать сложные проекты с нуля")}</h4>
                  <p className="text-sm text-textMuted">{t("От идеи до готового продукта, работающего в продакшене.")}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 bg-green-500/20 p-1 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white">{t("Решать нестандартные задачи")}</h4>
                  <p className="text-sm text-textMuted">{t("Ученики развивают алгоритмическое и критическое мышление.")}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 bg-green-500/20 p-1 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white">{t("Работать в команде")}</h4>
                  <p className="text-sm text-textMuted">{t("Опыт разработки и ведения проектов совместно с другими студентами.")}</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="glass-card p-2 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-30 animate-pulse"></div>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop" 
                alt="Students working" 
                className="rounded-xl relative z-10 object-cover aspect-video w-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
