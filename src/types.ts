export type Direction = 'across' | 'down';

export interface WordClue {
  id: string;
  word: string; // Uppercase English word, e.g. "LION"
  translationRu: string; // Russian translation/definition, e.g. "Царь зверей"
  transcription: string; // e.g. "[ˈlaɪ.ən]"
  emoji: string; // e.g. "🦁"
  exampleSentence?: string; // e.g. "The lion is sleeping in the savanna."
  startRow: number; // Row index where the first letter goes
  startCol: number; // Col index where the first letter goes
  direction: Direction;
  clueRow: number; // Row index of the clue box inside the grid
  clueCol: number; // Col index of the clue box inside the grid
}

export type CellType = 'letter' | 'clue' | 'empty';

export interface LetterCellData {
  type: 'letter';
  row: number;
  col: number;
  expectedLetter: string;
  wordIds: string[]; // Can belong to 1 or 2 intersecting words (across/down)
}

export interface CluePrompt {
  wordId: string;
  text: string;
  emoji: string;
  direction: Direction;
}

export interface ClueCellData {
  type: 'clue';
  row: number;
  col: number;
  clues: CluePrompt[];
}

export interface EmptyCellData {
  type: 'empty';
  row: number;
  col: number;
}

export type GridCell = LetterCellData | ClueCellData | EmptyCellData;

export interface ScanwordPuzzle {
  id: string;
  themeId: string;
  title: string;
  level: 1 | 2;
  levelLabel: string;
  rows: number;
  cols: number;
  words: WordClue[];
}

export interface ThemeCategory {
  id: string;
  titleRu: string;
  titleEn: string;
  description: string;
  emoji: string;
  gradient: string;
  accentColor: string;
  puzzles: ScanwordPuzzle[];
}

export interface PuzzleProgress {
  puzzleId: string;
  completed: boolean;
  stars: number;
  hintsUsed: number;
  elapsedSeconds: number;
  userLetters: Record<string, string>; // key: "r-c" -> user input letter
  completedWordIds: string[];
}

export interface UserStats {
  solvedPuzzlesCount: number;
  totalStars: number;
  wordsLearnedCount: number;
  soundEnabled: boolean;
}
