/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SCANWORDS } from './data/scanwords';
import { THEMES } from './data/themes';
import { buildGrid } from './data/scanwordValidator';
import { Direction, WordClue, UserStats, PuzzleProgress } from './types';
import {
  getUserStats,
  getAllProgress,
  savePuzzleProgress,
  toggleSoundSetting,
} from './utils/storage';
import {
  playKeySound,
  playWordCompleteSound,
  playVictorySound,
  playHintSound,
  speakEnglishWord,
} from './utils/audio';

import { Header } from './components/Header';
import { ThemeSelector } from './components/ThemeSelector';
import { ScanwordBoard } from './components/ScanwordBoard';
import { ClueCard } from './components/ClueCard';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { VocabularyModal } from './components/VocabularyModal';
import { VictoryModal } from './components/VictoryModal';

export default function App() {
  // Navigation & Persistence State
  const [currentPuzzleId, setCurrentPuzzleId] = useState<string | null>('animals-1');
  const [stats, setStats] = useState<UserStats>(getUserStats);
  const [allProgress, setAllProgress] = useState<Record<string, PuzzleProgress>>(getAllProgress);

  // Active Puzzle
  const currentPuzzle = useMemo(() => {
    if (!currentPuzzleId) return null;
    return SCANWORDS.find((p) => p.id === currentPuzzleId) || null;
  }, [currentPuzzleId]);

  // Current Theme
  const currentTheme = useMemo(() => {
    if (!currentPuzzle) return null;
    return THEMES.find((t) => t.id === currentPuzzle.themeId) || null;
  }, [currentPuzzle]);

  // Built Grid Data
  const gridData = useMemo(() => {
    if (!currentPuzzle) return null;
    return buildGrid(currentPuzzle);
  }, [currentPuzzle]);

  // Board Game State
  const [userLetters, setUserLetters] = useState<Record<string, string>>({});
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [activeDirection, setActiveDirection] = useState<Direction>('across');
  const [activeWordId, setActiveWordId] = useState<string | null>(null);
  const [completedWordIds, setCompletedWordIds] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [showErrors, setShowErrors] = useState<boolean>(false);

  // Modals
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState<boolean>(false);
  const [victoryStars, setVictoryStars] = useState<number>(3);

  // Find active WordClue
  const activeWord = useMemo<WordClue | null>(() => {
    if (!currentPuzzle || !activeWordId) return null;
    return currentPuzzle.words.find((w) => w.id === activeWordId) || null;
  }, [currentPuzzle, activeWordId]);

  // Initialize or reset board when puzzle changes
  useEffect(() => {
    if (!currentPuzzle) return;

    // Load saved letters if any, or start fresh
    const saved = allProgress[currentPuzzle.id];
    if (saved && saved.userLetters) {
      setUserLetters(saved.userLetters);
    } else {
      setUserLetters({});
    }

    setHintsUsed(0);
    setShowErrors(false);
    setIsVictoryOpen(false);

    // Default select first word and its first letter
    const firstWord = currentPuzzle.words[0];
    if (firstWord) {
      setActiveWordId(firstWord.id);
      setActiveDirection(firstWord.direction);
      setSelectedCell({ row: firstWord.startRow, col: firstWord.startCol });
    }
  }, [currentPuzzleId, currentPuzzle]);

  // Check word completion whenever userLetters changes
  useEffect(() => {
    if (!currentPuzzle) return;

    const newlyCompleted: string[] = [];

    currentPuzzle.words.forEach((w) => {
      let isComplete = true;
      for (let i = 0; i < w.word.length; i++) {
        const r = w.direction === 'across' ? w.startRow : w.startRow + i;
        const c = w.direction === 'across' ? w.startCol + i : w.startCol;
        const key = `${r}-${c}`;
        const letter = userLetters[key] || '';
        if (letter !== w.word[i]) {
          isComplete = false;
          break;
        }
      }
      if (isComplete) {
        newlyCompleted.push(w.id);
      }
    });

    // Check if a word just got completed
    const justCompleted = newlyCompleted.filter((id) => !completedWordIds.includes(id));
    if (justCompleted.length > 0) {
      const completedWordObj = currentPuzzle.words.find((w) => w.id === justCompleted[0]);
      if (stats.soundEnabled) {
        playWordCompleteSound();
        if (completedWordObj) {
          // Pronounce word after small delay
          setTimeout(() => {
            speakEnglishWord(completedWordObj.word);
          }, 350);
        }
      }
    }

    setCompletedWordIds(newlyCompleted);

    // Check puzzle victory condition
    if (newlyCompleted.length === currentPuzzle.words.length && currentPuzzle.words.length > 0) {
      let stars = 3;
      if (hintsUsed >= 4) stars = 1;
      else if (hintsUsed >= 2) stars = 2;

      setVictoryStars(stars);

      // Save progress to local storage
      savePuzzleProgress(currentPuzzle.id, userLetters, newlyCompleted, stars, hintsUsed);
      setStats(getUserStats());
      setAllProgress(getAllProgress());

      if (stats.soundEnabled) {
        setTimeout(() => {
          playVictorySound();
        }, 500);
      }

      setIsVictoryOpen(true);
    }
  }, [userLetters, currentPuzzle, hintsUsed, stats.soundEnabled]);

  // Click on a grid cell
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (!gridData || !currentPuzzle) return;
      const cell = gridData.grid[row]?.[col];
      if (!cell || cell.type !== 'letter') return;

      // If clicking already selected cell, toggle direction if cell has intersecting words
      if (selectedCell?.row === row && selectedCell?.col === col && cell.wordIds.length > 1) {
        const nextDir = activeDirection === 'across' ? 'down' : 'across';
        const matchingWord = currentPuzzle.words.find(
          (w) => cell.wordIds.includes(w.id) && w.direction === nextDir
        );
        if (matchingWord) {
          setActiveDirection(nextDir);
          setActiveWordId(matchingWord.id);
          return;
        }
      }

      setSelectedCell({ row, col });

      // Find best word matching current direction or first available
      let wordForCell = currentPuzzle.words.find(
        (w) => cell.wordIds.includes(w.id) && w.direction === activeDirection
      );
      if (!wordForCell && cell.wordIds.length > 0) {
        wordForCell = currentPuzzle.words.find((w) => w.id === cell.wordIds[0]);
      }

      if (wordForCell) {
        setActiveWordId(wordForCell.id);
        setActiveDirection(wordForCell.direction);
      }
    },
    [gridData, currentPuzzle, selectedCell, activeDirection]
  );

  // Click on a clue cell
  const handleClueCellClick = useCallback(
    (wordId: string) => {
      if (!currentPuzzle) return;
      const word = currentPuzzle.words.find((w) => w.id === wordId);
      if (!word) return;

      setActiveWordId(word.id);
      setActiveDirection(word.direction);
      setSelectedCell({ row: word.startRow, col: word.startCol });
    },
    [currentPuzzle]
  );

  // Move to next cell along active word
  const advanceToNextCell = useCallback(() => {
    if (!activeWord || !selectedCell) return;

    let nextRow = selectedCell.row;
    let nextCol = selectedCell.col;

    if (activeWord.direction === 'across') {
      const maxCol = activeWord.startCol + activeWord.word.length - 1;
      if (selectedCell.col < maxCol) {
        nextCol = selectedCell.col + 1;
      }
    } else {
      const maxRow = activeWord.startRow + activeWord.word.length - 1;
      if (selectedCell.row < maxRow) {
        nextRow = selectedCell.row + 1;
      }
    }

    setSelectedCell({ row: nextRow, col: nextCol });
  }, [activeWord, selectedCell]);

  // Move to previous cell along active word
  const retreatToPrevCell = useCallback(() => {
    if (!activeWord || !selectedCell) return;

    let prevRow = selectedCell.row;
    let prevCol = selectedCell.col;

    if (activeWord.direction === 'across') {
      if (selectedCell.col > activeWord.startCol) {
        prevCol = selectedCell.col - 1;
      }
    } else {
      if (selectedCell.row > activeWord.startRow) {
        prevRow = selectedCell.row - 1;
      }
    }

    setSelectedCell({ row: prevRow, col: prevCol });
  }, [activeWord, selectedCell]);

  // Handle typing letter
  const handleKeyPress = useCallback(
    (letter: string) => {
      if (!selectedCell || !gridData) return;
      const cell = gridData.grid[selectedCell.row]?.[selectedCell.col];
      if (!cell || cell.type !== 'letter') return;

      const upper = letter.toUpperCase();
      const key = `${selectedCell.row}-${selectedCell.col}`;

      if (stats.soundEnabled) {
        playKeySound();
      }

      setUserLetters((prev) => ({
        ...prev,
        [key]: upper,
      }));

      // Advance to next letter in current word
      advanceToNextCell();
    },
    [selectedCell, gridData, stats.soundEnabled, advanceToNextCell]
  );

  // Handle Backspace
  const handleBackspace = useCallback(() => {
    if (!selectedCell) return;
    const key = `${selectedCell.row}-${selectedCell.col}`;
    const currentLetter = userLetters[key];

    if (currentLetter) {
      // Clear current cell
      setUserLetters((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } else {
      // Step back and clear previous cell
      retreatToPrevCell();
      if (activeWord) {
        const prevRow =
          activeWord.direction === 'down' && selectedCell.row > activeWord.startRow
            ? selectedCell.row - 1
            : selectedCell.row;
        const prevCol =
          activeWord.direction === 'across' && selectedCell.col > activeWord.startCol
            ? selectedCell.col - 1
            : selectedCell.col;
        const prevKey = `${prevRow}-${prevCol}`;
        setUserLetters((prev) => {
          const next = { ...prev };
          delete next[prevKey];
          return next;
        });
      }
    }
  }, [selectedCell, userLetters, retreatToPrevCell, activeWord]);

  // Physical Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in a modal search input
      if (isDictionaryOpen) return;

      if (e.key >= 'a' && e.key <= 'z') {
        e.preventDefault();
        handleKeyPress(e.key.toUpperCase());
      } else if (e.key >= 'A' && e.key <= 'Z') {
        e.preventDefault();
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        advanceToNextCell();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        retreatToPrevCell();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isDictionaryOpen,
    handleKeyPress,
    handleBackspace,
    advanceToNextCell,
    retreatToPrevCell,
  ]);

  // Next / Prev Word Navigation
  const handleNextWord = useCallback(() => {
    if (!currentPuzzle || !activeWordId) return;
    const currentIndex = currentPuzzle.words.findIndex((w) => w.id === activeWordId);
    const nextIndex = (currentIndex + 1) % currentPuzzle.words.length;
    const nextWord = currentPuzzle.words[nextIndex];
    if (nextWord) {
      setActiveWordId(nextWord.id);
      setActiveDirection(nextWord.direction);
      setSelectedCell({ row: nextWord.startRow, col: nextWord.startCol });
    }
  }, [currentPuzzle, activeWordId]);

  const handlePrevWord = useCallback(() => {
    if (!currentPuzzle || !activeWordId) return;
    const currentIndex = currentPuzzle.words.findIndex((w) => w.id === activeWordId);
    const prevIndex =
      (currentIndex - 1 + currentPuzzle.words.length) % currentPuzzle.words.length;
    const prevWord = currentPuzzle.words[prevIndex];
    if (prevWord) {
      setActiveWordId(prevWord.id);
      setActiveDirection(prevWord.direction);
      setSelectedCell({ row: prevWord.startRow, col: prevWord.startCol });
    }
  }, [currentPuzzle, activeWordId]);

  // Hint: Reveal current letter
  const handleRevealLetter = useCallback(() => {
    if (!selectedCell || !gridData) return;
    const cell = gridData.grid[selectedCell.row]?.[selectedCell.col];
    if (!cell || cell.type !== 'letter') return;

    if (stats.soundEnabled) {
      playHintSound();
    }

    setHintsUsed((prev) => prev + 1);

    const key = `${selectedCell.row}-${selectedCell.col}`;
    setUserLetters((prev) => ({
      ...prev,
      [key]: cell.expectedLetter,
    }));

    advanceToNextCell();
  }, [selectedCell, gridData, stats.soundEnabled, advanceToNextCell]);

  // Sound toggle
  const handleToggleSound = useCallback(() => {
    const updated = toggleSoundSetting();
    setStats(updated);
  }, []);

  // Next puzzle selector
  const handleNextPuzzle = useCallback(() => {
    if (!currentPuzzle) return;
    const currentIndex = SCANWORDS.findIndex((p) => p.id === currentPuzzle.id);
    const nextIndex = (currentIndex + 1) % SCANWORDS.length;
    const nextPuzzle = SCANWORDS[nextIndex];
    if (nextPuzzle) {
      setCurrentPuzzleId(nextPuzzle.id);
    }
  }, [currentPuzzle]);

  // Restart current puzzle
  const handleRestart = useCallback(() => {
    setUserLetters({});
    setHintsUsed(0);
    setShowErrors(false);
    setIsVictoryOpen(false);
    if (currentPuzzle) {
      const firstWord = currentPuzzle.words[0];
      if (firstWord) {
        setActiveWordId(firstWord.id);
        setActiveDirection(firstWord.direction);
        setSelectedCell({ row: firstWord.startRow, col: firstWord.startCol });
      }
    }
  }, [currentPuzzle]);

  return (
    <div className="min-h-screen brand-doodle-bg text-[#0F2756] flex flex-col selection:bg-[#FFD13B] selection:text-[#0F2756]">
      {/* Top Navigation Header */}
      <Header
        stats={stats}
        currentThemeTitle={currentTheme?.titleRu}
        currentLevelLabel={currentPuzzle?.levelLabel}
        onToggleSound={handleToggleSound}
        onOpenDictionary={() => setIsDictionaryOpen(true)}
        onSelectThemes={() => setCurrentPuzzleId(null)}
        isBoardActive={currentPuzzleId !== null}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-start">
        {currentPuzzle && gridData ? (
          <div className="w-full max-w-4xl mx-auto px-4 py-3 sm:py-5 flex flex-col gap-3 sm:gap-4">
            {/* Puzzle Title & Context Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 text-white">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
                    {currentPuzzle.title}
                  </h1>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#FFD13B] text-[#0F2756] border border-amber-300 shadow-sm">
                    {currentPuzzle.levelLabel}
                  </span>
                  {currentTheme && (
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#00A3C4] text-white shadow-sm">
                      {currentTheme.titleRu}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-blue-200 font-bold drop-shadow-xs mt-0.5">
                  Яна | Твой мир на английском
                </p>
              </div>

              {/* Progress counter */}
              <div className="flex items-center gap-2 text-xs font-extrabold bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20 self-start sm:self-auto">
                <span className="text-[#FFD13B]">Слов отгадано:</span>
                <span className="text-white font-black">
                  {completedWordIds.length} / {currentPuzzle.words.length}
                </span>
              </div>
            </div>

            {/* Clue and helper action card */}
            <ClueCard
              activeWord={activeWord}
              onRevealLetter={handleRevealLetter}
              onToggleCheckErrors={() => setShowErrors(!showErrors)}
              showErrors={showErrors}
              onNextWord={handleNextWord}
              onPrevWord={handlePrevWord}
              isWordCompleted={activeWord ? completedWordIds.includes(activeWord.id) : false}
              soundEnabled={stats.soundEnabled}
            />

            {/* Scandinavian Crossword / Scanword Grid */}
            <ScanwordBoard
              grid={gridData.grid}
              rows={gridData.rows}
              cols={gridData.cols}
              themeId={currentTheme?.id}
              userLetters={userLetters}
              selectedCell={selectedCell}
              activeDirection={activeDirection}
              activeWord={activeWord}
              completedWordIds={completedWordIds}
              showErrors={showErrors}
              onCellClick={handleCellClick}
              onClueCellClick={handleClueCellClick}
            />

            {/* Virtual On-screen Keyboard */}
            <VirtualKeyboard
              onKeyPress={handleKeyPress}
              onBackspace={handleBackspace}
              onPrevCell={retreatToPrevCell}
              onNextCell={advanceToNextCell}
            />
          </div>
        ) : (
          /* Theme Selector Grid */
          <ThemeSelector
            themes={THEMES}
            allProgress={allProgress}
            onSelectPuzzle={(id) => setCurrentPuzzleId(id)}
            onOpenDictionaryForTheme={() => setIsDictionaryOpen(true)}
          />
        )}
      </main>

      {/* Dictionary Modal */}
      <VocabularyModal
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
        selectedThemeId={currentTheme?.id}
        completedWordIds={completedWordIds}
        soundEnabled={stats.soundEnabled}
      />

      {/* Victory Celebration Modal */}
      <VictoryModal
        isOpen={isVictoryOpen}
        stars={victoryStars}
        hintsUsed={hintsUsed}
        words={currentPuzzle?.words || []}
        onNextPuzzle={handleNextPuzzle}
        onRestart={handleRestart}
        onSelectThemes={() => {
          setIsVictoryOpen(false);
          setCurrentPuzzleId(null);
        }}
        soundEnabled={stats.soundEnabled}
      />
    </div>
  );
}
