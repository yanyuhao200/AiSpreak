
export interface User {
  id: string;
  name: string;
  settings: {
    availableSlots: ('morning' | 'evening')[];
    dailyGoal: number; // minutes
    theme: 'light' | 'dark' | 'auto';
  };
  profile: {
    problemPhonemes: string[];
    currentLevel: number; // 1-10
  };
  progress: {
    streakDays: number;
    totalMinutes: number;
    totalSessions: number;
    points: number;
    lastTrained: string | null;
    history: { date: string; score: number }[];
  };
}

export type ExerciseType = 'character' | 'word' | 'sentence' | 'tongueTwister';

export interface Exercise {
  id: string;
  type: ExerciseType;
  text: string;
  pinyin?: string;
  targetPhoneme: string;
  difficulty: number;
  tips?: string;
}

export interface AssessmentResult {
  scores: {
    duration: number; // 0-100
    volume: number; // 0-100
    fluency: number; // 0-100
    overall: number; // 0-100
  };
  feedback: string[];
  suggestions: {
    shortTerm: string[];
    longTerm: string[];
  };
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  condition: string;
  unlocked: boolean;
}
