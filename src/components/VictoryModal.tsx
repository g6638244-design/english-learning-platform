import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, Volume2, ArrowRight, RotateCcw, Grid, Heart } from 'lucide-react';
import { WordClue } from '../types';
import { speakEnglishWord } from '../utils/audio';

interface VictoryModalProps {
  isOpen: boolean;
  stars: number;
  hintsUsed: number;
  words: WordClue[];
  onNextPuzzle?: () => void;
  onRestart: () => void;
  onSelectThemes: () => void;
  soundEnabled: boolean;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  stars,
  hintsUsed,
  words,
  onNextPuzzle,
  onRestart,
  onSelectThemes,
  soundEnabled,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti burst in brand colors: royal blue, yellow, cyan, coral
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          colors: ['#FFD13B', '#00A3C4', '#FF6B6B', '#0052CC', '#FFFFFF'],
          origin: { y: 0.6 },
        });
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="relative w-full max-w-lg rounded-3xl sm:rounded-[36px] bg-white shadow-2xl overflow-hidden border-4 border-white text-center p-6 sm:p-8 space-y-5 animate-scaleUp">
        {/* Decorative heart */}
        <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#FF6B6B] flex items-center justify-center shadow-md">
          <Heart className="w-5 h-5 fill-white text-white" />
        </div>

        {/* Brand Trophy Badge in Sunny Yellow */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-[#FFD13B] border-4 border-amber-300 text-[#0F2756] flex items-center justify-center shadow-lg shadow-amber-300/40">
          <Trophy className="w-10 h-10 animate-bounce" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <div className="inline-block px-3 py-1 rounded-full bg-[#00A3C4] text-white text-xs font-black uppercase mb-1">
            Let's learn English!
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F2756] tracking-tight">
            Сканворд разгадан!
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-bold">
            Отличная работа! Ты выучил {words.length} новых английских слов!
          </p>
        </div>

        {/* Stars */}
        <div className="flex justify-center items-center gap-2">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`p-2 rounded-2xl transition-transform ${
                stars >= starIdx ? 'scale-110' : 'opacity-30'
              }`}
            >
              <Star
                className={`w-10 h-10 ${
                  stars >= starIdx
                    ? 'fill-[#FFD13B] text-amber-500 drop-shadow-md'
                    : 'text-gray-300'
                }`}
              />
            </div>
          ))}
        </div>

        <p className="text-xs font-black text-[#0047BA]">
          {hintsUsed === 0
            ? 'Без единой подсказки! Золотой результат! 🌟'
            : `Использовано подсказок: ${hintsUsed}`}
        </p>

        {/* Words Learned list */}
        <div className="rounded-2xl bg-blue-50/60 border border-blue-100 p-3 sm:p-4 space-y-2 text-left max-h-48 overflow-y-auto">
          <p className="text-xs font-black text-[#0052CC] uppercase tracking-wider">
            Слова этого сканворда:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {words.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between p-2 rounded-xl bg-white border border-blue-100 shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{w.emoji}</span>
                  <div>
                    <span className="font-black text-xs text-[#0F2756] border-b-2 border-dashed border-[#FFD13B]">
                      {w.word}
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold block leading-tight">
                      {w.translationRu}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => speakEnglishWord(w.word)}
                  disabled={!soundEnabled}
                  className="p-1.5 rounded-lg bg-[#FFD13B] hover:bg-[#FFC700] text-[#0F2756] transition-colors cursor-pointer"
                  title="Послушать"
                >
                  <Volume2 className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {onNextPuzzle && (
            <button
              onClick={onNextPuzzle}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#FFD13B] hover:bg-[#FFC700] text-[#0F2756] font-black text-sm shadow-md active:scale-98 transition-all cursor-pointer border border-amber-300"
            >
              <span>Следующий сканворд</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onSelectThemes}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-[#0F2756] font-bold text-xs transition-colors cursor-pointer border border-blue-100"
            >
              <Grid className="w-3.5 h-3.5 text-[#0052CC]" />
              <span>Выбор тем</span>
            </button>

            <button
              onClick={onRestart}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-[#0F2756] font-bold text-xs transition-colors cursor-pointer border border-blue-100"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#0052CC]" />
              <span>Сыграть снова</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
