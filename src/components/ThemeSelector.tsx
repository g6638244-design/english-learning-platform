import React from 'react';
import { Play, Star, CheckCircle2, Sparkles, Heart, Volume2 } from 'lucide-react';
import { ThemeCategory, PuzzleProgress } from '../types';

interface ThemeSelectorProps {
  themes: ThemeCategory[];
  allProgress: Record<string, PuzzleProgress>;
  onSelectPuzzle: (puzzleId: string) => void;
  onOpenDictionaryForTheme: (themeId: string) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes,
  allProgress,
  onSelectPuzzle,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      {/* Hero Card styled identically to the reference graphic */}
      <div className="relative overflow-hidden rounded-3xl sm:rounded-[36px] bg-white border-4 border-white shadow-2xl p-6 sm:p-8 md:p-10 text-[#0F2756]">
        {/* Top Royal Blue Curved Header Banner */}
        <div className="absolute top-0 left-0 right-0 h-28 sm:h-32 bg-gradient-to-b from-[#0047BA] to-[#0052CC] -z-0">
          {/* Subtle star / sparkle background */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        </div>

        {/* Top Badges: Brand Badge + Heart Sticker */}
        <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
          {/* Brand badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#002B7A] text-white text-xs sm:text-sm font-extrabold shadow-md border border-blue-400/40">
            <span>✨ Яна | Твой мир на английском</span>
          </div>

          {/* Coral Heart Sticker */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FF6B6B] flex items-center justify-center shadow-lg border-2 border-white transform rotate-6">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-white" />
          </div>
        </div>

        {/* Central Yellow Title Badge with Sunburst Accents */}
        <div className="relative z-10 flex flex-col items-center text-center my-4 sm:my-6">
          <div className="relative inline-block">
            {/* Sunburst tick marks on top */}
            <div className="flex justify-center gap-2 mb-1 text-[#FFD13B] font-black text-sm select-none">
              <span>\</span>
              <span>|</span>
              <span>/</span>
            </div>

            {/* Bright Sunny Yellow Badge */}
            <div className="px-6 sm:px-10 py-2.5 sm:py-3.5 rounded-full bg-[#FFD13B] border-2 border-amber-300 shadow-md transform -rotate-1">
              <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-[#0F2756] tracking-tight uppercase leading-none">
                КАК УЧИТЬ АНГЛИЙСКИЙ
              </h1>
            </div>

            {/* Red underline brush stroke */}
            <div className="w-24 sm:w-32 h-1.5 bg-[#FF6B6B] rounded-full mx-auto mt-2"></div>
          </div>

          {/* Cyan Subtitle Pill Badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#00A3C4] text-white font-black text-xs sm:text-sm shadow-md">
            <span>🧩 3 шага к уверенному словарному запасу</span>
          </div>
        </div>

        {/* 3 Steps in Brand Card Style */}
        <div className="relative z-10 max-w-2xl mx-auto space-y-4 my-6">
          {/* Step 1 */}
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#00A3C4] text-white font-black text-sm sm:text-base flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              1
            </div>
            <div>
              <p className="text-base sm:text-lg font-black text-[#0F2756] border-b-2 border-dashed border-[#FFD13B] inline-block">
                Choose a theme & puzzle...
              </p>
              <p className="text-xs sm:text-sm text-gray-600 font-bold mt-0.5">
                Выбирай интересную тему: Животные, Еда, Спорт, Путешествия...
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#00A3C4] text-white font-black text-sm sm:text-base flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              2
            </div>
            <div>
              <p className="text-base sm:text-lg font-black text-[#0F2756] border-b-2 border-dashed border-[#FFD13B] inline-block">
                Solve the dense scanword...
              </p>
              <p className="text-xs sm:text-sm text-gray-600 font-bold mt-0.5">
                Подсказки прямо в клетках поля! Слова переплетаются по буквам.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#00A3C4] text-white font-black text-sm sm:text-base flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              3
            </div>
            <div>
              <p className="text-base sm:text-lg font-black text-[#0F2756] border-b-2 border-dashed border-[#FFD13B] inline-block">
                Listen & speak like a native...
              </p>
              <p className="text-xs sm:text-sm text-gray-600 font-bold mt-0.5">
                Слушай правильное произношение и собирай золотые звёзды!
              </p>
            </div>
          </div>
        </div>

        {/* Motivational Tip Box with Lightbulb */}
        <div className="relative z-10 max-w-2xl mx-auto p-3 sm:p-4 rounded-2xl bg-[#FFFBEB] border-2 border-[#FEF08A] flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#FFD13B] flex items-center justify-center shrink-0 shadow-xs text-lg">
            💡
          </div>
          <p className="text-xs sm:text-sm font-bold text-[#0F2756]">
            <strong>Замечай не только ошибки, но и свои победы!</strong> Разгадай хотя бы один сканворд сегодня, и английские слова запомнятся легко и навсегда.
          </p>
        </div>
      </div>

      {/* 6 Theme Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-5 px-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FFD13B] ring-4 ring-amber-300"></div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm">
              6 Популярных тем
            </h2>
          </div>
          <span className="text-xs sm:text-sm font-black px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-xs">
            12 интерактивных сканвордов
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {themes.map((theme) => {
            const level1 = theme.puzzles[0];
            const level2 = theme.puzzles[1];

            const prog1 = level1 ? allProgress[level1.id] : undefined;
            const prog2 = level2 ? allProgress[level2.id] : undefined;

            const isCompleted1 = prog1?.completed ?? false;
            const isCompleted2 = prog2?.completed ?? false;
            const starsEarned = (prog1?.stars ?? 0) + (prog2?.stars ?? 0);

            return (
              <div
                key={theme.id}
                className="group relative flex flex-col justify-between rounded-3xl border-2 border-white bg-white/95 backdrop-blur-md p-5 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div>
                  {/* Theme Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-[#FFF8DD] border-2 border-[#FFD13B] flex items-center justify-center text-3xl shadow-xs group-hover:scale-105 transition-transform shrink-0">
                        {theme.emoji}
                      </div>
                      <div>
                        <h3 className="font-black text-[#0F2756] text-base sm:text-lg leading-snug">
                          {theme.titleRu}
                        </h3>
                        <p className="text-xs font-black text-[#00A3C4] uppercase tracking-wide">
                          {theme.titleEn}
                        </p>
                      </div>
                    </div>

                    {/* Stars badge in Brand Yellow */}
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFD13B] text-[#0F2756] text-xs font-black shadow-xs border border-amber-300">
                      <Star className="w-3.5 h-3.5 fill-[#0F2756] text-[#0F2756]" />
                      <span>{starsEarned}/6</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 font-semibold mb-5 line-clamp-2">
                    {theme.description}
                  </p>
                </div>

                {/* Level Buttons */}
                <div className="space-y-2 pt-3 border-t border-blue-50">
                  {/* Level 1 button */}
                  {level1 && (
                    <button
                      onClick={() => onSelectPuzzle(level1.id)}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-blue-50/70 hover:bg-[#FFD13B] text-[#0F2756] font-black text-xs border border-blue-100 hover:border-amber-400 transition-all active:scale-98 cursor-pointer shadow-xs group/btn"
                    >
                      <div className="flex items-center gap-2">
                        {isCompleted1 ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Play className="w-3.5 h-3.5 text-[#0052CC] group-hover/btn:text-[#0F2756] shrink-0" />
                        )}
                        <span>{level1.levelLabel}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map((starIdx) => (
                          <Star
                            key={starIdx}
                            className={`w-3.5 h-3.5 ${
                              (prog1?.stars ?? 0) >= starIdx
                                ? 'fill-[#FFD13B] text-amber-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </button>
                  )}

                  {/* Level 2 button */}
                  {level2 && (
                    <button
                      onClick={() => onSelectPuzzle(level2.id)}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-blue-50/70 hover:bg-[#FFD13B] text-[#0F2756] font-black text-xs border border-blue-100 hover:border-amber-400 transition-all active:scale-98 cursor-pointer shadow-xs group/btn"
                    >
                      <div className="flex items-center gap-2">
                        {isCompleted2 ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Play className="w-3.5 h-3.5 text-[#0052CC] group-hover/btn:text-[#0F2756] shrink-0" />
                        )}
                        <span>{level2.levelLabel}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map((starIdx) => (
                          <Star
                            key={starIdx}
                            className={`w-3.5 h-3.5 ${
                              (prog2?.stars ?? 0) >= starIdx
                                ? 'fill-[#FFD13B] text-amber-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
