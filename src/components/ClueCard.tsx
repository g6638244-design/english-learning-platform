import React, { useState } from 'react';
import {
  Volume2,
  Lightbulb,
  CheckCheck,
  HelpCircle,
  ArrowRight,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
} from 'lucide-react';
import { WordClue } from '../types';
import { speakEnglishWord } from '../utils/audio';

interface ClueCardProps {
  activeWord: WordClue | null;
  onRevealLetter: () => void;
  onToggleCheckErrors: () => void;
  showErrors: boolean;
  onNextWord: () => void;
  onPrevWord: () => void;
  isWordCompleted: boolean;
  soundEnabled: boolean;
}

export const ClueCard: React.FC<ClueCardProps> = ({
  activeWord,
  onRevealLetter,
  onToggleCheckErrors,
  showErrors,
  onNextWord,
  onPrevWord,
  isWordCompleted,
  soundEnabled,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSentence, setShowSentence] = useState(false);

  if (!activeWord) {
    return (
      <div className="w-full max-w-xl mx-auto p-5 rounded-3xl bg-white/95 border-2 border-white/60 shadow-lg text-center text-[#0F2756]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD13B] text-[#0F2756] font-black text-xs uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Нажми на клетку
        </div>
        <p className="font-bold text-sm sm:text-base text-[#1E3A8A]">
          Выбери любое слово или подсказку на поле, чтобы начать отгадывать!
        </p>
      </div>
    );
  }

  const handleSpeak = () => {
    if (!soundEnabled) return;
    setIsSpeaking(true);
    speakEnglishWord(activeWord.word, () => setIsSpeaking(false));
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl sm:rounded-[32px] bg-white border-2 border-white shadow-xl p-4 sm:p-5 relative overflow-hidden">
      {/* Decorative Brand Accents */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FF6B6B] flex items-center justify-center shadow-xs">
          <Heart className="w-4 h-4 fill-white text-white" />
        </span>
      </div>

      {/* Top Section: Word direction badge & navigation */}
      <div className="flex items-center justify-between gap-2 border-b border-blue-50 pb-3 pr-10">
        <div className="flex items-center gap-2.5">
          {/* Emoji avatar */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FFF8DD] border-2 border-[#FFD13B] flex items-center justify-center text-2xl sm:text-3xl shadow-xs shrink-0">
            {activeWord.emoji}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {/* Cyan pill badge like "3 фразы..." */}
              <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-black px-2.5 py-0.5 rounded-full bg-[#00A3C4] text-white shadow-xs">
                {activeWord.direction === 'across' ? (
                  <>
                    <ArrowRight className="w-3 h-3 stroke-[3]" /> ПО ГОРИЗОНТАЛИ
                  </>
                ) : (
                  <>
                    <ArrowDown className="w-3 h-3 stroke-[3]" /> ПО ВЕРТИКАЛИ
                  </>
                )}
              </span>

              <span className="text-xs font-black text-[#0F2756] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                {activeWord.word.length} БУКВ
              </span>

              {isWordCompleted && (
                <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-xs">
                  ✓ ОТГАДАНО!
                </span>
              )}
            </div>

            {/* Pronunciation & Transcription */}
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs font-mono font-bold text-[#0052CC] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                {activeWord.transcription}
              </span>
              <button
                onClick={handleSpeak}
                className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full transition-all cursor-pointer shadow-xs ${
                  isSpeaking
                    ? 'bg-[#FFD13B] text-[#0F2756] scale-105 ring-2 ring-amber-400'
                    : 'bg-[#FFD13B] hover:bg-[#FFC700] text-[#0F2756]'
                }`}
                title="Послушать английское произношение"
              >
                <Volume2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Слушать</span>
              </button>
            </div>
          </div>
        </div>

        {/* Word Prev/Next arrows in Royal Blue */}
        <div className="flex items-center gap-1">
          <button
            onClick={onPrevWord}
            className="p-2 rounded-xl text-[#0F2756] bg-blue-50 hover:bg-[#0052CC] hover:text-white transition-colors cursor-pointer"
            title="Предыдущее слово"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button
            onClick={onNextWord}
            className="p-2 rounded-xl text-[#0F2756] bg-blue-50 hover:bg-[#0052CC] hover:text-white transition-colors cursor-pointer"
            title="Следующее слово"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Main Clue: Styled with brand yellow banner and dashed underline for English word */}
      <div className="my-3 space-y-1">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-xs font-black uppercase tracking-wider text-[#00A3C4]">
            Подсказка:
          </span>
          <p className="text-lg sm:text-xl font-black text-[#0F2756] leading-tight">
            {activeWord.translationRu}
          </p>
        </div>

        {/* Brand signature style: Word in English with dashed warm yellow underline */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-xs font-bold text-gray-500">Слово:</span>
          <span className="text-base sm:text-lg font-black text-[#0047BA] tracking-wide border-b-2 border-dashed border-[#FFD13B]">
            {activeWord.word.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Optional example sentence hint */}
      {showSentence && activeWord.exampleSentence && (
        <div className="p-3 rounded-2xl bg-[#F0FDF4] border border-emerald-200 text-xs sm:text-sm text-emerald-950 font-semibold animate-fadeIn">
          <span className="font-black text-emerald-700">Пример в предложении: </span>
          {activeWord.exampleSentence}
        </div>
      )}

      {/* Interactive Helper Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-blue-50">
        <div className="flex items-center gap-2">
          {/* Reveal letter hint in Brand Yellow */}
          <button
            onClick={onRevealLetter}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFD13B] hover:bg-[#FFC700] text-[#0F2756] font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer border border-amber-300"
            title="Открыть текущую букву"
          >
            <Lightbulb className="w-3.5 h-3.5 fill-[#0F2756] text-[#0F2756]" />
            <span>Открыть букву</span>
          </button>

          {/* Check mistakes toggle in Brand Coral / Cyan */}
          <button
            onClick={onToggleCheckErrors}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs transition-all active:scale-95 cursor-pointer shadow-xs border ${
              showErrors
                ? 'bg-[#FF6B6B] text-white border-[#FA5252] ring-2 ring-rose-200'
                : 'bg-blue-50 hover:bg-blue-100 text-[#0F2756] border-blue-200'
            }`}
            title="Проверить ошибки"
          >
            <CheckCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{showErrors ? 'Скрыть ошибки' : 'Проверить ошибки'}</span>
          </button>
        </div>

        {/* Example hint button */}
        {activeWord.exampleSentence && (
          <button
            onClick={() => setShowSentence(!showSentence)}
            className="inline-flex items-center gap-1 text-xs font-extrabold text-[#00A3C4] hover:text-[#008DAA] transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showSentence ? 'Скрыть пример' : 'Пример фразы'}</span>
          </button>
        )}
      </div>

      {/* Brand Friendly Tip / Quote box from the reference banner */}
      <div className="mt-3 p-2.5 rounded-2xl bg-[#FFFBEB] border border-amber-200/80 flex items-center gap-2 text-xs text-[#0F2756]">
        <span className="w-6 h-6 rounded-full bg-[#FFD13B] flex items-center justify-center shrink-0 text-sm">
          💡
        </span>
        <span className="font-bold">
          <strong className="text-[#0047BA]">Подсказка:</strong> Замечай не только ошибки, но и свои победы!
        </span>
      </div>
    </div>
  );
};
