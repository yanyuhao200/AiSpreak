
import React, { useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import { TrainingSession } from './components/training/TrainingSession';
import { useUserStore } from './stores/useUserStore';
import { getExercisesForPhonemes } from './data/syllables';
import { Mic2, LayoutDashboard, LineChart, Settings, Bell, User as UserIcon } from 'lucide-react';

type View = 'dashboard' | 'training' | 'progress' | 'settings';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isTraining, setIsTraining] = useState(false);
  const { user, updatePoints } = useUserStore();

  const handleStartTraining = () => {
    setIsTraining(true);
  };

  const handleFinishTraining = () => {
    setIsTraining(false);
    updatePoints(50); // Bonus for finishing
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-24 bg-white border-r border-gray-100 flex-col items-center py-8 gap-10 sticky top-0 h-screen">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 mb-4">
          <Mic2 size={24} />
        </div>
        
        <nav className="flex flex-col gap-6">
          <button 
            onClick={() => { setCurrentView('dashboard'); setIsTraining(false); }}
            className={`p-3 rounded-xl transition-all ${currentView === 'dashboard' ? 'bg-blue-50 text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <LayoutDashboard size={24} />
          </button>
          <button 
            onClick={() => setCurrentView('progress')}
            className={`p-3 rounded-xl transition-all ${currentView === 'progress' ? 'bg-blue-50 text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <LineChart size={24} />
          </button>
          <button 
            onClick={() => setCurrentView('settings')}
            className={`p-3 rounded-xl transition-all ${currentView === 'settings' ? 'bg-blue-50 text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Settings size={24} />
          </button>
        </nav>

        <div className="mt-auto flex flex-col gap-6">
          <button className="text-gray-400 hover:text-gray-600 relative">
            <Bell size={24} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100 p-0.5">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10 max-w-5xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isTraining ? '正在训练中...' : '训练概览'}
            </h1>
            <p className="text-gray-500 text-sm">提升清晰度，从每一个发音开始</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex bg-white px-4 py-2 rounded-xl shadow-sm items-center gap-2 border border-gray-50">
               <span className="text-yellow-500 font-bold">⭐</span>
               <span className="font-bold text-gray-700">{user.progress.points}</span>
             </div>
             <button className="md:hidden w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
               <UserIcon size={20} className="text-gray-500" />
             </button>
          </div>
        </header>

        <div className="max-w-5xl mx-auto">
          {isTraining ? (
            <TrainingSession 
              exercises={getExercisesForPhonemes(user.profile.problemPhonemes, 5)} 
              onFinish={handleFinishTraining}
            />
          ) : (
            <Dashboard onStart={handleStartTraining} />
          )}
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-around items-center z-50">
        <button 
          onClick={() => { setCurrentView('dashboard'); setIsTraining(false); }}
          className={currentView === 'dashboard' ? 'text-primary' : 'text-gray-400'}
        >
          <LayoutDashboard size={24} />
        </button>
        <button 
          onClick={() => setCurrentView('progress')}
          className={currentView === 'progress' ? 'text-primary' : 'text-gray-400'}
        >
          <LineChart size={24} />
        </button>
        <button 
          onClick={handleStartTraining}
          className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white -mt-8 shadow-lg shadow-blue-200"
        >
          <Mic2 size={24} />
        </button>
        <button 
          onClick={() => setCurrentView('settings')}
          className={currentView === 'settings' ? 'text-primary' : 'text-gray-400'}
        >
          <Settings size={24} />
        </button>
      </nav>
    </div>
  );
};

export default App;
