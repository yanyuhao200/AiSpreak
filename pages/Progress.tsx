
import React from 'react';
import { Card } from '../components/common/Card';
import { useUserStore } from '../stores/useUserStore';
import { Target, Calendar, TrendingUp, BarChart2 } from 'lucide-react';

export const Progress: React.FC = () => {
  const { user } = useUserStore();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: '训练次数', val: user.progress.totalSessions, icon: Target, color: 'bg-blue-500' },
          { label: '总时长(分)', val: user.progress.totalMinutes, icon: Calendar, color: 'bg-green-500' },
          { label: '最高评分', val: Math.max(...user.progress.history.map(h => h.score)), icon: TrendingUp, color: 'bg-purple-500' },
          { label: '平均清晰度', val: Math.round(user.progress.history.reduce((a,b)=>a+b.score, 0)/user.progress.history.length), icon: BarChart2, color: 'bg-orange-500' },
        ].map(stat => (
          <Card key={stat.label} className="p-6">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center text-white mb-4`}>
              <stat.icon size={20} />
            </div>
            <p className="text-sm font-medium text-gray-400">{stat.label}</p>
            <p className="text-3xl font-black text-slate-800 mt-1">{stat.val}</p>
          </Card>
        ))}
      </div>

      <Card title="详细训练记录">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="pb-4 px-2 text-primary font-black text-lg">#</th>
                <th className="pb-4 px-2">日期</th>
                <th className="pb-4 px-2">清晰度得分</th>
                <th className="pb-4 px-2">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {user.progress.history.slice().reverse().map((h, i) => (
                <tr key={i} className="group hover:bg-slate-50 transition-colors">
                  <td className="py-5 px-2 font-mono text-xs text-gray-300">{(user.progress.history.length - i).toString().padStart(2, '0')}</td>
                  <td className="py-5 px-2 font-bold text-slate-700">{h.date}</td>
                  <td className="py-5 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${h.score > 85 ? 'bg-success' : 'bg-primary'}`} style={{ width: `${h.score}%` }} />
                      </div>
                      <span className="font-black text-slate-800 text-sm">{h.score}%</span>
                    </div>
                  </td>
                  <td className="py-5 px-2">
                    <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase">Completed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
