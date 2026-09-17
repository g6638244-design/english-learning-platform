import { ScanwordPuzzle, GridCell, WordClue } from '../types';

export function buildGrid(puzzle: ScanwordPuzzle): {
  grid: GridCell[][];
  cells: GridCell[][];
  rows: number;
  cols: number;
  errors: string[];
} {
  const { rows, cols, words } = puzzle;
  const errors: string[] = [];

  // Initialize empty grid
  const cells: GridCell[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: GridCell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({ type: 'empty', row: r, col: c });
    }
    cells.push(row);
  }

  // 1. Place clue cells
  words.forEach((w) => {
    if (w.clueRow < 0 || w.clueRow >= rows || w.clueCol < 0 || w.clueCol >= cols) {
      errors.push(`Clue for ${w.word} out of bounds at (${w.clueRow}, ${w.clueCol})`);
      return;
    }

    const current = cells[w.clueRow][w.clueCol];
    if (current.type === 'letter') {
      errors.push(`Clue for ${w.word} at (${w.clueRow}, ${w.clueCol}) overlaps letter cell`);
      return;
    }

    if (current.type === 'clue') {
      current.clues.push({
        wordId: w.id,
        text: w.translationRu,
        emoji: w.emoji,
        direction: w.direction,
      });
    } else {
      cells[w.clueRow][w.clueCol] = {
        type: 'clue',
        row: w.clueRow,
        col: w.clueCol,
        clues: [
          {
            wordId: w.id,
            text: w.translationRu,
            emoji: w.emoji,
            direction: w.direction,
          },
        ],
      };
    }
  });

  // 2. Place letter cells
  words.forEach((w) => {
    const letters = w.word.toUpperCase().split('');
    letters.forEach((letter, i) => {
      const r = w.direction === 'across' ? w.startRow : w.startRow + i;
      const c = w.direction === 'across' ? w.startCol + i : w.startCol;

      if (r < 0 || r >= rows || c < 0 || c >= cols) {
        errors.push(`Letter ${letter} (#${i}) of ${w.word} out of bounds at (${r}, ${c})`);
        return;
      }

      const current = cells[r][c];
      if (current.type === 'clue') {
        errors.push(`Letter ${letter} of ${w.word} at (${r}, ${c}) overlaps clue cell`);
        return;
      }

      if (current.type === 'letter') {
        if (current.expectedLetter !== letter) {
          errors.push(
            `Letter clash at (${r}, ${c}): ${w.word} expects '${letter}', but existing word expects '${current.expectedLetter}'`
          );
        } else {
          current.wordIds.push(w.id);
        }
      } else {
        cells[r][c] = {
          type: 'letter',
          row: r,
          col: c,
          expectedLetter: letter,
          wordIds: [w.id],
        };
      }
    });
  });

  return { grid: cells, cells, rows, cols, errors };
}
