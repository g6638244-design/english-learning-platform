import React, { useState } from 'react';
import { ArrowRight, ArrowDown, Check, ZoomIn, ZoomOut } from 'lucide-react';
import { GridCell, Direction, WordClue } from '../types';

interface ScanwordBoardProps {
  grid: GridCell[][];
  rows: number;
  cols: number;
  themeId?: string;
  userLetters: Record<string, string>;
  selectedCell: { row: number; col: number } | null;
  activeDirection: Direction;
  activeWord: WordClue | null;
  completedWordIds: string[];
  showErrors: boolean;
  onCellClick: (row: number, col: number) => void;
  onClueCellClick: (wordId: string) => void;
}

const THEME_VIGNETTES: Record<string, { icon: string; label: string }> = {
  animals: { icon: '🐾', label: 'Животные' },
  food: { icon: '🍓', label: 'Вкусно' },
  family: { icon: '🏡', label: 'Семья' },
  sports: { icon: '🏆', label: 'Спорт' },
  school: { icon: '✏️', label: 'Школа' },
  travel: { icon: '✈️', label: 'Вояж' },
};

type ZoomLevel = 'normal' | 'large' | 'huge';

export const ScanwordBoard: React.FC<ScanwordBoardProps> = ({
  grid,
  rows,
  cols,
  themeId,
  userLetters,
  selectedCell,
  activeDirection: _activeDirection,
  activeWord,
  completedWordIds,
  showErrors,
  onCellClick,
  onClueCellClick,
}) => {
  // Default to 'large' so cells are noticeably spacious and readable
  const [zoom, setZoom] = useState<ZoomLevel>('large');

  // Check if a cell belongs to active word
  const isCellInActiveWord = (r: number, c: number): boolean => {
    if (!activeWord) return false;
    if (activeWord.direction === 'across') {
      return (
        r === activeWord.startRow &&
        c >= activeWord.startCol &&
        c < activeWord.startCol + activeWord.word.length
      );
    } else {
      return (
        c === activeWord.startCol &&
        r >= activeWord.startRow &&
        r < activeWord.startRow + activeWord.word.length
      );
    }
  };

  // Dimensions based on zoom level
  const cellSizeClass = {
    normal: 'w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20',
    large: 'w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26 lg:w-28 lg:h-28',
    huge: 'w-20 h-20 sm:w-26 sm:h-26 md:w-32 md:h-32 lg:w-36 lg:h-36',
  }[zoom];

  const letterTextClass = {
    normal: 'text-xl sm:text-2xl md:text-3xl',
    large: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
    huge: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
  }[zoom];

  const clueEmojiClass = {
    normal: 'text-base sm:text-xl',
    large: 'text-xl sm:text-2xl lg:text-3xl',
    huge: 'text-2xl sm:text-3xl lg:text-4xl',
  }[zoom];

  const clueTextClass = {
    normal: 'text-[9px] sm:text-xs md:text-sm font-extrabold',
    large: 'text-[10px] sm:text-sm md:text-base font-black',
    huge: 'text-xs sm:text-base md:text-lg font-black',
  }[zoom];

  const handleZoomChange = (delta: number) => {
    if (delta < 0) {
      if (zoom === 'huge') setZoom('large');
      else if (zoom === 'large') setZoom('normal');
    } else {
      if (zoom === 'normal') setZoom('large');
      else if (zoom === 'large') setZoom('huge');
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-2.5 select-none">
      {/* Zoom and Size controls bar in Brand Styling */}
      <div className="w-full max-w-2xl flex items-center justify-between px-2 text-xs">
        <span className="font-extrabold flex items-center gap-1.5 text-white drop-shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#FFD13B]"></span>
          Поле {rows}×{cols} • Плотный сканворд
        </span>

        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1 rounded-2xl border border-white shadow-md">
          <button
            onClick={() => handleZoomChange(-1)}
            disabled={zoom === 'normal'}
            className="p-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0F2756] disabled:opacity-40 transition-all cursor-pointer"
            title="Уменьшить масштаб клеток"
          >
            <ZoomOut className="w-4 h-4 stroke-[2.5]" />
          </button>
          <span className="px-2 font-black text-xs text-[#0F2756]">
            {zoom === 'normal' ? 'Обычный' : zoom === 'large' ? 'Крупный' : 'Огромный'}
          </span>
          <button
            onClick={() => handleZoomChange(1)}
            disabled={zoom === 'huge'}
            className="p-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0F2756] disabled:opacity-40 transition-all cursor-pointer"
            title="Увеличить масштаб клеток"
          >
            <ZoomIn className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Scrollable board wrapper */}
      <div className="w-full overflow-x-auto pb-4 flex justify-center items-center">
        <div
          className="inline-grid gap-1.5 sm:gap-2 p-3 sm:p-4 md:p-5 bg-white/95 backdrop-blur-sm rounded-3xl sm:rounded-[36px] border-4 border-white shadow-2xl"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
        >
          {grid.map((rowArr, r) =>
            rowArr.map((cell, c) => {
              const key = `${r}-${c}`;

              // 1. CLUE CELL (Клетка с вопросом / подсказкой)
              if (cell.type === 'clue') {
                // Dual clue cell (two words originating here)
                if (cell.clues.length >= 2) {
                  return (
                    <div
                      key={key}
                      className={`${cellSizeClass} rounded-2xl border-2 border-amber-200 bg-[#FFFBEB] shadow-sm flex flex-col overflow-hidden p-0.5 gap-0.5`}
                    >
                      {cell.clues.slice(0, 2).map((clue) => {
                        const isWordCompleted = completedWordIds.includes(clue.wordId);
                        const isActiveClue = activeWord && activeWord.id === clue.wordId;

                        return (
                          <button
                            key={clue.wordId}
                            onClick={() => onClueCellClick(clue.wordId)}
                            className={`flex-1 w-full rounded-xl px-1.5 py-0.5 flex flex-col justify-between text-left cursor-pointer transition-all border leading-none ${
                              isActiveClue
                                ? 'bg-[#FFD13B] border-amber-400 ring-2 ring-amber-400 text-[#0F2756]'
                                : isWordCompleted
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                                : 'bg-white border-amber-100 hover:bg-amber-100 text-[#0F2756]'
                            }`}
                            title={clue.text}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-xs sm:text-sm">{clue.emoji}</span>
                              <span className="text-white bg-[#00A3C4] rounded-md p-0.5 shadow-2xs">
                                {clue.direction === 'across' ? (
                                  <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                                ) : (
                                  <ArrowDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                                )}
                              </span>
                            </div>
                            <div className="w-full flex items-center justify-between">
                              <p className="text-[8px] sm:text-[10px] md:text-xs font-black text-[#0F2756] truncate">
                                {clue.text}
                              </p>
                              {isWordCompleted && (
                                <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0 stroke-[3]" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                }

                // Single clue cell in signature Sunny Yellow & Cyan Brand Style
                const clue = cell.clues[0];
                const isWordCompleted = clue && completedWordIds.includes(clue.wordId);
                const isActiveClue = activeWord && clue && activeWord.id === clue.wordId;

                return (
                  <button
                    key={key}
                    onClick={() => clue && onClueCellClick(clue.wordId)}
                    className={`relative ${cellSizeClass} rounded-2xl p-1.5 sm:p-2.5 flex flex-col justify-between items-start text-left cursor-pointer transition-all border-2 shadow-xs ${
                      isActiveClue
                        ? 'bg-[#FFD13B] border-[#F59E0B] ring-4 ring-[#FFD13B]/70 shadow-lg z-10 scale-[1.02]'
                        : isWordCompleted
                        ? 'bg-[#E0F2FE] border-[#38BDF8]'
                        : 'bg-[#FFF9E6] border-[#FDE68A] hover:bg-[#FEF08A]'
                    }`}
                    title={clue?.text}
                  >
                    {/* Top row: Big Emoji + Cyan Direction Badge */}
                    <div className="w-full flex items-center justify-between leading-none">
                      <span className={clueEmojiClass}>{clue?.emoji}</span>
                      <span className="text-white bg-[#00A3C4] rounded-xl p-1 sm:p-1.5 shadow-xs">
                        {clue?.direction === 'across' ? (
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 stroke-[3]" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 stroke-[3]" />
                        )}
                      </span>
                    </div>

                    {/* Concise Clue Text Prompt in Deep Navy */}
                    <div className="w-full mt-auto">
                      <p className={`${clueTextClass} text-[#0F2756] leading-tight break-words`}>
                        {clue?.text}
                      </p>
                    </div>

                    {/* Solved checkmark */}
                    {isWordCompleted && (
                      <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              }

              // 2. LETTER CELL (Клетка для буквы)
              if (cell.type === 'letter') {
                const letterTyped = userLetters[key] || '';
                const isSelected = selectedCell?.row === r && selectedCell?.col === c;
                const inActiveWord = isCellInActiveWord(r, c);
                const isWordSolved = cell.wordIds.some((wid) =>
                  completedWordIds.includes(wid)
                );
                const isWrong =
                  showErrors && letterTyped && letterTyped !== cell.expectedLetter;

                return (
                  <button
                    key={key}
                    onClick={() => onCellClick(r, c)}
                    className={`${cellSizeClass} rounded-2xl flex items-center justify-center font-black ${letterTextClass} transition-all cursor-pointer border-2 shadow-xs ${
                      isSelected
                        ? 'bg-[#FFD13B] text-[#0F2756] border-[#D97706] ring-4 ring-[#FFD13B]/80 scale-105 z-20 shadow-lg'
                        : inActiveWord
                        ? 'bg-[#FEF9C3] text-[#0F2756] border-[#F59E0B] ring-2 ring-amber-300 z-10'
                        : isWordSolved
                        ? 'bg-[#E0F2FE] text-[#0047BA] border-[#38BDF8]'
                        : 'bg-white text-[#0F2756] border-blue-100 hover:border-[#0052CC] hover:bg-blue-50/50'
                    } ${isWrong ? '!bg-[#FEE2E2] !text-[#DC2626] !border-[#EF4444] ring-2 ring-red-300' : ''}`}
                  >
                    <span className="uppercase tracking-wide">{letterTyped}</span>
                  </button>
                );
              }

              // 3. THEMATIC VIGNETTE / DECORATIVE TILE (Тематическая виньетка темы)
              const vignette = (themeId && THEME_VIGNETTES[themeId]) || { icon: '✨', label: 'Яна' };

              return (
                <div
                  key={key}
                  className={`${cellSizeClass} rounded-2xl bg-gradient-to-br from-blue-50/70 to-indigo-50/50 border border-blue-200/50 flex flex-col items-center justify-center p-0.5 select-none shadow-2xs`}
                  title={`Тематическая карточка: ${vignette.label}`}
                >
                  <span className="text-base sm:text-lg select-none leading-none drop-shadow-xs">
                    {vignette.icon}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#0047BA]/70 leading-none mt-1">
                    {vignette.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
