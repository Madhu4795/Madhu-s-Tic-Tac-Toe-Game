
import React from 'react';
import { MousePointerClick, Trophy, RotateCcw, Grid3x3, Users, Bot, ArrowLeft } from 'lucide-react';
import { Theme } from '../types';

interface HowToPlayProps {
  onBack: () => void;
  theme: Theme;
}

const HowToPlay: React.FC<HowToPlayProps> = ({ onBack, theme }) => {
  const isDark = theme === 'DARK';
  const textPrimary = isDark ? 'text-white' : 'text-stone-800';
  const textSecondary = isDark ? 'text-slate-300' : 'text-stone-600';
  const bgCard = isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-stone-100/50 border-stone-200/50';
  const bgSubCard = isDark ? 'bg-slate-800/30 border-slate-700/30' : 'bg-white border-stone-200';
  const iconBg = isDark ? 'bg-slate-800' : 'bg-white border border-stone-200';
  const backButtonHover = isDark ? 'hover:bg-slate-800 hover:text-white' : 'hover:bg-stone-100 hover:text-stone-800';

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack}
          className={`p-1.5 rounded-lg text-slate-400 transition-colors ${backButtonHover}`}
          aria-label="Back to settings"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className={`text-xl font-bold ${textPrimary}`}>How to Play</h2>
      </div>

      <div className={`flex-1 overflow-y-auto pr-2 space-y-6 ${textSecondary} custom-scrollbar`}>
        
        {/* Objective Section */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-500 font-semibold">
            <Trophy className="w-5 h-5" />
            <h3>Objective</h3>
          </div>
          <p className={`text-sm leading-relaxed p-3 rounded-xl border ${bgCard}`}>
            Be the first player to get your marks in a row (horizontally, vertically, or diagonally). If the board fills up with no winner, it's a draw.
          </p>
        </section>

        {/* Board Rules */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-rose-500 font-semibold">
            <Grid3x3 className="w-5 h-5" />
            <h3>Board Sizes</h3>
          </div>
          <div className="grid gap-2 text-sm">
            <div className={`p-2.5 rounded-lg border flex justify-between items-center ${bgSubCard}`}>
              <span>3x3 Grid</span>
              <span className={`font-bold ${textPrimary}`}>Connect 3</span>
            </div>
            <div className={`p-2.5 rounded-lg border flex justify-between items-center ${bgSubCard}`}>
              <span>4x4 Grid</span>
              <span className={`font-bold ${textPrimary}`}>Connect 4</span>
            </div>
            <div className={`p-2.5 rounded-lg border flex justify-between items-center ${bgSubCard}`}>
              <span>5x5 Grid</span>
              <span className={`font-bold ${textPrimary}`}>Connect 5</span>
            </div>
          </div>
        </section>

        {/* Controls */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-500 font-semibold">
            <MousePointerClick className="w-5 h-5" />
            <h3>Controls</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-3 items-start">
              <span className={`p-1 rounded text-slate-400 mt-0.5 ${iconBg}`}><MousePointerClick className="w-3 h-3" /></span>
              <span>Tap any empty square to place your mark.</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className={`p-1 rounded text-slate-400 mt-0.5 ${iconBg}`}><RotateCcw className="w-3 h-3" /></span>
              <span><strong>Undo:</strong> Reverts the last turn. Against AI, this undoes both the AI's move and yours.</span>
            </li>
          </ul>
        </section>

        {/* Game Modes */}
        <section className="space-y-3">
            <div className="flex items-center gap-2 text-purple-500 font-semibold">
                <Bot className="w-5 h-5" />
                <h3>Game Modes</h3>
            </div>
             <div className="space-y-2 text-sm">
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'}`}>
                    <strong className={`block mb-1 flex items-center gap-2 ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
                        <Bot className="w-3.5 h-3.5" /> VS AI
                    </strong>
                    Play against Gemini. Choose Easy, Medium, or Hard difficulty. Hard mode is nearly unbeatable!
                </div>
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-200'}`}>
                    <strong className={`block mb-1 flex items-center gap-2 ${isDark ? 'text-rose-300' : 'text-rose-700'}`}>
                        <Users className="w-3.5 h-3.5" /> Multiplayer
                    </strong>
                    Play with a friend on the same device. Turns alternate automatically.
                </div>
             </div>
        </section>
      </div>
    </div>
  );
};

export default HowToPlay;
