
import React, { useEffect, useRef } from 'react';
import { X, History, User, Bot, Clock } from 'lucide-react';
import { MoveLogEntry, BoardSize, GameMode, Theme } from '../types';

interface MoveHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  moveLog: MoveLogEntry[];
  boardSize: BoardSize;
  playerXName: string;
  playerOName: string;
  gameMode: GameMode;
  theme: Theme;
}

const MoveHistoryModal: React.FC<MoveHistoryModalProps> = ({
  isOpen,
  onClose,
  moveLog,
  boardSize,
  playerXName,
  playerOName,
  gameMode,
  theme
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isOpen, moveLog]);

  if (!isOpen) return null;

  const isDark = theme === 'DARK';
  const modalBg = isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-stone-200';
  const textPrimary = isDark ? 'text-white' : 'text-stone-800';
  const listBg = isDark ? 'bg-slate-950/30' : 'bg-stone-50/50';
  const headerBg = isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-stone-100';

  const getCoordinates = (index: number) => {
    const row = Math.floor(index / boardSize) + 1;
    const col = (index % boardSize) + 1;
    return `R${row}:C${col}`;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className={`absolute inset-0 backdrop-blur-sm transition-opacity duration-300 ${isDark ? 'bg-slate-950/60' : 'bg-stone-900/30'}`}
        onClick={onClose}
      />
      
      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-scale-up border ${modalBg}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b backdrop-blur shrink-0 ${headerBg}`}>
          <div className="flex items-center gap-2 text-indigo-500">
            <History className="w-5 h-5" />
            <h2 className={`text-lg font-bold ${textPrimary}`}>Move History</h2>
          </div>
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-stone-100 text-stone-400 hover:text-stone-800'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div 
            ref={scrollRef}
            className={`flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar ${listBg}`}
        >
          {moveLog.length === 0 ? (
            <div className={`flex flex-col items-center justify-center h-48 space-y-2 ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
                <History className="w-8 h-8 opacity-50" />
                <p>No moves made yet.</p>
            </div>
          ) : (
            moveLog.map((entry, i) => {
                const isPlayerX = entry.player === 'X';
                const playerName = isPlayerX ? playerXName : playerOName;
                
                const cardBase = `flex gap-3 p-3 rounded-xl border transition-all duration-200 animate-fade-in`;
                
                // Dark Mode Styles
                const darkCard = isPlayerX 
                    ? 'bg-indigo-500/5 border-indigo-500/20 hover:bg-indigo-500/10' 
                    : 'bg-rose-500/5 border-rose-500/20 hover:bg-rose-500/10';
                
                // Light Mode Styles
                const lightCard = isPlayerX
                    ? 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100/50'
                    : 'bg-rose-50 border-rose-100 hover:bg-rose-100/50';

                return (
                    <div 
                        key={i} 
                        className={`${cardBase} ${isDark ? darkCard : lightCard}`}
                    >
                        {/* Avatar */}
                        <div className={`
                            shrink-0 w-8 h-8 rounded-full flex items-center justify-center border shadow-sm mt-0.5
                            ${isPlayerX 
                                ? (isDark ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-indigo-100 border-indigo-200 text-indigo-600') 
                                : (isDark ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-rose-100 border-rose-200 text-rose-600')
                            }
                        `}>
                            {entry.player === 'X' ? <User className="w-4 h-4" /> : (gameMode === 'VS_AI' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className={`font-bold ${isPlayerX ? (isDark ? 'text-indigo-300' : 'text-indigo-700') : (isDark ? 'text-rose-300' : 'text-rose-700')}`}>
                                    {playerName}
                                </span>
                                <span className={`flex items-center gap-1 font-mono ${isDark ? 'text-slate-500' : 'text-stone-400'}`}>
                                    <Clock className="w-3 h-3" />
                                    {formatTime(entry.timestamp)}
                                </span>
                            </div>

                            {/* Reasoning Bubble for AI */}
                            {entry.reasoning ? (
                                <div className={`
                                    relative p-2.5 rounded-lg rounded-tl-none border text-sm italic leading-relaxed
                                    ${isPlayerX 
                                        ? (isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-200' : 'bg-white border-indigo-200 text-indigo-800')
                                        : (isDark ? 'bg-rose-500/10 border-rose-500/20 text-rose-200' : 'bg-white border-rose-200 text-rose-800')
                                    }
                                `}>
                                    "{entry.reasoning}"
                                </div>
                            ) : (
                                /* Standard text for moves without reasoning */
                                <div className={`text-sm flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-stone-600'}`}>
                                    Placed <span className={`font-bold ${isPlayerX ? (isDark ? 'text-indigo-400' : 'text-indigo-600') : (isDark ? 'text-rose-400' : 'text-rose-600')}`}>{entry.player}</span> at 
                                    <span className={`px-1.5 py-0.5 rounded font-mono text-xs border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-stone-200 text-stone-600'}`}>
                                        {getCoordinates(entry.index)}
                                    </span>
                                </div>
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

export default MoveHistoryModal;
