
import React from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useUserStore } from '../stores/useUserStore';
import { Flame, Trophy, Target, Play, ChevronRight, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { day: '1', score: 65 },
  { day: '5', score: 72 },
  { day: '10', score: 70 },
  { day: '15', score: 78 },
  { day: '20', score: 85 },
  { day: '25', score: 82 },
  { day: '28', score: 91 },
];

export const Dashboard: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const { user } = useUserStore();

  const isMorning = new Date().getHours() < 12;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome & Start */}
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1 bg-gradient-to-br from-primary to-blue-400 text-white border-none">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-50 font-medium mb-1">
                {isMorning ? '🌅 早上好，' : '🌙 晚上好，'}{user.name}
              </p>
              <h2 className="text-3xl font-bold mb-4">开启今日高效训练</h2>
              <p className="text-blue-50/80 max-w-xs mb-6">
                专注攻克 [{user.profile.problemPhonemes.join(', ')}]，让每个发音都清晰有力。
              </p>
              <Button onClick={onStart} variant="secondary" size="lg" className="font-bold text-primary group">
                开始练习 <Play size={20} fill="currentColor" className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                <Target size={64} className="text-white" />
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-1 gap-4 w-full md:w-64">
          <Card className="flex flex-col items-center justify-center py-4 text-center">
            <Flame className="text-orange-500 mb-2" size={32} />
            <p className="text-sm text-gray-500">连续打卡</p>
            <p className="text-2xl font-bold">{user.progress.streakDays} 天</p>
          </Card>
          <Card className="flex flex-col items-center justify-center py-4 text-center">
            <Trophy className="text-yellow-500 mb-2" size={32} />
            <p className="text-sm text-gray-500">当前积分</p>
            <p className="text-2xl font-bold">{user.progress.points}</p>
          </Card>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card title="清晰度提升趋势" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#3A86FF" strokeWidth={3} dot={{r: 4, fill: '#3A86FF'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="训练重点分布">
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-2">
              {['zh', 'ch', 'sh', 'r', 'z', 'c', 's', 'l'].map((p, i) => (
                <div 
                  key={p} 
                  className={`aspect-square rounded-lg flex items-center justify-center font-bold transition-all
                    ${user.profile.problemPhonemes.includes(p) ? 'bg-primary text-white scale-110 shadow-lg' : 'bg-gray-100 text-gray-400'}`}
                >
                  {p}
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-50">
              <p className="text-sm text-gray-500 mb-4">最近掌握的徽章</p>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <div className="min-w-[48px] h-12 bg-yellow-50 rounded-full flex items-center justify-center text-xl">🏆</div>
                <div className="min-w-[48px] h-12 bg-blue-50 rounded-full flex items-center justify-center text-xl">🐦</div>
                <div className="min-w-[48px] h-12 bg-green-50 rounded-full flex items-center justify-center text-xl">🔥</div>
                <div className="min-w-[48px] h-12 bg-purple-50 rounded-full flex items-center justify-center text-xl">👑</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Plan */}
      <Card title="训练记录">
        <div className="space-y-4">
           {[
             { date: '2024-03-20', type: '晚间强化', score: 92, status: 'completed' },
             { date: '2024-03-19', type: '综合训练', score: 88, status: 'completed' },
             { date: '2024-03-18', type: '基础唤醒', score: 85, status: 'completed' },
           ].map((item, i) => (
             <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                   <Award size={20} />
                 </div>
                 <div>
                   <p className="font-semibold text-gray-800">{item.type}</p>
                   <p className="text-xs text-gray-500">{item.date}</p>
                 </div>
               </div>
               <div className="flex items-center gap-4">
                 <div className="text-right">
                   <p className="font-bold text-primary">{item.score}%</p>
                   <p className="text-[10px] text-success font-medium">清晰度评分</p>
                 </div>
                 <ChevronRight size={18} className="text-gray-300 group-hover:text-primary transition-colors" />
               </div>
             </div>
           ))}
        </div>
      </Card>
    </div>
  );
};
