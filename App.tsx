
import React, { useState, useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Progress } from './pages/Progress';
import { TrainingSession } from './components/training/TrainingSession';
import { useUserStore } from './stores/useUserStore';
import { getExercisesForUser } from './data/syllableDatabase';
import { LayoutDashboard, LineChart, Settings, User as UserIcon, Mic2, Bell, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type View = 'dashboard' | 'progress' | 'settings';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [isTraining, setIsTraining] = useState(false);
  const [hour, setHour] = useState(new Date().getHours());
  
  const { user, addTrainingRecord, updatePoints } = useUserStore();

  useEffect(() => {
    const timer = setInterval(() => setHour(new Date().getHours()), 60000);
    return () => clearInterval(timer);
  }, []);

  const isEvening = hour >= 18 || hour < 5;

  const handleComplete = (score: number) => {
    addTrainingRecord(score, isEvening ? 15 : 25);
    updatePoints(100);
    setIsTraining(false);
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: '概览' },
    { id: 'progress', icon: LineChart, label: '进度' },
    { id: 'settings', icon: Settings, label: '设置' },
  ];

  return (
    <div className={`min-h-screen flex transition-colors duration-1000 ${isEvening ? 'bg-evening-bg text-slate-100' : 'bg-[#F8FAFC] text-[#212529]'}`}>
      
      {/* Sidebar Navigation */}
      <aside className={`fixed left-0 top-0 bottom-0 w-24 hidden md:flex flex-col items-center py-10 gap-12 border-r z-40 ${isEvening ? 'bg-evening-card border-slate-700' : 'bg-white border-gray-100'}`}>
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
          <Mic2 size={24} />
        </div>
        <nav className="flex flex-col gap-8">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              className={`p-3 rounded-2xl transition-all relative ${view === item.id ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <item.icon size={26} strokeWidth={view === item.id ? 2.5 : 2} />
              {view === item.id && (
                <motion.div layoutId="nav-active" className="absolute -right-0 w-1 h-8 bg-primary rounded-l-full" />
              )}
            </button>
          ))}
        </nav>
        <div className="mt-auto flex flex-col items-center gap-6">
          <button className="text-gray-400 hover:text-primary transition-colors">
            <Bell size={24} />
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5 shadow-md">
            <img className="w-full h-full rounded-full bg-slate-200" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-24 pb-24 md:pb-12">
        <header className="max-w-6xl mx-auto px-6 pt-10 pb-6 flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight uppercase">清晰之声</h1>
            <p className={`text-xs font-bold uppercase tracking-[0.2em] ${isEvening ? 'text-blue-400' : 'text-primary'}`}>
              {isEvening ? 'Night Focused Mode' : 'Standard Wake Mode'}
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl shadow-sm border ${isEvening ? 'bg-evening-card border-slate-700' : 'bg-white border-gray-50'}`}>
               <Search size={18} className="text-gray-400" />
               <input type="text" placeholder="搜索练习材料..." className="bg-transparent outline-none text-sm w-32 font-medium" />
             </div>
             <button onClick={() => setIsTraining(true)} className="md:hidden w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-xl">
               <Mic2 size={24} />
             </button>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              {view === 'dashboard' && <Dashboard isEvening={isEvening} onStartTraining={() => setIsTraining(true)} />}
              {view === 'progress' && <Progress />}
              {view === 'settings' && (
                <div className="flex items-center justify-center min-h-[50vh] opacity-20 font-black text-4xl italic">
                  Settings Coming Soon...
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 h-20 border-t flex items-center justify-around z-40 backdrop-blur-md ${isEvening ? 'bg-evening-bg/80 border-slate-800' : 'bg-white/80 border-gray-100'}`}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={`flex flex-col items-center gap-1 ${view === item.id ? 'text-primary' : 'text-gray-400'}`}
          >
            <item.icon size={22} />
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Training Session Modal */}
      <AnimatePresence>
        {isTraining && (
          <TrainingSession
            isEvening={isEvening}
            exercises={getExercisesForUser(user.profile.problemPhonemes, 5)}
            onCancel={() => setIsTraining(false)}
            onComplete={handleComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
