
import React from 'react';
import Square from './Square';
import { SquareValue, BoardSize, Theme } from '../types';

interface BoardProps {
  squares: SquareValue[];
  onClick: (i: number) => void;
  winningLine: number[] | null;
  disabled: boolean;
  isDraw?: boolean;
  isResetting: boolean;
  boardSize: BoardSize;
  theme: Theme;
}

const Board: React.FC<BoardProps> = ({ squares, onClick, winningLine, disabled, isDraw, isResetting, boardSize, theme }) => {
  
  // Helper to calculate SVG line coordinates based on winning indices
  const getLineCoordinates = (line: number[]) => {
    if (!line || line.length !== boardSize) return null;
    
    const cellSize = 100;

    // Board is essentially a (size*100)x(size*100) grid for SVG purposes
    const getCenter = (index: number) => {
        const row = Math.floor(index / boardSize);
        const col = index % boardSize;
        return { x: col * cellSize + cellSize/2, y: row * cellSize + cellSize/2 };
    };

    const start = getCenter(line[0]);
    const end = getCenter(line[line.length - 1]);
    
    // Extend the line slightly beyond the centers for visual appeal
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const padding = 20;
    
    return {
        x1: start.x - Math.cos(angle) * padding,
        y1: start.y - Math.sin(angle) * padding,
        x2: end.x + Math.cos(angle) * padding,
        y2: end.y + Math.sin(angle) * padding
    };
  };

  const lineCoords = winningLine ? getLineCoordinates(winningLine) : null;

  // Determine grid columns class
  const getGridColsClass = () => {
     if (boardSize === 5) return 'grid-cols-5';
     if (boardSize === 4) return 'grid-cols-4';
     return 'grid-cols-3';
  };

  const isDark = theme === 'DARK';

  return (
    <div className={`
      relative p-4 rounded-2xl shadow-2xl backdrop-blur-sm transition-all duration-300
      ${isDark 
        ? 'bg-slate-900/50 border border-slate-700/50' 
        : 'bg-white/40 border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)]'
      }
    `}>
      <div className={`grid ${getGridColsClass()} gap-3 sm:gap-4 relative z-10`}>
        {squares.map((square, i) => (
          <Square
            key={i}
            value={square}
            onClick={() => onClick(i)}
            disabled={disabled || square !== null}
            isWinningSquare={winningLine?.includes(i) ?? false}
            isDraw={isDraw}
            isResetting={isResetting}
            boardSize={boardSize}
            theme={theme}
          />
        ))}
      </div>
      
      {/* SVG Overlay for Winning Line */}
      {winningLine && lineCoords && !isResetting && (
        <svg 
            className="absolute inset-0 pointer-events-none z-20 w-full h-full p-4" 
            viewBox={`0 0 ${boardSize * 100} ${boardSize * 100}`}
        >
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="50%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#fb7185" />
                </linearGradient>
            </defs>
            <line 
                x1={lineCoords.x1} 
                y1={lineCoords.y1} 
                x2={lineCoords.x2} 
                y2={lineCoords.y2} 
                stroke="url(#gradient)" 
                strokeLinecap="round"
                className="animate-win-line"
            />
        </svg>
      )}
    </div>
  );
};

export default Board;
