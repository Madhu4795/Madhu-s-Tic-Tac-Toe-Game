
import React, { useState, useEffect, useCallback } from 'react';
import Board from './components/Board';
import GameStatus from './components/GameStatus';
import Tooltip from './components/Tooltip';
import SettingsModal from './components/SettingsModal';
import MoveHistoryModal from './components/MoveHistoryModal';
import { calculateWinner, isBoardEmpty } from './utils/gameUtils';
import { getAiMove } from './services/geminiService';
import { SquareValue, GameStatus as Status, Player, GameMode, Difficulty, BoardSize, MoveLogEntry, Theme } from './types';
import { Bot, Users, History as HistoryIcon, Settings } from 'lucide-react';
import { playMoveSound, playWinSound, playDrawSound, startThinkingSound, stopThinkingSound, setSoundConfig } from './utils/soundUtils';
import { triggerWinConfetti } from './utils/confettiUtils';

const App: React.FC = () => {
  const [boardSize, setBoardSize] = useState<BoardSize>(3);
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [history, setHistory] = useState<SquareValue[][]>([]); // History stack for Undo
  const [moveLog, setMoveLog] = useState<MoveLogEntry[]>([]); // Detailed log of moves
  const [isXNext, setIsXNext] = useState<boolean>(true); // X always starts
  const [gameStatus, setGameStatus] = useState<Status>(Status.IDLE);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('VS_AI');
  const [difficulty, setDifficulty] = useState<Difficulty>('HARD');
  const [theme, setTheme] = useState<Theme>('DARK');
  const [isResetting, setIsResetting] = useState(false);
  
  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [thinkingSoundEnabled, setThinkingSoundEnabled] = useState(true);
  const [aiReasoningEnabled, setAiReasoningEnabled] = useState(true);

  // Player Names State
  const [playerXName, setPlayerXName] = useState('Player');
  const [playerOName, setPlayerOName] = useState('Madhu');

  // Sync settings with sound utility
  useEffect(() => {
    setSoundConfig({ master: soundEnabled, thinking: thinkingSoundEnabled });
  }, [soundEnabled, thinkingSoundEnabled]);

  const checkGameState = useCallback((currentSquares: SquareValue[], size: number) => {
    const { winner: resultWinner, line } = calculateWinner(currentSquares, size);
    
    if (resultWinner) {
      setWinner(resultWinner);
      setWinningLine(line);
      setGameStatus(Status.FINISHED);
      return true;
    }
    return false;
  }, []);

  const handleSquareClick = useCallback(async (i: number) => {
    // Prevent moves if game over, square taken, or AI thinking
    if (squares[i] || winner || gameStatus === Status.THINKING || isResetting) {
      return;
    }

    // Determine current player symbol
    const currentPlayer = isXNext ? 'X' : 'O';

    // In AI mode, prevent human from playing if it's O's turn (AI's turn)
    if (gameMode === 'VS_AI' && !isXNext) return;

    // Play sound for move
    playMoveSound(currentPlayer);

    // Save history before move
    setHistory(prev => [...prev, squares]);
    
    // Log move
    setMoveLog(prev => [...prev, {
        player: currentPlayer,
        index: i,
        timestamp: Date.now()
    }]);

    const newSquares = [...squares];
    newSquares[i] = currentPlayer;
    setSquares(newSquares);
    
    // Check if move won the game
    if (checkGameState(newSquares, boardSize)) return;

    // Handle turns based on mode
    if (gameMode === 'VS_AI') {
        setIsXNext(false); // Pass turn to AI
        setGameStatus(Status.THINKING);
        setAiReasoning(null);
    } else {
        setIsXNext(!isXNext); // Toggle turn for local multiplayer
        setGameStatus(Status.PLAYING);
        setAiReasoning(null);
    }
    
  }, [squares, winner, gameStatus, checkGameState, isXNext, gameMode, boardSize, isResetting]);

  // Effect to handle AI move when it's O's turn and mode is VS_AI
  useEffect(() => {
    const makeAiMove = async () => {
      if (gameMode === 'VS_AI' && !isXNext && gameStatus === Status.THINKING && !winner && !isResetting) {
        try {
            // Small delay for realism
            await new Promise(resolve => setTimeout(resolve, 600));

            const { move, reasoning } = await getAiMove(squares, boardSize, 'O', difficulty);
            
            // Save history before AI move is applied
            setHistory(prev => [...prev, squares]);
            
            // Log move with reasoning
            setMoveLog(prev => [...prev, {
                player: 'O',
                index: move,
                reasoning: reasoning,
                timestamp: Date.now()
            }]);

            setSquares(prev => {
                const next = [...prev];
                // Ensure the square is still valid (rare race condition safeguard)
                if (next[move] === null) {
                   next[move] = 'O';
                }
                return next;
            });
            
            playMoveSound('O');
            setAiReasoning(reasoning);
            setIsXNext(true); // Pass turn back to Human
            setGameStatus(Status.PLAYING);
        } catch (error) {
            console.error("AI Move failed", error);
            setGameStatus(Status.PLAYING);
            setIsXNext(true); // Skip AI turn on error to prevent lock
        }
      }
    };

    makeAiMove();
    
  }, [isXNext, gameStatus, squares, winner, gameMode, difficulty, boardSize, isResetting]);

  // Separate effect to check win condition whenever board changes (redundant safety check + handles AI move wins)
  useEffect(() => {
    if (gameStatus !== Status.FINISHED) {
        checkGameState(squares, boardSize);
    }
  }, [squares, gameStatus, checkGameState, boardSize]);

  // Sound Effect Hook for Game Status (Thinking)
  useEffect(() => {
    if (gameStatus === Status.THINKING && !isResetting) {
      startThinkingSound();
    } else {
      stopThinkingSound();
    }
    return () => stopThinkingSound();
  }, [gameStatus, isResetting]);

  // Sound Effect Hook for Winner & Confetti
  useEffect(() => {
    if (gameStatus === Status.FINISHED && !isResetting) {
        if (winner === 'Draw') {
            playDrawSound();
        } else if (winner) {
            playWinSound();
            triggerWinConfetti();
        }
    }
  }, [gameStatus, winner, isResetting]);

  const resetGame = () => {
    setIsResetting(true);
    // Wait for the animation (which takes ~300ms) to finish before actually clearing the board
    setTimeout(() => {
        setSquares(Array(boardSize * boardSize).fill(null));
        setHistory([]);
        setMoveLog([]);
        setIsXNext(true);
        setGameStatus(Status.IDLE);
        setWinningLine(null);
        setWinner(null);
        setAiReasoning(null);
        setIsResetting(false);
    }, 400);
  };

  const handleUndo = () => {
    if (gameStatus === Status.THINKING || isResetting) return;
    if (history.length === 0) return;

    let stepsToUndo = 1;

    if (gameMode === 'VS_AI') {
        // VS AI Logic:
        if (isXNext) {
            // It's player's turn, so AI moved last. Undo AI move + Player move.
            stepsToUndo = 2;
        } else {
            // It's AI's turn (or game over on Human turn). Undo 1 step.
            stepsToUndo = 1;
        }
    }

    const newHistory = [...history];
    let targetBoard: SquareValue[] | undefined;

    // Ensure we don't undo more than available history
    if (stepsToUndo > newHistory.length) stepsToUndo = newHistory.length;

    for (let i = 0; i < stepsToUndo; i++) {
        targetBoard = newHistory.pop();
    }

    if (targetBoard) {
        setHistory(newHistory);
        setSquares(targetBoard);
        setMoveLog(prev => prev.slice(0, prev.length - stepsToUndo));
        
        // Reset derived state
        setWinner(null);
        setWinningLine(null);
        setAiReasoning(null);
        
        // Recalculate turn
        const moves = targetBoard.filter(s => s !== null).length;
        setIsXNext(moves % 2 === 0);
        
        setGameStatus(moves === 0 ? Status.IDLE : Status.PLAYING);
    }
  };

  // Reset board when size changes
  useEffect(() => {
    setSquares(Array(boardSize * boardSize).fill(null));
    setHistory([]);
    setMoveLog([]);
    setIsXNext(true);
    setGameStatus(Status.IDLE);
    setWinningLine(null);
    setWinner(null);
    setAiReasoning(null);
  }, [boardSize]);

  const handleModeChange = (mode: GameMode) => {
    if (gameMode !== mode) {
        setGameMode(mode);
        resetGame();
        
        // Update default names based on mode
        if (mode === 'VS_AI') {
            setPlayerXName('Player');
            setPlayerOName('Madhu');
        } else {
            setPlayerXName('Player 1');
            setPlayerOName('Player 2');
        }
    }
  };

  const handleDifficultyChange = (diff: Difficulty) => {
    if (difficulty !== diff) {
        setDifficulty(diff);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'DARK' ? 'LIGHT' : 'DARK');
  };

  const isDark = theme === 'DARK';
  const mainBg = isDark ? 'bg-slate-950' : 'bg-[#FDFBF7]'; // Ivory bg for light mode
  const titleColor = isDark ? 'text-white' : 'text-stone-800';
  const subTitleColor = isDark ? 'text-slate-400' : 'text-stone-500';
  const buttonGroupBg = isDark ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/80 border-stone-200/50 shadow-sm';
  const buttonActive = isDark ? 'bg-slate-700 text-white' : 'bg-stone-200 text-stone-800';
  const buttonInactive = isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 ${mainBg}`}>
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-500/5'}`}></div>
         <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] ${isDark ? 'bg-rose-500/10' : 'bg-rose-500/5'}`}></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center gap-6">
        
        {/* Top Right Controls */}
        <div className="absolute top-0 right-0 z-20 flex gap-2">
            <Tooltip content="Move History" position="bottom">
                <button 
                  onClick={() => setIsHistoryOpen(true)}
                  className={`p-2.5 rounded-xl border transition-all backdrop-blur-sm ${isDark ? 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-800' : 'bg-white/50 border-stone-200/50 text-stone-400 hover:text-stone-800 hover:bg-white'}`}
                  aria-label="Move History"
                >
                  <HistoryIcon className="w-5 h-5" />
                </button>
            </Tooltip>
            
            <Tooltip content="Settings" position="bottom">
                <button 
                onClick={() => setIsSettingsOpen(true)}
                className={`p-2.5 rounded-xl border transition-all backdrop-blur-sm ${isDark ? 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-800' : 'bg-white/50 border-stone-200/50 text-stone-400 hover:text-stone-800 hover:bg-white'}`}
                aria-label="Settings"
                >
                <Settings className="w-5 h-5" />
                </button>
            </Tooltip>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 mb-2">
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-lg flex items-center justify-center gap-3 ${titleColor}`}>
             {gameMode === 'VS_AI' ? (
                <Bot className="w-10 h-10 text-indigo-500" />
             ) : (
                <Users className="w-10 h-10 text-indigo-500" />
             )}
             <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-rose-400">
               Tic-Tac-Toe
             </span>
          </h1>
          <p className={`font-medium ${subTitleColor}`}>
             {gameMode === 'VS_AI' ? "Challenge Madhu's Brain" : "Play with a Friend"}
          </p>
        </div>

        {/* Controls Container */}
        <div className="flex flex-col gap-3 w-full max-w-sm">
            {/* Mode Selector */}
            <div className={`flex p-1 rounded-xl border backdrop-blur-sm ${buttonGroupBg}`}>
                <Tooltip content="Challenge the AI opponent" className="flex-1">
                  <button
                      onClick={() => handleModeChange('VS_AI')}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          gameMode === 'VS_AI' ? buttonActive : buttonInactive
                      }`}
                  >
                      <Bot className="w-4 h-4" />
                      AI Opponent
                  </button>
                </Tooltip>
                
                <Tooltip content="Play locally with a friend" className="flex-1">
                  <button
                      onClick={() => handleModeChange('VS_HUMAN')}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          gameMode === 'VS_HUMAN' ? buttonActive : buttonInactive
                      }`}
                  >
                      <Users className="w-4 h-4" />
                      Multiplayer
                  </button>
                </Tooltip>
            </div>
        </div>

        {/* Board */}
        <div className="relative mt-2">
             {/* Glow effect behind board */}
            <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-xl opacity-20 transition-opacity duration-500 ${gameStatus === Status.THINKING ? 'opacity-40 animate-pulse' : ''}`}></div>
            <Board
            squares={squares}
            onClick={handleSquareClick}
            winningLine={winningLine}
            disabled={gameStatus === Status.THINKING || gameStatus === Status.FINISHED || isResetting}
            isDraw={winner === 'Draw'}
            isResetting={isResetting}
            boardSize={boardSize}
            theme={theme}
            />
        </div>

        {/* Status & Controls */}
        <GameStatus
          status={gameStatus}
          winner={winner}
          isXNext={isXNext}
          aiReasoning={aiReasoning}
          onReset={resetGame}
          onUndo={handleUndo}
          canUndo={history.length > 0 && gameStatus !== Status.THINKING && !isResetting}
          gameMode={gameMode}
          playerXName={playerXName}
          playerOName={playerOName}
          showReasoning={aiReasoningEnabled}
          theme={theme}
        />

        {/* Settings Modal */}
        <SettingsModal 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)}
            soundEnabled={soundEnabled}
            thinkingSoundEnabled={thinkingSoundEnabled}
            aiReasoningEnabled={aiReasoningEnabled}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
            onToggleThinkingSound={() => setThinkingSoundEnabled(!thinkingSoundEnabled)}
            onToggleAiReasoning={() => setAiReasoningEnabled(!aiReasoningEnabled)}
            gameMode={gameMode}
            playerXName={playerXName}
            playerOName={playerOName}
            onUpdatePlayerXName={setPlayerXName}
            onUpdatePlayerOName={setPlayerOName}
            difficulty={difficulty}
            onUpdateDifficulty={handleDifficultyChange}
            boardSize={boardSize}
            onUpdateBoardSize={setBoardSize}
            theme={theme}
            onToggleTheme={toggleTheme}
        />

        {/* Move History Modal */}
        <MoveHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          moveLog={moveLog}
          boardSize={boardSize}
          playerXName={playerXName}
          playerOName={playerOName}
          gameMode={gameMode}
          theme={theme}
        />

      </div>
    </div>
  );
};

export default App;
