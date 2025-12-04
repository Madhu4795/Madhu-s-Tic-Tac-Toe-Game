
import React, { useState, useEffect } from 'react';
import { Player, GameStatus as Status, GameMode, Theme } from '../types';
import { Brain, RefreshCw, Trophy, RotateCcw } from 'lucide-react';

interface GameStatusProps {
  status: Status;
  winner: Player | 'Draw' | null;
  isXNext: boolean;
  aiReasoning: string | null;
  onReset: () => void;
  onUndo: () => void;
  canUndo: boolean;
  gameMode: GameMode;
  playerXName: string;
  playerOName: string;
  showReasoning: boolean;
  theme: Theme;
}

const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    
    let index = 0;
    let intervalId: ReturnType<typeof setInterval>;

    // Small delay before typing starts for better pacing
    const startTimeout = setTimeout(() => {
        intervalId = setInterval(() => {
            if (index < text.length) {
              setDisplayedText(text.slice(0, index + 1));
              index++;
            } else {
              setIsTyping(false);
              clearInterval(intervalId);
            }
          }, 35); // Typing speed in ms
    }, 100);

    return () => {
        clearTimeout(startTimeout);
        if (intervalId) clearInterval(intervalId);
    };
  }, [text]);

  return (
    <span className="inline">
      {displayedText}
      {isTyping && <span className="animate-pulse inline-block ml-0.5 w-1.5 h-4 bg-emerald-400 align-middle"></span>}
    </span>
  );
};

const GameStatus: React.FC<GameStatusProps> = ({ 
  status, 
  winner, 
  isXNext, 
  aiReasoning, 
  onReset,
  onUndo,
  canUndo,
  gameMode,
  playerXName,
  playerOName,
  showReasoning,
  theme
}) => {
  const winnerName = winner === 'X' ? playerXName : (winner === 'O' ? playerOName : null);
  const shouldShowReasoning = showReasoning && aiReasoning && gameMode === 'VS_AI';
  const isDark = theme === 'DARK';

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-md">
      {/* Turn Indicator / Winner Banner */}
      <div className="w-full flex justify-center h-16">
        {status === Status.FINISHED ? (
          <div className={`animate-fade-in-up w-full p-3 rounded-xl border flex items-center justify-center
             ${isDark 
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/30' 
                : 'bg-gradient-to-r from-emerald-100 to-teal-100 border-emerald-200 shadow-sm'
             }
          `}>
            <h2 className={`text-2xl sm:text-3xl font-bold flex items-center justify-center gap-3 ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
              <Trophy className="w-7 h-7 text-yellow-400" />
              {winner === 'Draw' ? "It's a Draw!" : `${winnerName} Wins!`}
            </h2>
          </div>
        ) : (
          <div className={`flex items-center justify-center gap-2 sm:gap-4 text-lg font-medium p-1.5 rounded-full border backdrop-blur-md transition-all duration-300 min-w-[280px] sm:min-w-[320px]
            ${isDark 
                ? 'bg-slate-900/40 border-slate-700/50' 
                : 'bg-white/60 border-stone-200/60 shadow-sm'
            }
          `}>
             {status === Status.THINKING ? (
                 <div className="flex items-center justify-center gap-3 px-6 py-1.5 w-full text-purple-400 animate-pulse">
                    <Brain className="w-5 h-5" />
                    <span>{playerOName} is thinking...</span>
                 </div>
             ) : (
                 <>
                    {/* Player X Pill */}
                    <div className={`
                      relative px-4 py-1.5 rounded-full transition-all duration-500 ease-out flex items-center gap-2 select-none
                      ${isXNext 
                        ? 'bg-indigo-500/10 text-indigo-500 ring-1 ring-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)] scale-100 opacity-100' 
                        : 'text-slate-500 scale-95 opacity-50 grayscale'
                      }
                    `}>
                      <span className="truncate max-w-[80px] sm:max-w-[100px]">{playerXName}</span>
                      <span className="text-sm font-bold opacity-80">(X)</span>
                      
                      {/* Active Indicator Dot */}
                      {isXNext && (
                         <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white shadow-sm animate-bounce"></span>
                      )}
                    </div>

                    <span className={`text-[10px] font-bold uppercase tracking-widest shrink-0 ${isDark ? 'text-slate-600' : 'text-stone-400'}`}>VS</span>

                    {/* Player O Pill */}
                    <div className={`
                      relative px-4 py-1.5 rounded-full transition-all duration-500 ease-out flex items-center gap-2 select-none
                      ${!isXNext 
                        ? 'bg-rose-500/10 text-rose-500 ring-1 ring-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)] scale-100 opacity-100' 
                        : 'text-slate-500 scale-95 opacity-50 grayscale'
                      }
                    `}>
                      <span className="truncate max-w-[80px] sm:max-w-[100px]">{playerOName}</span>
                      <span className="text-sm font-bold opacity-80">(O)</span>

                      {/* Active Indicator Dot */}
                      {!isXNext && (
                         <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-sm animate-bounce"></span>
                      )}
                    </div>
                 </>
             )}
          </div>
        )}
      </div>

      {/* AI Reasoning Bubble - Only show in AI mode when reasoning exists AND is enabled */}
      <div className={`
        w-full transition-all duration-500 ease-in-out transform
        ${shouldShowReasoning ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}
      `}>
        {shouldShowReasoning && (
          <div className={`relative p-5 rounded-2xl border shadow-xl ${
              isDark 
                ? 'bg-slate-800 border-slate-700 ring-1 ring-white/5' 
                : 'bg-white border-stone-200 ring-1 ring-stone-950/5'
          }`}>
            <div className={`absolute -top-3 left-1/2 -translate-x-1/2 border px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm ${
                isDark 
                    ? 'bg-slate-900 border-slate-700 text-purple-400' 
                    : 'bg-stone-50 border-stone-200 text-purple-600'
            }`}>
              <Brain className="w-3 h-3" />
              MADHU SAYS
            </div>
            <p className={`text-center italic pt-2 leading-relaxed min-h-[3rem] flex items-center justify-center ${isDark ? 'text-slate-300' : 'text-stone-700'}`}>
              <TypewriterText text={aiReasoning} />
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`
            flex items-center gap-2 px-5 py-3 
            disabled:opacity-50 disabled:cursor-not-allowed
            font-semibold rounded-xl 
            border border-b-4 active:border-b-0 active:translate-y-1 active:border-t-4 disabled:active:border-b-4 disabled:active:translate-y-0 disabled:active:border-t-0
            transition-all duration-200
            ${isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600' 
                : 'bg-white hover:bg-stone-50 text-stone-600 border-stone-300'
            }
          `}
          aria-label="Undo last move"
        >
          <RotateCcw className="w-5 h-5" />
          Undo
        </button>

        <button
          onClick={onReset}
          className="
            flex items-center gap-2 px-8 py-3 
            bg-indigo-600 hover:bg-indigo-500 
            text-white font-semibold rounded-xl 
            border border-indigo-800 border-b-4 active:border-b-0 active:translate-y-1 active:border-t-4
            transition-all duration-200 shadow-lg shadow-indigo-500/20
          "
        >
          <RefreshCw className="w-5 h-5" />
          {status === Status.FINISHED ? 'Play Again' : 'Reset Game'}
        </button>
      </div>
    </div>
  );
};

export default GameStatus;
