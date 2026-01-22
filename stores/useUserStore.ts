
import { create } from 'zustand';
import { User } from '../types';

interface UserState {
  user: User;
  updatePoints: (points: number) => void;
  updateStreak: () => void;
  addProblemPhoneme: (p: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: {
    id: 'user-1',
    name: '张三',
    settings: {
      availableSlots: ['morning', 'evening'],
      dailyGoal: 15,
      theme: 'light',
    },
    profile: {
      problemPhonemes: ['zh', 'l'],
      currentLevel: 1,
    },
    progress: {
      streakDays: 7,
      points: 350,
      totalMinutes: 120,
      lastTrained: new Date().toISOString(),
    },
  },
  updatePoints: (points) => set((state) => ({
    user: { ...state.user, progress: { ...state.user.progress, points: state.user.progress.points + points } }
  })),
  updateStreak: () => set((state) => ({
    user: { ...state.user, progress: { ...state.user.progress, streakDays: state.user.progress.streakDays + 1 } }
  })),
  addProblemPhoneme: (p) => set((state) => ({
    user: { ...state.user, profile: { ...state.user.profile, problemPhonemes: [...new Set([...state.user.profile.problemPhonemes, p])] } }
  })),
}));
