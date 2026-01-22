
import React from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useUserStore } from '../stores/useUserStore';
import { Flame, Trophy, Target, Play, ChevronRight, Award, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  onStartTraining: () => void;
  isEvening: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartTraining, isEvening }) => {
  const { user, badges } = useUserStore();

  const mockHeatmapData = [
    { name: 'zh', freq: 85 },
    { name: 'ch', freq: 70 },
    { name: 'sh', freq: 65 },
    { name: 'r', freq: 40 },
    { name: 'n', freq: 90 },
    { name: 'l', freq: 88 },
    { name: 'z', freq: 30 },
    { name: 'c', freq: 25 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Welcome Card */}
      <div className={`relative overflow-hidden rounded-[40px] p-10 text-white ${isEvening ? 'bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-800' : 'bg-gradient-to-br from-primary to-blue-400'}`}>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-md space-y-4 text-center md:text-left">
            <h2 className="text-4xl font-extrabold tracking-tight">
              {isEvening ? '晚安，专注时刻 🌙' : '早安，唤醒肌肉 ☀️'}
            </h2>
            <p className="text-blue-50/80 text-lg leading-relaxed">
              今日训练重点：<span className="font-bold underline">翘舌音突破</span>。已为您生成 {isEvening ? '15分钟极速版' : '25分钟完整版'} 计划。
            </p>
            <Button onClick={onStartTraining} variant="secondary" size="lg" className="px-10 py-5 rounded-3xl text-primary font-black shadow-2xl">
              <Play fill="currentColor" size={24} /> 开始训练
            </Button>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-[32px] p-6 text-center w-32 border border-white/20">
              <Flame className="mx-auto text-orange-400 mb-2" size={32} />
              <p className="text-xs text-white/60">打卡</p>
              <p className="text-2xl font-black">{user.progress.streakDays}天</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-[32px] p-6 text-center w-32 border border-white/20">
              <Trophy className="mx-auto text-yellow-400 mb-2" size={32} />
              <p className="text-xs text-white/60">积分</p>
              <p className="text-2xl font-black">{user.progress.points}</p>
            </div>
          </div>
        </div>
        {/* Abstract shapes for background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Col: Analytics */}
        <div className="lg:col-span-2 space-y-8">
          <Card title="清晰度趋势" className={isEvening ? 'bg-evening-card border-none' : ''}>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={user.progress.history}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isEvening ? "#333" : "#f0f0f0"} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: isEvening ? '#555' : '#999', fontSize: 12}} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#3A86FF" strokeWidth={4} dot={{r: 6, fill: '#3A86FF', strokeWidth: 2, stroke: '#fff'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="问题音训练热力分布" className={isEvening ? 'bg-evening-card border-none text-white' : ''}>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mt-4">
              {mockHeatmapData.map(d => (
                <div key={d.name} className="flex flex-col items-center gap-2">
                  <div 
                    className={`w-full aspect-square rounded-xl flex items-center justify-center font-bold transition-all shadow-sm ${d.freq > 80 ? 'bg-primary text-white' : d.freq > 50 ? 'bg-blue-100 text-primary' : 'bg-gray-50 text-gray-300'}`}
                    style={{ opacity: 0.3 + (d.freq / 100) * 0.7 }}
                  >
                    {d.name}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{d.freq}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: Badges & Tasks */}
        <div className="space-y-8">
          <Card title="成就徽章" className={isEvening ? 'bg-evening-card border-none text-white' : ''}>
            <div className="grid grid-cols-2 gap-4">
              {badges.map(b => (
                <div key={b.id} className={`flex flex-col items-center p-4 rounded-2xl border ${b.unlocked ? 'border-primary/20 bg-primary/5' : 'border-gray-100 bg-gray-50 opacity-40 grayscale'}`}>
                  <span className="text-3xl mb-1">{b.icon}</span>
                  <p className="text-xs font-bold text-center">{b.name}</p>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-xs font-bold text-primary">
              查看所有成就 <ChevronRight size={14} />
            </Button>
          </Card>

          <Card className={`overflow-hidden p-0 border-none ${isEvening ? 'bg-evening-card text-white' : 'bg-white shadow-xl'}`}>
            <div className="bg-warning p-4 flex items-center gap-3 text-white">
              <Zap size={20} fill="currentColor" />
              <span className="font-bold text-sm">今日极速练习推荐</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center group cursor-pointer">
                <div>
                  <p className="font-bold text-sm">翘舌音：zh/sh 对比</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-tighter">预计耗时：5分钟</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Play size={14} fill="currentColor" />
                </div>
              </div>
              <div className="flex justify-between items-center group cursor-pointer pt-4 border-t border-gray-50">
                <div>
                  <p className="font-bold text-sm">绕口令挑战：八百标兵</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-tighter">预计耗时：3分钟</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Play size={14} fill="currentColor" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
