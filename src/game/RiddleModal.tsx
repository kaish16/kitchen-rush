import { useEffect, useState, useCallback } from 'react';
import type { FoodRiddle, ActiveConveyorOrder } from './types';
import { sounds } from './sound';
import { HelpCircle } from 'lucide-react';

interface RiddleModalProps {
  order: ActiveConveyorOrder;
  onAnswer: (correct: boolean) => void;
}

export function RiddleModal({ order, onAnswer }: RiddleModalProps) {
  const riddle: FoodRiddle = order.riddle;
  const RIDDLE_TIME_LIMIT = 15; // 15 seconds to solve
  const [timeLeft, setTimeLeft] = useState<number>(RIDDLE_TIME_LIMIT);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  // Play riddle open sound on mount
  useEffect(() => {
    sounds.riddleOpen();
  }, []);

  const handleSelect = useCallback((idx: number) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedIdx(idx);

    const isCorrect = idx === riddle.correctIndex;

    if (isCorrect) {
      sounds.riddleCorrect();
    } else {
      sounds.riddleWrong();
    }

    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1400);
  }, [isAnswered, onAnswer, riddle.correctIndex]);

  // Timer countdown
  useEffect(() => {
    if (isAnswered) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleSelect(-1); // Timeout is fail
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isAnswered, handleSelect]);

  // Keyboard shortcuts 1, 2, 3, 4 or A, B, C, D
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isAnswered) return;
      if (['Digit1', 'KeyA'].includes(e.code)) handleSelect(0);
      if (['Digit2', 'KeyB'].includes(e.code)) handleSelect(1);
      if (['Digit3', 'KeyC'].includes(e.code)) handleSelect(2);
      if (['Digit4', 'KeyD'].includes(e.code)) handleSelect(3);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isAnswered, handleSelect]);

  const timePct = (timeLeft / RIDDLE_TIME_LIMIT) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none animate-fade-in">
      <div className="relative w-full max-w-xl bg-neutral-900 border-2 border-amber-400 rounded-3xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.4)] flex flex-col items-center text-center overflow-hidden">
        {/* Top Timer Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-neutral-800">
          <div
            className={`h-full transition-all duration-1000 ${
              timeLeft > 5 ? 'bg-amber-400' : 'bg-red-500 animate-pulse'
            }`}
            style={{ width: `${timePct}%` }}
          />
        </div>

        {/* Customer Header Tag */}
        <div className="flex items-center gap-2 mt-2 px-3.5 py-1 rounded-full bg-neutral-800 border border-white/10 text-xs font-bold text-slate-300">
          <span className="text-xl">{riddle.customerAvatar}</span>
          <span className="text-amber-400 font-black">{riddle.customerName}</span>
          <span>demands an answer before accepting {order.recipe.name}!</span>
        </div>

        {/* Dish Badge */}
        <div className="flex items-center gap-2 my-3 px-4 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-400/40 text-amber-200">
          <span className="text-2xl">{order.recipe.emoji}</span>
          <span className="text-sm font-black uppercase tracking-wider">{order.recipe.name} Ready</span>
          <span className="text-xs text-emerald-400 font-bold ml-2">+${order.recipe.reward} Reward</span>
        </div>

        {/* The Food Riddle Box */}
        <div className="w-full bg-neutral-950/80 border border-white/10 rounded-2xl p-4 my-2 text-left">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-400 mb-2">
            <HelpCircle size={14} />
            <span>FOOD RIDDLE TEST</span>
            <span className="ml-auto text-slate-400 text-[11px] font-mono tabular-nums">
              ⏱️ {timeLeft}s remaining
            </span>
          </div>
          <p className="text-base md:text-lg font-bold text-white leading-relaxed">
            "{riddle.prompt}"
          </p>
        </div>

        {/* 4 Interactive MCQ Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 w-full my-3">
          {riddle.options.map((option, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx];
            const isSelected = selectedIdx === idx;
            const isCorrectAnswer = idx === riddle.correctIndex;

            let btnStyle = 'bg-neutral-800/90 border-slate-700 text-white hover:border-amber-400 hover:bg-neutral-750';

            if (isAnswered) {
              if (isCorrectAnswer) {
                btnStyle = 'bg-emerald-600 border-emerald-300 text-white shadow-[0_0_20px_#10b981] animate-pulse';
              } else if (isSelected && !isCorrectAnswer) {
                btnStyle = 'bg-red-600 border-red-300 text-white shadow-[0_0_15px_#ef4444]';
              } else {
                btnStyle = 'bg-neutral-800/40 border-slate-800 text-slate-500 opacity-40';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelect(idx)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all transform active:scale-95 cursor-pointer font-bold text-sm ${btnStyle}`}
              >
                <span className="w-7 h-7 rounded-xl bg-black/40 flex items-center justify-center font-black text-xs text-amber-400 border border-white/10">
                  {letter}
                </span>
                <span className="flex-1 leading-snug">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation on Reveal */}
        {isAnswered && (
          <div
            className={`w-full p-3 rounded-xl border text-xs font-medium text-left animate-pop ${
              selectedIdx === riddle.correctIndex
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                : 'bg-red-950/80 border-red-500 text-red-200'
            }`}
          >
            <strong>{selectedIdx === riddle.correctIndex ? '✅ CORRECT! ' : '❌ FAILED! '}</strong>
            {riddle.explanation}
          </div>
        )}

        {/* Quick Instructions Footer */}
        {!isAnswered && (
          <div className="text-[11px] text-slate-400 mt-2">
            Click an option or press <strong className="text-white">1, 2, 3, 4</strong> or <strong className="text-white">A, B, C, D</strong>
          </div>
        )}
      </div>
    </div>
  );
}
