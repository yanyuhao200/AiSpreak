
import { AssessmentResult } from '../types';

export const assessAudio = async (blob: Blob, targetText: string): Promise<AssessmentResult> => {
  // In a real app, this would use a Web Audio API analysis or send to an AI model
  // For MVP, we simulate scientific feedback based on duration and audio characteristics
  
  const mockDurationScore = Math.floor(70 + Math.random() * 25);
  const mockVolumeScore = Math.floor(65 + Math.random() * 30);
  const mockFluencyScore = Math.floor(60 + Math.random() * 35);
  
  const overall = Math.floor((mockDurationScore + mockVolumeScore + mockFluencyScore) / 3);
  
  const feedbacks = [];
  if (mockDurationScore < 80) feedbacks.push("发音时长略短，建议放慢语速，让音节更饱满。");
  if (mockVolumeScore < 80) feedbacks.push("音量稳定性有待提高，注意气息的持续支撑。");
  if (overall >= 90) feedbacks.push("太棒了！发音非常清晰。");
  
  const suggestions = [
    "尝试在发音时心中默数1-2-3",
    "对着镜子观察口型，确保发音到位"
  ];

  return {
    scores: {
      duration: mockDurationScore,
      volume: mockVolumeScore,
      fluency: mockFluencyScore,
      overall: overall
    },
    feedback: feedbacks,
    suggestions: suggestions
  };
};
