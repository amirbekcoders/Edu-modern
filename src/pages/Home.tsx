
import { Link } from 'react-router-dom';
import { Rocket, BookOpen, Brain, Shield, PenTool, Monitor } from 'lucide-react';

const subjects = [
  { name: 'Programming', icon: Monitor, color: 'from-blue-500 to-cyan-500' },
  { name: 'English', icon: BookOpen, color: 'from-purple-500 to-pink-500' },
  { name: 'Mathematics', icon: Brain, color: 'from-green-500 to-emerald-500' },
  { name: 'AI', icon: Rocket, color: 'from-orange-500 to-red-500' },
  { name: 'Graphic Design', icon: PenTool, color: 'from-fuchsia-500 to-purple-500' },
  { name: 'Cyber Security', icon: Shield, color: 'from-teal-500 to-cyan-500' },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 flex flex-col items-center text-center relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight">
          Master the Future with
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent mt-2">
            Anti Gravity Academy
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-textMuted max-w-2xl mb-10">
          A premium educational platform offering cutting-edge courses in tech, design, and beyond. Step into the next generation of learning.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/courses" className="btn-primary text-lg">
            Explore Courses
          </Link>
          <Link to="/register" className="btn-outline text-lg">
            Join for Free
          </Link>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="w-full py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            Popular <span className="text-primary">Subjects</span>
          </h2>
          <Link to="/subjects" className="text-accent hover:text-white transition-colors">
            View all &rarr;
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
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{subject.name}</h3>
                <p className="text-textMuted text-sm">
                  Master {subject.name.toLowerCase()} with industry experts and practical lessons.
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
