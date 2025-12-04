
import React from 'react';
import { SquareValue, BoardSize, Theme } from '../types';
import { X, Circle } from 'lucide-react';

interface SquareProps {
  value: SquareValue;
  onClick: () => void;
  disabled: boolean;
  isWinningSquare: boolean;
  isDraw?: boolean;
  isResetting?: boolean;
  boardSize: BoardSize;
  theme: Theme;
}

const Square: React.FC<SquareProps> = ({ 
  value, 
  onClick, 
  disabled, 
  isWinningSquare, 
  isDraw, 
  isResetting, 
  boardSize,
  theme
}) => {
  
  // Dynamic sizing classes based on board size to keep board usable on all screens
  const getSizeClasses = () => {
    switch (boardSize) {
        case 5:
            return 'h-14 w-14 sm:h-16 sm:w-16 text-2xl sm:text-3xl';
        case 4:
            return 'h-16 w-16 sm:h-20 sm:w-20 text-3xl sm:text-4xl';
        case 3:
        default:
            return 'h-24 w-24 sm:h-32 sm:w-32 text-4xl sm:text-6xl';
    }
  };

  const getIconSizeClasses = () => {
    switch (boardSize) {
        case 5:
            return 'w-8 h-8 sm:w-10 sm:h-10';
        case 4:
            return 'w-10 h-10 sm:w-12 sm:h-12';
        case 3:
        default:
            return 'w-16 h-16 sm:w-20 sm:h-20';
    }
  };

  // Theme-based styles
  const isDark = theme === 'DARK';

  const baseStyles = isDark 
    ? 'bg-slate-800 border-slate-950 hover:bg-slate-700' 
    : 'bg-white border-stone-300 hover:bg-stone-50';
    
  const occupiedStyles = isDark
    ? 'bg-slate-800 border-slate-950'
    : 'bg-white border-stone-300';
    
  const winningStyles = isDark
    ? 'bg-emerald-500/20 border-emerald-600 ring-emerald-400/50'
    : 'bg-emerald-100 border-emerald-400 ring-emerald-400/50';
    
  const drawStyles = isDark
    ? 'bg-slate-800/80 border-slate-800 text-slate-400'
    : 'bg-stone-200/80 border-stone-300 text-stone-500';

  const disabledEmptyStyles = isDark
    ? 'hover:bg-slate-800'
    : 'hover:bg-white';

  return (
    <button
      className={`
        ${getSizeClasses()}
        flex items-center justify-center 
        rounded-xl 
        transition-all duration-500 ease-out
        border-b-4
        ${
          value === null 
            ? `${baseStyles} hover:-translate-y-1 active:border-b-0 active:translate-y-1` 
            : `cursor-default active:border-b-4 ${occupiedStyles}`
        }
        ${isWinningSquare ? `${winningStyles} ring-2` : ''}
        ${isDraw ? `animate-jitter opacity-60 grayscale ${drawStyles}` : ''}
        ${!isDraw && !isWinningSquare && value !== null ? occupiedStyles : ''}
        ${disabled && value === null ? `opacity-50 cursor-not-allowed hover:translate-y-0 ${disabledEmptyStyles}` : ''}
      `}
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `Square occupied by ${value}` : "Empty square"}
    >
      <div className={`
        transition-all duration-300 transform 
        ${value && !isResetting ? 'scale-100 opacity-100' : 'scale-0 opacity-0 rotate-180'}
      `}>
        {value === 'X' && (
          <X 
            className={`${getIconSizeClasses()} strokeWidth={2.5} transition-colors duration-500 ${isDraw ? (isDark ? 'text-slate-400' : 'text-stone-400') : 'text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]'}`} 
          />
        )}
        {value === 'O' && (
          <Circle 
            className={`${getIconSizeClasses()} strokeWidth={3} transition-colors duration-500 ${isDraw ? (isDark ? 'text-slate-400' : 'text-stone-400') : 'text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]'}`} 
          />
        )}
      </div>
    </button>
  );
};

export default Square;
