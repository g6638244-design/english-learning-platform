import React from 'react';
import { Star, Volume2, VolumeX, BookOpen, Grid, Trophy, Heart } from 'lucide-react';
import { UserStats } from '../types';

interface HeaderProps {
  stats: UserStats;
  currentThemeTitle?: string;
  currentLevelLabel?: string;
  onToggleSound: () => void;
  onOpenDictionary: () => void;
  onSelectThemes: () => void;
  isBoardActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  currentThemeTitle,
  currentLevelLabel,
  onToggleSound,
  onOpenDictionary,
  onSelectThemes,
  isBoardActive,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0047BA]/95 backdrop-blur-md border-b-2 border-[#003896] text-white shadow-md select-none">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onSelectThemes}
            className="flex items-center gap-2 group text-left transition-transform active:scale-95 cursor-pointer"
            title="Главное меню тем"
          >
            {/* Logo Badge in Brand Yellow */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FFD13B] text-[#0F2756] border-2 border-amber-300 flex items-center justify-center font-black text-xl sm:text-2xl shadow-sm group-hover:rotate-3 transition-transform">
              Я
              {/* Mini heart accent */}
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF6B6B] flex items-center justify-center">
                <Heart className="w-2.5 h-2.5 fill-white text-white" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-white text-base sm:text-lg leading-tight tracking-tight drop-shadow-xs">
                  Яна
                </span>
                {/* Speech-bubble style badge from the brand image */}
                <span className="hidden xs:inline-flex text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#002B7A] text-[#93C5FD] border border-[#1E40AF]">
                  Let's learn English!
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-blue-200 font-bold leading-none mt-0.5">
                Твой мир на английском
              </p>
            </div>
          </button>

          {isBoardActive && currentThemeTitle && (
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-blue-400/40">
              <span className="text-xs font-semibold text-blue-200">Тема:</span>
              <span className="text-sm font-extrabold text-[#FFD13B] truncate max-w-[150px]">
                {currentThemeTitle}
              </span>
              {currentLevelLabel && (
                <span className="text-[11px] font-bold px-2 py-0.5 bg-[#00A3C4] text-white rounded-full shadow-xs">
                  {currentLevelLabel}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions and Stats in Brand Palette */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Themes switcher button when on board */}
          {isBoardActive && (
            <button
              onClick={onSelectThemes}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all active:scale-95 cursor-pointer"
            >
              <Grid className="w-4 h-4 text-blue-200" />
              <span className="hidden sm:inline">Все темы</span>
            </button>
          )}

          {/* Dictionary button in Brand Turquoise/Cyan */}
          <button
            onClick={onOpenDictionary}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl bg-[#00A3C4] hover:bg-[#008DAA] text-white shadow-xs transition-all active:scale-95 cursor-pointer"
            title="Словарик темы"
          >
            <BookOpen className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">Словарик</span>
          </button>

          {/* Stars Pill in Brand Sunny Yellow */}
          <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#FFD13B] text-[#0F2756] font-black text-xs sm:text-sm shadow-xs border border-amber-300">
            <Star className="w-4 h-4 fill-[#0F2756] text-[#0F2756]" />
            <span>{stats.totalStars}</span>
          </div>

          {/* Solved Badges Count */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#002B7A] border border-blue-500/40 text-blue-100 font-bold text-xs"
            title="Решено сканвордов"
          >
            <Trophy className="w-3.5 h-3.5 text-[#FFD13B]" />
            <span>{stats.solvedPuzzlesCount} / 12</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label={stats.soundEnabled ? 'Выключить звук' : 'Включить звук'}
            title={stats.soundEnabled ? 'Звук включён' : 'Звук выключен'}
          >
            {stats.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#FFD13B]" />
            ) : (
              <VolumeX className="w-4 h-4 text-blue-300/60" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
