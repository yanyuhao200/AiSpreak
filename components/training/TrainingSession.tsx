import React, { useState, useEffect, useRef } from 'react';
import { Exercise, AssessmentResult } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { audioService } from '../../services/audioService';
import { assessAudio } from '../../services/assessmentService';
import { Mic, Square, Play, RefreshCcw, CheckCircle, ChevronRight, Volume2 } from 'lucide-react';

interface TrainingSessionProps {
  exercises: Exercise[];
  onFinish: () => void;
}

export const TrainingSession: React.FC<TrainingSessionProps> = ({ exercises, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [visualData, setVisualData] = useState<Uint8Array>(new Uint8Array(0));
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentExercise = exercises[currentIndex];
  const progress = ((currentIndex) / exercises.length) * 100;

  const handleStartRecording = async () => {
    try {
      setResult(null);
      setRecordingUrl(null);
      setIsRecording(true);
      await audioService.startRecording((data) => {
        setVisualData(data);
      });
    } catch (err) {
      console.error(err);
      setIsRecording(false);
    }
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    setIsLoading(true);
    const { blob, url } = await audioService.stopRecording();
    setRecordingUrl(url);
    
    const assessment = await assessAudio(blob, currentExercise.text);
    setResult(assessment);
    setIsLoading(false);
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setResult(null);
      setRecordingUrl(null);
    } else {
      onFinish();
    }
  };

  const handleRetry = () => {
    setResult(null);
    setRecordingUrl(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <Card>
        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-primary text-sm font-bold mb-2">
              目标音: [{currentExercise.targetPhoneme}]
            </span>
            <h2 className="text-2xl font-bold text-gray-800">
              {currentExercise.type === 'tongueTwister' ? '绕口令挑战' : '练习内容'}
            </h2>
          </div>
          <div className="text-gray-400 text-sm">
            {currentIndex + 1} / {exercises.length}
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-10 text-center mb-8 relative group">
          <p className="text-4xl font-bold text-gray-800 mb-4">{currentExercise.text}</p>
          {currentExercise.pinyin && (
            <p className="text-xl text-primary/60 font-mono tracking-widest">{currentExercise.pinyin}</p>
          )}
          <button className="absolute top-4 right-4 p-2 text-primary hover:bg-blue-100 rounded-full transition-colors">
            <Volume2 size={24} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-6">
          {!result && !isLoading && (
            <>
              {isRecording ? (
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="flex items-center gap-1 h-12 w-full max-w-xs justify-center">
                    {Array.from(visualData).slice(0, 20).map((v, i) => (
                      <div 
                        key={i} 
                        className="w-1 bg-primary rounded-full transition-all"
                        // Fix: explicitly convert 'v' to number to avoid 'The left-hand side of an arithmetic operation must be of type any, number...' error
                        style={{ height: `${Math.max(4, Number(v) / 4)}px` }}
                      />
                    ))}
                  </div>
                  <Button variant="danger" size="lg" onClick={handleStopRecording} className="w-48 h-48 rounded-full shadow-xl">
                    <Square fill="white" size={32} />
                  </Button>
                  <p className="text-error font-medium animate-pulse">正在录制中...</p>
                </>
              ) : (
                <Button size="lg" onClick={handleStartRecording} className="w-48 h-48 rounded-full shadow-xl">
                  <Mic size={40} />
                </Button>
              )}
            </>
          )}

          {isLoading && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500">智能分析中...</p>
            </div>
          )}

          {result && (
            <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                  <p className="text-xs text-green-600 mb-1">时长评分</p>
                  <p className="text-2xl font-bold text-green-700">{result.scores.duration}%</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-center">
                  <p className="text-xs text-yellow-600 mb-1">音量稳定性</p>
                  <p className="text-2xl font-bold text-yellow-700">{result.scores.volume}%</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                  <p className="text-xs text-blue-600 mb-1">清晰度</p>
                  <p className="text-2xl font-bold text-blue-700">{result.scores.fluency}%</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <CheckCircle size={18} className="text-success" /> 评估反馈
                </h4>
                <div className="space-y-2">
                  {result.feedback.map((f, i) => (
                    <p key={i} className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm">{f}</p>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={handleRetry}>
                  <RefreshCcw size={18} /> 重试本次
                </Button>
                <Button className="flex-1" onClick={handleNext}>
                  {currentIndex === exercises.length - 1 ? '完成训练' : '下一个内容'} <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};