
import { Exercise } from '../types';

export const SYLLABLE_DATABASE: Record<string, any> = {
  'zh': {
    description: '翘舌音，舌尖抵住硬腭前部',
    mouthPosition: '舌尖卷起，抵住上齿龈后方',
    exercises: [
      { id: 'zh-c-1', type: 'character', text: '知', pinyin: 'zhī', targetPhoneme: 'zh', difficulty: 1, tips: '保持舌尖卷起' },
      { id: 'zh-w-1', type: 'word', text: '知道', targetPhoneme: 'zh', difficulty: 1 },
      { id: 'zh-w-2', type: 'word', text: '重要', targetPhoneme: 'zh', difficulty: 2 },
      { id: 'zh-s-1', type: 'sentence', text: '我知道这件事很重要。', targetPhoneme: 'zh', difficulty: 2 },
      { id: 'zh-t-1', type: 'tongueTwister', text: '张叔叔种竹子，竹子做成纸。', targetPhoneme: 'zh', difficulty: 3 }
    ]
  },
  'z': {
    description: '平舌音，舌尖抵住下齿背',
    exercises: [
      { id: 'z-c-1', type: 'character', text: '资', pinyin: 'zī', targetPhoneme: 'z', difficulty: 1 },
      { id: 'z-w-1', type: 'word', text: '姿势', targetPhoneme: 'z', difficulty: 2 },
      { id: 'z-s-1', type: 'sentence', text: '学习需要端正的姿势。', targetPhoneme: 'z', difficulty: 2 }
    ]
  },
  'l': {
    description: '边音，舌尖抵住上齿龈',
    exercises: [
      { id: 'l-c-1', type: 'character', text: '利', pinyin: 'lì', targetPhoneme: 'l', difficulty: 1 },
      { id: 'l-w-1', type: 'word', text: '力量', targetPhoneme: 'l', difficulty: 1 },
      { id: 'l-s-1', type: 'sentence', text: '我们要有改变的力量。', targetPhoneme: 'l', difficulty: 2 }
    ]
  }
};

export const getExercisesForPhonemes = (phonemes: string[], count: number = 5): Exercise[] => {
  const pool: Exercise[] = [];
  phonemes.forEach(p => {
    if (SYLLABLE_DATABASE[p]) {
      pool.push(...SYLLABLE_DATABASE[p].exercises);
    }
  });
  
  // Basic random selection
  return pool.sort(() => Math.random() - 0.5).slice(0, count);
};
