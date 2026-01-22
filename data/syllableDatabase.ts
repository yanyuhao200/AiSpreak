
import { Exercise } from '../types';

export const SYLLABLE_DATABASE: Record<string, { description: string; mouthPosition: string; exercises: Exercise[] }> = {
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
  'sh': {
    description: '翘舌音，舌尖靠近硬腭前部',
    mouthPosition: '舌尖卷起，靠近上齿龈',
    exercises: [
      { id: 'sh-c-1', type: 'character', text: '是', pinyin: 'shì', targetPhoneme: 'sh', difficulty: 1 },
      { id: 'sh-w-1', type: 'word', text: '时间', targetPhoneme: 'sh', difficulty: 1 },
      { id: 'sh-s-1', type: 'sentence', text: '时间就是金钱，我的朋友。', targetPhoneme: 'sh', difficulty: 2 }
    ]
  },
  'l': {
    description: '边音，舌尖抵住上齿龈',
    mouthPosition: '舌尖顶住上牙膛，气流从两侧出',
    exercises: [
      { id: 'l-c-1', type: 'character', text: '利', pinyin: 'lì', targetPhoneme: 'l', difficulty: 1 },
      { id: 'l-w-1', type: 'word', text: '力量', targetPhoneme: 'l', difficulty: 1 },
      { id: 'l-s-1', type: 'sentence', text: '我们要有改变的力量。', targetPhoneme: 'l', difficulty: 2 }
    ]
  },
  'n': {
    description: '鼻音，舌尖抵住上齿龈',
    mouthPosition: '舌尖顶住上牙膛，气流从鼻腔出',
    exercises: [
      { id: 'n-c-1', type: 'character', text: '你', pinyin: 'nǐ', targetPhoneme: 'n', difficulty: 1 },
      { id: 'n-w-1', type: 'word', text: '牛奶', targetPhoneme: 'n', difficulty: 1 },
      { id: 'n-s-1', type: 'sentence', text: '你喝完牛奶了吗？', targetPhoneme: 'n', difficulty: 2 }
    ]
  }
};

export const getExercisesForUser = (problemPhonemes: string[], count: number = 5): Exercise[] => {
  const pool: Exercise[] = [];
  problemPhonemes.forEach(p => {
    if (SYLLABLE_DATABASE[p]) {
      pool.push(...SYLLABLE_DATABASE[p].exercises);
    }
  });
  
  if (pool.length === 0) {
    // Fallback to all if user has no specified problems
    Object.values(SYLLABLE_DATABASE).forEach(group => pool.push(...group.exercises));
  }

  return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
};
