import { PuzzleProgress, UserStats } from '../types';

const PROGRESS_KEY = 'english_scanword_progress_v1';
const STATS_KEY = 'english_scanword_stats_v1';

export function getAllProgress(): Record<string, PuzzleProgress> {
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
    return {};
  } catch {
    return {};
  }
}

export function savePuzzleProgress(
  puzzleId: string,
  userLetters: Record<string, string>,
  completedWordIds: string[],
  stars: number,
  hintsUsed: number,
  elapsedSeconds = 0
): void {
  try {
    const all = getAllProgress();
    const existing = all[puzzleId];
    const bestStars = existing ? Math.max(existing.stars, stars) : stars;

    all[puzzleId] = {
      puzzleId,
      completed: true,
      stars: bestStars,
      hintsUsed,
      elapsedSeconds,
      userLetters,
      completedWordIds,
    };

    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));

    // Also update stats
    const currentStats = getUserStats();
    let totalStars = 0;
    let solvedCount = 0;
    const wordsSet = new Set<string>();

    Object.values(all).forEach((p) => {
      if (p.completed) {
        solvedCount++;
        totalStars += p.stars;
        p.completedWordIds.forEach((w) => wordsSet.add(w));
      }
    });

    currentStats.totalStars = totalStars;
    currentStats.solvedPuzzlesCount = solvedCount;
    currentStats.wordsLearnedCount = wordsSet.size;

    saveUserStats(currentStats);
  } catch {}
}

export function getUserStats(): UserStats {
  try {
    const data = localStorage.getItem(STATS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object') {
        return {
          solvedPuzzlesCount: Number(parsed.solvedPuzzlesCount) || 0,
          totalStars: Number(parsed.totalStars) || 0,
          wordsLearnedCount: Number(parsed.wordsLearnedCount) || 0,
          soundEnabled: parsed.soundEnabled !== false,
        };
      }
    }
  } catch {}
  return {
    solvedPuzzlesCount: 0,
    totalStars: 0,
    wordsLearnedCount: 0,
    soundEnabled: true,
  };
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {}
}

export function toggleSoundSetting(): UserStats {
  const current = getUserStats();
  const updated = {
    ...current,
    soundEnabled: !current.soundEnabled,
  };
  saveUserStats(updated);
  return updated;
}
