import React, { useState } from 'react';
import { X, Volume2, Search, BookOpen, CheckCircle2, Sparkles } from 'lucide-react';
import { THEMES } from '../data/themes';
import { speakEnglishWord } from '../utils/audio';

interface VocabularyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedThemeId?: string;
  completedWordIds: string[];
  soundEnabled: boolean;
}

export const VocabularyModal: React.FC<VocabularyModalProps> = ({
  isOpen,
  onClose,
  selectedThemeId,
  completedWordIds,
  soundEnabled,
}) => {
  const [activeTab, setActiveTab] = useState<string>(selectedThemeId || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  if (!isOpen) return null;

  // Gather all unique words
  const allWordsWithTheme = THEMES.flatMap((t) =>
    t.puzzles.flatMap((p) =>
      p.words.map((w) => ({
        ...w,
        themeTitleRu: t.titleRu,
        themeEmoji: t.emoji,
        themeId: t.id,
      }))
    )
  );

  // Deduplicate by word if needed
  const uniqueWordsMap = new Map<string, typeof allWordsWithTheme[0]>();
  allWordsWithTheme.forEach((w) => {
    if (!uniqueWordsMap.has(w.word)) {
      uniqueWordsMap.set(w.word, w);
    }
  });
  const allUniqueWords = Array.from(uniqueWordsMap.values());

  // Filter words
  const filteredWords = allUniqueWords.filter((w) => {
    const matchesTab = activeTab === 'all' || w.themeId === activeTab;
    const matchesSearch =
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.translationRu.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleSpeak = (word: string) => {
    if (!soundEnabled) return;
    setPlayingWord(word);
    speakEnglishWord(word, () => setPlayingWord(null));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl sm:rounded-[36px] bg-white shadow-2xl overflow-hidden border-4 border-white">
        {/* Header in Brand Royal Blue */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-[#0047BA] to-[#0052CC] text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#FFD13B] text-[#0F2756] flex items-center justify-center shadow-xs border border-amber-300">
              <BookOpen className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white leading-none">
                  Словарик сканворда
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#00A3C4] text-white">
                  Let's learn English!
                </span>
              </div>
              <p className="text-xs text-blue-200 font-bold mt-1">
                Изучай слова, транскрипцию и слушай произношение
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Filters & Search in Brand Styling */}
        <div className="p-4 border-b border-blue-50 bg-blue-50/40 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-blue-400" />
            <input
              type="text"
              placeholder="Поиск слова на русском или английском..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border-2 border-blue-100 text-sm focus:outline-none focus:border-[#00A3C4] font-bold text-[#0F2756] shadow-xs"
            />
          </div>

          {/* Themes horizontal scroll pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-black scrollbar-none">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer shadow-xs ${
                activeTab === 'all'
                  ? 'bg-[#0047BA] text-white'
                  : 'bg-white text-[#0F2756] hover:bg-blue-50 border border-blue-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 inline mr-1 text-[#FFD13B]" />
              Все темы ({allUniqueWords.length})
            </button>
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  activeTab === t.id
                    ? 'bg-[#0047BA] text-white'
                    : 'bg-white text-[#0F2756] hover:bg-blue-50 border border-blue-100'
                }`}
              >
                <span>{t.emoji}</span>
                <span>{t.titleRu}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Word Cards List in Brand Style */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50/50">
          {filteredWords.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-500 font-bold text-sm">
              Слова по вашему запросу не найдены.
            </div>
          ) : (
            filteredWords.map((item) => {
              const isLearned = completedWordIds.includes(item.id);
              const isPlaying = playingWord === item.word;

              return (
                <div
                  key={item.word}
                  className="p-4 rounded-3xl border-2 border-blue-100/70 bg-white hover:border-[#FFD13B] transition-all flex flex-col justify-between gap-2 shadow-xs hover:shadow-md"
                >
                  <div>
                    {/* Top: English word, emoji, audio */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-2xl">{item.emoji}</span>
                        {/* Word with dashed yellow underline */}
                        <span className="text-lg font-black text-[#0F2756] tracking-wide border-b-2 border-dashed border-[#FFD13B]">
                          {item.word}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#0052CC] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                          {item.transcription}
                        </span>
                      </div>

                      <button
                        onClick={() => handleSpeak(item.word)}
                        className={`p-2 rounded-2xl transition-all cursor-pointer shadow-xs ${
                          isPlaying
                            ? 'bg-[#FFD13B] text-[#0F2756] scale-110 ring-2 ring-amber-400'
                            : 'bg-[#FFD13B] hover:bg-[#FFC700] text-[#0F2756]'
                        }`}
                        title="Озвучить слово"
                      >
                        <Volume2 className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>

                    {/* Russian translation */}
                    <p className="text-xs sm:text-sm font-black text-[#0047BA]">
                      {item.translationRu}
                    </p>

                    {/* Example sentence */}
                    {item.exampleSentence && (
                      <p className="mt-2 text-xs text-gray-600 font-medium italic bg-blue-50/50 p-2 rounded-xl border border-blue-100/60">
                        &quot;{item.exampleSentence}&quot;
                      </p>
                    )}
                  </div>

                  {/* Learned badge in Brand Cyan / Emerald */}
                  <div className="flex items-center justify-between text-[11px] font-black text-gray-400 pt-2 border-t border-blue-50">
                    <span className="text-[#00A3C4]">{item.themeEmoji} {item.themeTitleRu}</span>
                    {isLearned ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-black">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Отгадано
                      </span>
                    ) : (
                      <span className="text-amber-600">В сканворде</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
