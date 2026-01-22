
import React, { useState } from 'react';
import { Exercise, AssessmentResult } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { audioService } from '../../services/audioService';
import { assessAudio } from '../../services/assessmentService';
import { Mic, Square, RefreshCcw, CheckCircle, ChevronRight, Volume2 } from 'lucide-react';

interface TrainingSessionProps {
  exercises: Exercise[];
  onFinish: () => void;
}

export const TrainingSession: React.FC<TrainingSessionProps> = ({ exercises, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [visualData, setVisualData] = useState<Uint8Array>(new Uint8Array(20).fill(0));
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 安全检查
  if (!exercises || exercises.length === 0) {
    return <div className="text-center p-10">暂无练习内容</div>;
  }

  const currentExercise = exercises[currentIndex];
  const progress = exercises.length > 0 ? (currentIndex / exercises.length) * 100 : 0;

  const handleStartRecording = async () => {
    try {
      setResult(null);
      setIsRecording(true);
      await audioService.startRecording((data) => {
        setVisualData(new Uint8Array(data));
      });
    } catch (err) {
      console.error('录音启动失败:', err);
      setIsRecording(false);
    }
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    setIsLoading(true);
    try {
      const { blob } = await audioService.stopRecording();
      const assessment = await assessAudio(blob, currentExercise.text);
      setResult(assessment);
    } catch (err) {
      console.error('评估失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setResult(null);
    } else {
      onFinish();
    }
  };

  const handleRetry = () => {
    setResult(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 进度条 */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <Card>
        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-bold mb-2 uppercase tracking-wider">
              目标音: [{currentExercise.targetPhoneme}]
            </span>
            <h2 className="text-2xl font-bold text-gray-800">
              {currentExercise.type === 'tongueTwister' ? '绕口令挑战' : '练习内容'}
            </h2>
          </div>
          <div className="text-gray-400 text-sm font-mono">
            {currentIndex + 1} / {exercises.length}
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-10 text-center mb-8 relative border border-gray-100 shadow-inner group">
          <p className="text-4xl font-bold text-gray-800 mb-4">{currentExercise.text}</p>
          {currentExercise.pinyin && (
            <p className="text-xl text-primary/60 font-mono tracking-widest">{currentExercise.pinyin}</p>
          )}
          <button className="absolute top-4 right-4 p-2 text-primary hover:bg-blue-100 rounded-full transition-all active:scale-90">
            <Volume2 size={24} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-6">
          {!result && !isLoading && (
            <div className="flex flex-col items-center gap-6 w-full">
              {isRecording ? (
                <>
                  <div className="flex items-end gap-1 h-16 w-full max-w-xs justify-center overflow-hidden">
                    {Array.from(visualData).slice(0, 32).map((v, i) => (
                      <div 
                        key={i} 
                        className="w-1.5 bg-primary rounded-t-full transition-all duration-75"
                        // Explicitly convert v to number to fix arithmetic operation type error
                        style={{ height: `${Math.max(10, (Number(v) / 255) * 100)}%` }}
                      />
                    ))}
                  </div>
                  <Button variant="danger" size="lg" onClick={handleStopRecording} className="w-48 h-48 rounded-full shadow-2xl shadow-red-200 ring-8 ring-red-50">
                    <Square fill="currentColor" size={32} />
                  </Button>
                  <p className="text-error font-semibold animate-pulse flex items-center gap-2">
                    <span className="w-2 h-2 bg-error rounded-full"></span> 正在录制中...
                  </p>
                </>
              ) : (
                <>
                  <Button size="lg" onClick={handleStartRecording} className="w-48 h-48 rounded-full shadow-2xl shadow-blue-200 ring-8 ring-blue-50">
                    <Mic size={40} />
                  </Button>
                  <p className="text-gray-400 font-medium">点击麦克风开始训练</p>
                </>
              )}
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center gap-4 py-12">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0" />
              </div>
              <p className="text-primary font-medium animate-pulse">正在进行智能声学评估...</p>
            </div>
          )}

          {result && (
            <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 p-5 rounded-2xl border border-green-100 text-center shadow-sm">
                  <p className="text-xs text-green-600 font-bold mb-1 uppercase tracking-tighter">时长匹配</p>
                  <p className="text-3xl font-black text-green-700">{result.scores.duration}%</p>
                </div>
                <div className="bg-warning/10 p-5 rounded-2xl border border-warning/20 text-center shadow-sm">
                  <p className="text-xs text-warning font-bold mb-1 uppercase tracking-tighter">音量稳定</p>
                  <p className="text-3xl font-black text-warning">{result.scores.volume}%</p>
                </div>
                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 text-center shadow-sm">
                  <p className="text-xs text-primary font-bold mb-1 uppercase tracking-tighter">清晰度</p>
                  <p className="text-3xl font-black text-primary">{result.scores.fluency}%</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                  <CheckCircle size={22} className="text-success" /> 评估反馈报告
                </h4>
                <div className="space-y-3">
                  {result.feedback.map((f, i) => (
                    <div key={i} className="text-gray-700 bg-white border border-gray-100 p-4 rounded-xl text-sm leading-relaxed shadow-sm">
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 py-4" onClick={handleRetry}>
                  <RefreshCcw size={18} /> 重试本次
                </Button>
                <Button className="flex-1 py-4" onClick={handleNext}>
                  {currentIndex === exercises.length - 1 ? '完成本轮训练' : '下一个内容'} <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
