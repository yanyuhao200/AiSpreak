
import React, { useState, useEffect } from 'react';
import { Exercise, AssessmentResult } from '../../types';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { audioService } from '../../services/audioService';
import { assessPronunciation } from '../../services/assessmentService';
import { Mic, Square, RefreshCcw, CheckCircle, ChevronRight, Volume2, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrainingSessionProps {
  exercises: Exercise[];
  onComplete: (score: number) => void;
  onCancel: () => void;
  isEvening?: boolean;
}

export const TrainingSession: React.FC<TrainingSessionProps> = ({ exercises, onComplete, onCancel, isEvening }) => {
  const [index, setIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [visualData, setVisualData] = useState<Uint8Array>(new Uint8Array(32).fill(0));
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionResults, setSessionResults] = useState<number[]>([]);

  const current = exercises[index];
  const progress = ((index + 1) / exercises.length) * 100;

  const startRec = async () => {
    setResult(null);
    setIsRecording(true);
    await audioService.startRecording((data) => {
      setVisualData(data.slice(0, 32));
    });
  };

  const stopRec = async () => {
    setIsRecording(false);
    setIsProcessing(true);
    const { blob } = await audioService.stopRecording();
    const assessment = await assessPronunciation(blob, current.text);
    setResult(assessment);
    setSessionResults([...sessionResults, assessment.scores.overall]);
    setIsProcessing(false);
  };

  const handleNext = () => {
    if (index < exercises.length - 1) {
      setIndex(index + 1);
      setResult(null);
    } else {
      const avg = Math.round(sessionResults.reduce((a, b) => a + b, 0) / sessionResults.length);
      onComplete(avg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-2xl overflow-hidden rounded-[32px] shadow-2xl ${isEvening ? 'bg-evening-card' : 'bg-white'}`}
      >
        <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100/10">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">训练进度 {index + 1}/{exercises.length}</span>
              <span className="text-xs font-medium text-gray-400">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary" 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <button onClick={onCancel} className="ml-6 p-2 text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="text-center space-y-4">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${isEvening ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-primary'}`}>
              目标音：{current.targetPhoneme}
            </span>
            <div className={`p-10 rounded-3xl border shadow-inner ${isEvening ? 'bg-evening-bg border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
              <h2 className={`text-5xl font-bold mb-4 ${isEvening ? 'text-white' : 'text-slate-800'}`}>{current.text}</h2>
              {current.pinyin && <p className="text-xl text-primary font-mono tracking-widest">{current.pinyin}</p>}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-6">
            {!result && !isProcessing && (
              <div className="flex flex-col items-center gap-6">
                {isRecording ? (
                  <>
                    <div className="flex items-end gap-1 h-12 w-48 overflow-hidden">
                      {Array.from(visualData).map((v, i) => (
                        <div key={i} className="flex-1 bg-primary rounded-t-sm" style={{ height: `${(v / 255) * 100}%` }} />
                      ))}
                    </div>
                    <Button variant="danger" size="lg" className="w-20 h-20 rounded-full" onClick={stopRec}>
                      <Square fill="currentColor" size={24} />
                    </Button>
                    <p className="text-error font-semibold animate-pulse">正在录音...</p>
                  </>
                ) : (
                  <>
                    <Button size="lg" className="w-20 h-20 rounded-full shadow-2xl" onClick={startRec}>
                      <Mic size={32} />
                    </Button>
                    <p className={`text-sm ${isEvening ? 'text-slate-400' : 'text-slate-500'}`}>点击麦克风开始录制</p>
                  </>
                )}
              </div>
            )}

            {isProcessing && (
              <div className="py-12 flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-primary font-medium">智能评估中...</p>
              </div>
            )}

            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full space-y-6"
                >
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: '总体', val: result.scores.overall },
                      { label: '时长', val: result.scores.duration },
                      { label: '音量', val: result.scores.volume },
                      { label: '清晰', val: result.scores.fluency }
                    ].map(s => (
                      <div key={s.label} className={`p-4 rounded-2xl border text-center ${isEvening ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">{s.label}</p>
                        <p className={`text-xl font-bold ${s.val > 80 ? 'text-success' : 'text-primary'}`}>{s.val}%</p>
                      </div>
                    ))}
                  </div>

                  <div className={`p-6 rounded-2xl border ${isEvening ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
                    <h4 className="flex items-center gap-2 font-bold text-primary mb-3 text-sm">
                      <CheckCircle size={16} /> 评估反馈
                    </h4>
                    <ul className="space-y-2">
                      {result.feedback.map((f, i) => (
                        <li key={i} className="text-sm text-slate-400 flex gap-2">
                          <span className="text-primary">•</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1" onClick={startRec}><RefreshCcw size={18} /> 重试</Button>
                    <Button className="flex-1" onClick={handleNext}>{index === exercises.length - 1 ? '结束训练' : '下一题'} <ChevronRight size={18} /></Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
