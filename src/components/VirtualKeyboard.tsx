import React from 'react';
import { Delete, ArrowLeft, ArrowRight } from 'lucide-react';

interface VirtualKeyboardProps {
  onKeyPress: (letter: string) => void;
  onBackspace: () => void;
  onPrevCell: () => void;
  onNextCell: () => void;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onPrevCell,
  onNextCell,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-2.5 sm:p-3.5 md:p-4 bg-white/95 backdrop-blur-md rounded-3xl border-2 border-white shadow-xl select-none">
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {/* Row 1 (Q - P) */}
        <div className="flex justify-center gap-1 sm:gap-1.5 md:gap-2 w-full">
          {KEYBOARD_ROWS[0].map((k) => (
            <button
              key={k}
              onClick={() => onKeyPress(k)}
              className="flex-1 min-w-[28px] max-w-[68px] h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl bg-white font-black text-lg sm:text-2xl md:text-3xl text-[#0F2756] border-2 border-blue-100 shadow-sm hover:bg-[#FFD13B] hover:border-amber-400 active:scale-95 active:bg-[#FFD13B] transition-all flex items-center justify-center cursor-pointer"
            >
              {k}
            </button>
          ))}
        </div>

        {/* Row 2 (A - L) */}
        <div className="flex justify-center gap-1 sm:gap-1.5 md:gap-2 w-full px-1 sm:px-2">
          {KEYBOARD_ROWS[1].map((k) => (
            <button
              key={k}
              onClick={() => onKeyPress(k)}
              className="flex-1 min-w-[28px] max-w-[68px] h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl bg-white font-black text-lg sm:text-2xl md:text-3xl text-[#0F2756] border-2 border-blue-100 shadow-sm hover:bg-[#FFD13B] hover:border-amber-400 active:scale-95 active:bg-[#FFD13B] transition-all flex items-center justify-center cursor-pointer"
            >
              {k}
            </button>
          ))}
        </div>

        {/* Row 3 (Controls + Z - M) */}
        <div className="flex justify-center gap-1 sm:gap-1.5 md:gap-2 w-full">
          {/* Previous letter button in Cyan */}
          <button
            onClick={onPrevCell}
            className="flex-1 min-w-[34px] max-w-[62px] h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl bg-[#00A3C4] font-bold text-white border-2 border-[#008DAA] shadow-sm hover:bg-[#008DAA] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            title="Предыдущая буква"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
          </button>

          {/* Letter keys */}
          {KEYBOARD_ROWS[2].map((k) => (
            <button
              key={k}
              onClick={() => onKeyPress(k)}
              className="flex-1 min-w-[28px] max-w-[68px] h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl bg-white font-black text-lg sm:text-2xl md:text-3xl text-[#0F2756] border-2 border-blue-100 shadow-sm hover:bg-[#FFD13B] hover:border-amber-400 active:scale-95 active:bg-[#FFD13B] transition-all flex items-center justify-center cursor-pointer"
            >
              {k}
            </button>
          ))}

          {/* Backspace button in Brand Coral */}
          <button
            onClick={onBackspace}
            className="flex-1 min-w-[42px] max-w-[72px] h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl bg-[#FF6B6B] text-white font-bold border-2 border-[#FA5252] shadow-sm hover:bg-[#FA5252] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            title="Стереть букву"
          >
            <Delete className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
          </button>

          {/* Next letter button in Cyan */}
          <button
            onClick={onNextCell}
            className="flex-1 min-w-[34px] max-w-[62px] h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl bg-[#00A3C4] font-bold text-white border-2 border-[#008DAA] shadow-sm hover:bg-[#008DAA] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            title="Следующая буква"
          >
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
