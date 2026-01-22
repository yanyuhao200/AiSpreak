
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Badge } from '../types';

interface UserState {
  user: User;
  badges: Badge[];
  updatePoints: (points: number) => void;
  addTrainingRecord: (score: number, duration: number) => void;
  updateSettings: (settings: Partial<User['settings']>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {
        id: 'user-1',
        name: '训练者',
        settings: {
          availableSlots: ['morning', 'evening'],
          dailyGoal: 15,
          theme: 'auto',
        },
        profile: {
          problemPhonemes: ['zh', 'sh', 'l', 'n'],
          currentLevel: 1,
        },
        progress: {
          streakDays: 7,
          totalMinutes: 145,
          totalSessions: 12,
          points: 450,
          lastTrained: new Date().toISOString(),
          history: [
            { date: '2024-03-01', score: 65 },
            { date: '2024-03-02', score: 72 },
            { date: '2024-03-03', score: 70 },
            { date: '2024-03-04', score: 78 },
            { date: '2024-03-05', score: 85 },
            { date: '2024-03-06', score: 82 },
            { date: '2024-03-07', score: 91 },
          ],
        },
      },
      badges: [
        { id: 'b1', name: '早起鸟', icon: '🐦', condition: '连续7天早上训练', unlocked: true },
        { id: 'b2', name: '夜猫子', icon: '🦉', condition: '连续7天晚上训练', unlocked: false },
        { id: 'b3', name: '一周坚持', icon: '🔥', condition: '连续7天训练', unlocked: true },
        { id: 'b4', name: '翘舌音大师', icon: '👑', condition: 'zh/ch/sh准确率>90%', unlocked: true },
      ],
      updatePoints: (points) => set((state) => ({
        user: { ...state.user, progress: { ...state.user.progress, points: state.user.progress.points + points } }
      })),
      addTrainingRecord: (score, duration) => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        const lastRecord = state.user.progress.history[state.user.progress.history.length - 1];
        let newHistory = [...state.user.progress.history];
        
        if (lastRecord && lastRecord.date === today) {
          newHistory[newHistory.length - 1] = { date: today, score: Math.round((lastRecord.score + score) / 2) };
        } else {
          newHistory.push({ date: today, score });
        }

        return {
          user: {
            ...state.user,
            progress: {
              ...state.user.progress,
              totalMinutes: state.user.progress.totalMinutes + duration,
              totalSessions: state.user.progress.totalSessions + 1,
              lastTrained: new Date().toISOString(),
              history: newHistory
            }
          }
        };
      }),
      updateSettings: (settings) => set((state) => ({
        user: { ...state.user, settings: { ...state.user.settings, ...settings } }
      }))
    }),
    {
      name: 'clear-voice-user-storage'
    }
  )
);
