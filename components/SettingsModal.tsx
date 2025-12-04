
import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Brain, HelpCircle, ChevronRight, MessageSquareQuote, User, Bot, PenLine, Signal, SignalHigh, SignalLow, Moon, Sun, Grid3x3, Grid2x2, LayoutGrid } from 'lucide-react';
import HowToPlay from './HowToPlay';
import { GameMode, Difficulty, BoardSize, Theme } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  thinkingSoundEnabled: boolean;
  aiReasoningEnabled: boolean;
  onToggleSound: () => void;
  onToggleThinkingSound: () => void;
  onToggleAiReasoning: () => void;
  gameMode: GameMode;
  playerXName: string;
  playerOName: string;
  onUpdatePlayerXName: (name: string) => void;
  onUpdatePlayerOName: (name: string) => void;
  difficulty: Difficulty;
  onUpdateDifficulty: (diff: Difficulty) => void;
  boardSize: BoardSize;
  onUpdateBoardSize: (size: BoardSize) => void;
  theme: Theme;
  onToggleTheme: () => void;
}

type ViewState = 'SETTINGS' | 'TUTORIAL';

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  soundEnabled, 
  thinkingSoundEnabled,
  aiReasoningEnabled,
  onToggleSound,
  onToggleThinkingSound,
  onToggleAiReasoning,
  gameMode,
  playerXName,
  playerOName,
  onUpdatePlayerXName,
  onUpdatePlayerOName,
  difficulty,
  onUpdateDifficulty,
  boardSize,
  onUpdateBoardSize,
  theme,
  onToggleTheme
}) => {
  const [view, setView] = useState<ViewState>('SETTINGS');

  // Reset view when modal opens/closes
  useEffect(() => {
    if (isOpen) setView('SETTINGS');
  }, [isOpen]);

  if (!isOpen) return null;

  const isDark = theme === 'DARK';

  // Theme-derived styles
  const modalBg = isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-stone-200';
  const textPrimary = isDark ? 'text-white' : 'text-stone-800';
  const textSecondary = isDark ? 'text-slate-500' : 'text-stone-500';
  const divider = isDark ? 'bg-slate-800' : 'bg-stone-200';
  const inputBg = isDark ? 'bg-slate-800 border-slate-700 placeholder-slate-600' : 'bg-stone-50 border-stone-200 placeholder-stone-400';
  const itemIconBg = isDark ? 'bg-slate-800 text-slate-500' : 'bg-stone-100 text-stone-500';
  const optionButtonBase = isDark 
      ? 'bg-slate-800 text-slate-500 border-slate-700 hover:bg-slate-750 hover:text-slate-300' 
      : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50 hover:text-stone-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className={`absolute inset-0 backdrop-blur-sm transition-opacity duration-300 ${isDark ? 'bg-slate-950/60' : 'bg-stone-900/30'}`}
        onClick={onClose}
      />
      
      <div className={`relative w-full max-w-sm rounded-2xl shadow-2xl p-6 transform transition-all duration-300 scale-100 opacity-100 border h-[620px] max-h-[90vh] flex flex-col ${modalBg}`}>
        
        {view === 'SETTINGS' ? (
            <>
                {/* Header */}
                <div className="flex items-center justify-between mb-6 shrink-0">
                <h2 className={`text-xl font-bold flex items-center gap-2 ${textPrimary}`}>
                    Settings
                </h2>
                <button 
                    onClick={onClose}
                    className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-stone-100 text-stone-400 hover:text-stone-800'}`}
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>
                </div>

                <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                
                {/* Appearance Section */}
                <div className="space-y-3">
                   <h3 className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Appearance</h3>
                   <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${itemIconBg}`}>
                                {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className={`font-semibold ${textPrimary}`}>Theme</p>
                                <p className={`text-xs ${textSecondary}`}>{isDark ? 'Dark Mode' : 'Light Mode'}</p>
                            </div>
                        </div>

                        <button
                            onClick={onToggleTheme}
                            className={`
                                relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 
                                ${isDark ? 'bg-slate-700 focus:ring-offset-slate-900' : 'bg-stone-300 focus:ring-offset-white'}
                            `}
                        >
                            <span
                                className={`
                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm
                                ${!isDark ? 'translate-x-6' : 'translate-x-1'}
                                `}
                            />
                        </button>
                    </div>
                </div>

                <div className={`h-px w-full ${divider}`} />

                {/* Player Names Section */}
                <div className="space-y-3">
                   <h3 className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Player Names</h3>
                   <div className="grid gap-3">
                      {/* Player X Input */}
                      <div className="relative group">
                        <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${textSecondary}`}>
                           <User className="w-4 h-4" />
                        </div>
                        <input 
                           type="text" 
                           value={playerXName}
                           onChange={(e) => onUpdatePlayerXName(e.target.value)}
                           className={`w-full text-sm rounded-xl block pl-9 p-2.5 border focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${inputBg} ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}
                           placeholder="Player X Name"
                           maxLength={10}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                           <PenLine className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Player O Input */}
                      <div className="relative group">
                        <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${textSecondary}`}>
                           {gameMode === 'VS_AI' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>
                        <input 
                           type="text" 
                           value={playerOName}
                           onChange={(e) => onUpdatePlayerOName(e.target.value)}
                           className={`w-full text-sm rounded-xl block pl-9 p-2.5 border focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-colors ${inputBg} ${isDark ? 'text-rose-300' : 'text-rose-600'}`}
                           placeholder={gameMode === 'VS_AI' ? "AI Name" : "Player O Name"}
                           maxLength={10}
                        />
                         <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                           <PenLine className="w-3.5 h-3.5" />
                        </div>
                      </div>
                   </div>
                </div>

                <div className={`h-px w-full ${divider}`} />
                
                {/* Game Configuration */}
                 <div className="space-y-3">
                   <h3 className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Game Config</h3>
                   
                   {/* Board Size */}
                   <div className="mb-3">
                        <p className={`text-xs font-medium mb-2 ${textSecondary}`}>Grid Layout</p>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => onUpdateBoardSize(3)}
                                className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
                                    boardSize === 3 
                                    ? (isDark ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50' : 'bg-indigo-50 text-indigo-600 border-indigo-200')
                                    : optionButtonBase
                                }`}
                            >
                                <Grid3x3 className="w-4 h-4" />
                                3x3
                            </button>
                            <button
                                onClick={() => onUpdateBoardSize(4)}
                                className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
                                    boardSize === 4 
                                    ? (isDark ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50' : 'bg-indigo-50 text-indigo-600 border-indigo-200')
                                    : optionButtonBase
                                }`}
                            >
                                <Grid2x2 className="w-4 h-4" />
                                4x4
                            </button>
                            <button
                                onClick={() => onUpdateBoardSize(5)}
                                className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
                                    boardSize === 5 
                                    ? (isDark ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50' : 'bg-indigo-50 text-indigo-600 border-indigo-200')
                                    : optionButtonBase
                                }`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                                5x5
                            </button>
                        </div>
                   </div>

                    {/* Difficulty - Only for VS_AI */}
                    {gameMode === 'VS_AI' && (
                        <div>
                           <p className={`text-xs font-medium mb-2 ${textSecondary}`}>AI Difficulty</p>
                           <div className="grid grid-cols-3 gap-2">
                              <button
                                  onClick={() => onUpdateDifficulty('EASY')}
                                  className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
                                      difficulty === 'EASY' 
                                      ? (isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 'bg-emerald-50 text-emerald-600 border-emerald-200')
                                      : optionButtonBase
                                  }`}
                              >
                                  <SignalLow className="w-4 h-4" />
                                  Easy
                              </button>
                              
                              <button
                                  onClick={() => onUpdateDifficulty('MEDIUM')}
                                  className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
                                      difficulty === 'MEDIUM' 
                                      ? (isDark ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' : 'bg-yellow-50 text-yellow-600 border-yellow-200')
                                      : optionButtonBase
                                  }`}
                              >
                                  <Signal className="w-4 h-4" />
                                  Medium
                              </button>

                              <button
                                  onClick={() => onUpdateDifficulty('HARD')}
                                  className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
                                      difficulty === 'HARD' 
                                      ? (isDark ? 'bg-rose-500/20 text-rose-300 border-rose-500/50' : 'bg-rose-50 text-rose-600 border-rose-200')
                                      : optionButtonBase
                                  }`}
                              >
                                  <SignalHigh className="w-4 h-4" />
                                  Hard
                              </button>
                           </div>
                        </div>
                    )}
                 </div>

                <div className={`h-px w-full ${divider}`} />

                {/* Sound Settings */}
                <div className="space-y-4">
                     <h3 className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Audio & Effects</h3>
                    {/* Master Sound */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${soundEnabled ? (isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600') : itemIconBg}`}>
                            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                        </div>
                        <div>
                            <p className={`font-semibold ${textPrimary}`}>Sound Effects</p>
                            <p className={`text-xs ${textSecondary}`}>Master volume</p>
                        </div>
                        </div>

                        <button
                        onClick={onToggleSound}
                        className={`
                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                            ${soundEnabled ? 'bg-indigo-500' : (isDark ? 'bg-slate-700' : 'bg-stone-300')}
                            ${isDark ? 'focus:ring-offset-slate-900' : 'focus:ring-offset-white'}
                        `}
                        >
                        <span
                            className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm
                            ${soundEnabled ? 'translate-x-6' : 'translate-x-1'}
                            `}
                        />
                        </button>
                    </div>

                    {/* Thinking Sound */}
                    <div className={`flex items-center justify-between transition-opacity duration-200 ${!soundEnabled ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                        <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${thinkingSoundEnabled && soundEnabled ? (isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600') : itemIconBg}`}>
                            <Brain className="w-5 h-5" />
                        </div>
                        <div>
                            <p className={`font-semibold ${textPrimary}`}>Thinking Sound</p>
                            <p className={`text-xs ${textSecondary}`}>While AI thinks</p>
                        </div>
                        </div>

                        <button
                        onClick={onToggleThinkingSound}
                        disabled={!soundEnabled}
                        className={`
                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                            ${thinkingSoundEnabled ? 'bg-purple-500' : (isDark ? 'bg-slate-700' : 'bg-stone-300')}
                            ${isDark ? 'focus:ring-offset-slate-900' : 'focus:ring-offset-white'}
                        `}
                        >
                        <span
                            className={`
                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm
                            ${thinkingSoundEnabled ? 'translate-x-6' : 'translate-x-1'}
                            `}
                        />
                        </button>
                    </div>
                </div>

                {/* AI Reasoning Display */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${aiReasoningEnabled ? (isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600') : itemIconBg}`}>
                        <MessageSquareQuote className="w-5 h-5" />
                    </div>
                    <div>
                        <p className={`font-semibold ${textPrimary}`}>AI Reasoning</p>
                        <p className={`text-xs ${textSecondary}`}>Show text explanations</p>
                    </div>
                    </div>

                    <button
                    onClick={onToggleAiReasoning}
                    className={`
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 
                        ${aiReasoningEnabled ? 'bg-emerald-500' : (isDark ? 'bg-slate-700' : 'bg-stone-300')}
                        ${isDark ? 'focus:ring-offset-slate-900' : 'focus:ring-offset-white'}
                    `}
                    >
                    <span
                        className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm
                        ${aiReasoningEnabled ? 'translate-x-6' : 'translate-x-1'}
                        `}
                    />
                    </button>
                </div>

                <div className={`h-px w-full ${divider} my-4`} />

                {/* Tutorial Link */}
                <button 
                    onClick={() => setView('TUTORIAL')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all group ${
                        isDark 
                        ? 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/50' 
                        : 'bg-white hover:bg-stone-50 border-stone-200'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-teal-500/20 text-teal-400 group-hover:text-teal-300' : 'bg-teal-50 text-teal-600 group-hover:text-teal-700'}`}>
                            <HelpCircle className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className={`font-semibold ${textPrimary}`}>How to Play</p>
                            <p className={`text-xs ${textSecondary}`}>Rules & Controls</p>
                        </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-all ${isDark ? 'text-slate-500 group-hover:text-slate-300' : 'text-stone-400 group-hover:text-stone-600'} group-hover:translate-x-1`} />
                </button>

                </div>
            </>
        ) : (
            <HowToPlay onBack={() => setView('SETTINGS')} theme={theme} />
        )}
      </div>
    </div>
  );
};

export default SettingsModal;
