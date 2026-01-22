
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
    currentLevel: number;
  };
  progress: {
    streakDays: number;
    points: number;
    totalMinutes: number;
    lastTrained: string | null;
  };
}

export interface Exercise {
  id: string;
  type: 'character' | 'word' | 'sentence' | 'tongueTwister';
  text: string;
  pinyin?: string;
  targetPhoneme: string;
  difficulty: number;
  tips?: string;
}

export interface AssessmentResult {
  scores: {
    duration: number;
    volume: number;
    fluency: number;
    overall: number;
  };
  feedback: string[];
  suggestions: string[];
}

export interface TrainingSession {
  id: string;
  startTime: Date;
  exercises: {
    exercise: Exercise;
    result?: AssessmentResult;
    audioUrl?: string;
  }[];
}
